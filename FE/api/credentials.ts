import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { endpoints } from "./axios";
import { getFetcher } from "./api";
import { APIDetailsResponse, APIListResponse } from "@/types/common";
import { Credential } from "@/types/credentials";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";
import { PAGINATION } from "@/config/constants";

export async function createCredential(payload: {
  name: string;
  type: string;
  value: any;
}) {
  const URL = endpoints.credentials.all;
  const response = await axios.post(URL, payload);
  return response.data as APIDetailsResponse<Credential>;
}

export function useCreateCredential() {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: createCredential,
    onMutate: () => {
      toast.loading("Creating Credential...", { id: "create-credential" });
    },
    onSuccess: (data: APIDetailsResponse<Credential>) => {
      toast.success(`Credential ${data.content.name} Created Successfully`, {
        id: "create-credential",
      });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create credential: ${error.message || "Unknown error"}`,
        {
          id: "create-credential",
        },
      );
    },
  });
  return query;
}

export async function deleteCredential(credentialId: string) {
  const URL = endpoints.credentials.single(credentialId);
  toast.loading("Deleting Credential...", { id: credentialId });
  const response = await axios.delete(URL);
  toast.dismiss(credentialId);
  return response.data;
}

export function useRemoveCredential(queryKey: any[]) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Credential Deleted Successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete credential: ${error.message}`);
    },
  });
  return mutation;
}

export async function prefetchCredentials({
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
    endpoints.credentials.all,
    {
      params: {
        page,
        size: pageSize,
        name,
        ...filters,
      },
    },
  ];
  const queryKey = ["credentials", "list", URL];
  const queryClient = new QueryClient();
  const query = await queryClient.prefetchQuery<APIListResponse<Credential>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { queryClient, query, queryKey };
}

export function useGetCredentials({
  page = PAGINATION.DEFAULT_PAGE,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  name = "",
  filters = {},
}: {
  page: number;
  pageSize: number;
  name?: string;
  filters?: Record<string, string | number>;
}) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.credentials.all,
    {
      params: {
        page,
        size: pageSize,
        name,
        ...filters,
      },
    },
  ];
  const queryKey = ["credentials", "list", URL];
  const query = useQuery<APIListResponse<Credential>>({
    queryKey,
    queryFn: getFetcher(URL),
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  return { ...query, queryKey };
}

export async function updateCredential(
  credentialId: string,
  payload: { name?: string; type?: string; value?: string },
) {
  const URL = endpoints.credentials.single(credentialId);
  const response = await axios.patch(URL, payload);
  return response.data as APIDetailsResponse<Credential>;
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      credentialId,
      payload,
    }: {
      credentialId: string;
      payload: { name?: string; type?: string; value?: string };
    }) => updateCredential(credentialId, payload),
    onMutate: () => {
      toast.loading("Updating Credential...", { id: "update-credential" });
    },
    onSuccess: (data) => {
      toast.success(`Credential ${data.content.name} Updated Successfully`, {
        id: "update-credential",
      });
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update credential: ${error.message || "Unknown error"}`,
        {
          id: "update-credential",
        },
      );
    },
  });
}

export function useGetCredentialDetails(credentialId: string) {
  const URL = endpoints.credentials.single(credentialId);
  const queryKey = ["credentials", credentialId];
  const query = useQuery<APIDetailsResponse<Credential>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!credentialId,
  });
  return { ...query, queryKey };
}
