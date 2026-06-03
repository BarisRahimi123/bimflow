"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronRight, FileText, Folder, Home, Layers, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACADEMY, flattenDocs, type AcademyDoc, type AcademyFolder } from "@/lib/academy/library";
import { useReviewed } from "@/components/academy/reviewed-context";

const GROUP_ID = "group:bim-standards";

function safeDecode(p: string): string {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

function countDocs(f: AcademyFolder): number {
  return f.docs.length + f.children.reduce((n, c) => n + countDocs(c), 0);
}

/** Build child-id → parent-id map for ancestor expansion. */
function buildParentMap(): Map<string, string | null> {
  const m = new Map<string, string | null>();
  const walk = (folders: AcademyFolder[], parent: string | null) => {
    for (const f of folders) {
      m.set(f.id, parent);
      walk(f.children, f.id);
    }
  };
  walk(ACADEMY, null);
  return m;
}

type LeafState = "done" | "active" | "todo";

function StatusDot({ state }: { state: LeafState }) {
  if (state === "done") {
    return (
      <span
        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500"
        aria-label="Reviewed"
      >
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <svg viewBox="0 0 18 18" className="h-[18px] w-[18px] shrink-0" aria-label="In progress" role="img">
        <circle cx="9" cy="9" r="7.25" fill="none" stroke="hsl(var(--brand))" strokeWidth="1.5" />
        <path d="M9 1.75 A7.25 7.25 0 0 0 9 16.25 Z" fill="hsl(var(--brand))" />
      </svg>
    );
  }
  return (
    <span
      className="h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-white/25"
      aria-label="Not started"
    />
  );
}

export function AcademySidebar() {
  const pathname = usePathname() ?? "";
  const decoded = safeDecode(pathname);
  const { reviewed } = useReviewed();

  const docs = useMemo(() => flattenDocs(), []);
  const parentMap = useMemo(() => buildParentMap(), []);

  const total = docs.length;
  const reviewedCount = useMemo(
    () => docs.reduce((n, d) => (reviewed.has(d.key) ? n + 1 : n), 0),
    [docs, reviewed],
  );
  const pct = total > 0 ? Math.round((reviewedCount / total) * 100) : 0;

  // Resolve the active doc / folder from the URL.
  const activeDocKey = decoded.startsWith("/academy/doc/")
    ? decoded.slice("/academy/doc/".length)
    : null;
  const activeFolderId = activeDocKey
    ? activeDocKey.split(":")[0]
    : decoded.startsWith("/academy/folder/")
      ? decoded.slice("/academy/folder/".length)
      : null;

  // Expansion state. Default-open: the group + the active branch.
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { [GROUP_ID]: true };
    let cur: string | null | undefined = activeFolderId;
    while (cur) {
      init[cur] = true;
      cur = parentMap.get(cur) ?? null;
    }
    return init;
  });

  // Keep the active branch open as the route changes.
  useEffect(() => {
    if (!activeFolderId) return;
    setOpen((prev) => {
      const next: Record<string, boolean> = { ...prev, [GROUP_ID]: prev[GROUP_ID] ?? true };
      let cur: string | null | undefined = activeFolderId;
      let changed = false;
      while (cur) {
        if (!next[cur]) {
          next[cur] = true;
          changed = true;
        }
        cur = parentMap.get(cur) ?? null;
      }
      return changed ? next : prev;
    });
  }, [activeFolderId, parentMap]);

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtering = q.length > 0;

  const docMatches = (d: AcademyDoc) => d.title.toLowerCase().includes(q);
  const folderMatches = (f: AcademyFolder): boolean =>
    f.title.toLowerCase().includes(q) ||
    f.code.toLowerCase().includes(q) ||
    f.docs.some(docMatches) ||
    f.children.some(folderMatches);

  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));
  const isOpen = (id: string) => (filtering ? true : !!open[id]);

  function Leaf({ folderId, d, index, indent }: { folderId: string; d: AcademyDoc; index: number; indent: number }) {
    const key = `${folderId}:${d.id}:${index}`;
    const href = `/academy/doc/${encodeURIComponent(key)}`;
    const isActive = activeDocKey === key;
    const state: LeafState = reviewed.has(key) ? "done" : isActive ? "active" : "todo";

    return (
      <Link
        href={href}
        className={cn(
          "group relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition-colors duration-150",
          isActive
            ? "bg-white/[0.08] font-medium text-white"
            : "text-[#c3cde0] hover:bg-white/[0.05] hover:text-white",
        )}
        style={{ paddingLeft: indent }}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-brand" aria-hidden />
        )}
        <StatusDot state={state} />
        <FileText className="h-3.5 w-3.5 shrink-0 text-[#6f7c95]" />
        <span className="truncate">{d.title}</span>
      </Link>
    );
  }

  function FolderNode({ folder, depth }: { folder: AcademyFolder; depth: number }) {
    if (filtering && !folderMatches(folder)) return null;

    const top = folder.code !== "";
    const opened = isOpen(folder.id);
    const hrefActive = activeFolderId === folder.id && !activeDocKey;
    const count = countDocs(folder);
    const indent = 8 + depth * 14;
    const childIndent = indent + 22;

    const visibleDocs = filtering ? folder.docs.filter(docMatches) : folder.docs;
    const hasContent = folder.docs.length > 0 || folder.children.length > 0;

    return (
      <div>
        <div
          className={cn(
            "group flex items-center gap-1 rounded-md pr-2 transition-colors duration-150",
            hrefActive ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
          )}
          style={{ paddingLeft: indent }}
        >
          {hasContent ? (
            <button
              type="button"
              onClick={() => toggle(folder.id)}
              className="flex h-7 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#6f7c95] transition-colors hover:text-white"
              aria-label={opened ? "Collapse" : "Expand"}
              aria-expanded={opened}
            >
              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-150", opened && "rotate-90")} />
            </button>
          ) : (
            <span className="h-7 w-5 shrink-0" />
          )}

          <Link
            href={`/academy/folder/${folder.id}`}
            className="flex min-w-0 flex-1 items-center gap-2 py-1.5 text-sm"
          >
            {top ? (
              <>
                <Folder className={cn("h-4 w-4 shrink-0", hrefActive ? "text-brand" : "text-[#7e8aa3]")} />
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#6f7c95]">{folder.code}</span>
                <span
                  className={cn(
                    "truncate font-medium",
                    hrefActive ? "text-white" : "text-[#dbe2ef]",
                  )}
                >
                  {folder.title}
                </span>
              </>
            ) : (
              <span className={cn("truncate", hrefActive ? "text-white" : "text-[#aab4c9]")}>{folder.title}</span>
            )}
          </Link>

          <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#6f7c95]">{count}</span>
        </div>

        {hasContent && opened && (
          <div className="mt-0.5 space-y-0.5">
            {visibleDocs.map((d) => (
              <Leaf
                key={`${folder.id}:${d.id}:${folder.docs.indexOf(d)}`}
                folderId={folder.id}
                d={d}
                index={folder.docs.indexOf(d)}
                indent={childIndent}
              />
            ))}
            {folder.children.map((c) => (
              <FolderNode key={c.id} folder={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const groupOpen = isOpen(GROUP_ID);
  const visibleFolders = filtering ? ACADEMY.filter(folderMatches) : ACADEMY;

  return (
    <nav className="flex h-full flex-col bg-[#0d1626] text-[#e8edf6]">
      {/* Brand */}
      <div className="flex shrink-0 items-center gap-3 px-4 pb-4 pt-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand shadow-sm">
          <Layers className="h-5 w-5 text-brand-foreground" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold leading-tight tracking-tight text-white">BIM Hub</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e8aa3]">
            Document Library
          </div>
        </div>
      </div>

      {/* Library Home + filter */}
      <div className="shrink-0 space-y-3 px-3 pb-3">
        <Link
          href="/academy"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150",
            pathname === "/academy"
              ? "bg-white/[0.08] text-white"
              : "text-[#c3cde0] hover:bg-white/[0.05] hover:text-white",
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          Library Home
        </Link>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c95]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documents..."
            aria-label="Filter documents"
            className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-[#67748d] outline-none transition-colors focus:border-brand/60 focus:bg-white/[0.06]"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <button
          type="button"
          onClick={() => toggle(GROUP_ID)}
          className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-white/[0.04]"
          aria-expanded={groupOpen}
        >
          <ChevronRight
            className={cn("h-3.5 w-3.5 shrink-0 text-[#7e8aa3] transition-transform duration-150", groupOpen && "rotate-90")}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-white">BIM Standards &amp; Guides</span>
        </button>

        {groupOpen && (
          <div className="mt-0.5 space-y-0.5">
            {visibleFolders.map((f) => (
              <FolderNode key={f.id} folder={f} depth={0} />
            ))}
            {filtering && visibleFolders.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-[#67748d]">No documents match “{query}”.</p>
            )}
          </div>
        )}
      </div>

      {/* Reviewed progress */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e8aa3]">Reviewed</span>
          <span className="font-mono text-xs tabular-nums text-[#c3cde0]">
            {reviewedCount}/{total}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={reviewedCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Documents reviewed"
        >
          <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </nav>
  );
}
