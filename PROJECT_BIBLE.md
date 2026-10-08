# PROJECT_BIBLE — THE RANGE

What this repo is, how it's put together, and the traps already discovered
while building it. Written from what's actually in the codebase — nothing
here is aspirational.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript 5.9** (strict mode)
- **Tailwind CSS v3.4** — installed and configured (`tailwind.config.ts`, design
  tokens mirrored via CSS variables) for *new* work going forward. The
  existing ~2,300 lines of hand-written CSS were ported into
  `app/globals.css` almost verbatim rather than rewritten into Tailwind
  utilities — see "Styling" below for why.
- **ESLint 9** flat config (`eslint.config.mjs`), `eslint-config-next`
- No CSS-in-JS, no component library, no animation library — everything here
  is the same vanilla CSS/canvas/DOM techniques the original three static
  HTML files used, just relocated into components.

## Route map

| Route | Source | Renders |
|---|---|---|
| `/` | `app/page.tsx` | Hero, The Build, The Range, Research, Method, Philosophy, FAQ, Telemetry, Contact — plus the command palette, terminal, project/sim/contact modals |
| `/experience` | `app/experience/page.tsx` | Four years at RamanByte — hero, company, "how the work runs", six case studies, tech stack, signature |
| `/lets-talk` | `app/lets-talk/page.tsx` | A direct contact page — no form, just email + GitHub |

Shared chrome (fonts, `<html>`/`<body>`) lives once in `app/layout.tsx` via
`next/font/google` (Inter, JetBrains Mono, Beau Rivage, Italianno), instead
of being duplicated per page the way the three original HTML files each
re-declared the same Google Fonts `<link>` tag.

## Directory layout

```
app/
  layout.tsx            root layout, fonts, metadata
  globals.css           every design token + every section's CSS, consolidated
  page.tsx              home page assembly
  experience/page.tsx
  lets-talk/page.tsx
components/
  sections/             Hero, Build, Range, Research, Method, Philosophy, Faq, Telemetry, Contact (home page sections)
  home/                 HomeTopBar, Loader, HomeInteractions (the big client-side behavior component), ProjectCardArt
  experience/           CaseStudy, ShotGallery, PhoneGallery, Lightbox
  ui/                   CommandPalette, Terminal, ProjectModal, SimModal, ContactModal, Toast
  ConstellationBackground.tsx, RevealObserver.tsx, SimpleTopBar.tsx, LetsTalkInteractions.tsx
lib/
  projects.ts           the 9 Range cards (was PROJECTS in the old inline <script>)
  research.ts           the 6 case files / 10 findings
  method.ts, beliefs.ts, faqs.ts, build-chapters.ts, telemetry.ts
  experience.ts         the 6 RamanByte case studies
  css-vars.ts           CSSVarStyle helper type (see "Inline custom properties" below)
public/
  shots/                every project screenshot (was assets/shots/)
  sims/                 the 5 vendored zero-dependency physics sims (was assets/sims/)
legacy/
  index.html, experience.html, lets-talk.html   the original static files, kept for reference
```

## Design tokens

One `:root` block in `app/globals.css` — colors (`--black`, `--gold`,
`--rosso`, `--navy`/`--cyan` for the Research/Method "second identity",
`--sage` for The Build), the spacing ladder (`--xxs` through `--xxl`), and
`--ease` (the one easing curve used everywhere). `tailwind.config.ts`
mirrors these into `theme.extend` by referencing the CSS variables directly
(`gold: "var(--gold)"`) rather than duplicating hex values, so `globals.css`
stays the single source of truth.

The 12° cut (`clip-path`, `atan(18/84)`) and the hex clip-path stay as
hand-written `.cut` / `.cut-sm` / `.hex` utility classes — Tailwind v3 has no
core clip-path utilities, so duplicating them into the Tailwind config would
just be dead weight.

**Per-page width variants.** The three original files each capped `.shell`
at a different `max-width` (1320px / 1180px / 900px) and `.topbar` at a
different width, using the *same* class names with different values. Merging
all three files' CSS into one stylesheet made that a real cascade collision
(same selector, different rule, whichever page's CSS happened to load last
would win everywhere). Fixed with additive modifier classes —
`.shell--exp`, `.shell--talk`, `.topbar--wide`, `.topbar--exp`,
`.topbar--talk` — applied alongside the base class instead of overriding it.
The Research board's `.case*` classes had the same collision with
`/experience`'s case-study `.case*` classes (two unrelated meanings, same
names); the experience-page family was renamed to `.xp-case*`.

## Section mechanics

### The Range — sticky-stacking cards

`components/sections/Range.tsx` renders `PROJECTS` (from `lib/projects.ts`)
into `.stack-card` articles inside `#range`. The stacking is CSS-only:

```css
.stack-card{
  position:sticky; transform-origin:top;
  top:calc(92px + var(--k,0) * 8px);
  z-index:calc(1 + var(--k,0));
  height:min(72vh,540px); min-height:460px;
}
```

