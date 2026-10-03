// NodePalette: Premium collapsible sidebar palette with categorized node items, workflow actions, file I/O, tools, and HTML5 drag handlers
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore, useExecutionStore, useSettingsStore
// Data Schema: NodeType, WorkflowExport from src/types/flow.ts
// Redesign: Taste-Skill minimalist utilitarian developer tool aesthetics with collapsible slim icon rail (w-14) and expanded (w-[300px]) panel

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Zap,
  Sparkles,
  GitBranch,
  Braces,
  Globe,
  Terminal,
  Plus,
  GripVertical,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Layers,
  SlidersHorizontal,
  FilePlus,
  BookmarkPlus,
  Download,
  Upload,
  Trash2,
  Settings,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { NodeType, WorkflowExport } from "../../types/flow";

export interface NodePaletteProps {
  onOpenTemplates?: (mode?: "browse" | "save") => void;
  onOpenSettings?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NodePaletteItemConfig {
  type: NodeType;
  title: string;
  category: "Triggers" | "AI Agents" | "Logic & Branching" | "Data Transforms" | "Integrations" | "Output Viewers";
  badge: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  iconStyle: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  lightIconStyle: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  lightBadgeStyle: string;
}

const PALETTE_ITEMS: NodePaletteItemConfig[] = [
  {
    type: "trigger",
    title: "Manual Trigger",
    category: "Triggers",
    badge: "Entrypoint",
    description: "Workflow start with custom JSON payload or interactive input prompts.",
    icon: <Zap className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(245, 158, 11, 0.4)",
    iconStyle: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      text: "text-amber-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(245,158,11,0.2)]",
    },
    lightBadgeStyle: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  },
  {
    type: "llm",
    title: "LLM Agent",
    category: "AI Agents",
    badge: "Multi-Model",
    description: "Execute prompts with Claude 3.7, GPT-4o, Gemini 2.0, or DeepSeek.",
    icon: <Sparkles className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(56, 189, 248, 0.4)",
    iconStyle: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/25",
      text: "text-sky-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(56,189,248,0.2)]",
    },
    lightBadgeStyle: "bg-sky-500/10 text-sky-800 border-sky-500/20",
  },
  {
    type: "condition",
    title: "Condition (IF/ELSE)",
    category: "Logic & Branching",
    badge: "Branching",
    description: "Multi-rule boolean evaluation branching execution into True / False DAG paths.",
    icon: <GitBranch className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(168, 85, 247, 0.4)",
    iconStyle: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/25",
      text: "text-purple-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(168,85,247,0.2)]",
    },
    lightBadgeStyle: "bg-purple-500/10 text-purple-800 border-purple-500/20",
  },
  {
    type: "transform",
    title: "JS Transform",
    category: "Data Transforms",
    badge: "Sandbox",
    description: "Write sandboxed JavaScript to map, extract, filter, or aggregate upstream state.",
    icon: <Braces className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(16, 185, 129, 0.4)",
    iconStyle: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
      text: "text-emerald-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(16,185,129,0.2)]",
    },
    lightBadgeStyle: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
  },
  {
    type: "httpRequest",
    title: "HTTP Request",
    category: "Integrations",
    badge: "REST / Webhook",
    description: "Make authenticated API calls (GET, POST, PUT, DELETE) with variable interpolation.",
    icon: <Globe className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(6, 182, 212, 0.4)",
    iconStyle: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/25",
      text: "text-cyan-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(6,182,212,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(6,182,212,0.2)]",
    },
    lightBadgeStyle: "bg-cyan-500/10 text-cyan-800 border-cyan-500/20",
  },
  {
    type: "output",
    title: "Output Terminal",
    category: "Output Viewers",
    badge: "Viewer",
    description: "Inspect workflow results, Markdown responses, or structured execution tables.",
    icon: <Terminal className="w-4 h-4" strokeWidth={2.2} />,
    accentColor: "rgba(244, 63, 94, 0.4)",
    iconStyle: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/25",
      text: "text-rose-400",
      glow: "group-hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]",
    },
    lightIconStyle: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-700",
      glow: "group-hover:shadow-[0_2px_8px_rgba(244,63,94,0.2)]",
    },
    lightBadgeStyle: "bg-rose-500/10 text-rose-800 border-rose-500/20",
  },
];

const CATEGORIES = [
  "Triggers",
  "AI Agents",
  "Logic & Branching",
  "Data Transforms",
  "Integrations",
  "Output Viewers",
] as const;

