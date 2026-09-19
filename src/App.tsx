// App.tsx: Root workspace layout uniting Header, Palette, Canvas, Inspector, Telemetry Drawer, and Modals
// Importers/Callers: src/main.tsx
// Affected API: useSettingsStore (theme synchronization to document root), useFlowStore
// Data Schema: Dual-theme CSS root classes, ReactFlowProvider context
// User Instruction: "i want have light them as well that will look like this [Image #5]"
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { HeaderToolbar } from "./components/header/HeaderToolbar";
import { NodePalette } from "./components/sidebar/NodePalette";
import { FlowCanvas } from "./components/canvas/FlowCanvas";
import { NodeInspector } from "./components/inspector/NodeInspector";
import { ExecutionDrawer } from "./components/execution/ExecutionDrawer";
import { SettingsModal } from "./components/modals/SettingsModal";
import { TemplatePickerModal } from "./components/modals/TemplatePickerModal";
import { useSettingsStore } from "./store/useSettingsStore";

export const App: React.FC = () => {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (isLight) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme, isLight]);

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
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar Palette */}
        <NodePalette />

        {/* Center Interactive Flow Canvas */}
        <main className="flex-1 h-full relative">
          <ReactFlowProvider>
            <FlowCanvas />
          </ReactFlowProvider>
        </main>

        {/* Right Node Property Inspector */}
        <NodeInspector />

        {/* Bottom Execution Telemetry Drawer */}
        <ExecutionDrawer />
      </div>

      {/* Modals */}
      <TemplatePickerModal
        isOpen={isTemplatesOpen}
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
