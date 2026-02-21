import initialNode from "@/components/initialNode";

export type NodeType = "INITIAL";

export const nodeComponents: Record<NodeType, any> = {
  INITIAL: initialNode,
};
