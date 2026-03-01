"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import GeminiDialog, { GEMINI_AVAILABLE_MODELS } from "./gemini-dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { Icon } from "@iconify/react";

export type GeminiNodeData = {
  variableName?: string;
  model?: (typeof GEMINI_AVAILABLE_MODELS)[number];
  userPrompt: string;
  systemPrompt: string;
  body?: string;
  [key: string]: unknown;
};

type GeminiNodeType = Node<GeminiNodeData>;

function GeminiNode(props: NodeProps<GeminiNodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { status } = useNodeStatus(props.id);
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || GEMINI_AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not Configured";
  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return (
    <>
      <GeminiDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={<Icon icon="material-icon-theme:gemini-ai" className="size-6" />}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default GeminiNode;
