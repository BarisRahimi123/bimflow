"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DesignerToolbar } from "@/components/designer/DesignerToolbar";
import { DesignerDefaults } from "@/components/designer/DesignerDefaults";
import { DesignerPanel } from "@/components/designer/DesignerPanel";
import { DesignerEnvironment } from "@/components/designer/DesignerEnvironment";
import { DesignerWarnings } from "@/components/designer/DesignerWarnings";
import { 
  PipeSegmentNode, 
  AnchorNode, 
  EquipmentNode, 
  ElbowNode,
  SupportNode,
  TeeNode,
} from "@/components/designer/nodes";
import { PipeEdge } from "@/components/designer/edges/PipeEdge";

import type { 
  DesignerTool, 
  EnvironmentType, 
  PipeDefaults,
  PipeMaterial,
  ServiceType,
  DesignerWarning,
} from "@/lib/designer/types";

import {
  ArrowLeft,
  Save,
  Download,
  FolderOpen,
  HelpCircle,
  FileText,
  Layers,
  Package,
  LayoutGrid,
  Play,
} from "lucide-react";

// Register custom node types
const nodeTypes = {
  pipe_segment: PipeSegmentNode,
  anchor: AnchorNode,
  equipment: EquipmentNode,
  elbow: ElbowNode,
  support: SupportNode,
  tee: TeeNode,
};

// Register custom edge types
const edgeTypes = {
  pipe: PipeEdge,
};

// Calculate distance between two points
function distance(p1: XYPosition, p2: XYPosition): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Determine direction from p1 to p2
function getDirection(p1: XYPosition, p2: XYPosition): 'horizontal' | 'vertical' {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  return dx >= dy ? 'horizontal' : 'vertical';
}

// Snap to orthogonal (horizontal or vertical)
function snapToOrthogonal(start: XYPosition, end: XYPosition): XYPosition {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  
  if (dx >= dy) {
    // Horizontal - snap Y to start Y
    return { x: end.x, y: start.y };
  } else {
    // Vertical - snap X to start X
    return { x: start.x, y: end.y };
  }
}

// Calculate pipe length in feet (1 grid unit = 15px = 1 foot)
function pxToFeet(px: number): number {
  return Math.round(px / 15 * 10) / 10; // Round to 1 decimal
}

