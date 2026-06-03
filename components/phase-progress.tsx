"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// Public pages (landing + login) should not show the in-app workflow nav.
const HIDDEN_ON = ["/", "/login"];

const PHASES = [
  { id: "setup",      number: 1, label: "Setup",      steps: ["s1","s2","s3","s4"] },
  { id: "scope",      number: 2, label: "Scope",       steps: ["s5","s6","s7"] },
  { id: "pid",        number: 3, label: "P&ID",        steps: ["s8","s9"] },
  { id: "model",      number: 4, label: "Model",       steps: ["s10","s11","s12","s13","s14"] },
  { id: "check",      number: 5, label: "Self-Check",  steps: ["s15","s16","s17","s18"] },
  { id: "coordinate", number: 6, label: "Submit IFF",  steps: ["s19","s20","s21"] },
  { id: "field",      number: 7, label: "Close-Out",   steps: ["s22","s23"] },
];

export default function PhaseProgress() {
  const pathname = usePathname();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("pidflow-guide-progress");
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  if (!mounted) return null;
  if (HIDDEN_ON.includes(pathname)) return null;

  const totalCompleted = completed.size;
  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const overallPct = Math.round((totalCompleted / totalSteps) * 100);

  // Current phase = first phase that isn't fully complete
  const currentPhaseIdx = PHASES.findIndex(
    (p) => !p.steps.every((s) => completed.has(s))
  );
  const activeIdx = currentPhaseIdx === -1 ? PHASES.length - 1 : currentPhaseIdx;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-700 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Playbook link */}
        <Link
          href="/guide"
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors shrink-0 text-xs font-medium"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Playbook</span>
        </Link>

        <div className="w-px h-4 bg-slate-700 shrink-0" />

        {/* Phase chips */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {PHASES.map((phase, idx) => {
            const phaseCompleted = phase.steps.every((s) => completed.has(s));
            const isActive = idx === activeIdx;
            const isFuture = idx > activeIdx;

            return (
              <Link key={phase.id} href="/guide">
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap transition-colors",
                    phaseCompleted && "text-emerald-400",
                    isActive && !phaseCompleted && "bg-blue-600 text-white",
                    isFuture && "text-slate-500",
                    !isActive && !phaseCompleted && !isFuture && "text-emerald-400"
                  )}
                >
                  {phaseCompleted ? (
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                  ) : (
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        isActive ? "bg-white/20" : "bg-slate-700"
                      )}
                    >
                      {phase.number}
                    </span>
                  )}
                  <span className="hidden md:inline">{phase.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="w-px h-4 bg-slate-700 shrink-0" />

        {/* Overall % */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">{overallPct}%</span>
        </div>
      </div>
    </div>
  );
}
