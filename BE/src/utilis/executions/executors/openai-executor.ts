import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import AiService from "../../../srv/aiService";
import { createOpenAI } from "@ai-sdk/openai";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const OpenAiExecutor: NodeExecutor<"OPENAI"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new Error("Variable Name not configured");
  }
  if (!data.model) {
    throw new Error(`OpenAI Request Node ${nodeId}: no model configured`);
  }
  if (!data.userPrompt) {
    throw new Error(`OpenAI Request Node ${nodeId}: no userPrompt configured`);
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch Credential that user selected.
  const credentialValue = process.env.OPENAI_API_KEY;

  const openai = createOpenAI({ apiKey: credentialValue });
  const model = openai(data.model);

  const result = await AiService.prompt(model, userPrompt, systemPrompt);
  context[data.variableName] = {
    aiResponse: result.output,
  };
  return context;
};
