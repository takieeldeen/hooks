import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import AiService from "../../../srv/aiService";
import { createAnthropic } from "@ai-sdk/anthropic";
import { AppError } from "../../../controllers/error.controller";
import { prisma } from "../../../lib/prisma";
import LogService from "../../../srv/log.service";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const AnthropicExecutor: NodeExecutor<"ANTHROPIC"> = async (
  { context, data, nodeId, nodeExecutionId },
  userId,
) => {
  if (!data.variableName) {
    throw new Error("Variable Name not configured");
  }
  if (!data.model) {
    throw new Error(`Anthropic Node ${nodeId}: no model configured`);
  }
  if (!data.userPrompt) {
    throw new Error(`Anthropic Node ${nodeId}: no userPrompt configured`);
  }
  if (!data.credentialId) {
    throw new AppError(400, `Anthropic Node ${nodeId}: no api key configured`);
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  await LogService.create(
    `Executing Anthropic Prompt with model: ${data.model}`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  const apiKey = await prisma.credential.findUniqueOrThrow({
    where: {
      id: data.credentialId,
      userId,
    },
  });
  const credentialValue = apiKey.value;

  const anthropic = createAnthropic({ apiKey: credentialValue });
  const model = anthropic(data.model);

  const result = await AiService.prompt(model, userPrompt, systemPrompt);

  await LogService.create(
    `Anthropic execution success`,
    "INFO",
    nodeExecutionId,
    userId,
  );

  const output = {
    aiResponse: result.output,
  };

  context[data.variableName] = output;

  return { context, output };
};
