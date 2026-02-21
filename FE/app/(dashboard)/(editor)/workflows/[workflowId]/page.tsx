import { prefetchWorkflowDetails } from "@/api/workflows";
import { UsersOnly } from "@/features/auth/auth-guards";
import Editor from "@/features/editor/components/editor";
import EditorHeader from "@/features/editor/components/editor-header";
import { EditorLoading } from "@/features/editor/components/editor-loading";
import EditorProvider from "@/features/editor/components/editor-provider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

async function Page({ params }: PageProps<"/workflows/[workflowId]">) {
  const { workflowId } = await params;
  const { queryClient } = await prefetchWorkflowDetails(workflowId);
  return (
    <UsersOnly>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<EditorLoading />}>
          <EditorProvider>
            <EditorHeader workflowId={workflowId} />
            <main className="flex-1">
              <Editor />
            </main>
          </EditorProvider>
        </Suspense>
      </HydrationBoundary>
    </UsersOnly>
  );
}

export default Page;
