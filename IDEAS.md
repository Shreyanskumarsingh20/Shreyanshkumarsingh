# IDEAS — feature roadmap

A planning-only wishlist, grouped by effort. Nothing here is implemented or
scheduled — this is a menu to work through at your own pace, modeled on the
kind of features `sumandebnath-portfolio` (the reference repo this
migration's project structure was modeled on) has that this site doesn't
yet.

---

## Lightweight — portfolio-native, natural extensions of this migration

These fit the site's existing shape and mostly reuse data/components already
in the repo.

- **`/faq` as its own page.** The FAQ content already exists
  (`lib/faqs.ts`) and renders inline on the home page — a standalone `/faq`
  route (or `/faq` redirecting into the home page's anchor, whichever reads
  better) gives it its own indexable URL and OG card for direct sharing.
- **`/projects/[slug]` — a dynamic case-study route per Range project.**
  `lib/projects.ts` already has everything a case study needs (name, line,
  figs, stack, accent, art). Add a `slug` field, generate static params from
  `PROJECTS`, and reuse the existing `ProjectModal` content (currently only
  reachable via a click-triggered overlay) as a real, linkable, crawlable
  page. The "Case study →" button on each Range card could link here instead
  of (or in addition to) opening the modal.
- **A resume page generated from data**, e.g. `/resume`, built from
  `lib/projects.ts` + `lib/experience.ts` + a small new `lib/resume.ts` for
  the parts that don't map to either (contact info, a summary line). The
  existing print stylesheet in `globals.css` (originally built for the
  "Résumé (PDF) ↓" footer button, which currently just calls `window.print()`
  on the home page) could be pointed at this page instead so what gets
  printed and what's inspectable in-browser are the same document.
- **`llms.txt` / structured "answer block" pages for AI-search
  discoverability.** A plain-text `/llms.txt` (or `.well-known/llms.txt`)
  summarizing the site's structure and key facts, in the format LLM crawlers
  are starting to look for, plus maybe one dense, fact-only page (stack,
  numbers, links) that reads well when quoted out of context by a model
  answering "who is Shreyansh Kumar Singh."

## Medium — a bit more surface area

- **A markdown-backed `/notebook` blog.** Posts as `.md`/`.mdx` files in the
  repo (no CMS, no database — matches the project's existing "no build step
  beyond what's necessary" philosophy from THE EVOLUTION), rendered via a
  markdown pipeline, with categories, pagination, and an RSS feed generated
  at build time. A natural home for the kind of provenance/process writing
  already in `RESEARCH.md`/`CHANGELOG.md`, but public-facing and per-post
  instead of one running file per project.

## Heavy / product-like — optional, only if this becomes more than a portfolio

Flagged deliberately as scope creep in the reference repo itself. Worth
doing only if the goal shifts from "show the work" to "run a small personal
product" — these add real ongoing maintenance surface (auth, a database, a
deploy target with actual uptime expectations) that a portfolio doesn't
need.

- **Visitor analytics + an alerting hook** (e.g. a Telegram bot pinging on a
  new visitor or a contact-form-equivalent event). Needs a privacy-conscious
  approach (no third-party tracking scripts) and a place to store events —
  probably the first piece of real backend this repo would need.
- **A login-gated admin dashboard** — editing `lib/*.ts` content through a
  UI instead of a code change. Only worth it once the data files are being
  edited often enough that a code deploy per change feels heavy; right now,
  editing a TypeScript array is arguably faster than building and
  maintaining an admin UI for it.
- **AI agent demo mini-apps** — small, scoped, live demonstrations of the
  same kind of work described in Nythera/HallogenAI's case files (e.g. a
  sandboxed "watch an agent validate a finding" replay), rather than just
  describing them in prose.
- **A games section** — the SURVIVE minigame already proves the site can
  carry a small real game inside the particle field; a dedicated `/games`
  index could host SURVIVE plus future ones without crowding the hero.

## 3D — the one idea that addresses the repo's own name

The repo is called "THE RANGE" ("3d-scroll-portfolio" as the folder name)
but currently has **no actual 3D/WebGL anywhere** — confirmed while reading
every line of the original three HTML files for this migration. "3D" refers
to the project range (ANTARANG is the real Three.js/React Three Fiber piece,
elsewhere in the range), not this site's own rendering. The honest fix,
flagged as its own idea rather than snuck into this migration:

- **Introduce React Three Fiber for one real WebGL showcase piece.**
  Candidates, roughly in order of how well they'd fit the site's existing
  visual language without fighting it:
  1. Replace the two 2D canvas particle fields (`#fieldBg`/`#fieldHero`) with
     a genuine R3F particle system — same cursor-reactive behavior, real
     depth this time, and SURVIVE's shockwave rings become actual 3D
     geometry instead of flat circles.
  2. A proper 3D piece inside the Range itself — e.g. a small rotatable
     model or scene tied to one project card (ANTARANG's own gallery tech
     would be the natural reference implementation to borrow patterns
     from).
  Either way: keep it additive and behind `prefers-reduced-motion` /
  reduced-capability fallbacks, matching how every other animated piece on
  this site already degrades honestly rather than being load-bearing for
  reading the content.
