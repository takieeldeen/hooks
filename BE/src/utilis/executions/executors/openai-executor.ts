import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import AiService from "../../../srv/aiService";
import { createOpenAI } from "@ai-sdk/openai";
import { AppError } from "../../../controllers/error.controller";
import { prisma } from "../../../lib/prisma";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const OpenAiExecutor: NodeExecutor<"OPENAI"> = async (
  { context, data, nodeId },
  userId,
) => {
  if (!data.variableName) {
    throw new AppError(400, "Variable Name not configured");
  }
  if (!data.model) {
    throw new AppError(
      400,
      `OpenAI Request Node ${nodeId}: no model configured`,
    );
  }
  if (!data.userPrompt) {
    throw new AppError(
      400,
      `OpenAI Request Node ${nodeId}: no userPrompt configured`,
    );
  }
  if (!data.credentialId) {
    throw new AppError(400, `Gemini Node ${nodeId}: no api key configured`);
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const apiKey = await prisma.credential.findUniqueOrThrow({
    where: {
      id: data.credentialId,
      userId,
    },
  });
  const credentialValue = apiKey.value;

  const openai = createOpenAI({ apiKey: credentialValue });
  const model = openai(data.model);

  const result = await AiService.prompt(model, userPrompt, systemPrompt);
  context[data.variableName] = {
    aiResponse: result.output,
  };
  return context;
};
