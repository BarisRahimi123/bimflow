"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  Folder,
  Headphones,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFolder,
  flattenDocs,
  type AcademyDoc,
  type AcademyFolder,
} from "@/lib/academy/library";
import { useReviewed } from "@/components/academy/reviewed-context";
import { useAcademyAudio } from "@/components/academy/audio-context";
import { useAudioOverrides } from "@/components/academy/audio-overrides-context";
import { docTargetKey, folderTargetKey } from "@/lib/academy/audio-overrides";

export default function FolderPage({ params }: { params: { folderId: string } }) {
  const folder = getFolder(params.folderId);
  if (!folder) notFound();

  const { play } = useAcademyAudio();
  const { resolve } = useAudioOverrides();
  const overviewSrc = folder
    ? resolve(folderTargetKey(folder.id), folder.audioSrc)
    : undefined;

  return (
    <div className="px-6 py-8 lg:px-10">
      <Link
        href="/academy"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Academy Home
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {folder.code && (
              <span className="font-mono text-xs text-muted-foreground">Folder {folder.code}</span>
            )}
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
              {folder.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{folder.summary}</p>
          </div>
          {overviewSrc && (
            <button
              onClick={() =>
                play({ src: overviewSrc, title: folder.title, subtitle: "Folder overview" })
              }
              className="flex shrink-0 items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              <Headphones className="h-4 w-4" />
              Play overview
            </button>
          )}
        </div>
      </div>

      {folder.docs.length > 0 && (
        <section className="mt-6">
          <DocList docs={folder.docs} folderId={folder.id} />
        </section>
      )}

      {folder.children.map((child) => (
        <Subfolder key={child.id} folder={child} />
      ))}
    </div>
  );
}

function Subfolder({ folder }: { folder: AcademyFolder }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Folder className="h-4 w-4 text-brand" />
        <h2 className="font-display text-base font-semibold text-foreground">{folder.title}</h2>
        <span className="text-xs text-muted-foreground">{folder.docs.length} docs</span>
      </div>
      <DocList docs={folder.docs} folderId={folder.id} />
    </section>
  );
}

function DocList({ docs, folderId }: { docs: AcademyDoc[]; folderId: string }) {
  const { isReviewed, toggle } = useReviewed();
  const { play, track, playing } = useAcademyAudio();
  const { resolve } = useAudioOverrides();
  const flat = flattenDocs();

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {docs.map((d, i) => {
        const key = `${folderId}:${d.id}:${i}`;
        const reviewed = isReviewed(key);
        // resolve the canonical flat key (handles duplicate ids)
        const flatKey =
          flat.find((f) => f.folderId === folderId && f.id === d.id)?.key ?? key;
        const audioSrc = resolve(docTargetKey(flatKey), d.audioSrc);
        const isCurrent = !!audioSrc && track?.src === audioSrc;
        return (
          <div key={key} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/40">
            <button
              onClick={() => toggle(key)}
              className="shrink-0"
              title={reviewed ? "Mark not reviewed" : "Mark reviewed"}
            >
              {reviewed ? (
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50" />
              )}
            </button>

            <Link
              href={`/academy/doc/${encodeURIComponent(flatKey)}`}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{d.title}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {d.fileType}
                </span>
              </span>
            </Link>

            {audioSrc && (
              <button
                onClick={() => play({ src: audioSrc, title: d.title, docKey: flatKey })}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                  isCurrent && playing
                    ? "bg-brand text-brand-foreground"
                    : "bg-accent text-accent-foreground hover:bg-brand hover:text-brand-foreground",
                )}
                title="Play narration"
              >
                <Play className="ml-0.5 h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
