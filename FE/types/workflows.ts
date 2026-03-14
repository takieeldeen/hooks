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
  nodeExecutions?: NodeExecution[];
}

export type NodeExecutionStatus = "IDLE" | "RUNNING" | "SUCCESS" | "FAILED";

export type LogLevel = "WARNING" | "ERROR" | "INFO";

export interface NodeExecutionLog {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  nodeExecutionId: string;
}

export interface NodeExecution {
  id: string;
  status: NodeExecutionStatus;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  logs: NodeExecutionLog[];
  startedAt?: Date;
  completedAt?: Date;
  workflowExecutionId: string;
  nodeId: string;
  node?: { id: string; name: string; type: string };
}
