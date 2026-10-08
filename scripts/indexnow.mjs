// Notify every IndexNow search engine about pages that changed.
//
// IndexNow engines share submissions with each other, but sharing is
// best-effort, so this submits to each engine directly as well as to the
// shared api.indexnow.org endpoint. The engine list is read live from the
// official registry (https://www.indexnow.org/searchengines.json → each
// engine's meta.json "api"), with a built-in fallback so a registry outage
// never skips a submission. As of Oct 2026: Microsoft Bing, Yandex, Seznam,
// Naver, Yep, Internet Archive and Amazon (Amazonbot). Google does not take
// part in IndexNow — use Search Console for Google.
//
// Reads the live sitemap and submits every URL whose <lastmod> is within the
// last N days (default 3), so routine deploys don't re-submit the whole site.
// Run after a production deploy — .github/workflows/indexnow.yml does that.
//
//   node scripts/indexnow.mjs            # changed in the last 3 days
//   node scripts/indexnow.mjs --all      # everything in the sitemap
//   node scripts/indexnow.mjs --days 14

const HOST = "www.shreyanshkumarsingh.com";
const ORIGIN = `https://${HOST}`;
// public by design: IndexNow verifies ownership by fetching /<key>.txt
const KEY = "c0d1ea2c1edd5467fecf11474d3d1e60";
const REGISTRY = "https://www.indexnow.org/searchengines.json";
const SHARED = { id: "indexnow.org (shared)", api: "https://api.indexnow.org/indexnow" };
const FALLBACK = [
  { id: "bing", api: "https://www.bing.com/indexnow" },
  { id: "yandex", api: "https://yandex.com/indexnow" },
  { id: "seznam", api: "https://search.seznam.cz/indexnow" },
  { id: "naver", api: "https://searchadvisor.naver.com/indexnow" },
  { id: "yep", api: "https://indexnow.yep.com/indexnow" },
  { id: "internetarchive", api: "https://internetarchive.indexnow.org/indexnow" },
  { id: "amazonbot", api: "https://indexnow.amazonbot.amazon/indexnow" },
];

const args = process.argv.slice(2);
const all = args.includes("--all");
const daysArg = args.indexOf("--days");
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 3;

async function json(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

/** Every engine in the official registry, by its meta.json "api" field. */
async function engines() {
  try {
    const registry = await json(REGISTRY);
    const found = await Promise.all(
      Object.entries(registry).map(async ([id, metaUrl]) => {
        try {
          const meta = await json(metaUrl);
          return meta.api ? { id, api: meta.api } : null;
        } catch {
          return FALLBACK.find((f) => f.id === id) ?? null;
        }
      }),
    );
    const list = found.filter(Boolean);
    // anything in the fallback the registry no longer lists is still tried
    for (const f of FALLBACK) if (!list.some((e) => e.id === f.id)) list.push(f);
    return list;
  } catch (err) {
    console.warn(`IndexNow: registry unavailable (${err.message}) — using the built-in list.`);
    return FALLBACK;
  }
}

const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const cutoff = Date.now() - days * 86_400_000;
const urlList = entries
  .filter((e) => e.loc && (all || (e.lastmod && Date.parse(e.lastmod) >= cutoff)))
  .map((e) => e.loc);

if (!urlList.length) {
  console.log(`IndexNow: nothing changed in the last ${days} days — skipping.`);
  process.exit(0);
}

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList });
const targets = [SHARED, ...(await engines())];

console.log(`IndexNow: submitting ${urlList.length} URL(s) to ${targets.length} endpoints`);
const results = await Promise.all(
  targets.map(async (t) => {
    try {
      const res = await fetch(t.api, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        signal: AbortSignal.timeout(30_000),
      });
      const text = res.ok ? "" : (await res.text().catch(() => "")).slice(0, 200);
      return { ...t, status: res.status, ok: res.status === 200 || res.status === 202, text };
    } catch (err) {
      return { ...t, status: 0, ok: false, text: err.message };
    }
  }),
);

// 200 = accepted, 202 = accepted while the key is being verified
for (const r of results) {
  console.log(`  ${r.ok ? "✓" : "✗"} ${r.id.padEnd(22)} HTTP ${r.status}${r.text ? ` — ${r.text.replace(/\s+/g, " ")}` : ""}`);
}
console.log("URLs:");
for (const u of urlList) console.log("  " + u);

const accepted = results.filter((r) => r.ok).length;
console.log(`\n${accepted}/${results.length} endpoints accepted the submission.`);
// fail the workflow only if nobody accepted it — one engine's outage or
// rate limit (HTTP 429) shouldn't turn a deploy red
process.exit(accepted ? 0 : 1);
