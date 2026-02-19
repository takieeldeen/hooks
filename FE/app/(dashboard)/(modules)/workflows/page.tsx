import { prefetchWorkflows } from "@/api/workflows";
import { UsersOnly } from "@/features/auth/auth-guards";
import WorkflowsListView from "@/features/workflows/components/workflows-list-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  WorkflowsContainer,
  WorkflowsLoading,
} from "@/features/workflows/components/workflows-container";
import { loadSearchParams } from "@/features/workflows/params";

async function Page({ searchParams }: PageProps<"/workflows">) {
  const workflowParams = await loadSearchParams(searchParams);
  const { queryClient, query } = await prefetchWorkflows(workflowParams);
  return (
    <UsersOnly
      key={`${workflowParams.page}-${workflowParams.pageSize}-${workflowParams.name}`}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<WorkflowsLoading />}>
          <WorkflowsContainer>
            <WorkflowsListView />
          </WorkflowsContainer>
        </Suspense>
      </HydrationBoundary>
    </UsersOnly>
  );
}

export default Page;
