// nodeTypes: React Flow custom node type registry mapping node type keys to components
// Importers/Callers: src/components/canvas/FlowCanvas.tsx
// Affected API: NodeTypes (trigger, llm, condition, transform, httpRequest, output)
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import { NodeTypes } from "@xyflow/react";
import { TriggerNode } from "./TriggerNode";
import { LLMNode } from "./LLMNode";
import { ConditionNode } from "./ConditionNode";
import { TransformNode } from "./TransformNode";
import { HttpRequestNode } from "./HttpRequestNode";
import { OutputNode } from "./OutputNode";

export const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  llm: LLMNode,
  condition: ConditionNode,
  transform: TransformNode,
  httpRequest: HttpRequestNode,
  output: OutputNode,
};
