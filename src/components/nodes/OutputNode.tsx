import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Terminal, FileText, Code, Table } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { OutputNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";

export const OutputNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as OutputNodeData;
  const displayFormat = nodeData.displayFormat || "text";

  const getFormatIcon = () => {
    switch (displayFormat) {
      case "json":
        return <Code className="w-4 h-4" />;
      case "markdown":
        return <FileText className="w-4 h-4" />;
      case "table":
        return <Table className="w-4 h-4" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };

  const renderOutputPreview = () => {
    if (nodeData.lastOutput === undefined || nodeData.lastOutput === null) {
      return (
        <div className="text-slate-500 italic text-[11px]">
          Waiting for workflow execution output...
        </div>
      );
    }

    const outputStr =
      typeof nodeData.lastOutput === "object"
        ? JSON.stringify(nodeData.lastOutput, null, 2)
        : String(nodeData.lastOutput);

    return (
      <pre className="text-emerald-300 font-mono text-[11px] whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
        {outputStr}
      </pre>
    );
  };

  return (
    <BaseNodeWrapper
      id={id}
      selected={selected}
      title={nodeData.label || nodeData.title || "Output Terminal"}
      subtitle={displayFormat.toUpperCase()}
      icon={getFormatIcon()}
      iconBgColor="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
      status={nodeData.status}
      executionTimeMs={nodeData.executionTimeMs}
      errorMessage={nodeData.errorMessage}
    >
      {/* Target Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-fuchsia-400 !border-2 !border-slate-900 transition-transform hover:!scale-125"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-300">Terminal View</span>
          <span className="px-1.5 py-0.5 rounded bg-fuchsia-950/60 text-fuchsia-400 border border-fuchsia-500/30 text-[10px] font-mono">
            {displayFormat}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 min-h-[50px] max-h-32 overflow-hidden">
          {renderOutputPreview()}
        </div>
      </div>
    </BaseNodeWrapper>
  );
};
