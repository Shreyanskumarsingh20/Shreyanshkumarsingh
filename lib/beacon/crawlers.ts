/**
 * Crawler identification, for the server side (ported from Imprint).
 *
 * This deliberately does not live in the visitor beacon. The beacon is a client
 * component that reports after hydration, and most of these agents never
 * execute JavaScript — extending it would have produced a detector that could
 * never fire. Detection happens in proxy.ts instead, where the request itself
 * is visible.
 *
 * Deliberately separate from `bot.ts`. That one scores a beacon payload to
 * decide whether a *visitor* was a person; this one reads a user agent to
 * decide whether a *request* was automated.
 *
 * ── Why the kinds are per-agent and not per-vendor ───────────────────────────
 *
 *   ClaudeBot         — a training crawl. Says nothing about being findable.
 *   Claude-SearchBot  — indexing for Claude's search. This is the one that
 *                       decides whether Claude can cite the site at all.
 *   Claude-User       — somebody asked Claude about Shreyansh *right now* and
 *                       it went and fetched the page.
 *
 * User agents are self-declared and trivially spoofed, so treat a match as
 * "claims to be" rather than proof.
 */

export type CrawlerKind =
  /** Dispatched mid-conversation. A person asked; the assistant came here. */
  | "live"
  /** AI corpus and answer-engine indexing. */
  | "ai"
  /** Classic search engine indexing. */
  | "search"
  /** Link unfurlers building a preview card. */
  | "social"
  /** Backlink and audit crawlers. Nobody asked them here. */
  | "seo"
  /** Scripts, headless browsers, uptime monitors. */
  | "tool"
  /** Matched the generic shape, or sent no user agent at all. */
  | "unknown";

export type Crawler = {
  /** Canonical agent name, as the vendor documents it where there is one. */
  name: string;
  vendor?: string;
  kind: CrawlerKind;
};

/**
 * Ordered **most specific first** — the first match wins, so a narrow pattern
 * must sit above the broad one for the same vendor (`ChatGPT-User` before
 * `gptbot`, `Claude-SearchBot` before `claudebot`, `Applebot-Extended` before
 * `applebot`).
 *
 * Patterns are tested against a **lowercased** user agent, so they carry no `i`
 * flag and must be written in lower case.
 */
