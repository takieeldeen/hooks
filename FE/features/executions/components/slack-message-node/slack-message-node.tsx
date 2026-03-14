"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import SlackDialog from "./slack-message-dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { Icon } from "@iconify/react";

export type SlackMessageNodeData = {
  connectionId?: string;
  serverId?: string;
  channelId?: string;
  variableName?: string;
  webhookUrl?: string;
  message?: string;
  username?: string;
  [key: string]: unknown;
};

type SlackMessageNodeType = Node<SlackMessageNodeData>;

function SlackMessageNode(props: NodeProps<SlackMessageNodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useNodeStatus(props.id);
  const nodeData = props.data;
  const description = nodeData?.message
    ? `Send Slack Message: ${nodeData.message.slice(0, 50)}...`
    : "Not Configured";
  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return (
    <>
      <SlackDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={<Icon icon="logos:slack-icon" className="size-6" />}
        name="Slack Message"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default SlackMessageNode;
