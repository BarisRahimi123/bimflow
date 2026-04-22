"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "pidflow-onboarding-dismissed";
const PROGRESS_KEY = "pidflow-guide-progress";

export default function OnboardingBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      const progress = localStorage.getItem(PROGRESS_KEY);
      const hasProgress = progress && JSON.parse(progress).length > 0;
      if (!dismissed && !hasProgress) setShow(true);
    } catch {}
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="font-semibold text-base leading-tight">
              New to BIMFLOW? Start with the Modeler Playbook.
            </p>
            <p className="text-emerald-100 text-sm mt-0.5">
              7 phases from project setup to close-out — with checklists, spec references, and tool links at every step.
            </p>
          </div>

          {/* Steps preview */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-emerald-200 shrink-0">
            {["Setup","Scope","P&ID","Model","Check","Submit","Close"].map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                {i > 0 && <span className="text-emerald-400">›</span>}
                <span className="bg-white/10 px-1.5 py-0.5 rounded">{s}</span>
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/guide">
              <Button
                size="sm"
                className="bg-white text-emerald-700 hover:bg-emerald-50 gap-1.5 font-semibold shadow-lg"
              >
                <CheckSquare className="w-4 h-4" />
                Start Playbook
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <button
              onClick={dismiss}
              className="p-1 rounded hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
