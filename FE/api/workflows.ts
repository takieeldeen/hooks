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
import { Workflow } from "@/types/workflows";
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

export async function updateWorkflow(
  workflowId: string,
  workflowPayload: Partial<Workflow>,
) {
  const URL = endpoints.workflows.single(workflowId);
  const response = await axios.patch(URL, workflowPayload);
  return response.data;
}

export async function deleteWorkflow(workflowId: Workflow["id"]) {
  const URL = endpoints.workflows.single(workflowId);
  const response = await axios.delete(URL);
  return response.data;
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
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<APIListResponse<Workflow>>({
    queryKey: ["workflows", page, pageSize, name],
    queryFn: getFetcher(URL),
  });
  return { queryClient, query };
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
  const query = useQuery<APIListResponse<Workflow>>({
    queryKey: ["workflows", page, pageSize, name],
    queryFn: getFetcher(URL),
  });
  return query;
}

export async function prefetchWorkflowDetails(workflowId: string) {
  const URL = endpoints.workflows.single(workflowId);
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<APIDetailsResponse<Workflow>>({
    queryKey: ["workflows", workflowId],
    queryFn: getFetcher(URL),
  });
  return { queryClient, query };
}

export function useGetWorkflowDetails(workflowId: string) {
  const URL = endpoints.workflows.single(workflowId);
  const query = useQuery<APIDetailsResponse<Workflow>>({
    queryKey: ["workflows", workflowId],
    queryFn: getFetcher(URL),
  });
  return query;
}
