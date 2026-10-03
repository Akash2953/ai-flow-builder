# AI Flow Builder — 3D Interactive Three.js Landing Page Design Specification

<!--
Fact-Forcing Gate Context:
1. Importers/Callers: docs/superpowers/plans/2026-09-20-ai-flow-landing-page.md:1
2. Confirm no existing file: Verified via Glob that docs/superpowers/specs/ has no prior design spec for 3D landing page.
3. Data format: Markdown document defining architectural blueprint, Three.js 3D scene lifecycle, and routing specifications.
4. User instruction verbatim: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills"
-->

**Date:** 2026-09-20  
**Status:** Approved  
**Topic:** Three.js 3D Interactive Landing Page & Showcase Experience for AI Flow Builder  
**Design Level:** Architectural (Frontend Graphics & Application Routing)

---

## 1. Executive Summary & Goals

AI Flow Builder is a visual DAG workflow orchestration platform for multi-model AI agent pipelines. To communicate the power, speed, and tactile precision of the visual DAG engine, we are adding an interactive 3D landing page powered by Three.js.

### Key Objectives
1. **Immersive 3D Hero Scene**: A real-time Three.js WebGL canvas featuring a floating 3D Neural DAG graph with glowing nodes, curved bezier particle light-beams pulsing between connected nodes, floating volumetric particle dust, and smooth mouse parallax.
2. **Dual-Theme 3D Adaptation**: Dynamic colorway switching between **Linear Cyber Dark** (deep slate `#080d18`, electric cyan `#38bdf8`, neon emerald `#10b981`, purple `#a855f7`) and **Tactile Soft-Clay Light** (warm cream `#FAF8F5`, terracotta `#D97706`, sage `#059669`, warm stone `#7A7269`).
3. **High-Conversion Product Showcase**:
   - **Interactive 3D Feature Grid**: Real-time DAG execution, multi-provider LLMs, live streaming telemetry, topological cycle detection.
   - **Interactive Live Template Showcase**: Preview pre-built enterprise templates (Customer Support Triage, Autonomous Lead Scorer, RAG Document Q&A) with one-click "Launch in Studio" action.
   - **Interactive 3D Pipeline Visualizer**: Interactive canvas where visitors can hover/click 3D nodes to trigger energy surges and view node properties.
   - **Performance & Benchmark Metrics**: Visual indicators for sub-50ms DAG resolution, zero backend lock-in, client-side execution.
4. **Seamless Navigation & Studio Integration**:
   - Top navigation bar with "Features", "Templates", "Architecture", "Docs", and a glowing "Launch Flow Studio" CTA.
   - Direct view-state switcher (`view: "landing" | "studio"`) with instant URL hash/route sync (`#/studio` / `#/`) so users can transition from landing page straight into the active flow canvas with zero reload.

---

## 2. Architecture & Component Hierarchy

```
src/
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx                  # Root landing page container & scroll controller
│   │   ├── LandingNavbar.tsx                # Sleek sticky header with theme toggle & Launch CTA
│   │   ├── LandingHero.tsx                  # Hero section with headline, badges, and CTA buttons
│   │   ├── ThreeFlowScene.tsx               # High-performance Vanilla Three.js WebGL Canvas wrapper
│   │   ├── ThreeGraphManager.ts             # 3D Node & Edge Mesh, Bezier Curves, Particle Stream Engine
│   │   ├── FeaturesSection.tsx              # Anti-slop grid showcasing DAG, Multi-LLM, Telemetry
│   │   ├── InteractiveDemoSection.tsx       # Live interactive 3D DAG viewer with interactive node cards
│   │   ├── TemplateShowcaseSection.tsx      # Pre-built template preview cards with 1-click launch
│   │   ├── ArchitectureSection.tsx          # Deep-dive into Topological Sorter & Mustache Templating
│   │   ├── CallToActionSection.tsx          # High-impact closing banner
│   │   └── LandingFooter.tsx                # Footer with links, badges, and GitHub link
│   ├── header/
│   │   └── HeaderToolbar.tsx                # Updated with "Landing / Overview" back-link
├── store/
│   ├── useViewStore.ts                      # View state management ('landing' | 'studio', hash sync)
```

