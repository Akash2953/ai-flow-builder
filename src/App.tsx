import React, { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { HeaderToolbar } from "./components/header/HeaderToolbar";
import { NodePalette } from "./components/sidebar/NodePalette";
import { FlowCanvas } from "./components/canvas/FlowCanvas";
import { NodeInspector } from "./components/inspector/NodeInspector";
import { ExecutionDrawer } from "./components/execution/ExecutionDrawer";
import { SettingsModal } from "./components/modals/SettingsModal";
import { TemplatePickerModal } from "./components/modals/TemplatePickerModal";

export const App: React.FC = () => {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
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
