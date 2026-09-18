import { AppEdge, AppNode, NodeType } from "../types/flow";
import {
  ConditionNodeData,
  HttpRequestNodeData,
  LLMNodeData,
  OutputNodeData,
  TransformNodeData,
  TriggerNodeData,
} from "../types/nodes";
import { ExecutionStep } from "../types/execution";
import { useFlowStore } from "../store/useFlowStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { resolveVariables } from "./variableResolver";
import { executeLLMRequest } from "./llmService";

/**
 * Validates the flow graph: checks for triggers, cycles, and dangling nodes.
 */
export function validateWorkflow(nodes: AppNode[], edges: AppEdge[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (nodes.length === 0) {
    return { valid: false, errors: ["Workflow is empty. Add at least one trigger node."] };
  }

  const triggerNodes = nodes.filter((n) => n.type === "trigger");
  if (triggerNodes.length === 0) {
    errors.push("Workflow must contain at least one Trigger node as an entry point.");
  }

  // Detect simple cycles using adjacency list and DFS
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    if (adj.has(e.source)) {
      adj.get(e.source)!.push(e.target);
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let hasCycle = false;

  function dfs(nodeId: string) {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        hasCycle = true;
      }
    }
    recursionStack.delete(nodeId);
  }

  nodes.forEach((n) => {
    if (!visited.has(n.id)) dfs(n.id);
  });

  if (hasCycle) {
    errors.push("Workflow contains a circular dependency loop (cycle detected).");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Topological Sort for DAG execution order.
 */
export function getTopologicalOrder(nodes: AppNode[], edges: AppEdge[]): AppNode[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  });

  edges.forEach((edge) => {
    if (inDegree.has(edge.target)) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
    if (adj.has(edge.source)) {
      adj.get(edge.source)!.push(edge.target);
    }
  });

  // Queue of nodes with in-degree 0 (triggers or starting roots)
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const orderedNodeIds: string[] = [];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    orderedNodeIds.push(currId);

    const neighbors = adj.get(currId) || [];
    for (const neighbor of neighbors) {
      const newDeg = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Map IDs back to AppNodes
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const orderedNodes = orderedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);

  // If any unvisited nodes remain (e.g. disconnected components), append them
  const visitedSet = new Set(orderedNodeIds);
  nodes.forEach((n) => {
    if (!visitedSet.has(n.id)) {
      orderedNodes.push(n);
    }
  });

  return orderedNodes;
}

/**
 * Evaluates Condition logic rules against incoming data or context.
 */
function evaluateConditionRules(data: ConditionNodeData, inputVal: any, context: any): boolean {
  const { logicOperator = "AND", rules = [] } = data;
  if (rules.length === 0) return true;

  const results = rules.map((rule) => {
    let sourceValue: any;
    if (!rule.field || rule.field === "output") {
      sourceValue = typeof inputVal === "object" ? JSON.stringify(inputVal) : String(inputVal ?? "");
    } else {
      sourceValue = inputVal?.[rule.field] ?? "";
    }

    const sourceStr = String(sourceValue).toLowerCase();
    const targetStr = String(rule.value || "").toLowerCase();

    switch (rule.operator) {
      case "contains":
        return sourceStr.includes(targetStr);
      case "equals":
        return sourceStr === targetStr;
      case "regex": {
        try {
          const re = new RegExp(rule.value, "i");
          return re.test(sourceStr);
        } catch {
          return false;
        }
      }
      case "gt": {
        const numA = parseFloat(sourceStr);
        const numB = parseFloat(targetStr);
        return !isNaN(numA) && !isNaN(numB) && numA > numB;
      }
      case "lt": {
        const numA = parseFloat(sourceStr);
        const numB = parseFloat(targetStr);
        return !isNaN(numA) && !isNaN(numB) && numA < numB;
      }
      case "isNotEmpty":
        return Boolean(sourceValue) && sourceStr.trim() !== "" && sourceStr !== "{}" && sourceStr !== "[]";
      default:
        return true;
    }
  });

  if (logicOperator === "OR") {
    return results.some(Boolean);
  }
  return results.every(Boolean);
}

