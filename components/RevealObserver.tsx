"use client";

import { useEffect } from "react";

/**
 * The shared reveal-on-scroll IntersectionObserver used by /experience and
 * /lets-talk (the home page has its own copy inside HomeInteractions.tsx,
 * since there it shares state with the Range/FAQ/Build scroll logic).
 *
 * Elements already inside the viewport at mount get their `.in` class added
 * synchronously up front, rather than waiting on the observer's first
 * (asynchronous, and occasionally slow to arrive under heavy main-thread
 * load — e.g. a decoding background video plus a running canvas loop) call-
 * back. Without this, above-the-fold content like the hero heading could
 * stay invisible for several seconds after a fresh load even though nothing
 * was actually broken — the observer just hadn't reported in yet. Every
 * element is still `observe()`d normally afterward for scroll-triggered
 * reveals further down the page.
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rise");
    const vh = window.innerHeight;
    [...els]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < vh && r.bottom > 0;
      })
      .forEach((el) => el.classList.add("in")); // all reads, then all writes

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.16 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
