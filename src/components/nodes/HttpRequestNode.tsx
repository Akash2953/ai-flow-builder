import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Globe, Send } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { HttpRequestNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const HttpRequestNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as HttpRequestNodeData;
  const method = nodeData.method || "GET";

  const getMethodBadgeColor = (m: string) => {
    switch (m) {
      case "GET":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-500/30";
      case "POST":
        return "bg-sky-950/60 text-sky-400 border-sky-500/30";
      case "PUT":
        return "bg-amber-950/60 text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-rose-950/60 text-rose-400 border-rose-500/30";
      case "PATCH":
        return "bg-purple-950/60 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-900 text-slate-400 border-slate-700";
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "HTTP Request"}
      subtitle={method}
      icon={<Globe className="w-4 h-4" />}
      iconBgColor="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold ${getMethodBadgeColor(method)}`}>
            {method}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {nodeData.headers?.length || 0} header{nodeData.headers?.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all max-h-16 overflow-hidden line-clamp-2">
          {nodeData.url || "https://api.example.com/endpoint"}
        </div>
      </div>

      {/* Source Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />
    </BaseNodeWrapper>
  );
};
