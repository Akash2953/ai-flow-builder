import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Code2, Braces, FileCode } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { TransformNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const TransformNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as TransformNodeData;
  const transformType = nodeData.transformType || "javascript";

  const getTransformIcon = () => {
    switch (transformType) {
      case "jsonExtract":
        return <Braces className="w-4 h-4" />;
      case "template":
        return <FileCode className="w-4 h-4" />;
      case "javascript":
      default:
        return <Code2 className="w-4 h-4" />;
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
      iconBgColor="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Transformation Logic</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
            {transformType}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-16 overflow-hidden text-ellipsis line-clamp-2">
          {getPreviewContent()}
        </div>
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />
    </BaseNodeWrapper>
  );
};
