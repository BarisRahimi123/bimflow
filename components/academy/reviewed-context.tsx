"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "bim-academy:reviewed";

interface ReviewedValue {
  reviewed: Set<string>;
  isReviewed: (key: string) => boolean;
  toggle: (key: string) => void;
  count: number;
}

const Ctx = createContext<ReviewedValue | null>(null);

export function ReviewedProvider({ children }: { children: React.ReactNode }) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReviewed(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (key: string) => {
      setReviewed((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const isReviewed = useCallback((key: string) => reviewed.has(key), [reviewed]);

  return (
    <Ctx.Provider value={{ reviewed, isReviewed, toggle, count: reviewed.size }}>
      {children}
    </Ctx.Provider>
  );
}

export function useReviewed() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReviewed must be used within ReviewedProvider");
  return ctx;
}
