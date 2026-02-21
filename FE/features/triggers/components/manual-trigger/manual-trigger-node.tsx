"use client";
import { NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import ManualTriggerDialog from "./manual-trigger-dialog";

function ManualTriggerNode(props: NodeProps) {
  const [open, setOpen] = useState(false);
  const nodeStatus = "initial";
  const handleOpenSettings = useCallback(() => {
    setOpen(true);
  }, []);
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default ManualTriggerNode;
