# Shreyansh Kumar Singh — portfolio (THE RANGE)

The portfolio of Shreyansh Kumar Singh, AI & full-stack engineer in Pune —
Next.js 16 App Router, React 19, TypeScript, Tailwind + hand-written CSS.
Live at **https://www.shreyanshkumarsingh.com** (deployed from `main` on Vercel).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint
```

## What's here

| Route | What it is |
|---|---|
| `/` | THE RANGE — hero, The Build, nine sticky-stacking project cards, research board, method, philosophy, FAQ teaser, telemetry |
| `/about` | Entity home: who he is, key facts, timeline (ProfilePage → Person JSON-LD) |
| `/projects`, `/projects/[slug]` | Nine case studies: problem → build → hardest decision → result |
| `/notes`, `/notes/[slug]`, `/notes/rss.xml` | Short technical notes, each answering one question first-hand |
| `/experience` | RamanByte, since January 2023 — six production case studies |
| `/skills`, `/faq`, `/resume`, `/contact`, `/privacy` | Supporting pages (`/lets-talk` 308s to `/contact`) |

Content is data-driven: `lib/projects.ts`, `lib/case-studies.ts`,
`lib/notes.ts`, `lib/faqs.ts`, `lib/skills.ts`, `lib/experience.ts`,
`lib/about.ts`. Identity (name, URLs, profiles, employer, education) lives
once in `lib/site.ts`.

## SEO, answer engines and agents

- **Canonical host** is `https://www.shreyanshkumarsingh.com` (`lib/site.ts`);
  the `*.vercel.app` alias 308-redirects to it (`next.config.ts`).
- **Structured data** (`lib/jsonld.ts`): one Person graph by `@id` on every
  page, plus page-specific nodes (ProfilePage, TechArticle, FAQPage on `/faq`
  only, BreadcrumbList…).
- **Sitemap** with real content dates (`app/sitemap.ts`), **robots.txt** naming
  AI search/answer crawlers (`app/robots.txt/route.ts`), **llms.txt** and
  **llms-full.txt** (`lib/llms.ts`).
- **Markdown for agents** (`proxy.ts` + `app/md/`): every page as markdown via
  `Accept: text/markdown` or a `.md` URL; markdown 404s; `Link` headers.
- **MCP server** at `/api/mcp` (read-only, `mcp-handler`), WebMCP bridge,
  `/.well-known/ai-catalog.json`, `ard.json`, `mcp/server-card.json`,
  `security.txt` (`app/api/well-known`, `lib/mcp.ts`).
- **IndexNow**: `scripts/indexnow.mjs`, run by `.github/workflows/indexnow.yml`
  after each successful production deploy.
- The phone number is never in HTML, JSON-LD, llms.txt or markdown — it's
  assembled client-side on click (`lib/contact.ts`, `components/site/ContactLinks.tsx`).

## Performance notes

Background videos are self-hosted, colour-graded re-encodes that load only
near the viewport (`components/BgVideo.tsx`); above-the-fold text animates in
with CSS from first paint (`.rise.now`); scroll handlers read layout before
writing; the FAQ tilt uses CSS scroll-driven animations. See
`PROJECT_BIBLE.md` for the traps (sticky + `overflow-x`, `calc(var())` in
transition delays) that still apply.

`legacy/` keeps the original three static HTML files for reference.
