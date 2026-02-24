import { NodeType } from "../../generated/prisma/enums";

export type WorkflowContext = Record<string, unknown>;

export interface ExecutorPayload<T = Record<string, unknown>> {
  data: T;
  nodeId: string;
  context: WorkflowContext;
}

// export type NodeExecutor<T = Record<string, unknown>> = (
//   params: ExecutorPayload<T>,
// ) => Promise<WorkflowContext>;

export type NodeExecutor<T extends NodeType> = (
  params: ExecutorPayload<NodeInputs[T]>,
) => Promise<WorkflowContext>;

export type ExecutorRegistry = { [K in NodeType]: NodeExecutor<K> };

export type NodeInputs = {
  HTTP_REQUEST: {
    variableName?: string;
    endpoint: string;
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    body?: string;
  };
  INITIAL: null;
  MANUAL_TRIGGER: null;
};
