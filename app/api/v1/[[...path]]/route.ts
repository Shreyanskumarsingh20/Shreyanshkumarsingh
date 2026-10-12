import {
  API_BASE,
  API_VERSION,
  ENDPOINTS,
  NOTE_SLUGS,
  PROJECT_SLUGS,
  contact,
  experience,
  faq,
  note,
  notes,
  profile,
  project,
  projects,
  search,
  skills,
} from "@/lib/api";
import { DOCS_URL, apiError, json, methodNotAllowed, preflight, throttle } from "@/lib/api-http";
import { SITE_URL } from "@/lib/site";

// The public, read-only JSON API — documented by /openapi.json and
// /developers. One router so every endpoint shares the same JSON errors,
// CORS, caching and rate limit (lib/api-http.ts).

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };

// Errors never echo client input: a crafted URL must not put words in the
// site's mouth for an agent reading the response.
function notFound(url: URL) {
  void url;
  return apiError(404, "not_found", "No such endpoint.", `See ${SITE_URL}${API_BASE} for the endpoints, or ${SITE_URL}/openapi.json.`);
}

function route(segments: string[], url: URL): Response {
  const [a, b, ...rest] = segments;
  if (rest.length) return notFound(url);

  if (!a) {
    return json({
      name: "Shreyansh Kumar Singh — portfolio API",
      version: API_VERSION,
      description: "Read-only JSON API over the portfolio of Shreyansh Kumar Singh, AI & Full-Stack Engineer, Pune, India.",
      openapi: `${SITE_URL}/openapi.json`,
      docs: DOCS_URL,
      endpoints: ENDPOINTS.map((e) => ({ method: "GET" as const, path: `${API_BASE}${e.path}`, description: e.summary })),
    });
  }

  if (b === undefined) {
    switch (a) {
      case "profile":
        return json(profile());
      case "projects":
        return json(projects());
      case "experience":
        return json(experience());
      case "skills":
        return json(skills());
      case "notes":
        return json(notes());
      case "faq":
        return json(faq());
      case "contact":
        return json(contact());
      case "search": {
        const q = (url.searchParams.get("q") ?? "").trim();
        if (q.length < 2 || q.length > 200) {
          return apiError(400, "bad_request", "The `q` parameter is required (2–200 characters).", `Try ${SITE_URL}${API_BASE}/search?q=RAG`);
        }
        const rawLimit = url.searchParams.get("limit");
        const limit = rawLimit === null ? 5 : Number(rawLimit);
        if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
          return apiError(400, "bad_request", "`limit` must be an integer from 1 to 10.");
        }
        return json(search(q, limit));
      }
      default:
        return notFound(url);
    }
  }

  if (a === "projects") {
    const p = project(b);
    return p ? json(p) : apiError(404, "not_found", "No project with that slug.", `Valid slugs: ${PROJECT_SLUGS.join(", ")}.`);
  }
  if (a === "notes") {
    const n = note(b);
    return n ? json(n) : apiError(404, "not_found", "No note with that slug.", `Valid slugs: ${NOTE_SLUGS.join(", ")}.`);
  }
  return notFound(url);
}

async function handle(req: Request, ctx: Ctx): Promise<Response> {
  const limited = throttle(req);
  if (limited) return limited;
  try {
    const { path = [] } = await ctx.params;
    return route(path.map((s) => decodeURIComponent(s)), new URL(req.url));
  } catch (err) {
    console.error("[api] unhandled:", err);
    return apiError(500, "internal_error", "Something went wrong on our side.", "Try again; if it persists, use the email on /contact.");
  }
}

export const GET = handle;

export async function HEAD(req: Request, ctx: Ctx) {
  const res = await handle(req, ctx);
  return new Response(null, { status: res.status, headers: res.headers });
}

export const OPTIONS = preflight;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
