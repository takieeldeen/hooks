import { AppError } from "../controllers/error.controller";
import { WorkflowExecution } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

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
        nodeExecutions: {
          include: {
            logs: true,
            node: true,
          },
          orderBy: {
            startedAt: "asc",
          },
        },
      },
    });
    console.log(execution);
    if (!execution) {
      throw new AppError(404, "EXECUTION_NOT_FOUND");
    }

    return execution;
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(400, "EXECUTION_FETCHING_FAILED");
  }
};

const WorkflowExecutionService = { getAll, create, getExecution };

export default WorkflowExecutionService;
