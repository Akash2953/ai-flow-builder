// LLMNode: Node component representing an AI language model invocation with provider, model, prompt, and parameters
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: LLMNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sparkles, Bot } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { LLMNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";

export const LLMNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as LLMNodeData;
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const getProviderBadgeColor = (provider: string) => {
    const p = provider?.toLowerCase();
    if (isLight) {
      switch (p) {
        case "openai":
          return "bg-emerald-50 text-emerald-800 border-emerald-300";
        case "anthropic":
          return "bg-amber-50 text-amber-800 border-amber-300";
        case "gemini":
          return "bg-blue-50 text-blue-800 border-blue-300";
        case "groq":
          return "bg-purple-50 text-purple-800 border-purple-300";
        case "deepseek":
          return "bg-cyan-50 text-cyan-800 border-cyan-300";
        case "ollama":
          return "bg-indigo-50 text-indigo-800 border-indigo-300";
        default:
          return "bg-amber-500/10 text-amber-800 border-amber-300";
      }
    } else {
      switch (p) {
        case "openai":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
        case "anthropic":
          return "bg-orange-500/10 text-orange-400 border-orange-500/25";
        case "gemini":
          return "bg-blue-500/10 text-blue-400 border-blue-500/25";
        case "groq":
          return "bg-amber-500/10 text-amber-400 border-amber-500/25";
        case "deepseek":
          return "bg-cyan-500/10 text-cyan-400 border-cyan-500/25";
        case "ollama":
          return "bg-purple-500/10 text-purple-400 border-purple-500/25";
        default:
          return "bg-sky-500/10 text-sky-400 border-sky-500/25";
      }
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "LLM Agent"}
      subtitle={nodeData.model || "gpt-4o"}
      icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />}
      iconBgColor={
        isLight
          ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
          : "bg-sky-500/10 text-sky-400 border-sky-500/25"
      }
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className={`!w-3 !h-3 transition-transform hover:!scale-125 ${
          isLight
            ? "!bg-amber-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(217,119,6,0.5)]"
            : "!bg-sky-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        }`}
      />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium capitalize ${getProviderBadgeColor(
              nodeData.provider || "mock"
            )}`}
          >
            {nodeData.provider || "mock"}
          </span>
          <div
            className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border ${
              isLight
                ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                : "text-slate-400 bg-slate-900/60 border-slate-800/60"
            }`}
          >
            <span>temp: {nodeData.temperature ?? 0.7}</span>
            <span className={isLight ? "text-[#B8B09D]" : "text-slate-600"}>•</span>
            <span>max: {nodeData.maxTokens ?? 1024}</span>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-lg text-[11px] font-mono max-h-16 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed border transition-all ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] shadow-inner"
              : "bg-[#060a12]/80 border-slate-800/80 text-slate-300"
          }`}
        >
          {nodeData.userPromptTemplate || "Configure prompt template..."}
        </div>

        {nodeData.jsonMode && (
          <div
            className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md font-mono border ${
              isLight
                ? "text-emerald-800 bg-emerald-50 border-emerald-300"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>JSON Mode Active</span>
          </div>
        )}
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`!w-3 !h-3 transition-transform hover:!scale-125 ${
          isLight
            ? "!bg-amber-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(217,119,6,0.5)]"
            : "!bg-sky-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        }`}
      />
    </BaseNodeWrapper>
  );
};
