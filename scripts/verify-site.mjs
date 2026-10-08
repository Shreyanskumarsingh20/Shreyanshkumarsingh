#!/usr/bin/env node
// End-to-end checks of every public endpoint and machine-readable file.
//
//   npm run verify                         # production (https://www.shreyanshkumarsingh.com)
//   npm run verify -- http://localhost:3000 # a local `next start`
//
// Exits non-zero on any failure. Covers: markdown content negotiation and
// Vary, the markdown 404, 406, llms.txt, robots, sitemap, the AI catalog,
// the MCP server, heading order and the primary keywords on every sitemap
// page, the content rules (no phone digits in machine-readable output, no
// bank name), the PDF résumé's noindex header and the beacon health check.

const BASE = (process.argv[2] || "https://www.shreyanshkumarsingh.com").replace(/\/$/, "");
// The forbidden strings are kept encoded so this public file doesn't publish
// them: the phone number (from lib/contact.ts, reversed + base64) and the
// bank's name (base64). Matched with any separators between digits.
const PHONE_DIGITS = Buffer.from("MjQ2NTc3NTEzOTE5", "base64").toString().split("").reverse().join("").slice(2);
const PHONE = new RegExp(PHONE_DIGITS.split("").join("\\D?"));
const BANK = new RegExp(Buffer.from("aWRiaQ==", "base64").toString(), "i");
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: Boolean(ok), detail });

async function get(path, headers = {}, init = {}) {
  const res = await fetch(BASE + path, { headers: { "user-agent": "Mozilla/5.0 (verify-site)", ...headers }, redirect: "follow", ...init });
  return { res, body: await res.text() };
}

function headings(html) {
  return [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: m[2].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(),
  }));
}

// ---- markdown negotiation ------------------------------------------------
{
  const { res, body } = await get("/", { accept: "text/markdown" });
  const ct = res.headers.get("content-type") || "";
  check("Accept: text/markdown on / → markdown", res.status === 200 && ct.startsWith("text/markdown") && body.startsWith("---"), ct);
  check("markdown response has Vary: Accept", /accept/i.test(res.headers.get("vary") || ""), res.headers.get("vary"));
  check("markdown home leads with name + role", /# Shreyansh Kumar Singh — AI & Full-Stack Engineer/.test(body));
  check("markdown home has no phone number", !PHONE.test(body));
}
{
  const { res, body } = await get("/", { accept: "text/html" });
  check("Accept: text/html on / → HTML", (res.headers.get("content-type") || "").startsWith("text/html") && body.includes("<h1"));
}
{
  const { res, body } = await get("/__verify-404-probe", { accept: "text/markdown" });
  check("markdown 404: status 404 + markdown body", res.status === 404 && (res.headers.get("content-type") || "").startsWith("text/markdown") && body.length > 20 && body.includes("llms.txt"));
}
{
  const { res } = await get("/about", { accept: "application/json" });
  check("unacceptable type → 406", res.status === 406);
}
{
  const { res, body } = await get("/about.md");
  check("/about.md serves markdown", res.status === 200 && body.includes("# About Shreyansh Kumar Singh"));
}

// ---- machine-readable files ---------------------------------------------
{
  const { res, body } = await get("/llms.txt");
  check("llms.txt has when-to-use guidance", res.status === 200 && body.includes("## When to use this site"));
  check("llms.txt has no phone number", !PHONE.test(body));
  const full = await get("/llms-full.txt");
  check("llms-full.txt has no phone number or bank name", full.res.status === 200 && !PHONE.test(full.body) && !BANK.test(full.body));
}
{
  const { res, body } = await get("/robots.txt");
  check("robots.txt allows crawling and lists the sitemap", res.status === 200 && /Sitemap: .*sitemap\.xml/.test(body));
}
const sitemap = await get("/sitemap.xml");
const pages = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
check("sitemap.xml lists pages", sitemap.res.status === 200 && pages.length >= 20, `${pages.length} URLs`);
// sitemaps.org schema order inside <url>: loc, lastmod, …, then extensions
check(
  "sitemap <url> children in schema order (loc, lastmod, then images)",
  [...sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].every((m) => /^\s*<loc>[^<]+<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*(<image:image>[\s\S]*<\/image:image>\s*)?$/.test(m[1])),
);
for (const f of ["/.well-known/ai-catalog.json", "/.well-known/mcp/server-card.json", "/.well-known/ard.json"]) {
  const { res, body } = await get(f);
  let ok = res.status === 200;
  try {
    JSON.parse(body);
  } catch {
    ok = false;
  }
  check(`${f} is valid JSON`, ok);
}
{
  const { res } = await get("/.well-known/security.txt");
  check("security.txt served", res.status === 200);
}

// ---- MCP ------------------------------------------------------------------
{
  const { res, body } = await get(
    "/api/mcp",
    { "content-type": "application/json", accept: "application/json, text/event-stream" },
    {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "verify-site", version: "1" } } }),
    },
  );
  check("MCP server answers initialize", res.status === 200 && body.includes("serverInfo"));
  check("MCP output has no phone number", !PHONE.test(body));
}

