import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

function EditorAddNodeButton() {
  return (
    // <ViewportPortal>
    <Button size="icon" variant="outline" className="bg-background">
      <PlusIcon className="size-4" />
    </Button>
    // </ViewportPortal>
  );
}

export default EditorAddNodeButton;
