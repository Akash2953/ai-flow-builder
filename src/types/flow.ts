import { Node, Edge } from "@xyflow/react";

export type NodeType =
  | "trigger"
  | "llm"
  | "condition"
  | "transform"
  | "httpRequest"
  | "output";

export type NodeExecutionStatus = "idle" | "running" | "success" | "error" | "skipped";

export interface BaseNodeData {
  label: string;
  type: NodeType;
  description?: string;
  status?: NodeExecutionStatus;
  executionTimeMs?: number;
  errorMessage?: string;
  outputSummary?: string;
  [key: string]: any;
}

export type AppNode = Node<BaseNodeData, NodeType>;
export type AppEdge = Edge;

export interface WorkflowExport {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
  nodes: AppNode[];
  edges: AppEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}
