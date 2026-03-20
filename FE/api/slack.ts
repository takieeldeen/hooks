import { useQuery } from "@tanstack/react-query";
import { endpoints } from "./axios";
import { getFetcher } from "./api";
import { AxiosRequestConfig } from "axios";
import { APIListResponse } from "@/types/common";
import { AppConnection } from "@/types/appConnections";
import { SlackChannel } from "@/types/slack";

export function useGetMySlackConnections() {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.appConnections.getMyConnections,
    {
      params: {
        type: "SLACK",
      },
    },
  ];
  const queryKey = ["app-connections", "my-connections", "slack"];
  const query = useQuery<APIListResponse<AppConnection>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey, data: query?.data?.content };
}

export function useGetSlackChannels() {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.integrations.slack.channels,
    {},
  ];
  const queryKey = ["app-connections", "slack", "channels"];
  const query = useQuery<any>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return {
    ...query,
    queryKey,
    data: (query?.data?.content as SlackChannel[]) ?? [],
  };
}
