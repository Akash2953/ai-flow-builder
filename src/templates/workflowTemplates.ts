import { AppEdge, AppNode } from "../types/flow";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "Support" | "Research" | "Engineering" | "Content";
  badge: string;
  nodes: AppNode[];
  edges: AppEdge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "template_support_triage",
    name: "Customer Support Ticket Triage",
    description: "Analyzes incoming support inquiries, classifies sentiment and urgency in JSON, branches urgent cases, and generates automated escalation replies.",
    category: "Support",
    badge: "Most Popular",
    nodes: [
      {
        id: "node_trigger_1",
        type: "trigger",
        position: { x: 50, y: 220 },
        data: {
          label: "Inbound Customer Ticket",
          type: "trigger",
          triggerType: "manual",
          inputPrompt: "URGENT: Our production database is failing and we cannot charge our customers. Please resolve ASAP or we will cancel our subscription!",
          description: "Customer ticket submission event",
          status: "idle",
        },
      },
      {
        id: "node_llm_triage",
        type: "llm",
        position: { x: 380, y: 200 },
        data: {
          label: "Sentiment & Urgency Classifier",
          type: "llm",
          provider: "mock",
          model: "gpt-4o",
          systemPrompt: "You are a customer support triage AI. Always reply with JSON containing: sentiment (positive/negative/neutral), urgency (high/medium/low), category (billing/technical/general), and summary.",
          userPromptTemplate: "Analyze this customer message:\n\n{{node_trigger_1.output}}",
          temperature: 0.2,
          maxTokens: 512,
          jsonMode: true,
          status: "idle",
        },
      },
      {
        id: "node_condition_urgent",
        type: "condition",
        position: { x: 740, y: 200 },
        data: {
          label: "Is High Urgency?",
          type: "condition",
          logicOperator: "OR",
          rules: [
            {
              id: "r1",
              field: "urgency",
              operator: "equals",
              value: "high",
            },
            {
              id: "r2",
              field: "output",
              operator: "contains",
              value: "urgent",
            },
          ],
          description: "Route ticket based on severity",
          status: "idle",
        },
      },
      {
        id: "node_llm_urgent_reply",
        type: "llm",
        position: { x: 1080, y: 80 },
        data: {
          label: "Priority Escalation Response",
          type: "llm",
          provider: "mock",
          model: "claude-3-5-sonnet-20241022",
          systemPrompt: "You are a Tier-3 Support Lead. Write an empathetic, immediate acknowledgment and resolution roadmap.",
          userPromptTemplate: "Original ticket:\n{{node_trigger_1.output}}\n\nUrgent Triage Data:\n{{node_llm_triage.output}}",
          temperature: 0.5,
          maxTokens: 768,
          jsonMode: false,
          status: "idle",
        },
      },
      {
        id: "node_http_slack",
        type: "httpRequest",
        position: { x: 1080, y: 340 },
        data: {
          label: "Log Standard Ticket",
          type: "httpRequest",
          method: "POST",
          url: "https://httpbin.org/post",
          headers: [{ key: "Content-Type", value: "application/json" }],
          bodyType: "json",
          bodyPayload: `{\n  "status": "queued",\n  "ticket": {{node_trigger_1.output}}\n}`,
          description: "Record ticket to CRM",
          status: "idle",
        },
      },
      {
        id: "node_output_urgent",
        type: "output",
        position: { x: 1450, y: 150 },
        data: {
          label: "Escalation Action & Email",
          type: "output",
          displayFormat: "markdown",
          title: "Tier 1 Escalation Package",
          status: "idle",
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_trigger_1", target: "node_llm_triage", animated: true },
      { id: "e2", source: "node_llm_triage", target: "node_condition_urgent", animated: true },
      { id: "e3", source: "node_condition_urgent", target: "node_llm_urgent_reply", sourceHandle: "true", animated: true },
      { id: "e4", source: "node_condition_urgent", target: "node_http_slack", sourceHandle: "false", animated: true },
      { id: "e5", source: "node_llm_urgent_reply", target: "node_output_urgent", animated: true },
    ],
  },
  {
    id: "template_multi_llm_consensus",
    name: "Multi-Model AI Consensus & Synthesis",
    description: "Fans out a complex query to multiple AI models in parallel (Claude Sonnet & GPT-4o), transforms their responses, and uses a synthesizer node to build consensus.",
    category: "Research",
    badge: "Advanced",
    nodes: [
      {
        id: "node_prompt_in",
        type: "trigger",
        position: { x: 60, y: 220 },
        data: {
          label: "Complex Query Trigger",
          type: "trigger",
          triggerType: "manual",
          inputPrompt: "What are the architectural trade-offs between Client-Side React Flow DAG execution vs Serverless Distributed Orchestration (e.g. Temporal / Inngest)?",
          status: "idle",
        },
      },
      {
        id: "node_llm_gpt",
        type: "llm",
        position: { x: 420, y: 90 },
        data: {
          label: "OpenAI GPT-4o Perspective",
          type: "llm",
          provider: "mock",
          model: "gpt-4o",
          systemPrompt: "Provide a concise 3-point technical analysis highlighting scalability, offline capabilities, and developer experience.",
          userPromptTemplate: "{{node_prompt_in.output}}",
          temperature: 0.6,
          maxTokens: 500,
          status: "idle",
        },
      },
      {
        id: "node_llm_claude",
        type: "llm",
        position: { x: 420, y: 350 },
        data: {
          label: "Claude 3.5 Sonnet Perspective",
          type: "llm",
          provider: "mock",
          model: "claude-3-5-sonnet-20241022",
          systemPrompt: "Provide a rigorous systems architecture analysis focusing on state consistency, failure recovery, and latency.",
          userPromptTemplate: "{{node_prompt_in.output}}",
          temperature: 0.4,
          maxTokens: 500,
          status: "idle",
        },
      },
      {
        id: "node_js_combine",
        type: "transform",
        position: { x: 800, y: 210 },
        data: {
          label: "Merge Insights",
          type: "transform",
          transformType: "javascript",
          code: `function transform(input, context) {
  const gptOutput = context['node_llm_gpt']?.output || '';
  const claudeOutput = context['node_llm_claude']?.output || '';

  return {
    comparisonCount: 2,
    gptText: gptOutput,
    claudeText: claudeOutput,
    mergedAt: new Date().toISOString()
  };
}`,
          status: "idle",
        },
      },
      {
        id: "node_llm_synthesizer",
        type: "llm",
        position: { x: 1150, y: 200 },
        data: {
          label: "Master Synthesizer Agent",
          type: "llm",
          provider: "mock",
          model: "gpt-4o",
          systemPrompt: "You are an executive Chief Architect. Synthesize the multi-model viewpoints into a unified executive recommendation.",
          userPromptTemplate: "Perspective 1 (GPT-4o):\n{{node_llm_gpt.output}}\n\nPerspective 2 (Claude):\n{{node_llm_claude.output}}",
          temperature: 0.3,
          maxTokens: 800,
          status: "idle",
        },
      },
      {
        id: "node_output_consensus",
        type: "output",
        position: { x: 1520, y: 200 },
        data: {
          label: "Final Consensus Report",
          type: "output",
          displayFormat: "markdown",
          title: "Architectural Synthesis Decision Record",
          status: "idle",
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_prompt_in", target: "node_llm_gpt", animated: true },
      { id: "e2", source: "node_prompt_in", target: "node_llm_claude", animated: true },
      { id: "e3", source: "node_llm_gpt", target: "node_js_combine", animated: true },
      { id: "e4", source: "node_llm_claude", target: "node_js_combine", animated: true },
      { id: "e5", source: "node_js_combine", target: "node_llm_synthesizer", animated: true },
      { id: "e6", source: "node_llm_synthesizer", target: "node_output_consensus", animated: true },
    ],
  },
  {
    id: "template_code_test_gen",
    name: "Code Explainer & Test Suite Generator",
    description: "Takes raw code snippets, inspects them for security & performance flaws, and generates comprehensive unit test suites.",
    category: "Engineering",
    badge: "DevOps",
    nodes: [
      {
        id: "node_code_input",
        type: "trigger",
        position: { x: 50, y: 180 },
        data: {
          label: "Raw Code Snippet",
          type: "trigger",
          triggerType: "manual",
          inputPrompt: `export function calculateDiscount(price, userRole) {\n  if (userRole === "VIP") return price * 0.8;\n  if (userRole === "MEMBER") return price * 0.9;\n  return price;\n}`,
          status: "idle",
        },
      },
      {
        id: "node_llm_test_gen",
        type: "llm",
        position: { x: 400, y: 160 },
        data: {
          label: "Vitest / Jest Generator",
          type: "llm",
          provider: "mock",
          model: "claude-3-5-sonnet-20241022",
          systemPrompt: "You are a principal QA automation engineer. Generate clean, modular Vitest unit tests with edge cases (negative numbers, null roles, high values).",
          userPromptTemplate: "Generate unit tests for this code:\n\n```typescript\n{{node_code_input.output}}\n```",
          temperature: 0.2,
          maxTokens: 1024,
          status: "idle",
        },
      },
      {
        id: "node_out_code",
        type: "output",
        position: { x: 780, y: 170 },
        data: {
          label: "Generated Test Suite",
          type: "output",
          displayFormat: "markdown",
          title: "Unit Test Specifications",
          status: "idle",
        },
      },
    ],
    edges: [
      { id: "e1", source: "node_code_input", target: "node_llm_test_gen", animated: true },
      { id: "e2", source: "node_llm_test_gen", target: "node_out_code", animated: true },
    ],
  },
];
