"use client";
import { WorkflowsHeader } from "./workflows-header";
import { EntityContainer } from "@/components/EntityComponent";
import { ReactNode } from "react";
import WorkflowsSearch from "./workflows-search";
import WorkflowPagination from "./workflow-pagination";

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
