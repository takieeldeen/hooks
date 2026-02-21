"use client";
import { NodeProps } from "@xyflow/react";
import React from "react";
import BaseTriggerNode from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";

function ManualTriggerNode(props: NodeProps) {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        // status={nodeStatus}
        onSettings={() => {}}
        onDoubleClick={() => {}}
      />
    </>
  );
}

export default ManualTriggerNode;
