import { prefetchWorkflows } from "@/api/workflows";
import { UsersOnly } from "@/features/auth/auth-guards";
import WorkflowsListView from "@/features/workflows/components/workflows-list-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { WorkflowsContainer } from "@/features/workflows/components/workflows-container";
import { loadSearchParams } from "@/features/workflows/params";

async function Page({ searchParams }: PageProps<"/workflows">) {
  const workflowParams = await loadSearchParams(searchParams);
  const { queryClient } = await prefetchWorkflows(workflowParams);
  return (
    <UsersOnly>
      <WorkflowsContainer>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsListView />
          </Suspense>
        </HydrationBoundary>
      </WorkflowsContainer>
    </UsersOnly>
  );
}

export default Page;
