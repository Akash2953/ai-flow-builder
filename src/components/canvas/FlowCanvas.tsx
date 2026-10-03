// FlowCanvas: Interactive DAG canvas with custom HUD controls, backdrop grid, and minimap
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (nodes, edges, node selection, drag & drop), useSettingsStore (theme)
// Data Schema: React Flow nodes, edges, viewports
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useCallback, useRef, useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Panel,
  useReactFlow,
  useViewport,
  Node,
  BackgroundVariant,
  ConnectionLineType,
  Connection,
  Edge,
} from "@xyflow/react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Map as MapIcon,
  Lock,
  Unlock,
  Plus,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Compass,
  GitBranch,
  Braces,
  Globe,
  Terminal,
  Copy,
  Trash2,
  Sliders,
  ArrowRightLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { nodeTypes } from "../nodes/nodeTypes";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { NodeType, AppEdge } from "../../types/flow";

interface CanvasMenuItem {
  type: NodeType;
  title: string;
  category: "Triggers" | "AI Agents" | "Logic & Branching" | "Data Transforms" | "Integrations" | "Output Viewers";
  badge: string;
  description: string;
  icon: React.ReactNode;
  lightIconStyle: {
    bg: string;
    border: string;
    text: string;
  };
  darkIconStyle: {
    bg: string;
    border: string;
    text: string;
  };
  lightBadgeStyle: string;
  darkBadgeStyle: string;
}

const CANVAS_NODE_ITEMS: CanvasMenuItem[] = [
  {
    type: "trigger",
    title: "Manual Trigger",
    category: "Triggers",
    badge: "Entrypoint",
    description: "Start workflow with custom payload",
    icon: <Zap className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-700",
    },
    darkIconStyle: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/25",
      text: "text-amber-400",
    },
    lightBadgeStyle: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    darkBadgeStyle: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  {
    type: "llm",
    title: "LLM Agent",
    category: "AI Agents",
    badge: "Multi-Model",
    description: "Reasoning with Claude, GPT-4o, Gemini",
    icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-700",
    },
    darkIconStyle: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/25",
      text: "text-sky-400",
    },
    lightBadgeStyle: "bg-sky-500/10 text-sky-800 border-sky-500/20",
    darkBadgeStyle: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  },
  {
    type: "condition",
    title: "Condition",
    category: "Logic & Branching",
    badge: "IF / ELSE",
    description: "Branch execution based on rules",
    icon: <GitBranch className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-700",
    },
    darkIconStyle: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/25",
      text: "text-purple-400",
    },
    lightBadgeStyle: "bg-purple-500/10 text-purple-800 border-purple-500/20",
    darkBadgeStyle: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  {
    type: "transform",
    title: "JS Transform",
    category: "Data Transforms",
    badge: "Sandbox",
    description: "Map, filter, and compute state with JS",
    icon: <Braces className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-700",
    },
    darkIconStyle: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
      text: "text-emerald-400",
    },
    lightBadgeStyle: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
    darkBadgeStyle: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  {
    type: "httpRequest",
    title: "HTTP Request",
    category: "Integrations",
    badge: "Webhook",
    description: "Make REST API calls and webhooks",
    icon: <Globe className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-700",
    },
    darkIconStyle: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/25",
      text: "text-cyan-400",
    },
    lightBadgeStyle: "bg-cyan-500/10 text-cyan-800 border-cyan-500/20",
    darkBadgeStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  {
    type: "output",
    title: "Output Terminal",
    category: "Output Viewers",
    badge: "Viewer",
    description: "Inspect final response, JSON & tables",
    icon: <Terminal className="w-3.5 h-3.5" strokeWidth={2.2} />,
    lightIconStyle: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-700",
    },
    darkIconStyle: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/25",
      text: "text-rose-400",
    },
    lightBadgeStyle: "bg-rose-500/10 text-rose-800 border-rose-500/20",
    darkBadgeStyle: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  },
];

const CANVAS_CATEGORIES = [
  "Triggers",
  "AI Agents",
  "Logic & Branching",
  "Data Transforms",
  "Integrations",
  "Output Viewers",
] as const;

