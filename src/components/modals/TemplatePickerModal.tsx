// TemplatePickerModal: Gallery modal for browsing, loading, and saving custom workflow templates
// Importers/Callers: src/App.tsx, src/components/header/HeaderToolbar.tsx
// Affected API: useFlowStore (loadWorkflow, nodes, edges, createBlankFlow), useSettingsStore (theme), workflowTemplates
// Data Schema: WorkflowTemplate from src/templates/workflowTemplates.ts
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState, useMemo, useEffect } from "react";
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
  Trash2,
  BookmarkPlus,
  Check,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import {
  workflowTemplates,
  WorkflowTemplate,
  getCustomTemplates,
  saveCustomTemplate,
  deleteCustomTemplate,
} from "../../templates/workflowTemplates";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "browse" | "save";
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  initialMode = "browse",
}) => {
  const currentNodes = useFlowStore((state) => state.nodes);
  const currentEdges = useFlowStore((state) => state.edges);
  const currentWorkflowName = useFlowStore((state) => state.workflowName);
  const currentWorkflowDesc = useFlowStore((state) => state.workflowDescription);
  const loadWorkflow = useFlowStore((state) => state.loadWorkflow);
  const createBlankFlow = useFlowStore((state) => state.createBlankFlow);
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [customTemplatesList, setCustomTemplatesList] = useState<WorkflowTemplate[]>([]);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customCategory, setCustomCategory] = useState("Custom");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCustomTemplatesList(getCustomTemplates());
      setCustomName(currentWorkflowName || "Custom Workflow");
      setCustomDesc(currentWorkflowDesc || "");
      if (initialMode === "save") {
        setIsSavingCustom(true);
      } else {
        setIsSavingCustom(false);
      }
    }
  }, [isOpen, initialMode, currentWorkflowName, currentWorkflowDesc]);

  const categories = ["All", "Custom", "Career", "Support", "Research", "Engineering"];

  const allTemplates = useMemo(() => {
    return [...customTemplatesList, ...workflowTemplates];
  }, [customTemplatesList]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Custom" ? t.isCustom : t.category === selectedCategory);
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allTemplates, searchQuery, selectedCategory]);

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

  const handleCreateBlankFlow = () => {
    if (
      currentNodes.length > 0 &&
      !confirm("Start a new blank workflow? This will replace your current canvas.")
    ) {
      return;
    }
    createBlankFlow("Untitled Workflow");
    onClose();
  };

  const handleSaveAsCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const saved = saveCustomTemplate({
      name: customName.trim(),
      description: customDesc.trim() || "Custom user-created workflow template",
      category: customCategory,
      badge: "User Template",
      nodes: currentNodes,
      edges: currentEdges,
    });

    setCustomTemplatesList(getCustomTemplates());
    setIsSavingCustom(false);
    setSelectedCategory("Custom");
    setSaveSuccessMsg(`Template "${saved.name}" saved successfully!`);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleDeleteCustomTemplate = (e: React.MouseEvent, templateId: string, templateName: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the custom template "${templateName}"?`)) {
      deleteCustomTemplate(templateId);
      setCustomTemplatesList(getCustomTemplates());
    }
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
      case "Custom":
        return (
          <FolderPlus
            className={`w-3.5 h-3.5 ${
              isLight ? "text-indigo-600" : "text-indigo-400"
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
                Jumpstart your pipeline with starter templates or save custom DAG workflows
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateBlankFlow}
              title="Start a fresh blank workflow from scratch"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border active:scale-95 ${
                isLight
                  ? "bg-white hover:bg-[#EBE6DD] text-[#2C2724] border-[#E7E2D8] shadow-sm"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-sm"
              }`}
            >
              <FilePlus className="w-3.5 h-3.5 text-sky-500" />
              <span>Blank Flow</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSavingCustom(!isSavingCustom)}
              title="Save current canvas as a reusable custom template"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border active:scale-95 ${
                isSavingCustom
                  ? isLight
                    ? "bg-amber-100 border-amber-300 text-amber-900"
                    : "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : isLight
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-500/30"
                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{isSavingCustom ? "Cancel Save" : "Save as Template"}</span>
            </button>

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
        </div>

        {/* Inline Save As Template Form */}
        {isSavingCustom && (
          <form
            onSubmit={handleSaveAsCustomTemplate}
            className={`px-6 py-4 border-b space-y-3 animation-fade-in ${
              isLight
                ? "bg-[#F5F2EB] border-[#E7E2D8]"
                : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? "text-[#2C2724]" : "text-slate-200"}`}>
                <BookmarkPlus className="w-4 h-4 text-amber-500" />
                Save Current Canvas ({currentNodes.length} nodes, {currentEdges.length} connections)
              </span>
              <span className={`text-[11px] ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}>
                Persisted securely to browser local template store
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className={`text-[10px] font-mono uppercase tracking-wider block ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}>
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Automated Outreach & Email Drafter"
                  className={`w-full rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none transition-all ${
                    isLight
                      ? "bg-white border border-[#D4CEB8] text-[#2C2724] focus:ring-1 focus:ring-amber-500 shadow-inner"
                      : "bg-slate-950 border border-slate-700 text-slate-100 focus:ring-1 focus:ring-sky-500"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-mono uppercase tracking-wider block ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}>
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`w-full rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none transition-all ${
                    isLight
                      ? "bg-white border border-[#D4CEB8] text-[#2C2724] focus:ring-1 focus:ring-amber-500 shadow-inner"
                      : "bg-slate-950 border border-slate-700 text-slate-100 focus:ring-1 focus:ring-sky-500"
                  }`}
                >
                  <option value="Custom">Custom</option>
                  <option value="Career">Career</option>
                  <option value="Support">Support</option>
                  <option value="Research">Research</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-mono uppercase tracking-wider block ${isLight ? "text-[#7A7269]" : "text-slate-400"}`}>
                Description
              </label>
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Briefly describe what this workflow pipeline does..."
                className={`w-full rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none transition-all ${
                  isLight
                    ? "bg-white border border-[#D4CEB8] text-[#2C2724] focus:ring-1 focus:ring-amber-500 shadow-inner"
                    : "bg-slate-950 border border-slate-700 text-slate-100 focus:ring-1 focus:ring-sky-500"
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSavingCustom(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isLight
                    ? "bg-[#EBE6DD] hover:bg-[#E0DACF] text-[#443E3A]"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!customName.trim()}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
                  !customName.trim()
                    ? "bg-amber-400/50 cursor-not-allowed"
                    : isLight
                    ? "bg-amber-600 hover:bg-amber-700 active:scale-95"
                    : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Template</span>
              </button>
            </div>
          </form>
        )}

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex items-center justify-between animate-fadeIn ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMsg("")}
              className="text-xs hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

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
            className={`flex items-center gap-1 p-1 rounded-xl border w-full sm:w-auto overflow-x-auto custom-scrollbar ${
              isLight
                ? "bg-[#FAF8F5] border-[#E7E2D8] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                : "bg-[#080d18] border-slate-800/80"
            }`}
          >
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? allTemplates.length
                  : cat === "Custom"
                  ? customTemplatesList.length
                  : allTemplates.filter((t) => t.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat
                      ? isLight
                        ? "bg-[#EBE6DD] text-[#2C2724] border border-[#D4CEB8] shadow-sm font-semibold"
                        : "bg-slate-800 text-slate-100 border border-slate-700/60 shadow-sm font-semibold"
                      : isLight
                      ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#F5F2EB]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat
                        ? isLight
                          ? "bg-white text-[#2C2724]"
                          : "bg-slate-900 text-slate-200"
                        : isLight
                        ? "bg-[#EBE6DD] text-[#7A7269]"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
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
              className={`text-center py-12 space-y-3 ${
                isLight ? "text-[#7A7269]" : "text-slate-500"
              }`}
            >
              <Bot
                className={`w-8 h-8 mx-auto ${
                  isLight ? "text-[#9C9287]" : "text-slate-600"
                }`}
              />
              <p className="text-xs">
                {selectedCategory === "Custom"
                  ? "No custom templates saved yet. Click 'Save as Template' above to save your canvas workflow."
                  : "No matching templates found."}
              </p>
              {selectedCategory === "Custom" && (
                <button
                  type="button"
                  onClick={() => setIsSavingCustom(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isLight
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-500/30"
                      : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  Save Current Canvas
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between group relative ${
                    isLight
                      ? "bg-[#FAF8F5] border-[#E7E2D8] hover:border-amber-500/50 hover:bg-[#F5F2EB] shadow-[0_2px_8px_rgba(180,165,145,0.12)] hover:shadow-[0_4px_16px_rgba(180,165,145,0.2)]"
                      : "bg-[#060a12]/80 border-slate-800/90 hover:border-sky-500/40 hover:bg-[#0c1220]/90 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Category + Badge + Delete Button for Custom */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono border ${
                          template.isCustom
                            ? isLight
                              ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                              : "bg-indigo-950/50 border-indigo-700/50 text-indigo-300"
                            : isLight
                            ? "bg-[#F5F2EB] border-[#E7E2D8] text-[#443E3A]"
                            : "bg-[#080d18] border-slate-800 text-slate-300"
                        }`}
                      >
                        {getCategoryIcon(template.category)}
                        {template.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
                            template.isCustom
                              ? isLight
                                ? "bg-indigo-500/10 text-indigo-700 border-indigo-500/30"
                                : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                              : isLight
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                              : "bg-sky-500/10 text-sky-400 border-sky-500/25"
                          }`}
                        >
                          {template.badge}
                        </span>

                        {template.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomTemplate(e, template.id, template.name)}
                            title="Delete custom template"
                            className={`p-1 rounded-md transition-colors ${
                              isLight
                                ? "text-rose-500 hover:bg-rose-100 hover:text-rose-700"
                                : "text-rose-400 hover:bg-rose-950/60 hover:text-rose-300"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
          <span>Choose a starter template or start from a blank canvas</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1 rounded-lg transition-colors border ${
              isLight
                ? "bg-[#F5F2EB] hover:bg-[#EBE6DD] text-[#443E3A] border-[#E7E2D8] shadow-sm"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