// ---- every sitemap page: headings, keywords, content rules -----------------
const OLD_HEADINGS = ["Nine repositories", "The Range", "Telemetry", "I build what comes next", "Build. Break. Rebuild.", "An actual conversation"];
for (const path of pages) {
  const { res, body } = await get(path);
  const hs = headings(body);
  const title = (body.match(/<title>(.*?)<\/title>/) || [])[1] || "";
  const issues = [];
  if (res.status !== 200) issues.push(`status ${res.status}`);
  if (hs[0]?.level !== 1) issues.push(`first heading is h${hs[0]?.level}`);
  if (hs.filter((h) => h.level === 1).length !== 1) issues.push("not exactly one h1");
  for (let i = 1; i < hs.length; i++) if (hs[i].level > hs[i - 1].level + 1) issues.push(`skips h${hs[i - 1].level}→h${hs[i].level} at "${hs[i].text.slice(0, 40)}"`);
  if (!/Shreyansh Kumar Singh/.test(title) && !/^\/(projects|notes)\/.+/.test(path)) issues.push("title lacks the name");
  if (!/Shreyansh Kumar Singh/.test(body.replace(/<[^>]+>/g, " "))) issues.push("page never names him");
  if (PHONE.test(body.replace(/<script[\s\S]*?<\/script>/g, ""))) issues.push("phone digits in HTML");
  for (const s of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) if (PHONE.test(s[1])) issues.push("phone in JSON-LD");
  if (BANK.test(body)) issues.push("bank name");
  if (/\b[A]NSH\b/.test(body.replace(/<[^>]+>/g, " "))) issues.push("retired short name");
  for (const old of OLD_HEADINGS) if (hs.some((h) => h.text.includes(old))) issues.push(`old heading "${old}"`);
  check(`page ${path}`, issues.length === 0, issues.join("; "));
}
{
  const { body } = await get("/");
  const h1 = headings(body).find((h) => h.level === 1)?.text ?? "";
  check("home H1 is name + AI & Full-Stack Engineer", /Shreyansh Kumar Singh/.test(h1) && /AI & Full-Stack Engineer/i.test(h1), h1);
}

// ---- résumé PDF, caching, beacon ------------------------------------------
{
  const res = await fetch(BASE + "/Shreyansh_Kumar_Singh_Resume.pdf", { method: "HEAD" });
  check("PDF résumé served with X-Robots-Tag: noindex", res.status === 200 && /noindex/.test(res.headers.get("x-robots-tag") || ""));
  const page = await get("/resume");
  check("/resume links the PDF", page.body.includes('href="/Shreyansh_Kumar_Singh_Resume.pdf"'));
}
{
  const res = await fetch(BASE + "/brand/sks-mark-white.webp", { method: "HEAD" });
  check("brand assets cached 30 days", /max-age=2592000/.test(res.headers.get("cache-control") || ""), res.headers.get("cache-control"));
}
{
  const { res, body } = await get("/api/beacon");
  let ok = false;
  try {
    ok = JSON.parse(body).ok === true && !/bot\d+:/i.test(body);
  } catch {}
  check("beacon health check (no secrets in output)", res.status === 200 && ok, body.slice(0, 120));
  const post = await get("/api/beacon", { "content-type": "application/json" }, { method: "POST", body: "{not json" });
  check("beacon swallows bad payloads with 204", post.res.status === 204);
}

// ---- report ---------------------------------------------------------------
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail && !r.ok ? ` — ${r.detail}` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} passed against ${BASE}`);
process.exit(failed.length ? 1 : 0);
