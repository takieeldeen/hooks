export type WorkflowContext = Record<string, unknown>;

export interface ExecutorPayload<T = Record<string, unknown>> {
  data: T;
  nodeId: string;
  context: WorkflowContext;
}

export type NodeExecutor<T = Record<string, unknown>> = (
  params: ExecutorPayload<T>,
) => Promise<WorkflowContext>;
