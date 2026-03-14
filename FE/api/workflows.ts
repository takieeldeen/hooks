// Create

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { endpoints } from "./axios";
import { getFetcher } from "./api";
import { APIDetailsResponse, APIListResponse } from "@/types/common";
import { Workflow, WorkflowExecution } from "@/types/workflows";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";
import { PAGINATION } from "@/config/constants";

export async function createWorkflow(workflowPayload: { name: string }) {
  const URL = endpoints.workflows.all;
  const response = await axios.post(URL, workflowPayload);
  return response.data as APIDetailsResponse<Workflow>;
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: createWorkflow,
    onSuccess: (data: APIDetailsResponse<Workflow>) => {
      toast.success(`Workflow ${data.content.name} Created Successfully`);
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
  return query;
}

export async function updateWorkflow(workflowPayload: Partial<Workflow>) {
  const URL = endpoints.workflows.single(workflowPayload.id!);
  toast.loading("Updating Workflow...", { id: workflowPayload.id });
  const response = await axios.patch(URL, workflowPayload);
  return response.data;
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (data: APIDetailsResponse<Workflow>, params) => {
      toast.success(`Workflow Updated Successfully`, {
        id: params.id,
      });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error: any, params) => {
      toast.error(`Workflow Update Failed`, {
        id: params.id,
      });
    },
  });
  return query;
}

export async function updateWorkflowName(workflowPayload: Workflow) {
  const URL = endpoints.workflows.updateName(workflowPayload.id);
  toast.loading("Updating Workflow Name...", { id: workflowPayload.id });
  const response = await axios.patch(URL, workflowPayload);
  toast.dismiss(workflowPayload.id);
  return response.data;
}

export function useUpdateWorkflowName() {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: updateWorkflowName,
    onSuccess: (data: APIDetailsResponse<Workflow>) => {
      toast.success(`Workflow ${data.content.name} Name Updated Successfully`, {
        id: data.content.id,
      });
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
  return query;
}

export async function deleteWorkflow(workflowId: Workflow["id"]) {
  const URL = endpoints.workflows.single(workflowId);
  toast.loading("Deleting Workflow...", { id: workflowId });
  const response = await axios.delete(URL);
  toast.dismiss(workflowId);
  return response.data;
}

export function useRemoveWorkflow(queryKey: any[]) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Workflow Deleted Successfully");
    },
  });
  return mutation;
}

export async function prefetchWorkflows({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = "",
  filters = {},
}: {
  page: number;
  pageSize: number;
  name: string;
  filters?: Record<string, string | number>;
}) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.workflows.all,
    {
      params: {
        page,
        pageSize,
        name,
        ...filters,
      },
    },
  ];
  const queryKey = URL;
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<APIListResponse<Workflow>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query, queryKey };
}

export function useGetWorkflows({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = "",
  filters = {},
}: {
  page: number;
  pageSize: number;
  name: string;
  filters?: Record<string, string | number>;
}) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.workflows.all,
    {
      params: {
        page,
        pageSize,
        name,
        ...filters,
      },
    },
  ];
  const queryKey = URL;
  const query = useQuery<APIListResponse<Workflow>>({
    queryKey,
    queryFn: getFetcher(URL),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { ...query, queryKey };
}

export async function prefetchWorkflowDetails(workflowId: string) {
  const URL = endpoints.workflows.single(workflowId);
  const queryKey = ["workflows", workflowId];
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<APIDetailsResponse<Workflow>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query };
}

export function useGetWorkflowDetails(workflowId: string) {
  const URL = endpoints.workflows.single(workflowId);
  const queryKey = ["workflows", workflowId];
  const query = useQuery<APIDetailsResponse<Workflow>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey };
}

export async function triggerWorkflow(workflowId: string) {
  const URL = endpoints.workflows.execute(workflowId);
  const response = await axios.post(URL);
  return response.data;
}

export function useTriggerWorkflow() {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: triggerWorkflow,
    onSuccess: (data: APIDetailsResponse<Workflow>) => {
      toast.success(`Workflow Triggered Successfully`);
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (error: any) => {
      toast.error(`Workflow Trigger Failed`);
    },
  });
  return query;
}

export function useGetMyAvailableGeminiModels() {
  const URL = endpoints.ai.geminiAvailableModels;
  const queryKey = ["gemini", "models"];
  const query = useQuery<APIListResponse<string>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey };
}

export function useGetMyAvailableOpenAiModels() {
  const URL = endpoints.ai.openAiAvailableModels;
  const queryKey = ["openai", "models"];
  const query = useQuery<APIListResponse<string>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey };
}

export function useGetWorkflowExecutions(
  workflowId: string,
  {
    page = PAGINATION.DEFAULT_PAGE,
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  }: {
    page?: number;
    pageSize?: number;
  } = {}
) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.workflows.executions(workflowId),
    {
      params: {
        page,
        pageSize,
      },
    },
  ];
  const queryKey = ["workflows", workflowId, "executions", { page, pageSize }];
  const query = useQuery<APIListResponse<WorkflowExecution>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey };
}
