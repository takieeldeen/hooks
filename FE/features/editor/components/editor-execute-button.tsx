import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { useTriggerWorkflow } from "@/api/workflows";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";

function EditorExecuteButton() {
  const { workflowId } = useParams() as any;
  const router = useRouter();
  const { mutateAsync: triggerWorkflow, isPending } = useTriggerWorkflow();

  const handleTriggerWorkflow = useCallback(async () => {
    const data = await triggerWorkflow(workflowId);
    const { executionId } = data;
    router.push(`/workflows/${workflowId}/executions/${executionId}`);
  }, [router, triggerWorkflow, workflowId]);
  return (
    <Button disabled={isPending} onClick={handleTriggerWorkflow}>
      <PlayIcon />
      Execute Workflow
    </Button>
  );
}

export default EditorExecuteButton;
