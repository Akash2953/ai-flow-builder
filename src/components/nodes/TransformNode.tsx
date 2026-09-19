// TransformNode: Data transformation node supporting JavaScript functions, JSONPath extraction, and string templating
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: TransformNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Code2, Braces, FileCode } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { TransformNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";

export const TransformNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as TransformNodeData;
  const transformType = nodeData.transformType || "javascript";
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const getTransformIcon = () => {
    switch (transformType) {
      case "jsonExtract":
        return <Braces className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "template":
        return <FileCode className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "javascript":
      default:
        return <Code2 className="w-3.5 h-3.5" strokeWidth={2.2} />;
    }
  };

  const getPreviewContent = () => {
    if (transformType === "jsonExtract") {
      return nodeData.jsonPath ? `JSONPath: ${nodeData.jsonPath}` : "No JSONPath specified";
    }
    if (transformType === "template") {
      return nodeData.templateString || "No template configured...";
    }
    return nodeData.code || "(input, context) => input";
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "Data Transform"}
      subtitle={transformType.toUpperCase()}
      icon={getTransformIcon()}
      iconBgColor={
        isLight
          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
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
            ? "!bg-emerald-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "!bg-emerald-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        }`}
      />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`font-medium ${
              isLight ? "text-[#443E3A]" : "text-slate-300"
            }`}
          >
            Transformation Logic
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
              isLight
                ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {transformType}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg text-[11px] font-mono max-h-16 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed border transition-all ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#3B342F] shadow-inner"
              : "bg-[#060a12]/80 border-slate-800/80 text-slate-300"
          }`}
        >
          {getPreviewContent()}
        </div>
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`!w-3 !h-3 transition-transform hover:!scale-125 ${
          isLight
            ? "!bg-emerald-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "!bg-emerald-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        }`}
      />
    </BaseNodeWrapper>
  );
};