// Custom Floating HUD Controls Bar
const CanvasHUD: React.FC<{
  gridVariant: BackgroundVariant | null;
  onCycleGrid: () => void;
  isMiniMapOpen: boolean;
  onToggleMiniMap: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  nodeCount: number;
  edgeCount: number;
}> = ({
  gridVariant,
  onCycleGrid,
  isMiniMapOpen,
  onToggleMiniMap,
  isLocked,
  onToggleLock,
  nodeCount,
  edgeCount,
}) => {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const zoomPercentage = Math.round(zoom * 100);

  const getGridLabel = () => {
    if (gridVariant === BackgroundVariant.Dots) return "Dots";
    if (gridVariant === BackgroundVariant.Lines) return "Lines";
    if (gridVariant === BackgroundVariant.Cross) return "Cross";
    return "Off";
  };

  return (
    <Panel position="bottom-center" className="!mb-3 sm:!mb-14 max-w-[calc(100vw-16px)]">
      <div
        className={`flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl backdrop-blur-md border select-none transition-all max-w-[calc(100vw-24px)] overflow-x-auto custom-scrollbar ${
          isLight
            ? "bg-[#FAF8F5]/90 border-[#E7E2D8] shadow-[0_8px_32px_rgba(180,165,145,0.3)] text-[#443E3A]"
            : "bg-[#0c1220]/90 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-slate-300"
        }`}
      >
        {/* Zoom Controls */}
        <div
          className={`flex items-center gap-0.5 rounded-xl p-0.5 border shrink-0 ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8]"
              : "bg-slate-900/80 border-slate-800/60"
          }`}
        >
          <button
            type="button"
            onClick={() => zoomOut({ duration: 200 })}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
            className={`p-1 sm:p-1.5 rounded-lg active:scale-95 transition-all ${
              isLight
                ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => zoomTo(1, { duration: 200 })}
            title="Reset Zoom to 100%"
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-medium rounded-md transition-colors min-w-[38px] sm:min-w-[44px] text-center ${
              isLight
                ? "text-[#2C2724] hover:text-amber-600 hover:bg-[#EBE6DD]"
                : "text-slate-300 hover:text-sky-400 hover:bg-slate-800"
            }`}
          >
            {zoomPercentage}%
          </button>

          <button
            type="button"
            onClick={() => zoomIn({ duration: 200 })}
            title="Zoom In (+)"
            aria-label="Zoom In"
            className={`p-1 sm:p-1.5 rounded-lg active:scale-95 transition-all ${
              isLight
                ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD]"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Separator */}
        <div
          className={`w-[1px] h-4 mx-0.5 shrink-0 ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800"
          }`}
        />

        {/* Fit View Button */}
        <button
          type="button"
          onClick={() => fitView({ padding: 0.25, duration: 250 })}
          title="Fit View to Screen"
          aria-label="Fit View to Screen"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all shrink-0 ${
            isLight
              ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-[#EBE6DD] border-transparent hover:border-[#D9D1C5]"
              : "text-slate-300 hover:text-white hover:bg-slate-800/90 border-transparent hover:border-slate-700/60"
          }`}
        >
          <Maximize2
            className={`w-3.5 h-3.5 ${
              isLight ? "text-amber-600" : "text-sky-400"
            }`}
          />
          <span className="hidden sm:inline">Fit View</span>
        </button>

        {/* Grid Style Toggle */}
        <button
          type="button"
          onClick={onCycleGrid}
          title={`Grid: ${getGridLabel()} (Click to cycle)`}
          aria-label={`Grid: ${getGridLabel()}`}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all shrink-0 ${
            isLight
              ? "text-[#443E3A] hover:text-[#2C2724] hover:bg-[#EBE6DD] border-transparent hover:border-[#D9D1C5]"
              : "text-slate-300 hover:text-white hover:bg-slate-800/90 border-transparent hover:border-slate-700/60"
          }`}
        >
          <Grid
            className={`w-3.5 h-3.5 ${
              isLight ? "text-emerald-700" : "text-emerald-400"
            }`}
          />
          <span
            className={`font-mono text-[11px] hidden sm:inline ${
              isLight ? "text-[#7A7269]" : "text-slate-400"
            }`}
          >
            {getGridLabel()}
          </span>
        </button>

        {/* MiniMap Toggle */}
        <button
          type="button"
          onClick={onToggleMiniMap}
          title={isMiniMapOpen ? "Hide MiniMap" : "Show MiniMap"}
          aria-label="Toggle MiniMap"
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all shrink-0 ${
            isMiniMapOpen
              ? isLight
                ? "bg-amber-500/10 text-amber-800 border-amber-500/30 shadow-sm"
                : "bg-sky-500/10 text-sky-400 border-sky-500/30"
              : isLight
              ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD] border-transparent hover:border-[#D9D1C5]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border-transparent hover:border-slate-700/60"
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Map</span>
        </button>

        {/* Lock Canvas Toggle */}
        <button
          type="button"
          onClick={onToggleLock}
          title={isLocked ? "Unlock Canvas Dragging" : "Lock Canvas (View Only)"}
          aria-label={isLocked ? "Unlock Canvas" : "Lock Canvas"}
          className={`p-1 sm:p-1.5 rounded-xl text-xs active:scale-95 border transition-all shrink-0 ${
            isLocked
              ? isLight
                ? "bg-amber-500/10 text-amber-800 border-amber-500/30 shadow-sm"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : isLight
              ? "text-[#7A7269] hover:text-[#2C2724] hover:bg-[#EBE6DD] border-transparent hover:border-[#D9D1C5]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border-transparent hover:border-slate-700/60"
          }`}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Separator */}
        <div
          className={`w-[1px] h-4 mx-0.5 shrink-0 hidden sm:block ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800"
          }`}
        />

        {/* Stats Pill - compact / hidden on extra small */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono rounded-xl border shrink-0 ${
            isLight
              ? "text-[#7A7269] bg-[#F5F2EB] border-[#E7E2D8]"
              : "text-slate-400 bg-slate-900/60 border-slate-800/60"
          }`}
        >
          <span
            className={`font-medium ${
              isLight ? "text-[#2C2724]" : "text-slate-200"
            }`}
          >
            {nodeCount}
          </span>
          <span className={isLight ? "text-[#7A7269]" : "text-slate-600"}>
            nodes
          </span>
          <span className={isLight ? "text-[#B8B09D]" : "text-slate-700"}>
            •
          </span>
          <span
            className={`font-medium ${
              isLight ? "text-[#2C2724]" : "text-slate-200"
            }`}
          >
            {edgeCount}
          </span>
          <span className={isLight ? "text-[#7A7269]" : "text-slate-600"}>
            edges
          </span>
        </div>
      </div>
    </Panel>
  );
};

