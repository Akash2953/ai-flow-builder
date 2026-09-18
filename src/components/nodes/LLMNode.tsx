import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Bot, Sparkles } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { LLMNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const LLMNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as LLMNodeData;

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case "openai":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-500/30";
      case "anthropic":
        return "bg-orange-950/60 text-orange-400 border-orange-500/30";
      case "gemini":
        return "bg-blue-950/60 text-blue-400 border-blue-500/30";
      case "groq":
        return "bg-amber-950/60 text-amber-400 border-amber-500/30";
      case "ollama":
        return "bg-purple-950/60 text-purple-400 border-purple-500/30";
      default:
        return "bg-sky-950/60 text-sky-400 border-sky-500/30";
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "LLM Prompt"}
      subtitle={nodeData.model || "gpt-4o"}
      icon={<Bot className="w-4 h-4" />}
      iconBgColor="bg-sky-500/20 text-sky-400 border-sky-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${getProviderBadgeColor(nodeData.provider || "mock")}`}>
            {nodeData.provider || "mock"}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span>temp: {nodeData.temperature ?? 0.7}</span>
            <span>•</span>
            <span>max: {nodeData.maxTokens ?? 1024}</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-16 overflow-hidden text-ellipsis line-clamp-2">
          {nodeData.userPromptTemplate || "Configure prompt template..."}
        </div>

        {nodeData.jsonMode && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Sparkles className="w-3 h-3" />
            <span>JSON Output Mode Enforced</span>
          </div>
        )}
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-sky-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />
    </BaseNodeWrapper>
  );
};
