import { NodeExecutor } from "../../backgroundJobs/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  data,
  nodeId,
}) => {
  return {};
};
