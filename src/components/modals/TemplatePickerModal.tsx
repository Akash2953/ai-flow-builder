// TemplatePickerModal: Gallery modal for browsing and loading starter workflow templates
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (loadWorkflow, nodes), useSettingsStore (theme), workflowTemplates
// Data Schema: WorkflowTemplate from src/templates/workflowTemplates.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

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
  Briefcase,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
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
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Career", "Support", "Research", "Engineering"];

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
      case "Career":
        return (
          <Briefcase
            className={`w-3.5 h-3.5 ${
              isLight ? "text-amber-600" : "text-amber-400"
            }`}
          />
        );
      case "Support":
        return (
          <LifeBuoy
            className={`w-3.5 h-3.5 ${
              isLight ? "text-sky-600" : "text-sky-400"
            }`}
          />
        );
      case "Research":
        return (
          <BookOpen
            className={`w-3.5 h-3.5 ${
              isLight ? "text-purple-600" : "text-purple-400"
            }`}
          />
        );
      case "Engineering":
        return (
          <Code2
            className={`w-3.5 h-3.5 ${
              isLight ? "text-emerald-600" : "text-emerald-400"
            }`}
          />
        );
      default:
        return (
          <Zap
            className={`w-3.5 h-3.5 ${
              isLight ? "text-amber-600" : "text-amber-400"
            }`}
          />
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn select-none ${
        isLight ? "bg-[#2C2724]/40" : "bg-slate-950/85"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] relative border transition-all duration-200 ${
          isLight
            ? "bg-[#FAF8F5] border-[#E7E2D8] text-[#2C2724] shadow-[0_20px_60px_rgba(180,165,145,0.3)]"
            : "bg-[#080d18] border-slate-800/90 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Top Specular Rim */}
        <div
          className={`absolute inset-x-0 top-0 h-[1px] pointer-events-none ${
            isLight
              ? "bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"
              : "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
          }`}
        />

        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between backdrop-blur-sm ${
            isLight
              ? "bg-[#FAF8F5]/90 border-[#E7E2D8]"
              : "bg-[#080d18]/90 border-slate-800/70"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
                isLight
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-700 shadow-sm"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              }`}
            >
              <Sparkles className="w-4 h-4" strokeWidth={2.2} />
            </div>
            <div>
              <h2
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isLight ? "text-[#2C2724]" : "text-slate-100"
                }`}
              >
                Workflow Template Library
              </h2>
              <p
                className={`text-[11px] ${
                  isLight ? "text-[#7A7269]" : "text-slate-400"
                }`}
              >
                Jumpstart your pipeline with production-ready AI DAG architectures
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Templates"
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
              isLight
                ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          className={`px-6 py-3 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight
              ? "bg-[#F5F2EB]/80 border-[#E7E2D8]"
              : "bg-[#060a12]/60 border-slate-800/80"
          }`}
        >
          {/* Category Tabs */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border w-full sm:w-auto ${
              isLight
                ? "bg-[#FAF8F5] border-[#E7E2D8] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                : "bg-[#080d18] border-slate-800/80"
            }`}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? isLight
                      ? "bg-[#EBE6DD] text-[#2C2724] border border-[#D4CEB8] shadow-sm font-semibold"
                      : "bg-slate-800 text-slate-100 border border-slate-700/60 shadow-sm"
                    : isLight
                    ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#F5F2EB]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isLight ? "text-[#9C9287]" : "text-slate-500"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className={`w-full rounded-xl pl-8.5 pr-3 py-1.5 text-xs transition-all ${
                isLight
                  ? "bg-[#FAF8F5] border border-[#E7E2D8] text-[#2C2724] placeholder-[#9C9287] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 shadow-inner"
                  : "bg-[#080d18] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50"
              }`}
            />
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {filteredTemplates.length === 0 ? (
            <div
              className={`text-center py-12 space-y-2 ${
                isLight ? "text-[#7A7269]" : "text-slate-500"
              }`}
            >
              <Bot
                className={`w-8 h-8 mx-auto ${
                  isLight ? "text-[#9C9287]" : "text-slate-600"
                }`}
              />
              <p className="text-xs">No matching templates found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group ${
                    isLight
                      ? "bg-[#FAF8F5] border-[#E7E2D8] hover:border-amber-500/50 hover:bg-[#F5F2EB] shadow-[0_2px_8px_rgba(180,165,145,0.12)] hover:shadow-[0_4px_16px_rgba(180,165,145,0.2)]"
                      : "bg-[#060a12]/80 border-slate-800/90 hover:border-sky-500/40 hover:bg-[#0c1220]/90 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Category + Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                          isLight
                            ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A]"
                            : "bg-[#080d18] border-slate-800 text-slate-300"
                        }`}
                      >
                        {getCategoryIcon(template.category)}
                        {template.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
                          isLight
                            ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                            : "bg-sky-500/10 text-sky-400 border-sky-500/25"
                        }`}
                      >
                        {template.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3
                        className={`text-xs font-semibold transition-colors ${
                          isLight
                            ? "text-[#2C2724] group-hover:text-amber-700"
                            : "text-slate-100 group-hover:text-sky-300"
                        }`}
                      >
                        {template.name}
                      </h3>
                      <p
                        className={`text-[11px] mt-1 line-clamp-3 leading-relaxed ${
                          isLight ? "text-[#7A7269]" : "text-slate-400"
                        }`}
                      >
                        {template.description}
                      </p>
                    </div>

                    {/* DAG Stats */}
                    <div
                      className={`flex items-center gap-4 text-[10px] font-mono pt-1 border-t ${
                        isLight
                          ? "text-[#7A7269] border-[#E7E2D8]"
                          : "text-slate-500 border-slate-800/40"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Layers
                          className={`w-3 h-3 ${
                            isLight ? "text-[#9C9287]" : "text-slate-400"
                          }`}
                        />
                        {template.nodes.length} Nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch
                          className={`w-3 h-3 ${
                            isLight ? "text-[#9C9287]" : "text-slate-400"
                          }`}
                        />
                        {template.edges.length} Connections
                      </span>
                    </div>
                  </div>

                  {/* Load Action Button */}
                  <div
                    className={`mt-4 pt-3 border-t flex justify-end ${
                      isLight ? "border-[#E7E2D8]" : "border-slate-800/60"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                        isLight
                          ? "bg-[#2C2724] hover:bg-[#443E3A] text-[#FAF8F5] shadow-sm hover:shadow"
                          : "bg-sky-500/10 hover:bg-sky-500 border border-sky-500/30 text-sky-300 hover:text-slate-950 group-hover:shadow-md group-hover:shadow-sky-500/20"
                      }`}
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
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs font-mono ${
            isLight
              ? "bg-[#FAF8F5]/90 border-[#E7E2D8] text-[#7A7269]"
              : "bg-[#080d18]/90 border-slate-800/80 text-slate-500"
          }`}
        >
          <span>Choose a template to instantly populate the canvas</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1 rounded-lg transition-colors border ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] text-[#443E3A] border-[#E7E2D8] shadow-sm"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
