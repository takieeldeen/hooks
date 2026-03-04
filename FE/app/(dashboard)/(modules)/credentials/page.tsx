import { prefetchCredentials } from "@/api/credentials";
import { UsersOnly } from "@/features/auth/auth-guards";
import { CredentialsListView } from "@/features/credentials/components/credentials-list-view";
import { CredentialsContainer } from "@/features/credentials/components/credentials-container";
import { loadSearchParams } from "@/features/credentials/params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { CredentialsLoading } from "@/features/credentials/components/credential-loading";

async function Page({ searchParams }: any) {
  const credentialsParams = await loadSearchParams(searchParams);
  const { queryClient } = await prefetchCredentials(credentialsParams);

  return (
    <UsersOnly
      key={`${credentialsParams.page}-${credentialsParams.pageSize}-${credentialsParams.name}`}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CredentialsLoading />}>
          <CredentialsContainer>
            <CredentialsListView />
          </CredentialsContainer>
        </Suspense>
      </HydrationBoundary>
    </UsersOnly>
  );
}

export default Page;
