import { EntitySearch } from "@/components/EntityComponent";
import React from "react";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";
import { useEntitySearch } from "@/hooks/use-entity-search";

function WorkflowsSearch() {
  const [params, setParams] = useWorkflowParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
}

export default WorkflowsSearch;
