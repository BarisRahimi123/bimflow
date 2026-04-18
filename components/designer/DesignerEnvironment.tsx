"use client";

import { cn } from "@/lib/utils";
import type { EnvironmentType } from "@/lib/designer/types";
import { ENVIRONMENT_CONFIGS } from "@/lib/designer/types";

interface DesignerEnvironmentProps {
  environment: EnvironmentType;
  onEnvironmentChange: (env: EnvironmentType) => void;
  isIndoor: boolean;
  onIndoorChange: (v: boolean) => void;
  isCorrosive: boolean;
  onCorrosiveChange: (v: boolean) => void;
  seismicZone: boolean;
  onSeismicChange: (v: boolean) => void;
}

export function DesignerEnvironment({
  environment,
  onEnvironmentChange,
  isIndoor,
  onIndoorChange,
  isCorrosive,
  onCorrosiveChange,
  seismicZone,
  onSeismicChange,
}: DesignerEnvironmentProps) {
  const environments = Object.values(ENVIRONMENT_CONFIGS);

  return (
    <div className="h-11 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3 flex-shrink-0">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Environment:
      </span>
      
      {/* Environment Type Buttons */}
      <div className="flex gap-1">
        {environments.map((env) => (
          <button
            key={env.type}
            onClick={() => onEnvironmentChange(env.type)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5",
              environment === env.type
                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            title={env.description}
          >
            <span>{env.icon}</span>
            <span>{env.label}</span>
          </button>
        ))}
      </div>
      
      {/* Divider */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
      
      {/* Environment Flags */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isIndoor}
            onChange={(e) => onIndoorChange(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">Indoor</span>
        </label>
        
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isCorrosive}
            onChange={(e) => onCorrosiveChange(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <span className={cn(
            "text-xs",
            isCorrosive ? "text-amber-600 dark:text-amber-400 font-medium" : "text-slate-600 dark:text-slate-400"
          )}>
            Corrosive
          </span>
        </label>
        
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={seismicZone}
            onChange={(e) => onSeismicChange(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span className={cn(
            "text-xs",
            seismicZone ? "text-red-600 dark:text-red-400 font-medium" : "text-slate-600 dark:text-slate-400"
          )}>
            Seismic Zone
          </span>
        </label>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Tolerance Info */}
      <div className="text-xs text-slate-400">
        Tolerance: <span className={cn(
          "font-medium",
          ENVIRONMENT_CONFIGS[environment].toleranceClass === 'critical' 
            ? "text-red-500" 
            : ENVIRONMENT_CONFIGS[environment].toleranceClass === 'standard'
            ? "text-amber-500"
            : "text-green-500"
        )}>
          {ENVIRONMENT_CONFIGS[environment].toleranceClass === 'critical' && '±1/4"'}
          {ENVIRONMENT_CONFIGS[environment].toleranceClass === 'standard' && '±1"'}
          {ENVIRONMENT_CONFIGS[environment].toleranceClass === 'loose' && '±2"'}
        </span>
      </div>
    </div>
  );
}
