import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import { AppError } from "../../../controllers/error.controller";
import { decode } from "html-entities";
import SlackService from "../../../integrations/slack.service";
import LogService from "../../../srv/log.service";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const SlackMessageExecutor: NodeExecutor<"SLACK_MESSAGE"> = async (
  { context, data, nodeId, nodeExecutionId },
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

  await LogService.create(
    `Sending Slack Message to channel: ${data.channelId}`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  try {
    const result = await SlackService.sendSlackMessage(
      userId!,
      data.channelId,
      message,
    );

    const output = {
      message: result,
    };

    await LogService.create(
      `Slack Message sent successfully`,
      "INFO",
      nodeExecutionId,
      userId,
    );

    context[data.variableName] = output;
    return { context, output };
  } catch (err: any) {
    await LogService.create(
      `Failed to send Slack Message: ${err.message}`,
      "ERROR",
      nodeExecutionId,
      userId,
    );
    throw new AppError(400, err?.response?.data);
  }
};
