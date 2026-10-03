// LandingHero.tsx: High-impact hero section with Three.js 3D WebGL centerpiece, editorial typography, metrics, and CTA triggers
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: LandingHero: React.FC
// Data Schema: Component Props ({})
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import React from "react";
import { ArrowRight, Sparkles, Play, ShieldCheck, Zap, Bot, Code2 } from "lucide-react";
import { ThreeFlowScene } from "./ThreeFlowScene";
import { useViewStore } from "../../store/useViewStore";

export const LandingHero: React.FC = () => {
  const setView = useViewStore((state) => state.setView);
  const launchStudioWithTemplate = useViewStore((state) => state.launchStudioWithTemplate);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-500/30 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-medium text-cyan-700 dark:text-cyan-300">
              v2.4 Powered by Three.js WebGL Engine
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Multi-LLM Topological DAG Architecture
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-sans">
            Orchestrate Visual AI Agents with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-400 to-purple-500 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
              Deterministic DAG Precision
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Build, test, and deploy multi-model pipelines in real time. Connect Claude 3.5, GPT-4o, and DeepSeek with topological cycle safety, streaming telemetry, and zero backend lock-in.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setView("studio")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Flow Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => launchStudioWithTemplate("customer-support-triage")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/80 hover:bg-stone-100 dark:hover:bg-slate-800 border border-stone-200 dark:border-slate-700/70 hover:border-stone-300 dark:hover:border-slate-600 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-cyan-500 dark:text-cyan-400 fill-cyan-500/20 dark:fill-cyan-400/20" />
              <span>Load Triage Template</span>
            </button>
          </div>

          {/* Quick Metrics & Badges Bar */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-stone-200 dark:border-slate-800/80 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">&lt;10ms</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">DAG Resolution</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">Multi-LLM</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Anthropic, OpenAI</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">Kahn's Algo</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Cycle Detection</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">100% Client</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero Server Lock-in</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Three.js Interactive Hero Canvas */}
        <div className="mt-14 relative w-full h-[480px] sm:h-[540px] lg:h-[620px] rounded-3xl p-1 bg-gradient-to-b from-cyan-500/20 via-indigo-500/10 to-transparent shadow-2xl">
          <ThreeFlowScene className="w-full h-full rounded-[22px]" />
        </div>
      </div>
    </section>
  );
};
