import React, { useState } from "react";
import {
  X,
  Copy,
  Trash2,
  Zap,
  Bot,
  GitFork,
  Code2,
  Globe,
  Terminal,
  Plus,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  MousePointerClick,
  Clock,
  SkipForward,
  FileText,
  Code,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { NodeExecutionStatus, NodeType } from "../../types/flow";
import {
  TriggerNodeData,
  LLMNodeData,
  ConditionNodeData,
  ConditionRule,
  TransformNodeData,
  HttpRequestNodeData,
  OutputNodeData,
  LLMProvider,
} from "../../types/nodes";

interface NodeTypeConfig {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  badgeBg: string;
}

const getNodeTypeConfig = (type: NodeType | string): NodeTypeConfig => {
  switch (type) {
    case "trigger":
      return {
        label: "Trigger",
        icon: <Zap className="w-4 h-4 text-amber-400" />,
        iconBg: "bg-amber-500/10 border-amber-500/20",
        badgeBg: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      };
    case "llm":
      return {
        label: "AI / LLM",
        icon: <Bot className="w-4 h-4 text-sky-400" />,
        iconBg: "bg-sky-500/10 border-sky-500/20",
        badgeBg: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      };
    case "condition":
      return {
        label: "Condition",
        icon: <GitFork className="w-4 h-4 text-purple-400" />,
        iconBg: "bg-purple-500/10 border-purple-500/20",
        badgeBg: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      };
    case "transform":
      return {
        label: "Transform",
        icon: <Code2 className="w-4 h-4 text-emerald-400" />,
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        badgeBg: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      };
    case "httpRequest":
      return {
        label: "HTTP Request",
        icon: <Globe className="w-4 h-4 text-cyan-400" />,
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        badgeBg: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      };
    case "output":
      return {
        label: "Output",
        icon: <Terminal className="w-4 h-4 text-fuchsia-400" />,
        iconBg: "bg-fuchsia-500/10 border-fuchsia-500/20",
        badgeBg: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
      };
    default:
      return {
        label: "Custom Node",
        icon: <Sliders className="w-4 h-4 text-slate-400" />,
        iconBg: "bg-slate-500/10 border-slate-500/20",
        badgeBg: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      };
  }
};

export const NodeInspector: React.FC = () => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [jsonPayloadError, setJsonPayloadError] = useState<string | null>(null);

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const duplicateNode = useFlowStore((state) => state.duplicateNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // --- 1. Empty State View ---
  if (!selectedNode) {
    return (
      <aside className="w-80 h-full bg-slate-950/95 border-l border-slate-800/80 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md z-10">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          <MousePointerClick className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">No Node Selected</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-[220px] leading-relaxed">
          Select any node on the canvas to configure its properties, prompts, logic rules, or inputs.
        </p>
        <div className="mt-6 pt-4 border-t border-slate-800/60 w-full flex flex-col gap-1.5 text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400">Del</kbd> to delete</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400">Esc</kbd> to deselect</span>
        </div>
      </aside>
    );
  }

  const nodeType = (selectedNode.type || selectedNode.data.type || "custom") as NodeType;
  const nodeData = selectedNode.data;
  const typeConfig = getNodeTypeConfig(nodeType);
  const status: NodeExecutionStatus = nodeData.status || "idle";

  const handleFieldChange = (field: string, value: any) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedNode.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1500);
    }
  };

  // --- Status Badge Helper ---
  const renderStatusBadge = () => {
    switch (status) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Running
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Success
            {nodeData.executionTimeMs !== undefined && (
              <span className="font-mono text-[9px] opacity-75">({nodeData.executionTimeMs}ms)</span>
            )}
          </span>
        );
      case "error":
        return (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full"
            title={nodeData.errorMessage}
          >
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      case "skipped":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full">
            <SkipForward className="w-3 h-3" />
            Skipped
          </span>
        );
      case "idle":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Idle
          </span>
        );
    }
  };

  // --- Type-Specific Sub-Inspectors ---

  const renderTriggerInspector = () => {
    const data = nodeData as TriggerNodeData;
    const triggerType = data.triggerType || "manual";

    const handlePrettifyContextJson = () => {
      if (!data.defaultPayload || !data.defaultPayload.trim()) {
        setJsonPayloadError(null);
        return;
      }
      try {
        const parsed = JSON.parse(data.defaultPayload);
        handleFieldChange("defaultPayload", JSON.stringify(parsed, null, 2));
        setJsonPayloadError(null);
      } catch (err: any) {
        setJsonPayloadError(err?.message || "Invalid JSON syntax");
      }
    };

    return (
      <div className="space-y-4">
        {/* Trigger Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Trigger Type
          </label>
          <select
            value={triggerType}
            onChange={(e) => {
              handleFieldChange("triggerType", e.target.value);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="manual">Manual Trigger (User Input)</option>
            <option value="scheduled">Scheduled / CRON Timer</option>
            <option value="webhook">Webhook Endpoint (HTTP POST)</option>
            <option value="file">File Upload / Event Watcher</option>
          </select>
        </div>

        {/* Scheduled / CRON Specific Configuration */}
        {triggerType === "scheduled" && (
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                CRON Schedule Expression
              </span>
            </div>
            <input
              type="text"
              value={data.cronPattern || "0 9 * * 1-5"}
              onChange={(e) => handleFieldChange("cronPattern", e.target.value)}
              placeholder="e.g. 0 9 * * 1-5"
              className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => handleFieldChange("cronPattern", "0 * * * *")}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700"
              >
                Hourly
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange("cronPattern", "0 0 * * *")}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700"
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange("cronPattern", "0 9 * * 1-5")}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700"
              >
                Weekdays 9AM
              </button>
            </div>
          </div>
        )}

        {/* Webhook Specific Configuration */}
        {triggerType === "webhook" && (
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Webhook Ingestion URL
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                POST
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={`https://api.aiflow.dev/v1/webhook/${selectedNode.id}`}
                className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`https://api.aiflow.dev/v1/webhook/${selectedNode.id}`);
                }}
                title="Copy Webhook URL"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Initial Prompt / User Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Initial Prompt / User Input
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              {(data.inputPrompt || "").length} chars
            </span>
          </div>
          <textarea
            rows={4}
            value={data.inputPrompt || ""}
            onChange={(e) => handleFieldChange("inputPrompt", e.target.value)}
            placeholder="Enter the initial prompt, topic, or seed text for workflow execution..."
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 resize-none leading-relaxed transition-colors"
          />
        </div>

        {/* Default Context JSON */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Default Context JSON (Mock Payload)
            </label>
            <button
              type="button"
              onClick={handlePrettifyContextJson}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Prettify
            </button>
          </div>
          <textarea
            rows={3}
            value={data.defaultPayload || ""}
            onChange={(e) => {
              handleFieldChange("defaultPayload", e.target.value);
              if (jsonPayloadError) setJsonPayloadError(null);
            }}
            placeholder='{\n  "user_id": 101,\n  "role": "admin",\n  "query": "market research"\n}'
            className={`w-full px-2.5 py-2 rounded-lg bg-slate-900 border text-xs text-slate-200 font-mono focus:outline-none resize-none transition-colors ${
              jsonPayloadError ? "border-rose-500 focus:border-rose-500" : "border-slate-700 focus:border-amber-500"
            }`}
          />
          {jsonPayloadError ? (
            <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3 h-3" />
              {jsonPayloadError}
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 mt-1">
              Available downstream as <code className="text-amber-300 font-mono">{"{{trigger.context}}"}</code>
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderLLMInspector = () => {
    const data = nodeData as LLMNodeData;
    const provider = data.provider || "openai";

    const MODEL_OPTIONS: Record<LLMProvider, string[]> = {
      openai: ["gpt-4o", "gpt-4o-mini", "o1", "o1-mini", "o3-mini", "gpt-4-turbo"],
      anthropic: ["claude-3-7-sonnet", "claude-3-5-sonnet", "claude-3-5-haiku", "claude-3-opus"],
      gemini: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-pro-exp"],
      groq: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b", "mixtral-8x7b-32768"],
      ollama: ["llama3.3:latest", "deepseek-r1:latest", "mistral:latest", "qwen2.5-coder:latest", "phi3:latest"],
      mock: ["mock-instant-ai", "mock-code-evaluator", "mock-sentiment-analyzer"],
    };

    // Find incoming connected nodes for variable suggestion chips
    const incomingEdgeSources = edges
      .filter((e) => e.target === selectedNode.id)
      .map((e) => e.source);
    const upstreamNodes = nodes.filter((n) => incomingEdgeSources.includes(n.id));

    const insertVariable = (varStr: string) => {
      const current = data.userPromptTemplate || "";
      const separator = current.length > 0 && !current.endsWith(" ") && !current.endsWith("\n") ? " " : "";
      handleFieldChange("userPromptTemplate", `${current}${separator}${varStr}`);
    };

    const tokenPresets = [512, 1024, 2048, 4096, 8192];

    return (
      <div className="space-y-4">
        {/* Provider & Model Selector */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => {
                const newProvider = e.target.value as LLMProvider;
                handleFieldChange("provider", newProvider);
                handleFieldChange("model", MODEL_OPTIONS[newProvider]?.[0] || "gpt-4o");
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Google Gemini</option>
              <option value="groq">Groq Llama</option>
              <option value="ollama">Ollama (Local)</option>
              <option value="mock">Simulated / Mock</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Model
            </label>
            <select
              value={data.model || MODEL_OPTIONS[provider]?.[0] || "gpt-4o"}
              onChange={(e) => handleFieldChange("model", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {MODEL_OPTIONS[provider]?.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* System Instructions */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            System Instructions
          </label>
          <textarea
            rows={3}
            value={data.systemPrompt || ""}
            onChange={(e) => handleFieldChange("systemPrompt", e.target.value)}
            placeholder="You are an expert AI system assistant..."
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
          />
        </div>

        {/* User Prompt Template */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              User Prompt Template
            </label>
            <span className="text-[10px] text-sky-400 font-mono" title="Interpolates upstream node outputs automatically">
              {"{{variable}}"} syntax
            </span>
          </div>
          <textarea
            rows={5}
            value={data.userPromptTemplate || ""}
            onChange={(e) => handleFieldChange("userPromptTemplate", e.target.value)}
            placeholder="Analyze the following input: {{trigger.output}}"
            className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
          />

          {/* Quick Variable Insertion Chips */}
          <div className="mt-2 space-y-1.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Insert Variable:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => insertVariable("{{trigger.output}}")}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-sky-950/80 border border-slate-700 hover:border-sky-500/50 text-[10px] text-slate-300 hover:text-sky-300 font-mono transition"
                title="Insert trigger node output"
              >
                + {"{{trigger.output}}"}
              </button>
              <button
                type="button"
                onClick={() => insertVariable("{{context}}")}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-sky-950/80 border border-slate-700 hover:border-sky-500/50 text-[10px] text-slate-300 hover:text-sky-300 font-mono transition"
                title="Insert full workflow context"
              >
                + {"{{context}}"}
              </button>
              {upstreamNodes.map((upstream) => (
                <button
                  key={upstream.id}
                  type="button"
                  onClick={() => insertVariable(`{{${upstream.id}.output}}`)}
                  className="px-2 py-0.5 rounded bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 hover:border-sky-400 text-[10px] text-sky-300 font-mono transition flex items-center gap-1"
                  title={`Insert output from upstream node: ${upstream.data.label || upstream.id}`}
                >
                  <span>+ {`{{${upstream.id}.output}}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hyperparameters Section */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300">Hyperparameters</span>
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Temperature</span>
              <span className="font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-500/30 text-[11px]">
                {data.temperature !== undefined ? Number(data.temperature).toFixed(2) : "0.70"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={data.temperature !== undefined ? data.temperature : 0.7}
              onChange={(e) => handleFieldChange("temperature", parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-sans">
              <span>0.0 (Precise)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Tokens Stepper & Presets */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Max Tokens</span>
              <span className="font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-500/30 text-[11px]">
                {data.maxTokens || 2048}
              </span>
            </div>
            <input
              type="number"
              min="100"
              max="8192"
              step="128"
              value={data.maxTokens || 2048}
              onChange={(e) => handleFieldChange("maxTokens", parseInt(e.target.value) || 2048)}
              className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
            />
            {/* Quick Token Presets */}
            <div className="flex items-center gap-1.5 mt-1.5">
              {tokenPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleFieldChange("maxTokens", preset)}
                  className={`flex-1 py-0.5 rounded text-[10px] font-mono border transition ${
                    (data.maxTokens || 2048) === preset
                      ? "bg-sky-950/80 border-sky-500/50 text-sky-300 font-semibold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Force JSON Mode Checkbox */}
          <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={!!data.jsonMode}
              onChange={(e) => handleFieldChange("jsonMode", e.target.checked)}
              className="mt-0.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0"
            />
            <div className="flex-1">
              <span className="font-medium text-slate-200 block">Force JSON Output Mode</span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                Enforces valid JSON response schema from the LLM provider
              </span>
            </div>
          </label>
        </div>

        {/* API Key Override (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            API Key Override <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="password"
            placeholder="Default from Settings modal"
            value={data.apiKeyOverride || ""}
            onChange={(e) => handleFieldChange("apiKeyOverride", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
    );
  };

  const renderConditionInspector = () => {
    const data = nodeData as ConditionNodeData;
    const rules = data.rules || [];

    const addRule = () => {
      const newRule: ConditionRule = {
        id: `rule_${Date.now()}`,
        field: "output",
        operator: "contains",
        value: "",
      };
      handleFieldChange("rules", [...rules, newRule]);
    };

    const updateRule = (ruleId: string, updates: Partial<ConditionRule>) => {
      const newRules = rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r));
      handleFieldChange("rules", newRules);
    };

    const removeRule = (ruleId: string) => {
      const newRules = rules.filter((r) => r.id !== ruleId);
      handleFieldChange("rules", newRules);
    };

    return (
      <div className="space-y-4">
        {/* Logical Operator Mode Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Logical Combination Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => handleFieldChange("logicOperator", "AND")}
              className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                (data.logicOperator || "AND") === "AND"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>AND</span>
              <span className="text-[10px] font-normal opacity-80">(All Match)</span>
            </button>
            <button
              type="button"
              onClick={() => handleFieldChange("logicOperator", "OR")}
              className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                data.logicOperator === "OR"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>OR</span>
              <span className="text-[10px] font-normal opacity-80">(Any Match)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Rule List Manager */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Evaluation Rules
              </label>
              <span className="px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300 font-mono font-medium">
                {rules.length}
              </span>
            </div>
            <button
              type="button"
              onClick={addRule}
              className="flex items-center gap-1 px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-[11px] text-purple-300 hover:text-purple-200 font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Rule
            </button>
          </div>

          {rules.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 text-center space-y-1.5">
              <p className="text-xs text-slate-400 font-medium">No conditional rules configured</p>
              <p className="text-[11px] text-slate-500">
                Default behavior routes all execution directly to the <span className="text-emerald-400 font-medium">True</span> branch.
              </p>
              <button
                type="button"
                onClick={addRule}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add your first rule
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id || idx}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5 relative group hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono font-semibold text-purple-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Rule #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="p-1 rounded hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition"
                      title="Delete Rule"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Field Path
                      </label>
                      <input
                        type="text"
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                        placeholder="e.g. output or data.status"
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Comparison Operator
                      </label>
                      <select
                        value={rule.operator}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            operator: e.target.value as ConditionRule["operator"],
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="contains">contains</option>
                        <option value="equals">equals (==)</option>
                        <option value="regex">matches regex pattern</option>
                        <option value="gt">greater than (&gt;)</option>
                        <option value="lt">less than (&lt;)</option>
                        <option value="isNotEmpty">is not empty / defined</option>
                      </select>
                    </div>

                    {rule.operator !== "isNotEmpty" && (
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                          Target Value
                        </label>
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          placeholder="Expected target value..."
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Port Routing Visual Legend */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>Port Routing Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-emerald-300 block font-medium">True Branch</strong>
                <span className="text-[10px] text-slate-400">Right top handle (matches condition)</span>
              </div>
            </div>
            <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 flex items-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-rose-300 block font-medium">False Branch</strong>
                <span className="text-[10px] text-slate-400">Right bottom handle (fallback path)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransformInspector = () => {
    const data = nodeData as TransformNodeData;
    const transformType = data.transformType || "javascript";

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Transform Strategy
          </label>
          <select
            value={transformType}
            onChange={(e) =>
              handleFieldChange("transformType", e.target.value as TransformNodeData["transformType"])
            }
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="javascript">Custom JavaScript Function</option>
            <option value="jsonExtract">JSONPath / Key Extraction</option>
            <option value="template">String Interpolation Template</option>
          </select>
        </div>

        {transformType === "javascript" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Sandbox JS Function
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">
                (input, context) =&gt; ...
              </span>
            </div>
            <textarea
              rows={8}
              value={data.code || ""}
              onChange={(e) => handleFieldChange("code", e.target.value)}
              placeholder="return input.trim().toUpperCase();"
              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>
        )}

        {transformType === "jsonExtract" && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              JSON Key Path (e.g. data.items[0].id)
            </label>
            <input
              type="text"
              value={data.jsonPath || ""}
              onChange={(e) => handleFieldChange("jsonPath", e.target.value)}
              placeholder="response.choices[0].message.content"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {transformType === "template" && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Template String
            </label>
            <textarea
              rows={6}
              value={data.templateString || ""}
              onChange={(e) => handleFieldChange("templateString", e.target.value)}
              placeholder="Summary: {{input.summary}}&#10;Date: {{input.date}}"
              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    );
  };

  const renderHttpRequestInspector = () => {
    const data = nodeData as HttpRequestNodeData;
    const headers = data.headers || [];

    const addHeader = () => {
      handleFieldChange("headers", [...headers, { key: "", value: "" }]);
    };

    const updateHeader = (index: number, key: string, value: string) => {
      const newHeaders = [...headers];
      newHeaders[index] = { key, value };
      handleFieldChange("headers", newHeaders);
    };

    const removeHeader = (index: number) => {
      const newHeaders = headers.filter((_, i) => i !== index);
      handleFieldChange("headers", newHeaders);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="w-28">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Method
            </label>
            <select
              value={data.method || "GET"}
              onChange={(e) =>
                handleFieldChange("method", e.target.value as HttpRequestNodeData["method"])
              }
              className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Endpoint URL
            </label>
            <input
              type="text"
              value={data.url || ""}
              onChange={(e) => handleFieldChange("url", e.target.value)}
              placeholder="https://api.service.com/v1/resource"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Headers ({headers.length})
            </label>
            <button
              type="button"
              onClick={addHeader}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Header
            </button>
          </div>

          {headers.map((hdr, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input
                type="text"
                value={hdr.key}
                onChange={(e) => updateHeader(i, e.target.value, hdr.value)}
                placeholder="Header Name"
                className="w-1/2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={hdr.value}
                onChange={(e) => updateHeader(i, hdr.key, e.target.value)}
                placeholder="Value"
                className="w-1/2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => removeHeader(i)}
                className="p-1 text-slate-500 hover:text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {data.method !== "GET" && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Request Body (JSON / Raw)
            </label>
            <textarea
              rows={4}
              value={data.bodyPayload || ""}
              onChange={(e) => handleFieldChange("bodyPayload", e.target.value)}
              placeholder='{"query": "{{trigger.output}}"}'
              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    );
  };

  const renderOutputInspector = () => {
    const data = nodeData as OutputNodeData;
    const format = data.displayFormat || "text";
    const hasOutput = data.lastOutput !== undefined && data.lastOutput !== null;

    const formattedOutputStr = hasOutput
      ? typeof data.lastOutput === "object"
        ? JSON.stringify(data.lastOutput, null, 2)
        : String(data.lastOutput)
      : "";

    const handleCopyOutput = () => {
      if (!hasOutput || !navigator.clipboard) return;
      navigator.clipboard.writeText(formattedOutputStr);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 1500);
    };

    // Helper to render table format if data is structured array
    const renderTableContent = () => {
      let arrayData: any[] = [];
      if (Array.isArray(data.lastOutput)) {
        arrayData = data.lastOutput;
      } else if (typeof data.lastOutput === "string") {
        try {
          const parsed = JSON.parse(data.lastOutput);
          if (Array.isArray(parsed)) arrayData = parsed;
        } catch {}
      }

      if (arrayData.length === 0 || typeof arrayData[0] !== "object" || arrayData[0] === null) {
        return (
          <div className="space-y-1.5">
            <div className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-1 rounded">
              Output is not a structured array of records. Displaying raw data:
            </div>
            <pre className="text-emerald-300 font-mono text-[11px] whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
              {formattedOutputStr}
            </pre>
          </div>
        );
      }

      const headers = Object.keys(arrayData[0]).slice(0, 5); // limit preview headers to 5

      return (
        <div className="overflow-x-auto max-h-48 rounded border border-slate-800">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800 sticky top-0">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="p-1.5 font-semibold text-fuchsia-300 border-r border-slate-800 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 bg-slate-950/80">
              {arrayData.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  {headers.map((h) => (
                    <td key={h} className="p-1.5 border-r border-slate-800 last:border-r-0 truncate max-w-[120px]">
                      {typeof row[h] === "object" ? JSON.stringify(row[h]) : String(row[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {arrayData.length > 10 && (
            <div className="p-1 bg-slate-900/60 text-[10px] text-slate-500 text-center">
              Showing 10 of {arrayData.length} records
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Output Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Display Output Format
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "text", label: "Plain Text", icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: "markdown", label: "Markdown", icon: <FileText className="w-3.5 h-3.5" /> },
              { id: "json", label: "JSON Tree", icon: <Code className="w-3.5 h-3.5" /> },
              { id: "table", label: "Data Table", icon: <TableIcon className="w-3.5 h-3.5" /> },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => handleFieldChange("displayFormat", fmt.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  format === fmt.id
                    ? "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50 shadow-sm"
                    : "bg-slate-900 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {fmt.icon}
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Read-Only Output Preview Card */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Latest Executed Result
            </label>
            {hasOutput && (
              <button
                type="button"
                onClick={handleCopyOutput}
                className="flex items-center gap-1 text-[11px] text-fuchsia-400 hover:text-fuchsia-300 font-medium transition"
              >
                {copiedOutput ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Output
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 min-h-[100px] max-h-64 overflow-y-auto">
            {!hasOutput ? (
              <div className="flex flex-col items-center justify-center h-24 text-center text-slate-500 text-xs italic space-y-1">
                <Terminal className="w-5 h-5 text-slate-600 mb-1" />
                <span>No output data yet</span>
                <span className="text-[10px] text-slate-600 not-italic">
                  Run the workflow or trigger node to view output
                </span>
              </div>
            ) : format === "table" ? (
              renderTableContent()
            ) : format === "json" ? (
              <pre className="text-emerald-300 font-mono text-[11px] whitespace-pre-wrap break-all">
                {formattedOutputStr}
              </pre>
            ) : format === "markdown" ? (
              <div className="text-xs text-slate-200 prose prose-invert max-w-none font-sans leading-relaxed whitespace-pre-wrap">
                {formattedOutputStr}
              </div>
            ) : (
              <pre className="text-slate-200 font-mono text-[11px] whitespace-pre-wrap break-all">
                {formattedOutputStr}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-80 h-full bg-slate-950/95 border-l border-slate-800/80 flex flex-col select-none overflow-hidden z-10 backdrop-blur-md">
      {/* --- 2. Header & Quick Actions --- */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Dynamic Type Icon & Node ID */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl border flex items-center justify-center flex-shrink-0 ${typeConfig.iconBg}`}
              title={`${typeConfig.label} Node`}
            >
              {typeConfig.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 tracking-wide truncate">
                  {typeConfig.label}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                title="Click to copy Node ID"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 font-mono transition-colors group cursor-pointer"
              >
                <span className="truncate max-w-[130px]">{selectedNode.id}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons: Duplicate, Delete, Close/Deselect */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => duplicateNode(selectedNode.id)}
              title="Duplicate Node"
              aria-label="Duplicate Node"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteNode(selectedNode.id)}
              title="Delete Node"
              aria-label="Delete Node"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              title="Close / Deselect"
              aria-label="Close / Deselect"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
          <span className="text-[11px] font-medium text-slate-400">Status</span>
          {renderStatusBadge()}
        </div>
      </div>

      {/* --- 3. Main Form Fields & Common Metadata --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Common Shared Inputs: Node Name / Title and Description / Notes */}
        <div className="space-y-3 pb-4 border-b border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Node Name / Title
            </label>
            <input
              type="text"
              value={nodeData.label || ""}
              onChange={(e) => handleFieldChange("label", e.target.value)}
              placeholder="e.g. AI Prompt Processor"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-medium transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={nodeData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="What does this step accomplish?"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-sky-500 resize-none transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Dynamic Node-Specific Properties */}
        {nodeType === "trigger" && renderTriggerInspector()}
        {nodeType === "llm" && renderLLMInspector()}
        {nodeType === "condition" && renderConditionInspector()}
        {nodeType === "transform" && renderTransformInspector()}
        {nodeType === "httpRequest" && renderHttpRequestInspector()}
        {nodeType === "output" && renderOutputInspector()}
      </div>
    </aside>
  );
};
