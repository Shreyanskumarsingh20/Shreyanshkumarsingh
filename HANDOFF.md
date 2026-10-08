# HANDOFF — www.shreyanshkumarsingh.com

Read this first if you are picking the project up — person or AI agent.
It covers where things stand, how to work on the site, what to watch, and
what is still open. The technical reference is
[`PROJECT_BIBLE.md`](PROJECT_BIBLE.md). Confidential context (the client's
phone number, the bank behind Sarthi, résumé decisions, account details)
is in **`reports/HANDOFF_PRIVATE.md`** — gitignored, on the working machine
only. **This repository is public: never commit anything from that file.**

*Last updated: 8 October 2026, after commit `5f294cf`.*

---

## 1. In one minute

- **What**: the portfolio of **Shreyansh Kumar Singh, AI & Full-Stack
  Engineer, Pune, India** — built by a developer working for him (the
  client). "THE RANGE" is the portfolio's concept name.
- **Goal**: rank #1 and be cited by AI answer engines for *"Shreyansh Kumar
  Singh"* and *"AI & Full-Stack Engineer"*; convert recruiters (open to
  full-time or hybrid roles, Applied AI Engineer first).
- **State**: all planned SEO / AEO / GEO / agent-readiness work is **live**.
  PageSpeed 92 mobile / 95 desktop, 100 on Accessibility, Best Practices and
  SEO; is-agentic 79/100 with every check passing; 53/53 live checks green.
- **Waiting on**: search engines indexing the site (days–weeks), and the
  client's off-site profile work (LinkedIn / GitHub / X).

---

## 2. Live URLs and accounts

| Thing | Where |
|---|---|
| Site (canonical) | https://www.shreyanshkumarsingh.com — the apex and `shreyanshkumarsingh.vercel.app` 308 here |
| Repo | https://github.com/Shreyanskumarsingh20/Shreyanshkumarsingh (public, `main` = production) |
| Hosting | Vercel, Hobby plan, project in the account that owns the domain (not the developer's CLI account — see private file) |
| Search | Google Search Console (Domain property, sitemap submitted) · Bing Webmaster Tools (imported from GSC, sitemap: Success, 27 URLs) |
| Alerts | Two Telegram bots (all alerts / humans + hot actions) |
| Analytics | **Google Analytics 4** — property "shreyanshkumarsingh.com", web stream "My portfolio website", stream ID `16067833946`, Measurement ID `G-NQJCRJ7B2Z` · **Microsoft Clarity** — project "SKS Portfolio", ID `yui86woola`. Both opt-in behind the cookie banner. |
| Client profiles | LinkedIn `/in/shreyansh-kumar-singh-080326205` · GitHub `Shreyanskumarsingh20` (profile README live) · X `@ShreyanshK98` |
| Brief + strategy | `reports/Portfolio SEO AEO GEO strategy.md` and `research_notes/` (gitignored) |

---

## 3. How to work on it

1. `npm install`, `npm run dev` (port 3000). Read
   `node_modules/next/dist/docs/` before using any Next.js API — this is
   Next **16** (`proxy.ts`, not middleware). See `AGENTS.md`.
2. Make the change. Keep facts in `lib/*.ts` (PROJECT_BIBLE §5).
3. Before pushing: `npm run lint` → `npm run build` → `npm test`.
4. Commit straight to `main` (no PRs), message ending
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; in PowerShell
   use `git commit -F <file>`.
5. Push → Vercel deploys in ~40 s → run `npm run verify` (53 live checks).
   IndexNow fires automatically from GitHub Actions.
6. If page content changed, bump its date in `lib/sitemap.ts` (or the case
   study / note `updated` field).

Do **not**: run Lighthouse locally (use pagespeed.web.dev); add Vercel
Analytics/Speed Insights unless asked; remove visual elements without the
client's approval; edit `D:\project\Imprint` (read-only source of the
beacon); put `overflow-x:hidden` on any ancestor of the project cards; go
back to `app/sitemap.ts`.

---

## 4. Current scores

