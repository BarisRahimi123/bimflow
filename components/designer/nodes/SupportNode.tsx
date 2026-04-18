"use client";

import { memo } from "react";
import { NodeProps } from "@xyflow/react";

interface SupportNodeData {
  label?: string;
  supportType?: "anchor" | "guide" | "hanger" | "slide" | "riser_clamp";
  isCalculated?: boolean;
  distanceFromStart?: number;
}

const supportStyles: Record<string, { bg: string; border: string; label: string; icon: string }> = {
  anchor: { bg: "bg-blue-500", border: "border-blue-600", label: "A", icon: "⚓" },
  guide: { bg: "bg-green-500", border: "border-green-600", label: "G", icon: "◇" },
  hanger: { bg: "bg-red-500", border: "border-red-600", label: "H", icon: "▽" },
  slide: { bg: "bg-amber-500", border: "border-amber-600", label: "S", icon: "□" },
  riser_clamp: { bg: "bg-purple-500", border: "border-purple-600", label: "R", icon: "┃" },
};

export const SupportNode = memo(function SupportNode({ data, selected }: NodeProps) {
  const nodeData = data as SupportNodeData;
  const supportType = nodeData.supportType || "hanger";
  const style = supportStyles[supportType] || supportStyles.hanger;

  return (
    <div className="relative group">
      {/* Support marker */}
      <div
        className={`
          w-5 h-5 
          ${style.bg}
          rounded-full shadow-md
          flex items-center justify-center
          text-white text-[10px] font-bold
          border-2 ${style.border}
          ${nodeData.isCalculated ? "ring-2 ring-offset-1 ring-white/50" : ""}
          ${selected ? "ring-2 ring-indigo-500 ring-offset-2 scale-125" : "hover:scale-110"}
          transition-all duration-150
        `}
        title={`${supportType.replace("_", " ")} support`}
      >
        {style.label}
      </div>
      
      {/* Auto-calculated badge */}
      {nodeData.isCalculated && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" title="Auto-calculated" />
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium capitalize">{supportType.replace("_", " ")}</div>
        {nodeData.distanceFromStart && (
          <div className="text-slate-300">{nodeData.distanceFromStart} ft from start</div>
        )}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
