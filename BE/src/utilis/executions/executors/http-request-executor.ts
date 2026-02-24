import axios from "axios";
import { NodeExecutor } from "../../backgroundJobs/types";

export const HttpRequestExecutor: NodeExecutor<"HTTP_REQUEST"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new Error("Variable Name not configured");
  }
  if (!data.endpoint) {
    throw new Error(`HTTP Request Node ${nodeId}: no endpoint configured`);
  }
  if (!data.method) {
    throw new Error(`HTTP Request Node ${nodeId}: no method configured`);
  }
  const hasBody = ["POST", "PUT", "PATCH"].includes(data.method);
  const result = await axios({
    method: data?.method?.toLowerCase(),
    url: data?.endpoint,
    data: data?.body,
    ...(hasBody
      ? {
          headers: {
            "Content-Type": "application/json",
          },
        }
      : {}),
  });
  context = {
    ...context,
    [data.variableName]: {
      httpResponse: {
        status: result.status,
        statusText: result.statusText,
        data: result.data,
      },
    },
  };
  console.log(context);
  return context;
};
