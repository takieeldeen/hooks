"use client";

import { EntityList, NotFoundView } from "@/components/EntityComponent";
import { CredentialItem } from "./credential-item";
import { CredentialsEmpty } from "./credential-empty";
import { CredentialsLoading } from "./credential-loading";
import { CredentialsError } from "./credential-error";
import { useGetCredentials, useRemoveCredential } from "@/api/credentials";
import { useCredentialsParams } from "../hooks/useCredentialsParams";
import { CredentialType } from "@/types/credentials";
import { useState } from "react";
import { CredentialForm } from "./credential-form";

export function CredentialsListView() {
  const [params, setParams] = useCredentialsParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<
    { id: string; name: string; type: CredentialType } | undefined
  >(undefined);

  const { data, isFetching, isError, refetch, queryKey } = useGetCredentials({
    page: params.page,
    pageSize: params.pageSize,
    name: params.name,
  });

  const { mutate: removeCredential, isPending: isRemoving } =
    useRemoveCredential(queryKey);

  const onOpen = (
    id?: string,
    data?: { name: string; type: CredentialType },
  ) => {
    if (id && data) {
      setSelectedCredential({ id, ...data });
    } else {
      setSelectedCredential(undefined);
    }
    setIsSheetOpen(true);
  };

  const onClose = () => {
    setIsSheetOpen(false);
    setSelectedCredential(undefined);
  };

  if (isFetching) return <CredentialsLoading />;
  if (isError) return <CredentialsError onRetry={() => refetch()} />;

  const credentials = data?.content || [];
  const isEmpty = (data?.isEmpty ?? credentials.length === 0) && !params.name;
  const isNotFound =
    (data?.isEmpty ?? credentials.length === 0) && !!params.name;

  return (
    <>
      <EntityList
        items={credentials}
        renderItem={(item) => (
          <CredentialItem
            credential={item}
            onRemove={() => removeCredential(item.id)}
            isRemoving={isRemoving}
            onEdit={() => onOpen(item.id, { name: item.name, type: item.type })}
          />
        )}
        isEmpty={isEmpty}
        emptyView={<CredentialsEmpty onNew={() => onOpen()} />}
        notFound={isNotFound}
        notFoundView={
          <NotFoundView onReset={() => setParams({ name: "", page: 1 })} />
        }
      />
      <CredentialForm
        open={isSheetOpen}
        onClose={onClose}
        defaultValues={selectedCredential}
      />
    </>
  );
}
