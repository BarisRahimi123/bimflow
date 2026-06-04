import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/academy/admin-server";
import { audioObjectPath } from "@/lib/academy/audio-overrides";
import {
  getSupabaseAdmin,
  hasSupabaseServiceRole,
  uploadAudioObject,
} from "@/lib/supabase/admin";

const TABLE = "academy_audio_tracks";

const EXT_CONTENT_TYPE: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  webm: "audio/webm",
};

// Admin only: "promote" a document's built-in (static `/audio/...`) narration
// into a managed `academy_audio_tracks` row, so it gains a trackId and can hold
// page-sync cues. The static file's bytes are copied server-side into the audio
// bucket (the file is public — excluded from auth middleware — so a same-origin
// fetch needs no credentials). After this the narration behaves like any
// uploaded track: the cue authoring rail + "Mark sheet" button light up.
export async function POST(request: NextRequest) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const targetKey = String(body?.targetKey ?? "").trim();
  const src = String(body?.src ?? "").trim();
  const labelInput = String(body?.label ?? "").trim();

  if (!targetKey) return NextResponse.json({ error: "Missing targetKey." }, { status: 400 });
  // Only built-in narration assets may be promoted. Guards against fetching
  // arbitrary URLs (SSRF) via this admin endpoint.
  if (!src.startsWith("/audio/"))
    return NextResponse.json({ error: "Invalid narration source." }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Fetch the static narration bytes from the public origin.
  const fileUrl = new URL(src, request.nextUrl.origin).toString();
  let bytes: ArrayBuffer;
  let contentType: string;
  try {
    const res = await fetch(fileUrl, { cache: "no-store" });
    if (!res.ok)
      return NextResponse.json(
        { error: `Could not read narration file (${res.status}).` },
        { status: 502 },
      );
    bytes = await res.arrayBuffer();
    const header = res.headers.get("content-type") ?? "";
    const ext = (src.split(".").pop() || "mp3").toLowerCase();
    contentType = header.startsWith("audio/")
      ? header
      : EXT_CONTENT_TYPE[ext] ?? "audio/mpeg";
  } catch {
    return NextResponse.json({ error: "Could not read narration file." }, { status: 502 });
  }

  const ext = (src.split(".").pop() || "mp3").toLowerCase();
  const objectPath = audioObjectPath(targetKey, ext, randomUUID());

  const { error: uploadError } = await uploadAudioObject(objectPath, bytes, contentType);
  if (uploadError)
    return NextResponse.json({ error: `Copy failed: ${uploadError}` }, { status: 500 });

  // Next sort position = current max + 1 (0 when empty).
  const { data: existing } = await supabase
    .from(TABLE)
    .select("position")
    .eq("target_key", targetKey)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (existing?.position ?? -1) + 1;

  const label = labelInput || "Narration";

  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert({
      target_key: targetKey,
      label,
      object_path: objectPath,
      content_type: contentType,
      size_bytes: bytes.byteLength,
      position,
      updated_at: new Date().toISOString(),
      updated_by: adminEmail,
    })
    .select("id, label")
    .single();

  if (insertError)
    return NextResponse.json({ error: `Save failed: ${insertError.message}` }, { status: 500 });

  return NextResponse.json({ ok: true, track: inserted });
}
