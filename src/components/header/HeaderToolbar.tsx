// HeaderToolbar: Top navigation and control bar for workflow orchestration, execution triggers, validation status, templates, settings, theme toggle, and file I/O
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore, useExecutionStore, useSettingsStore, dagRunner (validateWorkflow, executeWorkflow)
// Data Schema: AppNode, AppEdge, WorkflowExport from src/types/flow.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Play,
  Square,
  Sparkles,
  Settings,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Edit3,
  Check,
  X,
  Workflow,
  Terminal,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Zap,
  Activity,
  Sun,
  Moon,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { validateWorkflow, executeWorkflow } from "../../engine/dagRunner";
import { WorkflowExport } from "../../types/flow";

interface HeaderToolbarProps {
  onOpenTemplates: () => void;
  onOpenSettings: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  onOpenTemplates,
  onOpenSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Flow store state
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const workflowName = useFlowStore((state) => state.workflowName);
  const setWorkflowMeta = useFlowStore((state) => state.setWorkflowMeta);
  const exportWorkflow = useFlowStore((state) => state.exportWorkflow);
  const loadWorkflow = useFlowStore((state) => state.loadWorkflow);
  const clearCanvas = useFlowStore((state) => state.clearCanvas);

  // Execution store state
  const isExecuting = useExecutionStore((state) => state.currentRun?.status === "running");
  const setDrawerOpen = useExecutionStore((state) => state.setDrawerOpen);
  const isDrawerOpen = useExecutionStore((state) => state.isDrawerOpen);

  // Settings state
  const mockMode = useSettingsStore((state) => state.mockMode);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const isLight = theme === "light";

  // Inline name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(workflowName);
  const [showValidationPopover, setShowValidationPopover] = useState(false);

  // Keep edit value in sync when external workflow loads
  useEffect(() => {
    setEditNameValue(workflowName);
  }, [workflowName]);

