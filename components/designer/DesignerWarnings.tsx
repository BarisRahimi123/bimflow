"use client";

import type { DesignerWarning } from "@/lib/designer/types";
import { AlertTriangle, X, Info, AlertCircle } from "lucide-react";

interface DesignerWarningsProps {
  warnings: DesignerWarning[];
  onDismiss: (id: string) => void;
}

export function DesignerWarnings({ warnings, onDismiss }: DesignerWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">{warnings.length} Warning{warnings.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="max-h-40 overflow-auto">
        {warnings.map((warning) => (
          <div 
            key={warning.id}
            className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0 flex items-start gap-2"
          >
            <div className="mt-0.5">
              {warning.severity === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {warning.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {warning.severity === 'info' && <Info className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {warning.message}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Code: {warning.code}
              </div>
              {warning.suggestion && (
                <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                  💡 {warning.suggestion}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(warning.id)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
