import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/academy/admin-server";
import { ACADEMY, type AcademyFolder } from "@/lib/academy/library";
import { docTargetKey, folderTargetKey } from "@/lib/academy/audio-overrides";
import { SettingsClient, type SettingsGroup } from "./settings-client";

// Reads the session per-request; never prerender.
export const dynamic = "force-dynamic";

function buildGroups(): SettingsGroup[] {
  const groups: SettingsGroup[] = [];
  const walk = (folders: AcademyFolder[], parentTitle?: string) => {
    for (const f of folders) {
      const title = parentTitle ? `${parentTitle} — ${f.title}` : f.title;
      groups.push({
        folderId: f.id,
        title,
        code: f.code,
        overviewTargetKey: folderTargetKey(f.id),
        overviewDefault: f.audioSrc,
        docs: f.docs.map((d, i) => ({
          targetKey: docTargetKey(`${f.id}:${d.id}:${i}`),
          title: d.title,
          fileType: d.fileType,
          defaultSrc: d.audioSrc,
        })),
      });
      walk(f.children, title);
    }
  };
  walk(ACADEMY);
  return groups;
}

export default async function AcademySettingsPage() {
  const adminEmail = await requireAdmin();
  if (!adminEmail) redirect("/academy");
  return <SettingsClient groups={buildGroups()} adminEmail={adminEmail} />;
}
