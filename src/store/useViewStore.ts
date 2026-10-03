// useViewStore.ts: View routing and seamless studio launcher store with hash sync
// Importers/Callers: src/App.tsx, src/components/landing/LandingNavbar.tsx, src/components/header/HeaderToolbar.tsx, src/components/landing/TemplateShowcaseSection.tsx, src/components/landing/LandingHero.tsx, src/components/landing/CallToActionSection.tsx
// Affected API: useViewStore (currentView: 'landing' | 'studio', setView, launchStudioWithTemplate)
// Data Schema: AppView ('landing' | 'studio'), WorkflowTemplate, WorkflowExport
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import { create } from "zustand";
import { useFlowStore } from "./useFlowStore";
import { workflowTemplates, WorkflowTemplate } from "../templates/workflowTemplates";
import { WorkflowExport } from "../types/flow";

export type AppView = "landing" | "studio";

interface ViewState {
  currentView: AppView;
  setView: (view: AppView) => void;
  launchStudioWithTemplate: (templateId?: string) => void;
}

const getInitialView = (): AppView => {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#studio" || hash === "#/studio" || hash === "#app") {
      return "studio";
    }
  }
  return "landing";
};

export const useViewStore = create<ViewState>((set) => ({
  currentView: getInitialView(),

  setView: (view) => {
    set({ currentView: view });
    if (typeof window !== "undefined") {
      if (view === "studio") {
        window.location.hash = "#studio";
      } else {
        window.location.hash = "#";
      }
    }
  },

  launchStudioWithTemplate: (templateId) => {
    if (templateId) {
      const template = workflowTemplates.find((t: WorkflowTemplate) => t.id === templateId);
      if (template) {
        const exportPayload: WorkflowExport = {
          id: template.id,
          name: template.name,
          description: template.description,
          nodes: template.nodes as any,
          edges: template.edges as any,
          version: "1.0.0",
          createdAt: new Date().toISOString(),
        };
        useFlowStore.getState().loadWorkflow(exportPayload);
      }
    }
    set({ currentView: "studio" });
    if (typeof window !== "undefined") {
      window.location.hash = "#studio";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));
