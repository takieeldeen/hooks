"use client";

import React, { ReactNode } from "react";
import WorkflowNode from "../../../components/workflow-node";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
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
  const { deleteElements } = useReactFlow();
  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };
  return (
    <WorkflowNode
      name={name}
      description={description}
      onSettings={onSettings}
      onDelete={handleDelete}
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
