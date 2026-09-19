// ExecutionDrawer: Bottom collapsible telemetry drawer for real-time logs, step outputs, token counts, and execution metrics
// Importers/Callers: src/App.tsx
// Affected API: useExecutionStore (currentRun, isDrawerOpen, setDrawerOpen, resetRun), useFlowStore (setSelectedNodeId), useSettingsStore (theme)
// Data Schema: ExecutionRun, ExecutionStep from src/types/execution.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Terminal,
  Zap,
  Coins,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Activity,
  Layers,
} from "lucide-react";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { ExecutionStep } from "../../types/execution";

type DetailTab = "output" | "logs" | "input" | "raw";

const getNodeTypeStyle = (type: string, isLight: boolean = false) => {
  switch (type) {
    case "trigger":
      return {
        label: "Trigger",
        bg: "bg-amber-500/10",
        border: isLight ? "border-amber-500/30" : "border-amber-500/25",
        text: isLight ? "text-amber-700" : "text-amber-400",
      };
    case "llm":
      return {
        label: "AI Agent",
        bg: "bg-sky-500/10",
        border: isLight ? "border-sky-500/30" : "border-sky-500/25",
        text: isLight ? "text-sky-700" : "text-sky-400",
      };
    case "condition":
      return {
        label: "Condition",
        bg: "bg-purple-500/10",
        border: isLight ? "border-purple-500/30" : "border-purple-500/25",
        text: isLight ? "text-purple-700" : "text-purple-400",
      };
    case "transform":
      return {
        label: "Transform",
        bg: "bg-emerald-500/10",
        border: isLight ? "border-emerald-500/30" : "border-emerald-500/25",
        text: isLight ? "text-emerald-700" : "text-emerald-400",
      };
    case "httpRequest":
      return {
        label: "HTTP",
        bg: "bg-cyan-500/10",
        border: isLight ? "border-cyan-500/30" : "border-cyan-500/25",
        text: isLight ? "text-cyan-700" : "text-cyan-400",
      };
    case "output":
      return {
        label: "Output",
        bg: "bg-rose-500/10",
        border: isLight ? "border-rose-500/30" : "border-rose-500/25",
        text: isLight ? "text-rose-700" : "text-rose-400",
      };
    default:
      return {
        label: type || "Node",
        bg: "bg-slate-500/10",
        border: isLight ? "border-slate-500/30" : "border-slate-500/25",
        text: isLight ? "text-slate-700" : "text-slate-400",
      };
  }
};

