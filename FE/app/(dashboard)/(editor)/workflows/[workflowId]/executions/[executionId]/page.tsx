import { UsersOnly } from "@/features/auth/auth-guards";
import EditorHeader from "@/features/editor/components/editor-header";
import EditorProvider from "@/features/editor/components/editor-provider";
import { Suspense } from "react";
import { EditorLoading } from "@/features/editor/components/editor-loading";
import { ExecutionViewer } from "@/features/workflows/components/execution-viewer";

async function ExecutionDetailsPage({
  params,
}: PageProps<"/workflows/[workflowId]/executions/[executionId]">) {
  const { workflowId, executionId } = await params;
  // const { queryClient } = await prefetchWorkflowExecution(
  //   workflowId,
  //   executionId,
  // );

  return (
    <UsersOnly>
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <Suspense fallback={<EditorLoading />}>
        <EditorProvider>
          <div className="flex flex-col h-full w-full">
            <EditorHeader workflowId={workflowId} />
            <main className="flex-1 overflow-hidden flex">
              <ExecutionViewer
                workflowId={workflowId}
                executionId={executionId}
              />
            </main>
          </div>
        </EditorProvider>
      </Suspense>
      {/* </HydrationBoundary> */}
    </UsersOnly>
  );
}

export default ExecutionDetailsPage;
