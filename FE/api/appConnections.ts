import { useQuery } from "@tanstack/react-query";
import { endpoints } from "./axios";
import { getFetcher } from "./api";
import { AxiosRequestConfig } from "axios";
import { APIListResponse } from "@/types/common";
import {
  AppConnection,
  AppConnectionType,
  DiscordServer,
} from "@/types/appConnections";

export function useGetMyAppConnections(type?: AppConnectionType) {
  const URL: [string, AxiosRequestConfig] = [
    endpoints.appConnections.getMyConnections,
    {
      params: {
        type,
      },
    },
  ];
  const queryKey = ["app-connections", "my-connections"];
  const query = useQuery<APIListResponse<AppConnection>>({
    queryKey,
    queryFn: getFetcher(URL),
  });
  return { ...query, queryKey, data: query?.data?.content };
}

export function useGetServers(connectionId?: string) {
  const URL: [string, AxiosRequestConfig] = [
    connectionId ? endpoints.integrations.discord.servers(connectionId) : "",
    {},
  ];
  const queryKey = ["app-connections", "discord", "servers", connectionId];
  const query = useQuery<APIListResponse<DiscordServer>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!connectionId,
  });
  return { ...query, queryKey, data: query?.data?.content };
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export function useGetServerChannels(serverId?: string) {
  const URL: [string, AxiosRequestConfig] = [
    serverId ? endpoints.integrations.discord.channels(serverId) : "",
    {},
  ];
  const queryKey = ["app-connections", "discord", "channels", serverId];
  const query = useQuery<APIListResponse<DiscordChannel>>({
    queryKey,
    queryFn: getFetcher(URL),
    enabled: !!serverId,
  });
  return { ...query, queryKey, data: query?.data?.content };
}
