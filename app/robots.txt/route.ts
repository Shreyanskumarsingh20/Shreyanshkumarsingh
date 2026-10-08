import { SITE_URL } from "@/lib/site";

// robots.txt as a route handler (not app/robots.ts) so it can carry the
// explanatory comments below, which Next's MetadataRoute.Robots can't emit.
//
// The goal is to be read and cited, so every crawler is allowed. AI search
// and answer-engine agents are also named explicitly — as documentation of
// intent, and because a named group does NOT inherit the "*" group's rules
// (RFC 9309 / Google's spec): anything disallowed below must be disallowed in
// both groups. Never disallow /_next/ — crawlers need the CSS/JS to render.

const DISALLOW: string[] = []; // no private paths yet; /api/mcp is meant to be reachable

const AGENTS = [
  // OpenAI — training, ChatGPT search, user-initiated fetches
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  // Anthropic — training, Claude search, user-initiated fetches
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Google — Googlebot feeds Search + AI Overviews/AI Mode; Google-Extended
  // governs Gemini training and grounding
  "Googlebot", "Google-Extended", "GoogleOther", "Google-CloudVertexBot",
  // Apple — Applebot feeds Siri/Spotlight/Safari; -Extended is training
  "Applebot", "Applebot-Extended",
  // Microsoft — Copilot answers are grounded on Bing's index
  "bingbot",
  // Meta, Amazon, DuckDuckGo, Mistral, Common Crawl
  "Meta-ExternalAgent", "Meta-WebIndexer", "Meta-ExternalFetcher",
  "Amazonbot", "Amzn-SearchBot", "Amzn-User",
  "DuckAssistBot", "MistralAI-User", "MistralAI-Index", "CCBot",
];

function group(agents: string[]) {
  return [
    ...agents.map((a) => `User-Agent: ${a}`),
    "Allow: /",
    ...DISALLOW.map((p) => `Disallow: ${p}`),
  ].join("\n");
}

export function GET() {
  const body = [
    "# Shreyansh Kumar Singh — www.shreyanshkumarsingh.com",
    "# Search engines, AI assistants and agents are welcome to read and cite this site.",
    "# Plain-text summaries for language models: /llms.txt and /llms-full.txt",
    // No Content-Signal line (Cloudflare's search/ai-input/ai-train
    // proposal): no AI vendor has committed to honouring it, and Lighthouse's
    // robots.txt audit fails it as an unknown directive.
    "",
    group(["*"]),
    "",
    group(AGENTS),
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
