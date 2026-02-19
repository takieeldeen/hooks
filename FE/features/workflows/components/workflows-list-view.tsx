"use client";
import { useGetWorkflows } from "@/api/workflows";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";

function WorkflowsListView() {
  const [workflowParams] = useWorkflowParams();
  const { data } = useGetWorkflows(workflowParams);

  return (
    <div className="flex-1 flex justify-center items-center">
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}

export default WorkflowsListView;
