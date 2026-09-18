import { NodeExecutionStatus } from "./flow";

export interface ExecutionStep {
  id: string;
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  status: NodeExecutionStatus;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  inputPayload: any;
  outputPayload: any;
  error?: string;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  logs: string[];
}

export interface ExecutionRun {
  id: string;
  workflowId: string;
  startedAt: string;
  finishedAt?: string;
  totalDurationMs?: number;
  status: "idle" | "running" | "success" | "error" | "cancelled";
  steps: ExecutionStep[];
  totalTokens: number;
  error?: string;
}

export interface NodeOutputMap {
  [nodeId: string]: {
    output: any;
    status: NodeExecutionStatus;
    timestamp: string;
  };
}
