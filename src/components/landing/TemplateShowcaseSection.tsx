// TemplateShowcaseSection.tsx: Production workflow templates with 1-click hydration and studio launch
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: TemplateShowcaseSection: React.FC
// Data Schema: Component Props ({})
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React from "react";
import { workflowTemplates, WorkflowTemplate } from "../../templates/workflowTemplates";
import { useViewStore } from "../../store/useViewStore";
import { Play, Sparkles, Layers, ArrowRight, Shield, Cpu, Flame } from "lucide-react";

export const TemplateShowcaseSection: React.FC = () => {
  const launchStudioWithTemplate = useViewStore((state) => state.launchStudioWithTemplate);

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case "customer-support-triage":
        return Flame;
      case "content-moderation-enrichment":
        return Shield;
      case "code-review-security-audit":
        return Cpu;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="templates" className="py-16 sm:py-24 relative overflow-hidden bg-stone-50/60 dark:bg-[#060a14]/90 border-t border-stone-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-medium">
            <Layers className="w-3.5 h-3.5" />
            Battle-Tested Presets
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pre-Built Agent Pipelines for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Immediate Production
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">
            Start from curated multi-step workflows with configured system prompts, fallback models, and output schemas.
          </p>
        </div>

        {/* Responsive Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {workflowTemplates.map((template: WorkflowTemplate) => {
            const IconComponent = getTemplateIcon(template.id);
            const nodeCount = template.nodes.length;
            const edgeCount = template.edges.length;

            return (
              <div
                key={template.id}
                className="group flex flex-col justify-between p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#0c1322]/80 border border-stone-200/90 dark:border-slate-800/90 hover:border-cyan-500/50 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700/60 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-500/40 transition-transform">
                      <IconComponent className="w-5 h-5 text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/30">
                      {template.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {template.description}
                    </p>
                  </div>

                  {/* DAG Stats */}
                  <div className="flex items-center gap-4 pt-2 sm:pt-3 border-t border-stone-200/80 dark:border-slate-800/80 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {nodeCount} Nodes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      {edgeCount} Edges
                    </span>
                  </div>
                </div>

                {/* 1-Click Action Button */}
                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-stone-200/80 dark:border-slate-800/60">
                  <button
                    onClick={() => launchStudioWithTemplate(template.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800/90 text-slate-800 dark:text-white border border-stone-200 dark:border-slate-700 hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:via-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md active:scale-[0.98]"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 fill-cyan-400/20 group-hover:text-white group-hover:fill-white/20" />
                    <span>Load in Canvas Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
