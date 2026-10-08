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
  The client's PDF résumé (`public/Shreyansh_Kumar_Singh_Resume.pdf`) does carry
  it, so it is served `X-Robots-Tag: noindex`.
- **Keywords**: every title, H1 and description works in "Shreyansh Kumar Singh"
  and/or "AI & Full-Stack Engineer" (`lib/site.ts` `PRIMARY_KEYWORDS`).

## Visit alerts (Telegram beacon)

Ported from the Imprint project. Two optional bots, set as Vercel environment
variables (Production), each a no-op when unset:

| Variables | Receives |
| --- | --- |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | everything: crawler, AI-agent and MCP-client fetches, probes, and every visit (bots included) |
| `TELEGRAM_HUMAN_BOT_TOKEN`, `TELEGRAM_HUMAN_CHAT_ID` | real people only: arrival + end-of-visit report when the visitor scores human, and hot actions (Call, WhatsApp, Email, Show number, PDF résumé, LinkedIn/GitHub/X, contact page) |

- Client: `components/beacon/Beacon.tsx` (in the root layout). Server:
  `app/api/beacon/route.ts`; crawler alerts fire from `proxy.ts` via `waitUntil`.
- Logic in `lib/beacon/` — `routing.ts` decides which bot gets what, `bot.ts`
  scores human vs bot, `crawlers.ts` / `paths.ts` classify requests.
- `GET /api/beacon` is a health check (shows which bots are configured, never
  the tokens). Opt out per browser with `/?notrack=1`; disclosed on `/privacy`.
- Silent on localhost unless `NEXT_PUBLIC_BEACON_DEBUG=1`.

## Tests and checks

- `npm test` — unit tests (`tests/*.test.ts`, Node's built-in runner).
- `npm run verify` — end-to-end checks of every public endpoint against
  production; `npm run verify -- http://localhost:3000` against `next start`.

## Performance notes

Background videos are self-hosted, colour-graded re-encodes that load only
near the viewport (`components/BgVideo.tsx`); above-the-fold text animates in
with CSS from first paint (`.rise.now`); scroll handlers read layout before
writing; the FAQ tilt uses CSS scroll-driven animations. See
`PROJECT_BIBLE.md` for the traps (sticky + `overflow-x`, `calc(var())` in
transition delays) that still apply.

`legacy/` keeps the original three static HTML files for reference.
