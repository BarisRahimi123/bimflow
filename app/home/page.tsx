"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileUp,
  LayoutGrid,
  Calculator,
  BookOpen,
  FolderOpen,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

const PHASES = [
  { id: "setup",      number: 1, label: "Project Setup",      steps: ["s1","s2","s3","s4"] },
  { id: "scope",      number: 2, label: "Know Your Scope",     steps: ["s5","s6","s7"] },
  { id: "pid",        number: 3, label: "Read the P&ID",       steps: ["s8","s9"] },
  { id: "model",      number: 4, label: "Model Piping",        steps: ["s10","s11","s12","s13","s14"] },
  { id: "check",      number: 5, label: "Self-Check",          steps: ["s15","s16","s17","s18"] },
  { id: "coordinate", number: 6, label: "Coordinate & Submit", steps: ["s19","s20","s21"] },
  { id: "field",      number: 7, label: "Field & Close-Out",   steps: ["s22","s23"] },
];

const TOTAL_STEPS = PHASES.reduce((s, p) => s + p.steps.length, 0);

interface Project {
  id: string;
  name: string;
  drawingCount?: number;
  updatedAt?: string;
}

export default function HomePage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("pidflow-guide-progress");
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, []);

  const hasProgress = mounted && completed.size > 0;
  const pct = Math.round((completed.size / TOTAL_STEPS) * 100);

  const activePhaseIdx = PHASES.findIndex((p) => !p.steps.every((s) => completed.has(s)));
  const effectiveIdx = activePhaseIdx === -1 ? PHASES.length - 1 : activePhaseIdx;
  const activePhase = PHASES[effectiveIdx];
  const activePhaseCompleted = activePhase.steps.filter((s) => completed.has(s)).length;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />

      <main className="container max-w-6xl flex-1 py-10">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-3">
            {!mounted ? (
              <div className="h-48 animate-pulse rounded-2xl border border-border bg-card" />
            ) : !hasProgress ? (
              /* New user */
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-1 text-lg font-bold">Start here</h2>
                    <p className="mb-4 text-sm text-primary-foreground/70">
                      The Modeler Playbook walks you through all 7 phases — setup, scope, P&ID extraction, modeling,
                      self-check, coordination, and close-out. Checklists, spec references, and tools at every step.
                    </p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {PHASES.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-full border border-brand/25 bg-brand/15 px-2 py-0.5 text-xs font-medium text-brand"
                        >
                          {p.number}. {p.label}
                        </span>
                      ))}
                    </div>
                    <Link href="/guide">
                      <Button className="gap-2 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                        Start Playbook <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Returning user */
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="eyebrow mb-4">Where You Are</div>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">
                      Phase {activePhase.number} of {PHASES.length}
                    </span>
                    <h2 className="text-xl font-bold text-foreground">{activePhase.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activePhaseCompleted} of {activePhase.steps.length} steps complete
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-3xl font-bold text-brand">{pct}%</div>
                    <div className="text-xs text-muted-foreground">{completed.size}/{TOTAL_STEPS} steps</div>
                  </div>
                </div>
                <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/guide">
                    <Button className="gap-2 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                      Continue Playbook <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/guide">
                    <Button variant="outline">View All Steps</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Recent projects */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="eyebrow">Recent Projects</div>
                <Link href="/projects" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  View all →
                </Link>
              </div>

              {loadingProjects ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : projects.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="mb-3 text-sm text-muted-foreground">No projects yet</p>
                  <Link href="/upload">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-3.5 w-3.5" /> Upload your first P&ID
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {projects.map((p) => (
                    <Link key={p.id} href={`/projects/${p.id}`}>
                      <div className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">{p.name}</div>
                          {p.drawingCount !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              {p.drawingCount} drawing{p.drawingCount !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  <Link href="/upload">
                    <div className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border p-3 transition-colors hover:border-brand/40 hover:bg-brand/5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Plus className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" />
                      </div>
                      <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                        New project from P&ID
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right column — Tools + Phase overview */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="eyebrow mb-4">Tools</div>
              <div className="space-y-1.5">
                <ToolCard
                  href="/upload"
                  icon={<FileUp className="h-4 w-4" />}
                  label="Upload P&ID"
                  description="AI extraction"
                  highlight={mounted && (activePhase?.id === "pid" || !hasProgress)}
                />
                <ToolCard
                  href="/calculator"
                  icon={<Calculator className="h-4 w-4" />}
                  label="Support Calculator"
                  description="Span, hardware & vendors"
                  highlight={mounted && activePhase?.id === "model"}
                />
                <ToolCard
                  href="/designer"
                  icon={<LayoutGrid className="h-4 w-4" />}
                  label="Visual Designer"
                  description="Draw pipe runs"
                  highlight={false}
                />
                <ToolCard
                  href="/resources"
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Spec Browser"
                  description="Tolerances, spans, LOD"
                  highlight={mounted && (activePhase?.id === "scope" || activePhase?.id === "check")}
                />
              </div>
            </div>

            {/* All phases mini-list */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="eyebrow mb-3">All Phases</div>
              <div className="space-y-0.5">
                {PHASES.map((phase, idx) => {
                  const done = phase.steps.every((s) => completed.has(s));
                  const active = idx === effectiveIdx && !done;
                  return (
                    <Link key={phase.id} href="/guide">
                      <div
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                          active ? "bg-brand/10 text-foreground" : done ? "text-success" : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                              active ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"
                            )}
                          >
                            {phase.number}
                          </span>
                        )}
                        <span className="truncate font-medium">{phase.label}</span>
                        {active && <span className="ml-auto shrink-0 text-[10px] font-semibold text-brand">current</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function ToolCard({
  href,
  icon,
  label,
  description,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  highlight: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl p-3 transition-all",
          highlight ? "bg-brand/5 ring-1 ring-brand/30" : "hover:bg-accent"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {label}
            {highlight && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-brand-foreground">
                NOW
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
      </div>
    </Link>
  );
}
