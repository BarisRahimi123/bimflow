"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface PipeNodeData {
  label?: string;
  orientation?: "horizontal" | "vertical";
  length?: number;
  material?: string;
  size?: string;
}

export const PipeNode = memo(function PipeNode({ data, selected }: NodeProps) {
  const nodeData = data as PipeNodeData;
  const isHorizontal = nodeData.orientation !== "vertical";
  const isPlastic = nodeData.material?.includes("PVC") || 
                    nodeData.material?.includes("CPVC") || 
                    nodeData.material === "PP" || 
                    nodeData.material === "PVDF";

  // Calculate visual length based on pipe length (scale factor)
  const length = nodeData.length || 10;
  const visualLength = Math.min(Math.max(length * 12, 60), 200); // Min 60, max 200px

  return (
    <div
      className={`relative group ${selected ? "z-10" : ""}`}
      style={{ cursor: 'move' }}
    >
      {/* Pipe segment visualization */}
      <div
        className={`
          relative
          ${isHorizontal ? `h-6` : `w-6`}
          ${isPlastic 
            ? "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600" 
            : "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600"}
          ${isHorizontal ? "rounded-full" : "rounded-full"}
          shadow-md
          flex items-center justify-center
          transition-all duration-150
          ${selected 
            ? "ring-2 ring-indigo-500 ring-offset-2 shadow-lg" 
            : "hover:shadow-lg"}
        `}
        style={{
          width: isHorizontal ? visualLength : 24,
          height: isHorizontal ? 24 : visualLength,
        }}
      >
        {/* Pipe shine effect */}
        <div 
          className={`absolute ${isHorizontal ? "inset-x-2 top-1 h-1.5" : "inset-y-2 left-1 w-1.5"} bg-white/30 rounded-full`}
        />
        
        {/* Length label */}
        <span className={`
          text-[10px] font-bold text-white drop-shadow-md
          ${isHorizontal ? "" : "transform -rotate-90"}
          select-none
        `}>
          {length}′
        </span>
      </div>
      
      {/* Connection handles */}
      {isHorizontal ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
          />
        </>
      )}
      
      {/* Info tooltip on hover */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity duration-150">
        <div className="font-medium">{nodeData.material || "Pipe"}</div>
        <div className="text-slate-300">{nodeData.size || "2\""} • {length} ft</div>
        {/* Arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
