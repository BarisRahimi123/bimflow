'use client';

import { useEffect, useRef, useState, useCallback, type RefObject } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
  PanelRight,
  PanelRightClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  documentId: string;
  page: number;
  searchText?: string;
  onPageCount?: (n: number) => void;
  /** Fires with the sheet currently centered in the viewport. */
  onCurrentPage?: (n: number) => void;
  className?: string;
}

export default function PDFViewer({
  documentId,
  page,
  searchText,
  onPageCount,
  onCurrentPage,
  className,
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // page number -> wrapper element, for scroll positioning + current-page tracking
  const pageElsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);

  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [docVersion, setDocVersion] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThumbs, setShowThumbs] = useState(true);
  const [containerWidth, setContainerWidth] = useState(700);
  const [estPageHeight, setEstPageHeight] = useState(900);
  // Page that an active search resolved to; only that page auto-scrolls its match.
  const [searchTargetPage, setSearchTargetPage] = useState<number | null>(null);

  // --- Load pdfjs-dist once ---
  useEffect(() => {
    import('pdfjs-dist').then((pdfjs) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pdfjs as any).GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      pdfjsRef.current = pdfjs;
      setPdfjsLoaded(true);
    });
  }, []);

  // --- Load document when pdfjs ready OR documentId changes ---
  useEffect(() => {
    if (!pdfjsLoaded) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    pdfDocRef.current = null;
    pageElsRef.current.clear();

    pdfjsRef.current
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

    return () => {
      cancelled = true;
    };
  }, [pdfjsLoaded, documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Track the visible width of the scroll area (resizes when thumbs toggle) ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth || 700);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pdfjsLoaded, showThumbs]);

  const registerPage = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) pageElsRef.current.set(n, el);
    else pageElsRef.current.delete(n);
  }, []);

  const scrollToPage = useCallback((n: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollRef.current;
    const el = pageElsRef.current.get(n);
    if (!scroller || !el) return;
    const top =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      8;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  }, []);

  // Surface the centered sheet to the parent (drives the cue "Mark" button).
  useEffect(() => {
    onCurrentPage?.(currentPage);
  }, [currentPage, onCurrentPage]);

  // --- Sync external page prop → scroll to that page ---
  useEffect(() => {
    if (loading || !totalPages) return;
    setCurrentPage(page);
    // Defer so freshly-laid-out wrappers are measurable.
    const id = window.setTimeout(() => scrollToPage(page, 'auto'), 60);
    return () => window.clearTimeout(id);
  }, [page, docVersion, loading, totalPages, scrollToPage]);

  // --- Determine current page from scroll position ---
  const onScroll = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const mid = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.35;
    let best = currentPage;
    let bestDist = Infinity;
    pageElsRef.current.forEach((el, n) => {
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.top - mid);
      if (r.bottom > mid && dist < bestDist) {
        bestDist = dist;
        best = n;
      }
    });
    if (best !== currentPage) setCurrentPage(best);
  }, [currentPage]);

  // --- Search all pages, jump to the first hit ---
  useEffect(() => {
    if (!searchText?.trim() || !pdfDocRef.current) {
      setSearchTargetPage(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const pdf = pdfDocRef.current;
      const query = searchText.toLowerCase().trim();
      const queryNorm = query.replace(/\s/g, '');
      for (let i = 1; i <= pdf.numPages; i++) {
        if (cancelled) return;
        try {
          const pdfPage = await pdf.getPage(i);
          const textContent = await pdfPage.getTextContent();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const joined = textContent.items.map((it: any) => it.str ?? '').join('');
          const lower = joined.toLowerCase();
          const norm = lower.replace(/\s/g, '');
          if (lower.includes(query) || (queryNorm.length >= 2 && norm.includes(queryNorm))) {
            if (!cancelled) {
              setSearchTargetPage(i);
              setCurrentPage(i);
              scrollToPage(i);
            }
            return;
          }
        } catch {
          /* skip */
        }
      }
      if (!cancelled) setSearchTargetPage(null);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [searchText, docVersion, scrollToPage]);

  const handlePrev = useCallback(
    () => scrollToPage(Math.max(1, currentPage - 1)),
    [currentPage, scrollToPage]
  );
  const handleNext = useCallback(
    () => scrollToPage(Math.min(totalPages, currentPage + 1)),
    [currentPage, totalPages, scrollToPage]
  );
  const handleZoomIn = useCallback(
    () => setScale((s) => Math.min(3, parseFloat((s + 0.2).toFixed(1)))),
    []
  );
  const handleZoomOut = useCallback(
    () => setScale((s) => Math.max(0.5, parseFloat((s - 0.2).toFixed(1)))),
    []
  );

  const pages = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col bg-slate-800 overflow-hidden', className)}
    >
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 h-9 bg-slate-900 border-b border-slate-700 text-slate-300 text-xs select-none">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setShowThumbs((v) => !v)}
            className="p-1 rounded hover:bg-slate-700 transition-colors mr-1"
            title={showThumbs ? 'Hide sheet panel' : 'Show sheet panel'}
            aria-pressed={showThumbs}
          >
            {showThumbs ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRight className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Previous sheet"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 tabular-nums">
            {currentPage} / {totalPages || '—'}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Next sheet"
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
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: continuous page scroll + thumbnail rail (right) */}
      <div className="flex-1 min-h-0 flex">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-auto bg-slate-600"
        >
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
            <div className="flex flex-col items-center gap-4 py-4">
              {pages.map((n) => (
                <PdfPage
                  key={n}
                  pdf={pdfDocRef.current}
                  pdfjs={pdfjsRef.current}
                  docVersion={docVersion}
                  pageNumber={n}
                  scale={scale}
                  containerWidth={containerWidth}
                  searchText={searchText}
                  autoScrollMatch={n === searchTargetPage}
                  placeholderHeight={estPageHeight}
                  register={registerPage}
                  onMeasured={(h) => setEstPageHeight((prev) => (n === 1 ? h : prev))}
                  scrollRef={scrollRef}
                />
              ))}
            </div>
          )}
        </div>

        {showThumbs && !loading && !error && totalPages > 0 && (
          <aside className="flex-shrink-0 w-[148px] overflow-y-auto bg-slate-900 border-l border-slate-700 py-2">
            {pages.map((n) => (
              <PdfThumbnail
                key={n}
                pdf={pdfDocRef.current}
                pdfjs={pdfjsRef.current}
                docVersion={docVersion}
                pageNumber={n}
                active={n === currentPage}
                scrollRef={scrollRef}
                onClick={() => scrollToPage(n)}
              />
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A single page: canvas + transparent text layer. Renders lazily when scrolled
// near the viewport, re-renders on scale/width change, re-highlights on search.
// ---------------------------------------------------------------------------
interface PdfPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfjs: any;
  docVersion: number;
  pageNumber: number;
  scale: number;
  containerWidth: number;
  searchText?: string;
  autoScrollMatch: boolean;
  placeholderHeight: number;
  register: (n: number, el: HTMLDivElement | null) => void;
  onMeasured: (height: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
}

function PdfPage({
  pdf,
  pdfjs,
  docVersion,
  pageNumber,
  scale,
  containerWidth,
  searchText,
  autoScrollMatch,
  placeholderHeight,
  register,
  onMeasured,
  scrollRef,
}: PdfPageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    register(pageNumber, wrapRef.current);
    return () => register(pageNumber, null);
  }, [pageNumber, register]);

  // Render when the page scrolls within ~1.5 viewports of the visible area.
  useEffect(() => {
    const el = wrapRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { root, rootMargin: '150% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef, docVersion]);

  // Render / re-render the page bitmap + text layer.
  useEffect(() => {
    if (!visible || !pdf || !pdfjs) return;
    const canvas = canvasRef.current;
    const textLayerEl = textLayerRef.current;
    if (!canvas || !textLayerEl) return;

    renderTaskRef.current?.cancel?.();
    let cancelled = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.getPage(pageNumber).then(async (pdfPage: any) => {
      if (cancelled) return;
      const baseViewport = pdfPage.getViewport({ scale: 1 });
      const fitScale = Math.min(scale, (containerWidth - 32) / baseViewport.width);
      const viewport = pdfPage.getViewport({ scale: fitScale });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      setSize({ w: viewport.width, h: viewport.height });
      onMeasured(viewport.height);

      const ctx = canvas.getContext('2d')!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderParams: any = { canvasContext: ctx, viewport };
      if (dpr !== 1) renderParams.transform = [dpr, 0, 0, dpr, 0, 0];

      const renderTask = pdfPage.render(renderParams);
      renderTaskRef.current = renderTask;

      const textContent = await pdfPage.getTextContent();
      if (cancelled) return;

      textLayerEl.innerHTML = '';
      // pdfjs v3 needs --scale-factor or the text layer collapses to 0×0.
      textLayerEl.style.setProperty('--scale-factor', String(fitScale));

      const textDivs: HTMLElement[] = [];
      const textLayerTask = pdfjs.renderTextLayer({
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

      // Hide text; only highlight backgrounds show through.
      textLayerEl
        .querySelectorAll<HTMLElement>('span[role="presentation"]')
        .forEach((el) => {
          el.style.color = 'transparent';
          el.style.userSelect = 'none';
          el.style.cursor = 'default';
        });

      setRendered(true);
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
  }, [visible, pdf, pdfjs, pageNumber, scale, containerWidth, docVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply / clear highlight after render or when search changes.
  useEffect(() => {
    if (!rendered || !textLayerRef.current) return;
    applyHighlight(textLayerRef.current, searchText, autoScrollMatch);
  }, [searchText, renderTick, rendered, autoScrollMatch]);

  return (
    <div
      ref={wrapRef}
      data-page={pageNumber}
      className="relative shadow-2xl"
      style={{
        width: size ? size.w : undefined,
        minHeight: size ? size.h : placeholderHeight,
      }}
    >
      {!rendered && (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-xs text-slate-400">Sheet {pageNumber}</span>
        </div>
      )}
      <canvas ref={canvasRef} className="block bg-white" />
      <div
        ref={textLayerRef}
        className="absolute top-0 left-0 overflow-hidden pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// A small thumbnail in the side rail. Lazily rendered; click scrolls the main
// view to that page.
// ---------------------------------------------------------------------------
interface PdfThumbnailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfjs: any;
  docVersion: number;
  pageNumber: number;
  active: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  onClick: () => void;
}

function PdfThumbnail({
  pdf,
  pdfjs,
  docVersion,
  pageNumber,
  active,
  onClick,
}: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !pdf || !pdfjs || rendered) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.getPage(pageNumber).then((pdfPage: any) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const thumbW = 116;
      const viewport = pdfPage.getViewport({ scale: thumbW / base.width });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d')!;
      pdfPage
        .render({ canvasContext: ctx, viewport })
        .promise.then(() => {
          if (!cancelled) setRendered(true);
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [visible, pdf, pdfjs, pageNumber, rendered, docVersion]);

  return (
    <button
      ref={wrapRef}
      onClick={onClick}
      className={cn(
        'group block w-full px-3 py-1.5 text-left',
        'transition-colors'
      )}
      title={`Sheet ${pageNumber}`}
    >
      <div
        className={cn(
          'relative mx-auto w-[116px] rounded-sm overflow-hidden border bg-white',
          active
            ? 'border-yellow-400 ring-2 ring-yellow-400/50'
            : 'border-slate-700 group-hover:border-slate-400'
        )}
        style={{ minHeight: 80 }}
      >
        {!rendered && (
          <div className="flex items-center justify-center h-[150px] text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className={cn('block w-full', !rendered && 'hidden')} />
      </div>
      <span
        className={cn(
          'mt-1 block text-center text-[10px] tabular-nums',
          active ? 'text-yellow-300 font-semibold' : 'text-slate-400'
        )}
      >
        {pageNumber}
      </span>
    </button>
  );
}

/**
 * Highlight all spans whose text overlaps with searchText.
 * Three strategies in order:
 *   1. Exact substring match on concatenated span text
 *   2. Whitespace-normalized match (handles "1.5. K" when searching "1.5.K")
 *   3. Word-level fallback for descriptive phrases
 */
function applyHighlight(
  container: HTMLDivElement,
  searchText?: string,
  autoScroll: boolean = true
) {
  container.querySelectorAll<HTMLElement>('[data-hl]').forEach((el) => {
    el.style.backgroundColor = 'transparent';
    el.style.borderRadius = '';
    el.style.boxShadow = '';
    delete el.dataset.hl;
  });

  if (!searchText?.trim()) return;
  const query = searchText.toLowerCase().trim();

  const spans = Array.from(
    container.querySelectorAll<HTMLElement>('span[role="presentation"]')
  );
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

  if (firstMatch && autoScroll) {
    (firstMatch as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
