"use client";
import { WorkflowsHeader } from "./workflows-header";
import { EntityContainer } from "@/components/EntityCard";
import { ReactNode } from "react";

export function WorkflowsContainer({ children }: { children: ReactNode }) {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
}
