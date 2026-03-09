import { useQuery } from "@tanstack/react-query";
import { endpoints } from "./axios";
import { getFetcher } from "./api";
import { AxiosRequestConfig } from "axios";
import { APIListResponse } from "@/types/common";
import { AppConnection } from "@/types/appConnections";
import { SlackServer } from "@/types/slack";

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
  console.log(query);
  return { ...query, queryKey, data: query?.data?.content };
}

export function useGetSlackServers(connectionId?: string) {
  const URL: [string, AxiosRequestConfig] = [
    connectionId ? endpoints.integrations.slack.servers(connectionId) : "",
    {},
  ];
  const queryKey = ["app-connections", "slack", "servers", connectionId];
  const query = useQuery<APIListResponse<SlackServer>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!connectionId,
  });
  return { ...query, queryKey, data: query?.data?.content };
}

export interface SlackChannel {
  id: string;
  name: string;
  type: number;
}

export function useGetSlackServerChannels(serverId?: string) {
  const URL: [string, AxiosRequestConfig] = [
    serverId ? endpoints.integrations.slack.channels(serverId) : "",
    {},
  ];
  const queryKey = ["app-connections", "slack", "channels", serverId];
  const query = useQuery<APIListResponse<SlackChannel>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!serverId,
  });
  return { ...query, queryKey, data: query?.data?.content };
}
