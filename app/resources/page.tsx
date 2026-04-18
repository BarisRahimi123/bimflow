"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  FileText,
  FileCheck,
  PenTool,
  ScrollText,
  Box,
  FileType,
  Grid3x3,
  ScanSearch,
  Cloud,
  MessageSquareWarning,
  ClipboardCheck,
  ClipboardList,
  AlertOctagon,
  Flame,
  FolderArchive,
  CalendarDays,
  Workflow,
  BookOpen,
  Wrench,
  Clock,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FolderOpen,
  Download,
  Eye,
  Package,
  Building2,
  FileSpreadsheet,
  Layers,
  Info,
  Lightbulb,
  FolderRoot,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RESOURCE_TREE,
  findNodeById,
  getParentPath,
  searchTree,
  countFiles,
  type ResourceNode,
} from "@/lib/resources/categories";
import { formatFileSize } from "@/lib/resources/format";

const ICON_MAP: Record<string, LucideIcon> = {
  FileCheck, PenTool, ScrollText, Box, FileType, Grid3x3, ScanSearch,
  Cloud, MessageSquareWarning, Search, Workflow, CalendarDays, ClipboardCheck,
  AlertOctagon, Flame, FolderArchive, ClipboardList, BookOpen, FolderOpen,
  FileText, Building2, Package, FileSpreadsheet, Layers, FolderRoot,
};

const COLOR_BG: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20',
  purple: 'bg-purple-50 dark:bg-purple-900/20',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
  red: 'bg-red-50 dark:bg-red-900/20',
  amber: 'bg-amber-50 dark:bg-amber-900/20',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
  slate: 'bg-slate-50 dark:bg-slate-800/50',
};

const COLOR_TEXT: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  red: 'text-red-600 dark:text-red-400',
  amber: 'text-amber-600 dark:text-amber-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  slate: 'text-slate-600 dark:text-slate-400',
};

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: 'text-red-500',
  xlsx: 'text-emerald-600',
  docx: 'text-blue-600',
  doc: 'text-blue-600',
  pptx: 'text-orange-500',
  txt: 'text-slate-500',
  rfa: 'text-purple-600',
  zipx: 'text-amber-600',
  zip: 'text-amber-600',
  lin: 'text-slate-400',
  shp: 'text-slate-400',
  shx: 'text-slate-400',
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1 text-[10px]"><Wrench className="w-2.5 h-2.5" />Active Tool</Badge>;
    case 'documents':
      return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 gap-1 text-[10px]"><BookOpen className="w-2.5 h-2.5" />Docs</Badge>;
    case 'coming_soon':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 text-[10px]"><Clock className="w-2.5 h-2.5" />Soon</Badge>;
    default:
      return null;
  }
}

