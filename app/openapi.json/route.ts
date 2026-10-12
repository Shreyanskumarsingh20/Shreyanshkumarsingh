import { openApiDocument } from "@/lib/openapi";

// The OpenAPI 3.1 description of the JSON API (also at /api/openapi.json).
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(openApiDocument(), null, 2), {
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
