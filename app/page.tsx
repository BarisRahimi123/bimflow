import Link from "next/link";
import {
  FileText,
  ArrowRight,
  FileUp,
  Calculator,
  LayoutGrid,
  ShieldCheck,
  Workflow,
  ScanLine,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollVideoBackground } from "@/components/landing/scroll-video-background";

export const metadata = {
  title: "PIDFlow — From P&ID to Revit-ready piping",
  description:
    "PIDFlow turns P&ID drawings into verified, spec-compliant piping models. AI extraction, support calculations, and a guided modeler playbook in one workspace.",
};

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI P&ID extraction",
    body: "Upload a drawing and let Claude Vision pull line tags, equipment, and connections into a structured, reviewable model.",
  },
  {
    icon: Calculator,
    title: "Support calculator",
    body: "Span limits, hardware selection, and vendor lookups grounded in ASME spec citations — no more spreadsheet guesswork.",
  },
  {
    icon: Workflow,
    title: "Guided playbook",
    body: "Seven phases from project setup to field close-out, with checklists and spec references at every step.",
  },
  {
    icon: LayoutGrid,
    title: "Visual designer",
    body: "Sketch pipe runs and lay out routing visually before you commit geometry in Revit.",
  },
];

const STEPS = [
  { n: 1, title: "Upload the P&ID", body: "Drop in a drawing and PIDFlow extracts the line list automatically." },
  { n: 2, title: "Verify & calculate", body: "Engineers confirm tags and run support calcs against live spec data." },
  { n: 3, title: "Export to Revit", body: "Hand off a clean, spec-compliant model ready for coordination." },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Scroll-scrubbed piping footage behind the entire page */}
      <ScrollVideoBackground />

      {/* Marketing header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-brand" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">PIDFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                Get access <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — copy + CTAs sit over the piping background (no solid fill so
            the footage reads through; the video's burned-in intro text is
            skipped, so this HTML is the only copy on screen) */}
        <section className="relative overflow-hidden">
          <div className="container py-20 sm:py-28">
            <div className="max-w-2xl text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-brand" />
                Plansrow
              </div>

              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                From P&ID drawing to{" "}
                <span className="text-brand">Revit-ready piping</span>
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                PIDFlow turns piping diagrams into verified, spec-compliant models. AI extraction,
                support calculations, and a guided modeler playbook — all in one workspace.
              </p>

              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link href="/login">
                  <Button size="lg" className="gap-2 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                    Sign in to your workspace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="gap-2 bg-card/70 backdrop-blur-sm">
                    Request access
                  </Button>
                </Link>
              </div>

              <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Invite-only · access is limited to pre-registered team members
              </p>
            </div>
          </div>
        </section>

        {/* Features — dark, semi-transparent panel so the piping footage shows
            through behind the content */}
        <section className="border-t border-white/10 bg-primary/70 text-primary-foreground backdrop-blur-md">
          <div className="container max-w-6xl py-20">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="eyebrow mb-3 text-brand">What's inside</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything between the drawing and the model
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-primary-foreground/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-background/30 backdrop-blur-sm">
          <div className="container max-w-5xl py-20">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="eyebrow mb-3">How it works</div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three steps from upload to hand-off
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.n}
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="border-t border-border bg-surface/80 backdrop-blur-md">
          <div className="container max-w-5xl py-20">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-2xl" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to model from the drawing?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/70">
                  PIDFlow is currently invite-only. Sign in with your team credentials, or reach out
                  to Plansrow to get your account provisioned.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-2 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                      <FileUp className="h-4 w-4" /> Sign in to PIDFlow
                    </Button>
                  </Link>
                </div>
                <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left text-sm text-primary-foreground/80 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
                  {["Spec-grounded calcs", "Guided playbook", "Revit-ready output"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <FileText className="h-3 w-3 text-brand" />
            </div>
            <span className="text-sm font-semibold text-foreground">PIDFlow</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sign in
            </Link>
            <p className="text-xs text-muted-foreground">Plansrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
