"use client";

import { ReactNode } from "react";
import { EntityContainer } from "@/components/EntityComponent";
import { CredentialsHeader } from "./credentials-header";
import CredentialsSearch from "./credentials-search";
import CredentialsPagination from "./credentials-pagination";

export function CredentialsContainer({ children }: { children: ReactNode }) {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
}