| Metric | 7 Oct (start) | 8 Oct (now) |
|---|---|---|
| PageSpeed mobile | 48 (LCP 4.2 s, TBT 3.0 s) | **92** (FCP 1.1 s, LCP 3.1 s, TBT 70 ms, CLS 0.001 — before the last fixes) |
| PageSpeed desktop | 94 → 63 (TBT 1,080 ms) | **95** |
| Accessibility / Best Practices / SEO | — | **100 / 100 / 100**, Agentic Browsing 4/4 |
| is-agentic.com | 66 | **79** — essential 62.2/80, recommended 12/20, bonus +5 |
| Home page weight | 36 MB | ≈ 0.6 MB |
| `npm run verify` | — | 53/53 |
| Unit tests | — | 12/12 |

**Why is-agentic stops at 79**: the remaining points are for an API product
(OpenAPI spec, JSON error responses, developer portal, CLI tool, API docs,
function-calling schemas) plus two that need search indexing (brand search,
developer-resource search). Optional upgrade, ~half a day, ~+20 points: a
read-only JSON API mirroring the MCP data, an OpenAPI 3.1 spec at
`/openapi.json`, JSON errors under `/api/*`, a `/developers` page linked
from the footer and llms.txt. Not started — needs a go-ahead. A CLI tool on
npm is not recommended (needs his npm account, no value for a portfolio).

---

## 5. Open items

### Client / owner to do
1. **GitHub profile polish** (logged in as him — your account can push to his
   repos but can't edit his settings): profile picture (the square headshot
   `public/images/shreyansh-kumar-singh.jpg`), name, bio, company, location,
   website, LinkedIn + X links; pin `Nythera`, `BookVerseAi`, `vaultIQ`,
   `3dIndianmusem`, `THE_EVOLUTION`, `the-collectors-pulse`; give each a
   description, the case-study URL as website, and topics. Exact copy was
   provided in the 8 Oct session (also summarised in the private file).
2. **GitHub cleanup**: clear the Sarthi repository's description (its name
   and description reveal the bank — see private file); make `gamersinghxx-creator` (leftover from
   the old username) and the outdated `portfolio.dev` private or delete
   them.
3. **LinkedIn**: headline, About, Experience entry, Featured (three case
   studies), website field, top skills, Open to work (recruiters only) —
   copy provided in the 8 Oct session.
4. **X**: name, bio, location, website, pinned post — copy provided.
5. **Same headshot everywhere**.
6. **Rename the Sarthi repo** so it no longer reveals the bank, then link it
   (`lib/projects.ts` → `url: repo("<new>")`, drop `sourceNote`, add to the
   case-study links).
7. **Fix the GitHub username spelling** ("Shreyans…") when ready → update
   `GITHUB_USER` in `lib/site.ts`, rebuild, rename the profile-README repo to
   the new username.
8. **Free disk space on C:** (≈ 137 MB free on 8 Oct — breaks Chrome-based
   tooling).

### Waiting on search engines
9. **Google Search Console "Couldn't fetch" on the sitemap** — the sitemap is
   correct (schema-ordered since `3552b23`; serves 200 to Googlebot; Bing
   read it fine). New properties often show this for days. Resubmit after
   48 h; *URL Inspection → Test live URL* on the sitemap URL is the
   definitive check. Telegram bot 1 alerts "Googlebot read the sitemap" the
   moment it happens.
10. **Brand ranking / AI citations** — will follow indexing. Re-run
    is-agentic and check GSC → Performance for "Shreyansh Kumar Singh" in
    1–2 weeks.

### Analytics — live since 8 Oct; dashboard to-dos
GA4 (`G-NQJCRJ7B2Z`) and Clarity (`yui86woola`) are **live and receiving
data** behind the cookie banner (verified on production: after Accept, GA
sends `g/collect` with `tid=G-NQJCRJ7B2Z`, `gcs=G101`; Clarity's
`k.clarity.ms/collect` returns 204; Clarity showed live recordings). Still to
do in the dashboards (owner):
- **GA → Admin → Events**: mark `generate_lead`, `resume_download`,
  `profile_click` as **key events** (they appear after the first click of
  each).
- **GA → Admin → Product links → Search Console links**: link the GSC
  property.
