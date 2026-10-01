"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Site-wide smooth wheel scrolling (Lenis). It drives the real window scroll
 * position, so position:sticky, scroll listeners and IntersectionObservers
 * all keep working unchanged. Touch devices keep native scrolling.
 *
 * - Off entirely for prefers-reduced-motion.
 * - allowNestedScroll: the wheel still scrolls inner panes (the long
 *   screenshots inside project cards, modal bodies, the command palette).
 * - Paused whenever <body> locks scrolling — the intro loader
 *   (body.loading) and the lightbox (body overflow:hidden) — so the wheel
 *   can't move the page behind them.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    const body = document.body;
    const syncLock = () => {
      const locked = body.classList.contains("loading") || body.style.overflow === "hidden";
      if (locked && !lenis.isStopped) {
        lenis.stop();
      } else if (!locked && lenis.isStopped) {
        // the page may have been scrolled natively while paused (the loader
        // resets to the top) — resync before resuming so nothing lurches
        lenis.resize();
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        lenis.start();
      }
    };
    syncLock();
    const mo = new MutationObserver(syncLock);
    mo.observe(body, { attributes: true, attributeFilter: ["class", "style"] });

    return () => {
      mo.disconnect();
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
