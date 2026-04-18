"use client";

import { cn } from "@/lib/utils";
import type { DesignerTool } from "@/lib/designer/types";
import {
  MousePointer2,
  Pencil,
  Anchor,
  Factory,
  Trash2,
  RotateCcw,
  RotateCw,
  GitBranch,
} from "lucide-react";

interface DesignerToolbarProps {
  activeTool: DesignerTool;
  onToolChange: (tool: DesignerTool) => void;
  onDelete: () => void;
  canDelete: boolean;
}

interface ToolButton {
  id: DesignerTool;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  group: "select" | "draw" | "components";
}

const tools: ToolButton[] = [
  // Selection
  { id: "select", label: "Select", description: "Select and move elements", icon: MousePointer2, shortcut: "V", group: "select" },
  
  // Drawing
  { id: "pipe", label: "Draw Pipe", description: "Click to start, click to set direction", icon: Pencil, shortcut: "P", group: "draw" },
  
  // Components
  { id: "anchor", label: "Anchor", description: "Fixed point - no pipe movement", icon: Anchor, shortcut: "A", group: "components" },
  { id: "equipment", label: "Equipment", description: "Pump, tank, vessel, etc.", icon: Factory, shortcut: "Q", group: "components" },
  { id: "tee", label: "Tee", description: "Branch connection", icon: GitBranch, shortcut: "T", group: "components" },
];

export function DesignerToolbar({
  activeTool,
  onToolChange,
  onDelete,
  canDelete,
}: DesignerToolbarProps) {
  const groupedTools = {
    select: tools.filter(t => t.group === "select"),
    draw: tools.filter(t => t.group === "draw"),
    components: tools.filter(t => t.group === "components"),
  };

  return (
    <div className="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-3 flex-shrink-0">
      {/* Selection Tools */}
      <div className="px-2 space-y-1">
        {groupedTools.select.map((tool) => (
          <ToolButtonComponent
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
          />
        ))}
      </div>
      
      <div className="my-3 mx-3 border-t border-slate-200 dark:border-slate-700" />
      
      {/* Drawing Tools */}
      <div className="px-2 space-y-1">
        <div className="text-[9px] text-slate-400 uppercase tracking-wider text-center mb-2">Draw</div>
        {groupedTools.draw.map((tool) => (
          <ToolButtonComponent
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
            highlight
          />
        ))}
      </div>
      
      <div className="my-3 mx-3 border-t border-slate-200 dark:border-slate-700" />
      
      {/* Component Tools */}
      <div className="px-2 space-y-1">
        <div className="text-[9px] text-slate-400 uppercase tracking-wider text-center mb-2">Place</div>
        {groupedTools.components.map((tool) => (
          <ToolButtonComponent
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
          />
        ))}
      </div>
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Edit Tools */}
      <div className="px-2 space-y-1">
        <button
          onClick={onDelete}
          disabled={!canDelete}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-all",
            canDelete
              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
          )}
          title="Delete (Del)"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ToolButtonComponent({
  tool,
  isActive,
  onClick,
  highlight,
}: {
  tool: ToolButton;
  isActive: boolean;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group",
        isActive
          ? highlight 
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
          : highlight
            ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-2 border-dashed border-indigo-300 dark:border-indigo-700"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
      title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
    >
      <tool.icon className="w-5 h-5" />
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium">{tool.label}</span>
          {tool.shortcut && (
            <span className="px-1.5 py-0.5 bg-slate-700 dark:bg-slate-600 rounded text-[10px] font-mono">
              {tool.shortcut}
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-300">{tool.description}</div>
        {/* Arrow */}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
      </div>
    </button>
  );
}
