"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as ExcelJS from "exceljs";
import { AlertCircle, Download, ExternalLink, ImageIcon, Loader2, Search, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpreadsheetViewerProps {
  documentId: string;
  className?: string;
}

interface CellImg {
  url: string;
}

interface SheetData {
  name: string;
  rows: string[][];
  cols: number;
  truncatedRows: boolean;
  truncatedCols: boolean;
  /** key `${row}:${col}` (0-based) → images whose top-left anchor sits in that cell. */
  images: Map<string, CellImg[]>;
  imageCount: number;
}

const MAX_ROWS = 2000;
const MAX_COLS = 64;

/** 0-based column index → spreadsheet letter (0→A, 26→AA). */
function colLetter(n: number): string {
  let s = "";
  let x = n;
  do {
    s = String.fromCharCode(65 + (x % 26)) + s;
    x = Math.floor(x / 26) - 1;
  } while (x >= 0);
  return s;
}

/** Flatten any ExcelJS cell value (rich text, hyperlink, formula, date…) to a string. */
function cellToString(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Date) return v.toLocaleDateString();
  if (typeof v === "object") {
    const o = v as unknown as Record<string, unknown>;
    if (Array.isArray(o.richText)) {
      return (o.richText as Array<{ text?: string }>).map((t) => t.text ?? "").join("");
    }
    if ("result" in o) {
      const r = o.result;
      if (r === null || r === undefined) return "";
      return r instanceof Date ? r.toLocaleDateString() : String(r);
    }
    if ("text" in o && o.text != null) return String(o.text);
    if ("hyperlink" in o && o.hyperlink != null) return String(o.hyperlink);
    if ("error" in o && o.error != null) return String(o.error);
  }
  return String(v);
}

