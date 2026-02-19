import { createWorkflow } from "@/api/workflows";
import { NotFoundView } from "@/components/EntityComponent";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

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
