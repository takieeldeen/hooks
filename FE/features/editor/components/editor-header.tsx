import { SidebarTrigger } from "@/components/ui/sidebar";
import EditorBreadcrumbs from "./editor-breadcrumbs";
import EditorSaveButton from "./editor-save-button";

function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b mb-2">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-row items-center justify-between gap-x-4 w-full ">
          <EditorBreadcrumbs workflowId={workflowId} />
          <EditorSaveButton workflowId={workflowId} />
        </div>
      </div>
    </header>
  );
}

export default EditorHeader;
