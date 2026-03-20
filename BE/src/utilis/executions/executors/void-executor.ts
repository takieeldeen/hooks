import { NodeExecutor } from "../../backgroundJobs/types";

type ManualTriggerData = Record<string, unknown>;

export const voidExecutor: NodeExecutor<any> = async (
  { context, nodeExecutionId },
  userId,
) => {
  return { context, output: null };
};
