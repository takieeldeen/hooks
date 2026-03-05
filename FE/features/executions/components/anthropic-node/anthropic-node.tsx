"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import AnthropicDialog, {
  ANTHROPIC_AVAILABLE_MODELS,
} from "./anthropic-dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { Icon } from "@iconify/react";

export type AnthropicNodeData = {
  variableName?: string;
  credentialId: string;
  model?: (typeof ANTHROPIC_AVAILABLE_MODELS)[number];
  userPrompt: string;
  systemPrompt: string;
  body?: string;
  [key: string]: unknown;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

function AnthropicNode(props: NodeProps<AnthropicNodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useNodeStatus(props.id);
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || ANTHROPIC_AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return (
    <>
      <AnthropicDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={<Icon icon="simple-icons:anthropic" className="size-6" />}
        name="Anthropic"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default AnthropicNode;
