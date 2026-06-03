"use client";

import type { Node } from "@xyflow/react";
import type { PipeDefaults, EnvironmentType } from "@/lib/designer/types";
import { MATERIAL_OPTIONS, PIPE_SIZES, EQUIPMENT_CONFIGS } from "@/lib/designer/types";
import { 
  Settings2, 
  Ruler, 
  Thermometer, 
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

interface DesignerPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  defaults: PipeDefaults;
  environment: EnvironmentType;
  nodeCount: number;
}

type NodeData = Record<string, string | number | boolean | null | undefined>;

export function DesignerPanel({
  selectedNode,
  onUpdateNode,
  defaults,
  environment,
  nodeCount,
}: DesignerPanelProps) {
  // Mock calculation results for demo
  const mockResults = nodeCount > 0 ? {
    maxSpan: 7.5,
    expansion: 0.8,
    supports: nodeCount + 2,
    compliant: true,
  } : null;

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Properties Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Settings2 className="w-4 h-4 text-slate-400" />
          Properties
        </h3>
        
        {selectedNode ? (
          <div className="space-y-3">
            {/* Node Type */}
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Selected</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                {selectedNode.type} - {selectedNode.id}
              </div>
            </div>
            
            {/* Pipe Segment Properties */}
            {(selectedNode.type === "pipe" || selectedNode.type === "pipe_segment") && (
              <>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mb-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Direction:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {(selectedNode.data?.direction as string) || (selectedNode.data?.orientation as string) || "horizontal"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Length (ft)</label>
                  <input
                    type="number"
                    value={(selectedNode.data?.length as number) || 10}
                    onChange={(e) => onUpdateNode(selectedNode.id, { length: Number(e.target.value) })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Material</label>
                  <select
                    value={(selectedNode.data?.material as string) || defaults.material}
                    onChange={(e) => onUpdateNode(selectedNode.id, { material: e.target.value })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {MATERIAL_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Size</label>
                  <select
                    value={(selectedNode.data?.size as string) || defaults.size}
                    onChange={(e) => onUpdateNode(selectedNode.id, { size: e.target.value })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {PIPE_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {/* Support Properties */}
            {selectedNode.type === "support" && (
              <div className="space-y-2">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="text-[10px] text-red-600 dark:text-red-400 font-medium uppercase">
                    {(selectedNode.data?.supportType as string)?.replace("_", " ") || "Hanger"}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    {selectedNode.data?.isCalculated ? "Auto-calculated" : "Manually placed"}
                  </div>
                </div>
                {selectedNode.data?.distanceFromStart ? (
                  <div className="text-xs text-slate-500">
                    {selectedNode.data.distanceFromStart as number} ft from segment start
                  </div>
                ) : null}
              </div>
            )}
            
            {/* Equipment Properties */}
            {selectedNode.type === "equipment" && (
              <>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Equipment Type</label>
                  <select
                    value={(selectedNode.data?.equipmentType as string) || "pump"}
                    onChange={(e) => onUpdateNode(selectedNode.id, { equipmentType: e.target.value })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {Object.values(EQUIPMENT_CONFIGS).map((eq) => (
                      <option key={eq.type} value={eq.type}>{eq.icon} {eq.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Name/Tag</label>
                  <input
                    type="text"
                    value={(selectedNode.data?.name as string) || ""}
                    onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
                    placeholder="e.g., P-101"
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </>
            )}

            {/* Elbow Properties */}
            {selectedNode.type === "elbow" && (
              <>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Angle</label>
                  <select
                    value={(selectedNode.data?.angle as number) || 90}
                    onChange={(e) => onUpdateNode(selectedNode.id, { angle: Number(e.target.value) })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value={90}>90° (Standard)</option>
                    <option value={45}>45°</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Radius</label>
                  <select
                    value={(selectedNode.data?.radius as string) || "long"}
                    onChange={(e) => onUpdateNode(selectedNode.id, { radius: e.target.value })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="long">Long Radius (LR)</option>
                    <option value="short">Short Radius (SR)</option>
                  </select>
                </div>
              </>
            )}

            {/* Anchor Properties */}
            {selectedNode.type === "anchor" && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Anchor Type</label>
                <select
                  value={(selectedNode.data?.anchorType as string) || "fixed"}
                  onChange={(e) => onUpdateNode(selectedNode.id, { anchorType: e.target.value })}
                  className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="fixed">Fixed Anchor</option>
                  <option value="directional">Directional Anchor</option>
                </select>
              </div>
            )}

            {/* Tee Properties */}
            {selectedNode.type === "tee" && (
              <>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Branch Size</label>
                  <select
                    value={(selectedNode.data?.branchSize as string) || "same"}
                    onChange={(e) => onUpdateNode(selectedNode.id, { branchSize: e.target.value })}
                    className="w-full h-8 px-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="same">Same as Main</option>
                    {PIPE_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Tee Fitting</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300">3-way connection point</div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-4">
            Select an element to edit its properties
          </div>
        )}
      </div>
      
      {/* Calculations Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-slate-400" />
          Calculations
        </h3>
        
        {mockResults ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Ruler className="w-3 h-3" /> Max Span
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {mockResults.maxSpan} ft
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Thermometer className="w-3 h-3" /> Thermal Exp.
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {mockResults.expansion}"
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-slate-500">Supports Needed</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {mockResults.supports}
              </span>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className={`flex items-center gap-2 text-sm ${
                mockResults.compliant ? "text-green-600" : "text-amber-600"
              }`}>
                {mockResults.compliant ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {mockResults.compliant ? "Code Compliant" : "Review Required"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-4">
            Add elements to see calculations
          </div>
        )}
      </div>
      
      {/* Code Checks Section */}
      <div className="p-4 flex-1 overflow-auto">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-slate-400" />
          Code Checks
        </h3>
        
        <div className="space-y-2">
          <CodeCheck 
            status="pass" 
            code="B31.3-321.4" 
            description="Span limits OK" 
          />
          <CodeCheck 
            status="pass" 
            code="B31.3-321.2" 
            description="Guide spacing OK" 
          />
          <CodeCheck 
            status={nodeCount > 0 ? "warning" : "pending"} 
            code="B31.3-319.4" 
            description="Thermal expansion" 
          />
          <CodeCheck 
            status="pending" 
            code="40 05 19" 
            description="Support hardware" 
          />
        </div>
      </div>
    </div>
  );
}

function CodeCheck({ 
  status, 
  code, 
  description 
}: { 
  status: "pass" | "warning" | "fail" | "pending"; 
  code: string; 
  description: string;
}) {
  const colors = {
    pass: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
    fail: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    pending: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400",
  };
  
  const icons = {
    pass: "✓",
    warning: "⚠",
    fail: "✗",
    pending: "○",
  };
  
  return (
    <div className={`p-2 rounded-lg border text-xs ${colors[status]}`}>
      <div className="flex items-center gap-2">
        <span>{icons[status]}</span>
        <span className="font-medium">{code}</span>
      </div>
      <div className="mt-0.5 opacity-80">{description}</div>
    </div>
  );
}
