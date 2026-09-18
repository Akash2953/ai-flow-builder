// TemplatePickerModal: Gallery modal for browsing and loading starter workflow templates
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (loadWorkflow, nodes), workflowTemplates
// Data Schema: WorkflowTemplate from src/templates/workflowTemplates.ts
// User Instruction: "do 2" (Milestone 2 canvas & workspace UI components)

import React, { useState, useMemo } from "react";
import {
  X,
  Sparkles,
  Search,
  ArrowRight,
  Layers,
  GitBranch,
  Bot,
  Zap,
  Code2,
  LifeBuoy,
  BookOpen,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import {
  workflowTemplates,
  WorkflowTemplate,
} from "../../templates/workflowTemplates";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentNodes = useFlowStore((state) => state.nodes);
  const loadWorkflow = useFlowStore((state) => state.loadWorkflow);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Support", "Research", "Engineering"];

  const filteredTemplates = useMemo(() => {
    return workflowTemplates.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    if (
      currentNodes.length > 0 &&
      !confirm(
        `Loading "${template.name}" will replace your current canvas. Do you want to proceed?`
      )
    ) {
      return;
    }

    loadWorkflow({
      id: template.id,
      name: template.name,
      description: template.description,
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      nodes: template.nodes,
      edges: template.edges,
    });

    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Support":
        return <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />;
      case "Research":
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      case "Engineering":
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Workflow Template Library
              </h2>
              <p className="text-xs text-slate-400">
                Jumpstart your pipeline with production-tested DAG architectures
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Bot className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No matching templates found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/90 hover:border-sky-500/40 hover:bg-slate-900/60 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Category + Badge */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300">
                        {getCategoryIcon(template.category)}
                        {template.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-950/80 text-sky-400 border border-sky-500/30">
                        {template.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* DAG Stats */}
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {template.nodes.length} Nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {template.edges.length} Connections
                      </span>
                    </div>
                  </div>

                  {/* Load Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 border border-sky-500/30 text-sky-300 hover:text-white text-xs font-bold transition-all group-hover:shadow-md group-hover:shadow-sky-600/20"
                    >
                      <span>Load Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Choose a template to instantly populate the canvas</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
