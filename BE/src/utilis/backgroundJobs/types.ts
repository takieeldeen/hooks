import { NodeType } from "../../generated/prisma/enums";

export type WorkflowContext = Record<string, unknown>;

export interface ExecutorPayload<T = Record<string, unknown>> {
  data: T;
  nodeId: string;
  context: WorkflowContext;
}

// export type NodeExecutor<T = Record<string, unknown>> = (
//   params: ExecutorPayload<T>,
// ) => Promise<WorkflowContext>;

export type NodeExecutor<T extends NodeType> = (
  params: ExecutorPayload<NodeInputs[T]>,
  userId?: string,
) => Promise<WorkflowContext>;

export type ExecutorRegistry = { [K in NodeType]: NodeExecutor<K> };

export const GEMINI_AVAILABLE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
] as const;

export type NodeInputs = {
  HTTP_REQUEST: {
    variableName: string;
    endpoint: string;
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
    body?: string;
  };
  INITIAL: null;
  MANUAL_TRIGGER: null;
  GOOGLE_FORM_TRIGGER: null;
  STRIPE_TRIGGER: null;
  GEMINI: {
    variableName: string;
    model: (typeof GEMINI_AVAILABLE_MODELS)[number];
    userPrompt: string;
    credentialId: string;
    systemPrompt?: string;
  };
  OPENAI: {
    variableName: string;
    model: (typeof GEMINI_AVAILABLE_MODELS)[number];
    userPrompt: string;
    credentialId: string;
    systemPrompt?: string;
  };
  ANTHROPIC: {
    variableName: string;
    model: (typeof GEMINI_AVAILABLE_MODELS)[number];
    userPrompt: string;
    credentialId: string;
    systemPrompt?: string;
  };
  DISCORD_MESSAGE: {
    variableName: string;
    message: string;
    channelId: string;
    serverId: string;
    connectionId: string;
  };
  SLACK_MESSAGE: {
    variableName: string;
    message: string;
    username?: string;
    webhookUrl: string;
  };
  DISCORD_TRIGGER: {
    variableName: string;
    message: string;
    username?: string;
    webhookUrl: string;
  };
  SLACK_TRIGGER: {
    variableName: string;
    message: string;
    username?: string;
    webhookUrl: string;
  };
};
