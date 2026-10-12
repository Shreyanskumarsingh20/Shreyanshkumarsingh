// The public, read-only JSON API (/api/v1/*) — data builders plus the zod
// schemas that describe each response. One source for three consumers:
//
//   app/api/v1/[[...path]]/route.ts   the REST endpoints
//   lib/openapi.ts                    the OpenAPI 3.1 document (schemas via z.toJSONSchema)
//   app/api/mcp/route.ts              the MCP tools
//
// Built from the same data modules the pages render, so the API can't say
// anything the site doesn't. Content rules apply here too: no phone number
// (contact is email + the contact page), and Sarthi is never tied to a bank.

import { z } from "zod";
import { SITE_URL, PERSON, SUMMARY, KNOWS_ABOUT, RESUME_PDF } from "@/lib/site";
import { PROJECTS, projectBySlug, projectHref } from "@/lib/projects";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { FAQS, FAQ_GROUP_LABELS } from "@/lib/faqs";
import { SKILL_GROUPS } from "@/lib/skills";
import { NOTES, noteBySlug, noteHref } from "@/lib/notes";
import { EXPERIENCE_CASES, COMPANY_FACTS, HOW_THE_WORK_RUNS } from "@/lib/experience";
import { RESEARCH_CASES } from "@/lib/research";
import { plain } from "@/lib/jsonld";

export const API_VERSION = "1.0.0";
export const API_BASE = "/api/v1";

const abs = (p: string) => `${SITE_URL}${p}`;
const md = (p: string) => abs(p === "/" ? "/index.md" : `${p}.md`);

// ---------------------------------------------------------------- schemas
const Url = z.string().describe("Absolute URL");
const Link = z.object({ label: z.string(), url: Url });

export const ErrorSchema = z
  .object({
    error: z.object({
      code: z.string().describe("Stable, machine-readable error code, e.g. not_found, bad_request"),
      message: z.string().describe("What went wrong, in plain English"),
      hint: z.string().optional().describe("How to fix the request"),
      docs: Url.describe("Where the API is documented"),
    }),
  })
  .meta({ id: "Error", description: "Every error response — 400, 404, 405, 429, 500 — has this shape." });

export const ProfileSchema = z
  .object({
    name: z.string(),
    summary: z.string().describe("The one-paragraph answer to 'who is Shreyansh Kumar Singh?'"),
    role: z.string(),
    location: z.string(),
    currentWork: z.object({ employer: z.string(), role: z.string(), since: z.string().describe("ISO date") }),
    education: z.object({ degree: z.string(), school: z.string(), years: z.string() }),
    openTo: z.string(),
    knowsAbout: z.array(z.string()),
    links: z.object({ website: Url, about: Url, resume: Url, resumePdf: Url, linkedin: Url, github: Url, x: Url }),
  })
  .meta({ id: "Profile" });

export const ProjectSummarySchema = z
  .object({
    slug: z.string().describe("Use with GET /projects/{slug}"),
    name: z.string(),
    domain: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    caseStudy: Url,
    markdown: Url,
    source: Url.nullable().describe("Public repository, or null when the source isn't public"),
    answers: z.string().nullable().describe("The question this project's case study answers best"),
  })
  .meta({ id: "ProjectSummary" });

export const ProjectListSchema = z.object({ count: z.number().int(), projects: z.array(ProjectSummarySchema) }).meta({ id: "ProjectList" });

export const ProjectSchema = ProjectSummarySchema.extend({
  title: z.string(),
  tldr: z.string().describe("The direct answer, 1–2 sentences"),
  status: z.string(),
  facts: z.array(z.object({ label: z.string(), value: z.string() })),
  problem: z.array(z.string()),
  built: z.array(z.object({ title: z.string(), body: z.string() })),
  hardestDecision: z.object({ title: z.string(), body: z.array(z.string()) }),
  result: z.array(z.string()),
  findings: z.array(z.object({ title: z.string(), finding: z.string() })),
  links: z.array(Link),
  updated: z.string().describe("ISO date the case study last changed"),
}).meta({ id: "Project" });

