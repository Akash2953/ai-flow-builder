// HeaderToolbar: Top navigation and control bar for workflow orchestration, execution triggers, validation status, templates, settings, and file I/O
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore, useExecutionStore, useSettingsStore, dagRunner (validateWorkflow, executeWorkflow)
// Data Schema: AppNode, AppEdge, WorkflowExport from src/types/flow.ts
// User Instruction: "do 2" (Milestone 2 canvas & workspace UI components)

import React, { useState, useRef, useMemo } from "react";
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
  FileCode,
  Edit2,
  Check,
  X,
  Workflow,
  Terminal,
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

  // Flow store state
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const workflowName = useFlowStore((state) => state.workflowName);
  const setWorkflowMeta = useFlowStore((state) => state.setWorkflowMeta);
  const exportWorkflow = useFlowStore((state) => state.exportWorkflow);
  const loadWorkflow = useFlowStore((state) => state.loadWorkflow);
  const clearCanvas = useFlowStore((state) => state.clearCanvas);
  const updateNodeStatus = useFlowStore((state) => state.updateNodeStatus);
  const resetAllNodeStatuses = useFlowStore((state) => state.resetAllNodeStatuses);

  // Execution store state
  const isExecuting = useExecutionStore((state) => state.currentRun?.status === "running");
  const setDrawerOpen = useExecutionStore((state) => state.setDrawerOpen);
  const isDrawerOpen = useExecutionStore((state) => state.isDrawerOpen);

  // Settings state
  const apiKeys = useSettingsStore((state) => state.apiKeys);
  const mockMode = useSettingsStore((state) => state.mockMode);

  // Inline name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(workflowName);
  const [showValidationPopover, setShowValidationPopover] = useState(false);

  // Validate workflow DAG in real-time
  const validation = useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

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
    <header className="h-14 bg-slate-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 backdrop-blur-md select-none">
      {/* Left: Brand & Workflow Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider text-slate-100 uppercase">
                AI Flow
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-400 border border-sky-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Visual DAG Engine</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* Workflow Name Editor */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
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
                className="bg-slate-900 border border-sky-500/50 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditNameValue(workflowName);
                  setIsEditingName(false);
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => {
                setEditNameValue(workflowName);
                setIsEditingName(true);
              }}
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                {workflowName}
              </span>
              <Edit2 className="w-3 h-3 text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          )}
        </div>
      </div>

      {/* Center: Validation & Run Controls */}
      <div className="flex items-center gap-3">
        {/* Validation Status Badge with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowValidationPopover(!showValidationPopover)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              validation.valid
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/70"
                : "bg-rose-950/40 border-rose-500/30 text-rose-400 hover:bg-rose-950/70"
            }`}
          >
            {validation.valid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>DAG Valid ({nodes.length} nodes)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>{validation.errors.length} Issue{validation.errors.length > 1 ? "s" : ""}</span>
              </>
            )}
          </button>

          {/* Validation Popover */}
          {showValidationPopover && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-2xl z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-semibold text-slate-200">DAG Topology Verification</span>
                <button
                  type="button"
                  onClick={() => setShowValidationPopover(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {validation.valid ? (
                <div className="text-emerald-400 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for execution
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Workflow contains valid entry triggers, no circular dependency loops, and proper topological order.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-rose-400 font-medium">Validation Errors:</p>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {validation.errors.map((err, idx) => (
                      <li key={idx} className="text-rose-300">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Run Button */}
        <button
          type="button"
          disabled={!validation.valid || isExecuting}
          onClick={handleRunWorkflow}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg select-none ${
            isExecuting
              ? "bg-sky-600 text-white animate-pulse cursor-wait"
              : !validation.valid
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-400 hover:to-indigo-500 active:scale-95 shadow-sky-500/20"
          }`}
        >
          {isExecuting ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current animate-spin" />
              <span>Executing Flow...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Workflow</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Actions, Modals & Drawer Trigger */}
      <div className="flex items-center gap-2">
        {/* Templates Picker Trigger */}
        <button
          type="button"
          onClick={onOpenTemplates}
          title="Browse Workflow Templates"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Templates</span>
        </button>

        {/* JSON File Export / Import */}
        <button
          type="button"
          onClick={handleExportJson}
          title="Export Workflow as JSON"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Import Workflow JSON"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportJson}
          className="hidden"
        />

        {/* Clear Canvas */}
        <button
          type="button"
          onClick={() => {
            if (nodes.length === 0 || confirm("Clear all nodes and connections on canvas?")) {
              clearCanvas();
            }
          }}
          title="Clear Canvas"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Drawer Toggle */}
        <button
          type="button"
          onClick={() => setDrawerOpen(!isDrawerOpen)}
          title="Toggle Execution Logs Drawer"
          className={`p-1.5 rounded-lg border transition-colors ${
            isDrawerOpen
              ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Terminal className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* Settings Modal Trigger */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="API Keys & Engine Settings"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Settings</span>
          {mockMode && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Mock Mode Active" />
          )}
        </button>
      </div>
    </header>
  );
};
