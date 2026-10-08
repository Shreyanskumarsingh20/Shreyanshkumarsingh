import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { SITE_URL, PERSON, SUMMARY, KNOWS_ABOUT } from "@/lib/site";
import { PROJECTS, projectHref } from "@/lib/projects";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { FAQS } from "@/lib/faqs";
import { SKILL_GROUPS } from "@/lib/skills";
import { NOTES, noteHref } from "@/lib/notes";
import { markdownFor, MARKDOWN_PATHS } from "@/lib/markdown";
import { MCP_SERVER_NAME, MCP_SERVER_VERSION, WEBMCP_TOOLS } from "@/lib/mcp";

// A small, read-only, unauthenticated MCP server (Streamable HTTP) over the
// portfolio's public content — nothing here isn't already on the website.
// Tools never return the phone number; contact goes through email and
// /contact. Rate-limited per IP (per instance) to keep it a public courtesy,
// not a load target.

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const abs = (p: string) => `${SITE_URL}${p}`;
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  structuredContent: data as Record<string, unknown>,
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_profile",
      {
        title: "Get profile",
        description:
          "Who Shreyansh Kumar Singh is: one-paragraph summary, role, location, current employer and start date, education, availability, areas of expertise and profile links. Use this first for any question about him.",
        inputSchema: z.object({}),
        annotations: READ_ONLY,
      },
      async () =>
        json({
          name: PERSON.name,
          summary: SUMMARY,
          role: PERSON.jobTitle,
          location: `${PERSON.locality}, ${PERSON.region}, ${PERSON.countryName}`,
          currentWork: { employer: PERSON.employer.name, role: PERSON.employer.role, since: PERSON.employer.startDate },
          education: { degree: PERSON.education.degree, school: PERSON.education.school, years: `${PERSON.education.start}–${PERSON.education.end}` },
          openTo: PERSON.openTo,
          knowsAbout: KNOWS_ABOUT,
          links: { website: SITE_URL, about: abs("/about"), linkedin: PERSON.linkedin, github: PERSON.github, x: PERSON.x },
        }),
    );

    server.registerTool(
      "list_projects",
      {
        title: "List projects",
        description:
          "The nine independent projects (slug, name, domain, one-line description, stack, case-study URL, source URL when public). Pass a slug to get_project for the full case study.",
        inputSchema: z.object({}),
        annotations: READ_ONLY,
      },
      async () =>
        json({
          projects: PROJECTS.map((p) => ({
            slug: p.slug,
            name: p.name,
            domain: p.domain,
            description: p.line,
            stack: p.stack,
            caseStudy: abs(projectHref(p.slug)),
            source: p.url,
            answers: caseStudyBySlug(p.slug)?.question,
          })),
        }),
    );

    server.registerTool(
      "get_project",
      {
        title: "Get project case study",
        description:
          "Full case study for one project as markdown: the problem, what he built, the hardest decision and why, the result, key facts and stack. Slugs come from list_projects.",
        inputSchema: z.object({
          slug: z.enum(CASE_STUDIES.map((c) => c.slug) as [string, ...string[]]).describe("Project slug from list_projects"),
        }),
        annotations: READ_ONLY,
      },
      async ({ slug }) => text(markdownFor(projectHref(slug)) ?? `No project with slug "${slug}".`),
    );

    server.registerTool(
      "get_experience",
      {
        title: "Get professional experience",
        description:
          "His production work at RamanByte Pvt. Ltd. (Pune) since January 2023 as markdown: the Classroom+ platform, PIBM journal portal, Dada Udyogini apps, Vidur Industry Connect, how the work runs, and the stack.",
        inputSchema: z.object({}),
        annotations: READ_ONLY,
      },
      async () => text(markdownFor("/experience") ?? ""),
    );

    server.registerTool(
      "get_skills",
      {
        title: "Get skills",
        description: "Skills grouped by area (applied AI, back end, front end, data, mobile, 3D, security, cloud, languages), each with the project that evidences it.",
        inputSchema: z.object({}),
        annotations: READ_ONLY,
      },
      async () =>
        json({
          groups: SKILL_GROUPS.map((g) => ({
            area: g.title,
            summary: g.summary,
            skills: g.skills.map((s) => ({ name: s.name, detail: s.detail, evidence: s.evidence?.map((e) => ({ label: e.label, url: abs(e.href) })) })),
          })),
          page: abs("/skills"),
        }),
    );

    server.registerTool(
      "search_site",
      {
        title: "Search the portfolio",
        description:
          "Keyword search across FAQ answers, project case studies and technical notes. Returns the best-matching passages with their URLs. Good for questions like 'has he built RAG?' or 'how does Nythera avoid false positives?'.",
        inputSchema: z.object({
          query: z.string().min(2).max(200).describe("Words to look for"),
          limit: z.number().int().min(1).max(10).default(5).describe("Maximum results"),
        }),
        annotations: READ_ONLY,
      },
      async ({ query, limit }) => {
        const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 1);
        const docs = [
          ...FAQS.map((f) => ({ title: f.q, text: f.a, url: abs(`/faq#${f.id}`) })),
          ...CASE_STUDIES.map((c) => ({
            title: c.h1,
            text: [c.tldr, ...c.problem, ...c.built.map((b) => `${b.title}. ${b.body}`), ...c.decision.body, ...c.result].join(" "),
            url: abs(projectHref(c.slug)),
          })),
          ...NOTES.map((n) => ({
            title: n.title,
            text: [n.answer, ...n.sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.list ?? [])])].join(" "),
            url: abs(noteHref(n.slug)),
          })),
        ];
        const scored = docs
          .map((d) => {
            const hay = `${d.title} ${d.text}`.toLowerCase();
            return { ...d, score: terms.reduce((s, t) => s + (hay.split(t).length - 1), 0) };
          })
          .filter((d) => d.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit ?? 5)
          .map(({ title, text: body, url }) => ({ title, excerpt: body.length > 600 ? `${body.slice(0, 600)}…` : body, url }));
        return json({ query, results: scored });
      },
    );

    server.registerTool(
      "get_contact",
      {
        title: "Get contact details",
        description:
          "How to reach Shreyansh Kumar Singh: email address and the contact page (which has call and WhatsApp buttons), plus location and availability. The phone number is intentionally not exposed to automated clients.",
        inputSchema: z.object({}),
        annotations: READ_ONLY,
      },
      async () =>
        json({
          email: PERSON.email,
          contactPage: abs("/contact"),
          phoneAndWhatsApp: `Available on ${abs("/contact")} for human visitors.`,
          location: `${PERSON.locality}, ${PERSON.countryName} (IST, UTC+5:30)`,
          availability: PERSON.openTo,
          linkedin: PERSON.linkedin,
        }),
    );

    // every page's markdown view as a readable resource
    for (const path of MARKDOWN_PATHS) {
      const uri = `${SITE_URL}${path === "/" ? "/index" : path}.md`;
      server.registerResource(
        path === "/" ? "home" : path.slice(1).replace(/\//g, "-"),
        uri,
        { title: path === "/" ? "Home" : path, mimeType: "text/markdown", description: `Markdown view of ${SITE_URL}${path}` },
        async (u) => ({ contents: [{ uri: u.href, mimeType: "text/markdown", text: markdownFor(path) ?? "" }] }),
      );
    }
  },
  {
    serverInfo: { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
    instructions:
      "Read-only portfolio of Shreyansh Kumar Singh, AI & full-stack engineer in Pune, India. Start with get_profile; use list_projects then get_project for case studies; search_site for specific questions. Cite page URLs from results.",
    experimental_webMcp: { tools: WEBMCP_TOOLS },
  },
);

// --- a small per-IP rate limit (fixed window, per serverless instance) ---
const WINDOW_MS = 60_000;
const LIMIT = 60;
const hits = new Map<string, { n: number; reset: number }>();

async function limited(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) hits.set(ip, { n: 1, reset: now + WINDOW_MS });
  else if (++h.n > LIMIT) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(Math.ceil((h.reset - now) / 1000)) },
    });
  }
  if (hits.size > 5000) hits.clear();
  return handler(req);
}

export { limited as GET, limited as POST, limited as DELETE };
