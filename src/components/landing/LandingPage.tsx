// LandingPage.tsx: Master landing page composing navbar, 3D WebGL hero, feature cards, live telemetry inspector, template gallery, architecture deep dive, CTA, and footer
// Importers/Callers: src/App.tsx
// Affected API: LandingPage: React.FC
// Data Schema: Component Props ({})
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import React from "react";
import { LandingNavbar } from "./LandingNavbar";
import { LandingHero } from "./LandingHero";
import { FeaturesSection } from "./FeaturesSection";
import { InteractiveDemoSection } from "./InteractiveDemoSection";
import { TemplateShowcaseSection } from "./TemplateShowcaseSection";
import { ArchitectureSection } from "./ArchitectureSection";
import { CallToActionSection } from "./CallToActionSection";
import { LandingFooter } from "./LandingFooter";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#060a14] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeaturesSection />
        <InteractiveDemoSection />
        <TemplateShowcaseSection />
        <ArchitectureSection />
        <CallToActionSection />
      </main>
      <LandingFooter />
    </div>
  );
};
