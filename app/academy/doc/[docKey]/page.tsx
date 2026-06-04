"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/academy/admin";
import { getDocByKey, getDocNeighbors, getFolder } from "@/lib/academy/library";
import { useReviewed } from "@/components/academy/reviewed-context";
import { useAcademyAudio } from "@/components/academy/audio-context";
import { useCueAuthoring } from "@/components/academy/cue-authoring-context";
import { DocNarration } from "@/components/academy/doc-narration";
import { CueRail } from "@/components/academy/cue-rail";
import { docTargetKey, pageForTime } from "@/lib/academy/audio-overrides";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });
const SpreadsheetViewer = dynamic(() => import("@/components/academy/SpreadsheetViewer"), {
  ssr: false,
});
const DocxViewer = dynamic(() => import("@/components/academy/DocxViewer"), { ssr: false });

const SPREADSHEET_TYPES = new Set(["xlsx", "xls", "xlsm", "csv"]);

export default function DocPage({ params }: { params: { docKey: string } }) {
  const key = decodeURIComponent(params.docKey);
  const doc = getDocByKey(key);
  if (!doc) notFound();

  const folder = getFolder(doc.folderId);
  const { prev, next } = getDocNeighbors(key);
  const { isReviewed, toggle } = useReviewed();
  const reviewed = isReviewed(key);
  const fileType = doc.fileType.toLowerCase();
  const isPdf = fileType === "pdf";
  const isSpreadsheet = SPREADSHEET_TYPES.has(fileType);
  const isDocx = fileType === "docx";
  const docId = doc.documentId ?? doc.id;

  // PDF page coordination: `navPage` is what we ask the viewer to show (driven
  // by narration cues); `viewerPage` is the sheet currently centered (drives the
  // cue "Mark" button). `totalPages` bounds the cue page inputs.
  const [navPage, setNavPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const { track, time } = useAcademyAudio();
  const cue = useCueAuthoring();
  const { begin: cueBegin, end: cueEnd, setViewerPage: setCueViewerPage } = cue;

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsAdmin(isAdminEmail(data.user?.email)))
      .catch(() => setIsAdmin(false));
  }, []);

  // Does the playing narration belong to THIS document and carry cues?
  const activeTrack =
    track?.docKey === key && track?.trackId ? track : null;
  const hasCues = (activeTrack?.cues?.length ?? 0) > 0;
  const authorable = isAdmin && isPdf && !!activeTrack?.trackId;

  // Register / tear down the cue-authoring session (drives the left rail + the
  // player's Mark button) as the admin plays an uploaded track on this PDF.
  useEffect(() => {
    if (authorable && activeTrack?.trackId) {
      cueBegin({
        trackId: activeTrack.trackId,
        label: activeTrack.title,
        totalPages,
        cues: activeTrack.cues ?? [],
      });
    } else {
      cueEnd();
    }
  }, [
    authorable,
    activeTrack?.trackId,
    activeTrack?.title,
    activeTrack?.cues,
    totalPages,
    cueBegin,
    cueEnd,
  ]);

  // Jump the PDF when a cue is clicked in the rail.
  useEffect(() => {
    if (cue.jump) setNavPage(cue.jump.page);
  }, [cue.jump]);

  // Auto-follow: as the narration plays, jump the PDF to the cued sheet. Paused
  // while the admin has the authoring rail open (so they can scroll freely).
  useEffect(() => {
    if (cue.open || !hasCues) return;
    const p = pageForTime(activeTrack?.cues, time);
    if (p && p !== navPage) setNavPage(p);
  }, [time, cue.open, hasCues, activeTrack?.cues, navPage]);

  const handleCurrentPage = useCallback(
    (n: number) => setCueViewerPage(n),
    [setCueViewerPage],
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Breadcrumb + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/academy" className="text-muted-foreground hover:text-foreground">
            Academy
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/academy/folder/${doc.folderId}`}
            className="truncate text-muted-foreground hover:text-foreground"
          >
            {folder?.title ?? doc.folderTitle}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate font-medium text-foreground">{doc.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggle(key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
              reviewed
                ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {reviewed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {reviewed ? "Reviewed" : "Mark reviewed"}
          </button>
          <DocNarration
            targetKey={docTargetKey(key)}
            title={doc.title}
            docKey={key}
            defaultSrc={doc.audioSrc}
            syncable={isPdf}
          />
          <a
            href={`/api/documents/${docId}?download=true`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Narration → sheet cue rail (admin, PDF, active uploaded track) */}
        <CueRail />
        {isPdf ? (
          <PDFViewer
            documentId={docId}
            page={navPage}
            onPageCount={setTotalPages}
            onCurrentPage={handleCurrentPage}
            className="h-full min-w-0 flex-1"
          />
        ) : isSpreadsheet ? (
          <SpreadsheetViewer documentId={docId} className="h-full min-w-0 flex-1" />
        ) : isDocx ? (
          <DocxViewer documentId={docId} className="h-full min-w-0 flex-1" />
        ) : (
          <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <FileText className="h-7 w-7 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{doc.title}</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {fileType === "pptx" || fileType === "ppt"
                  ? "PowerPoint slides open in their native app. Download to view the full deck."
                  : `${doc.fileType.toUpperCase()} files open in their native app.`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/documents/${docId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              >
                <ExternalLink className="h-4 w-4" /> Open document
              </a>
              <a
                href={`/api/documents/${docId}?download=true`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-3">
        {prev ? (
          <Link
            href={`/academy/doc/${encodeURIComponent(prev.key)}`}
            className="inline-flex min-w-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/academy/doc/${encodeURIComponent(next.key)}`}
            className="inline-flex min-w-0 items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="truncate">{next.title}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
