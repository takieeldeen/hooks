"use client";
import { NodeProps } from "@xyflow/react";
import React, { useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import WorkflowNode from "./workflow-node";
import { NodeSelector } from "./node-selector";

function InitialNode(props: NodeProps) {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
}

export default InitialNode;
