// BaseNodeWrapper: Dual-theme container for all React Flow nodes with header, telemetry, hover actions, scanning beam, and error banner
// Importers/Callers: TriggerNode, LLMNode, ConditionNode, TransformNode, HttpRequestNode, OutputNode
// Affected API: NodeExecutionStatus, useFlowStore (deleteNode, duplicateNode), executeWorkflow, useSettingsStore (theme)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, Play, Copy, Trash2, FastForward } from "lucide-react";
import { NodeExecutionStatus } from "../../types/flow";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { executeWorkflow } from "../../engine/dagRunner";

interface BaseNodeWrapperProps {
  id: string;
  selected?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  accentColor?: string;
  status?: NodeExecutionStatus;
  executionTimeMs?: number;
  errorMessage?: string;
  children?: React.ReactNode;
}

export const BaseNodeWrapper: React.FC<BaseNodeWrapperProps> = ({
  id,
  selected = false,
  title = "Node",
  subtitle,
  icon,
  iconBgColor = "bg-sky-500/10 text-sky-400 border-sky-500/25",
  accentColor,
  status = "idle",
  executionTimeMs,
  errorMessage,
  children,
}) => {
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const duplicateNode = useFlowStore((state) => state.duplicateNode);
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

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
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full animate-pulse ${
              isLight
                ? "text-amber-700 bg-amber-500/15 border border-amber-500/40 shadow-sm"
                : "text-sky-400 bg-sky-950/70 border border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]"
            }`}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>RUNNING</span>
          </span>
        );
      case "success":
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
              isLight
                ? "text-emerald-700 bg-emerald-500/15 border border-emerald-500/40 shadow-sm"
                : "text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLight ? "bg-emerald-600 animate-ping" : "bg-emerald-400 animate-ping"
              }`}
            ></span>
            <span>{executionTimeMs !== undefined ? `${executionTimeMs}ms` : "DONE"}</span>
          </span>
        );
      case "skipped":
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
              isLight
                ? "text-stone-600 bg-stone-200/80 border border-stone-300 shadow-sm"
                : "text-slate-400 bg-slate-800/80 border border-slate-700/60"
            }`}
          >
            <FastForward className="w-3 h-3 text-slate-400" />
            <span>SKIPPED</span>
          </span>
        );
      case "error":
        return (
          <span
            className={`flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
              isLight
                ? "text-rose-700 bg-rose-500/15 border border-rose-500/40 shadow-sm"
                : "text-rose-400 bg-rose-950/70 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
            }`}
            title={errorMessage}
          >
            <AlertCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative min-w-[280px] max-w-[340px] rounded-xl border transition-all duration-300 ease-out select-none ${
        isLight
          ? `bg-[#FAF8F5] text-[#443E3A] shadow-[0_1px_3px_rgba(180,165,145,0.15),0_6px_24px_-4px_rgba(180,165,145,0.2),0_0_0_1px_rgba(231,226,216,0.7),inset_0_1px_0_rgba(255,255,255,0.9)] ${
              selected
                ? "border-amber-600/80 ring-2 ring-amber-500/25 shadow-[0_4px_8px_rgba(180,165,145,0.25),0_20px_48px_-8px_rgba(217,119,6,0.3),0_0_0_1px_rgba(231,226,216,0.8),inset_0_1px_0_rgba(255,255,255,0.95)] -translate-y-1"
                : status === "running"
                ? "border-amber-500 ring-4 ring-amber-500/40 shadow-[0_8px_20px_rgba(180,165,145,0.25),0_24px_50px_-4px_rgba(217,119,6,0.4),0_0_0_1px_rgba(231,226,216,0.9),inset_0_1px_0_rgba(255,255,255,0.95)] animate-pulse -translate-y-2.5 scale-[1.02] z-30"
                : status === "success"
                ? "border-emerald-500/70 ring-1 ring-emerald-500/25 shadow-[0_2px_6px_rgba(16,185,129,0.12),0_8px_24px_-4px_rgba(16,185,129,0.18),0_0_0_1px_rgba(231,226,216,0.7),inset_0_1px_0_rgba(255,255,255,0.9)] translate-y-0 scale-100"
                : status === "skipped"
                ? "border-stone-300/80 opacity-75 translate-y-0 scale-100"
                : status === "error"
                ? "border-rose-500/60 ring-1 ring-rose-500/20 shadow-[0_2px_6px_rgba(244,63,94,0.12),0_8px_28px_-4px_rgba(244,63,94,0.18),0_0_0_1px_rgba(231,226,216,0.7),inset_0_1px_0_rgba(255,255,255,0.9)] translate-y-0 scale-100"
                : "border-[#E7E2D8] hover:border-[#D9D1C5] hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(180,165,145,0.2),0_16px_40px_-6px_rgba(180,165,145,0.28),0_0_0_1px_rgba(231,226,216,0.8),inset_0_1px_0_rgba(255,255,255,0.95)] translate-y-0 scale-100"
            }`
          : `bg-[#0c1220]/95 backdrop-blur-md text-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_-2px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] ${
              selected
                ? "border-sky-500/90 ring-1 ring-sky-400/50 shadow-[0_4px_8px_rgba(0,0,0,0.5),0_20px_48px_-8px_rgba(56,189,248,0.3),0_0_0_1px_rgba(255,255,255,0.1)] -translate-y-1"
                : status === "running"
                ? "border-sky-400 ring-4 ring-sky-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_24px_50px_-4px_rgba(56,189,248,0.45),0_0_0_1px_rgba(255,255,255,0.12)] animate-pulse -translate-y-2.5 scale-[1.02] z-30"
                : status === "success"
                ? "border-emerald-500/70 ring-1 ring-emerald-500/25 shadow-[0_2px_4px_rgba(0,0,0,0.4),0_8px_28px_-4px_rgba(16,185,129,0.2),0_0_0_1px_rgba(255,255,255,0.06)] translate-y-0 scale-100"
                : status === "skipped"
                ? "border-slate-800/60 opacity-60 translate-y-0 scale-100"
                : status === "error"
                ? "border-rose-500/60 ring-1 ring-rose-500/20 shadow-[0_2px_4px_rgba(0,0,0,0.4),0_8px_28px_-4px_rgba(244,63,94,0.2),0_0_0_1px_rgba(255,255,255,0.06)] translate-y-0 scale-100"
                : "border-slate-800/80 hover:border-slate-700/90 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_32px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] translate-y-0 scale-100"
            }`
      }`}
    >
      {/* Card Ground Shadow */}
      <div
        className={`absolute -bottom-1 inset-x-2 h-2 rounded-full blur-md pointer-events-none ${
          isLight ? "bg-black/10" : "bg-black/30"
        }`}
      />

      {/* Top Ambient Highlight Rim */}
      <div
        className={`absolute inset-x-0 top-0 h-[1px] rounded-t-xl pointer-events-none ${
          isLight
            ? "bg-gradient-to-r from-transparent via-amber-600/25 to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"
        }`}
      />

      {/* Active Execution Scanning Beam */}
      {status === "running" && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Card Header */}
      <div
        className={`flex items-center justify-between p-3 border-b rounded-t-xl gap-2 ${
          isLight
            ? "bg-[#F5F2EB]/90 border-[#E7E2D8]"
            : "bg-[#090e1a]/70 border-slate-800/70"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-sm ${iconBgColor}`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3
              className={`text-xs font-semibold tracking-tight truncate transition-colors ${
                isLight
                  ? "text-[#2C2724] group-hover:text-black"
                  : "text-slate-100 group-hover:text-white"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={`text-[10px] font-mono truncate tracking-tight ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge & Hover Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {getStatusBadge()}

          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-lg border shadow-md opacity-0 group-hover:opacity-100 transition-all duration-150 ${
              isLight
                ? "bg-[#FAF8F5] border-[#E7E2D8]"
                : "bg-slate-900/90 border-slate-800/80"
            }`}
          >
            <button
              onClick={handleRunSingle}
              title="Run this node"
              className={`p-1 rounded-md active:scale-95 transition-all duration-150 ${
                isLight
                  ? "text-[#7A7269] hover:text-amber-700 hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-sky-400 hover:bg-slate-800"
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
            </button>
            <button
              onClick={handleDuplicate}
              title="Duplicate node"
              className={`p-1 rounded-md active:scale-95 transition-all duration-150 ${
                isLight
                  ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete node"
              className={`p-1 rounded-md active:scale-95 transition-all duration-150 ${
                isLight
                  ? "text-[#7A7269] hover:text-rose-600 hover:bg-[#EBE6DD]"
                  : "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              }`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className={`p-3 text-xs ${isLight ? "text-[#443E3A]" : "text-slate-300"}`}>
        {children}
      </div>

      {/* Error Message Footer */}
      {errorMessage && (
        <div
          className={`px-3 py-2 border-t rounded-b-xl text-[10px] font-mono break-words flex items-start gap-1.5 ${
            isLight
              ? "bg-rose-500/10 border-rose-500/25 text-rose-700"
              : "bg-rose-950/60 border-rose-900/50 text-rose-300"
          }`}
        >
          <AlertCircle
            className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
              isLight ? "text-rose-600" : "text-rose-400"
            }`}
          />
          <span className="leading-tight">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
