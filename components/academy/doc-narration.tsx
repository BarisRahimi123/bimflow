"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Headphones,
  Loader2,
  MapPin,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/academy/admin";
import { useAcademyAudio } from "@/components/academy/audio-context";
import { useAudioOverrides } from "@/components/academy/audio-overrides-context";
import {
  audioTrackUrl,
  type AudioCue,
  type AudioTrack,
} from "@/lib/academy/audio-overrides";
import {
  promoteBuiltinTrack,
  uploadAudioTrack,
} from "@/lib/academy/upload-audio-track";

interface PlayableTrack {
  key: string;
  label: string;
  src: string;
  /** uploaded-track id (absent for built-in narration) */
  trackId?: string;
  cues?: AudioCue[];
}

// Doc-page narration control. Plays the document's narration and, when it has
// more than one track, offers a dropdown to pick which to hear — all routed to
// the global bottom mini-player. Admins get an inline "add track" affordance.
export function DocNarration({
  targetKey,
  title,
  docKey,
  defaultSrc,
  syncable = false,
}: {
  targetKey: string;
  title: string;
  docKey: string;
  defaultSrc?: string;
  /** PDF docs only: admins can promote built-in narration to enable cue sync. */
  syncable?: boolean;
}) {
  const { play, toggle, track, playing } = useAcademyAudio();
  const { refresh } = useAudioOverrides();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const loadTracks = async () => {
    try {
      const res = await fetch(
        `/api/academy/audio/tracks?targetKey=${encodeURIComponent(targetKey)}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = await res.json();
      setTracks(data?.tracks ?? []);
    } catch {
      // Non-fatal: built-in narration keeps working.
    }
  };

  useEffect(() => {
    void loadTracks();
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsAdmin(isAdminEmail(data.user?.email)))
      .catch(() => setIsAdmin(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey]);

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Uploaded tracks replace the built-in narration; otherwise fall back to it.
  const sources: PlayableTrack[] =
    tracks.length > 0
      ? tracks.map((t) => ({
          key: t.id,
          label: t.label,
          src: audioTrackUrl(t.id),
          trackId: t.id,
          cues: t.cues ?? [],
        }))
      : defaultSrc
        ? [{ key: "__default", label: "Narration", src: defaultSrc }]
        : [];

  const current = sources.find((s) => s.src === track?.src) ?? null;

  async function onPick(file: File) {
    setBusy(true);
    try {
      // Bytes upload straight to storage (bypasses the host's body-size limit).
      await uploadAudioTrack(targetKey, file);
      await Promise.all([loadTracks(), refresh()]);
    } catch {
      // Swallow: row stays as-is on failure.
    } finally {
      setBusy(false);
    }
  }

  // Copy the built-in narration into a managed track (gains a trackId → cue
  // authoring works), then auto-play it so the rail + Mark button appear.
  async function onEnableSync() {
    if (!defaultSrc) return;
    setSyncing(true);
    try {
      const created = await promoteBuiltinTrack(targetKey, defaultSrc);
      await Promise.all([loadTracks(), refresh()]);
      play({
        src: audioTrackUrl(created.id),
        title,
        docKey,
        trackId: created.id,
        cues: [],
      });
    } catch {
      // Swallow: built-in narration keeps working unchanged on failure.
    } finally {
      setSyncing(false);
    }
  }

  // Built-in narration not yet promoted → offer the one-click sync enabler.
  const SyncButton =
    isAdmin && syncable && tracks.length === 0 && defaultSrc ? (
      <button
        onClick={onEnableSync}
        disabled={syncing}
        title="Copy this narration into a managed track so you can mark page-sync cues"
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-50"
      >
        {syncing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <MapPin className="h-3.5 w-3.5" />
        )}
        {syncing ? "Enabling…" : "Enable sync"}
      </button>
    ) : null;

  function playTrack(t: PlayableTrack) {
    setOpen(false);
    play({
      src: t.src,
      title: sources.length > 1 ? `${title} — ${t.label}` : title,
      docKey,
      trackId: t.trackId,
      cues: t.cues,
    });
  }

  const AddButton = isAdmin ? (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onPick(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Add another narration track"
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        {sources.length === 0 ? "Add narration" : "Add track"}
      </button>
    </>
  ) : null;

  // No audio and not an admin → render nothing.
  if (sources.length === 0) return AddButton;

  // Single track → simple play/pause toggle.
  if (sources.length === 1) {
    const only = sources[0];
    const active = current?.key === only.key;
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => (active ? toggle() : playTrack(only))}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
            active && playing
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          {active && playing ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Headphones className="h-3.5 w-3.5" />
          )}
          {active && playing ? "Pause narration" : "Play narration"}
        </button>
        {SyncButton}
        {AddButton}
      </div>
    );
  }

  // Multiple tracks → button + dropdown picker.
  return (
    <div className="flex items-center gap-2">
      <div ref={wrapRef} className="relative">
        <button
          onClick={() => (current && playing ? toggle() : setOpen((o) => !o))}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
            current && playing
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          {current && playing ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Headphones className="h-3.5 w-3.5" />
          )}
          {current && playing
            ? `Pause · ${current.label}`
            : `Narration · ${sources.length} tracks`}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>

        {open && (
          <div className="absolute right-0 z-30 mt-1 w-60 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg">
            <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Choose a track
            </p>
            {sources.map((s) => {
              const active = current?.key === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => playTrack(s)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent",
                    active ? "text-brand" : "text-foreground",
                  )}
                >
                  {active && playing ? (
                    <Pause className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Play className="ml-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {AddButton}
    </div>
  );
}
