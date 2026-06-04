"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page background that scrubs landing.mp4 frame-by-frame as the user
 * scrolls. The clip's first ~1s has the hero copy burned in, so we start the
 * scrub past it (INTRO_SKIP) — the foreground HTML hero is the single, crisp,
 * accessible source of that text. Reduced-motion users get one static frame.
 *
 * Requires an all-keyframe encode (every frame an IDR) for smooth seeking.
 */
const INTRO_SKIP = 1.15; // seconds of burned-in hero text to skip past
const TAIL_TRIM = 0.05; // keep just inside the last frame
const REDUCED_FRAME = 4.0; // representative piping frame for reduced-motion

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let duration = 8;
    let rafId: number | null = null;
    let primed = false;

    const seek = (t: number) => {
      if (video.seeking) return;
      if (Math.abs(video.currentTime - t) > 0.01) {
        try {
          video.currentTime = t;
        } catch {
          /* seeking before metadata is ready — ignored */
        }
      }
    };

    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 8;
      if (prefersReduced) seek(Math.min(REDUCED_FRAME, duration));
      else seek(INTRO_SKIP);
    };

    const update = () => {
      rafId = null;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      const span = Math.max(0, duration - INTRO_SKIP - TAIL_TRIM);
      seek(INTRO_SKIP + progress * span);
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update);
    };

    // iOS/Safari won't paint a seeked frame until the element has decoded once.
    // Prime with a muted play→pause, then immediately jump past the intro.
    const prime = () => {
      if (primed || prefersReduced) return;
      primed = true;
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          video.pause();
          update();
        }).catch(() => {
          /* autoplay blocked — seeking still works on desktop */
        });
      }
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", prime, { once: true });
    if (video.readyState >= 1) onMeta();
    if (video.readyState >= 2) prime();

    if (!prefersReduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", prime);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/landing.mp4"
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      {/* No scrim — the footage plays at full quality. Foreground sections carry
          their own backgrounds, so text legibility is handled at the content
          layer rather than by washing out the video. */}
    </div>
  );
}
