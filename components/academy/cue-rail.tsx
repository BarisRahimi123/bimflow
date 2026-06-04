"use client";

import {
  Loader2,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtTime } from "@/components/academy/audio-context";
import { useCueAuthoring } from "@/components/academy/cue-authoring-context";

/**
 * Left-docked, collapsible narration-cue authoring rail.
 *
 * Sits flush against the library nav, on the left edge of the PDF. Collapsed it
 * is a slim spine showing the cue count; expanded it lists each cue as an
 * editable card (timestamp → sheet + optional note). Capture happens from the
 * "Mark sheet" button in the bottom player; this rail manages and persists the
 * list. Renders nothing unless an authorable track is registered.
 */
export function CueRail() {
  const {
    active,
    open,
    setOpen,
    label,
    totalPages,
    draft,
    dirty,
    saving,
    error,
    activeIndex,
    removeAt,
    setPage,
    setNote,
    gotoCue,
    save,
    revert,
  } = useCueAuthoring();

  if (!active) return null;

  const count = draft.length;

  // ---- Collapsed: slim docked spine ---------------------------------------
  if (!open) {
    return (
      <div className="flex h-full w-11 shrink-0 flex-col items-center gap-3 border-r border-border bg-muted/40 py-3">
        <button
          onClick={() => setOpen(true)}
          title="Open narration cues"
          aria-label="Open narration cues"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <div className="relative">
          <MapPin className="h-4 w-4 text-brand" />
          {dirty && (
            <span
              className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-background"
              title="Unsaved changes"
            />
          )}
        </div>
        {count > 0 && (
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-brand">
            {count}
          </span>
        )}
        <span className="mt-1 select-none text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground [writing-mode:vertical-rl]">
          Cues
        </span>
      </div>
    );
  }

  // ---- Expanded: full authoring column ------------------------------------
  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-brand" />
            Narration cues
          </span>
          <button
            onClick={() => setOpen(false)}
            title="Collapse"
            aria-label="Collapse narration cues"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground" title={label}>
          {label}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <span className="tabular-nums text-muted-foreground">
            {count} {count === 1 ? "cue" : "cues"}
          </span>
          {dirty && (
            <span className="font-medium text-amber-500">· Unsaved</span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {count === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs leading-relaxed text-muted-foreground">
            No cues yet. Play the narration, scroll to the right sheet, then press{" "}
            <span className="font-medium text-foreground">Mark sheet</span> in the
            player below.
          </div>
        ) : (
          <ul className="space-y-2">
            {draft.map((c, i) => (
              <li
                key={`${c.t}-${i}`}
                className={cn(
                  "rounded-lg border bg-background p-2.5 transition-colors",
                  i === activeIndex
                    ? "border-brand/40 bg-brand/5"
                    : "border-border",
                )}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => gotoCue(c)}
                    title="Jump to this point"
                    className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums text-brand transition-colors hover:bg-brand/10"
                  >
                    {fmtTime(c.t)}
                  </button>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    Sheet
                    <input
                      type="number"
                      min={1}
                      max={totalPages || undefined}
                      value={c.page}
                      onChange={(e) =>
                        setPage(i, parseInt(e.target.value, 10) || 1)
                      }
                      className="w-14 rounded border border-border bg-background px-1.5 py-0.5 text-xs tabular-nums text-foreground focus:border-brand focus:outline-none"
                    />
                  </label>
                  <button
                    onClick={() => removeAt(i)}
                    title="Delete cue"
                    aria-label={`Delete cue at ${fmtTime(c.t)}`}
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <textarea
                  value={c.note ?? ""}
                  onChange={(e) => setNote(i, e.target.value)}
                  placeholder="Add a note (optional)"
                  rows={2}
                  className="mt-2 w-full resize-none rounded border border-border bg-background px-2 py-1.5 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                />
              </li>
            ))}
          </ul>
        )}

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <button
          onClick={() => void save()}
          disabled={!dirty || saving}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save cues
        </button>
        <button
          onClick={revert}
          disabled={!dirty || saving}
          title="Revert to last saved"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Revert
        </button>
      </div>
    </div>
  );
}
