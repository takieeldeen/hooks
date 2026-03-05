import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import AiService from "../../../srv/aiService";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../controllers/errorController";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const GeminiExecutor: NodeExecutor<"GEMINI"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new AppError(400, "Variable Name not configured");
  }
  if (!data.model) {
    throw new AppError(400, `Gemini Node ${nodeId}: no model configured`);
  }
  if (!data.userPrompt) {
    throw new AppError(400, `Gemini Node ${nodeId}: no userPrompt configured`);
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
    },
  });
  const credentialValue = apiKey.value;

  const google = createGoogleGenerativeAI({ apiKey: credentialValue });
  const model = google(data.model);

  const result = await AiService.prompt(model, userPrompt, systemPrompt);
  console.log(result.output, "THIS IS THE MODEL RESULT");
  context[data.variableName] = {
    aiResponse: result.output,
  };
  return context;
};
