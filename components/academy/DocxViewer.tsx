"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth/mammoth.browser";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocxViewerProps {
  documentId: string;
  className?: string;
}

export default function DocxViewer({ documentId, className }: DocxViewerProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setHtml(null);

    fetch(`/api/documents/${documentId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load file (${res.status})`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
      .then((result) => {
        if (cancelled) return;
        setHtml(result.value || "<p>This document has no readable text content.</p>");
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not read document");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30", className)}>
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || html == null) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4 bg-muted/30 p-10 text-center", className)}>
        <AlertCircle className="h-8 w-8 text-[hsl(var(--warning))]" />
        <div>
          <p className="text-sm font-medium text-foreground">Couldn&apos;t preview this document</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
        <a
          href={`/api/documents/${documentId}?download=true`}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          <Download className="h-4 w-4" /> Download file
        </a>
      </div>
    );
  }

  return (
    <div className={cn("overflow-auto bg-muted/20", className)}>
      <article
        className="prose prose-stone prose-sm mx-auto my-6 max-w-3xl rounded-lg border border-border bg-card p-8 shadow-sm dark:prose-invert sm:p-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