export const NodePalette: React.FC<NodePaletteProps> = ({
  onOpenTemplates,
  onOpenSettings,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  // Flow store state & actions
  const nodes = useFlowStore((state) => state.nodes);
  const workflowName = useFlowStore((state) => state.workflowName);
  const addNode = useFlowStore((state) => state.addNode);
  const createBlankFlow = useFlowStore((state) => state.createBlankFlow);
  const exportWorkflow = useFlowStore((state) => state.exportWorkflow);
  const loadWorkflow = useFlowStore((state) => state.loadWorkflow);
  const clearCanvas = useFlowStore((state) => state.clearCanvas);

  // Execution store state
  const isDrawerOpen = useExecutionStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useExecutionStore((state) => state.setDrawerOpen);

  // Settings store state
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const mockMode = useSettingsStore((state) => state.mockMode);
  const isLight = theme === "light";

  // Local collapsible state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  // Local search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !isCollapsed &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCollapsed]);

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleQuickAdd = (nodeType: NodeType) => {
    addNode(nodeType);
  };

  // Workflow Action Handlers
  const handleNewBlankFlow = () => {
    if (
      nodes.length > 0 &&
      !confirm("Create a new blank workflow? This will reset the current canvas.")
    ) {
      return;
    }
    createBlankFlow("Untitled Workflow");
  };

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
      } catch {
        alert("Failed to parse JSON file. Please check file format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClearCanvas = () => {
    if (nodes.length === 0 || confirm("Clear all nodes and connections from the canvas?")) {
      clearCanvas();
    }
  };

  const filteredItems = useMemo(() => {
    return PALETTE_ITEMS.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <aside
      className={`h-full flex flex-col select-none overflow-hidden z-10 transition-all duration-200 ease-in-out shrink-0 ${
        isCollapsed ? "w-14 min-w-[56px] max-w-[56px]" : "w-[300px] min-w-[300px] max-w-[300px]"
      } ${
        isLight
          ? "bg-[#FAF8F5]/95 border-r border-[#E7E2D8] text-[#2C2724] shadow-[1px_0_3px_rgba(0,0,0,0.02)]"
          : "bg-[#080d18] border-r border-slate-800/60 text-slate-100"
      }`}
    >
      {/* Hidden File Input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportJson}
        className="hidden"
      />

      {/* -------------------------------------------------------------
          COLLAPSED SLIM ICON RAIL (w-14)
          ------------------------------------------------------------- */}
      {isCollapsed ? (
        <div className="w-full h-full flex flex-col items-center justify-between py-2.5 px-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Top Rail Controls */}
          <div className="w-full flex flex-col items-center gap-2">
            {/* Expand Toggle */}
            <button
              type="button"
              onClick={toggleCollapse}
              title="Expand Node Library & Actions"
              aria-label="Expand Sidebar"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#443E3A] border-[#E7E2D8] hover:border-amber-600/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-sky-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>

            <div className={`w-6 h-px my-0.5 ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

            {/* Workflow Quick Actions */}
            <button
              type="button"
              onClick={handleNewBlankFlow}
              title="New Blank Workflow"
              aria-label="New Flow"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-sky-700 border-[#E7E2D8] hover:border-sky-500/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-sky-400 border-slate-800"
              }`}
            >
              <FilePlus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenTemplates?.("browse")}
              title="Browse Workflow Templates"
              aria-label="Templates"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-amber-700 border-[#E7E2D8] hover:border-amber-500/40"
                  : "bg-slate-900/80 hover:bg-slate-800 text-amber-400 border-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onOpenTemplates?.("save")}
              title="Save Flow as Template"
              aria-label="Save Template"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] hover:text-amber-800 border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border-slate-800"
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>

            <div className={`w-6 h-px my-0.5 ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

            {/* File I/O Actions */}
            <button
              type="button"
              onClick={handleExportJson}
              title="Export Workflow JSON"
              aria-label="Export JSON"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] hover:text-sky-600 border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-400 border-slate-800"
              }`}
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import Workflow JSON"
              aria-label="Import JSON"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] hover:text-sky-600 border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-400 border-slate-800"
              }`}
            >
              <Upload className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClearCanvas}
              title="Clear Canvas"
              aria-label="Clear Canvas"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] hover:text-rose-600 border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border-slate-800"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className={`w-6 h-px my-0.5 ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

            {/* Quick Node Spawn/Drag Rails */}
            <div className="flex flex-col items-center gap-1.5 w-full">
              {PALETTE_ITEMS.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onClick={() => handleQuickAdd(item.type)}
                  title={`${item.title} (Click or Drag to Canvas)`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all border hover:scale-105 group relative ${
                    isLight
                      ? `${item.lightIconStyle.bg} ${item.lightIconStyle.border} ${item.lightIconStyle.text}`
                      : `${item.iconStyle.bg} ${item.iconStyle.border} ${item.iconStyle.text}`
                  }`}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Rail Tools */}
          <div className="w-full flex flex-col items-center gap-2 pt-2">
            <div className={`w-6 h-px my-0.5 ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

            {/* Execution Drawer Toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
              title="Execution Logs & Telemetry"
              aria-label="Toggle Logs"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border relative ${
                isDrawerOpen
                  ? isLight
                    ? "bg-sky-500/15 text-sky-800 border-sky-500/30"
                    : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800"
              }`}
            >
              <Terminal className="w-4 h-4" />
              {isDrawerOpen && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              )}
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              title="API Keys & Engine Settings"
              aria-label="Settings"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border relative ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800"
              }`}
            >
              <Settings className="w-4 h-4" />
              {mockMode && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isLight ? "dark" : "light")}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              aria-label="Toggle Theme"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                isLight
                  ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] border-[#E7E2D8]"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800"
              }`}
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-indigo-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------
            EXPANDED FULL PANEL (w-[300px])
            ------------------------------------------------------------- */
        <>
          {/* Top Header & Integrated Action Segment */}
          <div
            className={`p-3 border-b backdrop-blur-sm space-y-2.5 ${
              isLight
                ? "bg-[#FAF8F5] border-[#E7E2D8]"
                : "bg-[#080d18]/90 border-slate-800/60"
            }`}
          >
            {/* Title Bar with Collapse Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                    isLight
                      ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A]"
                      : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h2
                  className={`text-xs font-semibold tracking-tight ${
                    isLight ? "text-[#2C2724]" : "text-slate-100"
                  }`}
                >
                  Node Library
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <div
                  className={`flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded-md border ${
                    isLight
                      ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
                      : "text-slate-400 bg-slate-900/90 border-slate-800/80"
                  }`}
                >
                  <span className={isLight ? "text-amber-700 font-medium" : "text-sky-400 font-medium"}>
                    {filteredItems.length}
                  </span>
                  <span className={isLight ? "text-[#A89F93]" : "text-slate-600"}>/</span>
                  <span>{PALETTE_ITEMS.length}</span>
                </div>

                <button
                  type="button"
                  onClick={toggleCollapse}
                  title="Collapse sidebar"
                  aria-label="Collapse Sidebar"
                  className={`p-1 rounded-md transition-colors border ${
                    isLight
                      ? "bg-[#F5F2EB] hover:bg-white text-[#7A7269] hover:text-[#2C2724] border-[#E7E2D8]"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800/80"
                  }`}
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Integrated Action Buttons Toolbar */}
            <div
              className={`p-1 rounded-lg border flex items-center justify-between gap-1 text-[11px] ${
                isLight
                  ? "bg-[#F5F2EB] border-[#E7E2D8]"
                  : "bg-slate-900/80 border-slate-800/80"
              }`}
            >
              {/* Workflow Actions */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleNewBlankFlow}
                  title="Create a new blank workflow"
                  className={`flex items-center gap-1 h-6 px-1.5 rounded text-[11px] font-medium transition-all ${
                    isLight
                      ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/90"
                  }`}
                >
                  <FilePlus className="w-3 h-3 text-sky-500" />
                  <span>New</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTemplates?.("browse")}
                  title="Browse workflow templates"
                  className={`flex items-center gap-1 h-6 px-1.5 rounded text-[11px] font-medium transition-all group ${
                    isLight
                      ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/90"
                  }`}
                >
                  <Sparkles
                    className={`w-3 h-3 ${
                      isLight ? "text-amber-600" : "text-amber-400"
                    }`}
                  />
                  <span>Templates</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTemplates?.("save")}
                  title="Save current flow as template"
                  className={`flex items-center gap-1 h-6 px-1.5 rounded text-[11px] font-medium transition-all ${
                    isLight
                      ? "text-amber-800 hover:bg-amber-100/80"
                      : "text-amber-400 hover:text-amber-300 hover:bg-amber-500/15"
                  }`}
                >
                  <BookmarkPlus className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>

              <div className={`h-3.5 w-px ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800"}`} />

              {/* File I/O */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleExportJson}
                  title="Export JSON"
                  className={`h-6 w-6 flex items-center justify-center rounded transition-all ${
                    isLight
                      ? "text-[#7A7269] hover:text-sky-600 hover:bg-white"
                      : "text-slate-400 hover:text-sky-400 hover:bg-slate-800/80"
                  }`}
                >
                  <Download className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Import JSON"
                  className={`h-6 w-6 flex items-center justify-center rounded transition-all ${
                    isLight
                      ? "text-[#7A7269] hover:text-sky-600 hover:bg-white"
                      : "text-slate-400 hover:text-sky-400 hover:bg-slate-800/80"
                  }`}
                >
                  <Upload className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={handleClearCanvas}
                  title="Clear Canvas"
                  className={`h-6 w-6 flex items-center justify-center rounded transition-all ${
                    isLight
                      ? "text-[#7A7269] hover:text-rose-600 hover:bg-white"
                      : "text-slate-400 hover:text-rose-400 hover:bg-slate-800/80"
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative group">
              <Search
                className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
                  isLight
                    ? "text-[#9C9287] group-focus-within:text-amber-600"
                    : "text-slate-500 group-focus-within:text-sky-400"
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components or actions..."
                className={`w-full rounded-lg pl-8 pr-7 py-1.5 text-xs focus:outline-none transition-all font-sans border ${
                  isLight
                    ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:border-amber-600/60 focus:ring-2 focus:ring-amber-500/20"
                    : "bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 focus:border-sky-500/50 focus:bg-slate-900 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-sky-500/10"
                }`}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${
                    isLight
                      ? "text-[#9C9287] hover:text-[#443E3A]"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono border px-1 py-0.2 rounded pointer-events-none ${
                    isLight
                      ? "text-[#9C9287] border-[#E7E2D8]"
                      : "text-slate-600 border-slate-800"
                  }`}
                >
                  /
                </span>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[10px]">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-150 font-medium ${
                  selectedCategory === null
                    ? isLight
                      ? "bg-[#F5F2EB] text-[#443E3A] border border-[#E7E2D8] shadow-sm font-semibold"
                      : "bg-slate-800 text-sky-400 border border-slate-700/80 shadow-sm"
                    : isLight
                    ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#F5F2EB]/60 border border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const shortName = cat.replace(" & ", "/").replace("Data ", "");
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(isSelected ? null : cat)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all duration-150 font-medium ${
                      isSelected
                        ? isLight
                          ? "bg-[#F5F2EB] text-[#443E3A] border border-[#E7E2D8] shadow-sm font-semibold"
                          : "bg-slate-800 text-sky-400 border border-slate-700/80 shadow-sm"
                        : isLight
                        ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#F5F2EB]/60 border border-transparent"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                    }`}
                  >
                    {shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Node List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-3.5 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div
                className={`text-center py-10 px-4 rounded-xl border border-dashed ${
                  isLight
                    ? "border-[#E7E2D8] bg-[#F5F2EB]/50"
                    : "border-slate-800/80 bg-slate-900/20"
                }`}
              >
                <SlidersHorizontal
                  className={`w-5 h-5 mx-auto mb-2 ${
                    isLight ? "text-[#9C9287]" : "text-slate-600"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    isLight ? "text-[#443E3A]" : "text-slate-400"
                  }`}
                >
                  No nodes found
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    isLight ? "text-[#7A7269]" : "text-slate-500"
                  }`}
                >
                  Try a different keyword or reset filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className={`mt-2.5 text-xs font-medium transition-colors ${
                    isLight
                      ? "text-amber-700 hover:text-amber-800"
                      : "text-sky-400 hover:text-sky-300"
                  }`}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              CATEGORIES.map((category) => {
                const items = filteredItems.filter((item) => item.category === category);
                if (items.length === 0) return null;
                const isCatCollapsed = !searchQuery && collapsedCategories[category];

                return (
                  <div key={category} className="space-y-1">
                    {/* Category Header Bar */}
                    <button
                      type="button"
                      onClick={() => toggleCategoryCollapse(category)}
                      className={`w-full flex items-center justify-between py-1 px-1 transition-colors group cursor-pointer font-mono ${
                        isLight
                          ? "text-[#8E8275] hover:text-[#443E3A]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-150 ${
                            isLight
                              ? `text-[#A89F93] ${isCatCollapsed ? "" : "rotate-90 text-[#7A7269]"}`
                              : `text-slate-500 ${isCatCollapsed ? "" : "rotate-90 text-slate-400"}`
                          }`}
                        />
                        <span
                          className={`text-[10px] font-medium tracking-wide uppercase font-mono ${
                            isLight
                              ? "text-[#8E8275] group-hover:text-[#443E3A]"
                              : "text-slate-400 group-hover:text-slate-300"
                          }`}
                        >
                          {category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          isLight
                            ? "text-[#8E8275] bg-[#F5F2EB] border-[#E7E2D8]"
                            : "text-slate-500 bg-slate-900/60 border-slate-800/50"
                        }`}
                      >
                        {items.length}
                      </span>
                    </button>

                    {/* Category Node Cards */}
                    {!isCatCollapsed && (
                      <div className="space-y-1.5 pt-0.5">
                        {items.map((item) => (
                          <div
                            key={item.type}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.type)}
                            className={`group relative p-2.5 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 active:scale-[0.99] ${
                              isLight
                                ? "bg-[#FAF8F5] border-[#E7E2D8] hover:border-amber-600/40 hover:bg-[#F5F2EB] text-[#443E3A] shadow-[0_2px_8px_-1px_rgba(180,165,145,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]"
                                : "bg-[#0c1220] hover:bg-[#10192c] border-slate-800/70 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/40"
                            }`}
                          >
                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 ${
                                    isLight
                                      ? `${item.lightIconStyle.bg} ${item.lightIconStyle.border} ${item.lightIconStyle.text} ${item.lightIconStyle.glow}`
                                      : `${item.iconStyle.bg} ${item.iconStyle.border} ${item.iconStyle.text} ${item.iconStyle.glow}`
                                  }`}
                                >
                                  {item.icon}
                                </div>
                                <div className="min-w-0">
                                  <h3
                                    className={`text-xs font-semibold truncate transition-colors leading-tight ${
                                      isLight
                                        ? "text-[#2C2724] group-hover:text-[#191614]"
                                        : "text-slate-200 group-hover:text-white"
                                    }`}
                                  >
                                    {item.title}
                                  </h3>
                                  <span
                                    className={`inline-block text-[9px] font-mono font-medium tracking-tight mt-0.5 ${
                                      isLight
                                        ? `px-1.5 py-0.2 rounded border ${item.lightBadgeStyle}`
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickAdd(item.type);
                                  }}
                                  title="Add to canvas"
                                  className={`p-1 rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100 shadow-sm border ${
                                    isLight
                                      ? "bg-[#F5F2EB] text-[#7A7269] hover:text-white hover:bg-amber-600 border-[#E7E2D8] hover:border-amber-600"
                                      : "bg-slate-800/90 text-slate-400 hover:text-white hover:bg-sky-600 border-slate-700/50 hover:border-sky-500"
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <div
                                  className={`transition-colors p-0.5 ${
                                    isLight
                                      ? "text-[#A89F93] group-hover:text-[#7A7269]"
                                      : "text-slate-600 group-hover:text-slate-400"
                                  }`}
                                >
                                  <GripVertical className="w-3 h-3" />
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p
                              className={`text-[10px] mt-1.5 line-clamp-2 leading-relaxed font-sans ${
                                isLight ? "text-[#7A7269]" : "text-slate-400"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info & Workspace Tools Toolbar */}
          <div
            className={`p-2.5 border-t flex flex-col gap-2 transition-colors ${
              isLight
                ? "bg-[#F5F2EB]/90 border-[#E7E2D8] text-[#7A7269]"
                : "bg-[#060a12] border-slate-800/60 text-slate-400"
            }`}
          >
            {/* Workspace Utility Icons Strip */}
            <div className="flex items-center justify-between">
              {/* Telemetry Drawer Trigger */}
              <button
                type="button"
                onClick={() => setDrawerOpen(!isDrawerOpen)}
                title="Toggle Execution Telemetry & Logs Drawer"
                className={`flex items-center gap-1.5 h-6 px-2 rounded-md text-[11px] font-medium transition-all ${
                  isDrawerOpen
                    ? isLight
                      ? "bg-sky-500/15 text-sky-800 font-semibold"
                      : "bg-sky-500/20 text-sky-300 font-semibold shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                    : isLight
                    ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-white border border-transparent hover:border-[#E7E2D8]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Logs</span>
              </button>

              <div className="flex items-center gap-1">
                {/* Settings Trigger */}
                <button
                  type="button"
                  onClick={onOpenSettings}
                  title="API Keys & Engine Settings"
                  className={`h-6 w-6 flex items-center justify-center rounded-md transition-all relative ${
                    isLight
                      ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  {mockMode && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                {/* Theme Switcher */}
                <button
                  type="button"
                  onClick={() => setTheme(isLight ? "dark" : "light")}
                  title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  className={`h-6 w-6 flex items-center justify-center rounded-md transition-all ${
                    isLight
                      ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                  }`}
                >
                  {isLight ? (
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Engine Status Line */}
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span
                  className={`font-mono font-medium ${
                    isLight ? "text-[#443E3A]" : "text-slate-300"
                  }`}
                >
                  DAG Engine v1.2
                </span>
              </div>
              <div
                className={`font-mono text-[9px] ${
                  isLight ? "text-[#8E8275]" : "text-slate-500"
                }`}
              >
                <span>Drag or click +</span>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
