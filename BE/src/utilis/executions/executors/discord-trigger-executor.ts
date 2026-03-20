import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/error.controller";
import LogService from "../../../srv/log.service";

export const DiscordTriggerExecutor: NodeExecutor<"DISCORD_TRIGGER"> = async (
  { context, data, nodeId, nodeExecutionId },
  userId,
) => {
  if (!data.variableName) {
    throw new AppError(
      400,
      `Discord Trigger Node ${nodeId}: no variableName configured`,
    );
  }

  // The webhook controller seeds context.discord before execution begins
  const discordPayload = context.discord as any;

  if (!discordPayload) {
    await LogService.create(
      `Discord Trigger: No payload found in context`,
      "WARNING",
      nodeExecutionId,
      userId,
    );
    return { context, output: null };
  }

  // Optional server/channel filtering
  if (data.serverId && discordPayload.serverId !== data.serverId) {
    throw new AppError(
      400,
      `Discord Trigger Node ${nodeId}: message not from configured server`,
    );
  }
  if (data.channelId && discordPayload.channelId !== data.channelId) {
    throw new AppError(
      400,
      `Discord Trigger Node ${nodeId}: message not from configured channel`,
    );
  }

  await LogService.create(
    `Discord Trigger processed successfully`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  const output = discordPayload;
  context[data.variableName] = output;
  return { context, output };
};