- **GA → Admin → Data collection and modification → Data retention**: set
  event data to **14 months**.
- **GA → Web stream → Configure tag settings → Define internal traffic**:
  add the owner's and the client's IPs, then activate the "Internal traffic"
  data filter.
- **Clarity → Settings → Setup → Google Analytics integration**: connect
  `G-NQJCRJ7B2Z` (optional).
- Expected, not errors: GA's "Your Google tag wasn't detected" (its checker
  never clicks Accept), GA's "Data collection isn't active" / "No data
  received" and Clarity's "Almost there!" screen (status flags that lag real
  data by 30 min–48 h). Don't paste the vendors' snippets into the site — it
  would double-count and bypass consent.

### Optional, needs a decision
11. Read-only JSON API + OpenAPI for is-agentic (§4).
12. Vercel Web Analytics / Speed Insights (free on Hobby) — only if wanted
    (GA4 + Clarity now cover analytics).
13. A Wikidata item for him — **not yet** (needs independent sources first).
14. Rewrite git history to purge old mentions of the bank and the retired
    short name from past commits (they're gone from the current tree but
    remain in history). Destructive (force-push) — only with explicit
    approval.

---

## 6. Monitoring

- **Telegram bot 1 (all)**: crawler/AI fetches (🔥 live ChatGPT-User /
  Claude-User / Perplexity-User fetches are the ones that mean someone asked
  an assistant about him), search crawls, sitemap reads, MCP clients,
  scanner probes (background noise), every visit.
- **Telegram bot 2 (humans)**: real visits (arrival + report) and hot
  actions — Call, WhatsApp, Email, Show number, PDF résumé, LinkedIn /
  GitHub / X, contact page.
- **Health check**: `https://www.shreyanshkumarsingh.com/api/beacon` shows
  `{"telegram":{"allAlerts":true,"humanAlerts":true}}` when both bots are
  configured.
- **Google Search Console**: Pages (indexing), Sitemaps, Performance →
  Queries ("Shreyansh Kumar Singh", "AI & Full-Stack Engineer").
- **Bing Webmaster Tools**: Sitemaps, URL inspection, IndexNow log.
- **Google Analytics 4**: Reports → Realtime (live check), Reports →
  Engagement → Events (`generate_lead`, `resume_download`,
  `profile_click`), Acquisition (how people arrive). Counts only visitors
  who accepted cookies and don't block GA — expect fewer than Telegram.
- **Microsoft Clarity**: Recordings (session replays, available ~30 min–2 h
  after a visit), Heatmaps (useful after a few dozen sessions), Dashboard
  (rage clicks, dead clicks, scroll depth).
- **Vercel → project → Firewall → Overview**: challenged/denied traffic if
  a crawler ever seems blocked. Current settings: Bot Protection **Off**,
  AI Bots **Allow**, no Attack Mode, no custom rules — leave them.

---

## 7. Runbooks

**Telegram alerts stopped** → open `/api/beacon`. `false` for a bot = its
env vars are missing in Vercel (Settings → Environment Variables,
Production) — re-add, redeploy. Both `true` but silent = check the Vercel
function logs for `[beacon] telegram send failed` (bad token / chat id, or
the bot was blocked in Telegram).

**"ChatGPT/Claude can't open the site"** → ask with the full URL
(`https://www.shreyanshkumarsingh.com/`). If Telegram bot 1 shows the
fetcher's alert, the site served it. If no alert arrives, the assistant
never sent a request (its tool failed). Don't test by spoofing a bot user
agent from your own machine — Vercel challenges impersonators (PROJECT_BIBLE
§19).

**GA4 shows no data** → open the site in an incognito window, click
**Accept**, browse two pages, and watch GA → Realtime (≈30 s). Nothing →
disable ad blockers / privacy extensions (they block GA and Clarity) or try
a phone on mobile data. In DevTools → Network, a request to
`google-analytics.com/g/collect?…tid=G-NQJCRJ7B2Z` means the site is doing
its part. Ignore the setup page's "tag wasn't detected".

