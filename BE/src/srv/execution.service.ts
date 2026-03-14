import { AppError } from "../controllers/error.controller";
import { WorkflowExecution } from "../generated/prisma/client";
import { catchAsync } from "../lib/errors";
import { prisma } from "../lib/prisma";

const getAll = async (workflowId: string, userId?: string) => {
  try {
    const executions = await prisma.workflowExecution.findMany({
      where: {
        workflowId,
        userId,
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

const WorkflowExecutionService = { getAll, create };

export default WorkflowExecutionService;
