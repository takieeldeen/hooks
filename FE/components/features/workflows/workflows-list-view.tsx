"use client";
import { useGetWorkflows } from "@/api/workflows";

function WorkflowsListView() {
  const { data } = useGetWorkflows();

  return (
    <div className="flex-1 flex justify-center items-center">
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}

export default WorkflowsListView;
