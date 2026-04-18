"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface TeeNodeData {
  label?: string;
  branchSize?: string;
}

export const TeeNode = memo(function TeeNode({ data, selected }: NodeProps) {
  const nodeData = data as TeeNodeData;
  const hasDifferentBranch = nodeData.branchSize && nodeData.branchSize !== "same";

  return (
    <div className="relative group" style={{ cursor: 'move' }}>
      {/* Tee visualization */}
      <div
        className={`
          relative
          w-14 h-14
          transition-all duration-150
          ${selected 
            ? "scale-110" 
            : "hover:scale-110"}
        `}
      >
        <svg viewBox="0 0 56 56" className="w-full h-full drop-shadow-md">
          {/* Horizontal pipe */}
          <rect 
            x="0" y="20" 
            width="56" height="16" 
            fill="#10b981" 
            rx="4"
            className={selected ? "fill-emerald-400" : ""}
          />
          {/* Horizontal shine */}
          <rect x="4" y="22" width="48" height="3" fill="#34d399" opacity="0.5" rx="1.5" />
          
          {/* Vertical branch */}
          <rect 
            x="20" y="28" 
            width="16" height="28" 
            fill="#10b981" 
            rx="4"
            className={selected ? "fill-emerald-400" : ""}
          />
          {/* Vertical shine */}
          <rect x="22" y="32" width="3" height="20" fill="#34d399" opacity="0.5" rx="1.5" />
          
          {/* Center junction */}
          <circle cx="28" cy="28" r="5" fill="#059669" />
        </svg>
        
        {/* Selection ring */}
        {selected && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-indigo-500 ring-offset-2" />
        )}
        
        {/* Reducer indicator */}
        {hasDifferentBranch && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-300 rounded-full flex items-center justify-center text-[8px] font-bold text-emerald-800">
            R
          </div>
        )}
      </div>
      
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-emerald-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        style={{ top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-emerald-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        id="right"
        style={{ top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        id="bottom"
        style={{ left: "50%" }}
      />
      
      {/* Label */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
        Tee
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium">Tee Fitting</div>
        <div className="text-slate-300">
          {hasDifferentBranch ? `Branch: ${nodeData.branchSize}` : "Equal branch"}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
