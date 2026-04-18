"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { EQUIPMENT_CONFIGS } from "@/lib/designer/types";
import type { EquipmentType } from "@/lib/designer/types";

interface EquipmentNodeData {
  label?: string;
  equipmentType?: EquipmentType;
  name?: string;
}

export const EquipmentNode = memo(function EquipmentNode({ data, selected }: NodeProps) {
  const nodeData = data as EquipmentNodeData;
  const equipmentType = nodeData.equipmentType || "pump";
  const config = EQUIPMENT_CONFIGS[equipmentType];

  return (
    <div className="relative group" style={{ cursor: 'move' }}>
      {/* Equipment visualization */}
      <div
        className={`
          relative
          w-16 h-16 
          bg-gradient-to-br from-purple-500 to-purple-600
          rounded-xl shadow-lg
          flex flex-col items-center justify-center
          transition-all duration-150
          ${selected 
            ? "ring-2 ring-indigo-500 ring-offset-2 shadow-xl scale-105" 
            : "hover:shadow-xl hover:scale-105"}
        `}
      >
        <span className="text-2xl drop-shadow">{config?.icon || "🏭"}</span>
      </div>
      
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        id="right"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        id="top"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-300 !border-2 !border-white hover:!bg-indigo-400 transition-colors"
        id="bottom"
      />
      
      {/* Labels */}
      <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {nodeData.name || config?.label || "Equipment"}
        </div>
      </div>
      
      {/* Warning indicators */}
      {config?.hasVibration && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] shadow-md" title="Has vibration">
          ~
        </div>
      )}
      {config?.hasThermalGrowth && !config?.hasVibration && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-[10px] text-white shadow-md" title="Thermal growth">
          ↕
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
        <div className="font-medium">{config?.label}</div>
        <div className="text-slate-300 flex gap-2">
          {config?.hasVibration && <span>Vibration</span>}
          {config?.hasThermalGrowth && <span>Thermal</span>}
          {config?.nozzleLoadSensitive && <span>Nozzle-sensitive</span>}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </div>
  );
});
