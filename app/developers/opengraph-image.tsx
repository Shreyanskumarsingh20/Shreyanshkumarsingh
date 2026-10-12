import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Developer API for the portfolio of Shreyansh Kumar Singh, AI & Full-Stack Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "DEVELOPERS",
    headline: "Developer API.",
    sub: "Read-only JSON API, OpenAPI 3.1 spec and MCP server for Shreyansh Kumar Singh's portfolio. No key needed.",
  });
}
