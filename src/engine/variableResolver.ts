import { NodeOutputMap } from "../types/execution";

/**
 * Safely traverses an object or value by dot notation path (e.g., "output.summary.score")
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path?.trim()) return obj;
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

/**
 * Resolves templated variables in strings like:
 * - {{trigger.output}}
 * - {{node_llm_1.output.summary}}
 * - {{previous.output}}
 */
export function resolveVariables(
  template: string,
  context: NodeOutputMap,
  previousNodeId?: string
): string {
  if (!template || typeof template !== "string") return template;

  const variableRegex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

  return template.replace(variableRegex, (match, expression: string) => {
    const trimmed = expression.trim();

    // Special shorthand aliases
    let targetNodeId: string | undefined;
    let propertyPath = "";

    const dotIndex = trimmed.indexOf(".");
    const firstSegment = dotIndex === -1 ? trimmed : trimmed.substring(0, dotIndex);
    const rest = dotIndex === -1 ? "" : trimmed.substring(dotIndex + 1);

    if (firstSegment === "previous" && previousNodeId) {
      targetNodeId = previousNodeId;
      propertyPath = rest || "output";
    } else if (firstSegment === "trigger") {
      // Find the first trigger node in context
      const triggerKey = Object.keys(context).find((k) => k.includes("trigger"));
      targetNodeId = triggerKey;
      propertyPath = rest || "output";
    } else {
      // Try exact nodeId match first
      if (context[firstSegment]) {
        targetNodeId = firstSegment;
        propertyPath = rest;
      } else {
        // Find by partial ID match (e.g. node_1 matching node_llm_1)
        const matchKey = Object.keys(context).find((k) => k.includes(firstSegment));
        if (matchKey) {
          targetNodeId = matchKey;
          propertyPath = rest;
        }
      }
    }

    if (!targetNodeId || !context[targetNodeId]) {
      // If variable not yet executed or found, return fallback empty string or preserve marker
      return "";
    }

    const nodeEntry = context[targetNodeId];
    let val: any;

    if (!propertyPath || propertyPath === "output") {
      val = nodeEntry.output;
    } else if (propertyPath.startsWith("output.")) {
      val = getNestedValue(nodeEntry.output, propertyPath.substring(7));
    } else {
      val = getNestedValue(nodeEntry.output, propertyPath);
      if (val === undefined) {
        val = getNestedValue(nodeEntry, propertyPath);
      }
    }

    if (val === undefined || val === null) {
      return "";
    }

    if (typeof val === "object") {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return String(val);
      }
    }

    return String(val);
  });
}

/**
 * Extracts all unique {{variables}} mentioned in a template
 */
export function extractVariableKeys(template: string): string[] {
  if (!template || typeof template !== "string") return [];
  const variableRegex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = variableRegex.exec(template)) !== null) {
    if (match[1] && !matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }

  return matches;
}
