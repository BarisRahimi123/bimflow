"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAcademyAudio } from "@/components/academy/audio-context";
import { normalizeCues, type AudioCue } from "@/lib/academy/audio-overrides";

/**
 * Shared state for narration → sheet cue authoring.
 *
 * Lives above both the doc page (which renders the left-docked CueRail) and the
 * global MiniPlayer (which renders the "Mark sheet" capture button), so a single
 * draft is edited from either surface. The doc page registers a session via
 * `begin` when an admin plays an uploaded track on a PDF, and `end`s it otherwise.
 */

interface CueSession {
  trackId: string;
  label: string;
  totalPages: number;
}

interface JumpRequest {
  page: number;
  /** monotonic id so the same page can be re-requested */
  n: number;
}

interface CueAuthoringValue {
  /** An authorable track is registered (admin + PDF + uploaded track playing). */
  active: boolean;
  /** Rail expanded. While open, the doc page pauses auto-follow. */
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  totalPages: number;
  viewerPage: number;
  setViewerPage: (page: number) => void;
  draft: AudioCue[];
  dirty: boolean;
  saving: boolean;
  error: string | null;
  /** Last jump-to-sheet request (from clicking a cue). Doc page reacts. */
  jump: JumpRequest | null;
  /** Index of the cue currently in effect at the playhead, or -1. */
  activeIndex: number;

  begin: (session: CueSession & { cues: AudioCue[] }) => void;
  end: () => void;

  mark: () => void;
  removeAt: (index: number) => void;
  setPage: (index: number, page: number) => void;
  setNote: (index: number, note: string) => void;
  gotoCue: (cue: AudioCue) => void;
  save: () => Promise<void>;
  revert: () => void;
}

const Ctx = createContext<CueAuthoringValue | null>(null);

function sameCues(a: AudioCue[], b: AudioCue[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function CueAuthoringProvider({ children }: { children: React.ReactNode }) {
  const { time, seek, setTrackCues } = useAcademyAudio();

  const [session, setSession] = useState<CueSession | null>(null);
  const [serverCues, setServerCues] = useState<AudioCue[]>([]);
  const [draft, setDraft] = useState<AudioCue[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerPage, setViewerPageState] = useState(1);
  const [jump, setJump] = useState<JumpRequest | null>(null);

  // Refs so capture actions read the latest values without re-creating callbacks
  // on every playback tick.
  const lastTrackId = useRef<string | null>(null);
  const sessionRef = useRef<CueSession | null>(null);
  const timeRef = useRef(0);
  const viewerRef = useRef(1);
  sessionRef.current = session;
  timeRef.current = time;
  viewerRef.current = viewerPage;

  const begin = useCallback((s: CueSession & { cues: AudioCue[] }) => {
    setSession((prev) =>
      prev &&
      prev.trackId === s.trackId &&
      prev.totalPages === s.totalPages &&
      prev.label === s.label
        ? prev
        : { trackId: s.trackId, label: s.label, totalPages: s.totalPages },
    );
    if (lastTrackId.current !== s.trackId) {
      lastTrackId.current = s.trackId;
      setServerCues(s.cues);
      setDraft(s.cues);
      setError(null);
      setOpen(false);
    } else {
      setServerCues((prev) => (sameCues(prev, s.cues) ? prev : s.cues));
    }
  }, []);

  const end = useCallback(() => {
    if (sessionRef.current === null) return;
    lastTrackId.current = null;
    setSession(null);
    setServerCues([]);
    setDraft([]);
    setOpen(false);
    setError(null);
  }, []);

  const setViewerPage = useCallback((page: number) => {
    setViewerPageState((prev) => (prev === page ? prev : page));
  }, []);

  const mark = useCallback(() => {
    setDraft((cur) =>
      normalizeCues([...cur, { t: timeRef.current, page: viewerRef.current }]),
    );
    setOpen(true);
  }, []);

  const removeAt = useCallback((index: number) => {
    setDraft((cur) => cur.filter((_, i) => i !== index));
  }, []);

  const setPage = useCallback((index: number, page: number) => {
    setDraft((cur) =>
      normalizeCues(cur.map((c, i) => (i === index ? { ...c, page } : c))),
    );
  }, []);

  const setNote = useCallback((index: number, note: string) => {
    // No normalize here: keep row order stable while typing.
    setDraft((cur) =>
      cur.map((c, i) => (i === index ? { ...c, note: note || undefined } : c)),
    );
  }, []);

  const gotoCue = useCallback(
    (cue: AudioCue) => {
      seek(cue.t);
      setJump({ page: cue.page, n: Date.now() });
    },
    [seek],
  );

  const revert = useCallback(() => {
    setDraft(serverCues);
    setError(null);
  }, [serverCues]);

  const save = useCallback(async () => {
    const trackId = lastTrackId.current;
    if (!trackId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/academy/audio/tracks/${trackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cues: draft }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "Save failed.");
      }
      const data = (await res.json()) as { cues?: AudioCue[] };
      const saved = normalizeCues(data?.cues ?? draft);
      setServerCues(saved);
      setDraft(saved);
      setTrackCues(saved); // live track now auto-follows the new cues
      setOpen(false); // collapse back into the dock
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }, [draft, setTrackCues]);

  const dirty = useMemo(() => !sameCues(draft, serverCues), [draft, serverCues]);

  const activeIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < draft.length; i++) {
      if (draft[i].t <= time + 0.05) idx = i;
      else break;
    }
    return idx;
  }, [draft, time]);

  const value = useMemo<CueAuthoringValue>(
    () => ({
      active: session !== null,
      open,
      setOpen,
      label: session?.label ?? "",
      totalPages: session?.totalPages ?? 0,
      viewerPage,
      setViewerPage,
      draft,
      dirty,
      saving,
      error,
      jump,
      activeIndex,
      begin,
      end,
      mark,
      removeAt,
      setPage,
      setNote,
      gotoCue,
      save,
      revert,
    }),
    [
      session,
      open,
      viewerPage,
      setViewerPage,
      draft,
      dirty,
      saving,
      error,
      jump,
      activeIndex,
      begin,
      end,
      mark,
      removeAt,
      setPage,
      setNote,
      gotoCue,
      save,
      revert,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCueAuthoring() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useCueAuthoring must be used within CueAuthoringProvider");
  return ctx;
}
