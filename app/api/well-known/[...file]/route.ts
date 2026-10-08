import { aiCatalog, serverCard } from "@/lib/mcp";
import { PERSON, PRODUCTION_URL } from "@/lib/site";

// Serves /.well-known/* (rewritten here in next.config.ts) from the same
// constants as the MCP server, so the catalog, the server card and the
// server itself can't disagree.
//
// - ai-catalog.json / ard.json — the AI Catalog (Linux Foundation working
//   group spec v1.0; ARD is its newer name). One entry: the MCP server card.
// - mcp/server-card.json — MCP server card (SEP-2127 proposal).
// - security.txt — RFC 9116.

const CORS = { "Access-Control-Allow-Origin": "*" };
const CACHE = "public, max-age=3600, s-maxage=86400";

function jsonResponse(data: unknown, type: string) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": CACHE, Vary: "Accept", ...CORS },
  });
}

function securityTxt() {
  const expires = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 0, 1)).toISOString();
  return [
    `Contact: mailto:${PERSON.email}`,
    `Contact: ${PRODUCTION_URL}/contact`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${PRODUCTION_URL}/.well-known/security.txt`,
    "",
  ].join("\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string[] }> }) {
  const { file } = await params;
  const path = file.join("/");
  switch (path) {
    case "ai-catalog.json":
    case "ard.json":
      return jsonResponse(aiCatalog(), "application/ai-catalog+json");
    case "mcp/server-card.json":
    case "mcp/server-cards.json":
      return jsonResponse(serverCard(), "application/json");
    case "security.txt":
      return new Response(securityTxt(), {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": CACHE, ...CORS },
      });
    default:
      return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
