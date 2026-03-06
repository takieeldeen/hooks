import initialNode from "@/components/initialNode";
import GeminiNode from "@/features/executions/components/gemini-node/gemini-node";
import AnthropicNode from "@/features/executions/components/anthropic-node/anthropic-node";
import OpenAINode from "@/features/executions/components/openai-node/openai-node";
import HttpRequestNode from "@/features/executions/components/http-request/HttpRequestNode";
import GoogleFormTriggerNode from "@/features/triggers/components/google-form-trigger/google-form-trigger-node";
import ManualTriggerNode from "@/features/triggers/components/manual-trigger/manual-trigger-node";
import StripeTriggerNode from "@/features/triggers/components/stripe-trigger/stripe-trigger-node";
import SlackTriggerNode from "@/features/triggers/components/slack-trigger/slack-trigger-node";
import DiscordTriggerNode from "@/features/triggers/components/discord-trigger/discord-trigger-node";
import DiscordMessageNode from "@/features/executions/components/discord-message-node/discord-message-node";
import SlackMessageNode from "@/features/executions/components/slack-message-node/slack-message-node";

export type NodeType =
  | "INITIAL"
  | "MANUAL_TRIGGER"
  | "GOOGLE_FORM_TRIGGER"
  | "HTTP_REQUEST"
  | "STRIPE_TRIGGER"
  | "SLACK_TRIGGER"
  | "DISCORD_TRIGGER"
  | "ANTHROPIC"
  | "GEMINI"
  | "OPENAI"
  | "DISCORD_MESSAGE"
  | "SLACK_MESSAGE";

export const nodeComponents: Record<NodeType, any> = {
  INITIAL: initialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
  GOOGLE_FORM_TRIGGER: GoogleFormTriggerNode,
  STRIPE_TRIGGER: StripeTriggerNode,
  SLACK_TRIGGER: SlackTriggerNode,
  DISCORD_TRIGGER: DiscordTriggerNode,
  ANTHROPIC: AnthropicNode,
  GEMINI: GeminiNode,
  OPENAI: OpenAINode,
  DISCORD_MESSAGE: DiscordMessageNode,
  SLACK_MESSAGE: SlackMessageNode,
};
