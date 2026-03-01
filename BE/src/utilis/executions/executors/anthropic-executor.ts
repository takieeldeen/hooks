import Handlebars from "handlebars";
import { NodeExecutor } from "../../backgroundJobs/types";
import AiService from "../../../srv/aiService";
import { createAnthropic } from "@ai-sdk/anthropic";

Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

export const AnthropicExecutor: NodeExecutor<"ANTHROPIC"> = async ({
  context,
  data,
  nodeId,
}) => {
  if (!data.variableName) {
    throw new Error("Variable Name not configured");
  }
  if (!data.model) {
    throw new Error(`Anthropic Request Node ${nodeId}: no model configured`);
  }
  if (!data.userPrompt) {
    throw new Error(
      `Anthropic Request Node ${nodeId}: no userPrompt configured`,
    );
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch Credential that user selected.
  const credentialValue = process.env.AI_GATEWAY_API_KEY;

  const anthropic = createAnthropic({ apiKey: credentialValue });
  const model = anthropic(data.model);

  const result = await AiService.prompt(model, userPrompt, systemPrompt);
  console.log(result.output, "THIS IS THE MODEL RESULT");
  context[data.variableName] = {
    aiResponse: result.output,
  };
  return context;
};
