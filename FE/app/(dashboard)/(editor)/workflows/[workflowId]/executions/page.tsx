import { UsersOnly } from "@/features/auth/auth-guards";
import EditorHeader from "@/features/editor/components/editor-header";
import EditorProvider from "@/features/editor/components/editor-provider";
import { ExecutionsTable } from "@/features/workflows/components/executions-table";
import { ExecutionStats } from "@/features/workflows/components/execution-stats";
import { Suspense } from "react";
import { EditorLoading } from "@/features/editor/components/editor-loading";
import { prefetchWorkflowDetails } from "@/api/workflows";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

async function HistoryPage({
  params,
}: PageProps<"/workflows/[workflowId]/executions">) {
  const { workflowId } = await params;
  const { queryClient } = await prefetchWorkflowDetails(workflowId);

  return (
    <UsersOnly>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<EditorLoading />}>
          <EditorProvider>
            <div className="flex flex-col h-full w-full">
              <EditorHeader workflowId={workflowId} />
              <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full">
                  <ExecutionStats workflowId={workflowId} />
                  <ExecutionsTable workflowId={workflowId} />
                </div>
              </main>
            </div>
          </EditorProvider>
        </Suspense>
      </HydrationBoundary>
    </UsersOnly>
  );
}

export default HistoryPage;
