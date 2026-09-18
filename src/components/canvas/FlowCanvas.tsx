import React, { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Node,
  BackgroundVariant,
} from "@xyflow/react";
import { nodeTypes } from "../nodes/nodeTypes";
import { useFlowStore } from "../../store/useFlowStore";
import { NodeType } from "../../types/flow";

export const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const setSelectedNodeId = useFlowStore((state) => state.setSelectedNodeId);
  const addNode = useFlowStore((state) => state.addNode);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);

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
        return "#e879f9"; // fuchsia
      default:
        return "#64748b"; // slate
    }
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative bg-[#0b0f17] outline-none"
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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#38bdf8", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} color="#334155" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-slate-900/90 !border !border-slate-800 !rounded-lg !shadow-xl !p-0.5"
        />
        <MiniMap
          nodeColor={getNodeColor}
          nodeStrokeWidth={2}
          zoomable
          pannable
          className="!bg-slate-950/90 !border !border-slate-800 !rounded-lg !shadow-2xl"
          maskColor="rgba(11, 15, 23, 0.75)"
        />
      </ReactFlow>
    </div>
  );
};
