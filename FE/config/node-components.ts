import initialNode from "@/components/initialNode";
import GeminiNode from "@/features/executions/components/gemini-node/gemini-node";
import AnthropicNode from "@/features/executions/components/anthropic-node/anthropic-node";
import OpenAINode from "@/features/executions/components/openai-node/openai-node";
import HttpRequestNode from "@/features/executions/components/http-request/HttpRequestNode";
import GoogleFormTriggerNode from "@/features/triggers/components/google-form-trigger/google-form-trigger-node";
import ManualTriggerNode from "@/features/triggers/components/manual-trigger/manual-trigger-node";
import StripeTriggerNode from "@/features/triggers/components/stripe-trigger/stripe-trigger-node";

export type NodeType =
  | "INITIAL"
  | "MANUAL_TRIGGER"
  | "GOOGLE_FORM_TRIGGER"
  | "HTTP_REQUEST"
  | "STRIPE_TRIGGER"
  | "ANTHROPIC"
  | "GEMINI"
  | "OPENAI";

export const nodeComponents: Record<NodeType, any> = {
  INITIAL: initialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
  GOOGLE_FORM_TRIGGER: GoogleFormTriggerNode,
  STRIPE_TRIGGER: StripeTriggerNode,
  ANTHROPIC: AnthropicNode,
  GEMINI: GeminiNode,
  OPENAI: OpenAINode,
};
