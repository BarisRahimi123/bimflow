"use client";

import Link from "next/link";
import { ArrowRight, FileText, FolderOpen, GraduationCap, Headphones, Play } from "lucide-react";
import { ACADEMY, academyStats, flattenDocs } from "@/lib/academy/library";
import { useReviewed } from "@/components/academy/reviewed-context";
import { useAcademyAudio } from "@/components/academy/audio-context";

export default function AcademyHome() {
  const stats = academyStats();
  const { reviewed } = useReviewed();
  const { play } = useAcademyAudio();
  const allDocs = flattenDocs();
  const reviewedDocs = allDocs.filter((d) => reviewed.has(d.key)).length;
  const pct = allDocs.length ? Math.round((reviewedDocs / allDocs.length) * 100) : 0;

  return (
    <div className="px-6 py-8 lg:px-10">
      {/* Hero */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-primary p-8 text-primary-foreground">
        <div className="flex items-center gap-2 text-sm font-medium text-brand">
          <GraduationCap className="h-4 w-4" />
          BIM Academy
        </div>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The BIM Welcome Package, guided.
        </h1>
        <p className="mt-3 max-w-2xl text-primary-foreground/70">
          Every standard, guide, and workflow that runs the BIM program — organized folder by folder,
          with narrated walkthroughs you can listen to while you read the source documents.
        </p>
        <div className="mt-6 flex flex-wrap gap-6">
          <Stat icon={FolderOpen} label="Folders" value={stats.folders} />
          <Stat icon={FileText} label="Documents" value={stats.docs} />
          <Stat icon={Headphones} label="Narrated" value={stats.narrated} />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Your progress</h2>
            <p className="text-sm text-muted-foreground">
              {reviewedDocs} of {allDocs.length} documents marked reviewed
            </p>
          </div>
          <span className="font-display text-2xl font-bold text-brand">{pct}%</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Folder grid */}
      <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Welcome Package</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ACADEMY.map((f) => {
          const childDocs = f.docs.length + f.children.reduce((n, c) => n + c.docs.length, 0);
          return (
            <div
              key={f.id}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-brand/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{f.code}</span>
                {f.audioSrc && (
                  <button
                    onClick={() =>
                      play({ src: f.audioSrc!, title: f.title, subtitle: "Folder overview" })
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
                    title="Play overview"
                  >
                    <Play className="ml-0.5 h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Link href={`/academy/folder/${f.id}`} className="mt-2 flex flex-1 flex-col">
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-brand">
                  {f.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-muted-foreground">{f.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{childDocs} documents</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <div>
        <div className="font-display text-xl font-bold leading-none">{value}</div>
        <div className="text-xs text-primary-foreground/60">{label}</div>
      </div>
    </div>
  );
}
