"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface PipeSegmentNodeData {
  length?: number;
  direction?: "horizontal" | "vertical";
  material?: string;
  size?: string;
  startPos?: { x: number; y: number };
  endPos?: { x: number; y: number };
}

export const PipeSegmentNode = memo(function PipeSegmentNode({ data, selected }: NodeProps) {
  const nodeData = data as PipeSegmentNodeData;
  const length = nodeData.length || 10;
  const direction = nodeData.direction || "horizontal";
  const isHorizontal = direction === "horizontal";
  
  const isPlastic = nodeData.material?.includes("PVC") || 
                    nodeData.material?.includes("CPVC") || 
                    nodeData.material === "PP" || 
                    nodeData.material === "PVDF";

  return (
    <div className="relative group" style={{ cursor: 'move' }}>
      {/* Pipe segment label */}
      <div
        className={`
          relative
          px-3 py-2
          ${isPlastic 
            ? "bg-gradient-to-r from-blue-500 to-blue-600" 
            : "bg-gradient-to-r from-slate-500 to-slate-600"}
          rounded-lg shadow-lg
          text-white text-xs font-medium
          flex items-center gap-2
          transition-all duration-150
          ${selected 
            ? "ring-2 ring-indigo-500 ring-offset-2 shadow-xl" 
            : "hover:shadow-xl"}
        `}
      >
        {/* Direction indicator */}
        <span className="text-white/70">
          {isHorizontal ? "━" : "┃"}
        </span>
        
        {/* Length */}
        <span className="font-bold">{length} ft</span>
        
        {/* Size */}
        <span className="text-white/70 text-[10px]">{nodeData.size}</span>
      </div>
      
      {/* Connection handles */}
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        className="!w-3 !h-3 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 hover:!border-indigo-400 transition-colors"
      />
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        className="!w-3 !h-3 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 hover:!border-indigo-400 transition-colors"
      />
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium">{nodeData.material}</div>
        <div className="text-slate-300">{nodeData.size} • {length} ft • {direction}</div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
