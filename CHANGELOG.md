# Changelog

All notable changes made to `index.html` this session, newest first. This
file exists because the page went through a large number of iterative
changes — including one full mechanic replacement — and the story of *why*
things look the way they do isn't obvious from the diff alone.

> **Note:** `README.md` still describes the old 3D-perspective "corridor"
> mechanic (see the last entry below for why that changed). It hasn't been
> rewritten yet — flag it if you want that done too.

---

## 2026-08-21 — THE RANGE: rebuilt as sticky-stacking cards, then fixed

The corridor section (7 project cards) went through two passes.

### Pass 2 — fixed the stack (it wasn't stacking)

After the first rebuild (below), cards were rendering one after another
instead of pinning/overlapping. Root-caused by comparing against a working
reference implementation
([sumandebnath.houseofnamus.com](https://sumandebnath.houseofnamus.com/),
its "04 / Selected Systems" section):

- **Root cause**: `body { overflow-x: hidden }` silently disables
  `position: sticky` for *every* descendant — a well-documented CSS trap
  (any ancestor with `overflow` other than `visible`/`clip` breaks sticky
  inside it). Fixed by switching to `overflow-x: clip`, which prevents the
  same horizontal bleed without establishing that scroll container.
- **Uniform card height** — every card is now the same height
  (`min(72vh, 540px)`, `460px` floor). Previously later cards shrank
  per-index, which was wrong; sticky's per-card scroll "dwell" time comes
  from the card's own height in normal flow, not from an artificial spacer.
- **Removed the separate scroll-spacer wrapper** (`.stack-slot`, 120vh) —
  cards now sit directly in a `flex-direction: column` container, matching
  the reference structure exactly.
- **Peek step corrected**: 8px top-offset / +1 z-index per card (was 48px).
  The large peek in the reference screenshot the request was based on turned
  out to be a mid-scroll transition snapshot, not the resting state.
- **Added scroll-linked dimming**: a card gets `.is-behind`
  (`brightness(.5) scale(.98)`, eased) once the next one has covered it —
  the one bit of per-frame JS the page still does, toggled in `layout()`.

### Pass 1 — replaced the 3D-perspective corridor entirely

The original "corridor" was a scroll-jacked CSS 3D effect (`perspective`,
`rotateY`, z-depth translation, a floor grid, rail lines) — cards appeared
to recede away from the viewer like plinths in a hallway. Replaced with
native `position: sticky` stacking cards (no per-frame transform math for
the core mechanic):

- Each project card pins to the top of the stack as the next rises to cover
  it, à la the reference site above.
- Right panel reuses the real project screenshots (see the 2026-08-20 entry)
  in a two-column layout; left column got badges (from `figs`), a `STACK`
  tag row, and dual buttons — a primary repo link plus a "Research case →"
  link for the 5 projects that have a matching case file in the Research
  section (added via `id="case-N"` anchors — never a fabricated link).
- Card background gradients use each project's real accent color
  (`--accent`, extracted from that project's own design tokens — see
  below), not a generic shared color.
- Removed the old `.floor`/`.rail`/`.stage` 3D scaffolding, the `--n`-driven
  scroll-height hack, and the giant per-frame `layout()` transform loop —
  the new `layout()` only computes which card is active, for the HUD
  readout and the side progress dots (decorative, not load-bearing).
- **Copy updated to match**, since it now describes something different:
  title tag (the old short-name title, since retired), meta description, hero H1 ("One stack"
  instead of "One corridor"), hero CTA ("See the range"), nav link
  ("Range"), the concept-note, and the footer meta line. `README.md` was
  *not* updated to match — see the note at the top of this file.

---

## 2026-08-20 — Research: rebuilt as an "evidence wall" of case files

Different storytelling device from Method's (see below) — investigation
rather than narrative:

- The 9 research findings were regrouped from a flat 2-column grid into
  **5 case files**, one per source project, each fronted by a small
  hand-drawn SVG exhibit icon distilling that project's research theme
  (a cube-root growth curve for THE EVOLUTION, a verified-checkmark +
  off-switch for NYTHERA, four linked module boxes for SARTHI, a
  single glowing source-node for ANTARANG, three colored marque chips for
  THE COLLECTOR'S PULSE — reusing its real TCG/Figures/Watches accent
  colors).
- Findings render as pinned index cards (subtle alternating tilt, a gold
  "pin" dot, straighten-and-lift on hover) under a shared "CASE NN —
  PROJECT" tab, instead of each note repeating its project name.
- Board sits on a faint dotted corkboard texture.
- Each case got `id="case-N"`, later reused by THE RANGE's cross-links.

## 2026-08-20 — Method: rebuilt as a two-act story with hand-drawn artwork

Replaced the flat 6-item list with two illustrated acts:

- **Act I — "The discipline"**: an SVG of two stacked, tokenized spec
  documents with a wax-seal checkmark and a "SPEC FIRST" measurement
  annotation. Covers beats 01–03 (write the bible, tokenize the design,
  source every number).
- **Act II — "The scrutiny"**: an SVG hexagonal system diagram (reusing the
  page's existing hex motif) with a flagged critical (`P0`) node under a
  magnifying glass, captioned "PROVE IT". Uses the page's rosso/security-red
  accent instead of gold. Covers beats 04–06 (audit like an adversary,
  degrade honestly, choose the right tool).
- Each act pairs its artwork with a short narrative line, then its 3 beats
  as a connected storyboard (a vertical spine line through numbered nodes,
  styled like the corridor cards' index badges). Art sits beside the beats
  on desktop, alternating sides between the two acts; stacks on mobile.

## 2026-08-20 — The Range (pre-rebuild): real screenshots, full page, bigger cards

Before the mechanic itself was replaced, the *content* of the cards was
upgraded through a few passes:

- **Real screenshots, not fabrications.** For the 5 projects without an
  existing screenshot on disk, actually booted each one's local dev server
  (all had dependencies already installed) and used Playwright to capture
  the live, running app, then compressed PNG → JPEG (~4.7MB → ~430KB total):
  - `assets/shots/nythera-real.jpg` — Nythera's real landing page (via
    `python run.py`, its FastAPI dashboard on `:8000`)
  - the Sarthi screenshot — SARTHI's Customer 360 dashboard,
    populated with a live synthetic customer record
  - `assets/shots/antarang-gallery.jpg` / `antarang-real.jpg` — ANTARANG's
    dual-axis World/Indian Art timeline UI, plus its particle-field intro
  - `assets/shots/bookverse-real.jpg` — BookVerse AI's real hero
  - `assets/shots/collectors-real.jpg` — The Collector's Pulse homepage
    with live trending articles
  - `assets/shots/vaultiq-real.jpg` — VaultIQ's real landing page (this
    also corrected a wrong guess: its actual brand is violet/pink
    `#7C3AED`, not enterprise blue)
  - `assets/shots/evolution*.png` — already-existing designed thumbnails
    from the real THE_EVOLUTION repo, copied over unchanged
- **Full page, not just the hero.** Re-captured with Playwright's
  `fullPage: true`, and made the screenshot frame internally scrollable
  (`.card-art .shot.scrollable`, themed scrollbar) so nothing below the
  fold is hidden or cropped.
- Cards enlarged generally (`min(560px,84vw)` → wider), padding and type
  scale increased.
- Per-project `accent` colors extracted from each project's *own* real
  design tokens/CSS (not invented): e.g. SARTHI's teal `#00674D`,
  ANTARANG's museum gold `#C9A45A` (from its `.plaque` component), THE
  COLLECTOR'S PULSE's ember `#F2762E`.

## 2026-08-20 — Telemetry: tech icons, glass polish, background video

- Replaced flat text pills with a `TECH_META` table giving each of the ~38
  technologies its own brand-colored "3D box" — either a real lettermark
  (TS, JS, ng — several real logos genuinely are colored-square-plus-letter)
  or a small hand-drawn pictogram (React atom, Python, database cylinder,
  shield, lock, etc.). Color families echo the page's existing domain-color
  logic (gold for Applied AI/Graphics, rosso for Security).
- Boxes styled with an offset hard-shadow "extruded block" look, then
  softened: rounded corners (`border-radius:18px`) plus a diagonal gloss
  sheen (blended so each box's own color still shows through) and a small
  glass-highlight ellipse. Real 3D tilt (`perspective`/`rotateX`/`rotateY`)
  on hover.
- Added a background video (`.telemetry-video`) behind the section, same
  brightness treatment as hero/footer; brightened `.tech-name` and group
  labels with a drop-shadow afterward since the video reduced legibility.

## 2026-08-20 — Hero + footer: background video

- Added a looping background `<video>` to the hero (brightened after an
  initial pass looked too dark: `opacity:.5→.85`, `brightness(1.25)`) and a
  second video to the footer, same treatment, overlay tuned to fade into
  `--iron` instead of pure black to match the footer's own background.
- Both (plus the later Telemetry video) are paused via JS for
  `prefers-reduced-motion` users.