export const ExperienceSchema = z
  .object({
    employer: z.string(),
    role: z.string(),
    since: z.string(),
    location: z.string(),
    company: z.array(z.object({ label: z.string(), value: z.string() })),
    howTheWorkRuns: z.array(z.object({ step: z.string(), title: z.string(), body: z.string() })),
    caseStudies: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        domain: z.string(),
        summary: z.string(),
        about: z.array(z.string()),
        built: z.array(z.object({ title: z.string(), body: z.string() })),
        stack: z.array(z.string()),
        url: Url,
      }),
    ),
    page: Url,
  })
  .meta({ id: "Experience" });

export const SkillsSchema = z
  .object({
    groups: z.array(
      z.object({
        id: z.string(),
        area: z.string(),
        summary: z.string(),
        skills: z.array(z.object({ name: z.string(), detail: z.string(), evidence: z.array(Link) })),
      }),
    ),
    page: Url,
  })
  .meta({ id: "Skills" });

export const NoteSummarySchema = z
  .object({ slug: z.string(), title: z.string(), question: z.string(), answer: z.string(), url: Url, markdown: Url, published: z.string(), updated: z.string() })
  .meta({ id: "NoteSummary" });

export const NoteListSchema = z.object({ count: z.number().int(), notes: z.array(NoteSummarySchema) }).meta({ id: "NoteList" });

export const NoteSchema = NoteSummarySchema.extend({
  sections: z.array(
    z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
      list: z.array(z.string()),
      code: z.object({ language: z.string(), text: z.string() }).nullable(),
    }),
  ),
}).meta({ id: "Note" });

export const FaqSchema = z
  .object({
    count: z.number().int(),
    groups: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        questions: z.array(z.object({ id: z.string(), question: z.string(), answer: z.string(), url: Url })),
      }),
    ),
  })
  .meta({ id: "Faq" });

export const SearchResultsSchema = z
  .object({
    query: z.string(),
    count: z.number().int(),
    results: z.array(z.object({ type: z.enum(["faq", "project", "note"]), title: z.string(), excerpt: z.string(), url: Url })),
  })
  .meta({ id: "SearchResults" });

export const ContactSchema = z
  .object({
    email: z.string(),
    contactPage: Url,
    phoneAndWhatsApp: z.string().describe("The number is shown to people on the contact page; it is not exposed to automated clients"),
    location: z.string(),
    timezone: z.string(),
    availability: z.string(),
    linkedin: Url,
  })
  .meta({ id: "Contact" });

export const IndexSchema = z
  .object({
    name: z.string(),
    version: z.string(),
    description: z.string(),
    openapi: Url,
    docs: Url,
    endpoints: z.array(z.object({ method: z.literal("GET"), path: z.string(), description: z.string() })),
  })
  .meta({ id: "ApiIndex" });

// ---------------------------------------------------------------- builders
export function profile(): z.infer<typeof ProfileSchema> {
  return {
    name: PERSON.name,
    summary: SUMMARY,
    role: PERSON.jobTitle,
    location: `${PERSON.locality}, ${PERSON.region}, ${PERSON.countryName}`,
    currentWork: { employer: PERSON.employer.name, role: PERSON.employer.role, since: PERSON.employer.startDate },
    education: { degree: PERSON.education.degree, school: PERSON.education.school, years: `${PERSON.education.start}–${PERSON.education.end}` },
    openTo: PERSON.openTo,
    knowsAbout: [...KNOWS_ABOUT],
    links: {
      website: SITE_URL,
      about: abs("/about"),
      resume: abs("/resume"),
      resumePdf: abs(RESUME_PDF),
      linkedin: PERSON.linkedin,
      github: PERSON.github,
      x: PERSON.x,
    },
  };
}

