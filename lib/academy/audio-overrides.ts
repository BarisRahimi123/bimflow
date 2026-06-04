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

// A narration track as exposed to the client.
export interface AudioTrack {
  id: string;
  label: string;
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
