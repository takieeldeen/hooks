"use client";

import React, { ReactNode } from "react";
import WorkflowNode from "../../../components/workflow-node";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
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

interface BaseTriggerNodeProps extends NodeProps {
  icon: ReactNode;
  name: string;
  description?: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings: VoidFunction;
  onDoubleClick?: VoidFunction;
}

function BaseTriggerNode({
  id,
  icon: Icon,
  name,
  description,
  children,
  status = "initial",
  onSettings,
  onDoubleClick,
}: BaseTriggerNodeProps) {
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
        className="rounded-l-2xl"
      >
        <BaseNode
          onDoubleClick={onDoubleClick}
          className="rounded-l-2xl relative group"
          status={status}
        >
          <BaseNodeContent>
            {Icon}

            {children}
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
}

export default BaseTriggerNode;
