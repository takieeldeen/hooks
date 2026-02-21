"use client";
import { Node, NodeProps } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import BaseExecutionNode from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import HttpRequestDialog from "./http-request-dialog";

export type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

function HttpRequestNode(props: NodeProps<HttpRequestNodeType>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not Configured";
  const status = "initial";
  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);
  return (
    <>
      <HttpRequestDialog
        nodeData={nodeData}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nodeId={props.id}
      />
      <BaseExecutionNode
        {...props}
        status={status}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
}

export default HttpRequestNode;
