import { ExecutorRegistry } from "../backgroundJobs/types";
import { GeminiExecutor } from "./executors/gemini-executor";
import { HttpRequestExecutor } from "./executors/http-request-executor";
import { voidExecutor } from "./executors/void-executor";
import { OpenAiExecutor } from "./executors/openai-executor";
import { AnthropicExecutor } from "./executors/anthropic-executor";
import { DiscordMessageExecutor } from "./executors/discord-message-executor";
import { SlackMessageExecutor } from "./executors/slack-message-executor";
import { DiscordTriggerExecutor } from "./executors/discord-trigger-executor";

export const EXECUTOR_REGISTRY: ExecutorRegistry = {
  // Triggers
  INITIAL: voidExecutor,
  MANUAL_TRIGGER: voidExecutor,
  GOOGLE_FORM_TRIGGER: voidExecutor,
  STRIPE_TRIGGER: voidExecutor,
  DISCORD_TRIGGER: DiscordTriggerExecutor,
  SLACK_TRIGGER: voidExecutor,
  // Action Nodes
  HTTP_REQUEST: HttpRequestExecutor,
  GEMINI: GeminiExecutor,
  ANTHROPIC: AnthropicExecutor,
  OPENAI: OpenAiExecutor,
  // DISCORD_MESSAGE:
  DISCORD_MESSAGE: DiscordMessageExecutor,
  SLACK_MESSAGE: SlackMessageExecutor,
} as const;
