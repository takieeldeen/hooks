"use client";
import { NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import SlackTriggerDialog from "./slack-trigger-dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { Icon } from "@iconify/react";

function SlackTriggerNode(props: NodeProps) {
  const [open, setOpen] = useState(false);
  const { status } = useNodeStatus(props.id);

  const handleOpenSettings = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <SlackTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={<Icon icon="logos:slack-icon" className="size-6" />}
        name="Slack Trigger"
        description="On a Slack Message or Event"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default SlackTriggerNode;
