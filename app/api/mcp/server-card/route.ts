import { serverCard } from "@/lib/mcp";

// The server card next to the endpoint too (<server>/server-card), the
// other location discovery tools probe besides /.well-known/mcp/.
export function GET() {
  return new Response(JSON.stringify(serverCard(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
