import { NodeType } from "../../generated/prisma/enums";
import { ExecutorRegistry } from "../backgroundJobs/types";
import { HttpRequestExecutor } from "./executors/http-request-executor";
import { voidExecutor } from "./executors/void-executor";

export const EXECUTOR_REGISTRY: ExecutorRegistry = {
  HTTP_REQUEST: HttpRequestExecutor,
  INITIAL: voidExecutor,
  MANUAL_TRIGGER: voidExecutor,
} as const;
