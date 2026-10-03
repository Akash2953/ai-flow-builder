// FeaturesSection.tsx: 6 high-density responsive feature cards showcasing DAG execution, multi-LLM routing, and telemetry
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: FeaturesSection: React.FC
// Data Schema: Component Props ({})
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React from "react";
import { GitBranch, Cpu, Activity, RefreshCw, Variable, Download, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  gradient: string;
  badgeColor: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: GitBranch,
    category: "Topological Engine",
    title: "Kahn's DAG Algorithm",
    description:
      "Execute asynchronous node dependencies with mathematical certainty. Detects cycles before execution and resolves parallel branches deterministically.",
    highlights: ["Instant cycle validation", "Parallel step concurrency", "Zero race conditions"],
    gradient: "from-cyan-500/10 to-transparent",
    badgeColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Cpu,
    category: "Multi-Model AI",
    title: "Universal LLM Connectors",
    description:
      "Seamlessly bridge Claude 3.5 Sonnet, GPT-4o, DeepSeek, and Groq within a single flow. Pass structured system prompts and output payloads automatically.",
    highlights: ["Anthropic & OpenAI API keys", "Auto-schema extraction", "Fallback model routing"],
    gradient: "from-purple-500/10 to-transparent",
    badgeColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Activity,
    category: "Real-Time Telemetry",
    title: "Live Trace & Token Metrics",
    description:
      "Monitor token usage, latency per node, cost estimates, and memory payload diffs during execution with full step-by-step history snapshots.",
    highlights: ["Sub-millisecond resolution", "Per-node cost calculator", "Error stack inspection"],
    gradient: "from-emerald-500/10 to-transparent",
    badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Variable,
    category: "Dynamic Templating",
    title: "Liquid Syntax Variables",
    description:
      "Reference upstream node outputs dynamically with double-brace expressions like {{node_1.output.summary}} without writing glue code.",
    highlights: ["Dot-notation property access", "Live preview evaluator", "Regex fallback parser"],
    gradient: "from-amber-500/10 to-transparent",
    badgeColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: RefreshCw,
    category: "State Management",
    title: "Zustand Reactive Store",
    description:
      "Lightning-fast client-side reactive store with full undo/redo state preservation, localStorage persistence, and zero unnecessary canvas re-renders.",
    highlights: ["Local cache persistence", "Instant undo / redo", "60 FPS drag & zoom"],
    gradient: "from-indigo-500/10 to-transparent",
    badgeColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Download,
    category: "Export & Sharing",
    title: "1-Click JSON & Artifact Export",
    description:
      "Export complete flow manifests to production-ready JSON or Claude Code markdown artifacts with one click. Ready for CI/CD agent pipelines.",
    highlights: ["Clean JSON pipeline format", "Import / export portability", "Zero backend lock-in"],
    gradient: "from-rose-500/10 to-transparent",
    badgeColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-stone-50/50 dark:bg-[#060a14]/80 border-t border-stone-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-medium">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered for High-Throughput{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Agent Pipelines
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">
            Every component is built for speed, transparency, and deterministic execution without cumbersome cloud orchestrators.
          </p>
        </div>

        {/* Responsive Grid Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#0c1322]/80 border border-stone-200/90 dark:border-slate-800/90 hover:border-cyan-500/40 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Ambient Card Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-stone-100 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700/60 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-500/40 transition-all duration-300 shadow-sm">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                      {feature.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 -translate-y-0.5" />
                    </h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="pt-2 sm:pt-3 border-t border-stone-100 dark:border-slate-800/60 space-y-1.5 sm:space-y-2">
                    {feature.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
