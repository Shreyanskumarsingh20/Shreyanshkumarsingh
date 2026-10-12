// The OpenAPI 3.1 document for the read-only JSON API (served at
// /openapi.json and /api/openapi.json). Response schemas are generated from
// the zod schemas in lib/api.ts, so the spec can't drift from the code.

import { z } from "zod";
import { API_BASE, API_VERSION, ENDPOINTS, IndexSchema, NOTE_SLUGS, PROJECT_SLUGS } from "@/lib/api";
import { PERSON, PRODUCTION_URL } from "@/lib/site";

type Json = Record<string, unknown>;

const ref = (id: string) => ({ $ref: `#/components/schemas/${id}` });
const idOf = (schema: z.ZodType) => (z.globalRegistry.get(schema) as { id?: string } | undefined)?.id ?? "Unknown";

/** zod writes ±Number.MAX_SAFE_INTEGER bounds on every .int() — noise in a spec. */
function stripSafeIntBounds(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(stripSafeIntBounds);
  if (!node || typeof node !== "object") return node;
  const out: Json = {};
  for (const [k, v] of Object.entries(node as Json)) {
    if ((k === "minimum" || k === "maximum") && Math.abs(Number(v)) === Number.MAX_SAFE_INTEGER) continue;
    out[k] = stripSafeIntBounds(v);
  }
  return out;
}

function componentSchemas(): Record<string, Json> {
  const { schemas } = z.toJSONSchema(z.globalRegistry, {
    target: "draft-2020-12",
    uri: (id) => `#/components/schemas/${id}`,
  }) as { schemas: Record<string, Json> };
  // the registry also holds MCP input schemas etc.; keep only the API's
  const keep = new Set(["Error", "ApiIndex", ...ENDPOINTS.map((e) => idOf(e.schema)), "ProjectSummary", "NoteSummary"]);
  const out: Record<string, Json> = {};
  for (const [id, s] of Object.entries(schemas)) {
    if (!keep.has(id)) continue;
    const { $schema: _drop, $id: _id, ...rest } = s as Json & { $schema?: string; $id?: string };
    void _drop;
    void _id;
    out[id] = stripSafeIntBounds(rest) as Json;
  }
  return out;
}

const errorResponse = (description: string) => ({
  description,
  content: { "application/json": { schema: ref("Error") } },
});

const COMMON_ERRORS = {
  "405": errorResponse("Method not allowed — the API is read-only (GET, HEAD, OPTIONS)."),
  "429": errorResponse("Rate limited — 120 requests per minute per IP. Retry after the `Retry-After` seconds."),
};

function parametersFor(path: string): Json[] {
  if (path === "/projects/{slug}")
    return [{ name: "slug", in: "path", required: true, description: "Project slug, from GET /projects", schema: { type: "string", enum: PROJECT_SLUGS } }];
  if (path === "/notes/{slug}")
    return [{ name: "slug", in: "path", required: true, description: "Note slug, from GET /notes", schema: { type: "string", enum: NOTE_SLUGS } }];
  if (path === "/search")
    return [
      { name: "q", in: "query", required: true, description: "Words to look for (2–200 characters)", schema: { type: "string", minLength: 2, maxLength: 200 }, example: "RAG pipeline" },
      { name: "limit", in: "query", required: false, description: "Maximum results (1–10)", schema: { type: "integer", minimum: 1, maximum: 10, default: 5 } },
    ];
  return [];
}

export function openApiDocument(): Json {
  const paths: Record<string, Json> = {
    "/": {
      get: {
        operationId: "getApiIndex",
        summary: "List the endpoints",
        description: "The API's name, version, documentation links and every endpoint.",
        tags: ["Meta"],
        responses: {
          "200": { description: "The endpoint list", content: { "application/json": { schema: ref(idOf(IndexSchema)) } } },
          ...COMMON_ERRORS,
        },
      },
    },
  };
  for (const e of ENDPOINTS) {
    const hasSlug = e.path.includes("{");
    const hasQuery = e.path === "/search";
    paths[e.path] = {
      get: {
        operationId: e.operationId,
        summary: e.summary,
        description: e.description,
        tags: [e.path.split("/")[1].replace(/^./, (c) => c.toUpperCase())],
        parameters: parametersFor(e.path),
        responses: {
          "200": { description: e.summary, content: { "application/json": { schema: ref(idOf(e.schema)) } } },
          ...(hasSlug || hasQuery ? { "400": errorResponse("Invalid or missing parameter.") } : {}),
          ...(hasSlug ? { "404": errorResponse("No item with that slug.") } : {}),
          ...COMMON_ERRORS,
        },
      },
    };
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "Shreyansh Kumar Singh — portfolio API",
      version: API_VERSION,
      summary: "Read-only JSON API over the portfolio of Shreyansh Kumar Singh, AI & Full-Stack Engineer, Pune, India.",
      description:
        "Structured, first-party facts about Shreyansh Kumar Singh: profile, nine project case studies, professional experience at RamanByte, skills, technical notes, FAQ answers and contact details. No authentication, CORS open, read-only. Every response carries absolute URLs to the matching page — please cite those. The phone number is intentionally not exposed; use the email or the contact page. The same data is available over MCP at /api/mcp and as markdown (Accept: text/markdown).",
      contact: { name: PERSON.name, email: PERSON.email, url: `${PRODUCTION_URL}/contact` },
      license: { name: "All rights reserved — free to read and cite with a link to the source page", url: `${PRODUCTION_URL}/developers` },
      termsOfService: `${PRODUCTION_URL}/privacy`,
    },
    externalDocs: { description: "Developer documentation", url: `${PRODUCTION_URL}/developers` },
    servers: [{ url: `${PRODUCTION_URL}${API_BASE}`, description: "Production" }],
    tags: [
      { name: "Meta", description: "About the API itself" },
      { name: "Profile", description: "Who he is" },
      { name: "Projects", description: "The nine independent projects" },
      { name: "Experience", description: "Production work at RamanByte" },
      { name: "Skills", description: "Skills with evidence" },
      { name: "Notes", description: "Technical notes" },
      { name: "Faq", description: "Direct answers" },
      { name: "Search", description: "Full-text search" },
      { name: "Contact", description: "How to reach him" },
    ],
    paths,
    components: { schemas: componentSchemas() },
    security: [],
  };
}

