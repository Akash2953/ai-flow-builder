# AI Flow Builder — 3D Three.js Landing Page Implementation Plan

<!--
Fact-Forcing Gate Context:
1. Importers/Callers: Executed by Antigravity and development agents.
2. Confirm no existing file: Verified via Glob that docs/superpowers/plans/ has no existing plan file for this feature.
3. Data format: Markdown document specifying granular tasks, dependencies, exact code snippets, and automated verification steps.
4. User instruction verbatim: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills"
-->

**Goal:** Build an interactive 3D landing page for AI Flow Builder featuring Three.js WebGL node graph animations, interactive template previews, feature deep-dives, dual-theme adaptation, and seamless routing to the Flow Studio canvas.

**Architecture Document:** `docs/superpowers/specs/2026-09-20-ai-flow-landing-page-design.md`

---

## Tasks Overview

- [ ] **Task 1: Install Three.js dependencies & Type definitions**
  - Install `three` and `@types/three`.
  - Verify package.json and clean compilation.
- [ ] **Task 2: Implement View & Navigation Store (`useViewStore.ts`)**
  - Create state for switching between `'landing'` and `'studio'`, syncing with `window.location.hash`.
  - Add helper for template pre-loading when launching studio from a showcase card.
- [ ] **Task 3: Build Core Three.js 3D Graph Engine (`ThreeGraphManager.ts`)**
  - Create the WebGL 3D scene manager with custom geometries:
    - 3D DAG Nodes with glowing cores and rounded borders.
    - 3D Bezier curve connection tubes connecting parent and child nodes.
    - Particle stream animation engine pulsing along the bezier paths.
    - Ambient particle dust field reacting to mouse motion.
    - Interactive raycaster for hover/click interaction and camera parallax dampening.
    - Dynamic theme palette updater for Dark and Light modes.
    - Robust WebGL cleanup (`dispose()` for geometries, materials, textures, and animation loops).
- [ ] **Task 4: Build React Three.js Canvas Component (`ThreeFlowScene.tsx`)**
  - Encapsulate the canvas with ResizeObserver, mouse tracking, theme integration, and lazy unmount cleanup.
- [ ] **Task 5: Build Landing Page Subsections**
  - `LandingNavbar.tsx`: Sticky glassmorphic navbar with brand logo, nav links (Features, Templates, Architecture), theme toggle, and "Launch Studio" CTA.
  - `LandingHero.tsx`: High-impact headline, feature badges, interactive CTA buttons, and background 3D canvas integration.
  - `FeaturesSection.tsx`: 6 high-density cards highlighting topological DAG execution, multi-LLM routing, live telemetry, cycle detection, variable templating, and zero-lockin export.
  - `InteractiveDemoSection.tsx`: Interactive mini-visualizer allowing users to test trigger pulses and inspect node payloads in real-time.
  - `TemplateShowcaseSection.tsx`: Gallery of the 3 enterprise templates (Customer Support Triage, Autonomous Lead Scorer, RAG Document Q&A) with one-click "Launch in Studio" action.
  - `ArchitectureSection.tsx`: Visual breakdown of the topological sorter, Kahn's algorithm, mustache variable resolution, and streaming telemetry architecture.
  - `CallToActionSection.tsx`: High-conversion closing banner with "Start Building Workflows Now" and quick template launch.
  - `LandingFooter.tsx`: Clean footer with navigation links, license info, and GitHub link.
  - `LandingPage.tsx`: Root container orchestrating all sections with smooth scroll and theme support.
- [ ] **Task 6: Connect App Routing & Studio Header Integration**
  - Update `src/App.tsx` to render `LandingPage` or `Studio` depending on `useViewStore.currentView`.
  - Update `src/components/header/HeaderToolbar.tsx` with a "← Overview / Home" navigation button.
- [ ] **Task 7: Build & End-to-End Verification**
  - Run `npm run build` (`tsc && vite build`) to verify 0 type errors.
  - Test live interactions in Chrome DevTools MCP: 3D scene rendering, mouse interaction, theme toggle, and 1-click template launching into the studio canvas.
