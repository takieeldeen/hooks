"use client";
import { Node } from "@xyflow/react";
import React from "react";
import BaseExecutionNode from "../base-execution-node";
import { GlobeIcon } from "lucide-react";

type HttpRequestNodeData = {
  endpoint?: string;
  methods?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

function HttpRequestNode(props: HttpRequestNodeType) {
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endpoint
    ? `${nodeData.methods || "GET"}: ${nodeData.endpoint}`
    : "Not Configured";
  return (
    <>
      <BaseExecutionNode
        {...(props as any)}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={() => {}}
        onDoubleClick={() => {}}
      />
    </>
  );
}

export default HttpRequestNode;
