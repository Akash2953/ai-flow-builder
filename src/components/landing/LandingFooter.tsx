// LandingFooter.tsx: Clean responsive footer with brand badge, navigation links, and runtime status
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: LandingFooter: React.FC
// Data Schema: Component Props ({})
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React from "react";
import { Cpu } from "lucide-react";
import { useViewStore } from "../../store/useViewStore";

export const LandingFooter: React.FC = () => {
  const setView = useViewStore((state) => state.setView);

  return (
    <footer className="bg-stone-100 dark:bg-[#04070e] border-t border-stone-200 dark:border-slate-900 py-10 sm:py-12 relative z-10 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] flex-shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                </div>
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-sans">
                AI FLOW <span className="text-cyan-600 dark:text-cyan-400">STUDIO</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Production-grade visual DAG canvas for multi-agent LLM orchestration. Deterministic execution, dynamic variable interpolation, and Three.js 3D telemetry.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-slate-700 transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Col */}
          <div className="space-y-2.5 sm:space-y-3 text-xs">
            <h5 className="font-mono uppercase font-semibold text-slate-900 dark:text-white tracking-wider">
              Navigation
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Core Architecture
                </a>
              </li>
              <li>
                <a href="#interactive-3d" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  3D Graph Visualizer
                </a>
              </li>
              <li>
                <a href="#templates" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Workflow Templates
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Kahn's DAG Sorter
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Col */}
          <div className="space-y-2.5 sm:space-y-3 text-xs">
            <h5 className="font-mono uppercase font-semibold text-slate-900 dark:text-white tracking-wider">
              Studio
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setView("studio")}
                  className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                >
                  Open Canvas Studio
                </button>
              </li>
              <li>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Three.js WebGL Active
                </span>
              </li>
              <li>
                <span className="text-slate-500 font-mono">v2.4.0 Production</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-stone-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AI Flow Studio. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with React, Three.js & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
