"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseAudioProps {
  tracks: string[];
  phaseNumber: number;
  autoPlay?: boolean;
  onAllEnded?: () => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PhaseAudio({ tracks, phaseNumber, autoPlay = false, onAllEnded }: PhaseAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const hasTracks = tracks.length > 0;
  const isMulti = tracks.length > 1;
  const progress = duration > 0 ? currentTime / duration : 0;

  // Load + play the active track whenever the index changes mid-playlist.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    setCurrentTime(0);
    el.load();
    if (isPlaying || autoPlay) el.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Start playback when the parent flips autoPlay on (e.g. "Play all" clicked).
  useEffect(() => {
    if (!autoPlay) return;
    const el = audioRef.current;
    if (el) el.play().catch(() => {});
  }, [autoPlay]);

  if (!hasTracks) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const handleEnded = () => {
    if (index < tracks.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      onAllEnded?.();
    }
  };

  return (
    <div className="sticky top-0 z-10 -mx-8 mb-8 px-8 pt-2 pb-3 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur supports-[backdrop-filter]:bg-slate-50/65">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors"
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-primary" /> Phase {phaseNumber} narration
            </span>
            <span className="text-[10px] text-slate-400 tabular-nums">
              {isMulti && <span className="mr-2">Part {index + 1} of {tracks.length}</span>}
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-150"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={tracks[index]}
        autoPlay={autoPlay && index === 0}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={handleEnded}
      />
    </div>
  );
}
