import axios from "axios";
import { NodeExecutor } from "../../backgroundJobs/types";

type HttpRequestData = {
  endpoint: string;
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.endpoint) {
    throw new Error(`HTTP Request Node ${nodeId}: no endpoint configured`);
  }
  if (!data.method) {
    throw new Error(`HTTP Request Node ${nodeId}: no method configured`);
  }
  const result = await axios({
    method: data?.method?.toLowerCase(),
    url: data?.endpoint,
    data: data?.body,
  });
  context = {
    ...context,
    httpResponse: {
      status: result.status,
      statusText: result.statusText,
      data: result.data,
    },
  };
  console.log(context);
  return context;
};
