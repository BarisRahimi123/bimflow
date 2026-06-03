"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, SlidersHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type AccentName, type Density, type PlayerStyle } from "@/components/theme-provider";

const ACCENTS: { id: AccentName; label: string; swatch: string }[] = [
  { id: "terracotta", label: "Terracotta", swatch: "#C2543A" },
  { id: "amber", label: "Amber", swatch: "#D98A2B" },
  { id: "blue", label: "Blue", swatch: "#2A6FDB" },
  { id: "teal", label: "Teal", swatch: "#2E8B7A" },
];

export function TweaksPanel() {
  const { dark, accent, density, playerStyle, setTweak, toggleDark, reset } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Theme settings"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            open && "bg-accent text-foreground"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-popover p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-popover-foreground">Appearance</span>
              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            </div>

            <Section label="Accent">
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setTweak("accent", a.id)}
                    aria-label={a.label}
                    title={a.label}
                    className={cn(
                      "relative h-7 w-7 rounded-full ring-offset-2 ring-offset-popover transition-all",
                      accent === a.id ? "ring-2 ring-ring" : "hover:scale-110"
                    )}
                    style={{ backgroundColor: a.swatch }}
                  >
                    {accent === a.id && (
                      <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </Section>

            <Section label="Theme">
              <SegGroup<boolean>
                value={dark}
                options={[
                  { value: false, label: "Light" },
                  { value: true, label: "Dark" },
                ]}
                onChange={(v) => setTweak("dark", v)}
              />
            </Section>

            <Section label="Density">
              <SegGroup<Density>
                value={density}
                options={[
                  { value: "regular", label: "Regular" },
                  { value: "compact", label: "Compact" },
                ]}
                onChange={(v) => setTweak("density", v)}
              />
            </Section>

            <Section label="Player">
              <SegGroup<PlayerStyle>
                value={playerStyle}
                options={[
                  { value: "waveform", label: "Waveform" },
                  { value: "minimal", label: "Minimal" },
                ]}
                onChange={(v) => setTweak("playerStyle", v)}
              />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function SegGroup<T extends string | boolean>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-secondary p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