function SidebarNode({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: ResourceNode;
  depth: number;
  selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const Icon = ICON_MAP[node.icon || ''] || (isFolder ? FolderOpen : FileText);
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;

  return (
    <>
      <button
        onClick={() => {
          onSelect(node.id);
          if (isFolder && hasChildren) onToggle(node.id);
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-left text-xs rounded-lg transition-colors",
          isSelected
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {isFolder && hasChildren ? (
          isExpanded ? <ChevronDown className="w-3 h-3 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 flex-shrink-0" />
        ) : (
          <span className="w-3" />
        )}
        <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", node.color ? COLOR_TEXT[node.color] : 'text-slate-400')} />
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && isExpanded && node.children?.map((child) => (
        <SidebarNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}

function FileRow({ node, onSelect }: { node: ResourceNode; onSelect: (id: string) => void }) {
  const typeColor = FILE_TYPE_ICONS[node.fileType || ''] || 'text-slate-400';
  return (
    <tr
      onClick={() => onSelect(node.id)}
      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileText className={cn("w-4 h-4 flex-shrink-0", typeColor)} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{node.name}</div>
            {node.modelerSummary && (
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{node.modelerSummary}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <Badge variant="secondary" className="text-[10px] uppercase">{node.fileType}</Badge>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
        {node.fileSize ? formatFileSize(node.fileSize) : '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {node.documentId && (
            <>
              <a
                href={`/api/documents/${node.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 transition-colors"
                title="Open"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
              <a
                href={`/api/documents/${node.documentId}?download=true`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 transition-colors"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function FolderView({ node, onSelect }: { node: ResourceNode; onSelect: (id: string) => void }) {
  const folders = node.children?.filter((c) => c.type === 'folder') || [];
  const files = node.children?.filter((c) => c.type === 'file') || [];

  return (
    <div className="space-y-4">
      {node.quickStart && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Quick Start</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{node.quickStart}</p>
            </div>
          </div>
          {node.toolRoute && (
            <Link
              href={node.toolRoute}
              className="inline-flex items-center gap-1.5 mt-3 ml-8 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Wrench className="w-3 h-3" />
              Open {node.toolLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {folders.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Folders</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {folders.map((folder) => {
              const Icon = ICON_MAP[folder.icon || ''] || FolderOpen;
              const fileCount = countFiles(folder);
              return (
                <button
                  key={folder.id}
                  onClick={() => onSelect(folder.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", COLOR_BG[folder.color || 'slate'])}>
                    <Icon className={cn("w-5 h-5", COLOR_TEXT[folder.color || 'slate'])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                      {folder.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{fileCount} files</span>
                      {folder.status && <StatusBadge status={folder.status} />}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Files ({files.length})</h3>
          <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase hidden md:table-cell">Type</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase hidden md:table-cell">Size</th>
                  <th className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {files.map((f) => (
                  <FileRow key={f.id} node={f} onSelect={onSelect} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No documents in this folder yet.</p>
          <p className="text-xs text-slate-400 mt-1">Documents will be added as the project progresses.</p>
        </div>
      )}
    </div>
  );
}

function FileDetailView({ node, onBack }: { node: ResourceNode; onBack: () => void }) {
  const parentPath = getParentPath(node.id) || [];
  const typeColor = FILE_TYPE_ICONS[node.fileType || ''] || 'text-slate-400';

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to folder
      </button>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        {parentPath.map((p, i) => (
          <span key={p.id} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            <span>{p.name}</span>
          </span>
        ))}
      </div>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <FileText className={cn("w-7 h-7", typeColor)} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{node.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <Badge variant="secondary" className="text-[10px] uppercase">{node.fileType}</Badge>
            <span>{node.fileSize ? formatFileSize(node.fileSize) : ''}</span>
          </div>
        </div>
      </div>

      {node.documentId && (
        <div className="flex items-center gap-2">
          <a
            href={`/api/documents/${node.documentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" /> Open Document
          </a>
          <a
            href={`/api/documents/${node.documentId}?download=true`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        </div>
      )}

      {node.modelerSummary && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" /> What This Document Is
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{node.modelerSummary}</p>
        </div>
      )}

      {node.keyTakeaways && node.keyTakeaways.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Key Takeaways for Modelers
          </h3>
          <ul className="space-y-2">
            {node.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("root");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["root", "bim", "welcome", "specs"]));

  const selectedNode = findNodeById(selectedId) || RESOURCE_TREE;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const node = findNodeById(id);
    if (node?.type === 'folder') {
      setExpandedIds((prev) => { const next = new Set(prev); next.add(id); return next; });
    }
  };

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    return searchTree(search);
  }, [search]);

  const parentPath = getParentPath(selectedId) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 dark:text-slate-100">BIM Resources</h1>
                <p className="text-xs text-slate-500">Project Confluence Documentation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/guide" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Modeler Playbook <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search all documents, specifications, and guidance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {searchResults ? (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 mb-3">{searchResults.length} results for &ldquo;{search}&rdquo;</div>
            {searchResults.map((node) => (
              <button
                key={node.id}
                onClick={() => { setSearch(""); handleSelect(node.id); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all text-left"
              >
                {node.type === 'folder'
                  ? <FolderOpen className="w-4 h-4 text-slate-400" />
                  : <FileText className={cn("w-4 h-4", FILE_TYPE_ICONS[node.fileType || ''] || 'text-slate-400')} />
                }
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{node.name}</div>
                  {node.modelerSummary && <div className="text-xs text-slate-500 truncate">{node.modelerSummary}</div>}
                </div>
                <Badge variant="secondary" className="text-[10px]">{node.type === 'folder' ? 'Folder' : node.fileType?.toUpperCase()}</Badge>
              </button>
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No results found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <SidebarNode
                  node={RESOURCE_TREE}
                  depth={0}
                  selectedId={selectedId}
                  expandedIds={expandedIds}
                  onSelect={handleSelect}
                  onToggle={toggleExpand}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 flex-wrap">
                {parentPath.map((p, i) => (
                  <span key={p.id} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    <button onClick={() => handleSelect(p.id)} className="hover:text-blue-600 transition-colors">{p.name}</button>
                  </span>
                ))}
                {parentPath.length > 0 && <ChevronRight className="w-3 h-3" />}
                <span className="text-slate-700 dark:text-slate-200 font-medium">{selectedNode.name}</span>
              </div>

              {/* Header */}
              {selectedNode.type === 'folder' && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedNode.name}</h2>
                    {selectedNode.status && <StatusBadge status={selectedNode.status} />}
                  </div>
                  {selectedNode.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedNode.description}</p>
                  )}
                  {selectedNode.toolRoute && !selectedNode.quickStart && (
                    <Link
                      href={selectedNode.toolRoute}
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Wrench className="w-4 h-4" /> {selectedNode.toolLabel} <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              )}

              {/* Content */}
              {selectedNode.type === 'folder' ? (
                <FolderView node={selectedNode} onSelect={handleSelect} />
              ) : (
                <FileDetailView
                  node={selectedNode}
                  onBack={() => {
                    const parent = parentPath[parentPath.length - 1];
                    if (parent) handleSelect(parent.id);
                    else handleSelect('root');
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
