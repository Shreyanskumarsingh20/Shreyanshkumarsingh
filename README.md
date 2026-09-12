# THE RANGE

A scroll-driven portfolio for Ansh (Shreyansh Kumar Singh) — Next.js App
Router, TypeScript, Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Three routes: `/` (the main portfolio),
`/experience` (four years at RamanByte), `/lets-talk` (a direct contact
page). `npm run build && npm run start` for a production build.

This used to be three self-contained, zero-build-step static HTML files
(`index.html`, `experience.html`, `lets-talk.html` — double-click and open,
no server required). That version is preserved under `legacy/` for
reference; it is no longer the maintained version of the site. See
`PROJECT_BIBLE.md` for the full story of the migration and why the
sticky-stack/particle-field/command-palette mechanics look the way they do.

## The concept

Nine repositories, presented as a stack: scroll and each project card pins
to the top as the next one rises to cover it, like flipping through a stack
of case files. The stacking itself is native `position: sticky` — one small
top-offset/z-index step per card, no scroll-jacking, no parallax library.
The only scroll-driven code left dims a card once the next one has covered
it.

Every screenshot on the page is real, not mocked up: for the projects that
don't have an existing screenshot on disk, their local dev servers were
actually booted and captured live with Playwright (full page, not just the
hero), then compressed to keep the page light. Nothing here is a stand-in.

- **Hero** — the working thesis and headline stats, with a looping
  background video and a live cursor-reactive particle field (also the
  SURVIVE minigame's play area).
- **The Build** — an illustrated six-chapter origin story between Hero and
  Range.
- **The Range** — the stacking-cards piece. Nine cards, each with its real
  reference code, figures, stack, and a live screenshot (or, for THE
  EVOLUTION and Revuelto, a click-to-run live simulator / scroll teardown).
  Card backgrounds and buttons use that project's own real accent color.
  Six of the nine cross-link to a matching case file in Research.
- **Research** — an evidence wall: findings grouped into case files by
  source project, filterable by domain.
- **Method** — two illustrated acts: "The discipline" (before the code
  exists) and "The scrutiny" (after it ships).
- **Philosophy + FAQ** — six operational beliefs and direct answers to the
  questions they raise, in a deliberately different (soft, light) visual
  register from the rest of the page.
- **Telemetry** — the instrument rack. Every technology gets its own
  brand-colored, glossy 3D icon tile.
- **Contact** — email, GitHub, and a command palette (⌘K) / hidden terminal
  (backtick) for anyone who goes looking.

`RESEARCH.md` documents an earlier exploration — a CSS 3D-perspective
"corridor" effect (cards as plinths receding in fog) — that shipped first
and was later replaced by the sticky-stacking approach described above. It's
kept as a record of that technique and the reasoning behind it, not as
documentation of current behavior. `CHANGELOG.md` documents the corridor →
sticky-stack rewrite itself, including the `overflow-x: hidden` vs
`position: sticky` bug that caused it to need a second pass.

## Project structure

```
app/            routes (/, /experience, /lets-talk) + layout + global CSS
components/     sections, UI overlays, and the per-page interaction logic
lib/            typed, data-driven content (projects, research, telemetry, …)
public/shots/   project + case-study screenshots
public/sims/    the vendored zero-dependency physics simulators
legacy/         the original static HTML files, kept for reference
```

See `PROJECT_BIBLE.md` for the full architecture writeup (design tokens,
each section's mechanic, known CSS traps) and `IDEAS.md` for a
planning-only feature roadmap.

## Design tokens

Colors, spacing ladder, the 12° cut (`atan(18/84) = 12.1°`), and the
Inter/JetBrains Mono/Beau Rivage type system live once in
`app/globals.css`'s `:root` block and are mirrored into
`tailwind.config.ts`.
