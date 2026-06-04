import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  hasSupabaseServiceRole,
  createAudioSignedUrl,
} from "@/lib/supabase/admin";

const TABLE = "academy_audio_tracks";

// Any authenticated user (middleware-gated): stream a single narration track by
// 302-redirecting to a fresh short-lived Supabase signed URL (range-capable, so
// the <audio> element gets native seeking).
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { data, error } = await getSupabaseAdmin()
    .from(TABLE)
    .select("object_path")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data?.object_path)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  const signedUrl = await createAudioSignedUrl(data.object_path as string, 3600);
  if (!signedUrl)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.redirect(signedUrl, 302);
}
