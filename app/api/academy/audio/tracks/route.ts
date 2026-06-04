import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseServiceRole } from "@/lib/supabase/admin";
import { normalizeCues, type AudioTrack } from "@/lib/academy/audio-overrides";

const TABLE = "academy_audio_tracks";

// Any authenticated user (middleware-gated):
//  - with ?targetKey=… : the ordered tracks for that one target (doc-page picker)
//  - without targetKey  : every track grouped by target_key (Settings manager),
//    so the page makes a single request instead of one per row.
export async function GET(request: NextRequest) {
  const targetKey = request.nextUrl.searchParams.get("targetKey")?.trim();
  if (!hasSupabaseServiceRole())
    return NextResponse.json(targetKey ? { tracks: [] } : { byTarget: {} });

  let query = getSupabaseAdmin()
    .from(TABLE)
    .select("id, label, position, target_key, cues")
    .order("position", { ascending: true })
    .order("updated_at", { ascending: true });
  if (targetKey) query = query.eq("target_key", targetKey);

  const { data, error } = await query;
  if (error)
    return NextResponse.json(targetKey ? { tracks: [] } : { byTarget: {} });

  const toTrack = (t: Record<string, unknown>): AudioTrack => ({
    id: t.id as string,
    label: t.label as string,
    cues: normalizeCues(t.cues),
  });

  if (targetKey) {
    return NextResponse.json({ tracks: (data ?? []).map(toTrack) });
  }

  const byTarget: Record<string, AudioTrack[]> = {};
  for (const t of data ?? []) {
    const key = t.target_key as string;
    (byTarget[key] ??= []).push(toTrack(t));
  }
  return NextResponse.json({ byTarget });
}
