import { BaseNodeData } from "./flow";

export type LLMProvider = "openai" | "anthropic" | "gemini" | "groq" | "ollama" | "mock";

export interface TriggerNodeData extends BaseNodeData {
  type: "trigger";
  triggerType: "manual" | "scheduled" | "webhook" | "file";
  inputPrompt: string;
  defaultPayload?: string;
  cronPattern?: string;
}

export interface LLMNodeData extends BaseNodeData {
  type: "llm";
  provider: LLMProvider;
  model: string;
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: number;
  maxTokens: number;
  jsonMode: boolean;
  apiKeyOverride?: string;
}

export interface ConditionRule {
  id: string;
  field: string;
  operator: "equals" | "contains" | "regex" | "gt" | "lt" | "isNotEmpty";
  value: string;
}

export interface ConditionNodeData extends BaseNodeData {
  type: "condition";
  logicOperator: "AND" | "OR";
  rules: ConditionRule[];
  fallbackTarget?: "falseBranch";
}

export interface TransformNodeData extends BaseNodeData {
  type: "transform";
  transformType: "javascript" | "jsonExtract" | "template";
  code: string; // JS function: (input, context) => output
  jsonPath?: string;
  templateString?: string;
}

export interface HttpRequestNodeData extends BaseNodeData {
  type: "httpRequest";
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers: { key: string; value: string }[];
  bodyType: "json" | "raw" | "none";
  bodyPayload?: string;
}

export interface OutputNodeData extends BaseNodeData {
  type: "output";
  displayFormat: "markdown" | "json" | "table" | "text";
  title: string;
  lastOutput?: any;
}
