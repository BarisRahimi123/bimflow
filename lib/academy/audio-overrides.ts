/**
 * Audio-override helpers — pure, import-safe on server and client.
 *
 * A "target key" is the stable id narration audio is attached to:
 *  - `doc:<flatKey>`      for an individual document (FlatDoc.key, e.g. f00:cpep-wip:0)
 *  - `folder:<folderId>`  for a folder overview narration
 *
 * A target can have MANY tracks (rows in `academy_audio_tracks`). Each track:
 *  - streams through /api/academy/audio/track/[id], which 302-redirects to a
 *    fresh short-lived Supabase signed URL (range-capable, so seeking works).
 *  - the target-level /api/academy/audio/[key] still resolves to the FIRST
 *    track, keeping single-play call sites working.
 */

// A single sync point: at audio time `t` (seconds) the narration is on PDF
// sheet `page` (1-based). Cues are kept sorted by `t`. Used to drive the PDF
// viewer to the right sheet as a narration track plays ("guided tour").
export interface AudioCue {
  t: number;
  page: number;
  /** Optional admin note for this sync point. Authoring aid only. */
  note?: string;
}

// A narration track as exposed to the client.
export interface AudioTrack {
  id: string;
  label: string;
  /** Manual page-sync cues, sorted by time. Empty when none authored. */
  cues?: AudioCue[];
}

// Normalizes a cue list: coerces numbers, drops invalid entries, sorts by time,
// and collapses cues that land on the same page back-to-back (keeps the first).
export function normalizeCues(input: unknown): AudioCue[] {
  if (!Array.isArray(input)) return [];
  const cues: AudioCue[] = [];
  for (const raw of input) {
    const r = raw as AudioCue;
    const t = Number(r?.t);
    const page = Math.round(Number(r?.page));
    if (!Number.isFinite(t) || t < 0) continue;
    if (!Number.isInteger(page) || page < 1) continue;
    const note = typeof r?.note === "string" ? r.note.trim() : "";
    const cue: AudioCue = { t: Math.round(t * 100) / 100, page };
    if (note) cue.note = note;
    cues.push(cue);
  }
  cues.sort((a, b) => a.t - b.t);
  return cues.filter((c, i) => i === 0 || c.page !== cues[i - 1].page);
}

// The active page for a given playback time: the page of the last cue at/before
// `time`. Returns null when there are no cues or playback is before the first.
export function pageForTime(cues: AudioCue[] | undefined, time: number): number | null {
  if (!cues || cues.length === 0) return null;
  let page: number | null = null;
  for (const c of cues) {
    if (c.t <= time + 0.05) page = c.page;
    else break;
  }
  return page;
}

export function docTargetKey(flatKey: string): string {
  return `doc:${flatKey}`;
}

export function folderTargetKey(folderId: string): string {
  return `folder:${folderId}`;
}

// Target-level stream URL (redirects to the first track for the key).
export function audioProxyUrl(targetKey: string): string {
  return `/api/academy/audio/${encodeURIComponent(targetKey)}`;
}

// Per-track stream URL.
export function audioTrackUrl(trackId: string): string {
  return `/api/academy/audio/track/${encodeURIComponent(trackId)}`;
}

// Sanitizes a target key into a safe storage object path (audio bucket).
// `unique` keeps multiple tracks for the same target from colliding.
export function audioObjectPath(targetKey: string, ext: string, unique?: string): string {
  const safe = targetKey.replace(/[^A-Za-z0-9._-]/g, "_");
  const cleanExt = ext.replace(/[^A-Za-z0-9]/g, "").toLowerCase() || "mp3";
  const suffix = unique ? `_${unique.replace(/[^A-Za-z0-9]/g, "")}` : "";
  return `${safe}${suffix}.${cleanExt}`;
}
