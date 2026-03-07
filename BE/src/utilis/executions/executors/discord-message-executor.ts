import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/errorController";
import axios from "axios";
import { decode } from "html-entities";
import { sendDiscordMessage } from "../../../integrations/discord";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const DiscordMessageExecutor: NodeExecutor<"DISCORD_MESSAGE"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new AppError(400, "Variable Name not configured");
  }

  if (!data.connectionId) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no connection configured`,
    );
  }
  if (!data.channelId) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no channelId configured`,
    );
  }
  if (!data.serverId) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no serverId configured`,
    );
  }
  if (!data.message) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no message configured`,
    );
  }

  const message = decode(Handlebars.compile(data.message)(context));

  try {
    const result = await sendDiscordMessage(data.channelId, message);
    context[data.variableName] = {
      message: result,
    };
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
  return context;
};
