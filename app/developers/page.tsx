import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { API_BASE, API_VERSION, ENDPOINTS, PROJECT_SLUGS } from "@/lib/api";
import { MCP_URL } from "@/lib/mcp";
import { SITE_URL, PERSON_ID, PERSON, OG_BASE } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// The developer portal: how to use the read-only JSON API, the OpenAPI
// spec, the MCP server and the markdown views. Linked from the footer on
// every page (including the home page) and from llms.txt.

const UPDATED = "2026-10-10";
const TITLE = "Developer API — Shreyansh Kumar Singh, AI & Full-Stack Engineer";
const DESCRIPTION =
  "Read-only JSON API, OpenAPI 3.1 spec and MCP server for the portfolio of Shreyansh Kumar Singh, AI & full-stack engineer. No key needed.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Developers", path: "/developers" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Shreyansh Kumar Singh API", "portfolio API", "OpenAPI", "MCP server", "AI & Full-Stack Engineer"],
  alternates: { canonical: "/developers", types: { "text/markdown": "/developers.md", "application/openapi+json": "/openapi.json" } },
  openGraph: { ...OG_BASE, type: "website", url: "/developers", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "TechArticle",
    path: "/developers",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: { about: { "@id": PERSON_ID }, author: { "@id": PERSON_ID } },
  }),
  {
    "@type": "WebAPI",
    "@id": `${SITE_URL}/developers#api`,
    name: "Shreyansh Kumar Singh — portfolio API",
    description: "Read-only JSON API over the portfolio of Shreyansh Kumar Singh, AI & Full-Stack Engineer.",
    documentation: `${SITE_URL}/developers`,
    url: `${SITE_URL}${API_BASE}`,
    termsOfService: `${SITE_URL}/privacy`,
    provider: { "@id": PERSON_ID },
    version: API_VERSION,
  },
  ...coreNodes,
);

const BASE = `${SITE_URL}${API_BASE}`;
const EXAMPLE_SLUG = PROJECT_SLUGS[1] ?? PROJECT_SLUGS[0];

export default function DevelopersPage() {
  return (
    <PageShell current="/developers" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">Developers</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          Developer API
          <br />
          <span className="dim">for Shreyansh Kumar Singh&apos;s portfolio</span>
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>Structured, first-party facts about Shreyansh Kumar Singh, AI &amp; full-stack engineer</b> — his profile,
          nine project case studies, experience, skills, technical notes and FAQ answers — as a read-only JSON API with
          an OpenAPI 3.1 spec, an MCP server for AI agents, and a markdown view of every page. No key, no sign-up.
        </p>
        <div className="pg-cta">
          <a className="btn btn-gold cut-sm" href="/openapi.json">
            <span>OpenAPI spec →</span>
          </a>
          <a className="btn btn-ghost" href={API_BASE}>
            Try {API_BASE}
          </a>
          <Link className="btn btn-ghost" href="/llms.txt">
            llms.txt
          </Link>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">
            <small>01</small>Quick start
          </h2>
          <p>Every endpoint is a plain GET that returns JSON. For example, his profile:</p>
          <pre className="note-code">
            <code>{`curl ${BASE}/profile`}</code>
          </pre>
          <p>One project&apos;s full case study, and a search across the whole portfolio:</p>
          <pre className="note-code">
            <code>{`curl ${BASE}/projects/${EXAMPLE_SLUG}\ncurl "${BASE}/search?q=RAG%20pipeline&limit=3"`}</code>
          </pre>
          <p>
            Every response includes absolute URLs to the matching page on this site — please link or cite those.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>02</small>Endpoints
        </h2>
        <dl className="pg-facts">
          <div>
            <dt>Base URL</dt>
            <dd>
              <code>{BASE}</code>
            </dd>
          </div>
          {ENDPOINTS.map((e) => (
            <div key={e.path}>
              <dt>
                <code>GET {e.path}</code>
              </dt>
              <dd>
                <b>{e.summary}.</b> {e.description}
                {e.path === "/search" && " Parameters: q (required, 2–200 characters), limit (1–10, default 5)."}
                {e.path.includes("{slug}") && ` Slugs come from the list endpoint.`}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">
            <small>03</small>Authentication, limits and errors
          </h2>
          <ul>
            <li>
              <b>Authentication:</b> none. The API is public and read-only — <code>GET</code>, <code>HEAD</code> and{" "}
              <code>OPTIONS</code> only. CORS is open (<code>Access-Control-Allow-Origin: *</code>), so you can call it
              from a browser.
            </li>
            <li>
              <b>Rate limit:</b> 120 requests per minute per IP address. Over that you get <code>429</code> with a{" "}
              <code>Retry-After</code> header.
            </li>
            <li>
              <b>Caching:</b> responses are cacheable for 5 minutes (<code>Cache-Control</code>); the content changes
              only when the site does.
            </li>
            <li>
              <b>Errors</b> are always JSON with the same shape, whatever the status (400, 404, 405, 429, 500):
            </li>
          </ul>
          <pre className="note-code">
            <code>{`{
  "error": {
    "code": "not_found",
    "message": "No project with slug \\"x\\".",
    "hint": "Valid slugs: …",
    "docs": "${SITE_URL}/developers"
  }
}`}</code>
          </pre>
          <p>
            <b>Contact data:</b> the API returns his email and the contact page. The phone number is shown to people on{" "}
            <Link href="/contact">/contact</Link> and is intentionally not available to automated clients.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">
            <small>04</small>OpenAPI and function calling
          </h2>
          <p>
            The full description is at <a href="/openapi.json">/openapi.json</a> (OpenAPI 3.1; also at{" "}
            <code>/api/openapi.json</code>). Every operation has a unique <code>operationId</code>, a description, typed
            parameters and a response schema, so it can be imported into Postman or Insomnia, used to generate a client,
            or handed to an LLM as function-calling tools.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">
            <small>05</small>MCP server for AI agents
          </h2>
          <p>
            The same data is available to AI assistants over the Model Context Protocol (Streamable HTTP, read-only, no
            auth):
          </p>
          <pre className="note-code">
            <code>{MCP_URL}</code>
          </pre>
          <p>
            Tools: <code>get_profile</code>, <code>list_projects</code>, <code>get_project</code>,{" "}
            <code>get_experience</code>, <code>get_skills</code>, <code>search_site</code>, <code>get_contact</code>, plus
            every page as a markdown resource. Discovery:{" "}
            <a href="/.well-known/mcp/server-card.json">/.well-known/mcp/server-card.json</a> and{" "}
            <a href="/.well-known/ai-catalog.json">/.well-known/ai-catalog.json</a>.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">
            <small>06</small>Markdown and plain text
          </h2>
          <ul>
            <li>
              Any page as markdown: request it with <code>Accept: text/markdown</code>, or add <code>.md</code> — for
              example <a href="/about.md">/about.md</a> or <a href="/index.md">/index.md</a>.
            </li>
            <li>
              Summaries for language models: <a href="/llms.txt">/llms.txt</a> and{" "}
              <a href="/llms-full.txt">/llms-full.txt</a>.
            </li>
            <li>
              New notes: <a href="/notes/rss.xml">RSS feed</a>. Every page: <a href="/sitemap.xml">sitemap.xml</a>.
            </li>
          </ul>
          <h2 className="pg-h2">
            <small>07</small>Questions
          </h2>
          <p>
            Something missing or wrong? Email <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a> or use the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
