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

// Any authenticated user (middleware-gated): list the distinct target keys that
// have at least one narration track, so the client can resolve which targets
// have audio (override resolution).
export async function GET() {
  if (!hasSupabaseServiceRole()) return NextResponse.json([]);
  const { data, error } = await getSupabaseAdmin().from(TABLE).select("target_key");
  if (error) return NextResponse.json([]);
  const keys = Array.from(new Set((data ?? []).map((r) => r.target_key as string)));
  return NextResponse.json(keys);
}

// Admin only: append a new narration track to a target (document or folder
// overview). Multiple tracks per target are allowed; each gets its own object.
export async function POST(request: NextRequest) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const form = await request.formData();
  const targetKey = String(form.get("targetKey") ?? "").trim();
  const file = form.get("file");
  const labelInput = String(form.get("label") ?? "").trim();

  if (!targetKey) return NextResponse.json({ error: "Missing targetKey." }, { status: 400 });
  if (!(file instanceof File))
    return NextResponse.json({ error: "Missing file." }, { status: 400 });

  const contentType = file.type || "audio/mpeg";
  if (!contentType.startsWith("audio/"))
    return NextResponse.json({ error: "File must be an audio file." }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Next sort position = current max + 1 (0 when empty).
  const { data: existing } = await supabase
    .from(TABLE)
    .select("position")
    .eq("target_key", targetKey)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (existing?.position ?? -1) + 1;

  const ext = (file.name.split(".").pop() || "mp3").toLowerCase();
  const objectPath = audioObjectPath(targetKey, ext, randomUUID());
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await uploadAudioObject(objectPath, bytes, contentType);
  if (uploadError)
    return NextResponse.json({ error: `Upload failed: ${uploadError}` }, { status: 500 });

  const label = labelInput || file.name.replace(/\.[^.]+$/, "") || `Track ${position + 1}`;

  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert({
      target_key: targetKey,
      label,
      object_path: objectPath,
      content_type: contentType,
      size_bytes: bytes.length,
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
