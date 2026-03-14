"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import EditorBreadcrumbs from "./editor-breadcrumbs";
import EditorSaveButton from "./editor-save-button";
import { buttonVariants } from "@/components/ui/button";
import { History, PlayCircle, SquarePen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function EditorHeader({ workflowId }: { workflowId: string }) {
  const pathname = usePathname();

  const executionMatch = pathname.match(/\/executions\/([^\/]+)/);
  const executionId = executionMatch ? executionMatch[1] : null;

  const isEditor = pathname === `/workflows/${workflowId}`;
  const isHistory = pathname === `/workflows/${workflowId}/history`;
  const isExecution = executionId !== null;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b  dark:bg-neutral-900">
      <div className="flex items-center px-4 w-full justify-between gap-2 overflow-x-auto">
        <div className="flex flex-row items-center gap-2 flex-1 shrink-0 overflow-hidden">
          <SidebarTrigger className="-ml-1 shrink-0" />
          <div className="hidden sm:block truncate">
            <EditorBreadcrumbs workflowId={workflowId} />
          </div>
        </div>

        <div className="flex bg-muted/50 dark:bg-muted p-1 rounded-lg items-center gap-1 shrink-0">
          <Link
            href={`/workflows/${workflowId}`}
            className={cn(
              buttonVariants({
                variant: isEditor ? "secondary" : "ghost",
                size: "sm",
              }),
              "transition-all",
              isEditor &&
                "shadow-sm dark:bg-white dark:text-background bg-background",
            )}
          >
            <SquarePen className="size-4" />
            <span className="hidden md:inline">Editor</span>
          </Link>
          <Link
            href={`/workflows/${workflowId}/history`}
            className={cn(
              buttonVariants({
                variant: isHistory ? "secondary" : "ghost",
                size: "sm",
              }),
              "transition-all",
              isHistory &&
                "shadow-sm dark:bg-white dark:text-background bg-background",
            )}
          >
            <History className="size-4" />
            <span className="hidden md:inline">History</span>
          </Link>
          {executionId && (
            <Link
              href={`/workflows/${workflowId}/executions/${executionId}`}
              className={cn(
                buttonVariants({
                  variant: isExecution ? "secondary" : "ghost",
                  size: "sm",
                }),
                "transition-all",
                isExecution &&
                  "shadow-sm dark:bg-white dark:text-background bg-background",
              )}
            >
              <PlayCircle className="size-4" />
              <span className="hidden md:inline">Execution</span>
            </Link>
          )}
        </div>

        <div className="flex items-center justify-end flex-1 shrink-0">
          <EditorSaveButton workflowId={workflowId} />
        </div>
      </div>
    </header>
  );
}

export default EditorHeader;
