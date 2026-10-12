import { API_BASE } from "@/lib/api";
import { apiError, preflight } from "@/lib/api-http";
import { SITE_URL } from "@/lib/site";

// Any /api/* path that isn't a real route gets a JSON 404 — agents can't
// parse an HTML error page. Real routes (/api/v1, /api/mcp, /api/beacon,
// /api/well-known, /api/openapi.json) are more specific and win.

function notFound(_req: Request) {
  void _req; // the path is not echoed back (see app/api/v1 route)
  return apiError(
    404,
    "not_found",
    "No API endpoint at this address.",
    `The JSON API lives under ${SITE_URL}${API_BASE} — see ${SITE_URL}/openapi.json.`,
  );
}

export const GET = notFound;
export const HEAD = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
export const OPTIONS = preflight;