function projectSummary(p: (typeof PROJECTS)[number]): z.infer<typeof ProjectSummarySchema> {
  return {
    slug: p.slug,
    name: p.name,
    domain: p.domain,
    description: p.line,
    stack: p.stack,
    caseStudy: abs(projectHref(p.slug)),
    markdown: md(projectHref(p.slug)),
    source: p.url ?? null,
    answers: caseStudyBySlug(p.slug)?.question ?? null,
  };
}

export function projects(): z.infer<typeof ProjectListSchema> {
  return { count: PROJECTS.length, projects: PROJECTS.map(projectSummary) };
}

export function project(slug: string): z.infer<typeof ProjectSchema> | null {
  const p = projectBySlug(slug);
  const c = caseStudyBySlug(slug);
  if (!p || !c) return null;
  const research = RESEARCH_CASES.find((r) => r.project === p.name);
  return {
    ...projectSummary(p),
    title: c.h1,
    tldr: c.tldr,
    status: c.status,
    facts: c.facts.map(([label, value]) => ({ label, value })),
    problem: c.problem,
    built: c.built,
    hardestDecision: c.decision,
    result: c.result,
    findings: research ? research.notes.map((n) => ({ title: n.title, finding: n.finding })) : [],
    links: (c.links ?? []).map((l) => ({ label: l.label, url: l.href.startsWith("http") ? l.href : abs(l.href) })),
    updated: c.updated,
  };
}

export function experience(): z.infer<typeof ExperienceSchema> {
  return {
    employer: PERSON.employer.name,
    role: PERSON.employer.role,
    since: PERSON.employer.startDate,
    location: `${PERSON.locality}, ${PERSON.countryName}`,
    company: COMPANY_FACTS.map((f) => ({ label: f.dt, value: plain(f.dd) })),
    howTheWorkRuns: HOW_THE_WORK_RUNS.map((b) => ({ step: b.n, title: b.title, body: plain(b.bodyHtml) })),
    caseStudies: EXPERIENCE_CASES.map((c) => ({
      id: c.id,
      title: plain(c.title),
      domain: c.domain,
      summary: plain(c.line),
      about: c.aboutHtml.map(plain),
      built: c.built.map((b) => ({ title: plain(b.title), body: plain(b.bodyHtml) })),
      stack: [...new Set(c.stackGroups.flatMap((g) => g.tags))],
      url: abs(`/experience#${c.id}`),
    })),
    page: abs("/experience"),
  };
}

export function skills(): z.infer<typeof SkillsSchema> {
  return {
    groups: SKILL_GROUPS.map((g) => ({
      id: g.id,
      area: g.title,
      summary: g.summary,
      skills: g.skills.map((s) => ({ name: s.name, detail: s.detail, evidence: (s.evidence ?? []).map((e) => ({ label: e.label, url: abs(e.href) })) })),
    })),
    page: abs("/skills"),
  };
}

function noteSummary(n: (typeof NOTES)[number]): z.infer<typeof NoteSummarySchema> {
  return {
    slug: n.slug,
    title: n.title,
    question: n.question,
    answer: n.answer,
    url: abs(noteHref(n.slug)),
    markdown: md(noteHref(n.slug)),
    published: n.published,
    updated: n.updated,
  };
}

export function notes(): z.infer<typeof NoteListSchema> {
  return { count: NOTES.length, notes: NOTES.map(noteSummary) };
}

export function note(slug: string): z.infer<typeof NoteSchema> | null {
  const n = noteBySlug(slug);
  if (!n) return null;
  return {
    ...noteSummary(n),
    sections: n.sections.map((s) => ({
      heading: s.h,
      paragraphs: s.p ?? [],
      list: s.list ?? [],
      code: s.code ? { language: s.code.lang, text: s.code.text } : null,
    })),
  };
}

export function faq(): z.infer<typeof FaqSchema> {
  const groups = (Object.keys(FAQ_GROUP_LABELS) as (keyof typeof FAQ_GROUP_LABELS)[]).map((g) => ({
    id: g.toLowerCase(),
    title: FAQ_GROUP_LABELS[g],
    questions: FAQS.filter((f) => f.group === g).map((f) => ({ id: f.id, question: f.q, answer: f.a, url: abs(`/faq#${f.id}`) })),
  }));
  return { count: FAQS.length, groups };
}

