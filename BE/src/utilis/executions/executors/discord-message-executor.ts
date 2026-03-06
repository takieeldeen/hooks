import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/errorController";
import axios from "axios";
import { decode } from "html-entities";

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
  if (!data.webhookUrl) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no model configured`,
    );
  }
  if (!data.message) {
    throw new AppError(
      400,
      `Discord Message Node ${nodeId}: no message configured`,
    );
  }

  const message = decode(Handlebars.compile(data.message)(context));
  console.log(message);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await axios.post(data.webhookUrl, {
      content: message.slice(0, 2000),
      username,
    });
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
  context[data.variableName] = {
    message: message.slice(0, 2000),
  };
  return context;
};