export const ExecutionDrawer: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const currentRun = useExecutionStore((state) => state.currentRun);
  const isDrawerOpen = useExecutionStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useExecutionStore((state) => state.setDrawerOpen);
  const resetRun = useExecutionStore((state) => state.resetRun);
  const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("output");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active step selection or fallback to last step
  const activeStep = useMemo(() => {
    if (!currentRun || currentRun.steps.length === 0) return null;
    if (selectedStepId) {
      const found = currentRun.steps.find((s) => s.id === selectedStepId);
      if (found) return found;
    }
    return currentRun.steps[currentRun.steps.length - 1];
  }, [currentRun, selectedStepId]);

  const handleCopy = (text: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms?: number) => {
    if (ms === undefined || ms === null) return "--";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusBadge = () => {
    if (!currentRun) {
      return (
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono shadow-sm border ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
              : "bg-slate-900/80 border-slate-800 text-slate-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLight ? "bg-[#7A7269]" : "bg-slate-500"
            }`}
          />
          Idle
        </span>
      );
    }

    switch (currentRun.status) {
      case "running":
        return (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono animate-pulse border ${
              isLight
                ? "bg-sky-50 border-sky-300 text-sky-800 shadow-[0_1px_4px_rgba(56,189,248,0.2)]"
                : "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            }`}
          >
            <Loader2
              className={`w-3 h-3 animate-spin ${
                isLight ? "text-sky-700" : "text-sky-400"
              }`}
            />
            <span>RUNNING</span>
          </span>
        );
      case "success":
        return (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isLight
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-[0_1px_4px_rgba(16,185,129,0.2)]"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isLight ? "text-emerald-700" : "text-emerald-400"
              }`}
            />
            <span>SUCCESS</span>
          </span>
        );
      case "error":
        return (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isLight
                ? "bg-rose-50 border-rose-300 text-rose-800 shadow-[0_1px_4px_rgba(244,63,94,0.2)]"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
            }`}
          >
            <AlertCircle
              className={`w-3.5 h-3.5 ${
                isLight ? "text-rose-700" : "text-rose-400"
              }`}
            />
            <span>FAILED</span>
          </span>
        );
      default:
        return (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            {currentRun.status}
          </span>
        );
    }
  };

  const completedStepsCount = useMemo(() => {
    if (!currentRun) return 0;
    return currentRun.steps.filter((s) => s.status === "success").length;
  }, [currentRun]);

  const activeStepTypeStyle = activeStep ? getNodeTypeStyle(activeStep.nodeType, isLight) : null;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out ${
        isLight
          ? "bg-[#FAF8F5]/95 border-t border-[#E7E2D8] shadow-[0_-8px_32px_rgba(180,165,145,0.2)] text-[#2C2724]"
          : "bg-[#080d18]/95 border-t border-slate-800/80 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] text-slate-100"
      } ${
        isDrawerOpen
          ? isExpanded
            ? "h-[68vh]"
            : "h-80"
          : "h-11"
      }`}
    >
      {/* Top Ambient Highlight Rim */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] pointer-events-none transition-all duration-300 ${
          currentRun?.status === "running"
            ? isLight
              ? "bg-gradient-to-r from-transparent via-sky-400/60 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.4)]"
              : "bg-gradient-to-r from-transparent via-sky-500/50 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            : currentRun?.status === "success"
            ? isLight
              ? "bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"
              : "bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
            : currentRun?.status === "error"
            ? isLight
              ? "bg-gradient-to-r from-transparent via-rose-400/60 to-transparent"
              : "bg-gradient-to-r from-transparent via-rose-500/40 to-transparent"
            : isLight
            ? "bg-gradient-to-r from-transparent via-[#E7E2D8] to-transparent"
            : "bg-gradient-to-r from-transparent via-slate-700/30 to-transparent"
        }`}
      />

      {/* -------------------------------------------------------------
          Header & Telemetry Bar
          ------------------------------------------------------------- */}
      <div
        className={`h-11 px-4 border-b flex items-center justify-between select-none transition-colors ${
          isLight
            ? "bg-[#FAF8F5] border-[#E7E2D8]"
            : "bg-[#0c1220]/95 border-slate-800/80"
        }`}
      >
        {/* Left Telemetry Overview */}
        <div
          className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
          onClick={() => setDrawerOpen(!isDrawerOpen)}
        >
          {/* Terminal Icon & Title */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all ${
                isLight
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-800 shadow-[0_2px_8px_rgba(245,158,11,0.15)]"
                  : "bg-sky-500/10 border border-sky-500/25 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold tracking-tight transition-colors ${
                  isLight
                    ? "text-[#2C2724] group-hover:text-black"
                    : "text-slate-200 group-hover:text-white"
                }`}
              >
                Execution Telemetry
              </span>
              <span
                className={`hidden sm:inline text-[10px] font-mono ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                DAG Runtime
              </span>
            </div>
          </div>

          <div
            className={`h-4 w-px hidden sm:block ${
              isLight ? "bg-[#E7E2D8]" : "bg-slate-800/80"
            }`}
          />

          {/* Status Badge */}
          <div className="flex-shrink-0">{getStatusBadge()}</div>

          {/* Live Telemetry Metrics */}
          {currentRun && (
            <div
              className={`hidden md:flex items-center gap-3 text-[11px] font-mono ${
                isLight ? "text-[#2C2724]" : "text-slate-300"
              }`}
            >
              {/* Duration Clock */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border shadow-sm ${
                  isLight
                    ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724]"
                    : "bg-slate-900/80 border-slate-800/80 text-slate-300"
                }`}
              >
                <Clock
                  className={`w-3 h-3 ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}
                />
                <span>{formatDuration(currentRun.totalDurationMs)}</span>
              </div>

              {/* Total Tokens Counter */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border shadow-sm ${
                  isLight
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}
              >
                <Coins
                  className={`w-3 h-3 ${
                    isLight ? "text-amber-700" : "text-amber-400"
                  }`}
                />
                <span>{currentRun.totalTokens || 0} tokens</span>
              </div>

              {/* Step Progress Pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border shadow-sm ${
                  isLight
                    ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                    : "bg-slate-900/80 border-slate-800/80 text-slate-400"
                }`}
              >
                <Layers
                  className={`w-3 h-3 ${
                    isLight ? "text-[#8E8275]" : "text-slate-500"
                  }`}
                />
                <span>
                  <strong
                    className={`font-semibold ${
                      isLight ? "text-[#2C2724]" : "text-slate-200"
                    }`}
                  >
                    {completedStepsCount}
                  </strong>
                  <span className={isLight ? "text-[#9C9287]" : "text-slate-500"}>
                    {" "}
                    /{" "}
                  </span>
                  <span>{currentRun.steps.length} steps</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {currentRun && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetRun();
              }}
              title="Clear Run History & Telemetry"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border border-transparent transition-all text-[11px] font-medium ${
                isLight
                  ? "text-[#7A7269] hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                  : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Clear</span>
            </button>
          )}

          {isDrawerOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? "Collapse height" : "Maximize height"}
              className={`p-1.5 rounded-lg border border-transparent transition-all ${
                isLight
                  ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD] hover:border-[#D8D1C5]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700/60"
              }`}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(!isDrawerOpen)}
            title={isDrawerOpen ? "Collapse drawer" : "Open telemetry drawer"}
            className={`p-1.5 rounded-lg border border-transparent transition-all ${
              isLight
                ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD] hover:border-[#D8D1C5]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700/60"
            }`}
          >
            {isDrawerOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          Drawer Body (Timeline Sidebar + Step Detail Pane)
          ------------------------------------------------------------- */}
      {isDrawerOpen && (
        <div className="flex-1 flex overflow-hidden">
          {/* Step Sequence Timeline (Left) */}
          <div
            className={`w-72 md:w-80 border-r flex flex-col overflow-hidden select-none flex-shrink-0 transition-colors ${
              isLight
                ? "border-[#E7E2D8] bg-[#FAF8F5]"
                : "border-slate-800/80 bg-[#070b14]/90"
            }`}
          >
            <div
              className={`px-3.5 py-2.5 border-b flex items-center justify-between transition-colors ${
                isLight
                  ? "border-[#E7E2D8] bg-[#FAF8F5]"
                  : "border-slate-800/60 bg-[#070b14]"
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? "text-[#8E8275]" : "text-slate-400"
                }`}
              >
                <Activity
                  className={`w-3.5 h-3.5 ${
                    isLight ? "text-amber-600" : "text-sky-400"
                  }`}
                />
                Execution Sequence
              </span>
              {currentRun && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isLight
                      ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                      : "text-slate-400 bg-slate-900/80 border-slate-800"
                  }`}
                >
                  {currentRun.steps.length} node
                  {currentRun.steps.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5">
              {!currentRun || currentRun.steps.length === 0 ? (
                <div
                  className={`h-full flex flex-col items-center justify-center text-center p-6 space-y-2 ${
                    isLight ? "text-[#7A7269]" : "text-slate-500"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner ${
                      isLight
                        ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                        : "bg-slate-900/80 border-slate-800/80 text-slate-600"
                    }`}
                  >
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        isLight ? "text-[#2C2724]" : "text-slate-400"
                      }`}
                    >
                      No active execution
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isLight ? "text-[#7A7269]" : "text-slate-500"
                      }`}
                    >
                      Run workflow to stream live steps & telemetry
                    </p>
                  </div>
                </div>
              ) : (
                currentRun.steps.map((step, idx) => {
                  const isSelected = activeStep?.id === step.id;
                  const typeStyle = getNodeTypeStyle(step.nodeType, isLight);

                  return (
                    <div
                      key={step.id || idx}
                      onClick={() => {
                        setSelectedStepId(step.id);
                        setSelectedNodeId(step.nodeId);
                      }}
                      className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                        isSelected
                          ? isLight
                            ? "bg-[#EBE6DD] border-amber-600/60 shadow-[0_2px_8px_rgba(180,165,145,0.2)] ring-1 ring-amber-500/30 text-[#2C2724]"
                            : "bg-[#10182b] border-sky-500/50 shadow-[0_0_18px_rgba(56,189,248,0.18)] ring-1 ring-sky-500/30 text-white"
                          : isLight
                          ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] border-[#E7E2D8] hover:border-[#D8D1C5] text-[#443E3A]"
                          : "bg-[#090e1a]/70 hover:bg-[#0c1424] border-slate-800/60 hover:border-slate-700/80 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Status Icon & Step Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex-shrink-0">
                            {step.status === "running" ? (
                              <div className="w-4 h-4 flex items-center justify-center">
                                <Loader2
                                  className={`w-3.5 h-3.5 animate-spin ${
                                    isLight
                                      ? "text-sky-700"
                                      : "text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
                                  }`}
                                />
                              </div>
                            ) : step.status === "success" ? (
                              <div
                                className={`w-4 h-4 flex items-center justify-center ${
                                  isLight
                                    ? "text-emerald-700"
                                    : "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            ) : step.status === "error" ? (
                              <div
                                className={`w-4 h-4 flex items-center justify-center ${
                                  isLight
                                    ? "text-rose-700"
                                    : "text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]"
                                }`}
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div
                                className={`w-3.5 h-3.5 rounded-full border ${
                                  isLight
                                    ? "border-[#9C9287]"
                                    : "border-slate-600/80"
                                }`}
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold truncate transition-colors ${
                                isLight
                                  ? "text-[#2C2724] group-hover:text-black"
                                  : "text-slate-200 group-hover:text-white"
                              }`}
                            >
                              {step.nodeLabel || step.nodeType || `Step ${idx + 1}`}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-medium ${typeStyle.bg} ${typeStyle.border} ${typeStyle.text}`}
                              >
                                {typeStyle.label}
                              </span>
                              <span
                                className={`text-[10px] font-mono truncate ${
                                  isLight ? "text-[#7A7269]" : "text-slate-500"
                                }`}
                              >
                                {step.nodeId}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step Execution Duration Badge */}
                        <div
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
                            isLight
                              ? "text-[#7A7269] bg-[#FAF8F5] border-[#E7E2D8]"
                              : "text-slate-400 bg-slate-900/90 border-slate-800/80"
                          }`}
                        >
                          {formatDuration(step.durationMs)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Step Detail Viewport (Right) */}
          <div
            className={`flex-1 flex flex-col overflow-hidden transition-colors ${
              isLight ? "bg-[#FAF8F5]" : "bg-[#060a12]"
            }`}
          >
            {activeStep ? (
              <>
                {/* Step Sub-Header & Segmented Tabs */}
                <div
                  className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 select-none transition-colors ${
                    isLight
                      ? "bg-[#FAF8F5] border-[#E7E2D8]"
                      : "bg-[#090e1a]/90 border-slate-800/80"
                  }`}
                >
                  {/* Step Metadata & Type Chips */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                    <span
                      className={`text-xs font-bold truncate ${
                        isLight ? "text-[#2C2724]" : "text-slate-100"
                      }`}
                    >
                      {activeStep.nodeLabel}
                    </span>

                    {activeStepTypeStyle && (
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium ${activeStepTypeStyle.bg} ${activeStepTypeStyle.border} ${activeStepTypeStyle.text}`}
                      >
                        {activeStepTypeStyle.label}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono ${
                        isLight
                          ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      ID: {activeStep.nodeId}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1 ${
                        isLight
                          ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <Clock
                        className={`w-3 h-3 ${
                          isLight ? "text-[#8E8275]" : "text-slate-500"
                        }`}
                      />
                      {formatDuration(activeStep.durationMs)}
                    </span>

                    {activeStep.tokensUsed && (
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1.5 ${
                          isLight
                            ? "bg-amber-50 border-amber-200 text-amber-900"
                            : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                        }`}
                      >
                        <Coins className="w-3 h-3" />
                        <span>
                          <strong className="font-semibold">
                            {activeStep.tokensUsed.totalTokens}
                          </strong>{" "}
                          tokens ({activeStep.tokensUsed.promptTokens} in /{" "}
                          {activeStep.tokensUsed.completionTokens} out)
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Segmented Detail Tabs */}
                  <div
                    className={`flex items-center gap-1 p-1 rounded-xl border shadow-inner ${
                      isLight
                        ? "bg-[#F5F2EB] border-[#E7E2D8]"
                        : "bg-[#060a12] border-slate-800/80"
                    }`}
                  >
                    {(["output", "logs", "input", "raw"] as DetailTab[]).map(
                      (tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-medium tracking-wider uppercase transition-all duration-150 ${
                            activeTab === tab
                              ? isLight
                                ? "bg-[#EBE6DD] text-amber-900 border border-[#D8D1C5] shadow-sm font-semibold"
                                : "bg-slate-800 text-sky-400 border border-slate-700/80 shadow-sm font-semibold"
                              : isLight
                              ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#FAF8F5] border border-transparent"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                          }`}
                        >
                          {tab === "raw" ? "RAW JSON" : tab}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Step Body Content Surface */}
                <div
                  className={`flex-1 overflow-auto p-4 custom-scrollbar relative transition-colors ${
                    isLight ? "bg-[#FAF8F5]" : "bg-[#060a12]"
                  }`}
                >
                  {/* Floating Action Controls */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const payload =
                          activeTab === "output"
                            ? activeStep.outputPayload
                            : activeTab === "input"
                            ? activeStep.inputPayload
                            : activeTab === "logs"
                            ? activeStep.logs.join("\n")
                            : activeStep;
                        handleCopy(
                          typeof payload === "object"
                            ? JSON.stringify(payload, null, 2)
                            : String(payload ?? "")
                        );
                      }}
                      title="Copy content to clipboard"
                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-[11px] backdrop-blur-md shadow-md transition-all active:scale-95 ${
                        isLight
                          ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] border-[#E7E2D8] hover:border-[#D8D1C5] text-[#443E3A] hover:text-[#2C2724]"
                          : "bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span
                            className={`font-mono font-medium ${
                              isLight ? "text-emerald-700" : "text-emerald-400"
                            }`}
                          >
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy
                            className={`w-3.5 h-3.5 ${
                              isLight ? "text-[#7A7269]" : "text-slate-400"
                            }`}
                          />
                          <span
                            className={`font-mono ${
                              isLight ? "text-[#443E3A]" : "text-slate-300"
                            }`}
                          >
                            Copy
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tab View: OUTPUT */}
                  {activeTab === "output" && (
                    <div className="space-y-3">
                      {activeStep.error && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs font-mono shadow-sm ${
                            isLight
                              ? "bg-rose-50 border-rose-300 text-rose-900"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.1)]"
                          }`}
                        >
                          <div
                            className={`font-bold mb-1.5 flex items-center gap-2 ${
                              isLight ? "text-rose-900" : "text-rose-200"
                            }`}
                          >
                            <AlertCircle
                              className={`w-4 h-4 flex-shrink-0 ${
                                isLight ? "text-rose-700" : "text-rose-400"
                              }`}
                            />
                            <span>Step Execution Failed</span>
                          </div>
                          <p className="leading-relaxed pl-6">{activeStep.error}</p>
                        </div>
                      )}

                      <div
                        className={`relative rounded-xl border p-4 shadow-inner ${
                          isLight
                            ? "border-[#E7E2D8] bg-[#F5F2EB]"
                            : "border-slate-800/90 bg-[#080d18]"
                        }`}
                      >
                        <pre
                          className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed ${
                            isLight ? "text-[#2C2724]" : "text-emerald-300"
                          }`}
                        >
                          {activeStep.outputPayload !== undefined &&
                          activeStep.outputPayload !== null
                            ? typeof activeStep.outputPayload === "object"
                              ? JSON.stringify(activeStep.outputPayload, null, 2)
                              : String(activeStep.outputPayload)
                            : "// No output returned for this step"}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab View: LOGS */}
                  {activeTab === "logs" && (
                    <div
                      className={`rounded-xl border p-4 min-h-full font-mono text-xs shadow-inner ${
                        isLight
                          ? "border-[#E7E2D8] bg-[#F5F2EB]"
                          : "border-slate-800/90 bg-[#080d18]"
                      }`}
                    >
                      {activeStep.logs && activeStep.logs.length > 0 ? (
                        <div className="space-y-1.5">
                          {activeStep.logs.map((log, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 leading-relaxed"
                            >
                              <span
                                className={`select-none text-[11px] pt-0.5 ${
                                  isLight ? "text-[#9C9287]" : "text-slate-600"
                                }`}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span
                                className={
                                  isLight ? "text-[#2C2724]" : "text-slate-300"
                                }
                              >
                                {log}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`italic flex items-center gap-2 py-4 ${
                            isLight ? "text-[#7A7269]" : "text-slate-500"
                          }`}
                        >
                          <Terminal
                            className={`w-4 h-4 ${
                              isLight ? "text-[#9C9287]" : "text-slate-600"
                            }`}
                          />
                          <span>
                            No runtime log messages emitted during this step.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab View: INPUT */}
                  {activeTab === "input" && (
                    <div
                      className={`rounded-xl border p-4 shadow-inner ${
                        isLight
                          ? "border-[#E7E2D8] bg-[#F5F2EB]"
                          : "border-slate-800/90 bg-[#080d18]"
                      }`}
                    >
                      <pre
                        className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed ${
                          isLight ? "text-[#2C2724]" : "text-sky-300"
                        }`}
                      >
                        {activeStep.inputPayload !== undefined &&
                        activeStep.inputPayload !== null
                          ? typeof activeStep.inputPayload === "object"
                            ? JSON.stringify(activeStep.inputPayload, null, 2)
                            : String(activeStep.inputPayload)
                          : "// No incoming input payload"}
                      </pre>
                    </div>
                  )}

                  {/* Tab View: RAW JSON */}
                  {activeTab === "raw" && (
                    <div
                      className={`rounded-xl border p-4 shadow-inner ${
                        isLight
                          ? "border-[#E7E2D8] bg-[#F5F2EB]"
                          : "border-slate-800/90 bg-[#080d18]"
                      }`}
                    >
                      <pre
                        className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed ${
                          isLight ? "text-[#2C2724]" : "text-slate-300"
                        }`}
                      >
                        {JSON.stringify(activeStep, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                className={`flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 ${
                  isLight ? "text-[#7A7269]" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${
                    isLight
                      ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#7A7269]"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  <Zap
                    className={`w-6 h-6 ${
                      isLight ? "text-[#7A7269]" : "text-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      isLight ? "text-[#2C2724]" : "text-slate-300"
                    }`}
                  >
                    No Step Selected
                  </h4>
                  <p
                    className={`text-xs mt-1 max-w-[240px] ${
                      isLight ? "text-[#7A7269]" : "text-slate-400"
                    }`}
                  >
                    Select any step from the execution sequence on the left to
                    inspect its output payload, logs, and token metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionDrawer;
