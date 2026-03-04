import { useGetWorkflows, useRemoveWorkflow } from "@/api/workflows";
import { EntityItem } from "@/components/EntityComponent";
import { Workflow } from "@/types/workflows";
import { WorkflowIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import React, { useCallback, useMemo } from "react";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";

function WorkflowItem({ workflow }: { workflow: Workflow }) {
  const [searchParams] = useWorkflowParams();
  const { queryKey } = useGetWorkflows(searchParams);
  const { mutateAsync, isPending } = useRemoveWorkflow(queryKey);

  const datesFormatted = useMemo(() => {
    const updated = formatDistanceToNow(new Date(workflow.updatedAt), {
      addSuffix: true,
    });
    const created = format(new Date(workflow.createdAt), "dd MMM yyyy");
    return { updated, created };
  }, [workflow.updatedAt, workflow.createdAt]);

  const handleRemove = useCallback(async () => {
    await mutateAsync(workflow.id);
  }, [mutateAsync, workflow.id]);

  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Updated {datesFormatted.updated} &bull; Created on{" "}
          {datesFormatted.created}
        </>
      }
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
