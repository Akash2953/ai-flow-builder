import React from "react";
import { CheckCircle2, AlertCircle, Loader2, Play, Copy, Trash2 } from "lucide-react";
import { NodeExecutionStatus } from "../../types/flow";
import { useFlowStore } from "../../store/useFlowStore";
import { executeWorkflow } from "../../engine/dagRunner";

interface BaseNodeWrapperProps {
  id: string;
  selected?: boolean;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  status?: NodeExecutionStatus;
  executionTimeMs?: number;
  errorMessage?: string;
  children: React.ReactNode;
}

export const BaseNodeWrapper: React.FC<BaseNodeWrapperProps> = ({
  id,
  selected = false,
  title,
  subtitle,
  icon,
  iconBgColor = "bg-sky-500/20 text-sky-400 border-sky-500/30",
  status = "idle",
  executionTimeMs,
  errorMessage,
  children,
}) => {
  const { deleteNode, duplicateNode } = useFlowStore();

  const handleRunSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    executeWorkflow(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(id);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "running":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-sky-400 bg-sky-950/60 border border-sky-500/40 px-2 py-0.5 rounded-full animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Running
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            {executionTimeMs !== undefined ? `${executionTimeMs}ms` : "Done"}
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full" title={errorMessage}>
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative min-w-[280px] max-w-[340px] rounded-xl bg-slate-900/95 border transition-all duration-200 shadow-xl backdrop-blur-md ${
        selected
          ? "border-sky-400 ring-2 ring-sky-500/30 shadow-sky-500/10"
          : status === "running"
          ? "border-sky-500 ring-2 ring-sky-500/20 shadow-sky-500/20 animate-pulse"
          : status === "success"
          ? "border-emerald-500/80 ring-1 ring-emerald-500/20 shadow-emerald-500/10"
          : status === "error"
          ? "border-rose-500/80 ring-1 ring-rose-500/20 shadow-rose-500/10"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-slate-950/40 rounded-t-xl gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-1.5 rounded-lg border flex-shrink-0 ${iconBgColor}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-100 truncate">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {getStatusBadge()}
          <div className="flex items-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
            <button
              onClick={handleRunSingle}
              title="Run this node"
              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={handleDuplicate}
              title="Duplicate"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 text-xs text-slate-300">
        {children}
      </div>

      {/* Error Message Footer */}
      {errorMessage && (
        <div className="px-3 py-1.5 bg-rose-950/40 border-t border-rose-900/50 rounded-b-xl text-[11px] text-rose-300 break-words font-mono">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
