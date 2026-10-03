// OutputNode: Terminal and output visualizer node displaying workflow results in various formats (text, JSON, markdown, table)
// Importers/Callers: src/components/canvas/FlowCanvas.tsx (nodeTypes registry)
// Affected API: OutputNodeData, BaseNodeWrapper, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Terminal, FileText, Code, Table, Download, FileDown } from "lucide-react";
import { BaseNodeWrapper } from "./BaseNodeWrapper";
import { OutputNodeData } from "../../types/nodes";
import { AppNode } from "../../types/flow";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useExecutionStore } from "../../store/useExecutionStore";
import { downloadText, downloadDocx, downloadPdf } from "../../utils/exportUtils";

export const OutputNode: React.FC<NodeProps<AppNode>> = ({
  id,
  data,
  selected,
}) => {
  const nodeData = data as OutputNodeData;
  const displayFormat = nodeData.displayFormat || "text";
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";
  const liveOutput = useExecutionStore((state) => state.nodeOutputs[id]?.output);
  const displayOutput = liveOutput !== undefined ? liveOutput : nodeData.lastOutput;

  const getFormatIcon = () => {
    switch (displayFormat) {
      case "json":
        return <Code className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "markdown":
        return <FileText className="w-3.5 h-3.5" strokeWidth={2.2} />;
      case "table":
        return <Table className="w-3.5 h-3.5" strokeWidth={2.2} />;
      default:
        return <Terminal className="w-3.5 h-3.5" strokeWidth={2.2} />;
    }
  };

  const renderOutputPreview = () => {
    if (displayOutput === undefined || displayOutput === null) {
      return (
        <div
          className={`italic text-[11px] font-mono ${
            isLight ? "text-[#9C9287]" : "text-slate-500"
          }`}
        >
          Waiting for workflow execution output...
        </div>
      );
    }

    const outputStr =
      typeof displayOutput === "object"
        ? JSON.stringify(displayOutput, null, 2)
        : String(displayOutput);

    return (
      <pre
        className={`font-mono text-[11px] whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed custom-scrollbar font-medium ${
          isLight ? "text-emerald-800" : "text-emerald-300"
        }`}
      >
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
      iconBgColor={
        isLight
          ? "bg-rose-500/10 text-rose-700 border-rose-500/30"
          : "bg-rose-500/10 text-rose-400 border-rose-500/25"
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
            ? "!bg-rose-500 !border-2 !border-[#FAF8F5] !shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            : "!bg-rose-400 !border-2 !border-[#080d18] !shadow-[0_0_8px_rgba(244,63,94,0.5)]"
        }`}
      />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={`font-medium ${
              isLight ? "text-[#443E3A]" : "text-slate-300"
            }`}
          >
            Terminal View
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
              isLight
                ? "bg-rose-500/10 text-rose-700 border-rose-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {displayFormat}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg min-h-[50px] max-h-32 overflow-hidden border transition-all ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] shadow-inner"
              : "bg-[#060a12]/80 border-slate-800/80"
          }`}
        >
          {renderOutputPreview()}
        </div>

        {displayOutput !== undefined && displayOutput !== null && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className={`text-[10px] font-medium ${isLight ? "text-[#7A7269]" : "text-slate-500"}`}>
              Export:
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const str = typeof displayOutput === "object" ? JSON.stringify(displayOutput, null, 2) : String(displayOutput);
                downloadText(str, "tailored_resume.txt");
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-all hover:scale-105 active:scale-95 ${
                isLight
                  ? "bg-white border-[#E7E2D8] text-[#2C2724] hover:bg-[#FAF8F5]"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              TXT
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const str = typeof displayOutput === "object" ? JSON.stringify(displayOutput, null, 2) : String(displayOutput);
                downloadDocx(str, "tailored_resume.docx");
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all hover:scale-105 active:scale-95 ${
                isLight
                  ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                  : "bg-blue-950/50 border-blue-700/50 text-blue-300 hover:bg-blue-900/50"
              }`}
            >
              DOCX
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const str = typeof displayOutput === "object" ? JSON.stringify(displayOutput, null, 2) : String(displayOutput);
                downloadPdf(str, "tailored_resume.pdf");
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all hover:scale-105 active:scale-95 ${
                isLight
                  ? "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100"
                  : "bg-rose-950/50 border-rose-700/50 text-rose-300 hover:bg-rose-900/50"
              }`}
            >
              PDF
            </button>
          </div>
        )}
      </div>
    </BaseNodeWrapper>
  );
};
