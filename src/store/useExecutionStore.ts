import { create } from "zustand";
import { ExecutionRun, ExecutionStep, NodeOutputMap } from "../types/execution";
import { NodeExecutionStatus } from "../types/flow";

interface ExecutionState {
  currentRun: ExecutionRun | null;
  nodeOutputs: NodeOutputMap;
  isDrawerOpen: boolean;
  activeNodeId: string | null;

  startRun: (workflowId: string, totalNodes: number) => string;
  updateStep: (stepId: string, partial: Partial<ExecutionStep>) => void;
  recordStepOutput: (
    nodeId: string,
    output: any,
    status: NodeExecutionStatus,
    durationMs?: number,
    error?: string,
    tokens?: { promptTokens: number; completionTokens: number; totalTokens: number }
  ) => void;
  addLog: (stepId: string, message: string) => void;
  finishRun: (status: "success" | "error" | "cancelled", error?: string) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveNodeId: (nodeId: string | null) => void;
  resetRun: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  currentRun: null,
  nodeOutputs: {},
  isDrawerOpen: false,
  activeNodeId: null,

  startRun: (workflowId: string) => {
    const runId = `run_${Date.now()}`;
    const newRun: ExecutionRun = {
      id: runId,
      workflowId,
      startedAt: new Date().toISOString(),
      status: "running",
      steps: [],
      totalTokens: 0,
    };

    set({
      currentRun: newRun,
      nodeOutputs: {},
      isDrawerOpen: true,
      activeNodeId: null,
    });

    return runId;
  },

  updateStep: (stepId: string, partial: Partial<ExecutionStep>) => {
    set((state) => {
      if (!state.currentRun) return state;
      const updatedSteps = state.currentRun.steps.map((step) =>
        step.id === stepId ? { ...step, ...partial } : step
      );
      return {
        currentRun: {
          ...state.currentRun,
          steps: updatedSteps,
        },
      };
    });
  },

  recordStepOutput: (nodeId, output, status, durationMs, error, tokens) => {
    const timestamp = new Date().toISOString();
    set((state) => {
      const nextOutputs: NodeOutputMap = {
        ...state.nodeOutputs,
        [nodeId]: {
          output,
          status,
          timestamp,
        },
      };

      if (!state.currentRun) {
        return { nodeOutputs: nextOutputs };
      }

      const existingStepIndex = state.currentRun.steps.findIndex((s) => s.nodeId === nodeId);
      let updatedSteps = [...state.currentRun.steps];

      const stepPayload: Partial<ExecutionStep> = {
        status,
        finishedAt: timestamp,
        durationMs,
        outputPayload: output,
        error,
        tokensUsed: tokens,
      };

      if (existingStepIndex >= 0) {
        updatedSteps[existingStepIndex] = {
          ...updatedSteps[existingStepIndex],
          ...stepPayload,
        };
      }

      const totalTokens = updatedSteps.reduce(
        (acc, step) => acc + (step.tokensUsed?.totalTokens || 0),
        0
      );

      return {
        nodeOutputs: nextOutputs,
        currentRun: {
          ...state.currentRun,
          steps: updatedSteps,
          totalTokens,
        },
      };
    });
  },

  addLog: (stepId: string, message: string) => {
    const timestampedMessage = `[${new Date().toLocaleTimeString()}] ${message}`;
    set((state) => {
      if (!state.currentRun) return state;
      const updatedSteps = state.currentRun.steps.map((step) =>
        step.id === stepId
          ? { ...step, logs: [...(step.logs || []), timestampedMessage] }
          : step
      );
      return {
        currentRun: {
          ...state.currentRun,
          steps: updatedSteps,
        },
      };
    });
  },

  finishRun: (status, error) => {
    const now = new Date();
    set((state) => {
      if (!state.currentRun) return state;
      const startTime = new Date(state.currentRun.startedAt).getTime();
      const totalDurationMs = now.getTime() - startTime;

      return {
        currentRun: {
          ...state.currentRun,
          status,
          finishedAt: now.toISOString(),
          totalDurationMs,
          error,
        },
        activeNodeId: null,
      };
    });
  },

  setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
  setActiveNodeId: (nodeId: string | null) => set({ activeNodeId: nodeId }),
  resetRun: () => set({ currentRun: null, nodeOutputs: {}, activeNodeId: null }),
}));
