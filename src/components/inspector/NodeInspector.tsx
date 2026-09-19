// NodeInspector: High-end interactive property inspector panel with sub-inspectors, dynamic upstream variable chips, syntax editors, and live previews
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (nodes, edges, selectedNodeId, updateNodeData, deleteNode, duplicateNode), useSettingsStore (theme)
// Data Schema: NodeExecutionStatus, NodeType from src/types/flow.ts, NodeData interfaces from src/types/nodes.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState } from "react";
import {
  X,
  Copy,
  Trash2,
  Zap,
  GitBranch,
  Globe,
  Terminal,
  Plus,
  Sliders,
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
  Braces,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
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
  category: string;
  icon: React.ReactNode;
  iconStyle: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  lightIconStyle: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  accentBorderFocus: string;
  accentRing: string;
  lightAccentBorderFocus: string;
  lightAccentRing: string;
}

const getNodeTypeConfig = (type: NodeType | string): NodeTypeConfig => {
  switch (type) {
    case "trigger":
      return {
        label: "Manual Trigger",
        category: "Entrypoint",
        icon: <Zap className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-amber-500/10",
          border: "border-amber-500/25",
          text: "text-amber-400",
          glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-700",
          glow: "shadow-[0_2px_8px_rgba(245,158,11,0.2)]",
        },
        accentBorderFocus: "focus:border-amber-500/50",
        accentRing: "focus:ring-amber-500/10",
        lightAccentBorderFocus: "focus:border-amber-600/70",
        lightAccentRing: "focus:ring-amber-500/30",
      };
    case "llm":
      return {
        label: "LLM Agent",
        category: "AI Agent",
        icon: <Sparkles className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-sky-500/10",
          border: "border-sky-500/25",
          text: "text-sky-400",
          glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-sky-500/10",
          border: "border-sky-500/30",
          text: "text-sky-700",
          glow: "shadow-[0_2px_8px_rgba(56,189,248,0.2)]",
        },
        accentBorderFocus: "focus:border-sky-500/50",
        accentRing: "focus:ring-sky-500/10",
        lightAccentBorderFocus: "focus:border-sky-600/70",
        lightAccentRing: "focus:ring-sky-500/30",
      };
    case "condition":
      return {
        label: "Condition (IF/ELSE)",
        category: "Logic & Branching",
        icon: <GitBranch className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-purple-500/10",
          border: "border-purple-500/25",
          text: "text-purple-400",
          glow: "shadow-[0_0_12px_rgba(168,85,247,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          text: "text-purple-700",
          glow: "shadow-[0_2px_8px_rgba(168,85,247,0.2)]",
        },
        accentBorderFocus: "focus:border-purple-500/50",
        accentRing: "focus:ring-purple-500/10",
        lightAccentBorderFocus: "focus:border-purple-600/70",
        lightAccentRing: "focus:ring-purple-500/30",
      };
    case "transform":
      return {
        label: "JS Transform",
        category: "Data Transforms",
        icon: <Braces className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/25",
          text: "text-emerald-400",
          glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-700",
          glow: "shadow-[0_2px_8px_rgba(16,185,129,0.2)]",
        },
        accentBorderFocus: "focus:border-emerald-500/50",
        accentRing: "focus:ring-emerald-500/10",
        lightAccentBorderFocus: "focus:border-emerald-600/70",
        lightAccentRing: "focus:ring-emerald-500/30",
      };
    case "httpRequest":
      return {
        label: "HTTP Request",
        category: "Integrations",
        icon: <Globe className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/25",
          text: "text-cyan-400",
          glow: "shadow-[0_0_12px_rgba(6,182,212,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-cyan-500/10",
          border: "border-cyan-500/30",
          text: "text-cyan-700",
          glow: "shadow-[0_2px_8px_rgba(6,182,212,0.2)]",
        },
        accentBorderFocus: "focus:border-cyan-500/50",
        accentRing: "focus:ring-cyan-500/10",
        lightAccentBorderFocus: "focus:border-cyan-600/70",
        lightAccentRing: "focus:ring-cyan-500/30",
      };
    case "output":
      return {
        label: "Output Terminal",
        category: "Output Viewers",
        icon: <Terminal className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-rose-500/10",
          border: "border-rose-500/25",
          text: "text-rose-400",
          glow: "shadow-[0_0_12px_rgba(244,63,94,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          text: "text-rose-700",
          glow: "shadow-[0_2px_8px_rgba(244,63,94,0.2)]",
        },
        accentBorderFocus: "focus:border-rose-500/50",
        accentRing: "focus:ring-rose-500/10",
        lightAccentBorderFocus: "focus:border-rose-600/70",
        lightAccentRing: "focus:ring-rose-500/30",
      };
    default:
      return {
        label: "Custom Node",
        category: "Component",
        icon: <Sliders className="w-4 h-4" strokeWidth={2.2} />,
        iconStyle: {
          bg: "bg-slate-500/10",
          border: "border-slate-500/25",
          text: "text-slate-400",
          glow: "shadow-[0_0_12px_rgba(100,116,139,0.25)]",
        },
        lightIconStyle: {
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          text: "text-slate-700",
          glow: "shadow-[0_2px_8px_rgba(100,116,139,0.2)]",
        },
        accentBorderFocus: "focus:border-slate-500/50",
        accentRing: "focus:ring-slate-500/10",
        lightAccentBorderFocus: "focus:border-slate-600/70",
        lightAccentRing: "focus:ring-slate-500/30",
      };
  }
};

