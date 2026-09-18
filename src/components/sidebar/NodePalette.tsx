// NodePalette: Draggable sidebar palette with categorized node items, badges, icons, and HTML5 drag handlers
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (addNode)
// Data Schema: NodeType from src/types/flow.ts
// User Instruction: "do 2" (Milestone 2 canvas & workspace UI components)

import React from "react";
import {
  Zap,
  Bot,
  GitFork,
  Code2,
  Globe,
  Terminal,
  Plus,
  GripVertical,
  HelpCircle,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { NodeType } from "../../types/flow";

interface NodePaletteItemConfig {
  type: NodeType;
  title: string;
  category: "Triggers" | "AI Agents" | "Logic & Branching" | "Data Transforms" | "Integrations" | "Output Viewers";
  badge: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  borderColor: string;
  badgeColor: string;
}

const PALETTE_ITEMS: NodePaletteItemConfig[] = [
  {
    type: "trigger",
    title: "Manual Trigger",
    category: "Triggers",
    badge: "Entry",
    description: "Workflow starting point with customizable payload or user prompt",
    icon: <Zap className="w-4 h-4" />,
    iconColor: "text-amber-400 bg-amber-500/20 border-amber-500/30",
    borderColor: "hover:border-amber-500/50",
    badgeColor: "bg-amber-950/60 text-amber-400 border-amber-500/30",
  },
  {
    type: "llm",
    title: "LLM Agent",
    category: "AI Agents",
    badge: "Multi-Model",
    description: "Generate responses via Claude, GPT-4o, Gemini, Groq, or Ollama",
    icon: <Bot className="w-4 h-4" />,
    iconColor: "text-sky-400 bg-sky-500/20 border-sky-500/30",
    borderColor: "hover:border-sky-500/50",
    badgeColor: "bg-sky-950/60 text-sky-400 border-sky-500/30",
  },
  {
    type: "condition",
    title: "Condition (IF/ELSE)",
    category: "Logic & Branching",
    badge: "Branching",
    description: "Evaluate rules on outputs and split DAG flow into True/False branches",
    icon: <GitFork className="w-4 h-4" />,
    iconColor: "text-purple-400 bg-purple-500/20 border-purple-500/30",
    borderColor: "hover:border-purple-500/50",
    badgeColor: "bg-purple-950/60 text-purple-400 border-purple-500/30",
  },
  {
    type: "transform",
    title: "JS Transform",
    category: "Data Transforms",
    badge: "Code",
    description: "Format, filter, or extract JSON and variables using a safe JS sandbox",
    icon: <Code2 className="w-4 h-4" />,
    iconColor: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
    borderColor: "hover:border-emerald-500/50",
    badgeColor: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
  },
  {
    type: "httpRequest",
    title: "HTTP Request",
    category: "Integrations",
    badge: "API / Webhook",
    description: "Make REST API calls (GET, POST, PUT, DELETE) with custom headers & body",
    icon: <Globe className="w-4 h-4" />,
    iconColor: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
    borderColor: "hover:border-cyan-500/50",
    badgeColor: "bg-cyan-950/60 text-cyan-400 border-cyan-500/30",
  },
  {
    type: "output",
    title: "Output Terminal",
    category: "Output Viewers",
    badge: "Viewer",
    description: "Render and preview finalized execution results in Markdown or JSON",
    icon: <Terminal className="w-4 h-4" />,
    iconColor: "text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/30",
    borderColor: "hover:border-fuchsia-500/50",
    badgeColor: "bg-fuchsia-950/60 text-fuchsia-400 border-fuchsia-500/30",
  },
];

export const NodePalette: React.FC = () => {
  const addNode = useFlowStore((state) => state.addNode);

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleQuickAdd = (nodeType: NodeType) => {
    addNode(nodeType);
  };

  const categories = [
    "Triggers",
    "AI Agents",
    "Logic & Branching",
    "Data Transforms",
    "Integrations",
    "Output Viewers",
  ] as const;

  return (
    <aside className="w-72 h-full bg-slate-950/95 border-r border-slate-800/80 flex flex-col select-none overflow-hidden z-10 backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Node Library
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Drag or click + to add nodes
          </p>
        </div>
        <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400" title="Drag onto canvas or click + to spawn">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Palette Node List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {categories.map((category) => {
          const items = PALETTE_ITEMS.filter((item) => item.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-1">
                {category}
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                    className={`group relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 transition-all duration-200 cursor-grab active:cursor-grabbing hover:bg-slate-800/70 hover:shadow-lg ${item.borderColor}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border flex items-center justify-center ${item.iconColor}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {item.title}
                          </div>
                          <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.type)}
                          title="Quick add to canvas"
                          className="p-1 rounded-md bg-slate-800/90 text-slate-400 hover:text-white hover:bg-sky-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready to Build
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {PALETTE_ITEMS.length} Nodes Available
        </span>
      </div>
    </aside>
  );
};
