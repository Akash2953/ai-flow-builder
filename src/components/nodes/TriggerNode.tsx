// TriggerNode: Entry node for workflows providing manual prompt, webhook, or scheduled triggers
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: TriggerNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, Clock, Globe } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { TriggerNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";

export const TriggerNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as TriggerNodeData;
  const triggerType = nodeData.triggerType || "manual";
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const getTriggerIcon = () => {
    switch (triggerType) {
      case "scheduled":
        return <Clock className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "webhook":
        return <Globe className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "manual":
      default:
        return <Zap className="w-3.5 h-3.5" strokeWidth={2.2} />;
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "Workflow Trigger"}
      subtitle={triggerType.toUpperCase()}
      icon={getTriggerIcon()}
      iconBgColor={
        isLight
          ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
          : "bg-amber-500/10 text-amber-400 border-amber-500/25"
      }
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`font-medium ${
              isLight ? "text-[#443E3A]" : "text-slate-300"
            }`}
          >
            Input Payload
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold border ${
              isLight
                ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {triggerType}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg text-[11px] font-mono max-h-16 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed border transition-all ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] shadow-inner"
              : "bg-[#060a12]/80 border-slate-800/80 text-slate-300"
          }`}
        >
          {nodeData.inputPrompt || "Configure initial input or parameters in inspector..."}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`!w-3 !h-3 transition-transform hover:!scale-125 ${
          isLight
            ? "!bg-amber-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(217,119,6,0.5)]"
            : "!bg-amber-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        }`}
      />
    </BaseNodeWrapper>
  );
};
