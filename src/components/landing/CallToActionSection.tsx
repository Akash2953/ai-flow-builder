// CallToActionSection.tsx: High-conversion closing CTA with studio launch and template exploration
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: CallToActionSection: React.FC
// Data Schema: Component Props ({})
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import React from "react";
import { ArrowRight, Play, Zap } from "lucide-react";
import { useViewStore } from "../../store/useViewStore";

export const CallToActionSection: React.FC = () => {
  const setView = useViewStore((state) => state.setView);
  const launchStudioWithTemplate = useViewStore((state) => state.launchStudioWithTemplate);

  return (
    <section className="py-24 relative overflow-hidden bg-stone-50/80 dark:bg-[#060a14] border-t border-stone-200 dark:border-slate-800/80">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-950/90 border border-stone-200 dark:border-slate-800/90 backdrop-blur-xl shadow-xl dark:shadow-2xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-medium">
            <Zap className="w-3.5 h-3.5" />
            Zero Setup Required
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mx-auto leading-tight">
            Ready to Build Your First{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
              Neural Agent Flow?
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Create visual AI pipelines in seconds. Test directly in your browser with full telemetry, topological validation, and client-side privacy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setView("studio")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Flow Studio Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => launchStudioWithTemplate("customer-support-triage")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-stone-100 dark:bg-slate-800/80 hover:bg-stone-200 dark:hover:bg-slate-700/80 border border-stone-200 dark:border-slate-700 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-500/20" />
              <span>Explore Triage Pipeline</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
