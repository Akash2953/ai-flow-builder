// ExecutionDrawer: Bottom collapsible telemetry drawer for real-time logs, step outputs, token counts, and execution metrics
// Importers/Callers: src/App.tsx
// Affected API: useExecutionStore (currentRun, isDrawerOpen, setDrawerOpen, resetRun), useFlowStore (setSelectedNodeId)
// Data Schema: ExecutionRun, ExecutionStep from src/types/execution.ts
// User Instruction: "do 2" (Milestone 2 canvas & workspace UI components)

import React, { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  X,
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
} from "lucide-react";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useFlowStore } from "../../store/useFlowStore";
import { ExecutionStep } from "../../types/execution";

type DetailTab = "output" | "logs" | "input" | "raw";

export const ExecutionDrawer: React.FC = () => {
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
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (!currentRun) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Idle
        </span>
      );
    }

    switch (currentRun.status) {
      case "running":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-[11px] text-sky-400 font-mono animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
            Running
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Success
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-[11px] text-rose-400 font-mono">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
            {currentRun.status}
          </span>
        );
    }
  };

  const formatDuration = (ms?: number) => {
    if (ms === undefined || ms === null) return "--";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-800/90 shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out ${
        isDrawerOpen
          ? isExpanded
            ? "h-[65vh]"
            : "h-72"
          : "h-10"
      }`}
    >
      {/* Top Header Bar */}
      <div className="h-10 px-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between select-none">
        <div
          className="flex items-center gap-3 cursor-pointer group flex-1"
          onClick={() => setDrawerOpen(!isDrawerOpen)}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              Execution Logs & Telemetry
            </span>
          </div>

          {getStatusBadge()}

          {currentRun && (
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {formatDuration(currentRun.totalDurationMs)}
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500/80" />
                {currentRun.totalTokens || 0} tokens
              </span>
              <span className="text-slate-500">
                {currentRun.steps.filter((s) => s.status === "success").length} /{" "}
                {currentRun.steps.length} steps
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {currentRun && (
            <button
              type="button"
              onClick={resetRun}
              title="Clear Run History"
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isDrawerOpen && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse height" : "Expand height"}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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
            title={isDrawerOpen ? "Close panel" : "Open panel"}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isDrawerOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      {isDrawerOpen && (
        <div className="flex-1 flex overflow-hidden">
          {/* Steps Timeline Sidebar */}
          <div className="w-64 border-r border-slate-800/80 bg-slate-950/60 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Execution Sequence
            </div>

            {!currentRun || currentRun.steps.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 italic">
                No active execution. Run workflow to stream steps.
              </div>
            ) : (
              currentRun.steps.map((step, idx) => {
                const isSelected = activeStep?.id === step.id;
                return (
                  <div
                    key={step.id || idx}
                    onClick={() => {
                      setSelectedStepId(step.id);
                      setSelectedNodeId(step.nodeId);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-800/90 border border-sky-500/40 text-white"
                        : "hover:bg-slate-900/80 border border-transparent text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {step.status === "running" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400 shrink-0" />
                      ) : step.status === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : step.status === "error" ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                      )}

                      <div className="truncate">
                        <div className="text-xs font-medium truncate">
                          {step.nodeLabel || step.nodeType || `Step ${idx + 1}`}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {step.nodeType}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 shrink-0">
                      {formatDuration(step.durationMs)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Step Detail Pane */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {activeStep ? (
              <>
                {/* Step Sub-Header & Tabs */}
                <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-200">
                      {activeStep.nodeLabel}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                      ID: {activeStep.nodeId}
                    </span>
                    {activeStep.tokensUsed && (
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {activeStep.tokensUsed.totalTokens} tokens (
                        {activeStep.tokensUsed.promptTokens} in /{" "}
                        {activeStep.tokensUsed.completionTokens} out)
                      </span>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    {(["output", "logs", "input", "raw"] as DetailTab[]).map(
                      (tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider transition-colors ${
                            activeTab === tab
                              ? "bg-sky-500 text-white shadow-sm"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {tab}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Step Body Content */}
                <div className="flex-1 overflow-auto p-4 custom-scrollbar relative">
                  {/* Copy Button */}
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
                          : String(payload || "")
                      );
                    }}
                    title="Copy payload"
                    className="absolute top-4 right-4 z-10 px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] backdrop-blur-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-mono">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="font-mono">Copy</span>
                      </>
                    )}
                  </button>

                  {/* Tab Views */}
                  {activeTab === "output" && (
                    <div className="space-y-2">
                      {activeStep.error && (
                        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Execution Error
                          </div>
                          {activeStep.error}
                        </div>
                      )}

                      <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        {activeStep.outputPayload !== undefined &&
                        activeStep.outputPayload !== null
                          ? typeof activeStep.outputPayload === "object"
                            ? JSON.stringify(activeStep.outputPayload, null, 2)
                            : String(activeStep.outputPayload)
                          : "No output generated for this step yet."}
                      </pre>
                    </div>
                  )}

                  {activeTab === "logs" && (
                    <div className="space-y-1 font-mono text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 min-h-full">
                      {activeStep.logs && activeStep.logs.length > 0 ? (
                        activeStep.logs.map((log, i) => (
                          <div key={i} className="leading-relaxed">
                            {log}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 italic">
                          No log messages recorded for this node step.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "input" && (
                    <pre className="text-xs font-mono text-sky-300 whitespace-pre-wrap break-all bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {activeStep.inputPayload !== undefined &&
                      activeStep.inputPayload !== null
                        ? typeof activeStep.inputPayload === "object"
                          ? JSON.stringify(activeStep.inputPayload, null, 2)
                          : String(activeStep.inputPayload)
                        : "No incoming input payload."}
                    </pre>
                  )}

                  {activeTab === "raw" && (
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {JSON.stringify(activeStep, null, 2)}
                    </pre>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Zap className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-xs">Select a step from the sequence to inspect output</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
