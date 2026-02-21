import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

function EditorAddNodeButton() {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon" variant="outline" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
    // </ViewportPortal>
  );
}

export default EditorAddNodeButton;
