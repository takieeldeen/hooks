import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/error.controller";

export const DiscordTriggerExecutor: NodeExecutor<"DISCORD_TRIGGER"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new AppError(
      400,
      `Discord Trigger Node ${nodeId}: no variableName configured`,
    );
  }

  // The webhook controller seeds context.discord before execution begins
  const discordPayload = context.discord as any;

  if (!discordPayload) {
    throw new AppError(
      400,
      `Discord Trigger Node ${nodeId}: no discord payload in context`,
    );
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

  context[data.variableName] = discordPayload;
  return context;
};
