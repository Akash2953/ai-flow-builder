// ArchitectureSection.tsx: Deep dive into topological sorting, Kahn's algorithm, cycle safety, and client execution runtime
// Importers/Callers: src/components/landing/LandingPage.tsx
// Affected API: ArchitectureSection: React.FC
// Data Schema: Component Props ({})
// User Instruction: "Make the entire Landing Page fully responsive and touch-optimized on mobile devices"

import React, { useState } from "react";
import { Terminal, CheckCircle2, GitPullRequest, Code2 } from "lucide-react";

export const ArchitectureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"kahn" | "resolver" | "memory">("kahn");

  return (
    <section id="architecture" className="py-16 sm:py-24 relative overflow-hidden bg-white dark:bg-[#080d18] border-t border-stone-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
            <Terminal className="w-3.5 h-3.5" />
            Under the Hood
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Deterministic DAG Runtime with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 dark:from-emerald-400 dark:via-cyan-300 dark:to-indigo-400">
              Zero Server Dependencies
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">
            High-speed client execution powered by Kahn’s in-degree topological resolution and reactive variable graph interpolation.
          </p>
        </div>

        {/* Interactive Architecture Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Interactive Tabs & Explanations (5 cols) */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <button
              onClick={() => setActiveTab("kahn")}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                activeTab === "kahn"
                  ? "bg-stone-50 dark:bg-slate-900/90 border-cyan-500/50 shadow-md dark:shadow-lg shadow-cyan-500/10 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-900/40 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 text-slate-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === "kahn" ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300" : "bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                    <GitPullRequest className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Topological Kahn’s Algorithm</h4>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-cyan-600 dark:text-cyan-400 flex-shrink-0">O(V + E)</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates in-degree counts for every node, queues independent entrypoints (in-degree = 0), and validates strict acyclicity before execution.
              </p>
            </button>

            <button
              onClick={() => setActiveTab("resolver")}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                activeTab === "resolver"
                  ? "bg-stone-50 dark:bg-slate-900/90 border-purple-500/50 shadow-md dark:shadow-lg shadow-purple-500/10 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-900/40 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 text-slate-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === "resolver" ? "bg-purple-500/20 text-purple-600 dark:text-purple-300" : "bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Liquid Template Interpolator</h4>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-purple-600 dark:text-purple-400 flex-shrink-0">&lt;1ms</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep property accessor resolving syntax patterns like <code className="text-cyan-600 dark:text-cyan-300">{"{{node.output.field}}"}</code> across nested JSON dictionaries with null-safe fallbacks.
              </p>
            </button>

            <button
              onClick={() => setActiveTab("memory")}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${
                activeTab === "memory"
                  ? "bg-stone-50 dark:bg-slate-900/90 border-emerald-500/50 shadow-md dark:shadow-lg shadow-emerald-500/10 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-900/40 border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 text-slate-900 dark:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === "memory" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300" : "bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Memory Sandboxing & Replay</h4>
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-emerald-600 dark:text-emerald-400 flex-shrink-0">100% Client</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Execution history and node responses live in isolated Zustand execution buckets with zero leakage to unvetted third-party analytics.
              </p>
            </button>
          </div>

          {/* Right: Code / Algorithm Snippet Console (7 cols) */}
          <div className="w-full lg:col-span-7 rounded-2xl border border-stone-200 dark:border-slate-800/90 bg-[#1e293b] dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-xl dark:shadow-2xl">
            {/* Console Title Bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0f172a] dark:bg-slate-950/90 border-b border-slate-700 dark:border-slate-800">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-1 sm:ml-2 text-[11px] sm:text-xs font-mono text-slate-400 truncate">
                  {activeTab === "kahn" && "engine/topologicalSort.ts"}
                  {activeTab === "resolver" && "engine/variableResolver.ts"}
                  {activeTab === "memory" && "engine/executor.ts"}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400">TypeScript 5.x</span>
            </div>

            {/* Code Content Body */}
            <div className="p-3.5 sm:p-5 font-mono text-[10px] sm:text-xs overflow-x-auto max-h-[300px] sm:max-h-[380px] scrollbar-thin text-slate-300 leading-relaxed">
              {activeTab === "kahn" && (
                <pre>{`// Kahn's Algorithm Implementation with Cycle Detection
export function getTopologicalOrder(nodes: Node[], edges: Edge[]): {
  order: string[];
  hasCycle: boolean;
  levels: string[][];
} {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adjacency.set(n.id, []);
  });

  edges.forEach((e) => {
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    adjacency.get(e.source)?.push(e.target);
  });

  // Zero in-degree queue for concurrent execution waves
  let queue = nodes.filter((n) => inDegree.get(n.id) === 0).map((n) => n.id);
  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    adjacency.get(current)?.forEach((neighbor) => {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) queue.push(neighbor);
    });
  }

  return {
    order,
    hasCycle: order.length !== nodes.length, // Cycle detected if not all nodes visited
  };
}`}</pre>
              )}

              {activeTab === "resolver" && (
                <pre>{`// Variable Resolver with Liquid {{node.output.path}} Syntax
export function resolveTemplateVariables(
  templateStr: string,
  nodeOutputs: Record<string, any>
): string {
  const VAR_REGEX = /\\{\\{\\s*([a-zA-Z0-9_-]+)\\.([a-zA-Z0-9_.-]+)\\s*\\}\\}/g;

  return templateStr.replace(VAR_REGEX, (match, nodeId, path) => {
    const nodeOutput = nodeOutputs[nodeId];
    if (nodeOutput === undefined) return match;

    const resolved = path
      .split(".")
      .reduce((acc: any, key: string) => (acc ? acc[key] : undefined), nodeOutput);

    return typeof resolved === "object"
      ? JSON.stringify(resolved, null, 2)
      : String(resolved ?? match);
  });
}`}</pre>
              )}

              {activeTab === "memory" && (
                <pre>{`// Execution Engine with Streaming Telemetry
export async function executePipeline(
  nodes: Node[],
  edges: Edge[],
  onNodeStateChange: (id: string, state: NodeExecutionState) => void
) {
  const { order, hasCycle } = getTopologicalOrder(nodes, edges);
  if (hasCycle) throw new Error("Graph contains cycles; execution aborted.");

  const outputContext: Record<string, any> = {};

  for (const nodeId of order) {
    const node = nodes.find((n) => n.id === nodeId)!;
    onNodeStateChange(nodeId, { status: "running", startedAt: Date.now() });

    try {
      const result = await executeNode(node, outputContext);
      outputContext[nodeId] = result.output;
      onNodeStateChange(nodeId, { status: "completed", durationMs: result.durationMs });
    } catch (err) {
      onNodeStateChange(nodeId, { status: "failed", error: (err as Error).message });
      throw err;
    }
  }
}`}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
