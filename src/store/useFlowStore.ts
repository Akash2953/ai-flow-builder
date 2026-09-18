import { create } from "zustand";
import {
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { AppEdge, AppNode, BaseNodeData, NodeExecutionStatus, NodeType, WorkflowExport } from "../types/flow";
import {
  ConditionNodeData,
  HttpRequestNodeData,
  LLMNodeData,
  OutputNodeData,
  TransformNodeData,
  TriggerNodeData,
} from "../types/nodes";

const STORAGE_KEY = "ai_flow_builder_active_workflow";

export const createDefaultNodeData = (type: NodeType): BaseNodeData => {
  switch (type) {
    case "trigger": {
      const data: TriggerNodeData = {
        label: "Manual Trigger",
        type: "trigger",
        triggerType: "manual",
        inputPrompt: "Analyze the user feedback and extract sentiment, key topics, and action items.",
        description: "Entry point for workflow input",
        status: "idle",
      };
      return data;
    }
    case "llm": {
      const data: LLMNodeData = {
        label: "AI Reasoning Agent",
        type: "llm",
        provider: "mock",
        model: "gpt-4o",
        systemPrompt: "You are an expert AI assistant that provides structured, analytical answers.",
        userPromptTemplate: "Please process the following input:\n\n{{trigger.output}}",
        temperature: 0.7,
        maxTokens: 1024,
        jsonMode: false,
        status: "idle",
      };
      return data;
    }
    case "condition": {
      const data: ConditionNodeData = {
        label: "Condition (IF / ELSE)",
        type: "condition",
        logicOperator: "AND",
        rules: [
          {
            id: "rule_1",
            field: "output",
            operator: "contains",
            value: "urgent",
          },
        ],
        description: "Branch execution based on rules",
        status: "idle",
      };
      return data;
    }
    case "transform": {
      const data: TransformNodeData = {
        label: "JavaScript Transform",
        type: "transform",
        transformType: "javascript",
        code: `// input: data received from previous node
// context: map of all executed node outputs
function transform(input, context) {
  return {
    processed: true,
    timestamp: new Date().toISOString(),
    raw: input,
    length: typeof input === 'string' ? input.length : JSON.stringify(input).length
  };
}`,
        description: "Custom JS data formatting sandbox",
        status: "idle",
      };
      return data;
    }
    case "httpRequest": {
      const data: HttpRequestNodeData = {
        label: "HTTP Webhook / API",
        type: "httpRequest",
        method: "POST",
        url: "https://httpbin.org/post",
        headers: [{ key: "Content-Type", value: "application/json" }],
        bodyType: "json",
        bodyPayload: `{\n  "source": "AI-Flow-Builder",\n  "data": {{previous.output}}\n}`,
        description: "Send or fetch data from external APIs",
        status: "idle",
      };
      return data;
    }
    case "output": {
      const data: OutputNodeData = {
        label: "Result Viewer",
        type: "output",
        displayFormat: "markdown",
        title: "Workflow Result Summary",
        description: "Display final markdown, JSON or table",
        status: "idle",
      };
      return data;
    }
    default:
      return {
        label: "Custom Node",
        type,
        status: "idle",
      };
  }
};

const initialDefaultNodes: AppNode[] = [
  {
    id: "node_trigger_1",
    type: "trigger",
    position: { x: 80, y: 180 },
    data: createDefaultNodeData("trigger"),
  },
  {
    id: "node_llm_1",
    type: "llm",
    position: { x: 420, y: 150 },
    data: {
      ...createDefaultNodeData("llm"),
      label: "Claude Synthesizer",
      userPromptTemplate: "Summarize and structure the following text into actionable bullet points:\n\n{{node_trigger_1.output}}",
    },
  },
  {
    id: "node_output_1",
    type: "output",
    position: { x: 800, y: 180 },
    data: {
      ...createDefaultNodeData("output"),
      title: "Final Actionable Summary",
    },
  },
];

const initialDefaultEdges: AppEdge[] = [
  {
    id: "edge_trigger_to_llm",
    source: "node_trigger_1",
    target: "node_llm_1",
    animated: true,
  },
  {
    id: "edge_llm_to_output",
    source: "node_llm_1",
    target: "node_output_1",
    animated: true,
  },
];

interface FlowState {
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
  nodes: AppNode[];
  edges: AppEdge[];
  selectedNodeId: string | null;

  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  setSelectedNodeId: (id: string | null) => void;
  setWorkflowMeta: (name: string, description?: string) => void;

  addNode: (type: NodeType, position?: { x: number; y: number }) => string;
  updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;

  updateNodeStatus: (
    id: string,
    status: NodeExecutionStatus,
    errorMsg?: string,
    outputSummary?: string,
    executionTimeMs?: number
  ) => void;
  resetAllNodeStatuses: () => void;

  loadWorkflow: (workflow: WorkflowExport) => void;
  exportWorkflow: () => WorkflowExport;
  clearCanvas: () => void;
}

const loadSavedWorkflow = (): {
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
  nodes: AppNode[];
  edges: AppEdge[];
} => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: WorkflowExport = JSON.parse(raw);
      if (parsed.nodes && parsed.edges) {
        return {
          workflowId: parsed.id || `wf_${Date.now()}`,
          workflowName: parsed.name || "Customer Support AI Triage",
          workflowDescription: parsed.description || "Automated multi-agent processing pipeline",
          nodes: parsed.nodes,
          edges: parsed.edges,
        };
      }
    }
  } catch (e) {
    console.error("Failed to load workflow from localStorage", e);
  }

  return {
    workflowId: "wf_default",
    workflowName: "Customer Support AI Triage",
    workflowDescription: "Automated multi-agent processing pipeline",
    nodes: initialDefaultNodes,
    edges: initialDefaultEdges,
  };
};

