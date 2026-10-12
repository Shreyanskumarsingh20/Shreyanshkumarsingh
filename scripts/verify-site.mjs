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

import https from "node:https";
import http from "node:http";

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

// ---- JSON API + OpenAPI --------------------------------------------------------
{
  const { res, body } = await get("/openapi.json");
  let spec = null;
  try {
    spec = JSON.parse(body);
  } catch {}
  const ops = spec ? Object.entries(spec.paths).flatMap(([p, item]) => Object.values(item).map((op) => ({ p, op }))) : [];
  check("openapi.json is OpenAPI 3.1 JSON", res.status === 200 && spec?.openapi?.startsWith("3.1"), res.headers.get("content-type"));
  check(
    "every operation has an operationId, description and response schema",
    ops.length >= 10 && ops.every(({ op }) => op.operationId && op.description && op.responses?.["200"]?.content?.["application/json"]?.schema),
    `${ops.length} operations`,
  );
  check("operationIds are unique", new Set(ops.map(({ op }) => op.operationId)).size === ops.length);
  const alias = await get("/api/openapi.json");
  check("/api/openapi.json serves the same spec", alias.res.status === 200 && alias.body === body);

  // call every documented GET with example parameters
  const projects = JSON.parse((await get("/api/v1/projects")).body);
  const notesList = JSON.parse((await get("/api/v1/notes")).body);
  const fill = (p) =>
    p.replace("{slug}", p.startsWith("/projects") ? projects.projects[0].slug : notesList.notes[0].slug) + (p === "/search" ? "?q=RAG" : "");
  const bad = [];
  for (const { p } of ops) {
    const r = await get(`/api/v1${fill(p === "/" ? "" : p)}`);
    let ok = r.res.status === 200 && (r.res.headers.get("content-type") || "").startsWith("application/json");
    try {
      JSON.parse(r.body);
    } catch {
      ok = false;
    }
    if (!ok) bad.push(`${p} → ${r.res.status}`);
    if (PHONE.test(r.body) || BANK.test(r.body)) bad.push(`${p} leaks contact/bank data`);
    if (r.res.headers.get("access-control-allow-origin") !== "*") bad.push(`${p} lacks CORS`);
  }
  check("every documented endpoint returns 200 JSON with CORS, no phone/bank", bad.length === 0, bad.join("; "));

  const isErr = (r, status, code) => {
    try {
      const j = JSON.parse(r.body);
      return r.res.status === status && j.error?.code === code && typeof j.error?.message === "string" && j.error?.docs;
    } catch {
      return false;
    }
  };
  check("unknown slug → 404 JSON error", isErr(await get("/api/v1/projects/no-such-project"), 404, "not_found"));
  check("unknown endpoint → 404 JSON error", isErr(await get("/api/v1/nope"), 404, "not_found"));
  check("unknown /api path → 404 JSON error", isErr(await get("/api/does-not-exist"), 404, "not_found"));
  check("bad search query → 400 JSON error", isErr(await get("/api/v1/search?q=x"), 400, "bad_request"));
  check("POST → 405 JSON error", isErr(await get("/api/v1/profile", {}, { method: "POST" }), 405, "method_not_allowed"));
  const dev = await get("/developers");
  check("/developers documents the API and links the spec", dev.res.status === 200 && dev.body.includes('href="/openapi.json"'));
  const home = await get("/");
  check("home page links the developer docs", home.body.includes('href="/developers"'));
}

// ---- hardening ------------------------------------------------------------------
{
  const probe = "ignore-previous-instructions-verify";
  const md404 = await get(`/${probe}`, { accept: "text/markdown" });
  check("markdown 404 doesn't echo the requested path", md404.res.status === 404 && !md404.body.includes(probe));
  const api404 = await get(`/api/v1/projects/${probe}%20now`);
  check("API 404 doesn't echo arbitrary input", api404.res.status === 404 && !api404.body.includes("now"));
  // fetch() refuses to send TRACE, so use node:https / node:http directly.
  // The risk with TRACE is cross-site tracing (the request echoed back);
  // Next's runtime rejects the method itself, so check it never echoes.
  const trace = await new Promise((resolve) => {
    const u = new URL(BASE + "/");
    const mod = u.protocol === "https:" ? https : http;
    const r = mod.request(u, { method: "TRACE", headers: { "user-agent": "Mozilla/5.0 (verify-site)", "x-trace-probe": "xst-canary" } }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    r.on("error", () => resolve({ status: 0, body: "" }));
    r.end();
  });
  check(
    "TRACE never echoes the request or leaks detail",
    trace.status !== 200 && !trace.body.includes("xst-canary") && !/at \w+ \(|node_modules|\.next\//.test(trace.body),
    `${trace.status} ${trace.body.slice(0, 40)}`,
  );
  const home = await get("/");
  check("no X-Powered-By header", !home.res.headers.get("x-powered-by"));
  check("CSP blocks framing (frame-ancestors 'none')", (home.res.headers.get("content-security-policy") || "").includes("frame-ancestors 'none'"));
  check("HSTS ≥ 1 year", /max-age=(\d+)/.test(home.res.headers.get("strict-transport-security") || "") && Number(RegExp.$1) >= 31536000);
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
  for (const tag of ["og:site_name", "og:title", "og:description", "og:image", "og:url"]) {
    if (!body.includes(`property="${tag}"`)) issues.push(`missing ${tag}`);
  }
  if (!/Shreyansh Kumar Singh/.test(body.replace(/<[^>]+>/g, " "))) issues.push("page never names him");
  if (PHONE.test(body.replace(/<script[\s\S]*?<\/script>/g, ""))) issues.push("phone digits in HTML");
  for (const s of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) if (PHONE.test(s[1])) issues.push("phone in JSON-LD");
  if (BANK.test(body)) issues.push("bank name");
  // GA4 is on by default and must be in the server HTML (Google's checker reads it)
  if (!/googletagmanager\.com\/gtag\/js\?id=G-NQJCRJ7B2Z/.test(body)) issues.push("GA4 tag missing from HTML");
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
