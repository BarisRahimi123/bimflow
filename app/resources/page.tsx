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
  X,
  type LucideIcon,
} from "lucide-react";
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

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf:  "text-red-500",
  xlsx: "text-emerald-500",
  docx: "text-blue-500",
  doc:  "text-blue-500",
  pptx: "text-orange-500",
  txt:  "text-slate-400",
  rfa:  "text-purple-500",
  zipx: "text-brand",
  zip:  "text-brand",
  lin:  "text-slate-300",
};

function folderNum(id: string): string | null {
  const m = id.match(/^f(\d+)$/);
  return m ? m[1].padStart(2, "0") : null;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        <Wrench className="w-2.5 h-2.5" /> Active Tool
      </span>
    );
  if (status === "documents")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <BookOpen className="w-2.5 h-2.5" /> Docs
      </span>
    );
  if (status === "coming_soon")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
        <Clock className="w-2.5 h-2.5" /> Soon
      </span>
    );
  return null;
}

function BIMFolderItem({
  node,
  active,
  onSelect,
}: {
  node: ResourceNode;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const num = folderNum(node.id);
  const fileCount = countFiles(node);
  const label = node.name.replace(/^\d+_/, "");

  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
        active
          ? "bg-brand/15 border border-brand/25"
          : "border border-transparent hover:bg-white/5"
      )}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors",
          active
            ? "bg-brand text-brand-foreground"
            : "bg-white/8 text-white/50 group-hover:bg-white/12 group-hover:text-white/70"
        )}
      >
        {num ?? "·"}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-xs font-medium truncate leading-tight transition-colors",
            active ? "text-amber-300" : "text-white/70 group-hover:text-white"
          )}
        >
          {label}
        </div>
        <div className={cn("text-[10px] mt-0.5 transition-colors", active ? "text-amber-400/50" : "text-white/25")}>
          {fileCount} files
        </div>
      </div>
      {active && <ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0" />}
    </button>
  );
}

function OtherItem({
  node,
  active,
  onSelect,
}: {
  node: ResourceNode;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = ICON_MAP[node.icon ?? ""] ?? FolderOpen;
  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all",
        active
          ? "bg-brand/15 border border-brand/25"
          : "border border-transparent hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-amber-400" : "text-white/35")} />
      <span className={cn("text-xs font-medium truncate", active ? "text-amber-300" : "text-white/55")}>
        {node.name}
      </span>
    </button>
  );
}

