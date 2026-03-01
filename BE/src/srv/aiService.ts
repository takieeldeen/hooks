import { generateText } from "ai";

async function prompt(model: any, userPrompt: string, systemPrompt?: string) {
  const response = await generateText({
    model,
    prompt: userPrompt,
    system: systemPrompt,
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    },
  });
  return response;
}

const AiService = {
  prompt,
};

export default AiService;
