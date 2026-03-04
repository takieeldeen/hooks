"use client";

import { EntityHeader } from "@/components/EntityComponent";
import React, { useState } from "react";
import { CredentialForm } from "./credential-form";

export function CredentialsHeader({ disabled }: { disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Manage your API keys and credentials"
        onNew={() => setIsOpen(true)}
        newButtonLabel="Add Credential"
        disabled={disabled}
      />
      <CredentialForm open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
