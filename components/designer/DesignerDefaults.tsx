"use client";

import type { PipeDefaults, PipeMaterial, ServiceType } from "@/lib/designer/types";
import { MATERIAL_OPTIONS, PIPE_SIZES } from "@/lib/designer/types";

interface DesignerDefaultsProps {
  defaults: PipeDefaults;
  onDefaultsChange: (defaults: PipeDefaults) => void;
}

export function DesignerDefaults({ defaults, onDefaultsChange }: DesignerDefaultsProps) {
  const updateDefault = <K extends keyof PipeDefaults>(key: K, value: PipeDefaults[K]) => {
    onDefaultsChange({ ...defaults, [key]: value });
  };

  const selectedMaterial = MATERIAL_OPTIONS.find(m => m.value === defaults.material);
  const isPlastic = selectedMaterial?.type === 'plastic';

  return (
    <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 flex-shrink-0">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Defaults:
      </span>
      
      {/* Material */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 dark:text-slate-400">Material:</label>
        <select
          value={defaults.material}
          onChange={(e) => updateDefault("material", e.target.value as PipeMaterial)}
          className={`h-7 px-2 text-xs rounded-md border bg-white dark:bg-slate-800 ${
            isPlastic 
              ? "border-blue-300 dark:border-blue-700" 
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <optgroup label="Plastic">
            {MATERIAL_OPTIONS.filter(m => m.type === 'plastic').map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </optgroup>
          <optgroup label="Metal">
            {MATERIAL_OPTIONS.filter(m => m.type === 'metal').map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </optgroup>
        </select>
        {isPlastic && (
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
            Plastic
          </span>
        )}
      </div>
      
      {/* Size */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 dark:text-slate-400">Size:</label>
        <select
          value={defaults.size}
          onChange={(e) => updateDefault("size", e.target.value)}
          className="h-7 px-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          {PIPE_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      
      {/* Temperature */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 dark:text-slate-400">Temp:</label>
        <input
          type="number"
          value={defaults.temperature}
          onChange={(e) => updateDefault("temperature", Number(e.target.value))}
          className="h-7 w-16 px-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        />
        <span className="text-xs text-slate-400">°F</span>
      </div>
      
      {/* Service */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 dark:text-slate-400">Service:</label>
        <select
          value={defaults.service}
          onChange={(e) => updateDefault("service", e.target.value as ServiceType)}
          className="h-7 px-2 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <option value="water">Water/Liquid</option>
          <option value="vapor">Vapor/Gas</option>
          <option value="chemical">Chemical</option>
        </select>
      </div>
      
      {/* Insulated Toggle */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 dark:text-slate-400">Insulated:</label>
        <button
          onClick={() => updateDefault("insulated", !defaults.insulated)}
          className={`h-7 px-2 text-xs rounded-md border transition-colors ${
            defaults.insulated
              ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
          }`}
        >
          {defaults.insulated ? "Yes" : "No"}
        </button>
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Code Standard */}
      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
        <span className="text-[10px] text-slate-400">Code:</span>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">ASME B31.3-2024</span>
      </div>
    </div>
  );
}
