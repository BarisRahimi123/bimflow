import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/academy/admin-server";
import {
  getSupabaseAdmin,
  hasSupabaseServiceRole,
  deleteAudioObject,
} from "@/lib/supabase/admin";

const TABLE = "academy_audio_tracks";

// Admin only: rename a narration track.
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const label = String(body?.label ?? "").trim();
  if (!label) return NextResponse.json({ error: "Missing label." }, { status: 400 });

  const { error } = await getSupabaseAdmin()
    .from(TABLE)
    .update({ label, updated_at: new Date().toISOString(), updated_by: adminEmail })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Admin only: delete a narration track (storage object + row).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const adminEmail = await requireAdmin();
  if (!adminEmail) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!hasSupabaseServiceRole())
    return NextResponse.json({ error: "Storage not configured." }, { status: 500 });

  const supabase = getSupabaseAdmin();
  const { data: row } = await supabase
    .from(TABLE)
    .select("object_path")
    .eq("id", params.id)
    .maybeSingle();

  if (row?.object_path) await deleteAudioObject(row.object_path as string);

  const { error } = await supabase.from(TABLE).delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
