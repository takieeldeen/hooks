import { NodeType } from "../../generated/prisma/enums";
import { NodeExecutor } from "../backgroundJobs/types";
import { HttpRequestExecutor } from "./executors/http-request-executor";

export const EXECUTOR_REGISTRY: Record<NodeType, NodeExecutor<any>> = {
  HTTP_REQUEST: HttpRequestExecutor,
  INITIAL: async () => {
    const promise = await new Promise((res) => {
      const timeout = setTimeout(() => res(null), 3000);
    });
    return {};
  },
  MANUAL_TRIGGER: async () => {
    const promise = await new Promise((res) => {
      const timeout = setTimeout(() => res(null), 3000);
    });
    return {};
  },
} as const;
