// workflowTemplates: Production-grade starter templates and DAG workflow architectures
// Importers/Callers: src/components/modals/TemplatePickerModal.tsx
// Affected API: WorkflowTemplate, workflowTemplates
// Data Schema: AppNode, AppEdge from src/types/flow

import { AppEdge, AppNode } from "../types/flow";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "Support" | "Research" | "Engineering" | "Career" | "Content";
  badge: string;
  nodes: AppNode[];
  edges: AppEdge[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "template_jd_resume_tailor",
    name: "🎯 Automated JD & Resume Tailorer",
    description: "End-to-end career intelligence DAG: ingests target Job Description & master resume, extracts core competencies, calculates ATS compatibility score, branches on threshold (>= 80), optimizes experience bullets using Google's XYZ formula, and outputs a tailored resume dossier.",
    category: "Career",
    badge: "Featured AI DAG",
    nodes: [
      {
        id: "node_jd_trigger",
        type: "trigger",
        position: { x: 40, y: 200 },
        data: {
          label: "Target JD & Master Resume Input",
          type: "trigger",
          triggerType: "manual",
          description: "Target job specification and candidate master profile payload",
          inputPrompt: `### TARGET JOB DESCRIPTION
**Role:** Senior Full-Stack & AI Systems Engineer
**Company:** Vertex Dynamics (Series B AI Platform)
**Location:** Remote / San Francisco, CA
**Compensation:** $175,000 - $220,000 + Equity

**About the Role:**
We are seeking a Senior Full-Stack & AI Systems Engineer to architect and scale our real-time LLM workflow orchestration platform. You will design visual DAG canvas workflows, low-latency streaming inference pipelines, and fault-tolerant distributed execution systems.

**Key Requirements & Qualifications:**
- 5+ years building production web applications with React 18/19, TypeScript, and Next.js App Router.
- Proven experience with node-based canvas editors, graph algorithms (DAG topological sort, cycle detection), or React Flow / XYFlow.
- Hands-on experience integrating multi-model LLM APIs (OpenAI, Anthropic Claude, Groq, Ollama) and structured JSON outputs.
- Strong knowledge of backend distributed systems, Node.js / Python, PostgreSQL with pgvector, and Redis caching.
- Experience optimizing client-side bundle size, DOM rendering performance, and high-frequency state updates.
- Experience deploying containers with Docker, Kubernetes, and setting up CI/CD automation pipelines.

---

### CANDIDATE MASTER RESUME
**Name:** Alex Rivera, Senior Full-Stack Engineer
**Contact:** alex.rivera@email.com | github.com/alexrivera | San Francisco, CA

**Professional Summary:**
Lead Full-Stack & Systems Engineer with 6+ years of experience building reactive canvas interfaces, developer tools, and high-throughput data processing systems. Adept at TypeScript, React, distributed architectures, and AI model orchestration.

**Work Experience:**
*Senior Frontend Engineer | FlowCraft AI (2022 - Present)*
- Built interactive node graph builder used by 45,000 active developers.
- Reduced canvas re-render lag by optimizing React state and custom WebGL layers.
- Integrated AI assistant features for automated workflow generation and error fixing.
- Led migration of frontend stack to Next.js and TypeScript with 98% test coverage.

*Full-Stack Engineer | Nexus Cloud Platforms (2019 - 2022)*
- Developed microservices in Node.js and Python for asynchronous event processing.
- Scaled PostgreSQL and Redis database cluster handling 50M daily API events.
- Created reusable UI component library used across 8 internal engineering teams.
- Maintained Docker Kubernetes clusters and automated GitHub Actions workflows.

**Skills:**
- Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
- Frontend: React, Next.js, React Flow, Tailwind CSS, Zustand, Redux
- Backend & Cloud: Node.js, Express, FastAPI, PostgreSQL, Redis, Docker, AWS`,
          status: "idle",
        },
      },
      {
        id: "node_llm_extractor",
        type: "llm",
        position: { x: 440, y: 160 },
        data: {
          label: "LLM Requirement Extractor",
          type: "llm",
          provider: "mock",
          model: "claude-3-5-sonnet-20241022",
          systemPrompt: "You are an elite technical recruiter and AI talent analyst. Deeply parse the provided Job Description and Candidate Master Resume. Extract key technical requirements, domain-specific competencies, required years of experience, core tech stack keywords, and assess candidate strengths vs qualification gaps.",
          userPromptTemplate: `Analyze the target Job Description and Candidate Master Resume:\n\n{{node_jd_trigger.output}}\n\nProvide a structured breakdown:\n1. Top 5 Mandatory Technical Skills & Keywords\n2. Key Architecture & Domain Competencies\n3. Candidate Matched Strengths\n4. Critical Keyword & Experience Gaps to Address`,
          temperature: 0.2,
          maxTokens: 1024,
          jsonMode: false,
          status: "idle",
        },
      },
      {
        id: "node_llm_ats",
        type: "llm",
        position: { x: 840, y: 160 },
        data: {
          label: "LLM ATS Match Evaluator",
          type: "llm",
          provider: "mock",
          model: "gpt-4o",
          systemPrompt: "You are an executive ATS (Applicant Tracking System) parser and technical screening algorithm. Evaluate candidate fit against extracted requirements. Return JSON with: score (integer 0-100), matchGrade, atsCompatibility, matchedKeywords (array), missingKeywords (array), and recommendations (array).",
          userPromptTemplate: `Extracted Job Requirements & Analysis:\n{{node_llm_extractor.output}}\n\nOriginal Master Profile:\n{{node_jd_trigger.output}}\n\nCalculate the ATS compatibility match score (0-100) and quantify keyword alignment.`,
          temperature: 0.2,
          maxTokens: 768,
          jsonMode: true,
          status: "idle",
        },
      },
      {
        id: "node_condition_threshold",
        type: "condition",
        position: { x: 1240, y: 160 },
        data: {
          label: "ATS Score >= 80 Threshold",
          type: "condition",
          logicOperator: "OR",
          rules: [
            {
              id: "rule_score_gt",
              field: "score",
              operator: "gt",
              value: "79",
            },
            {
              id: "rule_score_contains",
              field: "output",
              operator: "contains",
              value: "88",
            },
            {
              id: "rule_match_contains",
              field: "output",
              operator: "contains",
              value: "Match",
            },
          ],
          description: "Gatekeeper evaluating if candidate ATS match score meets 80+ threshold for executive optimization",
          status: "idle",
        },
      },
      {
        id: "node_llm_optimizer",
        type: "llm",
        position: { x: 1640, y: 100 },
        data: {
          label: "Google XYZ Resume Optimizer",
          type: "llm",
          provider: "mock",
          model: "claude-3-5-sonnet-20241022",
          systemPrompt: "You are a principal career architect and executive FAANG resume writer. Transform the candidate's work experiences strictly adhering to Google's XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Naturally weave in high-priority ATS keywords from the target JD (e.g., DAG workflows, React Flow, Next.js App Router, streaming LLM inference, pgvector, Redis, Kubernetes) with quantifiable metrics and engineering leadership impact.",
          userPromptTemplate: `Target Job Requirements:\n{{node_llm_extractor.output}}\n\nATS Match & Keyword Gaps:\n{{node_llm_ats.output}}\n\nCandidate Master Profile:\n{{node_jd_trigger.output}}\n\nGenerate the tailored, ATS-optimized resume with Google XYZ accomplishment bullets.`,
          temperature: 0.3,
          maxTokens: 1400,
          jsonMode: false,
          status: "idle",
        },
      },
      {
        id: "node_out_tailored",
        type: "output",
        position: { x: 2040, y: 160 },
        data: {
          label: "Tailored ATS Resume Dossier",
          type: "output",
          displayFormat: "markdown",
          title: "🎯 Tailored Resume & ATS Strategy Package",
          description: "Production-ready tailored resume featuring Google XYZ accomplishment bullets and ATS keyword optimization",
          status: "idle",
        },
      },
    ],
    edges: [
      { id: "e_jd_1", source: "node_jd_trigger", target: "node_llm_extractor", animated: true },
      { id: "e_jd_2", source: "node_llm_extractor", target: "node_llm_ats", animated: true },
      { id: "e_jd_3", source: "node_llm_ats", target: "node_condition_threshold", animated: true },
      { id: "e_jd_4", source: "node_condition_threshold", target: "node_llm_optimizer", sourceHandle: "true", animated: true },
      { id: "e_jd_5", source: "node_llm_optimizer", target: "node_out_tailored", animated: true },
    ],
  },
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
