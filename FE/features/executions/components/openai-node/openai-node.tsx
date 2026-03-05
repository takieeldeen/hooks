"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import OpenAIDialog, { OPENAI_AVAILABLE_MODELS } from "./openai-dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { Icon } from "@iconify/react";

export type OpenAINodeData = {
  variableName?: string;
  credentialId: string;
  model?: (typeof OPENAI_AVAILABLE_MODELS)[number];
  userPrompt: string;
  systemPrompt: string;
  body?: string;
  [key: string]: unknown;
};

type OpenAINodeType = Node<OpenAINodeData>;

function OpenAINode(props: NodeProps<OpenAINodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useNodeStatus(props.id);
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || OPENAI_AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return (
    <>
      <OpenAIDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={<Icon icon="simple-icons:openai" className="size-6" />}
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default OpenAINode;
