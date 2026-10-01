import type Lenis from "lenis";

// The one Lenis instance (created by components/SmoothScroll.tsx), shared so
// programmatic scrolls — command-palette jumps, the minigame's scroll back
// to the hero — glide on the same curve as the wheel instead of jumping.

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Smooth-scrolls to an element; falls back to native scrolling when Lenis
 *  is off (reduced motion) or not mounted yet. */
export function scrollToElement(el: HTMLElement) {
  if (instance) instance.scrollTo(el);
  else el.scrollIntoView({ block: "start" });
}
