import type { NextRequest } from "next/server";
import { identifyCrawler, type Crawler, type CrawlerKind } from "./crawlers";
import { classifyPath, isReportablePath, type PathVerdict } from "./paths";
import { esc, clip, sendTelegram, telegramConfigured } from "./telegram";

/**
 * Telegram alerts for crawler, AI-agent and MCP-client requests, fired from
 * proxy.ts (ported from Imprint's middleware alert). These go to bot 1 only —
 * the "everything" channel; bot 2 is for real people (lib/beacon/routing.ts).
 *
 * `ALERT_ON` is the dial: dropping "seo" and "tool" removes the crawlers
 * nobody invited; narrowing to ["live"] leaves only the fetches dispatched
 * mid-conversation. Detection is unaffected either way.
 *
 * Telegram rate-limits at roughly 20 messages per minute per chat and drops
 * the rest, so the dedupe window below is doing real work.
 */
const ALERT_ON: readonly CrawlerKind[] = ["live", "ai", "search", "social", "seo", "tool", "unknown"];

/** One message per agent per path per window — best-effort, per instance. */
const DEDUPE_MS = 10 * 60 * 1000;
const seen = new Map<string, number>();

function duplicate(key: string): boolean {
  const now = Date.now();
  const last = seen.get(key);
  if (seen.size > 2_000) seen.clear();
  seen.set(key, now);
  return last !== undefined && now - last < DEDUPE_MS;
}

/** Same switch as the visitor beacon: one flag for "let local traffic alert me". */
function localAlertsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_BEACON_DEBUG === "1";
}

const ICON: Record<CrawlerKind, string> = {
  live: "🔥",
  ai: "🤖",
  search: "🔎",
  social: "🔗",
  seo: "📈",
  tool: "🛠",
  unknown: "❔",
};

/** What a hit from this tier actually means, in one line. */
const MEANING: Partial<Record<CrawlerKind, string>> = {
  live: "A live fetch: someone asked this assistant about Shreyansh and it came here to answer.",
  social: "Somebody pasted a link to the site somewhere and the platform is building a preview card.",
};

function verb(kind: CrawlerKind, pathname: string): string {
  if (pathname === "/api/mcp") return "connected to the MCP server";
  if (pathname.startsWith("/llms") || pathname.endsWith(".md")) return "read the AI-readable view";
  return kind === "live" ? "fetched a page" : kind === "social" ? "built a link preview" : "crawled a page";
}

function format(crawler: Crawler, req: NextRequest, pathname: string, verdict: PathVerdict): string {
  const h = req.headers;
  const { known, probe } = verdict;

  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  let city = "";
  try {
    city = decodeURIComponent(h.get("x-vercel-ip-city") || "");
  } catch {
    city = h.get("x-vercel-ip-city") || "";
  }
  const place = [city, h.get("x-vercel-ip-country-region"), h.get("x-vercel-ip-country")].filter(Boolean).join(", ");
  const asn = h.get("x-vercel-ip-as-number");
  const referer = h.get("referer");
  const ua = h.get("user-agent") || "";

  const headline = probe
    ? `🚨 <b>${esc(crawler.name)}</b> probed for something that is not here`
    : known
      ? `${ICON[crawler.kind]} <b>${esc(crawler.name)}</b> ${verb(crawler.kind, pathname)}`
      : `${ICON[crawler.kind]} <b>${esc(crawler.name)}</b> requested a page that does not exist`;

  const lines = [
    headline,
    "",
    known ? `📄 <code>${esc(pathname)}</code>` : `📄 <code>${esc(pathname)}</code> — <b>404</b>, no such route`,
    req.method !== "GET" ? `↗️ ${esc(req.method)}` : "",
    probe ? `⚠️ Fishing for: ${esc(probe)}` : "",
    crawler.vendor ? `🏷 ${esc(crawler.name)} · ${esc(crawler.vendor)}` : "",
    place ? `📍 ${esc(place)}` : "",
    asn ? `🏢 AS${esc(asn)}` : "",
    `🌐 <code>${esc(ip)}</code>`,
    referer ? `↩️ ${esc(clip(referer, 200))}` : "",
    ua ? `🖥 <code>${esc(clip(ua, 300))}</code>` : "",
  ].filter(Boolean);

  const meaning = probe
    ? "<i>Nothing was served. Background noise — every public domain gets this.</i>"
    : MEANING[crawler.kind]
      ? `<i>${MEANING[crawler.kind]}</i>`
      : "";
  if (meaning) lines.push("", meaning);
  return lines.join("\n");
}

/**
 * Who is calling /api/mcp. MCP clients rarely send a crawler-shaped user
 * agent (an IDE, `node`, `python-httpx`…), so any non-browser request there
 * is reported. The WebMCP bridge script is fetched by every browser visit, so
 * browsers are skipped.
 */
function mcpClient(ua: string | null): Crawler | null {
  const known = identifyCrawler(ua);
  if (known) return known;
  if (ua && /mozilla\//i.test(ua)) return null;
  return { name: ua ? `MCP client (${clip(ua, 40)})` : "MCP client", kind: "live" };
}

/**
 * Returns a promise to hand to `event.waitUntil`, or null when there is
 * nothing to report. Every decision is synchronous (covered by proxy.ts's
 * try/catch); only the send is deferred, and its errors are swallowed —
 * telemetry failing is never a reason to fail or slow a request.
 */
export function crawlerAlert(req: NextRequest): Promise<void> | null {
  if (!telegramConfigured("all")) return null;

  const { pathname, hostname } = new URL(req.url);
  if (!localAlertsEnabled() && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname)) return null;

  const ua = req.headers.get("user-agent");
  const crawler = pathname === "/api/mcp" ? mcpClient(ua) : identifyCrawler(ua);
  if (!crawler) return null;
  if (!ALERT_ON.includes(crawler.kind)) return null;

  // Probe first: nearly every probe target looks like a file, which the
  // reportable-path filter would otherwise throw away.
  const verdict = classifyPath(pathname);
  if (!verdict.probe && !isReportablePath(pathname)) return null;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  if (duplicate(`${crawler.name}|${ip}|${pathname}`)) return null;

  return sendTelegram(format(crawler, req, pathname, verdict), "all")
    .then(() => undefined)
    .catch(() => undefined);
}