  // Close validation popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowValidationPopover(false);
      }
    };
    if (showValidationPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showValidationPopover]);

  // Validate workflow DAG in real-time
  const validation = useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Count trigger nodes
  const triggerNodeCount = useMemo(() => {
    return nodes.filter((n) => n.type === "trigger").length;
  }, [nodes]);

  // Execute workflow handler
  const handleRunWorkflow = async () => {
    if (!validation.valid || isExecuting) return;

    setDrawerOpen(true);
    await executeWorkflow();
  };

  // Export workflow to JSON file
  const handleExportJson = () => {
    const data = exportWorkflow();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    const sanitizedName = (workflowName || "workflow")
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "_");
    downloadAnchor.setAttribute("download", `${sanitizedName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import workflow from JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed: WorkflowExport = JSON.parse(
          event.target?.result as string
        );
        if (parsed.nodes && Array.isArray(parsed.nodes)) {
          loadWorkflow(parsed);
        } else {
          alert("Invalid workflow JSON schema: Missing 'nodes' array.");
        }
      } catch (err) {
        alert("Failed to parse JSON file. Please check file format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveName = () => {
    if (editNameValue.trim()) {
      setWorkflowMeta(editNameValue.trim());
    } else {
      setEditNameValue(workflowName);
    }
    setIsEditingName(false);
  };

  return (
    <header
      className={`h-14 px-4 lg:px-5 flex items-center justify-between z-20 select-none relative transition-colors duration-200 ${
        isLight
          ? "bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#E7E2D8] text-[#2C2724] shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_-1px_0_rgba(255,255,255,0.8)]"
          : "bg-[#080d1a]/95 backdrop-blur-xl border-b border-slate-800/80 text-slate-100"
      }`}
    >
      {/* Top subtle ambient gradient line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] pointer-events-none ${
          isLight
            ? "bg-gradient-to-r from-transparent via-amber-600/20 to-transparent"
            : "bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"
        }`}
      />

      {/* -------------------------------------------------------------
          Left: Brand Mark, Workflow Name Editor, Auto-save Badge
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-3.5">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-indigo-600 flex items-center justify-center shadow-[0_0_16px_rgba(56,189,248,0.25)] border border-white/20 text-white transition-transform group-hover:scale-105">
            <Workflow className="w-4 h-4 drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-black tracking-wider uppercase ${
                  isLight ? "text-[#2C2724]" : "text-slate-100"
                }`}
              >
                AI Flow
              </span>
              <span
                className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border ${
                  isLight
                    ? "bg-amber-500/10 text-amber-800 border-amber-500/30"
                    : "bg-sky-500/10 text-sky-400 border-sky-500/25"
                }`}
              >
                PRO
              </span>
            </div>
            <p
              className={`text-[10px] font-medium tracking-tight ${
                isLight ? "text-[#7A7269]" : "text-slate-500"
              }`}
            >
              Visual DAG Engine
            </p>
          </div>
        </div>

        <div
          className={`h-5 w-px mx-0.5 ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800/80"
          }`}
        />

        {/* Workflow Name Editor & Status Indicator */}
        <div className="flex items-center gap-2.5">
          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") {
                    setEditNameValue(workflowName);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
                className={`rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 shadow-inner w-56 transition-all ${
                  isLight
                    ? "bg-[#F5F2EB] border border-[#D4CEB8] text-[#2C2724] focus:ring-amber-500/20"
                    : "bg-slate-900/90 border border-sky-500/50 text-slate-100 focus:ring-sky-500/20"
                }`}
                placeholder="Workflow name..."
              />
              <button
                type="button"
                onClick={handleSaveName}
                title="Save name (Enter)"
                className={`p-1 rounded-md transition-colors border ${
                  isLight
                    ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border-amber-500/30"
                    : "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditNameValue(workflowName);
                  setIsEditingName(false);
                }}
                title="Cancel (Esc)"
                className={`p-1 rounded-md transition-colors ${
                  isLight
                    ? "bg-[#EBE6DD] hover:bg-[#E0DACF] text-[#7A7269]"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-400"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 group cursor-pointer px-2 py-1 -mx-2 rounded-lg border transition-all ${
                isLight
                  ? "hover:bg-[#F5F2EB] border-transparent hover:border-[#E7E2D8]"
                  : "hover:bg-slate-900/70 border-transparent hover:border-slate-800"
              }`}
              onClick={() => {
                setEditNameValue(workflowName);
                setIsEditingName(true);
              }}
              title="Click to rename workflow"
            >
              <span
                className={`text-xs font-semibold transition-colors max-w-[200px] sm:max-w-[260px] truncate ${
                  isLight
                    ? "text-[#2C2724] group-hover:text-black"
                    : "text-slate-200 group-hover:text-white"
                }`}
              >
                {workflowName}
              </span>
              <Edit3
                className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-all ${
                  isLight
                    ? "text-[#9C9287] group-hover:text-amber-600"
                    : "text-slate-500 group-hover:text-sky-400"
                }`}
              />
            </div>
          )}

          {/* Auto-saved Indicator */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                : "bg-slate-900/60 border-slate-800/60 text-slate-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLight
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                  : "bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
              }`}
            />
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Center: DAG Status Badge, Topology Popover & Run Trigger
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        {/* Validation Status Badge with Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowValidationPopover(!showValidationPopover)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono border transition-all shadow-sm ${
              validation.valid
                ? isLight
                  ? "bg-emerald-500/10 border-emerald-600/30 text-emerald-700 hover:bg-emerald-500/20 hover:border-emerald-600/40"
                  : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                : isLight
                ? "bg-rose-500/10 border-rose-600/30 text-rose-700 hover:bg-rose-500/20 hover:border-rose-600/40"
                : "bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
            }`}
          >
            {validation.valid ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isLight ? "bg-emerald-500" : "bg-emerald-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLight ? "bg-emerald-600" : "bg-emerald-500"
                    }`}
                  />
                </span>
                <span className="font-semibold tracking-tight">DAG Valid</span>
                <span
                  className={`text-[10px] ${
                    isLight ? "text-emerald-700/80" : "text-emerald-500/70"
                  }`}
                >
                  ({nodes.length} nodes)
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isLight ? "text-emerald-700/80" : "text-emerald-500/70"
                  } ${showValidationPopover ? "rotate-180" : ""}`}
                />
              </>
            ) : (
              <>
                <AlertTriangle
                  className={`w-3.5 h-3.5 animate-pulse ${
                    isLight ? "text-rose-600" : "text-rose-400"
                  }`}
                />
                <span className="font-semibold tracking-tight">
                  {validation.errors.length} DAG{" "}
                  {validation.errors.length === 1 ? "Issue" : "Issues"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isLight ? "text-rose-700/80" : "text-rose-500/70"
                  } ${showValidationPopover ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>

          {/* Upgraded Glassmorphic Validation Popover */}
          {showValidationPopover && (
            <div
              className={`absolute top-full mt-2.5 left-1/2 -translate-x-1/2 w-84 rounded-2xl p-4 z-50 text-xs animation-fade-in border ${
                isLight
                  ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] shadow-[0_12px_32px_rgba(180,165,145,0.25)]"
                  : "bg-[#0c1220]/95 backdrop-blur-xl border-slate-800/90 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              }`}
            >
              {/* Popover Header */}
              <div
                className={`flex items-center justify-between pb-2.5 border-b mb-3 ${
                  isLight ? "border-[#E7E2D8]" : "border-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      validation.valid
                        ? isLight
                          ? "text-emerald-600"
                          : "text-emerald-400"
                        : isLight
                        ? "text-rose-600"
                        : "text-rose-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      isLight ? "text-[#2C2724]" : "text-slate-100"
                    }`}
                  >
                    DAG Topology Audit
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isLight
                        ? "bg-[#F5F2EB] text-[#7A7269] border-[#E7E2D8]"
                        : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                    }`}
                  >
                    {nodes.length}N / {edges.length}E
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowValidationPopover(false)}
                    className={`p-1 rounded-md transition-colors ${
                      isLight
                        ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Popover Body */}
              {validation.valid ? (
                <div className="space-y-3">
                  <div
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                      isLight
                        ? "bg-emerald-500/10 border-emerald-600/25 text-emerald-800"
                        : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isLight ? "text-emerald-600" : "text-emerald-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold text-xs ${
                          isLight ? "text-emerald-900" : "text-emerald-300"
                        }`}
                      >
                        Ready for Execution
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed ${
                          isLight ? "text-emerald-800/90" : "text-emerald-400/80"
                        }`}
                      >
                        Topological order resolved with no circular dependency deadlocks.
                      </p>
                    </div>
                  </div>

                  {/* DAG Integrity Checklist */}
                  <div
                    className={`space-y-1.5 pt-1 text-[11px] ${
                      isLight ? "text-[#443E3A]" : "text-slate-300"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                        isLight ? "bg-[#F5F2EB]" : "bg-slate-900/50"
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isLight ? "text-emerald-600" : "text-emerald-400"
                        }`}
                      />
                      <span>
                        Entry Triggers:{" "}
                        <strong
                          className={`font-mono ${
                            isLight ? "text-[#2C2724]" : "text-slate-100"
                          }`}
                        >
                          {triggerNodeCount}
                        </strong>{" "}
                        node{triggerNodeCount === 1 ? "" : "s"} detected
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                        isLight ? "bg-[#F5F2EB]" : "bg-slate-900/50"
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isLight ? "text-emerald-600" : "text-emerald-400"
                        }`}
                      />
                      <span>
                        Cycle Detection:{" "}
                        <strong
                          className={`font-mono ${
                            isLight ? "text-[#2C2724]" : "text-slate-100"
                          }`}
                        >
                          0
                        </strong>{" "}
                        circular loops found
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                        isLight ? "bg-[#F5F2EB]" : "bg-slate-900/50"
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isLight ? "text-emerald-600" : "text-emerald-400"
                        }`}
                      />
                      <span>Orchestration: Single DAG pipeline active</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div
                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                      isLight
                        ? "bg-rose-500/10 border-rose-600/25 text-rose-800"
                        : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                    }`}
                  >
                    <AlertCircle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isLight ? "text-rose-600" : "text-rose-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold text-xs ${
                          isLight ? "text-rose-900" : "text-rose-300"
                        }`}
                      >
                        Topology Verification Failed
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed ${
                          isLight ? "text-rose-800/90" : "text-rose-400/80"
                        }`}
                      >
                        Resolve the following DAG schema conflicts before execution.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {validation.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] ${
                          isLight
                            ? "bg-[#F5F2EB] border-[#E7E2D8] text-rose-700"
                            : "bg-slate-900/60 border-slate-800/80 text-rose-300"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                            isLight ? "bg-rose-600" : "bg-rose-400"
                          }`}
                        />
                        <span className="leading-snug">{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* High-Impact Run Workflow Action Button */}
        <button
          type="button"
          disabled={!validation.valid || isExecuting}
          onClick={handleRunWorkflow}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all select-none border ${
            isExecuting
              ? isLight
                ? "bg-sky-600 border-sky-500 text-white animate-pulse shadow-md cursor-wait"
                : "bg-sky-600/90 border-sky-400/50 text-white animate-pulse shadow-[0_0_24px_rgba(56,189,248,0.4)] cursor-wait"
              : !validation.valid
              ? isLight
                ? "bg-[#EBE6DD] border-[#E7E2D8] text-[#9C9287] cursor-not-allowed opacity-70 shadow-none"
                : "bg-slate-900/80 border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60 shadow-none"
              : isLight
              ? "bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:via-sky-500 hover:to-indigo-500 active:scale-[0.98] text-white border-white/40 shadow-[0_2px_8px_rgba(14,165,233,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_4px_16px_rgba(14,165,233,0.5)]"
              : "bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:via-sky-500 hover:to-indigo-500 active:scale-[0.98] text-white border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_28px_rgba(56,189,248,0.4)]"
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-200" />
              <span>Running Flow...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-sky-100" />
              <span>Run Workflow</span>
            </>
          )}
        </button>
      </div>

      {/* -------------------------------------------------------------
          Right: Templates, JSON I/O, Canvas Clear, Logs, Settings, Theme
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-2">
        {/* Templates Picker Trigger */}
        <button
          type="button"
          onClick={onOpenTemplates}
          title="Browse Workflow Templates"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium group ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A] hover:bg-[#EBE6DD] hover:text-[#2C2724] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-slate-900/80 border-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-800/90 hover:border-slate-700 shadow-sm"
          }`}
        >
          <Sparkles
            className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${
              isLight ? "text-amber-500" : "text-amber-400"
            }`}
          />
          <span>Templates</span>
        </button>

        {/* JSON File Export / Import / Clear Canvas Button Group */}
        <div
          className={`flex items-center gap-0.5 p-0.5 rounded-xl border ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-slate-900/80 border-slate-800/80"
          }`}
        >
          <button
            type="button"
            onClick={handleExportJson}
            title="Export Workflow JSON"
            className={`p-1.5 rounded-lg transition-all ${
              isLight
                ? "hover:bg-[#EBE6DD] text-[#7A7269] hover:text-sky-600"
                : "hover:bg-slate-800/80 text-slate-400 hover:text-sky-400"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import Workflow JSON"
            className={`p-1.5 rounded-lg transition-all ${
              isLight
                ? "hover:bg-[#EBE6DD] text-[#7A7269] hover:text-sky-600"
                : "hover:bg-slate-800/80 text-slate-400 hover:text-sky-400"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <div
            className={`h-3 w-px mx-0.5 ${
              isLight ? "bg-[#E7E2D8]" : "bg-slate-800"
            }`}
          />

          <button
            type="button"
            onClick={() => {
              if (nodes.length === 0 || confirm("Clear all nodes and connections from the canvas?")) {
                clearCanvas();
              }
            }}
            title="Clear Canvas"
            className={`p-1.5 rounded-lg transition-all ${
              isLight
                ? "hover:bg-[#EBE6DD] text-[#7A7269] hover:text-rose-600"
                : "hover:bg-slate-800/80 text-slate-400 hover:text-rose-400"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportJson}
          className="hidden"
        />

        <div
          className={`h-5 w-px mx-0.5 ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800/80"
          }`}
        />

        {/* Execution Logs Drawer Toggle */}
        <button
          type="button"
          onClick={() => setDrawerOpen(!isDrawerOpen)}
          title="Toggle Execution Telemetry & Logs Drawer"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            isDrawerOpen
              ? isLight
                ? "bg-sky-500/15 border-sky-500/40 text-sky-700 shadow-sm"
                : "bg-sky-500/15 border-sky-500/40 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
              : isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-slate-900/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logs</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="API Keys & Engine Settings"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all group ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A] hover:bg-[#EBE6DD] hover:text-[#2C2724] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "bg-slate-900/80 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700 shadow-sm"
          }`}
        >
          <Settings
            className={`w-3.5 h-3.5 group-hover:rotate-45 transition-transform ${
              isLight ? "text-[#7A7269] group-hover:text-[#2C2724]" : "text-slate-400 group-hover:text-slate-200"
            }`}
          />
          <span className="hidden sm:inline">Settings</span>
          {mockMode && (
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isLight
                  ? "bg-amber-500 ring-2 ring-amber-500/20"
                  : "bg-amber-400 ring-2 ring-amber-400/20"
              }`}
              title="Mock Simulation Mode Active"
            />
          )}
        </button>

        {/* Dual Theme Toggle: Sun / Moon Button */}
        <button
          type="button"
          onClick={() => setTheme(isLight ? "dark" : "light")}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className={`p-1.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A] hover:bg-[#EBE6DD] hover:text-[#2C2724] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] active:scale-95"
              : "bg-slate-900/80 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700 shadow-sm active:scale-95"
          }`}
        >
          {isLight ? (
            <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-200 hover:rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          )}
        </button>
      </div>
    </header>
  );
};
