"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface ElbowNodeData {
  label?: string;
  angle?: number;
  radius?: "long" | "short";
}

export const ElbowNode = memo(function ElbowNode({ data, selected }: NodeProps) {
  const nodeData = data as ElbowNodeData;
  const angle = nodeData.angle || 90;
  const isLongRadius = nodeData.radius !== "short";

  return (
    <div className="relative group" style={{ cursor: 'move' }}>
      {/* Elbow visualization */}
      <div
        className={`
          relative
          w-12 h-12
          transition-all duration-150
          ${selected 
            ? "scale-110" 
            : "hover:scale-110"}
        `}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
          {/* Elbow path */}
          <path
            d={angle === 90 
              ? "M 6 24 Q 24 24 24 42" 
              : "M 8 28 Q 20 26 28 38"}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="8"
            strokeLinecap="round"
            className={selected ? "stroke-amber-400" : ""}
          />
          {/* Inner shine */}
          <path
            d={angle === 90 
              ? "M 8 22 Q 22 22 22 38" 
              : "M 10 26 Q 20 24 26 34"}
            fill="none"
            stroke="#fcd34d"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Center point */}
          <circle cx="24" cy="24" r="4" fill="#d97706" />
        </svg>
        
        {/* Selection ring */}
        {selected && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-indigo-500 ring-offset-2" />
        )}
      </div>
      
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-amber-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        style={{ top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        style={{ left: "50%" }}
      />
      
      {/* Angle label */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded text-[9px] font-medium text-amber-700 dark:text-amber-400">
        {angle}° {isLongRadius ? "LR" : "SR"}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium">{angle}° Elbow</div>
        <div className="text-slate-300">{isLongRadius ? "Long" : "Short"} Radius</div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
