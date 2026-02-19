import { useGetWorkflows, useRemoveWorkflow } from "@/api/workflows";
import { EntityItem } from "@/components/EntityComponent";
import { Workflow } from "@/types/workflows";
import { WorkflowIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";

function WorkflowItem({ workflow }: { workflow: Workflow }) {
  const [searchParams] = useWorkflowParams();
  const { queryKey } = useGetWorkflows(searchParams);
  const { mutateAsync, isPending } = useRemoveWorkflow(queryKey);
  const handleRemove = useCallback(async () => {
    await mutateAsync(workflow.id);
  }, [mutateAsync, workflow.id]);
  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={<>UPDATED TODO &bull; CREATED TODO </>}
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={isPending}
    />
  );
}

export default WorkflowItem;
