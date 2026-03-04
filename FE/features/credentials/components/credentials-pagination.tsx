"use client";
import { useGetCredentials } from "@/api/credentials";
import { EntityPagination } from "@/components/EntityComponent";
import React from "react";
import { useCredentialsParams } from "../hooks/useCredentialsParams";

function CredentialsPagination() {
  const [searchParams, setSearchParams] = useCredentialsParams();
  const { data: credentials, isFetching } = useGetCredentials({
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    name: searchParams.name,
  });

  return (
    <EntityPagination
      disabled={isFetching}
      totalPages={credentials?.totalPages ?? 0}
      page={credentials?.page ?? 1}
      onPageChange={(newPage) => {
        setSearchParams({ page: newPage });
      }}
    />
  );
}

export default CredentialsPagination;
