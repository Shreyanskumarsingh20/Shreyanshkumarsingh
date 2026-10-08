"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** base name under /public/media: {name}-1280.mp4, {name}-720.mp4, {name}-poster.webp */
  name: "hero" | "telemetry" | "footer";
  className: string;
};

/**
 * Decorative looping background video, loaded the cheap way:
 *
 * - The server renders only a poster (a ~50 KB WebP) with preload="none", so
 *   nothing heavy competes with the first paint.
 * - The real source is attached only when the video comes within ~300px of
 *   the viewport, at 720px wide on small screens and 1280px otherwise, and
 *   it's paused again whenever it scrolls out of view.
 * - Reduced-motion and Save-Data visitors keep the still poster.
 *
 * The colour grade (brightness/saturation/contrast) is baked into the files
 * rather than applied with a CSS filter, which used to force every decoded
 * frame through an extra GPU pass.
 */
export default function BgVideo({ name, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      v.src = `/media/${name}-${window.innerWidth <= 768 ? 720 : 1280}.mp4`;
    };

    let idle = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // let the first paint and hydration finish before decoding starts
          const start = () => {
            load();
            v.play().catch(() => {});
          };
          // Safari has no requestIdleCallback
          if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 1500 });
          else idle = setTimeout(start, 200) as unknown as number;
        } else if (loaded) {
          v.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      clearTimeout(idle);
    };
  }, [name]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={`/media/${name}-poster.webp`}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
