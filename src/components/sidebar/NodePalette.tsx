// NodePalette: Premium Draggable sidebar palette with categorized node items, badges, icons, and HTML5 drag handlers
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (addNode), useSettingsStore (theme)
// Data Schema: NodeType from src/types/flow.ts
// Redesign: Taste-Skill premium developer tool aesthetics (Linear/Vercel inspired dark surfaces, tactile soft-clay neumorphic light theme)

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
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { NodeType } from "../../types/flow";

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

export const NodePalette: React.FC = () => {
  const addNode = useFlowStore((state) => state.addNode);
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      className={`w-80 h-full flex flex-col select-none overflow-hidden z-10 transition-colors duration-150 ${
        isLight
          ? "bg-[#FAF8F5]/95 border-r border-[#E7E2D8] text-[#2C2724] shadow-[1px_0_3px_rgba(0,0,0,0.02)]"
          : "bg-[#080d18] border-r border-slate-800/60 text-slate-100"
      }`}
    >
      {/* Top Header Section */}
      <div
        className={`p-3.5 border-b backdrop-blur-sm space-y-3 ${
          isLight
            ? "bg-[#FAF8F5] border-[#E7E2D8]"
            : "bg-[#080d18]/90 border-slate-800/60"
        }`}
      >
        {/* Title Bar */}
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
            <div>
              <h2
                className={`text-xs font-semibold tracking-tight ${
                  isLight ? "text-[#2C2724]" : "text-slate-100"
                }`}
              >
                Node Library
              </h2>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-full border ${
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[11px]">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all duration-150 font-medium ${
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
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all duration-150 font-medium ${
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
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div
            className={`text-center py-12 px-4 rounded-xl border border-dashed ${
              isLight
                ? "border-[#E7E2D8] bg-[#F5F2EB]/50"
                : "border-slate-800/80 bg-slate-900/20"
            }`}
          >
            <SlidersHorizontal
              className={`w-6 h-6 mx-auto mb-2 ${
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
              Try a different keyword or clear category filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className={`mt-3 text-xs font-medium transition-colors ${
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
            const isCollapsed = !searchQuery && collapsedCategories[category];

            return (
              <div key={category} className="space-y-1.5">
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
                          ? `text-[#A89F93] ${isCollapsed ? "" : "rotate-90 text-[#7A7269]"}`
                          : `text-slate-500 ${isCollapsed ? "" : "rotate-90 text-slate-400"}`
                      }`}
                    />
                    <span
                      className={`text-[11px] font-medium tracking-wide uppercase font-mono ${
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
                {!isCollapsed && (
                  <div className="space-y-2 pt-0.5">
                    {items.map((item) => (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        className={`group relative p-3 rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 active:scale-[0.99] ${
                          isLight
                            ? "bg-[#FAF8F5] border-[#E7E2D8] hover:border-amber-600/40 hover:bg-[#F5F2EB] text-[#443E3A] shadow-[0_2px_8px_-1px_rgba(180,165,145,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]"
                            : "bg-[#0c1220] hover:bg-[#10192c] border-slate-800/70 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/40"
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                isLight
                                  ? `${item.lightIconStyle.bg} ${item.lightIconStyle.border} ${item.lightIconStyle.text} ${item.lightIconStyle.glow}`
                                  : `${item.iconStyle.bg} ${item.iconStyle.border} ${item.iconStyle.text} ${item.iconStyle.glow}`
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <h3
                                className={`text-xs font-semibold truncate transition-colors ${
                                  isLight
                                    ? "text-[#2C2724] group-hover:text-[#191614]"
                                    : "text-slate-200 group-hover:text-white"
                                }`}
                              >
                                {item.title}
                              </h3>
                              <span
                                className={`inline-block text-[9px] font-mono font-medium tracking-tight ${
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
                          <div className="flex items-center gap-1">
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
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <div
                              className={`transition-colors p-0.5 ${
                                isLight
                                  ? "text-[#A89F93] group-hover:text-[#7A7269]"
                                  : "text-slate-600 group-hover:text-slate-400"
                              }`}
                            >
                              <GripVertical className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          className={`text-[11px] mt-2 line-clamp-2 leading-relaxed font-sans ${
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

      {/* Footer Info & Engine Status */}
      <div
        className={`p-3 border-t flex items-center justify-between text-[11px] transition-colors ${
          isLight
            ? "bg-[#F5F2EB]/90 border-[#E7E2D8] text-[#7A7269]"
            : "bg-[#060a12] border-slate-800/60 text-slate-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span
            className={`font-mono text-[10px] font-medium ${
              isLight ? "text-[#443E3A]" : "text-slate-300"
            }`}
          >
            DAG Engine v1.2
          </span>
        </div>
        <div
          className={`text-[10px] font-mono flex items-center gap-1 ${
            isLight ? "text-[#8E8275]" : "text-slate-500"
          }`}
        >
          <span>Drag to add</span>
        </div>
      </div>
    </aside>
  );
};

