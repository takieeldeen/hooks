import axios from "axios";
import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { AppError } from "../../../controllers/error.controller";
import LogService from "../../../srv/log.service";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const HttpRequestExecutor: NodeExecutor<"HTTP_REQUEST"> = async (
  { context, data, nodeId, nodeExecutionId, functionContext },
  userId,
) => {
  // try {
  const axiosInstance = (functionContext?.axios as any) || axios;
  // if (!context.cookieJar) {
  //   context.cookieJar = new CookieJar();
  // }
  // const axiosClient = axios.create({
  //   jar: context.cookieJar,
  //   withCredentials: true,
  // } as any);

  // axiosClient.interceptors.request.use((config) => {
  //   console.log("---- AXIOS REQUEST ----");
  //   console.log("URL:", config.url);
  //   console.log("METHOD:", config.method);
  //   console.log("HEADERS:", config.headers);
  //   console.log("DATA:", config.data);
  //   console.log("-----------------------");

  //   return config;
  // });
  // const client = wrapper(axiosClient as any);
  if (!data.variableName) {
    throw new AppError(400, "Variable Name not configured");
  }
  if (!data.endpoint) {
    throw new AppError(
      400,
      `HTTP Request Node ${nodeId}: no endpoint configured`,
    );
  }
  if (!data.method) {
    throw new AppError(
      400,
      `HTTP Request Node ${nodeId}: no method configured`,
    );
  }
  const hasBody = ["POST", "PUT", "PATCH"].includes(data.method);
  const hasHeaders = !!data.headers;
  const endpoint = Handlebars.compile(data.endpoint)(context);
  // const cookies = await (context as any)?.cookieJar.getCookies(endpoint);
  let bodyOptions: any = {};
  let parsedBody = data?.body ?? {};
  if (hasBody && data?.body) {
    try {
      parsedBody = JSON.parse(Handlebars.compile(data.body ?? {})(context));
    } catch (err) {
      console.log(err);
      throw new AppError(400, "INVALID_JSON_BODY_STRUCTURE");
    }
    bodyOptions = {
      data: parsedBody,
    };
  }
  let headersOptions: any = {};
  if (hasHeaders) {
    try {
      headersOptions = JSON.parse(Handlebars.compile(data.headers)(context));
    } catch (err) {
      console.log(err);
      throw new AppError(400, "INVALID_JSON_HEADERS_STRUCTURE");
    }
  }

  await LogService.create(
    `Executing HTTP Request: [${data.method}] ${endpoint}`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  let result: any = null;
  try {
    result = await axiosInstance({
      method: data?.method?.toLowerCase(),
      url: endpoint,
      ...bodyOptions,
      headers: headersOptions,
    });
  } catch (err: any) {
    console.log(err);
    await LogService.create(
      `HTTP Request failed: ${err.message}`,
      "ERROR",
      nodeExecutionId,
      userId,
    );
    throw new AppError(400, err.response.data);
  }

  await LogService.create(
    `HTTP Request success: Status ${result.status}`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  const output = {
    status: result.status,
    statusText: result.statusText,
    data: result.data,
  };

  context[data.variableName] = {
    httpResponse: output,
  };

  return { context, output };
  // } catch (err) {
  //   console.log(err);
  // }
};
