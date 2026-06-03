"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface Track {
  src: string;
  title: string;
  subtitle?: string;
  /** doc key, so the player can deep-link back */
  docKey?: string;
}

interface AudioContextValue {
  track: Track | null;
  playing: boolean;
  time: number;
  duration: number;
  /** Load + play a track (no-op if already current → just toggles play) */
  play: (track: Track) => void;
  toggle: () => void;
  seek: (sec: number) => void;
  skip: (delta: number) => void;
  setRate: (rate: number) => void;
  rate: number;
  stop: () => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

export function AcademyAudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRateState] = useState(1);

  useEffect(() => {
    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;
    const onTime = () => setTime(el.currentTime);
    const onDur = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("ended", onEnd);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const play = useCallback(
    (next: Track) => {
      const el = audioRef.current;
      if (!el) return;
      if (track?.src === next.src) {
        if (el.paused) void el.play();
        else el.pause();
        return;
      }
      setTrack(next);
      setTime(0);
      setDuration(0);
      el.src = next.src;
      el.playbackRate = rate;
      void el.play().catch(() => setPlaying(false));
    },
    [track?.src, rate],
  );

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (el.paused) void el.play();
    else el.pause();
  }, [track]);

  const seek = useCallback((sec: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = sec;
    setTime(sec);
  }, []);

  const skip = useCallback((delta: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
  }, []);

  const setRate = useCallback((r: number) => {
    const el = audioRef.current;
    setRateState(r);
    if (el) el.playbackRate = r;
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) el.pause();
    setTrack(null);
    setPlaying(false);
    setTime(0);
  }, []);

  return (
    <Ctx.Provider
      value={{ track, playing, time, duration, play, toggle, seek, skip, setRate, rate, stop }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAcademyAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAcademyAudio must be used within AcademyAudioProvider");
  return ctx;
}

export function fmtTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
