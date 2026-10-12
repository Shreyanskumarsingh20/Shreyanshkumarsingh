// HTTP plumbing shared by the JSON API routes: JSON responses with CORS and
// caching, the one error shape (lib/api.ts ErrorSchema), and a per-IP rate
// limit (per serverless instance — a public courtesy, not a guarantee).

import { rateLimit } from "@/lib/beacon/rate-limit";
import { SITE_URL } from "@/lib/site";

export const DOCS_URL = `${SITE_URL}/developers`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

/** RFC 8631: where the machine- and human-readable descriptions live. */
const LINKS = `<${SITE_URL}/openapi.json>; rel="service-desc"; type="application/openapi+json", <${DOCS_URL}>; rel="service-doc"`;

export function json(data: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  const status = init.status ?? 200;
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status >= 400 ? "no-store" : "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "noindex",
      Link: LINKS,
      ...CORS,
      ...init.headers,
    },
  });
}

export function apiError(status: number, code: string, message: string, hint?: string, headers?: Record<string, string>) {
  return json({ error: { code, message, ...(hint ? { hint } : {}), docs: DOCS_URL } }, { status, headers });
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}

export function methodNotAllowed() {
  return apiError(405, "method_not_allowed", "This API is read-only.", "Use GET (or HEAD / OPTIONS).", {
    Allow: "GET, HEAD, OPTIONS",
  });
}

/** null when the caller may proceed, otherwise the 429 response. */
export function throttle(req: Request): Response | null {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const r = rateLimit(`api:${ip}`, 120, 60_000);
  if (r.allowed) return null;
  return apiError(429, "rate_limited", "Too many requests.", `Wait ${r.retryAfter} seconds and retry.`, {
    "Retry-After": String(r.retryAfter),
  });
}
