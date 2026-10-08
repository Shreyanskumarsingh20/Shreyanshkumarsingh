// Notify IndexNow (Bing, Yandex, Seznam, Naver, Yep, Amazon — one call
// reaches all of them; Google doesn't take part) about pages that changed.
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

const args = process.argv.slice(2);
const all = args.includes("--all");
const daysArg = args.indexOf("--days");
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 3;

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

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URL(s) → HTTP ${res.status}`);
for (const u of urlList) console.log("  " + u);
// 200 = accepted, 202 = accepted while the key is being verified
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
