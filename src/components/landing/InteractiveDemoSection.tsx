// InteractiveDemoSection.tsx: Interactive 3D WebGL showcase with live node inspection and telemetry panel
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: InteractiveDemoSection: React.FC
// Data Schema: Component Props ({})
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import React, { useState } from "react";
import * as THREE from "three";
import { ThreeFlowScene } from "./ThreeFlowScene";
import { ThreeNodeData } from "./ThreeGraphManager";
import { useViewStore } from "../../store/useViewStore";
import { Terminal, ArrowRight, Zap, CheckCircle2, Copy, Check } from "lucide-react";

export const InteractiveDemoSection: React.FC = () => {
  const setView = useViewStore((state) => state.setView);
  const [selectedNode, setSelectedNode] = useState<ThreeNodeData>({
    id: "node_llm",
    label: "Claude 3.5 Sonnet",
    sublabel: "LLM Reasoning Node",
    type: "llm",
    position: new THREE.Vector3(0, 1.2, 0),
    colorDark: "#c084fc",
    colorLight: "#8B5CF6",
    description:
      "Core reasoning agent executing system instructions with structured JSON schema outputs and automatic variable resolution.",
  });
  const [copied, setCopied] = useState(false);

  const sampleOutputs: Record<string, string> = {
    node_input: JSON.stringify(
      {
        ticket_id: "TCK-9402",
        urgency: "P1_CRITICAL",
        customer_tier: "ENTERPRISE",
        inquiry: "Production webhook latency spiked > 800ms across EU-West cluster.",
      },
      null,
      2
    ),
    node_llm: JSON.stringify(
      {
        classification: "INFRASTRUCTURE_INCIDENT",
        root_cause_hypothesis: "Ingress proxy connection exhaustion",
        suggested_action: "Trigger auto-remediation lambda and escalate to on-call.",
        confidence_score: 0.984,
      },
      null,
      2
    ),
    node_guard: JSON.stringify(
      {
        validation_status: "PASSED",
        pii_scrubbed: true,
        schema_conformance: "100%",
        action_authorized: true,
      },
      null,
      2
    ),
    node_router: JSON.stringify(
      {
        route_selected: "branch_urgent_ops",
        sla_target: "< 5 minutes",
        target_dispatch: "pagerduty_service_prod",
      },
      null,
      2
    ),
    node_output: JSON.stringify(
      {
        execution_id: "exec_8831f0a2",
        status: "RESOLVED_SUCCESS",
        total_duration: "18.4ms",
        pipeline_cost: "$0.00142",
      },
      null,
      2
    ),
  };

  const currentPayload = sampleOutputs[selectedNode.id] || sampleOutputs["node_llm"];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="interactive-3d" className="py-24 relative overflow-hidden bg-white dark:bg-[#080d18] border-t border-stone-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-medium">
            <Zap className="w-3.5 h-3.5" />
            3D Graph Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Inspect Living Graph{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              State & Payloads
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Hover or click any node in the WebGL viewport below to trace active data dependencies and real-time execution JSON payloads.
          </p>
        </div>

        {/* 2-Column Split: 3D Scene + Live Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: 3D Scene (7 cols) */}
          <div className="lg:col-span-7 h-[460px] sm:h-[540px] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-slate-800/80 bg-stone-50/40 dark:bg-slate-900/40 backdrop-blur-md relative shadow-2xl">
            <ThreeFlowScene
              interactive={true}
              className="w-full h-full"
              onSelectNode={(node) => setSelectedNode(node)}
            />
          </div>

          {/* Right: Live Telemetry Inspector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-slate-800/80 bg-[#FAF8F5] dark:bg-[#0c1322]/90 backdrop-blur-xl shadow-lg dark:shadow-xl">
            <div className="space-y-5">
              {/* Active Node Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full ring-4 ring-cyan-500/20"
                    style={{ backgroundColor: selectedNode.colorDark }}
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                      {selectedNode.sublabel}
                    </h4>
                    <span className="text-xs font-mono text-slate-400">
                      ID: {selectedNode.id}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                  {selectedNode.type}
                </span>
              </div>

              {/* Node Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {selectedNode.description}
              </p>

              {/* JSON Payload Inspector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Live Output Schema
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-300 overflow-x-auto max-h-[190px] scrollbar-thin">
                  <pre className="text-[11px] leading-snug">
                    {currentPayload}
                  </pre>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950/40 border border-stone-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono">
                    Latency
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    2.1ms
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950/40 border border-stone-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono">
                    Tokens
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    480 in / 120 out
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950/40 border border-stone-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-mono">
                    Status
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Passed
                  </span>
                </div>
              </div>
            </div>

            {/* Launch into Canvas Action */}
            <div className="pt-6 mt-6 border-t border-stone-200 dark:border-slate-800">
              <button
                onClick={() => setView("studio")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Open Graph in Canvas Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
