import { useGetWorkflows } from "@/api/workflows";
import { EntityPagination } from "@/components/EntityComponent";
import React from "react";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";

function WorkflowPagination() {
  const [searchParams, setSearchParams] = useWorkflowParams();
  const { data: workflows, isFetching } = useGetWorkflows(searchParams);
  return (
    <EntityPagination
      disabled={isFetching}
      totalPages={workflows?.totalPages ?? 0}
      page={workflows?.page ?? 1}
      onPageChange={(newPage) => {
        setSearchParams({ ...searchParams, page: newPage });
      }}
    />
  );
}

export default WorkflowPagination;