export const useFlowStore = create<FlowState>((set, get) => {
  const initial = loadSavedWorkflow();

  const persistToStorage = () => {
    const state = get();
    const payload: WorkflowExport = {
      id: state.workflowId,
      name: state.workflowName,
      description: state.workflowDescription,
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      nodes: state.nodes,
      edges: state.edges,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Autosave failed", e);
    }
  };

  return {
    workflowId: initial.workflowId,
    workflowName: initial.workflowName,
    workflowDescription: initial.workflowDescription,
    nodes: initial.nodes,
    edges: initial.edges,
    selectedNodeId: null,

    onNodesChange: (changes) => {
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes),
      }));
      persistToStorage();
    },

    onEdgesChange: (changes) => {
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
      }));
      persistToStorage();
    },

    onConnect: (connection) => {
      set((state) => ({
        edges: addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#38bdf8", strokeWidth: 2 },
          },
          state.edges
        ),
      }));
      persistToStorage();
    },

    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    setWorkflowMeta: (name, description) => {
      set((state) => ({
        workflowName: name,
        workflowDescription: description ?? state.workflowDescription,
      }));
      persistToStorage();
    },

    addNode: (type, position) => {
      const id = `node_${type}_${Date.now().toString(36)}`;
      const fallbackPos = {
        x: 200 + (get().nodes.length % 5) * 40,
        y: 150 + (get().nodes.length % 5) * 40,
      };

      const newNode: AppNode = {
        id,
        type,
        position: position || fallbackPos,
        data: createDefaultNodeData(type),
      };

      set((state) => ({
        nodes: [...state.nodes, newNode],
        selectedNodeId: id,
      }));
      persistToStorage();
      return id;
    },

    updateNodeData: (id, partialData) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...partialData,
              },
            };
          }
          return node;
        }),
      }));
      persistToStorage();
    },

    deleteNode: (id) => {
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      }));
      persistToStorage();
    },

    duplicateNode: (id) => {
      const nodeToDup = get().nodes.find((n) => n.id === id);
      if (!nodeToDup) return;

      const newId = `node_${nodeToDup.type}_${Date.now().toString(36)}`;
      const duplicatedNode: AppNode = {
        ...nodeToDup,
        id: newId,
        position: {
          x: nodeToDup.position.x + 30,
          y: nodeToDup.position.y + 30,
        },
        data: {
          ...JSON.parse(JSON.stringify(nodeToDup.data)),
          label: `${nodeToDup.data.label} (Copy)`,
          status: "idle",
        },
      };

      set((state) => ({
        nodes: [...state.nodes, duplicatedNode],
        selectedNodeId: newId,
      }));
      persistToStorage();
    },

    updateNodeStatus: (id, status, errorMsg, outputSummary, executionTimeMs) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                status,
                errorMessage: errorMsg,
                outputSummary,
                executionTimeMs,
              },
            };
          }
          return node;
        }),
      }));
    },

    resetAllNodeStatuses: () => {
      set((state) => ({
        nodes: state.nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            status: "idle",
            errorMessage: undefined,
            outputSummary: undefined,
            executionTimeMs: undefined,
          },
        })),
      }));
    },

    loadWorkflow: (workflow) => {
      set({
        workflowId: workflow.id,
        workflowName: workflow.name,
        workflowDescription: workflow.description,
        nodes: workflow.nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            status: "idle",
          },
        })),
        edges: workflow.edges,
        selectedNodeId: null,
      });
      persistToStorage();
    },

    exportWorkflow: () => {
      const state = get();
      return {
        id: state.workflowId,
        name: state.workflowName,
        description: state.workflowDescription,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        nodes: state.nodes,
        edges: state.edges,
      };
    },

    clearCanvas: () => {
      set({
        nodes: [],
        edges: [],
        selectedNodeId: null,
      });
      persistToStorage();
    },
  };
});
