import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ManualTriggerDialog({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Manual Trigger</SheetTitle>
          <SheetDescription>
            Configure settings for the manual trigger node
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This trigger will start the workflow when you click the button.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ManualTriggerDialog;
