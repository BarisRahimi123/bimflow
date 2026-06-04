import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/academy/admin-server";
import { audioObjectPath } from "@/lib/academy/audio-overrides";
import {
  getSupabaseAdmin,
  hasSupabaseServiceRole,
  createAudioUploadUrl,
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

// Admin only — phase 1 (sign): the file bytes are NOT sent here. The browser
// uploads them straight to Supabase Storage using the returned signed upload
// URL, which avoids the serverless request-body limit (Vercel caps it at
// ~4.5 MB and rejects larger uploads with HTTP 413). We just mint the path.
export async function POST(request: NextRequest) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const targetKey = String(body?.targetKey ?? "").trim();
  const fileName = String(body?.fileName ?? "").trim();
  const contentType = String(body?.contentType ?? "audio/mpeg");

  if (!targetKey) return NextResponse.json({ error: "Missing targetKey." }, { status: 400 });
  if (!contentType.startsWith("audio/"))
    return NextResponse.json({ error: "File must be an audio file." }, { status: 400 });

  const ext = (fileName.split(".").pop() || "mp3").toLowerCase();
  const objectPath = audioObjectPath(targetKey, ext, randomUUID());

  const signed = await createAudioUploadUrl(objectPath);
  if (!signed)
    return NextResponse.json({ error: "Could not create upload URL." }, { status: 500 });

  return NextResponse.json({ objectPath, path: signed.path, token: signed.token });
}

// Admin only — phase 2 (finalize): after the browser finishes the direct
// upload, it calls this with the small JSON metadata so we record the track.
export async function PUT(request: NextRequest) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const targetKey = String(body?.targetKey ?? "").trim();
  const objectPath = String(body?.objectPath ?? "").trim();
  const contentType = String(body?.contentType ?? "audio/mpeg");
  const size = Number(body?.size ?? 0) || 0;
  const labelInput = String(body?.label ?? "").trim();
  const fileName = String(body?.fileName ?? "").trim();

  if (!targetKey || !objectPath)
    return NextResponse.json({ error: "Missing targetKey or objectPath." }, { status: 400 });

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

  const label =
    labelInput || fileName.replace(/\.[^.]+$/, "") || `Track ${position + 1}`;

  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert({
      target_key: targetKey,
      label,
      object_path: objectPath,
      content_type: contentType,
      size_bytes: size,
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
