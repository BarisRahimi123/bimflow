import { createClient } from "@/lib/supabase/client";

// Bucket that holds admin-uploaded narration audio (private). Mirrors
// AUDIO_BUCKET in lib/supabase/admin.ts (kept here to avoid importing the
// server-only admin module into a client bundle).
const AUDIO_BUCKET = "academy-audio";

export interface UploadedTrack {
  id: string;
  label: string;
}

// Uploads a narration audio file for a target (document or folder overview).
//
// Bytes go DIRECTLY from the browser to Supabase Storage via a one-time signed
// upload URL, so they never pass through our serverless function — this is what
// avoids Vercel's ~4.5 MB request-body limit (HTTP 413). The function only
// handles tiny JSON: minting the upload URL (POST) and recording the row (PUT).
export async function uploadAudioTrack(
  targetKey: string,
  file: File,
  label?: string,
): Promise<UploadedTrack> {
  const contentType = file.type || "audio/mpeg";

  // Phase 1: ask the server for a signed upload URL + storage path.
  const signRes = await fetch("/api/academy/audio/overrides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetKey, fileName: file.name, contentType }),
  });
  if (!signRes.ok) {
    const msg = await signRes.json().catch(() => ({}));
    throw new Error(msg?.error || "Could not start upload.");
  }
  const { objectPath, path, token } = (await signRes.json()) as {
    objectPath: string;
    path: string;
    token: string;
  };

  // Phase 2: upload the bytes straight to Supabase (no size cap from our host).
  const supabase = createClient();
  const { error: uploadError } = await supabase.storage
    .from(AUDIO_BUCKET)
    .uploadToSignedUrl(path, token, file, { contentType });
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Phase 3: finalize — record the track row pointing at the uploaded object.
  const finalizeRes = await fetch("/api/academy/audio/overrides", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetKey,
      objectPath,
      contentType,
      size: file.size,
      fileName: file.name,
      label: label ?? "",
    }),
  });
  if (!finalizeRes.ok) {
    const msg = await finalizeRes.json().catch(() => ({}));
    throw new Error(msg?.error || "Could not save track.");
  }
  const data = (await finalizeRes.json()) as { track: UploadedTrack };
  return data.track;
}

// Promotes a document's built-in (static `/audio/...`) narration into a managed
// track so it can hold page-sync cues. The bytes are copied server-side from the
// public file — nothing is uploaded from the browser — so there is no body-size
// limit to worry about here.
export async function promoteBuiltinTrack(
  targetKey: string,
  src: string,
  label?: string,
): Promise<UploadedTrack> {
  const res = await fetch("/api/academy/audio/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetKey, src, label: label ?? "" }),
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(msg?.error || "Could not enable sync.");
  }
  const data = (await res.json()) as { track: UploadedTrack };
  return data.track;
}
