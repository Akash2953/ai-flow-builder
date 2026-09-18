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
