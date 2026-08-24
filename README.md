# THE RANGE

A scroll-driven portfolio page for Ansh (Shreyansh Kumar Singh).

## Open it

Just double-click `index.html`. No install, no build step, no server required —
same zero-dependency philosophy as THE EVOLUTION in the main range. (The one
exception: the `assets/shots/` folder needs to travel with `index.html` if you
move or deploy it — see below.)

## The concept

Seven repositories, presented as a stack: scroll and each project card pins
to the top as the next one rises to cover it, like flipping through a stack
of case files. The stacking itself is native `position: sticky` — one small
top-offset/z-index step per card, no scroll-jacking, no parallax library. The
only scroll-driven code left dims a card once the next one has covered it.

Every screenshot on the page is real, not mocked up: for the projects that
don't have an existing screenshot on disk, their local dev servers were
actually booted and captured live with Playwright (full page, not just the
hero), then compressed to keep the page light. Nothing here is a stand-in.

- **Hero** — the working thesis and headline stats, with a looping background
  video.
- **The Range** — the stacking-cards piece. Seven cards (THE EVOLUTION,
  NYTHERA, IDBI SARTHI, ANTARANG, BOOKVERSE AI, THE COLLECTOR'S PULSE,
  VAULTIQ), each with its real reference code, figures, stack, and a live
  screenshot of the actual running project. Card backgrounds and buttons use
  that project's own real accent color (pulled from its own design tokens/
  CSS, not invented). Five of the seven cross-link to a matching case file in
  Research.
- **Research** — told as an evidence wall: the nine findings grouped into
  five case files by source project, each fronted by a small hand-drawn
  exhibit icon, findings rendered as pinned index cards.
- **Method** — told as two illustrated acts: "The discipline" (before the
  code exists — write the bible, tokenize the design, source every number)
  and "The scrutiny" (after it ships — audit like an adversary, degrade
  honestly, choose the right tool), each with its own hand-drawn SVG artwork.
- **Telemetry** — the instrument rack. Every technology gets its own
  brand-colored, glossy 3D icon tile instead of a text pill.
- **Contact** — email and GitHub.

`RESEARCH.md` documents an earlier exploration — a CSS 3D-perspective
"corridor" effect (cards as plinths receding in fog, `perspective`/
`rotateY`/z-depth) — that shipped first and was later replaced by the
sticky-stacking approach described above. It's kept as a record of that
technique and the reasoning behind it, not as documentation of the current
page.

## Design tokens

Colors, spacing ladder, the 12° cut (`atan(18/84) = 12.1°`), and the
Archivo/JetBrains Mono type system are carried over unchanged from
`DESIGN_SYSTEM.md` in the main portfolio.

## Status

This is a standalone concept piece, not wired into the Next.js site in
`D:\MYPROJECTS\Portfolio`. The stacking mechanic is close to CSS-only (a
handful of custom properties driving `top`/`z-index`, plus one small
scroll-linked class toggle for the dimming effect), so porting it into a
`Range.tsx` client component would mostly mean moving markup — there's very
little scroll math to carry over, unlike the corridor version this replaced.
