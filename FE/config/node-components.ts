import initialNode from "@/components/initialNode";

type NodeType = "INITIAL";

export const nodeComponents: Record<NodeType, any> = {
  INITIAL: initialNode,
};
