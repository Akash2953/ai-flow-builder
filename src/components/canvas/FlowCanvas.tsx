// FlowCanvas: Interactive DAG canvas with custom HUD controls, backdrop grid, and minimap
// Importers/Callers: src/App.tsx
// Affected API: useFlowStore (nodes, edges, node selection, drag & drop), useSettingsStore (theme)
// Data Schema: React Flow nodes, edges, viewports
// Redesign: Taste-Skill premium developer tool aesthetics with Dual-Theme Tactile Soft-Clay Neumorphic Light & Linear Dark styling

import React, { useCallback, useRef, useState, useMemo } from "react";
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
} from "lucide-react";
import { nodeTypes } from "../nodes/nodeTypes";
import { useFlowStore } from "../../store/useFlowStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { NodeType } from "../../types/flow";

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
    <Panel position="bottom-center" className="!mb-14">
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-2xl backdrop-blur-md border select-none transition-all ${
          isLight
            ? "bg-[#FAF8F5]/90 border-[#E7E2D8] shadow-[0_8px_32px_rgba(180,165,145,0.3)] text-[#443E3A]"
            : "bg-[#0c1220]/90 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-slate-300"
        }`}
      >
        {/* Zoom Controls */}
        <div
          className={`flex items-center gap-0.5 rounded-xl p-0.5 border ${
            isLight
              ? "bg-[#F5F2EB] border-[#E7E2D8]"
              : "bg-slate-900/80 border-slate-800/60"
          }`}
        >
          <button
            type="button"
            onClick={() => zoomOut({ duration: 200 })}
            title="Zoom Out (-)"
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
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
            className={`px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-colors min-w-[44px] text-center ${
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
            className={`p-1.5 rounded-lg active:scale-95 transition-all ${
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
          className={`w-[1px] h-4 mx-0.5 ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800"
          }`}
        />

        {/* Fit View Button */}
        <button
          type="button"
          onClick={() => fitView({ padding: 0.25, duration: 250 })}
          title="Fit View to Screen"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all ${
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all ${
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
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium active:scale-95 border transition-all ${
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
          className={`p-1.5 rounded-xl text-xs active:scale-95 border transition-all ${
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
          className={`w-[1px] h-4 mx-0.5 ${
            isLight ? "bg-[#E7E2D8]" : "bg-slate-800"
          }`}
        />

        {/* Stats Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono rounded-xl border ${
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
  const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
  const addNode = useFlowStore((state) => state.addNode);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

  // Canvas View & Grid States
  const [gridVariant, setGridVariant] = useState<BackgroundVariant | null>(BackgroundVariant.Dots);
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

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
    },
    [setSelectedNodeId]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

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
      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        const target = event.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        deleteNode(selectedNodeId);
      }
      if (event.key === "Escape") {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, deleteNode, setSelectedNodeId]
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
          <Panel position="bottom-right" className="!mb-14 !mr-4">
            <div
              className={`rounded-2xl backdrop-blur-md border overflow-hidden transition-all duration-200 ${
                isLight
                  ? "bg-[#FAF8F5]/95 border-[#E7E2D8] shadow-[0_12px_40px_rgba(180,165,145,0.3)]"
                  : "bg-[#080d18]/95 border-slate-800/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              }`}
            >
              {/* MiniMap Header Bar */}
              <div
                className={`flex items-center justify-between px-3 py-2 border-b text-[10px] font-mono ${
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
                  className={`p-0.5 rounded transition-colors ${
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
                className="!relative !m-0 !bg-transparent !border-0 !w-[180px] !h-[120px]"
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className={`text-center p-8 rounded-3xl backdrop-blur-md border shadow-2xl max-w-sm pointer-events-auto space-y-4 ${
                isLight
                  ? "bg-[#FAF8F5]/90 border-[#E7E2D8] shadow-[0_12px_36px_rgba(180,165,145,0.25)]"
                  : "bg-[#0c1220]/80 border-slate-800/80 shadow-2xl"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border ${
                  isLight
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                    : "bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                }`}
              >
                <Layers className="w-6 h-6" />
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
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs shadow-lg transition-all active:scale-95 ${
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
    </div>
  );
};