export default function SpreadsheetViewer({ documentId, className }: SpreadsheetViewerProps) {
  const [sheets, setSheets] = useState<SheetData[] | null>(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const createdUrls: string[] = [];
    setLoading(true);
    setError(null);
    setSheets(null);
    setActive(0);
    setQuery("");

    fetch(`/api/documents/${documentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load file (${res.status})`);
        return res.arrayBuffer();
      })
      .then(async (buf) => {
        if (cancelled) return;
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buf);
        if (cancelled) return;

        const media = wb.model.media ?? [];
        const urlCache = new Map<number, string | null>();
        const mediaUrl = (id: number): string | null => {
          if (urlCache.has(id)) return urlCache.get(id) ?? null;
          const m = media[id];
          if (!m || m.type !== "image" || !m.buffer) {
            urlCache.set(id, null);
            return null;
          }
          const ext = m.extension === "jpg" ? "jpeg" : m.extension;
          const bytes = new Uint8Array(m.buffer as unknown as Uint8Array);
          const url = URL.createObjectURL(new Blob([bytes], { type: `image/${ext}` }));
          createdUrls.push(url);
          urlCache.set(id, url);
          return url;
        };

        const parsed: SheetData[] = wb.worksheets.map((ws) => {
          const fullCols = ws.columnCount || 0;
          const cols = Math.max(1, Math.min(fullCols, MAX_COLS));
          const fullRows = ws.rowCount || 0;
          const rowLimit = Math.min(fullRows, MAX_ROWS);

          const rows: string[][] = [];
          for (let r = 1; r <= rowLimit; r++) {
            const row = ws.getRow(r);
            const arr: string[] = [];
            for (let c = 1; c <= cols; c++) arr.push(cellToString(row.getCell(c).value));
            rows.push(arr);
          }

          const images = new Map<string, CellImg[]>();
          let imageCount = 0;
          for (const img of ws.getImages()) {
            const { nativeRow: r, nativeCol: c } = img.range.tl;
            if (r >= rows.length || c >= cols) continue;
            const url = mediaUrl(Number(img.imageId));
            if (!url) continue;
            const key = `${r}:${c}`;
            const list = images.get(key) ?? [];
            list.push({ url });
            images.set(key, list);
            imageCount++;
          }

          return {
            name: ws.name,
            rows,
            cols,
            truncatedRows: fullRows > MAX_ROWS,
            truncatedCols: fullCols > MAX_COLS,
            images,
            imageCount,
          };
        });

        if (cancelled) {
          createdUrls.forEach(URL.revokeObjectURL);
          return;
        }
        urlsRef.current = createdUrls;
        setSheets(parsed);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not read spreadsheet");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      createdUrls.forEach(URL.revokeObjectURL);
    };
  }, [documentId]);

  // Revoke on unmount (covers the final mounted set).
  useEffect(() => () => urlsRef.current.forEach(URL.revokeObjectURL), []);

  const sheet = sheets?.[active];

  const matchRows = useMemo(() => {
    if (!sheet || !query.trim()) return null;
    const q = query.toLowerCase();
    const set = new Set<number>();
    sheet.rows.forEach((r, i) => {
      if (r.some((c) => c.toLowerCase().includes(q))) set.add(i);
    });
    return set;
  }, [sheet, query]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30", className)}>
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !sheet) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 bg-muted/30 p-10 text-center", className)}>
        <AlertCircle className="h-8 w-8 text-[hsl(var(--warning))]" />
        <div>
          <p className="text-sm font-medium text-foreground">Couldn&apos;t preview this spreadsheet</p>
          <p className="mt-1 text-xs text-muted-foreground">{error ?? "No sheets found."}</p>
        </div>
        <a
          href={`/api/documents/${documentId}?download=true`}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          <Download className="h-4 w-4" /> Download file
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col bg-muted/20", className)}>
      {/* Toolbar */}
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Table2 className="h-4 w-4 text-brand" />
          <span className="tabular-nums">
            {sheet.rows.length.toLocaleString()} rows × {sheet.cols} cols
          </span>
          {sheet.imageCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand">
              <ImageIcon className="h-3 w-3" />
              {sheet.imageCount} {sheet.imageCount === 1 ? "image" : "images"}
            </span>
          )}
          {(sheet.truncatedRows || sheet.truncatedCols) && (
            <span className="rounded bg-[hsl(var(--warning))]/15 px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--warning))]">
              preview truncated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find in sheet…"
              className="h-7 w-40 rounded-md border border-border bg-background pl-7 pr-2 text-xs outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <a
            href={`/api/documents/${documentId}?download=true`}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2 text-xs font-medium text-muted-foreground hover:bg-accent"
            title="Download original"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Sheet tabs */}
      {sheets && sheets.length > 1 && (
        <div className="flex flex-shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-card px-2 py-1.5">
          {sheets.map((s, i) => (
            <button
              key={s.name + i}
              onClick={() => {
                setActive(i);
                setQuery("");
              }}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                i === active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-accent",
              )}
            >
              {s.name}
              {s.imageCount > 0 && <ImageIcon className="h-3 w-3 opacity-70" />}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="border-collapse text-xs tabular-nums">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 z-20 border-b border-r border-border bg-secondary px-2 py-1" />
              {Array.from({ length: sheet.cols }).map((_, c) => (
                <th
                  key={c}
                  className="min-w-[80px] border-b border-r border-border bg-secondary px-2 py-1 text-left font-mono text-[10px] font-semibold text-muted-foreground"
                >
                  {colLetter(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, r) => {
              if (matchRows && !matchRows.has(r)) return null;
              return (
                <tr key={r} className="hover:bg-accent/40">
                  <td className="sticky left-0 z-10 border-b border-r border-border bg-secondary px-2 py-1 text-right align-top font-mono text-[10px] text-muted-foreground">
                    {r + 1}
                  </td>
                  {row.map((cell, c) => {
                    const imgs = sheet.images.get(`${r}:${c}`);
                    return (
                      <td
                        key={c}
                        className={cn(
                          "border-b border-r border-border bg-card px-2 py-1 align-top text-foreground",
                          imgs ? "min-w-[160px] whitespace-normal" : "max-w-[360px] truncate",
                        )}
                        title={imgs ? undefined : cell}
                      >
                        {imgs ? (
                          <div className="flex flex-col gap-1.5">
                            {cell && <span className="block">{cell}</span>}
                            {imgs.map((im, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={i}
                                src={im.url}
                                alt=""
                                loading="lazy"
                                className="max-h-56 max-w-[220px] rounded border border-border bg-white object-contain"
                              />
                            ))}
                          </div>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {matchRows && matchRows.size === 0 && (
          <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" /> No rows match “{query}”.
          </div>
        )}
      </div>
    </div>
  );
}
