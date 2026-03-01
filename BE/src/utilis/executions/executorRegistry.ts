import { ExecutorRegistry } from "../backgroundJobs/types";
import { GeminiExecutor } from "./executors/gemini-executor";
import { HttpRequestExecutor } from "./executors/http-request-executor";
import { voidExecutor } from "./executors/void-executor";
import { OpenAiExecutor } from "./executors/openai-executor";
import { AnthropicExecutor } from "./executors/anthropic-executor";

export const EXECUTOR_REGISTRY: ExecutorRegistry = {
  // Triggers
  INITIAL: voidExecutor,
  MANUAL_TRIGGER: voidExecutor,
  GOOGLE_FORM_TRIGGER: voidExecutor,
  STRIPE_TRIGGER: voidExecutor,
  // Action Nodes
  HTTP_REQUEST: HttpRequestExecutor,
  GEMINI: GeminiExecutor,
  ANTHROPIC: AnthropicExecutor,
  OPENAI: OpenAiExecutor,
} as const;
