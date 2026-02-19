"use client";
import { WorkflowsHeader } from "./workflows-header";
import {
  EmptyViews,
  EntityContainer,
  LoadingView,
  NotFoundView,
} from "@/components/EntityComponent";
import { ReactNode, useCallback } from "react";
import WorkflowsSearch from "./workflows-search";
import WorkflowPagination from "./workflow-pagination";
import { createWorkflow } from "@/api/workflows";
import { useRouter } from "next/navigation";

export function WorkflowsContainer({ children }: { children: ReactNode }) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
}

export function WorkflowsLoading() {
  return <LoadingView entity="Workflows" message="Loading Workflows..." />;
}

export function WorkflowsEmpty() {
  // const createWorkflow = useCreateWorkflow();
  // const {handleError}
  const handleCreate = useCallback(async () => {
    await createWorkflow({ name: "Created Workflow" });
  }, []);
  return (
    <>
      <EmptyViews
        message="You Haven't created any workflows yet. Get started by creating your first workflow"
        onNew={handleCreate}
      />
    </>
  );
}
export function WorkflowsNotFound() {
  const router = useRouter();

  const handleReset = useCallback(async () => {
    await createWorkflow({ name: "Created Workflow" });
    router.replace("/workflows");
  }, [router]);

  return (
    <>
      <NotFoundView
        message="We didn't find any items matching your filters criteria. You can reset filters to check all workflows"
        onReset={handleReset}
      />
    </>
  );
}
