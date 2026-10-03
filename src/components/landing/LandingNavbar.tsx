// LandingNavbar.tsx: Sticky glassmorphic navbar with brand logo, nav links, theme switcher, mobile menu, and studio launcher CTA
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: LandingNavbar: React.FC
// Data Schema: Component Props ({})
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Sun, Moon, Layers, Cpu, Terminal, Compass, Menu, X } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useViewStore } from "../../store/useViewStore";

export const LandingNavbar: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const setView = useViewStore((state) => state.setView);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-[#FAF8F5]/90 dark:bg-[#080d18]/90 backdrop-blur-xl border-b border-stone-200/80 dark:border-slate-800/80 shadow-md dark:shadow-2xl py-2.5 sm:py-3"
          : "bg-transparent py-3 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-sans truncate">
              AI FLOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-extrabold">STUDIO</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase truncate">
              Visual Neural DAG
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium text-slate-600 dark:text-slate-300">
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
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
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

          {/* GitHub Repo Link (Desktop) */}
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
            className="hidden sm:inline-flex relative group items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-xl border border-stone-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="w-4 h-4 text-slate-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/90 dark:border-slate-800/90 bg-[#FAF8F5]/95 dark:bg-[#080d18]/95 backdrop-blur-2xl px-4 pt-3 pb-5 mt-2.5 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800/70 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-500" />
              <span>Features</span>
            </a>
            <a
              href="#interactive-3d"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800/70 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>3D Graph Engine</span>
            </a>
            <a
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800/70 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Templates</span>
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800/70 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>Architecture</span>
            </a>
          </nav>

          <div className="pt-2 border-t border-stone-200 dark:border-slate-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView("studio");
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
            >
              <span>Launch Flow Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