/**
 * Executes a single node and returns its output and metadata.
 */
async function executeSingleNode(
  node: AppNode,
  context: any,
  previousNodeId?: string,
  stepId?: string
): Promise<{
  output: any;
  summary: string;
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  conditionBranch?: "true" | "false";
}> {
  const settings = useSettingsStore.getState();
  const execStore = useExecutionStore.getState();

  const log = (msg: string) => {
    if (stepId) execStore.addLog(stepId, msg);
  };

  log(`Executing [${node.type.toUpperCase()}] "${node.data.label}" (${node.id})`);

  switch (node.type) {
    case "trigger": {
      const data = node.data as TriggerNodeData;
      const prompt = data.inputPrompt || "Default workflow trigger event";
      log(`Trigger generated payload: "${prompt.slice(0, 80)}..."`);
      return {
        output: prompt,
        summary: `Triggered with payload (${prompt.length} chars)`,
      };
    }

    case "llm": {
      const data = node.data as LLMNodeData;
      const resolvedUserPrompt = resolveVariables(data.userPromptTemplate, context, previousNodeId);
      const resolvedSystemPrompt = data.systemPrompt
        ? resolveVariables(data.systemPrompt, context, previousNodeId)
        : undefined;

      log(`Resolved LLM Prompt:\n${resolvedUserPrompt.slice(0, 150)}...`);
      log(`Dispatching to provider "${data.provider}" with model "${data.model}" (MockMode: ${settings.mockMode})`);

      const response = await executeLLMRequest({
        provider: data.provider,
        model: data.model,
        systemPrompt: resolvedSystemPrompt,
        userPrompt: resolvedUserPrompt,
        temperature: data.temperature,
        maxTokens: data.maxTokens,
        jsonMode: data.jsonMode,
        apiKeys: settings.apiKeys,
        mockMode: settings.mockMode || data.provider === "mock",
      });

      log(`LLM inference completed in ${response.durationMs}ms via ${response.providerUsed}.`);
      log(`Tokens: ${response.tokensUsed.totalTokens} (Prompt: ${response.tokensUsed.promptTokens}, Completion: ${response.tokensUsed.completionTokens})`);

      return {
        output: response.data || response.text,
        summary: `Generated response using ${data.model} (${response.durationMs}ms)`,
        tokensUsed: response.tokensUsed,
      };
    }

    case "condition": {
      const data = node.data as ConditionNodeData;
      const prevOutput = previousNodeId ? context[previousNodeId]?.output : undefined;
      const isPassed = evaluateConditionRules(data, prevOutput, context);
      const branch: "true" | "false" = isPassed ? "true" : "false";

      log(`Evaluated ${data.rules.length} rule(s) with ${data.logicOperator} logic: Outcome => ${branch.toUpperCase()}`);

      return {
        output: {
          passed: isPassed,
          branch,
          evaluatedValue: prevOutput,
        },
        summary: `Condition evaluated to ${branch.toUpperCase()}`,
        conditionBranch: branch,
      };
    }

    case "transform": {
      const data = node.data as TransformNodeData;
      const prevOutput = previousNodeId ? context[previousNodeId]?.output : undefined;

      log(`Executing JavaScript Sandbox transform code`);

      // Safe evaluation sandbox using Function constructor
      try {
        const sandboxFunc = new Function(
          "input",
          "context",
          `
          ${data.code}
          if (typeof transform === 'function') {
            return transform(input, context);
          }
          throw new Error("Missing 'transform(input, context)' function declaration.");
        `
        );

        const result = sandboxFunc(prevOutput, context);
        log(`Transform returned result: ${JSON.stringify(result)?.slice(0, 100)}`);

        return {
          output: result,
          summary: `Transformed payload successfully`,
        };
      } catch (err: any) {
        throw new Error(`JavaScript Transform Error: ${err.message}`);
      }
    }

    case "httpRequest": {
      const data = node.data as HttpRequestNodeData;
      const resolvedUrl = resolveVariables(data.url, context, previousNodeId);
      let resolvedBody: any = undefined;

      if (data.method !== "GET" && data.bodyPayload) {
        const bodyStr = resolveVariables(data.bodyPayload, context, previousNodeId);
        try {
          resolvedBody = JSON.parse(bodyStr);
        } catch {
          resolvedBody = bodyStr;
        }
      }

      log(`Dispatching HTTP ${data.method} to: ${resolvedUrl}`);

      const headers: Record<string, string> = {};
      data.headers?.forEach((h) => {
        if (h.key && h.value) {
          headers[h.key] = resolveVariables(h.value, context, previousNodeId);
        }
      });

      if (settings.mockMode) {
        // Mock successful webhook dispatch
        await new Promise((r) => setTimeout(r, 300));
        log(`[Mock Mode] Simulated HTTP 200 OK Response`);
        return {
          output: {
            status: 200,
            statusText: "OK (Simulated)",
            url: resolvedUrl,
            dispatchedPayload: resolvedBody,
          },
          summary: `HTTP ${data.method} ${resolvedUrl} (200 OK Simulated)`,
        };
      }

      const res = await fetch(resolvedUrl, {
        method: data.method,
        headers,
        body: data.method !== "GET" && resolvedBody ? JSON.stringify(resolvedBody) : undefined,
      });

      const contentType = res.headers.get("content-type") || "";
      let responseBody: any;
      if (contentType.includes("application/json")) {
        responseBody = await res.json().catch(() => ({}));
      } else {
        responseBody = await res.text();
      }

      log(`HTTP Response: ${res.status} ${res.statusText}`);

      return {
        output: responseBody,
        summary: `HTTP ${data.method} status ${res.status}`,
      };
    }

    case "output": {
      const data = node.data as OutputNodeData;
      const prevOutput = previousNodeId ? context[previousNodeId]?.output : undefined;
      log(`Output node received final payload.`);

      return {
        output: prevOutput,
        summary: `Result displayed (${data.displayFormat || "markdown"})`,
      };
    }

    default:
      return {
        output: previousNodeId ? context[previousNodeId]?.output : null,
        summary: "Pass-through execution",
      };
  }
}

