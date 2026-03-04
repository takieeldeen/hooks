"use client";
import { EntitySearch } from "@/components/EntityComponent";
import React from "react";
import { useCredentialsParams } from "../hooks/useCredentialsParams";
import { useEntitySearch } from "@/hooks/use-entity-search";

function CredentialsSearch() {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
}

export default CredentialsSearch;
