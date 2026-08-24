# Research — building a 3D-style scroll website

Notes taken before writing any code for THE CORRIDOR, in the same spirit as
`DESIGN_SYSTEM.md` in the main portfolio: name the technique, then say why it
was chosen over the alternatives.

## 1. The three ways to get "3D" on the web

| Approach | What it is | Cost | Chosen? |
|---|---|---|---|
| **WebGL / Three.js / React Three Fiber** | Real 3D scene graph, GPU-rendered meshes, camera, lights | Heaviest: a render loop, shader compilation, a GPU context, ~150KB+ of library | No — already the tool for ANTARANG (an actual walkable museum). Using it again here would be the same trick twice. |
| **CSS 3D transforms** (`perspective`, `translateZ`, `rotateY`, `preserve-3d`) | The browser's compositor treats each element as a plane in a real 3D coordinate space | Cheap: GPU-composited, no render loop, no library | **Yes.** A corridor is a sequence of flat plinths in depth — exactly what `perspective` + `translateZ` model natively, with zero dependencies. |
| **2D fake-3D** (parallax layers, skew, shadow tricks) | Depth simulated with 2D transforms and layering order | Cheapest, but reads as "parallax," not "3D" | No — doesn't deliver the walk-through feeling the brief asked for. |

## 2. Driving the 3D with scroll, without scroll-jacking

Two ways to couple scroll position to a transform:

1. **`scroll-timeline` / `animation-timeline: scroll()`** — a native CSS API
   (Chrome/Edge 115+) that ties a CSS animation's progress directly to scroll
   offset, no JS at all. Rejected for now: no Firefox/Safari support yet, and
   the corridor needs a *shared* progress value driving multiple elements
   (cards, floor grid, HUD readout) with per-card offset math CSS can't
   express on its own.
2. **`scroll` event → `requestAnimationFrame` → `transform`** — read
   `getBoundingClientRect()` once per frame (not per scroll event, which can
   fire dozens of times per frame), compute each card's progress, write only
   `transform` and `opacity`. This is what the corridor uses.

Rule that matters most: **never touch layout properties (`top`, `width`,
`margin`) in the scroll handler.** Only `transform` and `opacity` are
GPU-compositable — anything else forces a layout recalculation on every
frame and the "3D scroll" turns into a slideshow of dropped frames on a
mid-range laptop.

## 3. Why the corridor doesn't hijack the scroll

Sites that intercept `wheel`/`touchmove` and replace it with their own
scroll physics look impressive in a demo and are hostile in practice: they
break the browser's back-forward cache heuristics, break `Ctrl+F`/find-on-page
scroll-to-result, and break trackpad momentum on Safari. THE CORRIDOR reads
the *native* scroll position — the page is one tall document, `position:
sticky` pins the 3D stage while its parent scrolls underneath it, and the
transform is a pure function of `scrollY`. That means: keyboard scrolling
(Space, Page Down, arrow keys), screen-reader virtual cursor scrolling, and
trackpad/touch scrolling all drive the same effect for free, and the browser
UI keeps working normally.

## 4. Depth cues that sell "walking forward," not just "things fading in"

A single moving `translateZ` reads as a slide transition, not depth. What
makes it read as 3D:

- **Differential rates** — the floor grid, the side rails and the cards move
  at three different apparent speeds (near things move faster across the
  frame than far things), the actual parallax cue human vision uses for
  depth.
- **Fog** — opacity and a slight blur/brightness falloff on distant cards, so
  the vanishing point is genuinely dim, echoing the fact that the museum
  project (ANTARANG) uses real PBR lighting falloff for the same reason.
- **A vanishing point that doesn't move** — `perspective-origin` fixed at
  center; if it drifts, the eye reads it as the *world* rotating rather than
  the *camera* dollying forward.
- **One axis of rotation, not two** — cards only `rotateY` (as if passing to
  either side of you), never `rotateX`. Mixing axes is what makes cheap CSS-3D
  demos feel like a tumbling die instead of a walk.

## 5. Performance and accessibility budget

- `will-change: transform` only on the elements actually animating, removed
  otherwise — it's a hint that costs memory if left on everything.
- The scroll handler is a single `rAF`-gated function; a `ticking` boolean
  prevents queuing more than one frame of work.
- `prefers-reduced-motion: reduce` removes the 3D transform path entirely —
  cards lay out as a normal vertical stack with a plain fade-in. This isn't a
  degraded experience bolted on after the fact; the layout was written
  mobile/reduced-motion-first so the 3D transform is additive, never
  load-bearing for reading the content.
- Nothing in the corridor is interactive-only-in-3D: every card is real DOM
  in document order, so screen readers and `Ctrl+F` see the same content a
  sighted mouse user does.

## 6. What this deliberately leaves out

No smooth-scroll/momentum library (Lenis, Locomotive Scroll) — native scroll
plus `scroll-behavior: smooth` for anchor jumps was enough, and every such
library fights `prefers-reduced-motion` and trackpad inertia in some browser.
No GSAP/ScrollTrigger — the transform math here is linear-per-card and
doesn't need a timeline/easing engine. Both are legitimate choices for a
larger site; they were cut here for the same reason THE EVOLUTION ships as a
zero-dependency single file: fewer moving parts, nothing to update, nothing
that can silently start pulling a different version off a CDN.
