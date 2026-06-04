import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  hasSupabaseServiceRole,
  createAudioSignedUrl,
} from "@/lib/supabase/admin";

const TABLE = "academy_audio_tracks";

// Any authenticated user (middleware-gated): stream the FIRST narration track
// for a target by 302-redirecting to a fresh short-lived Supabase signed URL.
// Keeps single-play call sites working; the per-track stream lives at
// /api/academy/audio/track/[id]. The signed URL is range-capable so the
// <audio> element gets native seeking.
export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } },
) {
  const targetKey = decodeURIComponent(params.key);
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { data, error } = await getSupabaseAdmin()
    .from(TABLE)
    .select("object_path")
    .eq("target_key", targetKey)
    .order("position", { ascending: true })
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data?.object_path)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  const signedUrl = await createAudioSignedUrl(data.object_path as string, 3600);
  if (!signedUrl)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.redirect(signedUrl, 302);
}