// Wrapper component to use ReactFlow hooks
function DesignerCanvas() {
  const reactFlowInstance = useReactFlow();
  
  // Canvas state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<XYPosition | null>(null);
  const [drawEnd, setDrawEnd] = useState<XYPosition | null>(null);
  const [drawStartNodeId, setDrawStartNodeId] = useState<string | null>(null);
  const [previewDirection, setPreviewDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  
  // Tool & selection state
  const [activeTool, setActiveTool] = useState<DesignerTool>("select");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Environment state
  const [environment, setEnvironment] = useState<EnvironmentType>("equipment_area");
  const [isIndoor, setIsIndoor] = useState(true);
  const [isCorrosive, setIsCorrosive] = useState(false);
  const [seismicZone, setSeismicZone] = useState(false);
  
  // Pipe defaults
  const [defaults, setDefaults] = useState<PipeDefaults>({
    material: "PP" as PipeMaterial,
    size: "2\"",
    temperature: 75,
    service: "water" as ServiceType,
    insulated: false,
  });
  
  // Warnings
  const [warnings, setWarnings] = useState<DesignerWarning[]>([]);
  
  // Active view tab
  const [activeTab, setActiveTab] = useState<"design" | "layout" | "bom" | "report">("design");
  
  // Node ID counter
  const nodeIdCounter = useRef(0);
  const genId = () => `node_${++nodeIdCounter.current}`;
  
  // Last direction for elbow detection
  const lastDirection = useRef<'horizontal' | 'vertical' | null>(null);
  
  // Get selected node
  const selectedNode = selectedNodeId 
    ? nodes.find(n => n.id === selectedNodeId) 
    : null;
  
  // Calculate if material is plastic
  const isPlastic = useMemo(() => {
    return defaults.material.includes("PVC") || 
           defaults.material === "PP" || 
           defaults.material === "PVDF" || 
           defaults.material === "CPVC";
  }, [defaults.material]);
  
  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'pipe' }, eds)),
    [setEdges]
  );
  
  // Handle node click
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (activeTool === "select") {
      setSelectedNodeId(node.id);
    } else if (activeTool === "pipe") {
      // Start drawing from this node
      setIsDrawing(true);
      setDrawStart(node.position);
      setDrawStartNodeId(node.id);
      lastDirection.current = null;
    }
  }, [activeTool]);
  
  // Handle mouse move for drawing preview
  const onMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return;
    
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    // Snap to orthogonal
    const snapped = snapToOrthogonal(drawStart, position);
    setDrawEnd(snapped);
    setPreviewDirection(getDirection(drawStart, snapped));
  }, [isDrawing, drawStart, reactFlowInstance]);
  
  // Calculate supports needed for a pipe segment
  const calculateSupports = useCallback((length: number, direction: 'horizontal' | 'vertical'): {
    positions: number[];
    type: string;
  } => {
    // Get max span based on material (simplified - in real app use full calculation)
    let maxSpan = isPlastic ? 5 : 10; // feet
    if (direction === 'vertical') {
      maxSpan = isPlastic ? 4 : 8; // Risers need more support
    }
    
    const positions: number[] = [];
    const numSupports = Math.ceil(length / maxSpan) - 1;
    
    if (numSupports > 0) {
      const spacing = length / (numSupports + 1);
      for (let i = 1; i <= numSupports; i++) {
        positions.push(spacing * i);
      }
    }
    
    return {
      positions,
      type: direction === 'vertical' ? 'riser_clamp' : 'hanger',
    };
  }, [isPlastic]);
  
  // Place pipe segment with automatic support calculation
  const placePipeSegment = useCallback((
    start: XYPosition, 
    end: XYPosition, 
    startNodeId: string | null,
    direction: 'horizontal' | 'vertical'
  ) => {
    const lengthPx = distance(start, end);
    const lengthFt = pxToFeet(lengthPx);
    
    if (lengthFt < 1) return null; // Too short
    
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Check if we need an elbow (direction changed)
    let actualStartNodeId = startNodeId;
    if (startNodeId && lastDirection.current && lastDirection.current !== direction) {
      // Need to add an elbow
      const elbowId = genId();
      newNodes.push({
        id: elbowId,
        type: 'elbow',
        position: { x: start.x - 20, y: start.y - 20 },
        data: { 
          angle: 90,
          fromDirection: lastDirection.current,
          toDirection: direction,
        },
      });
      
      // Connect previous node to elbow
      newEdges.push({
        id: `edge_${startNodeId}_${elbowId}`,
        source: startNodeId,
        target: elbowId,
        type: 'pipe',
      });
      
      actualStartNodeId = elbowId;
      
      // Add warning for plastic elbows
      if (isPlastic) {
        setWarnings(prev => [...prev, {
          id: `warn_${Date.now()}`,
          severity: "warning",
          code: "40 05 19 - 1.5.K",
          message: "Plastic elbow requires support within 18\" of centerline",
          nodeId: elbowId,
          suggestion: "Support auto-added near elbow",
        }]);
      }
    }
    
    // Create the pipe segment node
    const pipeId = genId();
    const midpoint: XYPosition = {
      x: (start.x + end.x) / 2 - 50,
      y: (start.y + end.y) / 2 - 12,
    };
    
    newNodes.push({
      id: pipeId,
      type: 'pipe_segment',
      position: midpoint,
      data: {
        length: lengthFt,
        direction,
        material: defaults.material,
        size: defaults.size,
        startPos: start,
        endPos: end,
      },
    });
    
    // Connect to start node
    if (actualStartNodeId) {
      newEdges.push({
        id: `edge_${actualStartNodeId}_${pipeId}`,
        source: actualStartNodeId,
        target: pipeId,
        type: 'pipe',
      });
    }
    
    // Calculate and add supports
    const supports = calculateSupports(lengthFt, direction);
    supports.positions.forEach((pos, idx) => {
      const supportId = genId();
      const ratio = pos / lengthFt;
      const supportPos: XYPosition = {
        x: start.x + (end.x - start.x) * ratio - 10,
        y: start.y + (end.y - start.y) * ratio - 10,
      };
      
      newNodes.push({
        id: supportId,
        type: 'support',
        position: supportPos,
        data: {
          supportType: supports.type,
          isCalculated: true,
          distanceFromStart: pos,
        },
      });
    });
    
    // Create end point node for continuing
    const endPointId = genId();
    newNodes.push({
      id: endPointId,
      type: 'anchor',
      position: { x: end.x - 20, y: end.y - 20 },
      data: { 
        label: 'Continue',
        anchorType: 'continue',
        isTemporary: true,
      },
    });
    
    newEdges.push({
      id: `edge_${pipeId}_${endPointId}`,
      source: pipeId,
      target: endPointId,
      type: 'pipe',
    });
    
    // Update last direction
    lastDirection.current = direction;
    
    setNodes(prev => [...prev, ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
    
    return endPointId;
  }, [defaults, isPlastic, calculateSupports, setNodes, setEdges]);
  
  // Handle canvas click
  const onPaneClick = useCallback((event: React.MouseEvent) => {
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    // Snap to grid
    const snapped: XYPosition = {
      x: Math.round(position.x / 15) * 15,
      y: Math.round(position.y / 15) * 15,
    };
    
    if (activeTool === "select") {
      setSelectedNodeId(null);
      return;
    }
    
    if (activeTool === "pipe") {
      if (!isDrawing) {
        // Start new pipe run - place an anchor first
        const anchorId = genId();
        setNodes(prev => [...prev, {
          id: anchorId,
          type: 'anchor',
          position: { x: snapped.x - 20, y: snapped.y - 20 },
          data: { label: 'Start', anchorType: 'fixed' },
        }]);
        
        setIsDrawing(true);
        setDrawStart(snapped);
        setDrawStartNodeId(anchorId);
        lastDirection.current = null;
      } else if (drawStart) {
        // Complete this segment
        const snappedEnd = snapToOrthogonal(drawStart, snapped);
        const direction = getDirection(drawStart, snappedEnd);
        
        const endNodeId = placePipeSegment(drawStart, snappedEnd, drawStartNodeId, direction);
        
        if (endNodeId) {
          // Continue from end point
          setDrawStart(snappedEnd);
          setDrawStartNodeId(endNodeId);
        }
        
        setDrawEnd(null);
      }
      return;
    }
    
    // Single-click placement for other tools
    if (activeTool === "anchor") {
      const id = genId();
      setNodes(prev => [...prev, {
        id,
        type: 'anchor',
        position: { x: snapped.x - 20, y: snapped.y - 20 },
        data: { label: 'Anchor', anchorType: 'fixed' },
      }]);
      setSelectedNodeId(id);
    } else if (activeTool === "equipment") {
      const id = genId();
      setNodes(prev => [...prev, {
        id,
        type: 'equipment',
        position: { x: snapped.x - 30, y: snapped.y - 30 },
        data: { label: 'Equipment', equipmentType: 'pump' },
      }]);
      setSelectedNodeId(id);
    } else if (activeTool === "tee") {
      const id = genId();
      setNodes(prev => [...prev, {
        id,
        type: 'tee',
        position: { x: snapped.x - 20, y: snapped.y - 20 },
        data: { label: 'Tee' },
      }]);
      setSelectedNodeId(id);
    }
  }, [activeTool, isDrawing, drawStart, drawStartNodeId, placePipeSegment, reactFlowInstance, setNodes]);
  
  // Update node data
  const updateNodeData = useCallback((nodeId: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setWarnings((warns) => warns.filter((w) => w.nodeId !== selectedNodeId));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawStart(null);
    setDrawEnd(null);
    setDrawStartNodeId(null);
    lastDirection.current = null;
  }, []);
  
  // Run full support calculation
  const runCalculation = useCallback(() => {
    // Find all pipe segments and recalculate supports
    const pipeNodes = nodes.filter(n => n.type === 'pipe_segment');
    const supportNodesToRemove = nodes.filter(n => n.type === 'support' && n.data?.isCalculated).map(n => n.id);
    
    // Remove old calculated supports
    setNodes(prev => prev.filter(n => !supportNodesToRemove.includes(n.id)));
    
    // Add new supports
    const newSupports: Node[] = [];
    pipeNodes.forEach(pipe => {
      const { length, direction, startPos, endPos } = pipe.data as {
        length: number;
        direction: 'horizontal' | 'vertical';
        startPos: XYPosition;
        endPos: XYPosition;
      };
      
      if (!startPos || !endPos) return;
      
      const supports = calculateSupports(length, direction);
      supports.positions.forEach((pos) => {
        const supportId = genId();
        const ratio = pos / length;
        const supportPos: XYPosition = {
          x: startPos.x + (endPos.x - startPos.x) * ratio - 10,
          y: startPos.y + (endPos.y - startPos.y) * ratio - 10,
        };
        
        newSupports.push({
          id: supportId,
          type: 'support',
          position: supportPos,
          data: {
            supportType: supports.type,
            isCalculated: true,
            distanceFromStart: pos,
          },
        });
      });
    });
    
    setNodes(prev => [...prev, ...newSupports]);
    
    setWarnings(prev => [...prev, {
      id: `calc_${Date.now()}`,
      severity: "info",
      code: "CALC",
      message: `Calculation complete: ${newSupports.length} supports placed`,
      suggestion: "Review support placement in the design",
    }]);
  }, [nodes, calculateSupports, setNodes]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
        return;
      }
      
      switch (event.key) {
        case "Escape":
          if (isDrawing) {
            cancelDrawing();
          } else {
            setSelectedNodeId(null);
            setActiveTool("select");
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedNodeId) {
            event.preventDefault();
            deleteSelectedNode();
          }
          break;
        case "v":
        case "V":
          cancelDrawing();
          setActiveTool("select");
          break;
        case "p":
        case "P":
          setActiveTool("pipe");
          break;
        case "a":
        case "A":
          cancelDrawing();
          setActiveTool("anchor");
          break;
        case "q":
        case "Q":
          cancelDrawing();
          setActiveTool("equipment");
          break;
        case "t":
        case "T":
          cancelDrawing();
          setActiveTool("tee");
          break;
        case "Enter":
          if (isDrawing) {
            cancelDrawing();
          }
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, deleteSelectedNode, isDrawing, cancelDrawing]);

  // Preview line for drawing
  const previewLine = useMemo(() => {
    if (!isDrawing || !drawStart || !drawEnd) return null;
    
    return (
      <svg
        className="absolute inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      >
        <line
          x1={drawStart.x}
          y1={drawStart.y}
          x2={drawEnd.x}
          y2={drawEnd.y}
          stroke={isPlastic ? "#3b82f6" : "#64748b"}
          strokeWidth="6"
          strokeDasharray="10,5"
          strokeLinecap="round"
        />
        <circle cx={drawEnd.x} cy={drawEnd.y} r="8" fill={isPlastic ? "#3b82f6" : "#64748b"} />
        <text
          x={(drawStart.x + drawEnd.x) / 2}
          y={(drawStart.y + drawEnd.y) / 2 - 15}
          fill="#1e293b"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          {pxToFeet(distance(drawStart, drawEnd))} ft • {previewDirection}
        </text>
      </svg>
    );
  }, [isDrawing, drawStart, drawEnd, previewDirection, isPlastic]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/home" 
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
                Pipe Support Designer
              </h1>
              <p className="text-xs text-slate-500">ASME B31.3-2024 • 40 05 19 Rev. 3</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={runCalculation}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-4 h-4" />
            Calculate
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4" />
            Open
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>
      
      {/* Defaults Bar */}
      <DesignerDefaults 
        defaults={defaults}
        onDefaultsChange={setDefaults}
      />
      
      {/* Environment Selector */}
      <DesignerEnvironment
        environment={environment}
        onEnvironmentChange={setEnvironment}
        isIndoor={isIndoor}
        onIndoorChange={setIsIndoor}
        isCorrosive={isCorrosive}
        onCorrosiveChange={setIsCorrosive}
        seismicZone={seismicZone}
        onSeismicChange={setSeismicZone}
      />
      
      {/* Drawing Mode Indicator */}
      {isDrawing && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-20 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-3">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>Drawing pipe • Click to set direction • <strong>ENTER</strong> to finish • <strong>ESC</strong> to cancel</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <DesignerToolbar 
          activeTool={activeTool}
          onToolChange={(tool) => {
            cancelDrawing();
            setActiveTool(tool);
          }}
          onDelete={deleteSelectedNode}
          canDelete={!!selectedNodeId}
        />
        
        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onMouseMove={onMouseMove}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            connectionLineStyle={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            defaultEdgeOptions={{ type: 'pipe' }}
            className="bg-white dark:bg-slate-900"
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={15} 
              size={1}
              color="#cbd5e1"
            />
            <Controls 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              showInteractive={false}
            />
            <MiniMap 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'anchor': return '#3b82f6';
                  case 'equipment': return '#8b5cf6';
                  case 'pipe_segment': return '#64748b';
                  case 'elbow': return '#f59e0b';
                  case 'tee': return '#10b981';
                  case 'support': return '#ef4444';
                  default: return '#94a3b8';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
            
            {/* Empty state */}
            {nodes.length === 0 && (
              <Panel position="top-center" className="mt-20">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center max-w-lg">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <LayoutGrid className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Draw Your Pipe Run
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono">P</kbd> to start drawing pipes. 
                    Click to set start point, click again to set direction. 
                    The system will automatically add elbows when you change direction and calculate support spacing.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded shadow-sm">P</kbd>
                      <span>Draw Pipe</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded shadow-sm">A</kbd>
                      <span>Anchor</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded shadow-sm">Q</kbd>
                      <span>Equipment</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 rounded shadow-sm">T</kbd>
                      <span>Tee</span>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
          
          {/* Preview line overlay */}
          {previewLine}
          
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="absolute bottom-4 left-4 right-72 z-10">
              <DesignerWarnings 
                warnings={warnings}
                onDismiss={(id) => setWarnings(prev => prev.filter(w => w.id !== id))}
              />
            </div>
          )}
        </div>
        
        {/* Right Panel */}
        <DesignerPanel
          selectedNode={selectedNode ?? null}
          onUpdateNode={updateNodeData}
          defaults={defaults}
          environment={environment}
          nodeCount={nodes.length}
        />
      </div>
      
      {/* Bottom Tabs */}
      <div className="h-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center px-4 flex-shrink-0">
        <div className="flex gap-1">
          {[
            { id: "design", label: "Design", icon: LayoutGrid },
            { id: "layout", label: "Support Layout", icon: Layers },
            { id: "bom", label: "Bill of Materials", icon: Package },
            { id: "report", label: "Calculation Report", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="ml-auto text-xs text-slate-500">
          {nodes.filter(n => n.type === 'pipe_segment').length} pipes • 
          {nodes.filter(n => n.type === 'support').length} supports • 
          {nodes.filter(n => n.type === 'elbow').length} elbows
        </div>
      </div>
    </div>
  );
}

// Main page with provider
export default function DesignerPage() {
  return (
    <ReactFlowProvider>
      <DesignerCanvas />
    </ReactFlowProvider>
  );
}
