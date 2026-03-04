"use client";

import React, { ReactNode } from "react";
import WorkflowNode from "../../../components/workflow-node";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { createId } from "@paralleldrive/cuid2";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
  icon: ReactNode;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings: VoidFunction;
  onDoubleClick?: VoidFunction;
}

function BaseExecutionNode({
  id,
  icon: Icon,
  name,
  description,
  children,
  onSettings,
  status,
  onDoubleClick,
}: BaseExecutionNodeProps) {
  const { deleteElements, getNodes, setNodes } = useReactFlow();
  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };
  const handleDuplicate = () => {
    const nodes = getNodes();
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    const newNode = {
      ...node,
      id: createId(),
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20,
      },
      selected: true,
    };

    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false })).concat(newNode),
    );
  };
  return (
    <WorkflowNode
      name={name}
      description={description}
      onSettings={onSettings}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
    >
      <NodeStatusIndicator
        status={status}
        variant="border"
        // className="rounded-r-2xl"
      >
        <BaseNode onDoubleClick={onDoubleClick} status={status}>
          <BaseNodeContent>
            {Icon}
            {children}
            <BaseHandle id="target-1" type="target" position={Position.Left} />
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
}

export default BaseExecutionNode;
