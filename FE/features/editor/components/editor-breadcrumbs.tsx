"use client";
import { useGetWorkflowDetails, useUpdateWorkflow } from "@/api/workflows";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

function EditorBreadcrumbs({ workflowId }: { workflowId: string }) {
  const { data } = useGetWorkflowDetails(workflowId);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/workflows" prefetch>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function EditorNameInput({ workflowId }: { workflowId: string }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [workflowName, setWorkflowName] = useState("");
  const { data } = useGetWorkflowDetails(workflowId);

  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: updateWorkflow, isPending } = useUpdateWorkflow();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorkflowName(data?.content?.name ?? "");
  }, [data?.content?.name]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      if (workflowName === data?.content?.name) {
        setIsEditing(false);
        return;
      }
      await updateWorkflow({
        ...(data!.content! ?? {}),
        id: workflowId,
        name: workflowName,
      });
    } catch {
      setWorkflowName(data?.content?.name ?? "");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isEditing) {
      handleSave();
    } else if (e.key === "Escape" && isEditing) {
      setIsEditing(false);
      setWorkflowName(data?.content?.name ?? "");
    }
  };

  if (isEditing)
    return (
      <Input
        disabled={isPending}
        id="name"
        name="name"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="h-7 w-auto min-w-[100px] px-2"
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    );
  return (
    <BreadcrumbItem
      className="cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {workflowName}
    </BreadcrumbItem>
  );
}

export default EditorBreadcrumbs;