const RULES: { match: string | RegExp; crawler: Crawler }[] = [
  // ── Live fetchers ────────────────────────────────────────────────────────
  { match: "chatgpt-user", crawler: { name: "ChatGPT-User", vendor: "OpenAI", kind: "live" } },
  { match: "claude-user", crawler: { name: "Claude-User", vendor: "Anthropic", kind: "live" } },
  { match: "perplexity-user", crawler: { name: "Perplexity-User", vendor: "Perplexity", kind: "live" } },
  { match: "mistralai-user", crawler: { name: "MistralAI-User", vendor: "Mistral", kind: "live" } },
  { match: "meta-externalfetcher", crawler: { name: "Meta-ExternalFetcher", vendor: "Meta", kind: "live" } },
  { match: "duckassistbot", crawler: { name: "DuckAssistBot", vendor: "DuckDuckGo", kind: "live" } },

  // ── AI index and corpus crawlers ─────────────────────────────────────────
  { match: "oai-searchbot", crawler: { name: "OAI-SearchBot", vendor: "OpenAI", kind: "ai" } },
  { match: "claude-searchbot", crawler: { name: "Claude-SearchBot", vendor: "Anthropic", kind: "ai" } },
  { match: "perplexitybot", crawler: { name: "PerplexityBot", vendor: "Perplexity", kind: "ai" } },
  { match: "applebot-extended", crawler: { name: "Applebot-Extended", vendor: "Apple", kind: "ai" } },
  { match: "google-extended", crawler: { name: "Google-Extended", vendor: "Google", kind: "ai" } },
  { match: "gptbot", crawler: { name: "GPTBot", vendor: "OpenAI", kind: "ai" } },
  { match: "claudebot", crawler: { name: "ClaudeBot", vendor: "Anthropic", kind: "ai" } },
  { match: /claude-web|anthropic-ai/, crawler: { name: "Legacy Anthropic agent", vendor: "Anthropic", kind: "ai" } },
  { match: "ccbot", crawler: { name: "CCBot", vendor: "Common Crawl", kind: "ai" } },
  { match: "bytespider", crawler: { name: "Bytespider", vendor: "ByteDance", kind: "ai" } },
  { match: "meta-externalagent", crawler: { name: "Meta-ExternalAgent", vendor: "Meta", kind: "ai" } },
  { match: "amazonbot", crawler: { name: "Amazonbot", vendor: "Amazon", kind: "ai" } },
  { match: "youbot", crawler: { name: "YouBot", vendor: "You.com", kind: "ai" } },
  { match: /cohere-ai|cohere-training-data-crawler/, crawler: { name: "cohere-ai", vendor: "Cohere", kind: "ai" } },
  { match: "ai2bot", crawler: { name: "AI2Bot", vendor: "Allen Institute", kind: "ai" } },
  { match: "pangubot", crawler: { name: "PanGuBot", vendor: "Huawei", kind: "ai" } },
  { match: "diffbot", crawler: { name: "Diffbot", vendor: "Diffbot", kind: "ai" } },
  { match: "timpibot", crawler: { name: "Timpibot", vendor: "Timpi", kind: "ai" } },

  // Unconfirmed patterns: xAI and Brave do not publish stable user-agent
  // strings, so these are guesses. If one fires, replace it with the raw UA.
  { match: /\bgrok\b|\bxai[-\s]?bot\b|\bxai\b/, crawler: { name: "xAI / Grok (unconfirmed)", vendor: "xAI", kind: "ai" } },
  { match: /bravebot|brave[-\s]?search/, crawler: { name: "Brave Search (unconfirmed)", vendor: "Brave", kind: "ai" } },

  // ── Search engines ───────────────────────────────────────────────────────
  { match: "google-inspectiontool", crawler: { name: "Google Search Console", vendor: "Google", kind: "search" } },
  { match: "googleother", crawler: { name: "GoogleOther", vendor: "Google", kind: "search" } },
  { match: "googlebot-image", crawler: { name: "Googlebot-Image", vendor: "Google", kind: "search" } },
  { match: "googlebot", crawler: { name: "Googlebot", vendor: "Google", kind: "search" } },
  { match: /bingbot|bingpreview|microsoftpreview/, crawler: { name: "Bingbot", vendor: "Microsoft", kind: "search" } },
  { match: "duckduckbot", crawler: { name: "DuckDuckBot", vendor: "DuckDuckGo", kind: "search" } },
  { match: "applebot", crawler: { name: "Applebot", vendor: "Apple", kind: "search" } },
  { match: "yandex", crawler: { name: "YandexBot", vendor: "Yandex", kind: "search" } },
  { match: "baiduspider", crawler: { name: "Baiduspider", vendor: "Baidu", kind: "search" } },
  { match: "seznambot", crawler: { name: "SeznamBot", vendor: "Seznam", kind: "search" } },
  { match: /naver|yeti/, crawler: { name: "Yeti", vendor: "Naver", kind: "search" } },

  // ── Social unfurlers ─────────────────────────────────────────────────────
  // A hit here means somebody pasted a link to the site somewhere — the
  // cheapest share-tracking there is.
  { match: "linkedinbot", crawler: { name: "LinkedInBot", vendor: "LinkedIn", kind: "social" } },
  { match: /slackbot|slack-imgproxy/, crawler: { name: "Slackbot", vendor: "Slack", kind: "social" } },
  { match: "whatsapp", crawler: { name: "WhatsApp", vendor: "Meta", kind: "social" } },
  { match: "telegrambot", crawler: { name: "TelegramBot", vendor: "Telegram", kind: "social" } },
  { match: "twitterbot", crawler: { name: "Twitterbot", vendor: "X", kind: "social" } },
  { match: /facebookexternalhit|facebookcatalog/, crawler: { name: "facebookexternalhit", vendor: "Meta", kind: "social" } },
  { match: "discordbot", crawler: { name: "Discordbot", vendor: "Discord", kind: "social" } },

  // ── SEO and audit crawlers ───────────────────────────────────────────────
  { match: /ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|blexbot|seokicks/, crawler: { name: "SEO crawler", kind: "seo" } },
  { match: /screaming frog|lighthouse|pagespeed|gtmetrix/, crawler: { name: "Site auditor", kind: "seo" } },

  // ── Tooling ──────────────────────────────────────────────────────────────
  { match: /headless|puppeteer|playwright|phantom|selenium|webdriver/, crawler: { name: "Headless browser", kind: "tool" } },
  { match: /curl|wget|python-requests|httpx|aiohttp|go-http|node-fetch|axios|okhttp|libwww|java\//, crawler: { name: "Script", kind: "tool" } },
  { match: /pingdom|uptimerobot|statuscake|betteruptime|newrelicpinger/, crawler: { name: "Uptime monitor", kind: "tool" } },
];

/** Anything self-describing as automated that the table above did not name. */
const GENERIC = /bot\b|crawler|crawl|spider|slurp|scraper|scrape|preview|fetcher|monitor|validator/;

/** What this request claims to be, or null if it looks like a real browser. */
export function identifyCrawler(userAgent: string | null): Crawler | null {
  // A page request with no user agent at all is never an ordinary visitor.
  if (!userAgent) return { name: "Unknown (no user agent)", kind: "unknown" };

  const ua = userAgent.toLowerCase();
  for (const { match, crawler } of RULES) {
    if (typeof match === "string" ? ua.includes(match) : match.test(ua)) return crawler;
  }
  if (GENERIC.test(ua)) return { name: "Unidentified crawler", kind: "unknown" };
  return null;
}
