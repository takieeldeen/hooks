import initialNode from "@/components/initialNode";
import HttpRequestNode from "@/features/executions/components/http-request/HttpRequestNode";
import ManualTriggerNode from "@/features/triggers/components/manual-trigger/manual-trigger-node";

export type NodeType = "INITIAL" | "MANUAL_TRIGGER" | "HTTP_REQUEST";

export const nodeComponents: Record<NodeType, any> = {
  INITIAL: initialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
};
