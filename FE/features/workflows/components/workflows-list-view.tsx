"use client";
import { useGetWorkflows } from "@/api/workflows";
import { useWorkflowParams } from "../hooks/useWorkflowsParams";
import { EntityList, NotFoundView } from "@/components/EntityComponent";
import WorkflowItem from "./workflow-item";
import { WorkflowsLoading } from "./workflow-loading";
import { WorkflowsEmpty } from "./workflow-empty";
import { WorkflowsNotFound } from "./workflow-error";

function WorkflowsListView() {
  const [workflowParams] = useWorkflowParams();
  const { data, isFetching } = useGetWorkflows(workflowParams);
  console.log(data?.canReset, data?.isEmpty);
  if (isFetching) return <WorkflowsLoading />;
  if (!data?.canReset && data?.isEmpty) return <WorkflowsEmpty />;
  if (data?.canReset && data?.isEmpty) return <WorkflowsNotFound />;

  return (
    <EntityList
      items={data?.content ?? []}
      isEmpty={!data?.canReset && data?.isEmpty}
      emptyView={<WorkflowsEmpty />}
      notFoundView={<NotFoundView />}
      notFound={data?.canReset && data?.isEmpty}
      getKey={(item) => item.id}
      renderItem={(item) => <WorkflowItem workflow={item} />}
    />
  );
}

export default WorkflowsListView;
