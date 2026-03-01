import axios from "axios";
import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const HttpRequestExecutor: NodeExecutor<"HTTP_REQUEST"> = async ({
  context,
  data,
  nodeId,
}) => {
  // await new Promise((res) => {
  //   const timeout = setTimeout(() => res(null), 3000);
  // });
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
  const endpoint = Handlebars.compile(data.endpoint)(context);
  console.log(data.endpoint, context, endpoint, "REQUET_ENDPOINT");
  let bodyOptions: any = {};
  if (hasBody && data?.body) {
    bodyOptions = {
      data: JSON.parse(Handlebars.compile(data.body ?? {})(context)),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };
  }

  const result = await axios({
    method: data?.method?.toLowerCase(),
    url: endpoint,
    ...bodyOptions,
  });
  context[data.variableName] = {
    httpResponse: {
      status: result.status,
      statusText: result.statusText,
      data: result.data,
    },
  };
  return context;
};
