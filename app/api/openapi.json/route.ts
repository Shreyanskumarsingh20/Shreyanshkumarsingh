import { openApiDocument } from "@/lib/openapi";

// Same document as /openapi.json, at the path agents also probe.
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