---

## 3. Three.js 3D Visual Metaphor & Graphics Engine

### 3.1 3D Scene Components (`ThreeGraphManager.ts`)
1. **Floating 3D DAG Node Meshes**:
   - Rounded 3D node blocks representing Trigger, LLM, Condition, Transform, and Output nodes.
   - Glowing holographic core spheres with inner fresnel glow shaders.
   - Distinct icon badges/glyphs mapped in 3D coordinate space.
2. **Curved Bezier Connection Edges**:
   - `CubicBezierCurve3` connecting output ports to target input ports in 3D space.
   - Tube geometries with pulsating gradient materials.
3. **Particle Data Streams (Energy Pulses)**:
   - Floating point cloud particles traveling along the bezier curves from node to node, simulating live workflow execution.
   - Ambient starfield/dust particle cloud responding softly to cursor coordinates.
4. **Interactive Raycasting & Parallax**:
   - Mouse move listener updates camera tilt with smooth dampening (`lerp`).
   - Hover raycaster detects node intersections, triggering scale up, luminescence pulse, and tooltip feedback.
5. **Adaptive Performance**:
   - Automatic pixel ratio clamping (`Math.min(window.devicePixelRatio, 2)`).
   - IntersectionObserver pause/resume when scrolled out of viewport.
   - Clean `dispose()` for geometries, materials, and WebGL render targets on component unmount.

---

## 4. Dual-Theme Palette Matrix for 3D & UI

| Element | Dark Mode (Linear Cyber) | Light Mode (Tactile Soft-Clay) |
|---|---|---|
| Background Canvas | `#080d18` with subtle radial blue glow | `#FAF8F5` with warm amber ambient glow |
| Primary Node Block | `#0f172a` (80% opacity), border `#38bdf8` | `#FFFFFF` (90% opacity), border `#D97706` |
| LLM Node Accent | Emerald Glow `#10b981` / Cyan `#38bdf8` | Warm Amber `#D97706` / Sage `#059669` |
| Connecting Edges | Glowing cyan/indigo bezier tubes | Warm bronze/terracotta bezier tubes |
| Particle Stream | Neon cyan `#38bdf8` & purple `#c084fc` | Sunlit amber `#f59e0b` & emerald `#10b981` |
| Hero Typography | White `#FFFFFF` + Slate `#94a3b8` | Deep Charcoal `#2C2724` + Warm Stone `#7A7269` |

---

## 5. View Routing & State Flow

1. **State Store (`useViewStore.ts`)**:
   - `currentView`: `'landing' | 'studio'`
   - `selectedTemplateId`: string | null (to auto-load a template upon clicking "Use Template" from landing page)
   - Synchronizes with `window.location.hash` (`#studio`, `#landing`).
2. **Seamless Transition**:
   - Clicking "Launch Studio" smoothly activates Studio mode.
   - Clicking "Explore Template" on a template card sets the template in `useFlowStore` and switches immediately to Studio with that workflow loaded.
   - Header in Studio contains a "← Overview" button to return to the landing page anytime.

---

## 6. Testing & Quality Verification Strategy

1. **TypeScript & Build Check**: Zero compiler errors with `npm run build` (`tsc && vite build`).
2. **Three.js WebGL Lifecycle Verification**:
   - Scene initializes cleanly, attaches to DOM canvas, adjusts to window resize, and cleans up memory on unmount without WebGL context leaks.
3. **Browser DevTools Verification**:
   - Verify smooth 60fps rendering in Chrome DevTools MCP.
   - Verify interactive click on template cards transitions into Studio with nodes hydrated.
   - Verify theme toggle switches both 2D Tailwind classes and 3D WebGL material colors seamlessly.