function FileRow({ node, onSelect }: { node: ResourceNode; onSelect: (id: string) => void }) {
  const typeColor = FILE_TYPE_COLORS[node.fileType ?? ""] ?? "text-slate-400";
  return (
    <tr
      onClick={() => onSelect(node.id)}
      className="cursor-pointer hover:bg-slate-50 transition-colors group"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <FileText className={cn("w-4 h-4 flex-shrink-0", typeColor)} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{node.name}</div>
            {node.modelerSummary && (
              <div className="text-xs text-slate-400 truncate mt-0.5 max-w-md">{node.modelerSummary}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase">
          {node.fileType}
        </span>
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell text-xs text-slate-400">
        {node.fileSize ? formatFileSize(node.fileSize) : "—"}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.documentId && (
            <>
              <a
                href={`/api/documents/${node.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                title="Open"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
              <a
                href={`/api/documents/${node.documentId}?download=true`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
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
  const folders = node.children?.filter((c) => c.type === "folder") ?? [];
  const files   = node.children?.filter((c) => c.type === "file")   ?? [];

  return (
    <div className="space-y-5">
      {node.quickStart && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 mb-1">Quick Start</h4>
              <p className="text-sm text-amber-800 leading-relaxed">{node.quickStart}</p>
            </div>
          </div>
          {node.toolRoute && (
            <Link
              href={node.toolRoute}
              className="inline-flex items-center gap-1.5 mt-4 ml-11 px-3 py-1.5 text-xs font-semibold text-brand-foreground bg-brand hover:bg-brand/90 rounded-lg transition-colors"
            >
              <Wrench className="w-3 h-3" />
              {node.toolLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {folders.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Folders</h3>
          <div className="grid md:grid-cols-2 gap-2.5">
            {folders.map((folder) => {
              const Icon = ICON_MAP[folder.icon ?? ""] ?? FolderOpen;
              const count = countFiles(folder);
              return (
                <button
                  key={folder.id}
                  onClick={() => onSelect(folder.id)}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary/20 hover:shadow-md transition-all text-left group"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                      {folder.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{count} files</span>
                      {folder.status && <StatusBadge status={folder.status} />}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Files <span className="text-slate-300 font-normal ml-1">({files.length})</span>
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Size</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {files.map((f) => <FileRow key={f.id} node={f} onSelect={onSelect} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <FolderOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No documents in this folder yet.</p>
          <p className="text-xs text-slate-300 mt-1">Content will be added as the project progresses.</p>
        </div>
      )}
    </div>
  );
}

function FileDetailView({ node, onBack }: { node: ResourceNode; onBack: () => void }) {
  const parentPath = getParentPath(node.id) ?? [];
  const typeColor = FILE_TYPE_COLORS[node.fileType ?? ""] ?? "text-slate-400";

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to folder
      </button>

      {parentPath.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-slate-400 flex-wrap">
          {parentPath.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
          <FileText className={cn("w-8 h-8", typeColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-primary leading-tight">{node.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
              {node.fileType}
            </span>
            <span className="text-xs text-slate-400">{node.fileSize ? formatFileSize(node.fileSize) : ""}</span>
          </div>
          {node.documentId && (
            <div className="flex items-center gap-2 mt-4">
              <a
                href={`/api/documents/${node.documentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" /> Open Document
              </a>
              <a
                href={`/api/documents/${node.documentId}?download=true`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </div>
      </div>

      {node.modelerSummary && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" /> What This Document Is
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{node.modelerSummary}</p>
        </div>
      )}

      {node.keyTakeaways && node.keyTakeaways.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
          <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" /> Key Takeaways for Modelers
          </h3>
          <ul className="space-y-2.5">
            {node.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-amber-900">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
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
  const [search, setSearch]     = useState("");
  const [selectedId, setSelectedId] = useState("welcome");

  const selectedNode = findNodeById(selectedId) ?? RESOURCE_TREE;
  const parentPath   = getParentPath(selectedId) ?? [];

  const handleSelect = (id: string) => setSelectedId(id);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    return searchTree(search);
  }, [search]);

  const bimFolders = useMemo(() => {
    return findNodeById("welcome")?.children?.filter((c) => c.type === "folder") ?? [];
  }, []);

  const otherSections = useMemo(() => {
    return RESOURCE_TREE.children?.filter((c) => c.id !== "bim") ?? [];
  }, []);

  function isActive(id: string) {
    return selectedId === id || parentPath.some((p) => p.id === id);
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex-shrink-0 bg-primary">
        <div className="px-5 h-14 flex items-center gap-4">
          <Link
            href="/home"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </Link>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand">
              <BookOpen className="w-3.5 h-3.5 text-brand-foreground" />
            </div>
            <span className="text-sm font-bold text-white">BIM Resources</span>
            <span className="text-white/20 hidden sm:block">·</span>
            <span className="text-xs text-white/35 hidden sm:block">Plansrow</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search documents, specs, guidance…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-8 rounded-xl text-sm text-white placeholder:text-white/30 bg-white/[0.08] border border-white/10 focus:outline-none focus:border-brand/40 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 text-white/40 hover:text-white/70 transition-colors" />
                </button>
              )}
            </div>
          </div>

          <Link
            href="/guide"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
          >
            Playbook <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 hidden lg:flex flex-col overflow-y-auto bg-primary border-r border-white/[0.06]">
          <div className="p-3 space-y-0.5">
            <div className="px-3 py-2.5">
              <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
                BIM Folders
              </div>
            </div>

            {bimFolders.map((folder) => (
              <BIMFolderItem
                key={folder.id}
                node={folder}
                active={isActive(folder.id)}
                onSelect={handleSelect}
              />
            ))}

            <div className="mx-3 my-3 border-t border-white/[0.07]" />

            <div className="px-3 pb-2">
              <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
                More Resources
              </div>
            </div>

            {otherSections.map((section) => (
              <OtherItem
                key={section.id}
                node={section}
                active={isActive(section.id)}
                onSelect={handleSelect}
              />
            ))}

            <div className="h-4" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {searchResults ? (
            /* ── Search results ─────────────────────────────────────────────── */
            <div className="p-6 max-w-4xl">
              <div className="text-xs text-slate-400 mb-4">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
                &ldquo;<span className="text-slate-700 font-semibold">{search}</span>&rdquo;
              </div>
              <div className="space-y-1.5">
                {searchResults.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No results found</p>
                  </div>
                ) : (
                  searchResults.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => { setSearch(""); handleSelect(node.id); }}
                      className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary/20 hover:shadow-sm transition-all text-left"
                    >
                      {node.type === "folder" ? (
                        <FolderOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <FileText
                          className={cn(
                            "w-4 h-4 flex-shrink-0",
                            FILE_TYPE_COLORS[node.fileType ?? ""] ?? "text-slate-400"
                          )}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{node.name}</div>
                        {node.modelerSummary && (
                          <div className="text-xs text-slate-400 truncate mt-0.5">{node.modelerSummary}</div>
                        )}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase flex-shrink-0">
                        {node.type === "folder" ? "Folder" : node.fileType}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* ── Normal view ────────────────────────────────────────────────── */
            <div className="p-6 max-w-4xl">
              {/* Breadcrumb */}
              {parentPath.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-5 flex-wrap">
                  {parentPath.map((p, i) => (
                    <span key={p.id} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                      <button
                        onClick={() => handleSelect(p.id)}
                        className="hover:text-primary transition-colors"
                      >
                        {p.name}
                      </button>
                    </span>
                  ))}
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-800 font-semibold">{selectedNode.name}</span>
                </div>
              )}

              {/* Folder header */}
              {selectedNode.type === "folder" && (
                <div className="mb-6">
                  {(() => {
                    const num  = folderNum(selectedNode.id);
                    const Icon = ICON_MAP[selectedNode.icon ?? ""] ?? FolderOpen;
                    return (
                      <div className="flex items-start gap-4">
                        {num ? (
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-primary-foreground bg-primary flex-shrink-0 shadow-sm"
                          >
                            {num}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-2xl font-bold text-primary leading-tight">
                              {selectedNode.name.replace(/^\d+_/, "")}
                            </h1>
                            {selectedNode.status && <StatusBadge status={selectedNode.status} />}
                          </div>
                          {selectedNode.description && (
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
                              {selectedNode.description}
                            </p>
                          )}
                          {selectedNode.toolRoute && !selectedNode.quickStart && (
                            <Link
                              href={selectedNode.toolRoute}
                              className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              <Wrench className="w-4 h-4" /> {selectedNode.toolLabel}{" "}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {selectedNode.type === "folder" ? (
                <FolderView node={selectedNode} onSelect={handleSelect} />
              ) : (
                <FileDetailView
                  node={selectedNode}
                  onBack={() => {
                    const parent = parentPath[parentPath.length - 1];
                    handleSelect(parent ? parent.id : "welcome");
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
