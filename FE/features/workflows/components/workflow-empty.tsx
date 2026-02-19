import { createWorkflow } from "@/api/workflows";
import { EmptyViews } from "@/components/EntityComponent";
import { useCallback } from "react";

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
