"use client";
import { ParamsOf } from "@/.next/dev/types/routes";
import { useGetWorkflowDetails } from "@/api/workflows";
import { useParams } from "next/navigation";
import React from "react";

function Editor() {
  const { workflowId } = useParams<ParamsOf<"/workflows/[workflowId]">>();
  const { data } = useGetWorkflowDetails(workflowId);
  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}

export default Editor;
