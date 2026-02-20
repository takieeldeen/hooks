import { Edge, Node } from "@xyflow/react";

export interface Workflow {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  nodes: Node[];
  edges: Edge[];
}
