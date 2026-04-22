'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  documentId: string;
  page: number;
  searchText?: string;
  onPageCount?: (n: number) => void;
  className?: string;
}

export default function PDFViewer({
  documentId,
  page,
  searchText,
  onPageCount,
  className,
}: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;

  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [docVersion, setDocVersion] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  // --- Effect 1: load pdfjs-dist once ---
  useEffect(() => {
    import('pdfjs-dist').then((pdfjs) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pdfjs as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      pdfjsRef.current = pdfjs;
      setPdfjsLoaded(true);
    });
  }, []);

  // --- Effect 2: load document when pdfjs ready OR documentId changes ---
  useEffect(() => {
    if (!pdfjsLoaded) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    pdfDocRef.current = null;

    pdfjsRef.current
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getDocument(`/api/documents/${documentId}`)
      .promise
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((pdf: any) => {
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        onPageCount?.(pdf.numPages);
        setDocVersion((v) => v + 1);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load document');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pdfjsLoaded, documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Effect 3: sync external page prop → internal currentPage ---
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // --- Effect 4: render page ---
  useEffect(() => {
    if (!pdfDocRef.current || loading) return;
    const canvas = canvasRef.current;
    const textLayerEl = textLayerRef.current;
    if (!canvas || !textLayerEl) return;

    renderTaskRef.current?.cancel?.();
    let cancelled = false;

    const pageNum = Math.max(1, Math.min(currentPage, totalPages || currentPage));

    pdfDocRef.current
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getPage(pageNum).then(async (pdfPage: any) => {
        if (cancelled) return;

        const containerWidth = containerRef.current?.offsetWidth ?? 600;
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const fitScale = Math.min(scale, (containerWidth - 32) / baseViewport.width);
        const viewport = pdfPage.getViewport({ scale: fitScale });

        // Retina canvas
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const ctx = canvas.getContext('2d')!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const renderParams: any = { canvasContext: ctx, viewport };
        if (dpr !== 1) renderParams.transform = [dpr, 0, 0, dpr, 0, 0];

        const renderTask = pdfPage.render(renderParams);
        renderTaskRef.current = renderTask;

        const textContent = await pdfPage.getTextContent();
        if (cancelled) return;

        textLayerEl.innerHTML = '';
        // CRITICAL: pdfjs v3 uses calc(var(--scale-factor)*Xpx) for all text layer
        // dimensions and font sizes. Without this variable, the container collapses
        // to 0×0 (overflow:hidden hides all spans) and font sizes are invalid.
        textLayerEl.style.setProperty('--scale-factor', String(fitScale));

        const textDivs: HTMLElement[] = [];
        const textLayerTask = pdfjsRef.current.renderTextLayer({
          textContent,
          container: textLayerEl,
          viewport,
          textDivs,
        });

        await Promise.all([
          renderTask.promise.catch((e: { name?: string }) => {
            if (e?.name !== 'RenderingCancelledException') throw e;
          }),
          textLayerTask.promise,
        ]);
        if (cancelled) return;

        // Make text invisible — only yellow highlight backgrounds show through
        textLayerEl.querySelectorAll<HTMLElement>('span[role="presentation"]').forEach((el) => {
          el.style.color = 'transparent';
          el.style.userSelect = 'none';
          el.style.cursor = 'default';
        });

        applyHighlight(textLayerEl, searchTextRef.current);
        setRenderTick((t) => t + 1);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e?.name !== 'RenderingCancelledException') console.error('PDF render error:', e);
      });

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel?.();
    };
  }, [docVersion, currentPage, scale, loading, totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Effect 5: when searchText changes, search ALL pages and navigate to match ---
  useEffect(() => {
    if (!searchText?.trim() || !pdfDocRef.current) return;
    let cancelled = false;

    const searchAllPages = async () => {
      const pdf = pdfDocRef.current;
      const query = searchText.toLowerCase().trim();
      const queryNorm = query.replace(/\s/g, '');

      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return;
        try {
          const pdfPage = await pdf.getPage(i);
          const textContent = await pdfPage.getTextContent();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawJoined = textContent.items.map((item: any) => item.str ?? '').join('');
          const pageText = rawJoined.toLowerCase();
          const pageTextNorm = pageText.replace(/\s/g, '');
          if (pageText.includes(query) || (queryNorm.length >= 2 && pageTextNorm.includes(queryNorm))) {
            if (!cancelled) setCurrentPage(i);
            return;
          }
        } catch { /* skip */ }
      }
      // Not found — re-apply highlight on current page anyway
      if (!cancelled && textLayerRef.current) {
        applyHighlight(textLayerRef.current, searchText);
      }
    };

    searchAllPages();
    return () => { cancelled = true; };
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Effect 6: re-apply highlight after render or searchText change ---
  useEffect(() => {
    if (textLayerRef.current) applyHighlight(textLayerRef.current, searchText);
  }, [searchText, renderTick]);

  const handlePrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
  const handleZoomIn = useCallback(() => setScale((s) => Math.min(3, parseFloat((s + 0.2).toFixed(1)))), []);
  const handleZoomOut = useCallback(() => setScale((s) => Math.max(0.5, parseFloat((s - 0.2).toFixed(1)))), []);

  return (
    <div ref={containerRef} className={cn('flex flex-col bg-slate-800 overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 h-9 bg-slate-900 border-b border-slate-700 text-slate-300 text-xs select-none">
        <div className="flex items-center gap-0.5">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 tabular-nums">{currentPage} / {totalPages || '—'}</span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          {searchText && (
            <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-medium mr-1 max-w-[140px] truncate">
              ↑ {searchText}
            </span>
          )}
          <button onClick={handleZoomOut} className="p-1 rounded hover:bg-slate-700 transition-colors" title="Zoom out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 tabular-nums">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1 rounded hover:bg-slate-700 transition-colors" title="Zoom in">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Page canvas */}
      <div className="flex-1 overflow-auto bg-slate-600 flex justify-center items-start py-4">
        {loading && (
          <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="w-7 h-7 text-slate-300 animate-spin" />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full min-h-[200px] text-red-400">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <div className="relative shadow-2xl" style={{ display: 'inline-block' }}>
            <canvas ref={canvasRef} className="block bg-white" />
            {/* Text layer: transparent spans over canvas, highlight backgrounds show through */}
            <div
              ref={textLayerRef}
              className="absolute top-0 left-0 overflow-hidden pointer-events-none"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Highlight all spans whose text overlaps with searchText.
 * Three strategies in order:
 *   1. Exact substring match on concatenated span text
 *   2. Whitespace-normalized match (handles "1.5. K" when searching "1.5.K")
 *   3. Word-level fallback for descriptive phrases
 */
function applyHighlight(container: HTMLDivElement, searchText?: string) {
  container.querySelectorAll<HTMLElement>('[data-hl]').forEach((el) => {
    el.style.backgroundColor = 'transparent';
    el.style.borderRadius = '';
    el.style.boxShadow = '';
    delete el.dataset.hl;
  });

  if (!searchText?.trim()) return;
  const query = searchText.toLowerCase().trim();

  const spans = Array.from(container.querySelectorAll<HTMLElement>('span[role="presentation"]'));
  if (spans.length === 0) return;

  // Build concatenated text + per-span start offsets
  let fullText = '';
  const spanOffsets: number[] = [];
  for (const span of spans) {
    spanOffsets.push(fullText.length);
    fullText += span.textContent ?? '';
  }
  const fullLower = fullText.toLowerCase();

  let firstMatch: HTMLElement | null = null;

  const markRange = (startIdx: number, endIdx: number) => {
    spans.forEach((span, i) => {
      const s = spanOffsets[i];
      const e = s + (span.textContent?.length ?? 0);
      if (e > startIdx && s < endIdx) {
        span.style.backgroundColor = 'rgba(250, 204, 21, 0.65)';
        span.style.borderRadius = '2px';
        span.style.boxShadow = '0 0 0 2px rgba(250, 204, 21, 0.4)';
        span.dataset.hl = '1';
        if (!firstMatch) firstMatch = span;
      }
    });
  };

  // Strategy 1: exact substring
  const exactIdx = fullLower.indexOf(query);
  if (exactIdx !== -1) {
    markRange(exactIdx, exactIdx + query.length);
  } else {
    // Strategy 2: whitespace-normalized (handles spaces inside section refs)
    // Build a char-by-char map from normalized text back to original fullText position
    const normToOrig: number[] = [];
    let normFull = '';
    for (let i = 0; i < fullLower.length; i++) {
      const ch = fullLower[i];
      if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
        normToOrig.push(i);
        normFull += ch;
      }
    }
    const normQuery = query.replace(/[\s\t\n\r]/g, '');
    if (normQuery.length >= 2) {
      const normIdx = normFull.indexOf(normQuery);
      if (normIdx !== -1) {
        const origStart = normToOrig[normIdx];
        const origEnd = normToOrig[normIdx + normQuery.length - 1] + 1;
        markRange(origStart, origEnd);
      }
    }

    // Strategy 3: word-level fallback for phrases (min 3 chars per word)
    if (!firstMatch) {
      const words = query.split(/[\s.,()\-\/]+/).filter((w) => w.length >= 3);
      if (words.length > 0) {
        spans.forEach((span) => {
          const text = (span.textContent ?? '').toLowerCase();
          if (text.length > 0 && words.some((w) => text.includes(w))) {
            span.style.backgroundColor = 'rgba(250, 204, 21, 0.65)';
            span.style.borderRadius = '2px';
            span.style.boxShadow = '0 0 0 2px rgba(250, 204, 21, 0.4)';
            span.dataset.hl = '1';
            if (!firstMatch) firstMatch = span;
          }
        });
      }
    }
  }

  if (firstMatch) {
    (firstMatch as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
