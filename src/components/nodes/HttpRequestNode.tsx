// HttpRequestNode: HTTP request execution node supporting REST methods, headers, payload, and status inspection
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: HttpRequestNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { HttpRequestNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";

export const HttpRequestNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as HttpRequestNodeData;
  const method = nodeData.method || "GET";
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const getMethodBadgeColor = (m: string) => {
    if (isLight) {
      switch (m) {
        case "GET":
          return "bg-emerald-50 text-emerald-800 border-emerald-300";
        case "POST":
          return "bg-amber-50 text-amber-800 border-amber-300";
        case "PUT":
          return "bg-orange-50 text-orange-800 border-orange-300";
        case "DELETE":
          return "bg-rose-50 text-rose-800 border-rose-300";
        case "PATCH":
          return "bg-purple-50 text-purple-800 border-purple-300";
        default:
          return "bg-[#F5F2EB] text-[#443E3A] border-[#E7E2D8]";
      }
    } else {
      switch (m) {
        case "GET":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
        case "POST":
          return "bg-sky-500/10 text-sky-400 border-sky-500/25";
        case "PUT":
          return "bg-amber-500/10 text-amber-400 border-amber-500/25";
        case "DELETE":
          return "bg-rose-500/10 text-rose-400 border-rose-500/25";
        case "PATCH":
          return "bg-purple-500/10 text-purple-400 border-purple-500/25";
        default:
          return "bg-slate-800 text-slate-400 border-slate-700";
      }
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "HTTP Request"}
      subtitle={method}
      icon={<Globe className="w-3.5 h-3.5" strokeWidth={2.2} />}
      iconBgColor={
        isLight
          ? "bg-cyan-500/10 text-cyan-800 border-cyan-500/30"
          : "bg-cyan-500/10 text-cyan-400 border-cyan-500/25"
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
            ? "!bg-cyan-600 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            : "!bg-cyan-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        }`}
      />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium ${getMethodBadgeColor(
              method
            )}`}
          >
            {method}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              isLight
                ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                : "text-slate-400 bg-slate-900/60 border-slate-800/60"
            }`}
          >
            {nodeData.headers?.length || 0} header{nodeData.headers?.length === 1 ? "" : "s"}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg text-[11px] font-mono break-all max-h-16 overflow-hidden line-clamp-2 leading-relaxed border transition-all ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-cyan-900 shadow-inner font-medium"
              : "bg-[#060a12]/80 border-slate-800/80 text-cyan-300/90"
          }`}
        >
          {nodeData.url || "https://api.example.com/endpoint"}
        </div>
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`!w-3 !h-3 transition-transform hover:!scale-125 ${
          isLight
            ? "!bg-cyan-600 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            : "!bg-cyan-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        }`}
      />
    </BaseNodeWrapper>
  );
};
