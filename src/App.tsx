// App.tsx: Root workspace layout uniting Header, Palette, Canvas, Inspector, Telemetry Drawer, and Modals
// Importers/Callers: src/main.tsx
// Affected API: useSettingsStore (theme synchronization to document root), useFlowStore
// Data Schema: Dual-theme CSS root classes, ReactFlowProvider context
// User Instruction: "i want have light them as well that will look like this [Image #5]"
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState, useEffect, Suspense } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { HeaderToolbar } from "./components/header/HeaderToolbar";
import { NodePalette } from "./components/sidebar/NodePalette";
import { ExecutionDrawer } from "./components/execution/ExecutionDrawer";
import { SettingsModal } from "./components/modals/SettingsModal";
import { TemplatePickerModal } from "./components/modals/TemplatePickerModal";
import { useSettingsStore } from "./store/useSettingsStore";
import { useViewStore } from "./store/useViewStore";
import { useFlowStore } from "./store/useFlowStore";

const LandingPage = React.lazy(() => import("./components/landing/LandingPage").then(m => ({ default: m.LandingPage })));
const FlowCanvas = React.lazy(() => import("./components/canvas/FlowCanvas").then(m => ({ default: m.FlowCanvas })));
const NodeInspector = React.lazy(() => import("./components/inspector/NodeInspector").then(m => ({ default: m.NodeInspector })));

export const App: React.FC = () => {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [templateModalMode, setTemplateModalMode] = useState<"browse" | "save">("browse");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);
  const currentView = useViewStore((state) => state.currentView);
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (isLight) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [theme, isLight]);

  // If in landing page view, render high-conversion 3D landing page
  if (currentView === "landing") {
    return (
      <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-slate-400">Loading experience...</div>}>
        <LandingPage />
      </Suspense>
    );
  }

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 ${
        isLight
          ? "bg-[#FAF8F5] text-[#2C2724]"
          : "bg-canvas-dark text-slate-100"
      }`}
    >
      {/* Top Navigation & Workflow Actions */}
      <HeaderToolbar
        onOpenTemplates={(mode = "browse") => {
          setTemplateModalMode(mode);
          setIsTemplatesOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar Palette */}
        <NodePalette
          onOpenTemplates={(mode = "browse") => {
            setTemplateModalMode(mode);
            setIsTemplatesOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Center Interactive Flow Canvas */}
        <main className="flex-1 h-full relative">
          <ReactFlowProvider>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading canvas...</div>}>
              <FlowCanvas />
            </Suspense>
          </ReactFlowProvider>
        </main>

        {/* Right Node Property Inspector - Only displayed when a node is selected */}
        {selectedNodeId && (
          <Suspense fallback={<div className="w-80 h-full border-l border-slate-800 bg-slate-900/50" />}>
            <NodeInspector />
          </Suspense>
        )}

        {/* Bottom Execution Telemetry Drawer */}
        <ExecutionDrawer />
      </div>

      {/* Modals */}
      <TemplatePickerModal
        isOpen={isTemplatesOpen}
        initialMode={templateModalMode}
        onClose={() => setIsTemplatesOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
