// LandingNavbar.tsx: Sticky glassmorphic navbar with brand logo, nav links, theme switcher, and studio launcher CTA
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: LandingNavbar: React.FC
// Data Schema: Component Props ({})
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Sun, Moon, Layers, Cpu, Terminal, Compass } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useViewStore } from "../../store/useViewStore";

export const LandingNavbar: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const setView = useViewStore((state) => state.setView);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/85 dark:bg-[#080d18]/85 backdrop-blur-xl border-b border-stone-200/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
              AI FLOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-extrabold">STUDIO</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              Visual Neural DAG
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#features"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Layers className="w-3.5 h-3.5" />
            Features
          </a>
          <a
            href="#interactive-3d"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            3D Graph Engine
          </a>
          <a
            href="#templates"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            Templates
          </a>
          <a
            href="#architecture"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            Architecture
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-stone-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hidden sm:flex p-2 rounded-xl border border-stone-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Primary CTA: Launch Flow Studio */}
          <button
            onClick={() => setView("studio")}
            className="relative group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
