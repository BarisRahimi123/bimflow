"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Headphones,
  Loader2,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcademyAudio } from "@/components/academy/audio-context";
import { useAudioOverrides } from "@/components/academy/audio-overrides-context";
import { audioTrackUrl, type AudioTrack } from "@/lib/academy/audio-overrides";

export interface SettingsDoc {
  targetKey: string;
  title: string;
  fileType: string;
  defaultSrc?: string;
}

export interface SettingsGroup {
  folderId: string;
  title: string;
  code: string;
  overviewTargetKey: string;
  overviewDefault?: string;
  docs: SettingsDoc[];
}

export function SettingsClient({
  groups,
  adminEmail,
}: {
  groups: SettingsGroup[];
  adminEmail: string;
}) {
  const { refresh } = useAudioOverrides();
  const [tracksByTarget, setTracksByTarget] = useState<Record<string, AudioTrack[]>>({});
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const reloadTracks = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/audio/tracks", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setTracksByTarget(data?.byTarget ?? {});
    } catch {
      // Non-fatal.
    }
  }, []);

  useEffect(() => {
    void reloadTracks();
  }, [reloadTracks]);

  const setRowBusy = (key: string, on: boolean) =>
    setBusy((prev) => {
      const next = new Set(prev);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });

  const sync = useCallback(async () => {
    await Promise.all([reloadTracks(), refresh()]);
  }, [reloadTracks, refresh]);

  async function addTrack(targetKey: string, file: File) {
    setError(null);
    setRowBusy(targetKey, true);
    try {
      const form = new FormData();
      form.set("targetKey", targetKey);
      form.set("file", file);
      const res = await fetch("/api/academy/audio/overrides", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Upload failed (${res.status}).`);
      }
      await sync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setRowBusy(targetKey, false);
    }
  }

  async function renameTrack(id: string, label: string) {
    setError(null);
    try {
      const res = await fetch(`/api/academy/audio/tracks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Rename failed (${res.status}).`);
      }
      await reloadTracks();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rename failed.");
    }
  }

  async function deleteTrack(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/academy/audio/tracks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Remove failed (${res.status}).`);
      }
      await sync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed.");
    }
  }

  const overrideCount = Object.keys(tracksByTarget).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Narration audio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add one or more narration tracks to any document or folder overview.
          Uploaded tracks override the built-in narration everywhere it plays —
          when there are several, listeners pick which one to hear.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{adminEmail}</span>
          {" · "}
          {overrideCount} target{overrideCount === 1 ? "" : "s"} with custom audio
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {groups.map((g) => (
          <section
            key={g.folderId}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-2 border-b border-border bg-accent/30 px-4 py-2.5">
              {g.code && (
                <span className="rounded bg-brand/10 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-brand">
                  {g.code}
                </span>
              )}
              <h2 className="truncate text-sm font-semibold text-foreground">{g.title}</h2>
            </div>

            <ul className="divide-y divide-border">
              <AudioRow
                label="Folder overview narration"
                isFolder
                targetKey={g.overviewTargetKey}
                defaultSrc={g.overviewDefault}
                tracks={tracksByTarget[g.overviewTargetKey] ?? []}
                busy={busy.has(g.overviewTargetKey)}
                onAdd={addTrack}
                onRename={renameTrack}
                onDelete={deleteTrack}
              />
              {g.docs.map((d) => (
                <AudioRow
                  key={d.targetKey}
                  label={d.title}
                  fileType={d.fileType}
                  targetKey={d.targetKey}
                  defaultSrc={d.defaultSrc}
                  tracks={tracksByTarget[d.targetKey] ?? []}
                  busy={busy.has(d.targetKey)}
                  onAdd={addTrack}
                  onRename={renameTrack}
                  onDelete={deleteTrack}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function AudioRow({
  label,
  fileType,
  isFolder,
  targetKey,
  defaultSrc,
  tracks,
  busy,
  onAdd,
  onRename,
  onDelete,
}: {
  label: string;
  fileType?: string;
  isFolder?: boolean;
  targetKey: string;
  defaultSrc?: string;
  tracks: AudioTrack[];
  busy: boolean;
  onAdd: (targetKey: string, file: File) => void;
  onRename: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasTracks = tracks.length > 0;

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        {isFolder ? (
          <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-foreground">{label}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <StatusBadge tracks={tracks.length} hasDefault={!!defaultSrc} />
            {fileType && (
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {fileType}
              </span>
            )}
          </div>

          {/* Track list */}
          <ul className="mt-2 space-y-1">
            {hasTracks
              ? tracks.map((t) => (
                  <TrackItem
                    key={t.id}
                    src={audioTrackUrl(t.id)}
                    title={`${label} — ${t.label}`}
                    label={t.label}
                    onRename={(name) => onRename(t.id, name)}
                    onDelete={() => onDelete(t.id)}
                  />
                ))
              : defaultSrc && (
                  <TrackItem
                    src={defaultSrc}
                    title={label}
                    label="Built-in narration"
                    builtIn
                  />
                )}
          </ul>

          {/* Add */}
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onAdd(targetKey, file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Add audio track
          </button>
        </div>
      </div>
    </li>
  );
}

function TrackItem({
  src,
  title,
  label,
  builtIn,
  onRename,
  onDelete,
}: {
  src: string;
  title: string;
  label: string;
  builtIn?: boolean;
  onRename?: (label: string) => void;
  onDelete?: () => void;
}) {
  const { play, toggle, track, playing } = useAcademyAudio();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const isCurrent = track?.src === src;

  useEffect(() => setDraft(label), [label]);

  function commit() {
    const name = draft.trim();
    setEditing(false);
    if (name && name !== label) onRename?.(name);
    else setDraft(label);
  }

  return (
    <li className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-2 py-1.5">
      <button
        onClick={() => (isCurrent ? toggle() : play({ src, title }))}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-accent"
        title={isCurrent && playing ? "Pause" : "Play"}
      >
        {isCurrent && playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="ml-0.5 h-3.5 w-3.5" />
        )}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(label);
              setEditing(false);
            }
          }}
          className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground outline-none focus:border-brand"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-xs text-foreground">{label}</span>
      )}

      {builtIn ? (
        <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Default
        </span>
      ) : (
        <div className="flex shrink-0 items-center gap-0.5">
          {editing ? (
            <>
              <button
                onClick={commit}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"
                title="Save name"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  setDraft(label);
                  setEditing(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"
                title="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent"
                title="Rename track"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete track"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

function StatusBadge({ tracks, hasDefault }: { tracks: number; hasDefault: boolean }) {
  if (tracks > 0)
    return (
      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
        {tracks} track{tracks === 1 ? "" : "s"}
      </span>
    );
  if (hasDefault)
    return (
      <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        Default
      </span>
    );
  return (
    <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      No audio
    </span>
  );
}
