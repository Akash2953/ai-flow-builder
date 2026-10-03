// HeaderToolbar: Clean, uncluttered top bar with interactive brand mark, prominent highlighted workflow name, DAG validation badge, and primary execution trigger
// Importers/Callers: src/App.tsx
// Affected API: HeaderToolbar: React.FC<HeaderToolbarProps>, useViewStore.setView, useFlowStore, useExecutionStore, useSettingsStore, validateWorkflow, executeWorkflow
// Data Schema: HeaderToolbarProps

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Edit3,
  Check,
  X,
  Workflow,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useViewStore } from "../../store/useViewStore";
import { validateWorkflow, executeWorkflow } from "../../engine/dagRunner";

export interface HeaderToolbarProps {
  onOpenTemplates?: (mode?: "browse" | "save") => void;
  onOpenSettings?: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = () => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Flow store state
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const workflowName = useFlowStore((state) => state.workflowName);
  const setWorkflowMeta = useFlowStore((state) => state.setWorkflowMeta);

  // Execution store state
  const isExecuting = useExecutionStore((state) => state.currentRun?.status === "running");
  const setDrawerOpen = useExecutionStore((state) => state.setDrawerOpen);

  // View state (for returning to landing page)
  const setView = useViewStore((state) => state.setView);

  // Settings state
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
      className={`h-14 px-4 flex items-center justify-between z-20 select-none relative transition-colors duration-200 border-b ${
        isLight
          ? "bg-[#FAF8F5]/95 backdrop-blur-xl border-[#E7E2D8] text-[#2C2724] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          : "bg-[#080d1a]/95 backdrop-blur-xl border-slate-800/80 text-slate-100"
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
          Left: Interactive Brand Mark (Return to Overview) + Prominent Workflow Name Pill + Saved Indicator
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-3.5">
        {/* Interactive Brand Mark -> 3D Overview */}
        <button
          type="button"
          onClick={() => setView("landing")}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1 -m-1 transition-all"
          title="Return to 3D Overview"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm text-white transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(56,189,248,0.4)]">
            <Workflow className="w-4 h-4 drop-shadow-sm transition-transform duration-200 group-hover:rotate-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm font-bold tracking-tight transition-colors ${
                isLight ? "text-[#2C2724] group-hover:text-sky-600" : "text-slate-100 group-hover:text-sky-400"
              }`}
            >
              AI Flow
            </span>
            <span
              className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                isLight
                  ? "bg-amber-500/10 text-amber-800 border-amber-500/30 group-hover:border-amber-500/50"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 group-hover:border-cyan-500/40"
              }`}
            >
              PRO
            </span>
          </div>
        </button>

        <div className={`h-5 w-px ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

        {/* Hero-like Highlighted Workflow Name Editor */}
        <div className="flex items-center gap-2">
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
                className={`rounded-xl px-3 py-1 text-sm sm:text-base font-bold tracking-tight focus:outline-none focus:ring-2 shadow-inner w-56 sm:w-72 transition-all ${
                  isLight
                    ? "bg-[#F5F2EB] border border-amber-500/40 text-[#2C2724] focus:ring-amber-500/30"
                    : "bg-slate-900/90 border border-sky-500/50 text-slate-100 focus:ring-sky-500/40"
                }`}
                placeholder="Workflow name..."
              />
              <button
                type="button"
                onClick={handleSaveName}
                title="Save name (Enter)"
                className={`p-1.5 rounded-lg transition-colors border ${
                  isLight
                    ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 border-amber-500/30"
                    : "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/30"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditNameValue(workflowName);
                  setIsEditingName(false);
                }}
                title="Cancel (Esc)"
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight
                    ? "bg-[#EBE6DD] hover:bg-[#E0DACF] text-[#7A7269]"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-400"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 group cursor-pointer px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                isLight
                  ? "bg-gradient-to-b from-[#F5F2EB] to-[#EBE6DD] hover:from-[#EFE9DC] hover:to-[#E5DECF] border-[#DDD7C8] hover:border-[#CAC2B0] shadow-[0_1px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]"
                  : "bg-gradient-to-b from-slate-900/90 to-slate-950/90 hover:from-slate-800/90 hover:to-slate-900/90 border-slate-800/90 hover:border-slate-700/90 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
              }`}
              onClick={() => {
                setEditNameValue(workflowName);
                setIsEditingName(true);
              }}
              title="Click to rename workflow"
            >
              <span
                className={`text-sm sm:text-base font-bold tracking-tight transition-colors max-w-[180px] sm:max-w-[280px] md:max-w-[360px] truncate ${
                  isLight
                    ? "text-[#2C2724] group-hover:text-black"
                    : "text-slate-100 group-hover:text-white"
                }`}
              >
                {workflowName}
              </span>
              <Edit3
                className={`w-3.5 h-3.5 transition-all ${
                  isLight
                    ? "text-[#9C9287] group-hover:text-amber-700 opacity-60 group-hover:opacity-100"
                    : "text-slate-400 group-hover:text-sky-400 opacity-60 group-hover:opacity-100"
                }`}
              />
            </div>
          )}

          {/* Auto-saved Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-md ${
              isLight ? "text-[#7A7269] bg-[#EDE8DE]/60" : "text-slate-500 bg-slate-900/40"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLight
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                  : "bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
              }`}
            />
            <span>Saved</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Right / Center Controls: DAG Status Badge & Popover, Primary Run Button, Theme Toggle
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        {/* Validation Status Badge with Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowValidationPopover(!showValidationPopover)}
            className={`flex items-center gap-2 h-8.5 px-3 rounded-xl text-xs font-mono border whitespace-nowrap transition-all shadow-sm ${
              validation.valid
                ? isLight
                  ? "bg-emerald-500/10 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/20"
                  : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/15 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : isLight
                ? "bg-rose-500/10 border-rose-600/30 text-rose-800 hover:bg-rose-500/20"
                : "bg-rose-500/10 border-rose-500/25 text-rose-300 hover:bg-rose-500/15 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
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
                    isLight ? "text-emerald-800/70" : "text-emerald-400/70"
                  }`}
                >
                  ({nodes.length} nodes)
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isLight ? "text-emerald-800/70" : "text-emerald-400/70"
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
                  {validation.errors.length} DAG {validation.errors.length === 1 ? "Issue" : "Issues"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isLight ? "text-rose-700/80" : "text-rose-500/70"
                  } ${showValidationPopover ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>

          {/* Glassmorphic Validation Popover */}
          {showValidationPopover && (
            <div
              className={`absolute top-full mt-2.5 right-0 sm:left-1/2 sm:-translate-x-1/2 w-84 rounded-2xl p-4 z-50 text-xs animation-fade-in border ${
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

        {/* High-Impact Run Workflow Primary Action Button */}
        <button
          type="button"
          disabled={!validation.valid || isExecuting}
          onClick={handleRunWorkflow}
          className={`flex items-center gap-2 h-8.5 px-4 rounded-xl text-xs font-semibold transition-all select-none border whitespace-nowrap ${
            isExecuting
              ? isLight
                ? "bg-sky-600 border-sky-500 text-white animate-pulse shadow-md cursor-wait"
                : "bg-sky-600/90 border-sky-400/50 text-white animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-wait"
              : !validation.valid
              ? isLight
                ? "bg-[#EBE6DD] border-[#E7E2D8] text-[#9C9287] cursor-not-allowed opacity-70 shadow-none"
                : "bg-slate-900/80 border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60 shadow-none"
              : isLight
              ? "bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:via-sky-500 hover:to-indigo-500 active:scale-[0.98] text-white border-white/40 shadow-[0_2px_10px_rgba(14,165,233,0.35)] cursor-pointer"
              : "bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:via-sky-500 hover:to-indigo-500 active:scale-[0.98] text-white border-sky-400/30 shadow-[0_0_18px_rgba(56,189,248,0.25)] hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] cursor-pointer"
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-200" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-sky-100" />
              <span>Run Workflow</span>
            </>
          )}
        </button>

        <div className={`h-5 w-px ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

        {/* Dual Theme Toggle (Sun / Moon) */}
        <button
          type="button"
          onClick={() => setTheme(isLight ? "dark" : "light")}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className={`h-8 w-8 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269] hover:text-[#2C2724] hover:bg-white shadow-sm"
              : "bg-slate-900/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 shadow-sm"
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