export const NodeInspector: React.FC = () => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [jsonPayloadError, setJsonPayloadError] = useState<string | null>(null);

  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

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
      <aside
        className={`w-80 h-full flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md z-10 relative overflow-hidden transition-colors duration-200 ${
          isLight
            ? "bg-[#FAF8F5]/95 border-l border-[#E7E2D8] text-[#2C2724] shadow-[-2px_0_12px_rgba(0,0,0,0.03)]"
            : "bg-[#080d18] border-l border-slate-800/60 text-slate-100"
        }`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isLight ? "bg-amber-500/5" : "bg-sky-500/5"
          }`}
        />

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
            isLight
              ? "bg-[#F5F2EB] border border-[#E7E2D8] text-[#7A7269] shadow-[0_4px_16px_rgba(180,165,145,0.2)]"
              : "bg-[#0c1220] border border-slate-800/80 text-slate-400 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          }`}
        >
          <MousePointerClick
            className={`w-5 h-5 ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}
          />
        </div>
        <h3
          className={`text-xs font-semibold tracking-tight ${
            isLight ? "text-[#2C2724]" : "text-slate-100"
          }`}
        >
          No Node Selected
        </h3>
        <p
          className={`text-[11px] mt-1 max-w-[210px] leading-relaxed ${
            isLight ? "text-[#7A7269]" : "text-slate-400"
          }`}
        >
          Select any node on the canvas to configure parameters, prompts, logic rules, or payload data.
        </p>

        {/* Keyboard Shortcuts Helper */}
        <div
          className={`mt-6 pt-4 border-t w-full flex flex-col gap-2 text-[11px] ${
            isLight ? "border-[#E7E2D8] text-[#7A7269]" : "border-slate-800/60 text-slate-400"
          }`}
        >
          <div
            className={`flex items-center justify-between px-2 py-1 rounded-lg border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A]"
                : "bg-slate-900/40 border-slate-800/50"
            }`}
          >
            <span>Delete node</span>
            <kbd
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isLight
                  ? "bg-[#EBE6DD] border-[#D8D1C5] text-[#2C2724]"
                  : "bg-slate-900 border-slate-800 text-slate-300"
              }`}
            >
              Del
            </kbd>
          </div>
          <div
            className={`flex items-center justify-between px-2 py-1 rounded-lg border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A]"
                : "bg-slate-900/40 border-slate-800/50"
            }`}
          >
            <span>Deselect node</span>
            <kbd
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isLight
                  ? "bg-[#EBE6DD] border-[#D8D1C5] text-[#2C2724]"
                  : "bg-slate-900 border-slate-800 text-slate-300"
              }`}
            >
              Esc
            </kbd>
          </div>
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
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full animate-pulse ${
              isLight
                ? "text-sky-800 bg-sky-50 border border-sky-300 shadow-[0_1px_4px_rgba(56,189,248,0.2)]"
                : "text-sky-400 bg-sky-950/70 border border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]"
            }`}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>RUNNING</span>
          </span>
        );
      case "success":
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
              isLight
                ? "text-emerald-800 bg-emerald-50 border border-emerald-300 shadow-[0_1px_4px_rgba(16,185,129,0.2)]"
                : "text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-ping ${
                isLight ? "bg-emerald-600" : "bg-emerald-400"
              }`}
            />
            <span>{nodeData.executionTimeMs !== undefined ? `${nodeData.executionTimeMs}ms` : "SUCCESS"}</span>
          </span>
        );
      case "error":
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
              isLight
                ? "text-rose-800 bg-rose-50 border border-rose-300 shadow-[0_1px_4px_rgba(244,63,94,0.2)]"
                : "text-rose-400 bg-rose-950/70 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
            }`}
            title={nodeData.errorMessage}
          >
            <AlertCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      case "skipped":
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              isLight
                ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                : "text-slate-400 bg-slate-900 border-slate-800"
            }`}
          >
            <SkipForward className="w-3 h-3" />
            <span>SKIPPED</span>
          </span>
        );
      case "idle":
      default:
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
              isLight
                ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                : "text-slate-400 bg-slate-900/60 border-slate-800/60"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>IDLE</span>
          </span>
        );
    }
  };

  // --- Common Input Styles Helper ---
  const inputClass = isLight
    ? "w-full px-2.5 py-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#FAF8F5] border border-[#E7E2D8] text-xs text-[#2C2724] placeholder-[#9C9287] focus:outline-none focus:border-amber-600/70 focus:ring-2 focus:ring-amber-500/20 font-sans transition-all"
    : "w-full px-2.5 py-1.5 rounded-lg bg-[#060a12]/80 hover:bg-[#060a12] border border-slate-800/80 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 font-sans transition-all";

  const labelClass = `block text-[11px] font-semibold mb-1.5 ${
    isLight ? "text-[#443E3A]" : "text-slate-300"
  }`;

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

    const handleCopyWebhook = () => {
      const url = `https://api.aiflow.dev/v1/webhook/${selectedNode.id}`;
      navigator.clipboard.writeText(url);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 1500);
    };

    return (
      <div className="space-y-4">
        {/* Trigger Type Selection */}
        <div>
          <label className={labelClass}>
            Trigger Type
          </label>
          <select
            value={triggerType}
            onChange={(e) => {
              handleFieldChange("triggerType", e.target.value);
            }}
            className={inputClass + " cursor-pointer"}
          >
            <option value="manual">Manual Trigger (Interactive User Prompt)</option>
            <option value="scheduled">Scheduled / CRON Expression</option>
            <option value="webhook">Webhook Endpoint (HTTP POST)</option>
            <option value="file">File Upload / Event Watcher</option>
          </select>
        </div>

        {/* Scheduled / CRON Specific Configuration */}
        {triggerType === "scheduled" && (
          <div
            className={`p-3 rounded-xl border space-y-2.5 ${
              isLight
                ? "bg-[#F5F2EB] border-amber-500/30 text-[#2C2724]"
                : "bg-[#060a12]/80 border-amber-500/30"
            }`}
          >
            <div
              className={`flex items-center justify-between text-xs font-medium ${
                isLight ? "text-amber-800" : "text-amber-400"
              }`}
            >
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
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none ${
                isLight
                  ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-amber-600/70"
                  : "bg-slate-950 border-slate-800 text-slate-200 focus:border-amber-500/60"
              }`}
            />
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`text-[10px] ${isLight ? "text-[#7A7269]" : "text-slate-500"}`}>
                Presets:
              </span>
              {[
                { label: "Hourly", val: "0 * * * *" },
                { label: "Daily", val: "0 0 * * *" },
                { label: "Weekdays 9AM", val: "0 9 * * 1-5" },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleFieldChange("cronPattern", p.val)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition ${
                    isLight
                      ? "bg-[#EBE6DD] hover:bg-amber-100 text-[#443E3A] hover:text-amber-800 border-[#D8D1C5]"
                      : "bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border-slate-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Webhook Specific Configuration */}
        {triggerType === "webhook" && (
          <div
            className={`p-3 rounded-xl border space-y-2.5 ${
              isLight
                ? "bg-[#F5F2EB] border-amber-500/30 text-[#2C2724]"
                : "bg-[#060a12]/80 border-amber-500/30"
            }`}
          >
            <div
              className={`flex items-center justify-between text-xs font-medium ${
                isLight ? "text-amber-800" : "text-amber-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Webhook Ingestion URL
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                  isLight
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                POST
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={`https://api.aiflow.dev/v1/webhook/${selectedNode.id}`}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono select-all focus:outline-none ${
                  isLight
                    ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724]"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={handleCopyWebhook}
                title="Copy Webhook URL"
                className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                  isLight
                    ? "bg-[#EBE6DD] hover:bg-[#D8D1C5] border-[#D8D1C5] text-[#2C2724]"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                }`}
              >
                {copiedWebhook ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Initial Prompt / User Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>
              Initial Prompt / User Input
            </label>
            <span
              className={`text-[10px] font-mono ${
                isLight ? "text-[#8E8275]" : "text-slate-500"
              }`}
            >
              {(data.inputPrompt || "").length} chars
            </span>
          </div>
          <textarea
            rows={4}
            value={data.inputPrompt || ""}
            onChange={(e) => handleFieldChange("inputPrompt", e.target.value)}
            placeholder="Enter seed prompt, topic, or question for workflow execution..."
            className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-amber-600/70 focus:ring-2 focus:ring-amber-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
            }`}
          />
        </div>

        {/* Default Context JSON */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>
              Default Context JSON (Mock Payload)
            </label>
            <button
              type="button"
              onClick={handlePrettifyContextJson}
              className={`text-[10px] flex items-center gap-1 font-medium transition-colors ${
                isLight
                  ? "text-amber-800 hover:text-amber-900"
                  : "text-amber-400 hover:text-amber-300"
              }`}
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
            className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none transition-all leading-relaxed ${
              jsonPayloadError
                ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                : isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-amber-600/70 focus:ring-2 focus:ring-amber-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
            }`}
          />
          {jsonPayloadError ? (
            <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{jsonPayloadError}</span>
            </p>
          ) : (
            <p className={`text-[10px] mt-1 ${isLight ? "text-[#7A7269]" : "text-slate-500"}`}>
              Available downstream as{" "}
              <code className={isLight ? "text-amber-800 font-mono font-semibold" : "text-amber-300/90 font-mono"}>
                {"{{trigger.context}}"}
              </code>
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
            <label className={labelClass}>
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => {
                const newProvider = e.target.value as LLMProvider;
                handleFieldChange("provider", newProvider);
                handleFieldChange("model", MODEL_OPTIONS[newProvider]?.[0] || "gpt-4o");
              }}
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-sans cursor-pointer transition-all ${
                isLight
                  ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] focus:border-sky-600/70 focus:ring-2 focus:ring-sky-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
              }`}
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
            <label className={labelClass}>
              Model
            </label>
            <select
              value={data.model || MODEL_OPTIONS[provider]?.[0] || "gpt-4o"}
              onChange={(e) => handleFieldChange("model", e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-sans cursor-pointer transition-all ${
                isLight
                  ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] focus:border-sky-600/70 focus:ring-2 focus:ring-sky-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
              }`}
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
          <label className={labelClass}>
            System Instructions
          </label>
          <textarea
            rows={3}
            value={data.systemPrompt || ""}
            onChange={(e) => handleFieldChange("systemPrompt", e.target.value)}
            placeholder="You are an expert AI system assistant..."
            className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-sky-600/70 focus:ring-2 focus:ring-sky-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
            }`}
          />
        </div>

        {/* User Prompt Template */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>
              User Prompt Template
            </label>
            <span
              className={`text-[10px] font-mono ${
                isLight ? "text-sky-700" : "text-sky-400"
              }`}
              title="Interpolates upstream node outputs automatically"
            >
              {"{{variable}}"} syntax
            </span>
          </div>
          <textarea
            rows={4}
            value={data.userPromptTemplate || ""}
            onChange={(e) => handleFieldChange("userPromptTemplate", e.target.value)}
            placeholder="Analyze the following input: {{trigger.output}}"
            className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-sky-600/70 focus:ring-2 focus:ring-sky-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
            }`}
          />

          {/* Quick Variable Insertion Chips */}
          <div className="mt-2 space-y-1.5">
            <span
              className={`text-[10px] font-medium uppercase tracking-wider block font-mono ${
                isLight ? "text-[#8E8275]" : "text-slate-500"
              }`}
            >
              Upstream Variables:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => insertVariable("{{trigger.output}}")}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all active:scale-95 ${
                  isLight
                    ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] border-[#E7E2D8] hover:border-sky-500/50 text-[#443E3A] hover:text-sky-800"
                    : "bg-[#0c1220] hover:bg-sky-950/80 border-slate-800/80 hover:border-sky-500/50 text-slate-300 hover:text-sky-300"
                }`}
                title="Insert trigger node output"
              >
                + {"{{trigger.output}}"}
              </button>
              <button
                type="button"
                onClick={() => insertVariable("{{context}}")}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all active:scale-95 ${
                  isLight
                    ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] border-[#E7E2D8] hover:border-sky-500/50 text-[#443E3A] hover:text-sky-800"
                    : "bg-[#0c1220] hover:bg-sky-950/80 border-slate-800/80 hover:border-sky-500/50 text-slate-300 hover:text-sky-300"
                }`}
                title="Insert full workflow context"
              >
                + {"{{context}}"}
              </button>
              {upstreamNodes.map((upstream) => (
                <button
                  key={upstream.id}
                  type="button"
                  onClick={() => insertVariable(`{{${upstream.id}.output}}`)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all active:scale-95 flex items-center gap-1 ${
                    isLight
                      ? "bg-sky-50 hover:bg-sky-100 border-sky-200 hover:border-sky-400 text-sky-800"
                      : "bg-sky-950/40 hover:bg-sky-900/60 border-sky-500/30 hover:border-sky-400 text-sky-300"
                  }`}
                  title={`Insert output from upstream node: ${upstream.data.label || upstream.id}`}
                >
                  <span>+ {`{{${upstream.id}.output}}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div
          className={`p-3.5 rounded-xl border space-y-3.5 ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724]"
              : "bg-[#060a12]/80 border-slate-800/80 text-slate-200"
          }`}
        >
          <div
            className={`flex items-center justify-between border-b pb-2 ${
              isLight ? "border-[#E7E2D8]" : "border-slate-800/70"
            }`}
          >
            <span className={`text-xs font-semibold ${isLight ? "text-[#2C2724]" : "text-slate-200"}`}>
              Hyperparameters
            </span>
            <Sliders className={`w-3.5 h-3.5 ${isLight ? "text-[#7A7269]" : "text-slate-500"}`} />
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className={`text-[11px] font-medium ${isLight ? "text-[#443E3A]" : "text-slate-300"}`}>
                Temperature
              </span>
              <span
                className={`font-mono px-1.5 py-0.5 rounded border text-[10px] ${
                  isLight
                    ? "text-sky-800 bg-sky-50 border-sky-200 font-semibold"
                    : "text-sky-400 bg-sky-950/60 border-sky-500/30"
                }`}
              >
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
              className={`w-full cursor-pointer h-1.5 rounded-lg ${
                isLight ? "bg-[#EBE6DD] accent-sky-600" : "bg-slate-900 accent-sky-400"
              }`}
            />
            <div
              className={`flex justify-between text-[10px] font-mono mt-1 ${
                isLight ? "text-[#8E8275]" : "text-slate-500"
              }`}
            >
              <span>0.0 (Deterministic)</span>
              <span>0.5</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Max Tokens Stepper & Presets */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className={`text-[11px] font-medium ${isLight ? "text-[#443E3A]" : "text-slate-300"}`}>
                Max Tokens
              </span>
              <span
                className={`font-mono px-1.5 py-0.5 rounded border text-[10px] ${
                  isLight
                    ? "text-sky-800 bg-sky-50 border-sky-200 font-semibold"
                    : "text-sky-400 bg-sky-950/60 border-sky-500/30"
                }`}
              >
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
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none ${
                isLight
                  ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-sky-600/70"
                  : "bg-slate-950 border-slate-800 text-slate-200 focus:border-sky-500/60"
              }`}
            />
            {/* Quick Token Presets */}
            <div className="flex items-center gap-1 mt-1.5">
              {tokenPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleFieldChange("maxTokens", preset)}
                  className={`flex-1 py-0.5 rounded-md text-[10px] font-mono border transition-all active:scale-95 ${
                    isLight
                      ? (data.maxTokens || 2048) === preset
                        ? "bg-sky-100 border-sky-300 text-sky-900 font-semibold"
                        : "bg-[#FAF8F5] border-[#E7E2D8] text-[#7A7269] hover:text-[#2C2724] hover:border-[#D8D1C5]"
                      : (data.maxTokens || 2048) === preset
                      ? "bg-sky-950/80 border-sky-500/50 text-sky-300 font-semibold"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Force JSON Mode Switch */}
          <label className="flex items-start gap-2.5 text-xs cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={!!data.jsonMode}
              onChange={(e) => handleFieldChange("jsonMode", e.target.checked)}
              className="mt-0.5 rounded text-sky-600 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span
                className={`font-medium block text-[11px] ${
                  isLight ? "text-[#2C2724]" : "text-slate-200"
                }`}
              >
                Force JSON Mode
              </span>
              <span
                className={`text-[10px] block leading-tight ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                Enforces structured JSON format response from model
              </span>
            </div>
          </label>
        </div>

        {/* API Key Override (Optional) */}
        <div>
          <label className={labelClass}>
            API Key Override{" "}
            <span className={`text-[10px] font-normal ${isLight ? "text-[#8E8275]" : "text-slate-500"}`}>
              (Optional)
            </span>
          </label>
          <input
            type="password"
            placeholder="Inherited from global configuration"
            value={data.apiKeyOverride || ""}
            onChange={(e) => handleFieldChange("apiKeyOverride", e.target.value)}
            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none transition-all ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-sky-600/70 focus:ring-2 focus:ring-sky-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10"
            }`}
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
          <label className={labelClass}>
            Logic Operator Mode
          </label>
          <div
            className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${
              isLight ? "bg-[#F5F2EB] border-[#E7E2D8]" : "bg-[#060a12]/80 border-slate-800/80"
            }`}
          >
            <button
              type="button"
              onClick={() => handleFieldChange("logicOperator", "AND")}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                (data.logicOperator || "AND") === "AND"
                  ? "bg-purple-600 text-white shadow-sm"
                  : isLight
                  ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <span>AND</span>
              <span className="text-[10px] font-normal opacity-80">(All Match)</span>
            </button>
            <button
              type="button"
              onClick={() => handleFieldChange("logicOperator", "OR")}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                data.logicOperator === "OR"
                  ? "bg-purple-600 text-white shadow-sm"
                  : isLight
                  ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
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
              <label className={labelClass + " !mb-0"}>
                Evaluation Rules
              </label>
              <span
                className={`px-1.5 py-0.2 rounded-md border text-[10px] font-mono font-medium ${
                  isLight
                    ? "bg-purple-100 text-purple-900 border-purple-200"
                    : "bg-purple-950/80 border-purple-500/30 text-purple-300"
                }`}
              >
                {rules.length}
              </span>
            </div>
            <button
              type="button"
              onClick={addRule}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all active:scale-95 shadow-sm ${
                isLight
                  ? "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800"
                  : "bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/40 text-purple-300 hover:text-purple-200"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Rule
            </button>
          </div>

          {rules.length === 0 ? (
            <div
              className={`p-4 rounded-xl border text-center space-y-1.5 ${
                isLight ? "bg-[#F5F2EB] border-[#E7E2D8]" : "bg-[#060a12]/80 border-slate-800/80"
              }`}
            >
              <p className={`text-xs font-medium ${isLight ? "text-[#443E3A]" : "text-slate-400"}`}>
                No conditional rules configured
              </p>
              <p className={`text-[11px] ${isLight ? "text-[#7A7269]" : "text-slate-500"}`}>
                Default behavior routes all execution directly to the{" "}
                <span className={isLight ? "text-emerald-700 font-semibold" : "text-emerald-400 font-medium"}>
                  True
                </span>{" "}
                branch.
              </p>
              <button
                type="button"
                onClick={addRule}
                className={`mt-2 text-xs font-medium inline-flex items-center gap-1 ${
                  isLight ? "text-purple-700 hover:text-purple-900" : "text-purple-400 hover:text-purple-300"
                }`}
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
                  className={`p-3 rounded-xl border space-y-2.5 relative group transition-all ${
                    isLight
                      ? "bg-[#F5F2EB] border-[#E7E2D8] hover:border-[#D8D1C5] text-[#2C2724]"
                      : "bg-[#060a12]/90 border-slate-800/80 hover:border-slate-700 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-mono font-semibold flex items-center gap-1.5 ${
                        isLight ? "text-purple-800" : "text-purple-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Rule #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className={`p-1 rounded-md transition-colors ${
                        isLight
                          ? "hover:bg-rose-100 text-[#7A7269] hover:text-rose-700"
                          : "hover:bg-rose-950/60 text-slate-500 hover:text-rose-400"
                      }`}
                      title="Delete Rule"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label
                        className={`block text-[10px] uppercase tracking-wider font-semibold mb-1 font-mono ${
                          isLight ? "text-[#8E8275]" : "text-slate-400"
                        }`}
                      >
                        Field Path
                      </label>
                      <input
                        type="text"
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                        placeholder="e.g. output or data.status"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none ${
                          isLight
                            ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-purple-600/70"
                            : "bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500/60"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-[10px] uppercase tracking-wider font-semibold mb-1 font-mono ${
                          isLight ? "text-[#8E8275]" : "text-slate-400"
                        }`}
                      >
                        Comparison Operator
                      </label>
                      <select
                        value={rule.operator}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            operator: e.target.value as ConditionRule["operator"],
                          })
                        }
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-sans cursor-pointer focus:outline-none ${
                          isLight
                            ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-purple-600/70"
                            : "bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500/60"
                        }`}
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
                        <label
                          className={`block text-[10px] uppercase tracking-wider font-semibold mb-1 font-mono ${
                            isLight ? "text-[#8E8275]" : "text-slate-400"
                          }`}
                        >
                          Target Value
                        </label>
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          placeholder="Expected target value..."
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none ${
                            isLight
                              ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-purple-600/70"
                              : "bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500/60"
                          }`}
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
        <div
          className={`p-3 rounded-xl border space-y-2 ${
            isLight ? "bg-[#F5F2EB] border-[#E7E2D8]" : "bg-[#060a12]/80 border-slate-800/80"
          }`}
        >
          <div
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              isLight ? "text-[#2C2724]" : "text-slate-300"
            }`}
          >
            <GitBranch className={`w-3.5 h-3.5 ${isLight ? "text-purple-700" : "text-purple-400"}`} />
            <span>Port Routing Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div
              className={`p-2 rounded-lg border flex items-start gap-1.5 ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-emerald-950/20 border-emerald-500/30"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <strong className={`block font-medium ${isLight ? "text-emerald-900" : "text-emerald-300"}`}>
                  True Branch
                </strong>
                <span className={`text-[10px] ${isLight ? "text-emerald-700" : "text-slate-400"}`}>
                  Right top handle
                </span>
              </div>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-start gap-1.5 ${
                isLight
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-rose-950/20 border-rose-500/30"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
              <div>
                <strong className={`block font-medium ${isLight ? "text-rose-900" : "text-rose-300"}`}>
                  False Branch
                </strong>
                <span className={`text-[10px] ${isLight ? "text-rose-700" : "text-slate-400"}`}>
                  Right bottom handle
                </span>
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
          <label className={labelClass}>
            Transform Strategy
          </label>
          <select
            value={transformType}
            onChange={(e) =>
              handleFieldChange("transformType", e.target.value as TransformNodeData["transformType"])
            }
            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-sans cursor-pointer transition-all focus:outline-none ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] focus:border-emerald-600/70 focus:ring-2 focus:ring-emerald-500/20"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
            }`}
          >
            <option value="javascript">Custom JavaScript Function</option>
            <option value="jsonExtract">JSONPath / Key Extraction</option>
            <option value="template">String Interpolation Template</option>
          </select>
        </div>

        {transformType === "javascript" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>
                Sandbox JS Function
              </label>
              <span
                className={`text-[10px] font-mono ${
                  isLight ? "text-emerald-800 font-semibold" : "text-emerald-400"
                }`}
              >
                (input, context) =&gt; ...
              </span>
            </div>
            <textarea
              rows={8}
              value={data.code || ""}
              onChange={(e) => handleFieldChange("code", e.target.value)}
              placeholder="return input.trim().toUpperCase();"
              className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-emerald-900 focus:border-emerald-600/70 focus:ring-2 focus:ring-emerald-500/20"
                  : "bg-[#060a12]/90 border-slate-800/80 text-emerald-300 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
              }`}
            />
          </div>
        )}

        {transformType === "jsonExtract" && (
          <div>
            <label className={labelClass}>
              JSON Key Path (e.g. data.items[0].id)
            </label>
            <input
              type="text"
              value={data.jsonPath || ""}
              onChange={(e) => handleFieldChange("jsonPath", e.target.value)}
              placeholder="response.choices[0].message.content"
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none transition-all ${
                isLight
                  ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-emerald-600/70 focus:ring-2 focus:ring-emerald-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
              }`}
            />
          </div>
        )}

        {transformType === "template" && (
          <div>
            <label className={labelClass}>
              Template String
            </label>
            <textarea
              rows={6}
              value={data.templateString || ""}
              onChange={(e) => handleFieldChange("templateString", e.target.value)}
              placeholder="Summary: {{input.summary}}&#10;Date: {{input.date}}"
              className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-emerald-600/70 focus:ring-2 focus:ring-emerald-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10"
              }`}
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
            <label className={labelClass}>
              Method
            </label>
            <select
              value={data.method || "GET"}
              onChange={(e) =>
                handleFieldChange("method", e.target.value as HttpRequestNodeData["method"])
              }
              className={`w-full px-2 py-1.5 rounded-lg border text-xs font-bold font-mono cursor-pointer focus:outline-none ${
                isLight
                  ? "bg-[#F5F2EB] border-[#E7E2D8] text-cyan-800 focus:border-cyan-600/70"
                  : "bg-[#060a12]/80 border-slate-800/80 text-cyan-400 focus:border-cyan-500/60"
              }`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div className="flex-1">
            <label className={labelClass}>
              Endpoint URL
            </label>
            <input
              type="text"
              value={data.url || ""}
              onChange={(e) => handleFieldChange("url", e.target.value)}
              placeholder="https://api.service.com/v1/resource"
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono focus:outline-none transition-all ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-cyan-600/70 focus:ring-2 focus:ring-cyan-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelClass + " !mb-0"}>
              Headers ({headers.length})
            </label>
            <button
              type="button"
              onClick={addHeader}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                isLight ? "text-cyan-800 hover:text-cyan-900" : "text-cyan-400 hover:text-cyan-300"
              }`}
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
                placeholder="Header Key"
                className={`w-1/2 px-2 py-1 rounded-lg border text-xs font-mono focus:outline-none ${
                  isLight
                    ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-cyan-600/70"
                    : "bg-[#060a12] border-slate-800 text-slate-200 focus:border-cyan-500/60"
                }`}
              />
              <input
                type="text"
                value={hdr.value}
                onChange={(e) => updateHeader(i, hdr.key, e.target.value)}
                placeholder="Value"
                className={`w-1/2 px-2 py-1 rounded-lg border text-xs font-mono focus:outline-none ${
                  isLight
                    ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] focus:border-cyan-600/70"
                    : "bg-[#060a12] border-slate-800 text-slate-200 focus:border-cyan-500/60"
                }`}
              />
              <button
                type="button"
                onClick={() => removeHeader(i)}
                className={`p-1 transition-colors ${
                  isLight
                    ? "text-[#7A7269] hover:text-rose-600"
                    : "text-slate-500 hover:text-rose-400"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {data.method !== "GET" && (
          <div>
            <label className={labelClass}>
              Request Body (JSON / Raw)
            </label>
            <textarea
              rows={4}
              value={data.bodyPayload || ""}
              onChange={(e) => handleFieldChange("bodyPayload", e.target.value)}
              placeholder='{"query": "{{trigger.output}}"}'
              className={`w-full px-2.5 py-2 rounded-lg border text-xs font-mono focus:outline-none resize-none leading-relaxed transition-all ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-cyan-600/70 focus:ring-2 focus:ring-cyan-500/20"
                  : "bg-[#060a12]/80 border-slate-800/80 text-slate-200 placeholder-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10"
              }`}
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
            <div
              className={`text-[10px] px-2 py-1 rounded-md border ${
                isLight
                  ? "text-amber-800 bg-amber-50 border-amber-200"
                  : "text-amber-400 bg-amber-950/40 border-amber-500/20"
              }`}
            >
              Output is not a structured array of records. Displaying raw data:
            </div>
            <pre
              className={`font-mono text-[11px] whitespace-pre-wrap break-all max-h-48 overflow-y-auto ${
                isLight ? "text-[#2C2724]" : "text-emerald-300"
              }`}
            >
              {formattedOutputStr}
            </pre>
          </div>
        );
      }

      const headers = Object.keys(arrayData[0]).slice(0, 5); // limit preview headers to 5

      return (
        <div
          className={`overflow-x-auto max-h-48 rounded-lg border ${
            isLight ? "border-[#E7E2D8]" : "border-slate-800"
          }`}
        >
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead
              className={`border-b sticky top-0 ${
                isLight
                  ? "bg-[#EBE6DD] text-[#2C2724] border-[#E7E2D8]"
                  : "bg-slate-900/90 text-slate-300 border-slate-800"
              }`}
            >
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className={`p-1.5 font-semibold border-r last:border-r-0 ${
                      isLight
                        ? "text-rose-800 border-[#E7E2D8]"
                        : "text-rose-300 border-slate-800"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight
                  ? "divide-[#E7E2D8] text-[#2C2724] bg-[#FAF8F5]"
                  : "divide-slate-800/60 text-slate-300 bg-slate-950/80"
              }`}
            >
              {arrayData.slice(0, 10).map((row, idx) => (
                <tr key={idx} className={isLight ? "hover:bg-[#F5F2EB]" : "hover:bg-slate-900/40"}>
                  {headers.map((h) => (
                    <td
                      key={h}
                      className={`p-1.5 border-r last:border-r-0 truncate max-w-[120px] ${
                        isLight ? "border-[#E7E2D8]" : "border-slate-800"
                      }`}
                    >
                      {typeof row[h] === "object" ? JSON.stringify(row[h]) : String(row[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {arrayData.length > 10 && (
            <div
              className={`p-1 text-[10px] text-center ${
                isLight ? "bg-[#EBE6DD] text-[#7A7269]" : "bg-slate-900/60 text-slate-500"
              }`}
            >
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
          <label className={labelClass}>
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95 ${
                  format === fmt.id
                    ? isLight
                      ? "bg-rose-100 text-rose-900 border-rose-300 shadow-sm"
                      : "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm"
                    : isLight
                    ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                    : "bg-[#060a12]/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
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
            <label className={labelClass}>
              Latest Executed Result
            </label>
            {hasOutput && (
              <button
                type="button"
                onClick={handleCopyOutput}
                className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                  isLight ? "text-rose-700 hover:text-rose-900" : "text-rose-400 hover:text-rose-300"
                }`}
              >
                {copiedOutput ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
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

          <div
            className={`p-3 rounded-xl border min-h-[100px] max-h-64 overflow-y-auto custom-scrollbar ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724]"
                : "bg-[#060a12] border-slate-800/80 text-slate-200"
            }`}
          >
            {!hasOutput ? (
              <div
                className={`flex flex-col items-center justify-center h-24 text-center text-xs italic space-y-1 ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                <Terminal className={`w-5 h-5 mb-1 ${isLight ? "text-[#9C9287]" : "text-slate-600"}`} />
                <span>No output data yet</span>
                <span
                  className={`text-[10px] not-italic font-sans ${
                    isLight ? "text-[#8E8275]" : "text-slate-600"
                  }`}
                >
                  Run the workflow to inspect executed results
                </span>
              </div>
            ) : format === "table" ? (
              renderTableContent()
            ) : format === "json" ? (
              <pre
                className={`font-mono text-[11px] whitespace-pre-wrap break-all ${
                  isLight ? "text-emerald-800" : "text-emerald-300"
                }`}
              >
                {formattedOutputStr}
              </pre>
            ) : format === "markdown" ? (
              <div
                className={`text-xs max-w-none font-sans leading-relaxed whitespace-pre-wrap ${
                  isLight ? "text-[#2C2724]" : "text-slate-200 prose prose-invert"
                }`}
              >
                {formattedOutputStr}
              </div>
            ) : (
              <pre className="font-mono text-[11px] whitespace-pre-wrap break-all">
                {formattedOutputStr}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`w-80 h-full flex flex-col select-none overflow-hidden z-10 backdrop-blur-md relative transition-colors duration-200 ${
        isLight
          ? "bg-[#FAF8F5]/95 border-l border-[#E7E2D8] text-[#2C2724] shadow-[-2px_0_12px_rgba(0,0,0,0.03)]"
          : "bg-[#080d18] border-l border-slate-800/60 text-slate-100"
      }`}
    >
      {/* Top Ambient Highlight Rim */}
      <div
        className={`absolute inset-x-0 top-0 h-[1px] pointer-events-none ${
          isLight
            ? "bg-gradient-to-r from-transparent via-[#E7E2D8] to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"
        }`}
      />

      {/* --- 2. Header & Quick Actions --- */}
      <div
        className={`p-3.5 border-b flex flex-col gap-2.5 transition-colors ${
          isLight
            ? "border-[#E7E2D8] bg-[#FAF8F5]"
            : "border-slate-800/60 bg-[#080d18]/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Dynamic Type Icon & Node ID */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200 ${
                isLight
                  ? `${typeConfig.lightIconStyle.bg} ${typeConfig.lightIconStyle.border} ${typeConfig.lightIconStyle.text} ${typeConfig.lightIconStyle.glow}`
                  : `${typeConfig.iconStyle.bg} ${typeConfig.iconStyle.border} ${typeConfig.iconStyle.text} ${typeConfig.iconStyle.glow}`
              }`}
              title={`${typeConfig.label}`}
            >
              {typeConfig.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-semibold tracking-tight truncate ${
                    isLight ? "text-[#2C2724]" : "text-slate-100"
                  }`}
                >
                  {typeConfig.label}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                title="Click to copy Node ID"
                className={`flex items-center gap-1 text-[10px] font-mono transition-colors group cursor-pointer ${
                  isLight
                    ? "text-[#7A7269] hover:text-[#2C2724]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="truncate max-w-[120px]">{selectedNode.id}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons: Duplicate, Delete, Close/Deselect */}
          <div
            className={`flex items-center gap-0.5 flex-shrink-0 p-0.5 rounded-lg border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8]"
                : "bg-slate-900/80 border-slate-800/80"
            }`}
          >
            <button
              type="button"
              onClick={() => duplicateNode(selectedNode.id)}
              title="Duplicate Node"
              aria-label="Duplicate Node"
              className={`p-1 rounded-md transition-all active:scale-95 ${
                isLight
                  ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteNode(selectedNode.id)}
              title="Delete Node"
              aria-label="Delete Node"
              className={`p-1 rounded-md transition-all active:scale-95 ${
                isLight
                  ? "text-[#443E3A] hover:text-rose-600 hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedNodeId(null)}
              title="Close / Deselect"
              aria-label="Close / Deselect"
              className={`p-1 rounded-md transition-all active:scale-95 ${
                isLight
                  ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center justify-between pt-1 border-t ${
            isLight ? "border-[#E7E2D8]" : "border-slate-800/50"
          }`}
        >
          <span
            className={`text-[11px] font-medium ${
              isLight ? "text-[#7A7269]" : "text-slate-400"
            }`}
          >
            Status
          </span>
          {renderStatusBadge()}
        </div>
      </div>

      {/* --- 3. Main Form Fields & Common Metadata --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Common Shared Inputs: Node Name / Title and Description / Notes */}
        <div
          className={`space-y-3 pb-3.5 border-b ${
            isLight ? "border-[#E7E2D8]" : "border-slate-800/60"
          }`}
        >
          <div>
            <label className={labelClass}>
              Node Name / Title
            </label>
            <input
              type="text"
              value={nodeData.label || ""}
              onChange={(e) => handleFieldChange("label", e.target.value)}
              placeholder="e.g. AI Prompt Processor"
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all outline-none ${
                isLight
                  ? `bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] ${typeConfig.lightAccentBorderFocus} ${typeConfig.lightAccentRing} focus:ring-2 text-[#2C2724] placeholder-[#9C9287]`
                  : `bg-[#060a12]/80 hover:bg-[#060a12] border-slate-800/80 ${typeConfig.accentBorderFocus} ${typeConfig.accentRing} focus:ring-2 text-slate-100 placeholder-slate-600`
              }`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={nodeData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="What does this step accomplish?"
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs resize-none transition-all leading-relaxed outline-none ${
                isLight
                  ? `bg-[#F5F2EB] hover:bg-[#FAF8F5] border-[#E7E2D8] ${typeConfig.lightAccentBorderFocus} ${typeConfig.lightAccentRing} focus:ring-2 text-[#2C2724] placeholder-[#9C9287]`
                  : `bg-[#060a12]/80 hover:bg-[#060a12] border-slate-800/80 ${typeConfig.accentBorderFocus} ${typeConfig.accentRing} focus:ring-2 text-slate-300 placeholder-slate-600`
              }`}
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

export default NodeInspector;