export function search(query: string, limit = 5): z.infer<typeof SearchResultsSchema> {
  const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 1);
  const docs = [
    ...FAQS.map((f) => ({ type: "faq" as const, title: f.q, text: f.a, url: abs(`/faq#${f.id}`) })),
    ...CASE_STUDIES.map((c) => ({
      type: "project" as const,
      title: c.h1,
      text: [c.tldr, ...c.problem, ...c.built.map((b) => `${b.title}. ${b.body}`), ...c.decision.body, ...c.result].join(" "),
      url: abs(projectHref(c.slug)),
    })),
    ...NOTES.map((n) => ({
      type: "note" as const,
      title: n.title,
      text: [n.answer, ...n.sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.list ?? [])])].join(" "),
      url: abs(noteHref(n.slug)),
    })),
  ];
  const results = docs
    .map((d) => {
      const hay = `${d.title} ${d.text}`.toLowerCase();
      return { ...d, score: terms.reduce((s, t) => s + (hay.split(t).length - 1), 0) };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ type, title, text, url }) => ({ type, title, excerpt: text.length > 600 ? `${text.slice(0, 600)}…` : text, url }));
  return { query, count: results.length, results };
}

export function contact(): z.infer<typeof ContactSchema> {
  return {
    email: PERSON.email,
    contactPage: abs("/contact"),
    phoneAndWhatsApp: `Call and WhatsApp buttons are on ${abs("/contact")} for human visitors.`,
    location: `${PERSON.locality}, ${PERSON.region}, ${PERSON.countryName}`,
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
    availability: PERSON.openTo,
    linkedin: PERSON.linkedin,
  };
}

/** Every endpoint, for the index response, the OpenAPI document and /developers. */
export const ENDPOINTS = [
  { path: "/profile", operationId: "getProfile", summary: "Get his profile", description: "Who Shreyansh Kumar Singh is: summary, role, location, current employer, education, availability, expertise and profile links. Start here.", schema: ProfileSchema },
  { path: "/projects", operationId: "listProjects", summary: "List projects", description: "The nine independent projects with stack, case-study URL and source URL when public.", schema: ProjectListSchema },
  { path: "/projects/{slug}", operationId: "getProject", summary: "Get a project case study", description: "One project's full case study: problem, what he built, the hardest decision, the result, facts, research findings and links.", schema: ProjectSchema },
  { path: "/experience", operationId: "getExperience", summary: "Get professional experience", description: "His production work at RamanByte Pvt. Ltd., Pune, since January 2023: company facts, how the work runs, and six case studies.", schema: ExperienceSchema },
  { path: "/skills", operationId: "getSkills", summary: "Get skills", description: "Skills grouped by area, each linked to the work that evidences it.", schema: SkillsSchema },
  { path: "/notes", operationId: "listNotes", summary: "List technical notes", description: "Short technical articles, each answering one question first-hand from a system he built.", schema: NoteListSchema },
  { path: "/notes/{slug}", operationId: "getNote", summary: "Get a technical note", description: "One note in full: the question, the direct answer, and its sections.", schema: NoteSchema },
  { path: "/faq", operationId: "getFaq", summary: "Get FAQ answers", description: "Every FAQ answer, grouped (about him, his work, hiring and availability).", schema: FaqSchema },
  { path: "/search", operationId: "searchSite", summary: "Search the portfolio", description: "Keyword search across FAQ answers, project case studies and technical notes; returns the best-matching passages with URLs.", schema: SearchResultsSchema },
  { path: "/contact", operationId: "getContact", summary: "Get contact details", description: "Email, contact page, location, time zone and availability. The phone number is intentionally not exposed to automated clients.", schema: ContactSchema },
] as const;

export const PROJECT_SLUGS = CASE_STUDIES.map((c) => c.slug);
export const NOTE_SLUGS = NOTES.map((n) => n.slug);
