"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Anchor, Circle, ArrowRight } from "lucide-react";

interface AnchorNodeData {
  label?: string;
  anchorType?: "fixed" | "directional" | "continue";
  isTemporary?: boolean;
}

export const AnchorNode = memo(function AnchorNode({ data, selected }: NodeProps) {
  const nodeData = data as AnchorNodeData;
  const anchorType = nodeData.anchorType || "fixed";
  const isTemporary = nodeData.isTemporary || anchorType === "continue";

  // Different styles based on type
  const getStyles = () => {
    if (isTemporary || anchorType === "continue") {
      return {
        bg: "from-slate-400 to-slate-500",
        ring: "ring-slate-400",
        icon: <Circle className="w-5 h-5 text-white" />,
        label: "Click to continue",
      };
    }
    if (anchorType === "directional") {
      return {
        bg: "from-cyan-500 to-cyan-600",
        ring: "ring-cyan-400",
        icon: <ArrowRight className="w-5 h-5 text-white" />,
        label: "Dir. Anchor",
      };
    }
    return {
      bg: "from-blue-500 to-blue-600",
      ring: "ring-blue-400",
      icon: <Anchor className="w-5 h-5 text-white" />,
      label: "Fixed Anchor",
    };
  };

  const styles = getStyles();

  return (
    <div className="relative group" style={{ cursor: isTemporary ? 'crosshair' : 'move' }}>
      {/* Anchor visualization */}
      <div
        className={`
          relative
          w-10 h-10 
          bg-gradient-to-br ${styles.bg}
          ${isTemporary ? "rounded-full border-2 border-dashed border-white/50" : "rounded-xl"}
          shadow-lg
          flex items-center justify-center
          transition-all duration-150
          ${selected 
            ? `ring-2 ${styles.ring} ring-offset-2 shadow-xl scale-110` 
            : "hover:shadow-xl hover:scale-105"}
          ${isTemporary ? "opacity-70 animate-pulse" : ""}
        `}
      >
        {styles.icon}
      </div>
      
      {/* Connection handles on all sides */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="!w-2 !h-2 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
        id="left"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2 !h-2 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
        id="top"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-white !border-2 !border-slate-400 hover:!bg-indigo-400 transition-colors"
        id="target-left"
      />
      
      {/* Label */}
      {!isTemporary && (
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[9px] font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {styles.label}
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium">{styles.label}</div>
        {!isTemporary && <div className="text-slate-300">No pipe movement allowed</div>}
        {isTemporary && <div className="text-slate-300">Click to continue pipe run</div>}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
