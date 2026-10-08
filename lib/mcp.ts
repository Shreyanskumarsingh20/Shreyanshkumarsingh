// Shared identity for the site's MCP server, its server card and the AI
// catalog — one place, so the three never disagree.

import { SITE_URL, PRODUCTION_URL } from "@/lib/site";

export const MCP_PATH = "/api/mcp";
export const MCP_URL = `${PRODUCTION_URL}${MCP_PATH}`;
export const MCP_SERVER_NAME = "com.shreyanshkumarsingh/portfolio";
export const MCP_SERVER_VERSION = "1.0.0";
export const MCP_TITLE = "Shreyansh Kumar Singh — portfolio";
export const MCP_DESCRIPTION =
  "Read-only access to Shreyansh Kumar Singh's portfolio: profile, nine project case studies, RamanByte experience, skills, FAQ answers and contact details (email). AI & full-stack engineer, Pune, India.";
export const MCP_PROTOCOL_VERSIONS = ["2026-07-28", "2025-11-25", "2025-06-18"];
export const WEBMCP_TOOLS = ["get_profile", "list_projects", "get_contact"];

export function serverCard() {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: MCP_SERVER_NAME,
    title: MCP_TITLE,
    description: MCP_DESCRIPTION,
    version: MCP_SERVER_VERSION,
    websiteUrl: SITE_URL,
    repository: { url: "https://github.com/Shreyanskumarsingh20/Shreyanshkumarsingh", source: "github" },
    remotes: [{ type: "streamable-http", url: MCP_URL, supportedProtocolVersions: MCP_PROTOCOL_VERSIONS }],
    authentication: { required: false },
  };
}

export function aiCatalog() {
  return {
    specVersion: "1.0",
    host: { displayName: "Shreyansh Kumar Singh", identifier: "did:web:www.shreyanshkumarsingh.com" },
    entries: [
      {
        identifier: "urn:air:shreyanshkumarsingh.com:mcp:portfolio",
        displayName: MCP_TITLE,
        description: MCP_DESCRIPTION,
        type: "application/mcp-server-card+json",
        url: `${PRODUCTION_URL}/.well-known/mcp/server-card.json`,
      },
    ],
  };
}
