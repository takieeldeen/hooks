"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import DiscordDialog from "./discord-message-dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { Icon } from "@iconify/react";

export type DiscordMessageNodeData = {
  variableName?: string;
  webhookUrl?: string;
  message?: string;
  username?: string;
  [key: string]: unknown;
};

type DiscordMessageNodeType = Node<DiscordMessageNodeData>;

function DiscordMessageNode(props: NodeProps<DiscordMessageNodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useNodeStatus(props.id);
  const nodeData = props.data;
  const description = nodeData?.message
    ? `Send Discord Message: ${nodeData.message.slice(0, 50)}...`
    : "Not Configured";
  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return (
    <>
      <DiscordDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={<Icon icon="logos:discord-icon" className="size-6" />}
        name="Discord Message"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default DiscordMessageNode;
