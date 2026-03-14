import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { AppError } from "../controllers/error.controller";
import { prisma } from "../lib/prisma";
import { registerJob } from "../utilis/backgroundJobs/backgroundJobs";
import { EXECUTOR_REGISTRY } from "../utilis/executions/executorRegistry";
import { topologicalSort } from "../utilis/topoSort";
import WorkflowExecutionService from "./execution.service";
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

  const execution = await WorkflowExecutionService.create({
    workflowId,
    userId: userId!,
    status: "RUNNING",
    trigger: "MANUAL_TRIGGER",
    startedAt: new Date(),
  });

  const context: Record<string, any> = initialData || {};
  const jar = new CookieJar();
  const axiosInstance = axios.create({
    withCredentials: true,
    jar,
  } as any) as any;

  const functionContext: Record<string, any> = {
    axios: wrapper(axiosInstance),
  };

  for (const node of sortedArr) {
    const executor = EXECUTOR_REGISTRY[node.type];

    registerJob(
      workflow.userId,
      workflowId,
      execution.id,
      `node:${node.type}:${node.id}`,
      executor,
      {
        nodeId: node.id,
        context,
        data: node.data as any,
        functionContext,
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
