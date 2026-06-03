"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AccentName = "terracotta" | "amber" | "blue" | "teal";
export type Density = "regular" | "compact";
export type PlayerStyle = "waveform" | "minimal";

export interface Tweaks {
  dark: boolean;
  accent: AccentName;
  density: Density;
  playerStyle: PlayerStyle;
}

const DEFAULTS: Tweaks = {
  dark: false,
  accent: "terracotta",
  density: "regular",
  playerStyle: "waveform",
};

const STORAGE_KEY = "pidflow-tweaks";

// terracotta is the default (no data-accent attribute)
const ACCENT_ATTR: Record<AccentName, string> = {
  terracotta: "",
  amber: "amber",
  blue: "blue",
  teal: "teal",
};

interface ThemeContextValue extends Tweaks {
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  toggleDark: () => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTweaks(t: Tweaks) {
  const root = document.documentElement;
  root.classList.toggle("dark", t.dark);
  root.setAttribute("data-theme", t.dark ? "dark" : "light");
  const accent = ACCENT_ATTR[t.accent] || "";
  if (accent) root.setAttribute("data-accent", accent);
  else root.removeAttribute("data-accent");
  root.setAttribute("data-density", t.density);
}

// Runs before React hydration to avoid a flash of the wrong theme.
const NO_FLASH_SCRIPT = `(function(){try{
var t=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');
var r=document.documentElement;
if(t.dark){r.classList.add('dark');r.setAttribute('data-theme','dark');}else{r.setAttribute('data-theme','light');}
var a={terracotta:'',amber:'amber',blue:'blue',teal:'teal'}[t.accent]||'';
if(a)r.setAttribute('data-accent',a);
r.setAttribute('data-density',t.density||'regular');
}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULTS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTweaks({ ...DEFAULTS, ...JSON.parse(stored) });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyTweaks(tweaks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch {
      // ignore
    }
  }, [tweaks]);

  const setTweak = useCallback<ThemeContextValue["setTweak"]>((key, value) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleDark = useCallback(() => {
    setTweaks((prev) => ({ ...prev, dark: !prev.dark }));
  }, []);

  const reset = useCallback(() => setTweaks(DEFAULTS), []);

  return (
    <ThemeContext.Provider value={{ ...tweaks, setTweak, toggleDark, reset }}>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
