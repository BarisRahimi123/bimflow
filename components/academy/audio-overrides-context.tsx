"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { audioProxyUrl } from "@/lib/academy/audio-overrides";

interface AudioOverridesValue {
  /** Set of target keys that have an admin-uploaded override. */
  overrides: Set<string>;
  /** Re-fetch the override key list (call after an upload/remove). */
  refresh: () => Promise<void>;
  /**
   * Resolve the effective audio URL for a target key:
   *  - proxy URL when an override exists,
   *  - otherwise the provided default src,
   *  - otherwise undefined (no audio).
   */
  resolve: (targetKey: string, defaultSrc?: string) => string | undefined;
}

const Ctx = createContext<AudioOverridesValue | null>(null);

export function AudioOverridesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/audio/overrides", { cache: "no-store" });
      if (!res.ok) return;
      const keys: string[] = await res.json();
      setOverrides(new Set(keys));
    } catch {
      // Non-fatal: defaults keep serving.
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resolve = useCallback(
    (targetKey: string, defaultSrc?: string): string | undefined => {
      if (overrides.has(targetKey)) return audioProxyUrl(targetKey);
      return defaultSrc;
    },
    [overrides],
  );

  return (
    <Ctx.Provider value={{ overrides, refresh, resolve }}>{children}</Ctx.Provider>
  );
}

export function useAudioOverrides() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAudioOverrides must be used within AudioOverridesProvider");
  return ctx;
}
