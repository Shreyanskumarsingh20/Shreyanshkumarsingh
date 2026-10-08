# PROJECT_BIBLE — Shreyansh Kumar Singh's portfolio (THE RANGE)

The complete technical reference for **www.shreyanshkumarsingh.com**: what
every part of the site is, where it lives, how it works, which rules it
follows, and the traps already found. Written from the codebase as it is —
nothing aspirational. For *current status, open items and how to operate the
site*, read [`HANDOFF.md`](HANDOFF.md) first.

> **This repository is public.** Never commit the client's phone number, the
> name of the bank behind the Sarthi project, secrets or tokens. Those rules
> and the confidential context live in `reports/HANDOFF_PRIVATE.md`
> (gitignored, local only).

---

## Contents

1. [What the site is](#1-what-the-site-is)
2. [Stack](#2-stack)
3. [Repository layout](#3-repository-layout)
4. [Routes](#4-routes)
5. [Content model — everything is data](#5-content-model--everything-is-data)
6. [Page anatomy](#6-page-anatomy)
7. [Design system](#7-design-system)
8. [Home page mechanics](#8-home-page-mechanics)
9. [SEO](#9-seo)
10. [Answer engines and AI agents (AEO / GEO)](#10-answer-engines-and-ai-agents-aeo--geo)
11. [Telegram visit beacon](#11-telegram-visit-beacon)
12. [Contact and the phone number](#12-contact-and-the-phone-number)
13. [Performance](#13-performance)
14. [Security headers and CSP](#14-security-headers-and-csp)
15. [Images, video and brand assets](#15-images-video-and-brand-assets)
16. [Tests and verification](#16-tests-and-verification)
17. [Deploy and operations](#17-deploy-and-operations)
18. [Content and copy rules](#18-content-and-copy-rules)
19. [Known traps](#19-known-traps)
20. [How to … (recipes)](#20-how-to--recipes)
21. [History](#21-history)

---

## 1. What the site is

The personal portfolio of **Shreyansh Kumar Singh — AI & Full-Stack
Engineer, Pune, India**. "THE RANGE" is the portfolio's concept name (nine
projects across nine domains); it always appears alongside his name, never
instead of it.

Three jobs, in priority order:

1. **Rank first and be cited** for the two primary phrases —
   *"Shreyansh Kumar Singh"* and *"AI & Full-Stack Engineer"* — in Google,
   Bing, and AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot).
2. **Convert** recruiters and founders: open to full-time or hybrid roles —
   Applied AI Engineer first, then full-stack for AI products, AI security
   tooling, senior .NET / Angular.
3. **Prove the work**: nine real projects (screenshots off running servers,
   real repos), six production case studies from RamanByte, written case
   studies and technical notes.

The person, in one sentence (the site-wide `SUMMARY` in `lib/site.ts`):
*Shreyansh Kumar Singh is an AI & full-stack engineer in Pune, India. He
builds AI-native systems — RAG pipelines, LLM agent loops and autonomous
security tooling — on nearly four years of shipping production .NET, SQL
Server and Angular software at RamanByte.*

---

## 2. Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.3** App Router, Turbopack. `middleware` is called **`proxy.ts`** in Next 16 and runs on the Node.js runtime. Read `node_modules/next/dist/docs/` before using a Next API (see `AGENTS.md`). |
| UI | **React 19.3**, **TypeScript 5.9** strict |
| Styling | Hand-written CSS: `app/globals.css` (original site, ~1,500 lines) + `app/pages.css` (inner pages, shared header/footer, later fixes). **Tailwind v3.4** is installed and its theme mirrors the CSS variables, but almost nothing uses utilities. |
| Motion | `lenis` (smooth wheel scrolling, desktop), CSS transitions, CSS scroll-driven animations, Canvas 2D |
| Agents | `mcp-handler@2` + `@modelcontextprotocol/server@2` (MCP server), `zod@4` (schemas) |
| Lint / tests | ESLint 9 flat config (`eslint-config-next`); Node's built-in test runner (`node --test`, TypeScript stripped natively by Node 24) |
| Hosting | **Vercel Hobby** (free plan — no paid features). `main` auto-deploys to production. |
| Analytics | **Opt-in** Google Analytics 4 + Microsoft Clarity behind a cookie banner (§11a); no Vercel Analytics. First-party visit alerts go to Telegram (§11). |

No component library, no CSS-in-JS, no animation library besides Lenis.

---

## 3. Repository layout

```
proxy.ts                    Next 16 proxy: markdown negotiation, 406, Link headers, crawler alerts
next.config.ts              security headers + CSP, cache headers, redirects, rewrites
app/
  layout.tsx                <html>, fonts, root metadata, SmoothScroll, WebMCP script, <Beacon/>
  globals.css               design tokens + every original section's CSS
  pages.css                 inner pages, the one header/footer, résumé print CSS, later fixes
  page.tsx                  home page assembly + its JSON-LD
  about/ contact/ experience/ faq/ notes/ projects/ resume/ skills/ privacy/   page.tsx (+ opengraph-image.tsx)
  notes/[slug]/ projects/[slug]/                                              dynamic pages (+ OG images)
  not-found.tsx             custom 404
  sitemap.xml/route.ts      hand-written, schema-ordered sitemap (entries in lib/sitemap.ts)
  robots.txt/route.ts       robots with named AI/search agents
  llms.txt/ llms-full.txt/  route handlers (content from lib/llms.ts)
  notes/rss.xml/route.ts    RSS 2.0 feed of the notes
  md/[[...slug]]/route.ts   markdown views (content from lib/markdown.ts) + markdown 404
  manifest.ts               web app manifest
  opengraph-image.tsx       home OG card (all OG cards via lib/og.tsx)
  favicon.ico icon.png apple-icon.png   SKS monogram on black
  api/mcp/route.ts          MCP server (Streamable HTTP) + WebMCP bridge script
  api/mcp/server-card/      MCP server card JSON
  api/well-known/[...file]/ /.well-known/* (rewritten here by next.config.ts)
  api/beacon/route.ts       visitor beacon → Telegram
components/
  sections/                 Hero, Build, Range, Research, Method, Philosophy, Faq, Telemetry (home)
  home/                     Loader, HomeInteractions (all home client behaviour), ProjectCardArt
  experience/               CaseStudy, ShotGallery, PhoneGallery, Lightbox
  site/                     SiteHeader, SiteFooter, PageShell, Breadcrumbs, ContactLinks, PrintButton
  ui/                       CommandPalette, Terminal, ProjectModal, SimModal, ContactModal, Toast
  beacon/                   Beacon (client collector), TrackingOptOut (privacy switch)
  BgVideo, ConstellationBackground, JsonLd, RevealObserver, SmoothScroll
lib/
  site.ts                   ★ single source of truth: URL, PERSON, SUMMARY, SITE_NAME, KEYWORDS, RESUME_PDF, GITHUB_USER
  jsonld.ts                 the Person/Organization/School/WebSite graph + page/breadcrumb helpers
  projects.ts               the 9 project cards (THE RANGE)
  case-studies.ts           the 9 written case studies (/projects/[slug])
  research.ts               6 research case files / 10 findings
  experience.ts             the 6 RamanByte case studies + company facts + "how projects run"
  notes.ts                  the 8 technical notes
  faqs.ts                   15 FAQs in 3 groups (+ group labels)
  skills.ts                 9 skill groups, each skill linked to evidence
  about.ts                  About sections + timeline
  method.ts beliefs.ts build-chapters.ts telemetry.ts   home section data (incl. raw SVG art)
  markdown.ts               markdown view for every page (no phone, ever)
  llms.ts                   llms.txt / llms-full.txt builder
  mcp.ts                    MCP server name/version, WebMCP tool list
  sitemap.ts                sitemap entries with real content dates
  negotiate.ts              Accept-header content negotiation (pure, tested)
  nav.ts                    header NAV + FOOTER_NAV
  contact.ts                encoded phone + WhatsApp greeting
  github.ts                 "Last shipped" ticker (server fetch, 6 h ISR)
  og.tsx                    OG image renderer (1200×630)
  color.ts                  WCAG contrast → black/white text on project accents
  css-vars.ts smooth-scroll.ts
  beacon/                   Telegram beacon: schema, bot scoring, crawlers, paths, geo, routing, telegram, rate-limit, opt-out, crawler-alert
public/
  brand/                    SKS monogram + wordmark (web sizes)
  images/                   headshots: shreyansh-kumar-singh.jpg (square), -portrait.jpg, -desk.jpg
  media/                    3 background videos (720/1280 MP4) + WebP posters
  shots/                    project + RamanByte screenshots (57 files)
  sims/                     5 vendored zero-dependency simulators + Revuelto frames (115 files)
  Shreyansh_Kumar_Singh_Resume.pdf     client's corrected PDF résumé (served noindex)
  c0d1ea2c1edd5467fecf11474d3d1e60.txt IndexNow key file (public by design)
scripts/
  indexnow.mjs              submit sitemap URLs to every IndexNow engine
  verify-site.mjs           53 end-to-end checks of every public endpoint + content rule
tests/                      unit tests (negotiate, beacon)
.github/workflows/indexnow.yml   runs indexnow.mjs after each successful production deploy
.env.example                every environment variable, documented
```

Not committed (`.gitignore`): `reports/` (strategy report, handoffs,
private notes, legacy originals), `research_notes/`, `public/headshots/`
and `public/logo/` (original uploads), `.env*.local`, `.claude/`.

---

## 4. Routes

| Route | Source | What it is | Structured data |
|---|---|---|---|
| `/` | `app/page.tsx` | Home: hero, how-I-work story, 9 sticky project cards, research findings, method, principles, FAQ teaser, tech stack, footer. Plus ⌘K palette, terminal, modals. | WebPage, Person graph, ItemList of 9 SoftwareSourceCode |
| `/about` | `app/about/page.tsx` | The **entity home**: who he is, key facts, timeline, roles he's open to | ProfilePage → Person, OrganizationRole |
| `/projects` | `app/projects/page.tsx` | Grid of the 9 case studies | CollectionPage |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Case study: problem → what he built → hardest decision → result → findings → notes → stack | TechArticle/SoftwareSourceCode, Breadcrumbs |
| `/experience` | `app/experience/page.tsx` | RamanByte: company, how projects run, 6 case studies with galleries, tech stack | ProfilePage/OrganizationRole, Breadcrumbs |
| `/notes` | `app/notes/page.tsx` | 8 technical notes (answer first) | CollectionPage |
| `/notes/[slug]` | `app/notes/[slug]/page.tsx` | One note | TechArticle, Breadcrumbs |
| `/skills` | `app/skills/page.tsx` | 9 skill groups, every skill linked to evidence | CollectionPage + DefinedTermSet |
| `/faq` | `app/faq/page.tsx` | 15 FAQs in native `<details>` (the **only** FAQPage on the site) | FAQPage |
| `/resume` | `app/resume/page.tsx` | HTML résumé (print stylesheet) + **PDF download** | WebPage |
| `/contact` | `app/contact/page.tsx` | Call / WhatsApp / Email buttons, what to include, contact details | ContactPage |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy incl. visit logging + opt-out switch | WebPage |
| 404 | `app/not-found.tsx` | Custom 404 (HTML) — markdown 404 for agents | — |
| `/lets-talk` | redirect | 308 → `/contact` (`next.config.ts`) | — |

Machine-readable routes:

| Route | Purpose |
|---|---|
| `/sitemap.xml` | 27 URLs with real `<lastmod>` and `<image:image>` entries, **in sitemaps.org schema order** (§19) |
| `/robots.txt` | `Allow: /` for everyone, plus named AI/search agents, sitemap line |
| `/llms.txt`, `/llms-full.txt` | llmstxt.org summary / full text, with "When to use this site" |
| `/<page>.md`, `/index.md`, `Accept: text/markdown` | markdown view of every page (§10) |
| `/api/mcp` | read-only MCP server, no auth |
| `/.well-known/ai-catalog.json`, `ard.json`, `mcp/server-card.json`, `security.txt` | agent discovery files |
| `/notes/rss.xml` | RSS feed |
| `/api/beacon` | POST: visitor beacon. GET: health check (which bots are configured, caller's geo) |
| `/manifest.webmanifest` | PWA manifest |
| `/*/opengraph-image` | per-page OG cards |

Every page has a canonical URL, a `text/markdown` alternate, keywords, OG
and Twitter cards, and is in the sitemap (except the 404).

---

## 5. Content model — everything is data

All copy and facts live in `lib/*.ts`; components only render. Change a fact
in one place and the HTML page, its markdown view, llms.txt, the MCP server
and the JSON-LD all follow.

| Module | Contents | Rendered by |
|---|---|---|
| `lib/site.ts` | `PRODUCTION_URL`, `SITE_URL`, `GITHUB_USER` (one constant — the client may rename his account), `PERSON` (name, role, profiles, employer, education, availability), `SUMMARY`, `PRIMARY_KEYWORDS`, `SITE_NAME`, `KEYWORDS`, `KNOWS_ABOUT`, `RESUME_PDF`, `@id`s | everything |
| `lib/projects.ts` | 9 projects: slug, name, ref (`YYMM.CODE.serial`, from commit dates), domain, accent colour, one-liner, figures, stack, repo URL or `sourceNote`, card `art` (typed union: `scrollable` / `gallery` / `sim-quad` / `pipeline` / `revuelto`) | home Range, /projects, résumé, llms, MCP, markdown |
| `lib/case-studies.ts` | 9 case studies: title, h1, description, question + TL;DR, facts, problem, built[], decision, result, links, updated date | /projects/[slug], markdown, llms |
| `lib/research.ts` | 6 case files, 10 findings (with raw SVG icons) | home Research, case studies, markdown |
| `lib/experience.ts` | 6 RamanByte case studies (galleries, built items, stack groups, numbers), `COMPANY_FACTS`, `HOW_THE_WORK_RUNS` (5 beats), hero stats, tech groups | /experience, llms, markdown, MCP |
| `lib/notes.ts` | 8 notes: question, answer, sections (paragraphs / lists / code), dates | /notes, RSS, llms, markdown |
| `lib/faqs.ts` | 15 FAQs: id, group (`About`/`Work`/`Hiring`), q, a, `home` flag (4 on the home teaser); `FAQ_GROUP_LABELS` | /faq, home teaser, llms, markdown |
| `lib/skills.ts` | 9 groups (Applied AI, Back end, Front end, Data, Mobile, 3D & graphics, Security, Cloud & tooling, Languages) | /skills, résumé, markdown |
| `lib/about.ts` | About prose sections + timeline + `ABOUT_UPDATED` | /about, markdown |
| `lib/method.ts` | 2 steps × 3 beats + raw SVG art | home Method |
| `lib/beliefs.ts` | 6 engineering principles | home Philosophy, terminal `cat philosophy.md` |
| `lib/build-chapters.ts` | 6 "how I work" chapters + raw SVG icons | home Build |
| `lib/telemetry.ts` | tech-stack tile groups + glyphs | home Tech stack |

The nine projects (all real repos, screenshots taken off running servers):

| # | Project | Domain | Repo | Case study slug |
|---|---|---|---|---|
| 01 | The Evolution — four zero-dependency physics simulators | Simulation | `THE_EVOLUTION` | `the-evolution-physics-simulators` |
| 02 | Nythera — autonomous pentest agent that proves every finding | Security | `Nythera` | `nythera-ai-penetration-testing-agent` |
| 03 | Sarthi — AI relationship-manager copilot for banking (RAG) | Applied AI | *source on request* | `sarthi-rag-banking-copilot` |
| 04 | Antarang — walkable 3D museum of Indian and world art | Spatial | `3dIndianmusem` | `antarang-3d-art-museum-react-three-fiber` |
| 05 | BookVerse AI — book summaries with no API key needed | Product | `BookVerseAi` | `bookverse-ai-book-summaries` |
| 06 | The Collector's Pulse — AI-curated newsroom for collectors | Editorial | `the-collectors-pulse` | `collectors-pulse-ai-newsroom` |
| 07 | VaultIQ — ASP.NET Core 8 + Angular 18 Clean Architecture | Platform | `vaultIQ` | `vaultiq-dotnet-angular-clean-architecture` |
| 08 | HallogenAI — multi-agent bug-fix verification | Verification | *not public* | `hallogenai-multi-agent-bug-fix-verification` |
| 09 | Revuelto: Assembled — scroll-built car (canvas frames) | Motion | *not public* | `revuelto-scroll-canvas-animation` |

The six RamanByte case studies (`/experience`): A Journal of Management
(PIBM journal portal), Classroom+ Admin Console, Classroom+ Student App,
Classroom+ Faculty App, Dada Udyogini Seller & Buyer Apps (with DadaLoad),
Vidur Industry Connect Admin Console.

The eight notes: AI pentest false positives · honest P0–P3 security
self-audit · AI agent bug-fix verification · modular RAG pipeline
architecture · blast radius cube-root scaling · React Three Fiber raycast
throttling · canvas image sequence vs video for scroll animation ·
distributed k6 load testing.

**Decorative SVGs and prose HTML** (Research icons, Method art, Build icons,
Telemetry glyphs, `lib/experience.ts`'s `*Html` fields) are raw markup
strings rendered with `dangerouslySetInnerHTML`. Safe because it is 100%
static, author-written content — never user input.

---

## 6. Page anatomy

- **One header everywhere** — `components/site/SiteHeader.tsx`: SKS monogram
  + "Shreyansh Kumar Singh", nav from `lib/nav.ts` (About, Projects,
  Experience, Notes, Skills, FAQ, **Contact**), a `<details>` menu below
  1080px. The home page adds the ⌘K "Jump to…" trigger (`withPalette`).
- **One footer everywhere** — `components/site/SiteFooter.tsx`: video
  background (lazy, §13), headline "Work with Shreyansh Kumar Singh / AI &
  Full-Stack Engineer, Pune", Call/WhatsApp/Email buttons, Contact/Résumé/
  LinkedIn/GitHub buttons, four link columns (Profile, Work, Site,
  Elsewhere), the wordmark, © line. Pass `page` to narrow it to the inner
  pages' 1180px column (done by `PageShell` and `/experience`).
- **Inner pages** wrap in `components/site/PageShell.tsx`: constellation
  background, header, `<main id="main" className="pg">`, visible
  breadcrumbs, footer, reveal observer.
- **Heading rules**: exactly one H1 per page and it comes first in the HTML;
  levels never skip (H2 → H3 → …). Every H1 names him and/or "AI &
  Full-Stack Engineer". Headings are plain, human, descriptive — no
  slogans ("Build. Break. Rebuild." was rewritten to "Ship it, learn from
  real use, improve it"). `npm run verify` enforces order and the H1 rules.
- **Widths**: home sections use `.shell` (1320px); inner pages and
  `/experience` use `.shell--page` / `.shell--exp` (1180px). Gutter is
  `clamp(20px, 5vw, 80px)`. Section dividers are drawn inside the gutters.

---

## 7. Design system

Tokens: one `:root` block in `app/globals.css` (Tailwind mirrors them as
`var(--…)`, never duplicated hex).

| Token | Value | Use |
|---|---|---|
| `--black` | `#000000` | page background |
| `--iron` / `--charcoal` | `#181818` / `#202020` | raised surfaces, footer base |
| `--blu` / `--blu-lift` | `#0C2340` / `#123056` | Research/Method light-panel identity |
| `--gold` / `--gold-dark` | `#FFC000` / `#917300` | primary accent, CTAs |
| `--rosso` / `--rosso-text` | `#DA291C` / `#E13527` | security accent |
| `--white` / `--smoke` | `#FFFFFF` / `#F5F5F5` | text |
| `--steel` | `#969696` | secondary text, dim headline lines |
| `--ash` | `#8C8C8C` | tertiary text (raised from `#7D7D7D` to clear WCAG AA 4.5:1) |
| `--graphite` / `--line` | `#494949` / `#262626` | borders, dividers |
| `--navy` / `--cyan` | `#0a2463` / `#90e0ef` | second identity |
| `--sage` | `#9bc2a6` | the "How I work" section only |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | the one easing curve |
| spacing | `--xxs 8` · `--xs 16` · `--sm 24` · `--md 32` · `--lg 48` · `--xl 64` · `--xxl 96` (px) | |

Type: **Inter** (single variable file, all weights), **JetBrains Mono**
(400/500, labels and numbers), **Beau Rivage** (loader signature),
**Italianno** (fallback, not preloaded). Big headings are uppercase,
weight 400, tight leading.

Utilities: `.cut` / `.cut-sm` (12° clip-path corner on buttons), `.hex`,
`.btn` + `.btn-gold` / `.btn-ghost`, `.mono`, `.label`, `.dim`, `.measure`,
`.rise` (reveal on scroll; `.rise.now` animates from first paint for
above-the-fold content), `.rise-3d` / `.rise-flip` / `.rise-pop`.

Project accent colours come from each project's own design tokens; button
text on an accent is black or white by WCAG contrast (`lib/color.ts`
`onColor`).

Width-variant modifiers (`.shell--exp`, `.shell--page`, `.topbar--site`…)
are additive classes, because the three original HTML files reused the same
class names with different values (§21).

---

## 8. Home page mechanics

### Loader — `components/home/Loader.tsx`
The SKS wordmark signed in by a pen sweep over a circuit field. Fixed timer:
**1.4 s on the first visit per tab, 0.5 s afterwards** (sessionStorage
`loaderSeen`), 0.2 s with reduced motion. Adds `body.loading` before paint,
scrolls to top, always self-releases.

### Hero — `components/sections/Hero.tsx`
- Eyebrow "Pune, India · Open to full-time or hybrid roles".
- **H1: "Shreyansh Kumar Singh"** with the role line **"AI & Full-Stack
  Engineer"** beneath (`.hero-h1` / `.hero-role` in pages.css).
- Thesis paragraph, CTAs "View my projects" (#range) and "About me" (/about).
- Tickers: "Last shipped — N days ago · repo" (server-fetched, §13) and
  "Building now — Vidur Industry Connect".
- SCROLL cue (in normal flow, *above* the stats row — it used to overlap it).
- Stats row: 9 repositories shipped · 5 languages in production · 0
  dependencies in the physics simulators · P0 top-severity flaw caught in
  own audit. Numbers align with the H1's left edge.
- Background video + the hero particle canvas (`#fieldHero`) + the SURVIVE
  minigame overlay.
- "How this page works" concept note below.

### How I work — `components/sections/Build.tsx`
Kicker "HOW I WORK", H2 "How I build software, from the first question to
production", six chapters (`lib/build-chapters.ts`) that each draw an SVG
icon on reveal, a spine that fills as you scroll, closing statement "AI-
powered, full-stack software that holds up in production" (a `<p>`, wipe-in
animation).

### Projects (THE RANGE) — `components/sections/Range.tsx`
Sticky-stacking cards, **pure CSS**:
```css
.stack-card{ position:sticky; top:calc(92px + var(--k,0) * 8px); z-index:calc(1 + var(--k,0)); }
```
`--k` is the card index. The only JS (`HomeInteractions` `layout()`) picks
the active card for the HUD/progress dots and toggles `.is-behind`
(dimming). **Never** add scroll-jacking, transform math or spacer divs, and
never put `overflow-x:hidden` on an ancestor (§19). Each card: index, domain,
ref, name (H3), one-liner, badges, stack, then **View repository** (or a
"Source on request"/"Not yet public" label), **Research case**, **Case
study**, **Quick look** (modal). Right side: `ProjectCardArt` — a browser-
chrome frame around a scrollable full-page screenshot, a gallery, the
simulator quad, the HallogenAI pipeline, or the Revuelto strip.

### Research findings, Engineering method, Engineering principles
Research: 6 case files of pinned findings with domain filter pills (filters
computed server-side from `PROJECTS` domains, toggled client-side). Method:
"Step 1 — Write the specification first" and "Step 2 — Audit and stress-test
the result", 3 beats each with evidence lines. Principles: 6 cards.

### FAQ teaser, Tech stack
FAQ: the 4 `home` questions as independent switches with a scroll-tied tilt
(CSS view timeline, JS fallback), linking to `/faq`. Tech stack: tile grid
over a lazy background video.

### Overlays (all wired imperatively in `HomeInteractions.tsx`)
- **⌘K / Ctrl+K command palette** — jump to sections (Projects, Research
  findings, Engineering method, Engineering principles, FAQ, Tech stack,
  Contact), projects, sims, actions.
- **Terminal** (`` ` `` key or palette): `help`, `whoami`, `ls range`, `ls sims`,
  `run <sim>`, `play`, `cat philosophy.md`, `contact`, `blast <kg> <m>`,
  `sudo hire-me`, `clear`, `exit`.
- **Project modal** (Quick look), **Sim modal** (iframes `/sims/<name>.html`
  only when opened, resets to `about:blank` on close; Revuelto opens in a new
  tab because it is scroll-driven), **Contact modal**, **Toast**.
- **SURVIVE** — dodge the shockwave rings in the hero; started from the hint
  pill, the palette or `play`.

All overlays share `closeAllOverlays()` and the rAF-gated scroll tick — a
deliberate single unit, not split into React state per component.

### Particle fields
`ParticleField` class in `HomeInteractions.tsx`: `#fieldBg` (fixed, behind
the page) and `#fieldHero`. Phones get fewer particles. **The loop starts on
the visitor's first input (pointermove/pointerdown/wheel/scroll/touchstart/
keydown) or after 7 s idle**; until then one still frame is drawn. This was
the fix for desktop TBT (1,080 ms → PageSpeed desktop 95). Hero field only
animates while the hero is visible. Canvas box is cached at resize (no
per-frame layout reads).

---

## 9. SEO

**Primary keywords:** "Shreyansh Kumar Singh" and "AI & Full-Stack
Engineer" (`PRIMARY_KEYWORDS`). Every page title, H1 and meta description
uses at least one, naturally. `SITE_NAME` = "Shreyansh Kumar Singh — AI &
Full-Stack Engineer" (used for `og:site_name`, `applicationName`, WebSite
name). Title template: `%s — Shreyansh Kumar Singh`.

| Page | Title |
|---|---|
| `/` | Shreyansh Kumar Singh — AI & Full-Stack Engineer, Pune |
| `/about` | About Shreyansh Kumar Singh — AI & Full-Stack Engineer |
| `/projects` | Projects — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/experience` | Experience — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/notes` | Notes — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/skills` | Skills — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/faq` | FAQ — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/resume` | Résumé — Shreyansh Kumar Singh, AI & Full-Stack Engineer |
| `/contact` | Contact Shreyansh Kumar Singh — AI & Full-Stack Engineer |
| `/privacy` | Privacy Policy — Shreyansh Kumar Singh |
| case studies / notes | their own titles (case studies are project-specific) |

Rules: descriptions ≤ 160 characters; per-page `keywords`; a share image
on every page (§15); canonicals are **always**
`https://www.shreyanshkumarsingh.com/…` (`SITE_URL` is fixed to www in
production — never derived from `VERCEL_URL`); the apex and the
`shreyanshkumarsingh.vercel.app` alias 308 to www.

**Structured data** (`lib/jsonld.ts`, rendered by `components/JsonLd.tsx`):
one `@graph` per page with stable `@id`s —
- `Person` (`/#person`): name, given/family name, jobTitle, description,
  image (`/images/shreyansh-kumar-singh.jpg`), email, address (Pune,
  Maharashtra, IN), `homeLocation`, `alumniOf` (AKTU), `hasCredential`
  (B.Tech), `hasOccupation`, `worksFor`, `knowsAbout`, `sameAs`
  (LinkedIn, GitHub, X), `contactPoint` (email only).
- `Organization` (RamanByte) with `address` + `contactPoint`;
  `CollegeOrUniversity` (AKTU, with Wikipedia `sameAs`); `WebSite`;
  `OrganizationRole` (employment since 2023-01-21); `BreadcrumbList` on
  inner pages; page nodes (ProfilePage, ContactPage, FAQPage,
  CollectionPage, TechArticle…).
- **FAQPage only on `/faq`.** The phone number is never in JSON-LD.

**Sitemap**: `lib/sitemap.ts` entries (dates are when *content* changed —
bump the `UPDATED` map or the case-study/note `updated` field when you edit
a page; never use build time), served by `app/sitemap.xml/route.ts`.

**Indexing**: Google Search Console (Domain property) and Bing Webmaster
Tools are set up; IndexNow (§17) notifies Bing, Yandex, Seznam, Naver, Yep,
Amazon and Internet Archive after every deploy.

---

## 10. Answer engines and AI agents (AEO / GEO)

- **Markdown for agents** (`proxy.ts`, `lib/negotiate.ts`, `app/md/`,
  `lib/markdown.ts`): every page is available as markdown via
  `Accept: text/markdown` at its own URL, or `<path>.md` (`/index.md` for
  home). Negotiation honours RFC 9110 q-values; markdown wins only when
  strictly preferred; a client that takes `text/plain` but not HTML also
  gets markdown; a client accepting no text gets **406**. Markdown
  responses carry `Vary: Accept`. HTML responses carry a `Link` header
  advertising the markdown twin, llms.txt and the sitemap. Unknown paths get
  a **markdown 404** for markdown clients.
- **llms.txt / llms-full.txt** (`lib/llms.ts`): summary, key facts, "When
  to use this site", how to read it (markdown, MCP, discovery files), pages,
  projects, notes, experience, FAQ.
- **MCP server** `/api/mcp` (Streamable HTTP, read-only, no auth): tools
  `get_profile`, `list_projects`, `get_project`, `get_experience`,
  `get_skills`, `search_site`, `get_contact` (email + contact page only) and
  page resources. **WebMCP** bridge script (`/api/mcp?webmcp-script`,
  loaded `lazyOnload`) registers `get_profile`, `list_projects`,
  `get_contact` with in-browser agents.
- **Discovery**: `/.well-known/ai-catalog.json`, `ard.json`,
  `mcp/server-card.json` (+ `server-cards.json`), `security.txt`, via
  `app/api/well-known/[...file]/route.ts` (CORS `*`).
- **robots.txt** allows everyone and names: GPTBot, OAI-SearchBot,
  ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot,
  Perplexity-User, Googlebot, Google-Extended, GoogleOther,
  Google-CloudVertexBot, Applebot, Applebot-Extended, bingbot,
  Meta-ExternalAgent, Meta-WebIndexer, Meta-ExternalFetcher, Amazonbot,
  Amzn-SearchBot, Amzn-User, DuckAssistBot, MistralAI-User, MistralAI-Index,
  CCBot. (Cloudflare's `Content-Signal` line was removed — Lighthouse flags
  it as invalid.)
- `<meta name="is-agentic-site-type" content="content">` tells is-agentic
  which report view fits.
- Vercel Firewall: **Bot Protection Off, AI Bots Allow**, no Attack Mode,
  no custom rules. Verified crawlers (Googlebot, ChatGPT-User, ClaudeBot…)
  pass Vercel's always-on impersonation protection; *spoofed* bot user
  agents from other IPs get `X-Vercel-Mitigated: challenge` — so testing
  with a fake bot UA from your own machine proves nothing (§19).

---

## 11. Telegram visit beacon

Ported from the Imprint project (`D:\project\Imprint`, read-only — never
edit it). First-party; disclosed on `/privacy` with an opt-out.

**Two bots** (Vercel env vars, Production; each pair optional — unset = no-op):

| Env vars | Receives |
|---|---|
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | **everything**: crawler / AI-agent / MCP-client fetches, sitemap reads, scanner probes, every visit (bots included) |
| `TELEGRAM_HUMAN_BOT_TOKEN`, `TELEGRAM_HUMAN_CHAT_ID` | **real people only**: arrival + end-of-visit report when the visitor scores human (≥ 62, not a datacenter), and **hot actions** (score ≥ 40) |

`NEXT_PUBLIC_BEACON_DEBUG=1` lets localhost send alerts (off by default).

**Client** — `components/beacon/Beacon.tsx` (in the root layout): a visit is
one tab (sessionStorage `sks_visit`, 30-minute gap = new visit), returning
visitor memory in localStorage `sks_visitor`. Messages: `arrival` (once,
700 ms after load), `event` (hot action, once per kind per visit, via
sendBeacon), `ended` + `report` on pagehide (not on internal navigation).
Collects passive counters only (pointer moves, clicks, keys, touches,
scroll depth/milestones, active time, visibility changes, page journey,
clicked labels). **Typed text is never recorded; digit runs ≥ 8 are
scrubbed from labels** so the revealed phone number never reaches an alert.

**Hot actions**: `call`, `whatsapp`, `email`, `show-number`, `resume-pdf`,
`linkedin`, `github`, `x`, `contact-page` — detected from `data-hot`
attributes (ContactLinks buttons, the PDF button) or link targets
(`mailto:`, `tel:`, `wa.me`, `.pdf`, linkedin.com/in, github.com, x.com,
`/contact`).

**Server** — `app/api/beacon/route.ts` (Node runtime, `maxDuration` 20):
validates with `lib/beacon/schema.ts` (zod, every field bounded, 24 KB
body cap), resolves geo (`lib/beacon/geo.ts`: Vercel headers first, then
ipwho.is / ipapi.co for ISP/ASN — never merges providers, never invents
coordinates), scores human vs bot (`lib/beacon/bot.ts`, 0–100 with
reasons), rate-limits per IP and globally in separate human/suspect buckets
(`lib/beacon/rate-limit.ts`), formats (`lib/beacon/telegram.ts`), routes
(`lib/beacon/routing.ts` — pure, unit-tested) and sends. Always returns 204.
`GET /api/beacon` = health check.

**Crawler alerts** — `lib/beacon/crawler-alert.ts`, fired from `proxy.ts`
via `event.waitUntil` (never adds latency; wrapped in try/catch).
`lib/beacon/crawlers.ts` names ~60 agents by kind (live / ai / search /
social / seo / tool / unknown — most specific first); `lib/beacon/paths.ts`
decides what is reportable (pages, `.md` twins, llms files, well-known
files, RSS, **sitemap.xml**, `/api/mcp`; not robots.txt, assets or OG
images) and names scanner probes (`.env`, `.git`, WordPress, PHP tools,
admin panels, backups, secrets). Any non-browser client of `/api/mcp` is
reported as an "MCP client". 10-minute dedupe per agent+IP+path.

**Opt-out**: `/?notrack=1` (undo `/?notrack=0`) or the switch on `/privacy`
(`components/beacon/TrackingOptOut.tsx`, `useSyncExternalStore` over
localStorage `sks_beacon_off`). Do Not Track is shown in alerts but is not
treated as the opt-out (Imprint's reasoning, kept).

---

## 11a. Opt-in analytics (Google Analytics 4 + Microsoft Clarity)

- **Switch**: `NEXT_PUBLIC_GA_ID` (`G-…`) and `NEXT_PUBLIC_CLARITY_ID` in
  Vercel (Production), then redeploy — they're inlined at build time. With
  neither set there is no banner, no "Cookie settings" link, and the privacy
  page says "no cookies". `NEXT_PUBLIC_ANALYTICS_DEBUG=1` runs them on
  localhost.
- **Consent** (`lib/consent.ts`): localStorage `sks_consent` =
  `granted` / `denied` / unset. `components/analytics/ConsentBanner.tsx`
  shows a fixed bottom bar (hidden while the intro loader runs) with equal
  Accept / Decline buttons; `CookieSettingsButton` (footer "Elsewhere"
  column and /privacy#cookies) reopens it.
- **Loading** (`components/analytics/Analytics.tsx`): *basic* consent mode —
  nothing is requested from Google or Microsoft before Accept. Then gtag.js
  (`afterInteractive`, consent defaults: ads denied, analytics granted) and
  Clarity (`lazyOnload`, `consentv2`). Declining afterwards sends consent
  updates and deletes `_ga*`, `_clck`, `_clsk`, `MUID` etc.
- **Events**: hot actions (`lib/hot-actions.ts`, shared with the beacon) →
  `generate_lead` (method: call / whatsapp / email / show_number /
  contact_page), `resume_download`, `profile_click` (linkedin / github / x).
  Mark them as **key events** in GA (Admin → Events). Page views on client
  navigation come from GA4 enhanced measurement.
- **Privacy**: the revealed phone number carries `data-clarity-mask`;
  Clarity masks typed text by default. `/privacy` gains a "Cookies and
  analytics" section automatically when an ID is set.
- **CSP** (`next.config.ts`): script-src adds `www.googletagmanager.com`,
  `*.clarity.ms`; img/connect-src add `*.google-analytics.com`,
  `*.analytics.google.com`, `www.googletagmanager.com`, `*.clarity.ms`,
  `c.bing.com`.
- `npm run verify` fails if a GA/Clarity tag ever appears in server HTML.

---

## 12. Contact and the phone number

- Email `shreyanshkumarsingh208@gmail.com` is public and machine-readable
  on purpose (mailto, JSON-LD `contactPoint`, llms, MCP).
- **The phone/WhatsApp number never appears as plain text** in HTML,
  JSON-LD, llms.txt, markdown, MCP output — or in this repo's source or
  comments. It is stored reversed + base64 in `lib/contact.ts`
  (`PHONE_ENC`) and decoded only in the browser on click
  (`components/site/ContactLinks.tsx`: Call → `tel:`, WhatsApp → `wa.me`
  with a greeting, "Show phone number" on /contact).
- The client's own PDF résumé does show the number; it is served with
  `X-Robots-Tag: noindex, nofollow` so search engines don't index it. The
  HTML résumé (`/resume`) is the indexed one and omits the number.
- `npm run verify` fails if the number appears anywhere it shouldn't (it
  derives the pattern from `PHONE_ENC`, so the digits aren't in that file).

---

## 13. Performance

Measured (PageSpeed Insights, 8 Oct 2026): **mobile 92, desktop 95**,
Accessibility / Best Practices / SEO **100**, Agentic Browsing 4/4.
Baseline 7 Oct: mobile 48 (LCP 4.2 s, TBT 3.0 s, 36 MB), desktop 94 → 63
after a later regression.

What made it fast:
- **Videos** self-hosted in `public/media` (hero, telemetry, footer;
  720px for ≤ 768px screens, 1280px otherwise), re-encoded with the colour
  grade baked in (no CSS filters): 35.7 MB → ~1.4 MB. `components/BgVideo.tsx`
  renders only a WebP poster (`preload="none"`), attaches the source when
  within 300px of the viewport (after idle), pauses off-screen, and keeps
  the poster for reduced-motion / Save-Data. The hero poster is preloaded
  (`ReactDOM.preload`, high priority).
- **Above-the-fold text** animates with CSS from first paint (`.rise.now`).
- **Particle loop** deferred to first input / 7 s idle (§8).
- **Scroll handlers** do all layout reads before writes, in one rAF.
- **Telemetry tiles** have no blend modes or filters; FAQ tilt is a CSS
  scroll-driven animation.
- **Images**: `next/image` everywhere with real intrinsic sizes; the
  full-page card screenshots are optimized with
  `sizes="(min-width: 860px) 640px, 100vw"`.
- **Caching**: `/media/*`, `/brand/*`, `/images/*`, `/shots/*` →
  `public, max-age=2592000, stale-while-revalidate=86400` (filenames aren't
  hashed, so 30 days, not immutable).
- **GitHub ticker** fetched on the server with 6-hour ISR (`lib/github.ts`)
  instead of six browser calls per visit (which hit GitHub's rate limit).
- **Fonts**: Inter as one variable file; Italianno not preloaded.
- Home weight ≈ 0.6 MB on first load.

Still flagged (minor): render-blocking CSS (~80 ms), ~14 KiB legacy JS
polyfills, ~12 KiB unused CSS, forced reflow during init, LCP 3.1 s on
emulated mobile (the loader covers the first 1.4 s by design).
`experimental.inlineCss` was considered and rejected (duplicates CSS into
the RSC payload; experimental).

---

## 14. Security headers and CSP

`next.config.ts`, all routes: HSTS (2 years, includeSubDomains),
`X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone,
geolocation, payment, usb, interest-cohort off), `Cross-Origin-Opener-Policy:
same-origin`.

CSP on everything except `/sims/*`:
`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'
'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src
'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'none';
object-src 'none'; base-uri 'self'; form-action 'self';
upgrade-insecure-requests` + `X-Frame-Options: DENY`.
`'unsafe-inline'` scripts are required by Next's inline bootstrap on static
pages (nonces would force dynamic rendering). `/sims/*` keeps its own inline
code and may be framed same-origin (`X-Frame-Options: SAMEORIGIN`).
The browser makes **no third-party requests** (fonts, images, video all
self-hosted; the beacon's geo lookups and Telegram calls are server-side).
In `next dev` the console shows React "eval() is not supported" warnings —
dev-only, caused by the CSP; production is clean.

---

## 15. Images, video and brand assets

- **Headshots** (`public/images/`): `shreyansh-kumar-singh.jpg` (941×941,
  square — Person schema image, use on every profile), `-portrait.jpg`
  (720×960, /contact), `-desk.jpg` (1672×941, /about hero + OG). Originals
  in `public/headshots/` (gitignored).
- **Brand** (`public/brand/`): `sks-mark-white.webp` (header monogram),
  `sks-wordmark-white.webp` (loader, footer), `sks-wordmark-black.webp`,
  `sks-mark-og.png` / `sks-wordmark-og.png` (OG cards). Originals in
  `public/logo/` (gitignored). Favicons in `app/`.
- **Screenshots** (`public/shots/`): real captures of each project running
  (Playwright, full page) and of the RamanByte apps; the Sarthi screenshot
  was edited to remove the bank's name. Dada Udyogini phone shots stay at
  native resolution (PhoneGallery).
- **Simulators** (`public/sims/`): aeon, cosmos, genesis, genlife
  (zero-dependency single HTML files) and revuelto (+ 110 WebP frames).
- **Share (OG) images**: the **photo card** `app/opengraph-image.jpg`
  (1200×630 JPG, ~127 KB, made from the client's
  `public/headshots/Shreyansh Kumar Singh — AI Engineer Profile.png`; alt text
  in `opengraph-image.alt.txt`) is used by `/`, `/about`, `/contact` and
  `/resume` — those three reference it via `SHARE_IMAGE` in `lib/site.ts`,
  because a page that sets its own `openGraph`/`twitter` block replaces the
  inherited image. Every other page (projects, case studies, experience,
  notes, skills, FAQ, privacy) has a generated black-and-gold card from its
  own `opengraph-image.tsx` via `lib/og.tsx`. No separate twitter-image: X
  reads `og:image`. Spec for replacements: 1200×630 px (1.91:1), JPG,
  under 300 KB (WhatsApp's limit), text inside the central ~1000×520 area.

---

## 16. Tests and verification

| Command | What it does |
|---|---|
| `npm run lint` | ESLint, must be clean before every push |
| `npm run build` | production build + type-check, must pass before every push |
| `npm test` | unit tests: `tests/negotiate.test.ts` (markdown negotiation) and `tests/beacon.test.ts` (crawler naming, path classification, human/bot scoring, two-bot routing) — 12 tests |
| `npm run verify` | **53 live checks** against production (or `npm run verify -- http://localhost:3000` against `next start`): markdown negotiation + `Vary`, markdown 404, 406, `.md` URLs, llms files, robots, sitemap + its element order, well-known JSON, MCP initialize, every sitemap page (status, H1 first and unique, no skipped levels, name in title/body, no phone, no bank name, no retired short name, no old ambiguous headings), home H1, PDF noindex, résumé link, asset caching, beacon health check and bad-payload handling |

Do **not** run Lighthouse locally (the client's machine is low on disk
space and results were unreliable) — use pagespeed.web.dev.

---

## 17. Deploy and operations

- **Repo**: `github.com/Shreyanskumarsingh20/Shreyanshkumarsingh` (public),
  branch `main`. Commit and push directly to `main` — no PRs. `main`
  auto-deploys to production on Vercel (~40 s).
- **Before every push**: `npm run lint`, `npm run build`, `npm test`. After
  deploy: `npm run verify`.
- **Commit messages** end with `Co-Authored-By: Claude Opus 5.5
  <noreply@anthropic.com>`. In PowerShell, write the message to a file and
  use `git commit -F <file>` (here-strings piped to `-F -` don't work).
- **Line endings**: the CSS files are LF in the working tree with git
  `autocrlf`; multi-line string replacement in PowerShell can fail — use
  an editor or a script that preserves line endings.
- **IndexNow**: `scripts/indexnow.mjs` (key
  `c0d1ea2c1edd5467fecf11474d3d1e60`, key file in `public/`) reads the
  official registry (`indexnow.org/searchengines.json`) and submits to the
  shared endpoint plus every engine directly (fallback list built in).
  `.github/workflows/indexnow.yml` runs it after each successful Production
  deployment (URLs changed in the last 3 days); run
  `node scripts/indexnow.mjs --all` by hand to resubmit everything. Google
  doesn't use IndexNow (use Search Console). Internet Archive's registered
  endpoint currently doesn't resolve in DNS — expected failure.
- **Environment variables**: see `.env.example` (Telegram ×4, beacon debug,
  optional `NEXT_PUBLIC_SITE_URL`).

---

## 18. Content and copy rules

1. **Never invent a fact** about the client. Every claim traces to one of
   his repos, his brief, his résumé, or something he confirmed.
2. **His name is always "Shreyansh Kumar Singh"** in full. The retired
   short name used by the original files must never appear publicly.
   "THE RANGE" is the portfolio's name and appears only next to his name.
3. **Never name the bank** behind Sarthi — the project is just "Sarthi" /
   "an AI relationship-manager copilot for banking". Its repository is not
   linked (its name and description reveal the bank) — the card says
   "Source on request".
4. **Never publish the phone number** in machine-readable form (§12).
5. **Experience**: Full-Stack Developer at RamanByte Pvt. Ltd., Pune, since
   21 January 2023 — and no earlier jobs. Say "nearly four years".
6. **Education**: B.Tech in Computer Science, Dr. A.P.J. Abdul Kalam
   Technical University, 2017–2021.
7. **Headings** are clear, human and keyword-aware (§6). No slogans.
8. **Visual elements** may be optimized but are never removed without the
   client's approval. Contrast changes are pre-approved.
9. **No Vercel Analytics / Speed Insights** unless asked.
10. When a page's content changes, bump its sitemap date (§9).

---

## 19. Known traps

### `overflow-x: hidden` silently disables `position: sticky`
Any ancestor with `overflow` other than `visible`/`clip` disables
`position: sticky` for every descendant — this broke THE RANGE's stacking
once. `body{overflow-x:clip}` is the fix. **Never change it to `hidden`.**
(Method's rotated "rise-flip" cards make `scrollWidth` report extra width
before they reveal; `clip` hides it. Harmless.)

### `calc(var(--x))` inside `transition-delay`
Under Next 16 + Turbopack, `transition-delay:calc(var(--i,0)*60ms)` made the
minifier emit empty transition properties and left elements at `opacity:0`.
Stagger delays are plain inline `style={{ transitionDelay: "Nms" }}`; `.rise`
has a var-free transition. `CSSVarStyle` (`lib/css-vars.ts`) is still fine
for `--accent`, `--k`, `--c`.

### Next's `app/sitemap.ts` breaks Google
Next writes `<image:image>` before `<lastmod>`; the sitemaps.org schema
requires `loc, lastmod, changefreq, priority`, then extensions. Bing
accepted it; Google Search Console said "Sitemap could not be read". The
sitemap is now hand-written by `app/sitemap.xml/route.ts`; `npm run verify`
checks the order. Don't go back to `app/sitemap.ts`.

### Next overwrites `Vary` on HTML pages
HTML responses don't carry `Vary: Accept` (Next sets its own). Markdown
responses do, and the proxy rewrites before the CDN cache, so caches never
mix the two. Fine as is.

### Testing crawlers with a fake user agent
Vercel challenges requests that *claim* to be a known bot from an IP that
isn't that bot's — and briefly challenges any IP that bursts requests. A
`curl -A GPTBot` from your machine returning 403 does not mean GPTBot is
blocked. Check the Vercel Firewall traffic view or the Telegram bot-1
alerts instead.

### Accept: text/plain
Some AI fetchers send only `text/plain`. They used to get 406; they now get
the markdown view. Keep that branch in `lib/negotiate.ts`.

### Middleware/proxy matcher
`proxy.ts`'s matcher excludes `_next/`, `api/` (except `/api/mcp`), `md/`,
asset folders, favicons, OG images, manifest and robots.txt. It *includes*
llms*.txt, `/.well-known/*` and sitemap.xml only so crawler alerts see
them — the proxy passes those straight through. If you add an asset folder,
add it to the exclusion.

### Telegram rate limits
~20 messages/minute per chat. The crawler-alert dedupe (10 min) and the
beacon rate limits exist for this; don't remove them.

---

## 20. How to … (recipes)

- **Edit a fact about him** → `lib/site.ts` (`PERSON`, `SUMMARY`) — it flows
  to every page, JSON-LD, llms, markdown and MCP. Check `lib/about.ts`,
  `lib/faqs.ts` and `app/resume/page.tsx` for prose that repeats it.
- **Add a project** → add to `lib/projects.ts` (with `art`), add its case
  study to `lib/case-studies.ts`, screenshots to `public/shots/` (real
  dimensions), optional research case in `lib/research.ts`. Sitemap, llms,
  markdown, MCP, résumé and OG image follow automatically. Bump counts in
  copy ("nine projects") — grep for them.
- **Add a note** → `lib/notes.ts` (slug, question, answer, sections, dates).
  RSS, sitemap, llms, markdown follow.
- **Add a page** → `app/<route>/page.tsx` wrapped in `PageShell` with
  metadata (title with a primary keyword, description ≤ 160, canonical,
  markdown alternate), JSON-LD via `graph(pageNode(…), ...coreNodes)`, an
  `opengraph-image.tsx`, a markdown view in `lib/markdown.ts`
  (`markdownFor` + `MARKDOWN_PATHS`), a sitemap entry in `lib/sitemap.ts`,
  a nav link in `lib/nav.ts`, and the route in `lib/beacon/paths.ts`
  (`STATIC_ROUTES` / `PAGES`).
- **GitHub username changes** → update `GITHUB_USER` in `lib/site.ts`,
  rebuild; rename his profile-README repo to the new username.
- **Sarthi's repo is renamed** → set `url: repo("<new-name>")` on Sarthi in
  `lib/projects.ts`, remove its `sourceNote`, add the link to its case study.
- **Change the phone number** → `btoa("<digits incl. country code>"
  .split("").reverse().join(""))` into `PHONE_ENC` in `lib/contact.ts`. Never
  write the digits in a comment.
- **Turn off a Telegram bot** → remove its two env vars in Vercel and
  redeploy. Make crawler alerts quieter → narrow `ALERT_ON` in
  `lib/beacon/crawler-alert.ts`.
- **Resubmit everything to IndexNow** → `node scripts/indexnow.mjs --all`.

---

## 21. History

| Commit | Date | What |
|---|---|---|
| — | 2026-08 | Original three static HTML files (home, experience, lets-talk) migrated to Next.js; THE RANGE corridor → sticky-stack rewrite (`RESEARCH.md`, `CHANGELOG.md`) |
| `400ff09` | 2026-10-07 | SEO phase 1 — foundations: www canonical, vercel.app 308, robots route, real sitemap dates, brand fixes, H1 leads with his name, contrast |
| `f93c542` | 2026-10-07 | Phase 2 — performance: self-hosted re-encoded videos, lazy BgVideo, CSS reveals, no blend modes, layout-read batching |
| `ef4f0ff`, `659cf8c` | 2026-10-07 | Phase 3 — entity + core pages: /about, /contact (/lets-talk 308), /faq, /skills, /privacy, 404, Person graph |
| `a9a4680` | 2026-10-07 | Phase 4 — /projects + nine case studies |
| `472421f` | 2026-10-08 | Phase 5 — agent layer: markdown views, MCP server, WebMCP, well-known files |
| `971c497` | 2026-10-08 | Phase 6 — /notes (8) + RSS, HTML résumé |
| `f29bbda` | 2026-10-08 | Phase 7 — launch ops: CSP, IndexNow, server GitHub ticker, SKS branding, one header/footer, faster loader |
| `bb5e454` | 2026-10-08 | Phase 8 — primary keywords, every heading rewritten, alignment fixes, desktop TBT fix, PDF résumé, Telegram beacon (two bots), tests + verify |
| `3552b23` | 2026-10-08 | Schema-ordered sitemap (Google), IndexNow to every engine |
| `75d8ed0` | 2026-10-08 | Crawler sitemap reads alert bot 1 |
| `bffb9f8` | 2026-10-08 | `Accept: text/plain` → markdown instead of 406 |

The original static files were moved out of the repo (they used the
retired short name and named the bank); local copies are in
`reports/legacy-originals/`. `CHANGELOG.md` and `RESEARCH.md` record the
pre-SEO build history; `IDEAS.md` holds unbuilt ideas.
