import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { GitBranch, Check, X } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { ConditionNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const ConditionNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as ConditionNodeData;
  const rules = nodeData.rules || [];
  const logicOperator = nodeData.logicOperator || "AND";

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "Condition Branch"}
      subtitle={`${rules.length} rule${rules.length === 1 ? "" : "s"} (${logicOperator})`}
      icon={<GitBranch className="w-4 h-4" />}
      iconBgColor="bg-purple-500/20 text-purple-400 border-purple-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Routing Rules</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-500/30 text-[10px] font-mono">
            {logicOperator}
          </span>
        </div>

        {rules.length === 0 ? (
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 italic">
            No rules configured (defaults to TRUE)
          </div>
        ) : (
          <div className="space-y-1 max-h-20 overflow-hidden">
            {rules.slice(0, 2).map((rule, idx) => (
              <div
                key={rule.id || idx}
                className="p-1.5 rounded bg-slate-950/60 border border-slate-800/80 text-[10px] font-mono flex items-center justify-between text-slate-300"
              >
                <span className="text-purple-300 truncate max-w-[80px]">{rule.field || "output"}</span>
                <span className="text-slate-500">{rule.operator}</span>
                <span className="text-slate-300 truncate max-w-[80px]">"{rule.value}"</span>
              </div>
            ))}
            {rules.length > 2 && (
              <div className="text-[10px] text-slate-500 text-center">
                +{rules.length - 2} more rule{rules.length - 2 > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        <div className="pt-1 flex items-center justify-between text-[10px] font-medium">
          <div className="flex items-center gap-1 text-emerald-400">
            <Check className="w-3 h-3" />
            <span>True Branch</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400">
            <X className="w-3 h-3" />
            <span>False Branch</span>
          </div>
        </div>
      </div>

      {/* True Source Handle (Top Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "35%" }}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      {/* False Source Handle (Bottom Right) */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "68%" }}
        className="!w-3 !h-3 !bg-rose-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />
    </BaseNodeWrapper>
  );
};
