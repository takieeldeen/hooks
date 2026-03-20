import { AppError } from "../controllers/error.controller";
import { WorkflowExecution } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { topologicalSort } from "../utilis/topoSort";

const getAll = async (workflowId: string, userId?: string) => {
  try {
    const executions = await prisma.workflowExecution.findMany({
      where: {
        workflowId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return executions;
  } catch {
    throw new AppError(400, "EXECUTIONS_FETCHING_FAILED");
  }
};

const create = async (
  workflowExecution: Omit<
    WorkflowExecution,
    "id" | "createdAt" | "completedAt"
  >,
) => {
  try {
    const execution = await prisma.workflowExecution.create({
      data: workflowExecution,
    });
    return execution;
  } catch {
    throw new AppError(400, "EXECUTIONS_CREATION_FAILED");
  }
};

const getExecution = async (executionId: string, userId?: string) => {
  try {
    const execution = await prisma.workflowExecution.findFirst({
      where: {
        id: executionId,
        userId,
      },
      include: {
        workflow: {
          include: {
            connections: true,
          },
        },
        nodeExecutions: {
          include: {
            logs: true,
            node: true,
          },
        },
      },
    });

    if (!execution) {
      throw new AppError(404, "EXECUTION_NOT_FOUND");
    }

    // --- Topological Sort for nodeExecutions using the utility ---
    const nodeExecutions = execution.nodeExecutions;
    const connections = execution.workflow.connections;

    // Get all unique nodes mentioned in the nodeExecutions
    const nodes = nodeExecutions.map((ne) => ne.node);

    // Run the sorting utility provided by the user
    const { sortedArr } = topologicalSort(nodes, connections);

    // Map the nodeExecutions based on the sorted node IDs
    const nodeExMap = new Map(nodeExecutions.map((ne) => [ne.nodeId, ne]));
    const sortedNodeExecutions = sortedArr
      .map((node) => nodeExMap.get(node.id))
      .filter((ne): ne is (typeof nodeExecutions)[number] => ne !== undefined);

    // Keep any nodeExecutions that might be outside the main topological chain
    const sortedNodeIds = new Set(sortedArr.map((n) => n.id));
    nodeExecutions.forEach((ne) => {
      if (!sortedNodeIds.has(ne.nodeId)) {
        sortedNodeExecutions.push(ne);
      }
    });

    return {
      ...execution,
      nodeExecutions: sortedNodeExecutions,
    };
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    console.log(err);
    throw new AppError(400, "EXECUTION_FETCHING_FAILED");
  }
};

const WorkflowExecutionService = { getAll, create, getExecution };

export default WorkflowExecutionService;
