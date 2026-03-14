import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/error.controller";
import { decode } from "html-entities";
import SlackService from "../../../integrations/slack.service";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const SlackMessageExecutor: NodeExecutor<"SLACK_MESSAGE"> = async (
  { context, data, nodeId },
  userId,
) => {
  if (!data.variableName) {
    throw new AppError(400, "Variable Name not configured");
  }

  if (!data.connectionId) {
    throw new AppError(
      400,
      `Slack Message Node ${nodeId}: no connection configured`,
    );
  }
  if (!data.channelId) {
    throw new AppError(
      400,
      `Slack Message Node ${nodeId}: no channelId configured`,
    );
  }
  if (!data.message) {
    throw new AppError(
      400,
      `Slack Message Node ${nodeId}: no message configured`,
    );
  }

  const message = decode(Handlebars.compile(data.message)(context));

  try {
    const result = await SlackService.sendSlackMessage(
      userId!,
      data.channelId,
      message,
    );
    context[data.variableName] = {
      message: result,
    };
  } catch (err: any) {
    throw new AppError(400, err?.response?.data);
  }
  return context;
};