`--k` is just the card's index, set inline. Each card pins 8px lower and one
`z-index` higher than the last, so the "dramatic overlap" is a mid-scroll
transition, not the resting state. The **only** JS involved
(`HomeInteractions.tsx`'s `layout()`) determines which card is currently
"active" (for the HUD readout and the side progress dots) and toggles
`.is-behind` (`brightness(.5) scale(.98)`) on cards the active one has
covered. **Do not add scroll-jacking, transform math, or a spacer div here**
— see the trap below for why this exact structure matters.

### The command palette, terminal, and modals

All four (`CommandPalette`, `Terminal`, `ProjectModal`, `SimModal`,
`ContactModal`) are rendered as static shells with empty content divs;
`HomeInteractions.tsx` fills them and wires up open/close imperatively via
`document.getElementById`, mirroring the original inline `<script>` almost
line-for-line. This was a deliberate choice over "idiomatic React state per
component": the original script is one cohesive unit where every feature
shares `closeAllOverlays()`, the rAF-gated scroll tick, and lookups into
`PROJECTS`/`RESEARCH_CASES` — splitting it into isolated components would
mean re-deriving those shared bindings for no real benefit.

### The live simulator modal

`SimModal` sets `#simFrame`'s `src` to `/sims/<name>.html` only when opened,
and resets it to `about:blank` on close — so the four vendored zero-dependency
physics sims under `public/sims/` never run until a visitor actually clicks
one. Revuelto (`public/sims/revuelto.html`, backed by 110 WebP frames under
`public/sims/revuelto/`) is scroll-driven and doesn't nest reliably inside an
iframe's own scroll context, so it opens in a new tab via `window.open`
instead of through this modal — see `data-open-tab` handling in
`HomeInteractions.tsx`.

### The particle field + SURVIVE minigame

`ParticleField` (a small class defined inside `HomeInteractions.tsx`) drives
two canvases: `#fieldBg` (fixed behind the whole page) and `#fieldHero`
(inside the hero, doubling as SURVIVE's play area). Cursor position pushes
particles via inverse-distance force; SURVIVE spawns expanding "shockwave"
rings and ends the run if the cursor is inside a ring's lethal core. Reachable
via the terminal (`play`), the command palette, or the hint pill that fades
in after a few idle seconds.

### Research filters, FAQ, Method

Research's domain filter pills are computed server-side in
`Research.tsx` (from the same `PROJECTS` domain taxonomy `Range.tsx` uses —
never a second, invented copy) and toggled client-side via
`HomeInteractions.tsx`. FAQ items are independent per-item toggles, plus a
continuous (not entrance-only) scroll-tied tilt (`updateFaqTilt`). Method
renders its two "acts" from `lib/method.ts`; each act's SVG artwork is raw
markup rendered via `dangerouslySetInnerHTML` (see "Decorative SVGs" below).

## Content is data-driven

- `lib/projects.ts` — the 9 Range cards. Each project's `art` field is a
  typed union (`scrollable | gallery | sim-quad | pipeline | revuelto`)
  describing which `ProjectCardArt.tsx` layout to render and with what real
  screenshot(s) — adding a 10th project is a data edit, not new markup.
- `lib/research.ts`, `lib/method.ts`, `lib/beliefs.ts`, `lib/faqs.ts`,
  `lib/build-chapters.ts`, `lib/telemetry.ts` — same pattern for their
  sections.
- `lib/experience.ts` — the six RamanByte case studies, including their
  screenshot galleries (`ShotGallery` for the desktop browser-chrome
  variant, `PhoneGallery` for Dada Udyogini's native-resolution phone
  screenshots) and stack/numbers/access blocks. `CaseStudy.tsx` renders any
  entry from this array — adding a 7th case study (the "Also at RamanByte"
  slot already sitting in `app/experience/page.tsx`) is a data edit.

### Decorative SVGs and prose blocks

Hand-drawn SVG icons (Research's case-file icons, Method's two act
illustrations, The Build's six chapter icons, Telemetry's tech glyphs) are
stored as raw markup strings in the `lib/*.ts` files and rendered via
`dangerouslySetInnerHTML`. Same for `lib/experience.ts`'s prose fields
(`aboutHtml`, `bodyHtml`, `sideHtml` etc.), which carry the original files'
inline `<b>`/`<i>`/`<span class="mono">` formatting. This is safe here
specifically because it's 100% static, author-written content — never user
input — and it avoided hand-rebuilding dozens of inline-formatted SVGs and
paragraphs as JSX for no behavioral difference.

## Images

Real project/case-study screenshots go through `next/image` with their real
intrinsic pixel dimensions (measured directly off the files, not guessed —
see git history if you need to re-derive them for a new asset) so there's no
layout shift. The `card-art` full-page screenshots were `unoptimized` until Oct 2026; they
now go through the optimizer with `sizes="(min-width: 860px) 640px, 100vw"`
(WebP, never wider than the 900px originals) — PageSpeed flagged them as the
home page's image-delivery waste. Sim/tri thumbnails and the phone-gallery
shots use normal optimized `next/image`.

## Known traps

### `overflow-x: hidden` silently disables `position: sticky`

Recorded in `CHANGELOG.md` (2026-08-21): any ancestor with `overflow`
other than `visible`/`clip` disables `position: sticky` for every
descendant — this is what broke THE RANGE's stacking the first time it was
built. `body{overflow-x:clip}` in `globals.css` is the fix; it prevents the
same horizontal bleed without establishing a scroll container.
**Do not change this back to `hidden`.**

### `calc(var(--custom-property))` inside `transition-delay` — a real rendering bug found during this migration

The original `.rise` reveal utility used a per-element `--i` custom property
for its stagger delay: `transition-delay:calc(var(--i,0)*60ms)`. Ported
directly, this reproduced two distinct bugs under Next 16 + Turbopack (both
confirmed via a running dev/prod server and DevTools, not guessed):

1. Declaring `transition-delay` as a **separate** property after a
   comma-separated `transition:` shorthand (`transition:opacity .8s ease,
   transform .8s ease; transition-delay:calc(var(--i,0)*60ms);`) caused the
   CSS minifier to emit `transition-property: ; transition-duration: ; …`
   — empty. Merging the delay into the shorthand
   (`transition:opacity .8s ease calc(var(--i,0)*60ms), transform .8s ease
   calc(var(--i,0)*60ms);`) fixed the empty-properties symptom.
2. Even fixed that way, elements' computed `opacity` stayed at `0`
   indefinitely on a fresh load despite the `.in` class being present and a
   matching `.rise.in{opacity:1}` rule existing — confirmed reproducible in
   both `next dev` and a production `next start` build, so it wasn't a
   React Strict Mode artifact. Removing `calc(var(--i))` from the delay
   entirely made it render correctly every time.

**Fix shipped**: the stagger delay is now a plain inline
`style={{ transitionDelay: "Nms" }}` computed in JSX (see any section
component), and `.rise` in `globals.css` has a fixed, var-free transition.
`lib/css-vars.ts`'s `CSSVarStyle` type is still used for the custom
properties that don't have this problem (`--accent`, `--k`, `--c`).

### The corridor → sticky-stack rewrite (history, not current behavior)

`RESEARCH.md` documents an earlier CSS 3D-perspective "corridor" mechanic
(`perspective`/`rotateY`/z-depth) that shipped first and was replaced by the
sticky-stacking approach actually in this repo today. It's kept as a record
of that exploration, not documentation of current behavior — don't resurrect
scroll-jacking or per-frame transform math based on it.

## Verification performed for this migration

- `npm run build` — zero type errors, zero warnings (Next 16 / Turbopack /
  TypeScript 5.9 strict mode).
- `npm run lint` — zero errors, zero warnings.
- Manual browser verification (both `next dev` and a production
  `next start` build) of: the Range sticky-stack + HUD + dimming, the
  command palette (open, filter, run a command), the terminal, the SURVIVE
  minigame, the live simulator modal (confirmed `aeon.html` runs live inside
  the iframe with no 404), Research's domain filters, the FAQ toggle, THE
  BUILD's spine fill and wipe-line reveal, `/experience`'s desktop and phone
  screenshot galleries plus the lightbox, and `/lets-talk`'s copy-email
  toast. No console errors, no 404s on `/shots/*` or `/sims/*` in the
  network log.

## Deploying

Pushes to `main` deploy to production on Vercel. `SITE_URL` (`lib/site.ts`)
is fixed to `https://www.shreyanshkumarsingh.com` in production and never
derived from `VERCEL_URL` — deriving it from the vercel.app host once made
every canonical point at the wrong domain.

## 2026-10 SEO / AEO / agent overhaul — where things live

- **One header, one footer** on every page: `components/site/SiteHeader.tsx`
  (nav from `lib/nav.ts`; the home page adds the ⌘K trigger) and
  `components/site/SiteFooter.tsx` (the video footer). Inner pages wrap in
  `components/site/PageShell.tsx`; their styles are in `app/pages.css`.
- **Brand**: `public/brand/` holds web-sized SKS monogram/wordmark files made
  from the originals in `public/logo/` (not committed); favicons are
  `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`.
- **Loader**: 1.4s on the first visit, 0.5s on repeat visits in the same tab
  (sessionStorage), reveals the white wordmark.
- **Agent layer**: `proxy.ts` (markdown negotiation), `app/md/`,
  `app/api/mcp/`, `app/api/well-known/`, `lib/markdown.ts`, `lib/mcp.ts`.
- **Security headers / CSP**: `next.config.ts`. `/sims/*` is exempt from the
  CSP (vendored single-file apps) and may be framed same-origin.
- **Content rules**: never name the bank behind Sarthi; never publish the
  phone number in machine-readable form; every fact traces to a repo, the
  client's brief or his résumé.
