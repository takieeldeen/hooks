"use client";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useEditor } from "./editor-provider";
import { useUpdateWorkflow } from "@/api/workflows";

function EditorSaveButton({ workflowId }: { workflowId: string }) {
  const { instance } = useEditor();
  const { mutateAsync: updateEditor, isPending } = useUpdateWorkflow();

  const handleSave = useCallback(() => {
    if (!instance) return;
    const nodes = instance.getNodes();
    const edges = instance.getEdges();
    updateEditor({ id: workflowId, nodes, edges });
  }, [instance, updateEditor, workflowId]);

  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        <SaveIcon className="size-4" />
        {isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export default EditorSaveButton;
