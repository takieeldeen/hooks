import { AppError } from "../controllers/errorController";
import { prisma } from "../lib/prisma";
import { registerJob } from "../utilis/backgroundJobs/backgroundJobs";
import { EXECUTOR_REGISTRY } from "../utilis/executions/executorRegistry";
import { topologicalSort } from "../utilis/topoSort";
async function executeWorkflow(
  workflowId: string,
  initialData: any,
  userId?: string,
) {
  // 1. Get the workflow using workflowId (Including Nodes and Connections)
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: { id: workflowId, userId },
    include: { nodes: true, connections: true },
  });

  // 2. Sort the nodes topologically
  const { sortedArr, hasCycle } = topologicalSort(
    workflow.nodes,
    workflow.connections,
  );

  // 3. Protect against cyclic workflows
  if (hasCycle) throw new AppError(400, "WORKFLOW_CONTAINS_CYCLE");

  // 4. Validate that every node has a known executor before queuing
  for (const node of sortedArr) {
    if (!EXECUTOR_REGISTRY[node.type]) {
      throw new AppError(400, "UNKOWN_NODE_TYPE");
    }
  }

  const context: Record<string, any> = initialData || {};
  for (const node of sortedArr) {
    const executor = EXECUTOR_REGISTRY[node.type];

    registerJob(
      workflow.userId,
      workflowId,
      `node:${node.type}:${node.id}`,
      executor,
      {
        nodeId: node.id,
        context,
        data: node.data as any,
      },
    );
  }

  return context;
}

async function deleteWorkflow(workflowId: string, userId: string) {
  return await prisma.workflow.delete({
    where: {
      id: workflowId,
      userId,
    },
  });
}

const WorkflowService = {
  execute: executeWorkflow,
  delete: deleteWorkflow,
};

export default WorkflowService;
