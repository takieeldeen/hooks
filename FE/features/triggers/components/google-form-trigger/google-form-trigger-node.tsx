"use client";
import { NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import ManualTriggerDialog from "./google-form-trigger-dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { Icon } from "@iconify/react";

function GoogleFormTriggerNode(props: NodeProps) {
  const [open, setOpen] = useState(false);
  const { status } = useNodeStatus(props.id);

  const handleOpenSettings = useCallback(() => {
    setOpen(true);
  }, []);
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={
          <Icon
            icon="simple-icons:googleforms"
            className="size-6 text-indigo-700"
          />
        }
        name="Google Form"
        description="When Google Form is Submitted"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default GoogleFormTriggerNode;
