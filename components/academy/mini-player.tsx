"use client";

import Link from "next/link";
import { MapPin, Pause, Play, SkipBack, SkipForward, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcademyAudio, fmtTime } from "@/components/academy/audio-context";
import { useCueAuthoring } from "@/components/academy/cue-authoring-context";

export function MiniPlayer() {
  const { track, playing, time, duration, toggle, skip, seek, stop } = useAcademyAudio();
  const cue = useCueAuthoring();
  if (!track) return null;

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      {/* progress scrubber */}
      <div
        className="group relative h-1 w-full cursor-pointer bg-border"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          seek(ratio * duration);
        }}
      >
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>

      <div className="container flex h-16 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Volume2 className="h-4 w-4 text-accent-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          {track.docKey ? (
            <Link
              href={`/academy/doc/${encodeURIComponent(track.docKey)}`}
              className="block truncate text-sm font-semibold text-foreground hover:text-brand"
            >
              {track.title}
            </Link>
          ) : (
            <span className="block truncate text-sm font-semibold text-foreground">{track.title}</span>
          )}
          <span className="block truncate text-xs text-muted-foreground">
            {track.subtitle ?? "Narration"} · {fmtTime(time)} / {fmtTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {cue.active && (
            <>
              <button
                onClick={cue.mark}
                title={`Mark current sheet (${cue.viewerPage}) at ${fmtTime(time)}`}
                className="mr-1 inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/20"
              >
                <MapPin className="h-3.5 w-3.5" />
                Mark sheet {cue.viewerPage}
              </button>
              <span className="mr-1 h-6 w-px bg-border" aria-hidden />
            </>
          )}
          <button
            onClick={() => skip(-15)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Back 15s"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
          <button
            onClick={() => skip(15)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Forward 15s"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            onClick={stop}
            className={cn(
              "ml-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title="Close player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
