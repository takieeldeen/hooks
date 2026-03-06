"use client";
import { NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseTriggerNode from "../base-trigger-node";
import DiscordTriggerDialog from "./discord-trigger-dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { Icon } from "@iconify/react";

function DiscordTriggerNode(props: NodeProps) {
  const [open, setOpen] = useState(false);
  const { status } = useNodeStatus(props.id);

  const handleOpenSettings = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <DiscordTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={<Icon icon="logos:discord-icon" className="size-6" />}
        name="Discord Trigger"
        description="On a Discord Message or Event"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default DiscordTriggerNode;
