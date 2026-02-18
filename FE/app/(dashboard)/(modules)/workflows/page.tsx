import { prefetchWorkflows } from "@/api/workflows";
import { UsersOnly } from "@/components/features/auth/auth-guards";
import WorkflowsListView from "@/components/features/workflows/workflows-list-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { WorkflowsContainer } from "@/components/features/workflows/workflows-container";

async function Page() {
  const { queryClient } = await prefetchWorkflows();
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