**Turn analytics off** → set `NEXT_PUBLIC_GA_ID` and/or
`NEXT_PUBLIC_CLARITY_ID` to an empty value in Vercel and redeploy (no ID =
no banner, no script, privacy page reverts to "no cookies").

**Search Console says the sitemap can't be read** → `npm run verify` (it
checks the sitemap's element order); if green, it's Google's delay.

**A page needs a content change** → edit the `lib/*.ts` data, bump its
sitemap date, lint/build/test, push, verify.

**Resubmit everything to search engines** → `node scripts/indexnow.mjs --all`
(Bing, Yandex, Seznam, Naver, Yep, Amazon + shared endpoint; Internet
Archive's endpoint currently doesn't resolve — expected). For Google: Search
Console → URL Inspection → Request indexing.

---

## 8. Decisions already made (don't re-litigate)

- Canonical host is **www**. Contact is direct (Call / WhatsApp / Email) —
  no form. `/contact` is the one contact page.
- FAQPage markup only on `/faq`; home shows a 4-question teaser.
- Markdown views for every page; MCP server read-only with no auth; WebMCP
  included; Cloudflare `Content-Signal` robots line removed.
- The loader stays (1.4 s first visit, 0.5 s repeat) — it costs some
  Speed Index; the client wants it.
- Desktop particle animation starts on first input / after 7 s idle.
- The PDF résumé is linked from `/resume` and served `noindex`.
- Two Telegram bots: everything vs. humans + hot actions.
- Analytics = GA4 + Clarity, **opt-in** behind a cookie banner with equal
  Accept / Decline (basic consent mode — nothing loads before Accept). Not
  "advanced" consent mode (it would send cookieless pings before consent).
  GA4 property settings: industry Jobs & Education, India time zone, INR.
- The share card for `/`, `/about`, `/contact`, `/resume` is the client's
  photo card (`app/opengraph-image.jpg`); other pages keep generated cards.
- The original static HTML files were removed from the repo (local copies in
  `reports/legacy-originals/`).
- No API product, no CLI tool, no Wikidata item — unless decided otherwise.

---

## 9. Session log (8 Oct 2026, phase 8)

- PageSpeed + is-agentic results reviewed; the pasted is-agentic report was
  the stale 7 Oct one — all its items already passed live.
- Primary keywords applied to every title / H1 / description; new hero (name
  + role H1); every ambiguous heading rewritten site-wide (home sections,
  about, contact, experience, case studies, FAQ groups, footer, 404,
  privacy); markdown + llms follow.
- Alignment: scroll cue vs stats, stats alignment, Build chapter numbers vs
  headings, CTA rows vs footer, footer column on inner pages.
- Performance: deferred particle loop, optimized card screenshots, 30-day
  asset caching, hero poster preload → desktop 63 → 95, mobile → 92.
- Corrected PDF résumé added (one hidden link to the bank-named repo removed
  from the PDF), served noindex.
- Telegram beacon ported from Imprint with two-bot routing; privacy page
  rewritten with opt-out.
- Tests (`npm test`) and live verification (`npm run verify`) added.
- Google sitemap fix (schema order); IndexNow to every engine (7/8 accepted).
- Investigated "ChatGPT can't reach the site": Vercel settings were already
  correct; false alarm from spoofed test traffic; ChatGPT-User fetch then
  confirmed via Telegram. `Accept: text/plain` now gets markdown.
- His GitHub profile README pushed to
  `Shreyanskumarsingh20/Shreyanskumarsingh20`.
- Public-repo hygiene: phone digits removed from code comments, bank name
  and retired short name removed from tracked files, legacy HTML moved out.
- HANDOFF.md written, PROJECT_BIBLE.md rewritten (`9efe0f4`).
- Link previews: the client's photo card (1200×630, 127 KB) for home, about,
  contact and résumé; stale generated-card headlines fixed (`f53e04a`);
  `og:site_name` + `og:locale` restored on every page (`60893dd`) — pages'
  own openGraph blocks had replaced the layout's.
- Opt-in GA4 + Microsoft Clarity behind a cookie banner (`49719a0`), IDs
  switched on (`5f294cf`); verified live (consent gating, GA hits, Clarity
  uploads, cookie removal on withdrawal, no CSP errors).
