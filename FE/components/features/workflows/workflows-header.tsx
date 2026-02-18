"use client";
import { useCreateWorkflow } from "@/api/workflows";
import { EntityHeader } from "@/components/EntityCard";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

export function WorkflowsHeader({ disabled }: { disabled?: boolean }) {
  const { mutate: createWorkflow, isPending: isCreating } = useCreateWorkflow();
  const { modal, handleError } = useUpgradeModal();
  const router = useRouter();
  const handleCreate = useCallback(() => {
    createWorkflow(
      { name: "New Workflow" },
      {
        onSuccess: (data, res) => {
          console.log(data, res);
          router.push(`/workflows/${data.content.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      },
    );
  }, [createWorkflow, router, handleError]);
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and Manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={isCreating}
      />
    </>
  );
}