/**
 * Executes the entire workflow DAG or a single target node.
 */
export async function executeWorkflow(targetNodeId?: string): Promise<{ success: boolean; error?: string }> {
  const flowStore = useFlowStore.getState();
  const execStore = useExecutionStore.getState();

  const { nodes, edges, workflowId } = flowStore;

  // Validation
  const validation = validateWorkflow(nodes, edges);
  if (!validation.valid && !targetNodeId) {
    const errorMsg = validation.errors.join(" ");
    return { success: false, error: errorMsg };
  }

  // Reset visual node states
  flowStore.resetAllNodeStatuses();

  // Start execution run in store
  const runId = execStore.startRun(workflowId, nodes.length);
  const executionOrder = getTopologicalOrder(nodes, edges);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const incomingEdgesMap = new Map<string, AppEdge[]>();
  edges.forEach((e) => {
    if (!incomingEdgesMap.has(e.target)) {
      incomingEdgesMap.set(e.target, []);
    }
    incomingEdgesMap.get(e.target)!.push(e);
  });

  // Track skipped nodes (due to condition branching)
  const skippedNodes = new Set<string>();

  // Determine nodes to execute
  const nodesToRun = targetNodeId
    ? [nodeMap.get(targetNodeId)!].filter(Boolean)
    : executionOrder;

  // Pre-populate execution run steps
  const initialSteps: ExecutionStep[] = nodesToRun.map((node) => ({
    id: `step_${node.id}_${Date.now()}`,
    nodeId: node.id,
    nodeLabel: node.data.label,
    nodeType: node.type,
    status: "idle",
    startedAt: new Date().toISOString(),
    inputPayload: null,
    outputPayload: null,
    logs: [],
  }));

  // Assign steps to run
  if (execStore.currentRun) {
    useExecutionStore.setState((state) => ({
      currentRun: state.currentRun ? { ...state.currentRun, steps: initialSteps } : null,
    }));
  }

  try {
    for (let i = 0; i < nodesToRun.length; i++) {
      const node = nodesToRun[i];
      const step = initialSteps[i];

      // Check if node is skipped by upstream condition branch
      if (skippedNodes.has(node.id)) {
        flowStore.updateNodeStatus(node.id, "idle", undefined, "Skipped by condition branch");
        execStore.updateStep(step.id, { status: "idle", logs: ["[Info] Node skipped by upstream branch"] });
        continue;
      }

      // Check incoming edge dependencies and previous node
      const incomingEdges = incomingEdgesMap.get(node.id) || [];
      let previousNodeId: string | undefined = incomingEdges[0]?.source;

      // Handle condition source handles (e.g. true vs false)
      let shouldSkipCurrent = false;
      for (const edge of incomingEdges) {
        const sourceNode = nodeMap.get(edge.source);
        if (sourceNode?.type === "condition") {
          const sourceOutput = execStore.nodeOutputs[edge.source]?.output;
          const conditionOutcome = sourceOutput?.branch; // "true" | "false"
          if (edge.sourceHandle && edge.sourceHandle !== conditionOutcome) {
            shouldSkipCurrent = true;
          }
        }
      }

      if (shouldSkipCurrent) {
        skippedNodes.add(node.id);
        // Also skip all downstream children
        const downstreamEdges = edges.filter((e) => e.source === node.id);
        downstreamEdges.forEach((e) => skippedNodes.add(e.target));

        flowStore.updateNodeStatus(node.id, "idle", undefined, "Branch not taken");
        execStore.updateStep(step.id, { status: "idle", logs: ["[Info] Branch not active"] });
        continue;
      }

      // Set node to running
      const prevOutput = previousNodeId ? execStore.nodeOutputs[previousNodeId]?.output : undefined;
      flowStore.updateNodeStatus(node.id, "running");
      execStore.setActiveNodeId(node.id);
      execStore.updateStep(step.id, {
        status: "running",
        startedAt: new Date().toISOString(),
        inputPayload: prevOutput,
      });

      const nodeStartTime = Date.now();

      try {
        const currentContext = useExecutionStore.getState().nodeOutputs;
        const result = await executeSingleNode(node, currentContext, previousNodeId, step.id);
        const durationMs = Date.now() - nodeStartTime;

        // Record output
        execStore.recordStepOutput(
          node.id,
          result.output,
          "success",
          durationMs,
          undefined,
          result.tokensUsed
        );

        flowStore.updateNodeStatus(
          node.id,
          "success",
          undefined,
          result.summary,
          durationMs
        );

        // If this was a condition node, mark inactive branch children as skipped
        if (node.type === "condition" && result.conditionBranch) {
          const outgoingEdges = edges.filter((e) => e.source === node.id);
          outgoingEdges.forEach((edge) => {
            if (edge.sourceHandle && edge.sourceHandle !== result.conditionBranch) {
              skippedNodes.add(edge.target);
            }
          });
        }
      } catch (nodeError: any) {
        const durationMs = Date.now() - nodeStartTime;
        const errMsg = nodeError.message || String(nodeError);

        execStore.addLog(step.id, `[ERROR] ${errMsg}`);
        execStore.recordStepOutput(node.id, null, "error", durationMs, errMsg);
        flowStore.updateNodeStatus(node.id, "error", errMsg, "Failed", durationMs);

        execStore.finishRun("error", errMsg);
        return { success: false, error: errMsg };
      }
    }

    execStore.finishRun("success");
    return { success: true };
  } catch (globalError: any) {
    const errorMsg = globalError.message || String(globalError);
    execStore.finishRun("error", errorMsg);
    return { success: false, error: errorMsg };
  }
}