export const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const theme = useSettingsStore((state) => state.theme);
  const isLight = theme === "light";

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const onReconnectEdge = useFlowStore((state) => state.reconnectEdge);
  const deleteEdge = useFlowStore((state) => state.deleteEdge);
  const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
  const addNode = useFlowStore((state) => state.addNode);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const changeNodeType = useFlowStore((state) => state.changeNodeType);
  const duplicateNode = useFlowStore((state) => state.duplicateNode);
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    type: "pane" | "node";
    x: number;
    y: number;
    flowPosition?: { x: number; y: number };
    nodeId?: string;
    nodeType?: NodeType;
    nodeLabel?: string;
  } | null>(null);
  const [isChangeTypeSubmenuOpen, setIsChangeTypeSubmenuOpen] = useState(false);

  // Reconnection and Detaching State Tracking
  const edgeReconnectSuccessful = useRef(true);

  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const handleReconnect = useCallback(
    (oldEdge: any, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      onReconnectEdge(oldEdge as AppEdge, newConnection);
    },
    [onReconnectEdge]
  );

  const handleReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: any) => {
      if (!edgeReconnectSuccessful.current) {
        deleteEdge(edge.id);
      }
      edgeReconnectSuccessful.current = true;
    },
    [deleteEdge]
  );

  // Canvas View & Grid States
  const [gridVariant, setGridVariant] = useState<BackgroundVariant | null>(BackgroundVariant.Dots);
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 768 : true));
  const [isLocked, setIsLocked] = useState(false);

  // Touch long-press handling for mobile context menu
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) {
        if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
        return;
      }
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
      touchTimerRef.current = setTimeout(() => {
        const flowPos = screenToFlowPosition({
          x: touch.clientX,
          y: touch.clientY,
        });
        setIsChangeTypeSubmenuOpen(false);
        setContextMenu({
          type: "pane",
          x: touch.clientX,
          y: touch.clientY,
          flowPosition: flowPos,
        });
      }, 550);
    },
    [screenToFlowPosition]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    if (dx > 12 || dy > 12) {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchStartPosRef.current = null;
  }, []);

  const cycleGrid = useCallback(() => {
    setGridVariant((prev) => {
      if (prev === BackgroundVariant.Dots) return BackgroundVariant.Lines;
      if (prev === BackgroundVariant.Lines) return BackgroundVariant.Cross;
      if (prev === BackgroundVariant.Cross) return null;
      return BackgroundVariant.Dots;
    });
  }, []);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      setContextMenu(null);
      setIsChangeTypeSubmenuOpen(false);
    },
    [setSelectedNodeId]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setContextMenu(null);
    setIsChangeTypeSubmenuOpen(false);
  }, [setSelectedNodeId]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
    setIsChangeTypeSubmenuOpen(false);
  }, []);

  useEffect(() => {
    if (!contextMenu) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#flow-canvas-context-menu")) {
        closeContextMenu();
      }
    };

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeContextMenu();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [contextMenu, closeContextMenu]);

  const handlePaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      const flowPos = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setIsChangeTypeSubmenuOpen(false);
      setContextMenu({
        type: "pane",
        x: event.clientX,
        y: event.clientY,
        flowPosition: flowPos,
      });
    },
    [screenToFlowPosition]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setSelectedNodeId(node.id);
      setIsChangeTypeSubmenuOpen(false);
      setContextMenu({
        type: "node",
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        nodeType: node.type as NodeType,
        nodeLabel: (node.data as any)?.label || "Node",
      });
    },
    [setSelectedNodeId]
  );

  const handleAddNodeAtContext = useCallback(
    (type: NodeType) => {
      if (contextMenu?.flowPosition) {
        addNode(type, contextMenu.flowPosition);
      } else {
        addNode(type);
      }
      closeContextMenu();
    },
    [contextMenu, addNode, closeContextMenu]
  );

  const menuPosition = useMemo(() => {
    if (!contextMenu || !reactFlowWrapper.current) return { x: 0, y: 0 };
    const rect = reactFlowWrapper.current.getBoundingClientRect();
    const rawX = contextMenu.x - rect.left;
    const rawY = contextMenu.y - rect.top;
    const width = contextMenu.type === "pane" ? Math.min(280, rect.width - 24) : Math.min(220, rect.width - 24);
    const height = contextMenu.type === "pane" ? Math.min(380, rect.height - 24) : Math.min(240, rect.height - 24);
    const x = Math.max(8, Math.min(rawX, rect.width - width - 8));
    const y = Math.max(8, Math.min(rawY, rect.height - height - 8));
    return { x, y };
  }, [contextMenu]);

  const isSubmenuLeft = useMemo(() => {
    if (!reactFlowWrapper.current) return false;
    const rect = reactFlowWrapper.current.getBoundingClientRect();
    return menuPosition.x + 220 + 240 > rect.width;
  }, [menuPosition]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
        // Also delete any selected edges
        const selectedEdges = edges.filter((e) => e.selected);
        if (selectedEdges.length > 0) {
          selectedEdges.forEach((e) => deleteEdge(e.id));
        }
      }
      if (event.key === "Escape") {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, deleteNode, setSelectedNodeId, edges, deleteEdge]
  );

  // Refined MiniMap node coloring matching palette
  const getNodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case "trigger":
        return "#f59e0b"; // amber
      case "llm":
        return "#38bdf8"; // sky
      case "condition":
        return "#c084fc"; // purple
      case "transform":
        return "#34d399"; // emerald
      case "httpRequest":
        return "#22d3ee"; // cyan
      case "output":
        return "#f43f5e"; // rose
      default:
        return "#64748b"; // slate
    }
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className={`w-full h-full relative outline-none select-none overflow-hidden transition-colors ${
        isLight ? "bg-[#F5F2EB]" : "bg-[#080c14]"
      }`}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        onNodeContextMenu={handleNodeContextMenu}
        onMoveStart={closeContextMenu}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.15}
        maxZoom={2.5}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        edgesReconnectable={!isLocked}
        edgesFocusable={!isLocked}
        reconnectRadius={20}
        onReconnectStart={handleReconnectStart}
        onReconnect={handleReconnect}
        onReconnectEnd={handleReconnectEnd}
        deleteKeyCode={["Backspace", "Delete"]}
        onEdgesDelete={(deletedEdges) => {
          deletedEdges.forEach((e) => deleteEdge(e.id));
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: isLight ? "#D97706" : "#38bdf8",
          strokeWidth: 2,
          strokeDasharray: "5 5",
        }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: {
            stroke: isLight ? "#C8BEB2" : "#334155",
            strokeWidth: 2,
          },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Background Grid Pattern */}
        {gridVariant !== null && (
          <Background
            variant={gridVariant}
            color={isLight ? "#C8BEB2" : "#1e293b"}
            gap={24}
            size={1.2}
            className={isLight ? "opacity-60" : "opacity-70"}
          />
        )}

        {/* Custom Floating Bottom HUD Controls */}
        <CanvasHUD
          gridVariant={gridVariant}
          onCycleGrid={cycleGrid}
          isMiniMapOpen={isMiniMapOpen}
          onToggleMiniMap={() => setIsMiniMapOpen((prev) => !prev)}
          isLocked={isLocked}
          onToggleLock={() => setIsLocked((prev) => !prev)}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />

        {/* Sleek MiniMap Panel */}
        {isMiniMapOpen && (
          <Panel position="bottom-right" className="!mb-14 !mr-2 sm:!mr-4">
            <div
              className={`rounded-2xl backdrop-blur-md border overflow-hidden transition-all duration-200 ${
                isLight
                  ? "bg-[#FAF8F5]/95 border-[#E7E2D8] shadow-[0_12px_40px_rgba(180,165,145,0.3)]"
                  : "bg-[#080d18]/95 border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              }`}
            >
              {/* MiniMap Header Bar */}
              <div
                className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 border-b text-[9px] sm:text-[10px] font-mono ${
                  isLight
                    ? "border-[#E7E2D8] bg-[#F5F2EB]/90 text-[#7A7269]"
                    : "border-slate-800/70 bg-slate-900/40 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Compass
                    className={`w-3 h-3 ${
                      isLight ? "text-amber-600" : "text-sky-400"
                    }`}
                  />
                  <span
                    className={`font-semibold uppercase tracking-wider ${
                      isLight ? "text-[#2C2724]" : "text-slate-300"
                    }`}
                  >
                    Overview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMiniMapOpen(false)}
                  className={`p-1 rounded transition-colors ${
                    isLight
                      ? "text-[#7A7269] hover:text-[#2C2724]"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title="Close MiniMap"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* MiniMap Canvas View */}
              <MiniMap
                nodeColor={getNodeColor}
                nodeStrokeWidth={2}
                nodeStrokeColor={isLight ? "#FAF8F5" : "#080c14"}
                nodeBorderRadius={4}
                zoomable
                pannable
                className="!relative !m-0 !bg-transparent !border-0 !w-[130px] !h-[90px] sm:!w-[180px] sm:!h-[120px]"
                maskColor={
                  isLight
                    ? "rgba(245, 242, 235, 0.8)"
                    : "rgba(8, 12, 20, 0.75)"
                }
                maskStrokeColor={isLight ? "#C8BEB2" : "#1e293b"}
                maskStrokeWidth={1}
              />
            </div>
          </Panel>
        )}

        {/* Empty Canvas Quick Guide Overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
            <div
              className={`text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-md border shadow-2xl max-w-xs sm:max-w-sm w-full pointer-events-auto space-y-3 sm:space-y-4 ${
                isLight
                  ? "bg-[#FAF8F5]/90 border-[#E7E2D8] shadow-[0_12px_36px_rgba(180,165,145,0.25)]"
                  : "bg-[#0c1220]/80 border-slate-800/80 shadow-2xl"
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mx-auto border ${
                  isLight
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                    : "bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                }`}
              >
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-1">
                <h3
                  className={`text-sm font-semibold ${
                    isLight ? "text-[#2C2724]" : "text-slate-100"
                  }`}
                >
                  Canvas is empty
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? "text-[#7A7269]" : "text-slate-400"
                  }`}
                >
                  Drag nodes from the left sidebar or start with an entry trigger.
                </p>
              </div>
              <button
                type="button"
                onClick={() => addNode("trigger", { x: 300, y: 200 })}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs shadow-lg transition-all active:scale-95 min-h-[40px] w-full sm:w-auto ${
                  isLight
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                    : "bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20"
                }`}
              >
                <Zap
                  className={`w-3.5 h-3.5 ${
                    isLight ? "fill-white" : "fill-slate-950"
                  }`}
                />
                <span>Add Manual Trigger</span>
              </button>
            </div>
          </div>
        )}
      </ReactFlow>

      {/* Floating Canvas / Node Context Menu */}
      {contextMenu && (
        <div
          id="flow-canvas-context-menu"
          className={`absolute z-50 rounded-2xl backdrop-blur-md border shadow-2xl transition-all duration-150 animate-in fade-in zoom-in-95 max-w-[calc(100vw-24px)] ${
            contextMenu.type === "pane" ? "w-[280px]" : "w-[220px]"
          } ${
            isLight
              ? "bg-[#FAF8F5]/98 border-[#E7E2D8] shadow-[0_16px_40px_rgba(180,165,145,0.4)] ring-1 ring-black/5"
              : "bg-[#0c1220]/98 border-slate-800/90 shadow-[0_16px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
          }`}
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* -------------------------------------------------------------
              PANE CONTEXT MENU: ADD NODE TO CANVAS
              ------------------------------------------------------------- */}
          {contextMenu.type === "pane" ? (
            <div className="flex flex-col overflow-hidden rounded-2xl">
              {/* Header */}
              <div
                className={`px-3 py-2 border-b flex items-center justify-between text-xs font-medium ${
                  isLight
                    ? "bg-[#F5F2EB]/90 border-[#E7E2D8] text-[#2C2724]"
                    : "bg-slate-900/80 border-slate-800/80 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold tracking-tight">Add Node</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    isLight
                      ? "text-[#7A7269] bg-[#FAF8F5] border-[#E7E2D8]"
                      : "text-slate-400 bg-slate-900/60 border-slate-800/60"
                  }`}
                >
                  ESC to close
                </span>
              </div>

              {/* Node List Grouped by Category */}
              <div className="p-1.5 space-y-1.5 max-h-[340px] overflow-y-auto custom-scrollbar">
                {CANVAS_CATEGORIES.map((category) => {
                  const items = CANVAS_NODE_ITEMS.filter((i) => i.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="space-y-0.5">
                      <div
                        className={`px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider ${
                          isLight ? "text-[#8E8275]" : "text-slate-500"
                        }`}
                      >
                        {category}
                      </div>
                      {items.map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleAddNodeAtContext(item.type)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all group/item ${
                            isLight
                              ? "hover:bg-[#F5F2EB] text-[#443E3A] hover:text-[#2C2724]"
                              : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-105 ${
                                isLight
                                  ? `${item.lightIconStyle.bg} ${item.lightIconStyle.border} ${item.lightIconStyle.text}`
                                  : `${item.darkIconStyle.bg} ${item.darkIconStyle.border} ${item.darkIconStyle.text}`
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium truncate leading-tight">
                                {item.title}
                              </div>
                              <div
                                className={`text-[10px] truncate leading-tight mt-0.5 ${
                                  isLight ? "text-[#7A7269]" : "text-slate-500"
                                }`}
                              >
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ml-1.5 ${
                              isLight ? item.lightBadgeStyle : item.darkBadgeStyle
                            }`}
                          >
                            {item.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* -------------------------------------------------------------
                NODE CONTEXT MENU: CHANGE TYPE / DUP / DELETE / INSPECT
                ------------------------------------------------------------- */
            <div className="flex flex-col overflow-visible rounded-2xl p-1.5 space-y-0.5">
              {/* Header with Node Label */}
              <div
                className={`px-2.5 py-1.5 rounded-xl border mb-1 flex items-center justify-between text-xs font-medium ${
                  isLight
                    ? "bg-[#F5F2EB]/90 border-[#E7E2D8] text-[#2C2724]"
                    : "bg-slate-900/80 border-slate-800/80 text-slate-200"
                }`}
              >
                <span className="truncate max-w-[130px] font-semibold">
                  {contextMenu.nodeLabel || "Node"}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                    isLight
                      ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                      : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                  }`}
                >
                  {contextMenu.nodeType}
                </span>
              </div>

              {/* Inspect Properties */}
              <button
                type="button"
                onClick={() => {
                  if (contextMenu.nodeId) {
                    setSelectedNodeId(contextMenu.nodeId);
                  }
                  closeContextMenu();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isLight
                    ? "text-[#443E3A] hover:bg-[#F5F2EB] hover:text-[#2C2724]"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>Inspect Properties</span>
              </button>

              {/* Change Node Type with Submenu */}
              <div
                className="relative"
                onMouseEnter={() => setIsChangeTypeSubmenuOpen(true)}
                onMouseLeave={() => setIsChangeTypeSubmenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsChangeTypeSubmenuOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isChangeTypeSubmenuOpen
                      ? isLight
                        ? "bg-[#F5F2EB] text-amber-800"
                        : "bg-slate-800/90 text-sky-300"
                      : isLight
                      ? "text-[#443E3A] hover:bg-[#F5F2EB] hover:text-[#2C2724]"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>Change Node Type</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* Change Type Submenu Flyout */}
                {isChangeTypeSubmenuOpen && (
                  <div
                    className={`absolute w-60 max-w-[calc(100vw-36px)] p-1.5 rounded-2xl backdrop-blur-md border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 ${
                      isSubmenuLeft
                        ? "right-0 sm:right-full sm:mr-1.5 top-full sm:top-0 mt-1 sm:mt-0"
                        : "left-0 sm:left-full sm:ml-1.5 top-full sm:top-0 mt-1 sm:mt-0"
                    } ${
                      isLight
                        ? "bg-[#FAF8F5]/98 border-[#E7E2D8] shadow-[0_16px_40px_rgba(180,165,145,0.4)]"
                        : "bg-[#0c1220]/98 border-slate-800/90 shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
                    }`}
                  >
                    <div
                      className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider mb-1 font-semibold ${
                        isLight ? "text-[#8E8275]" : "text-slate-500"
                      }`}
                    >
                      Select New Type
                    </div>
                    <div className="space-y-0.5">
                      {CANVAS_NODE_ITEMS.map((item) => {
                        const isCurrent = item.type === contextMenu.nodeType;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            disabled={isCurrent}
                            onClick={() => {
                              if (contextMenu.nodeId && !isCurrent) {
                                changeNodeType(contextMenu.nodeId, item.type);
                                closeContextMenu();
                              }
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-xl text-left transition-all ${
                              isCurrent
                                ? isLight
                                  ? "opacity-50 cursor-default bg-amber-500/5 text-[#7A7269]"
                                  : "opacity-50 cursor-default bg-sky-500/5 text-slate-500"
                                : isLight
                                ? "hover:bg-[#F5F2EB] text-[#443E3A] hover:text-[#2C2724]"
                                : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                                  isLight
                                    ? `${item.lightIconStyle.bg} ${item.lightIconStyle.border} ${item.lightIconStyle.text}`
                                    : `${item.darkIconStyle.bg} ${item.darkIconStyle.border} ${item.darkIconStyle.text}`
                                }`}
                              >
                                {item.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-medium leading-tight truncate">
                                  {item.title}
                                </div>
                              </div>
                            </div>
                            {isCurrent ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                            ) : (
                              <span
                                className={`text-[8px] font-mono px-1 py-0.2 rounded border shrink-0 ml-1 ${
                                  isLight ? item.lightBadgeStyle : item.darkBadgeStyle
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Duplicate Node */}
              <button
                type="button"
                onClick={() => {
                  if (contextMenu.nodeId) {
                    duplicateNode(contextMenu.nodeId);
                  }
                  closeContextMenu();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isLight
                    ? "text-[#443E3A] hover:bg-[#F5F2EB] hover:text-[#2C2724]"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Copy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Duplicate Node</span>
              </button>

              <div className={`h-px my-1 ${isLight ? "bg-[#E7E2D8]" : "bg-slate-800/80"}`} />

              {/* Delete Node */}
              <button
                type="button"
                onClick={() => {
                  if (contextMenu.nodeId) {
                    deleteNode(contextMenu.nodeId);
                  }
                  closeContextMenu();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isLight
                    ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    : "text-rose-400 hover:bg-rose-500/15 hover:text-rose-300"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Delete Node</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
