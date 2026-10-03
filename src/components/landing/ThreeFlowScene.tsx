// ThreeFlowScene.tsx: React WebGL container hosting the 3D Three.js neural DAG visualizer with touch optimization
// Importers/Callers: src/components/landing/LandingHero.tsx, src/components/landing/InteractiveDemoSection.tsx
// Affected API: ThreeFlowScene (interactive: boolean, className?: string, onSelectNode?: (node: ThreeNodeData) => void)
// Data Schema: ThreeNodeData ({ id, label, sublabel, type, position, colorDark, colorLight, description })
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React, { useEffect, useRef, useState } from "react";
import { ThreeGraphManager, ThreeNodeData } from "./ThreeGraphManager";
import { useSettingsStore } from "../../store/useSettingsStore";
import { Zap, Activity } from "lucide-react";

interface ThreeFlowSceneProps {
  interactive?: boolean;
  className?: string;
  onSelectNode?: (node: ThreeNodeData) => void;
}

export const ThreeFlowScene: React.FC<ThreeFlowSceneProps> = ({
  interactive = true,
  className = "",
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<ThreeGraphManager | null>(null);
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const [hoveredNode, setHoveredNode] = useState<ThreeNodeData | null>(null);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new ThreeGraphManager(
      containerRef.current,
      isLight,
      (node) => {
        setHoveredNode(node);
      }
    );
    managerRef.current = manager;

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          manager.resize(width, height);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // Mouse move parallax listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      manager.setMousePos(x, y);
    };

    // Mobile touch interaction listener (passive so vertical page scroll is not blocked)
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      manager.setMousePos(x, y);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      manager.setMousePos(x, y);
    };

    const container = containerRef.current;
    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    return () => {
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      manager.destroy();
      managerRef.current = null;
    };
  }, [interactive]);

  // Sync theme changes
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateTheme(isLight);
    }
  }, [isLight]);

  const handleTriggerEnergy = () => {
    if (managerRef.current) {
      managerRef.current.triggerEnergyPulse();
      setPulseCount((c) => c + 1);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden select-none border border-stone-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#080d18]/70 backdrop-blur-md touch-pan-y ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* Floating Interactive Controls HUD */}
      {interactive && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/85 dark:bg-slate-900/90 border border-stone-200 dark:border-slate-700/50 backdrop-blur-md shadow-lg pointer-events-auto">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
              3D WebGL DAG Active
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleTriggerEnergy}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium font-mono text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/80 border border-cyan-200 dark:border-cyan-500/40 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
              <span>Pulse Beam {pulseCount > 0 && `(${pulseCount})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hover Node Tooltip Card */}
      {hoveredNode && (
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 md:right-auto md:max-w-md p-3 sm:p-4 rounded-xl bg-white/95 dark:bg-[#0c1322]/95 border border-cyan-300 dark:border-cyan-500/30 backdrop-blur-xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 flex-shrink-0">
                {hoveredNode.type}
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                {hoveredNode.sublabel}
              </h4>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 flex-shrink-0">
              <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              2.4ms
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {hoveredNode.description}
          </p>
          {onSelectNode && (
            <button
              onClick={() => onSelectNode(hoveredNode)}
              className="mt-2 text-[10px] sm:text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
            >
              Inspect Node Architecture →
            </button>
          )}
        </div>
      )}

      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
    </div>
  );
};
