import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { useTriggerWorkflow } from "@/api/workflows";
import { useParams } from "next/navigation";

function EditorExecuteButton() {
  const { workflowId } = useParams() as any;
  const { mutateAsync: triggerWorkflow, isPending } = useTriggerWorkflow();
  return (
    <Button disabled={isPending} onClick={() => triggerWorkflow(workflowId)}>
      <PlayIcon />
      Execute Workflow
    </Button>
  );
}

export default EditorExecuteButton;
