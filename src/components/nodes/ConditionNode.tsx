// ConditionNode: Decision node routing execution to True or False branches based on configured rules
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: ConditionNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { GitBranch, Check, X } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { ConditionNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";

export const ConditionNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as ConditionNodeData;
  const rules = nodeData.rules || [];
  const logicOperator = nodeData.logicOperator || "AND";
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "Condition Branch"}
      subtitle={`${rules.length} rule${rules.length === 1 ? "" : "s"} (${logicOperator})`}
      icon={<GitBranch className="w-3.5 h-3.5" strokeWidth={2.2} />}
      iconBgColor={
        isLight
          ? "bg-purple-500/10 text-purple-700 border-purple-500/30"
          : "bg-purple-500/10 text-purple-400 border-purple-500/25"
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
            ? "!bg-purple-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            : "!bg-purple-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        }`}
      />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`font-medium ${
              isLight ? "text-[#443E3A]" : "text-slate-300"
            }`}
          >
            Routing Rules
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
              isLight
                ? "bg-purple-500/10 text-purple-700 border-purple-500/30"
                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
            }`}
          >
            {logicOperator}
          </span>
        </div>

        {rules.length === 0 ? (
          <div
            className={`p-2.5 rounded-lg text-[11px] font-mono italic border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#9C9287]"
                : "bg-[#060a12]/80 border-slate-800/80 text-slate-500"
            }`}
          >
            No rules configured (defaults to TRUE)
          </div>
        ) : (
          <div className="space-y-1.5 max-h-24 overflow-hidden">
            {rules.slice(0, 2).map((rule, idx) => (
              <div
                key={rule.id || idx}
                className={`p-1.5 rounded-md text-[10px] font-mono flex items-center justify-between border ${
                  isLight
                    ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724]"
                    : "bg-[#060a12]/80 border-slate-800/80 text-slate-300"
                }`}
              >
                <span
                  className={`truncate max-w-[80px] font-medium ${
                    isLight ? "text-purple-700" : "text-purple-300"
                  }`}
                >
                  {rule.field || "output"}
                </span>
                <span
                  className={`font-bold ${
                    isLight ? "text-[#7A7269]" : "text-slate-500"
                  }`}
                >
                  {rule.operator}
                </span>
                <span
                  className={`truncate max-w-[80px] ${
                    isLight ? "text-[#443E3A]" : "text-slate-300"
                  }`}
                >
                  "{rule.value}"
                </span>
              </div>
            ))}
            {rules.length > 2 && (
              <div
                className={`text-[10px] font-mono text-center ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                +{rules.length - 2} more rule{rules.length - 2 > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        {/* Anchored Branch Output Indicator Rows with Integrated Handles */}
        <div className="space-y-1.5 pt-1">
          <div
            className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-medium ${
              isLight
                ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/25 shadow-sm"
                : "text-emerald-300 bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>True Branch</span>
            </div>
            <span className="text-[10px] opacity-75 mr-2">IF PASS</span>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="source-condition-true !-right-[15px] !w-2.5 !h-2.5"
            />
          </div>

          <div
            className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[11px] font-mono font-medium ${
              isLight
                ? "bg-rose-500/10 text-rose-800 border-rose-500/25 shadow-sm"
                : "text-rose-300 bg-rose-950/40 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.1)]"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>False Branch</span>
            </div>
            <span className="text-[10px] opacity-75 mr-2">ELSE</span>
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              className="source-condition-false !-right-[15px] !w-2.5 !h-2.5"
            />
          </div>
        </div>
      </div>
    </BaseNodeWrapper>
  );
};
