"use client";
import { NodeProps } from "@xyflow/react";
import React from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import WorkflowNode from "./workflow-node";

function initialNode(props: NodeProps) {
  return (
    <WorkflowNode showToolbar={false}>
      <PlaceholderNode {...props}>
        <div className="cursor-pointer flex items-center justify-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
}

export default initialNode;
