import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseServiceRole } from "@/lib/supabase/admin";

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
    .select("id, label, position, target_key")
    .order("position", { ascending: true })
    .order("updated_at", { ascending: true });
  if (targetKey) query = query.eq("target_key", targetKey);

  const { data, error } = await query;
  if (error)
    return NextResponse.json(targetKey ? { tracks: [] } : { byTarget: {} });

  if (targetKey) {
    return NextResponse.json({
      tracks: (data ?? []).map((t) => ({ id: t.id as string, label: t.label as string })),
    });
  }

  const byTarget: Record<string, { id: string; label: string }[]> = {};
  for (const t of data ?? []) {
    const key = t.target_key as string;
    (byTarget[key] ??= []).push({ id: t.id as string, label: t.label as string });
  }
  return NextResponse.json({ byTarget });
}
