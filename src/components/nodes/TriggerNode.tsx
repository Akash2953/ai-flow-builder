import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, Play, Clock, Globe } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { TriggerNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const TriggerNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as TriggerNodeData;
  const triggerType = nodeData.triggerType || "manual";

  const getTriggerIcon = () => {
    switch (triggerType) {
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "webhook":
        return <Globe className="w-4 h-4" />;
      case "manual":
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || "Workflow Trigger"}
      subtitle={triggerType.toUpperCase()}
      icon={getTriggerIcon()}
      iconBgColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Input Payload</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
            {triggerType}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-16 overflow-hidden text-ellipsis line-clamp-2">
          {nodeData.inputPrompt || "Click inspector to set initial input prompt..."}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />
    </BaseNodeWrapper>
  );
};
