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

export type ExecutionStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  trigger: string;
  status: ExecutionStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  creditsConsumed: number;
}
