// Markdown views of every page, for AI agents that send
// `Accept: text/markdown` or request `<path>.md` (see proxy.ts and
// app/md/[[...slug]]/route.ts). Built from the same data modules the HTML
// pages render, so the two can't drift. The phone number is deliberately
// never included — agents get email and the /contact page.

import { SITE_URL, PERSON, SUMMARY, KNOWS_ABOUT, GITHUB_USER } from "@/lib/site";
import { PROJECTS, projectBySlug, projectHref } from "@/lib/projects";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { RESEARCH_CASES } from "@/lib/research";
import { FAQS, FAQ_GROUPS } from "@/lib/faqs";
import { SKILL_GROUPS } from "@/lib/skills";
import { EXPERIENCE_CASES, COMPANY_FACTS, HOW_THE_WORK_RUNS } from "@/lib/experience";
import { ABOUT_SECTIONS, ABOUT_TIMELINE, ABOUT_UPDATED } from "@/lib/about";
import { plain } from "@/lib/jsonld";

type Doc = { title: string; description: string; updated: string; body: string[] };

function frontmatter(path: string, d: Doc) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return [
    "---",
    `title: ${JSON.stringify(d.title)}`,
    `description: ${JSON.stringify(d.description)}`,
    `url: ${url}`,
    `author: ${PERSON.name}`,
    `updated: ${d.updated}`,
    "---",
    "",
  ];
}

const abs = (path: string) => `${SITE_URL}${path}`;
const footer = [
  "",
  "---",
  "",
  `${PERSON.name} — ${PERSON.jobTitle}, ${PERSON.locality}, ${PERSON.countryName}. Contact: ${PERSON.email} or ${abs("/contact")} (call and WhatsApp buttons). More: ${abs("/llms.txt")} · ${abs("/sitemap.xml")}`,
];

function home(): Doc {
  return {
    title: `${PERSON.name} — Applied AI & Full-Stack Engineer, Pune`,
    description: SUMMARY,
    updated: "2026-10-08",
    body: [
      `# ${PERSON.name}`,
      "",
      `> ${SUMMARY}`,
      "",
      "## Start here",
      "",
      `- [About](${abs("/about")}) — profile, key facts, timeline`,
      `- [Projects](${abs("/projects")}) — nine case studies`,
      `- [Experience](${abs("/experience")}) — RamanByte, since January 2023`,
      `- [Skills](${abs("/skills")}) · [FAQ](${abs("/faq")}) · [Contact](${abs("/contact")})`,
      "",
      "## The range — nine projects",
      "",
      ...PROJECTS.map((p) => `- [${caseStudyBySlug(p.slug)?.h1 ?? p.name}](${abs(projectHref(p.slug))}) — ${p.line}`),
      "",
      "## Research notes",
      "",
      ...RESEARCH_CASES.flatMap((c) => c.notes.map((n) => `- **${n.title}** (${c.project}): ${n.finding}`)),
    ],
  };
}

function about(): Doc {
  return {
    title: `About ${PERSON.name} — AI Engineer in Pune, India`,
    description: SUMMARY,
    updated: ABOUT_UPDATED,
    body: [
      `# About ${PERSON.name}`,
      "",
      `${PERSON.name} is an AI and full-stack engineer in ${PERSON.locality}, ${PERSON.countryName}. He pairs nearly four years of production enterprise software at ${PERSON.employer.name} with independent AI work — retrieval-augmented generation, LLM agent systems and autonomous security tooling — and writes down what a system must be before building it, then attacks it as an outsider would.`,
      "",
      "## Key facts",
      "",
      `- **Role:** ${PERSON.jobTitle}`,
      `- **Based in:** ${PERSON.locality}, ${PERSON.region}, ${PERSON.countryName}`,
      `- **Current work:** ${PERSON.employer.role} at ${PERSON.employer.name} since January 2023 (${PERSON.employer.product})`,
      `- **Education:** ${PERSON.education.degree}, ${PERSON.education.school}, ${PERSON.education.start}–${PERSON.education.end}`,
      `- **Open to:** ${PERSON.openTo}`,
      `- **Knows:** ${KNOWS_ABOUT.join(", ")}`,
      `- **Profiles:** [LinkedIn](${PERSON.linkedin}) · [GitHub (${GITHUB_USER})](${PERSON.github}) · [X (${PERSON.xHandle})](${PERSON.x})`,
      "",
      ...ABOUT_SECTIONS.flatMap((s) => [`## ${s.h}`, "", ...s.p.flatMap((t) => [t, ""])]),
      "## Timeline",
      "",
      ...ABOUT_TIMELINE.map((t) => `- **${t.when} — ${t.what}.** ${t.detail}`),
    ],
  };
}

function experience(): Doc {
  return {
    title: `Experience — ${PERSON.name} at RamanByte`,
    description: `${PERSON.name} has been a full-stack developer at RamanByte, Pune, since January 2023.`,
    updated: "2026-10-08",
    body: [
      `# Experience — ${PERSON.employer.name}`,
      "",
      `${PERSON.name} has been a full-stack developer at ${PERSON.employer.name}, Pune, since January 2023, owning the whole vertical slice: ASP.NET Web API, SQL Server schema, and the Angular or Flutter client.`,
      "",
      "## The company",
      "",
      ...COMPANY_FACTS.map((f) => `- **${f.dt}:** ${plain(f.dd)}`),
      "",
      "## How the work runs",
      "",
      ...HOW_THE_WORK_RUNS.map((b) => `${b.n}. **${b.title}** — ${plain(b.bodyHtml)}`),
      "",
      ...EXPERIENCE_CASES.flatMap((c) => [
        `## ${plain(c.title)}`,
        "",
        plain(c.line),
        "",
        ...c.aboutHtml.flatMap((para) => [plain(para), ""]),
        ...(c.built.length ? ["What was built:", "", ...c.built.map((b) => `- **${plain(b.title)}:** ${plain(b.bodyHtml)}`), ""] : []),
        `Stack: ${[...new Set(c.stackGroups.flatMap((g) => g.tags))].join(", ")}`,
        "",
      ]),
    ],
  };
}

function skills(): Doc {
  return {
    title: `Skills — ${PERSON.name}`,
    description: "Every skill, linked to where it was used.",
    updated: "2026-10-08",
    body: [
      `# Skills — ${PERSON.name}`,
      "",
      ...SKILL_GROUPS.flatMap((g) => [
        `## ${g.title}`,
        "",
        g.summary,
        "",
        ...g.skills.map(
          (s) =>
            `- **${s.name}** — ${s.detail}${s.evidence ? ` Evidence: ${s.evidence.map((e) => `[${e.label}](${abs(e.href)})`).join(", ")}` : ""}`,
        ),
        "",
      ]),
    ],
  };
}

function faq(): Doc {
  return {
    title: `FAQ — ${PERSON.name}`,
    description: "Direct answers about his background, work and availability.",
    updated: "2026-10-08",
    body: [
      `# FAQ — ${PERSON.name}`,
      "",
      ...FAQ_GROUPS.flatMap((g) => [
        `## ${g}`,
        "",
        ...FAQS.filter((f) => f.group === g).flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
      ]),
    ],
  };
}

function contact(): Doc {
  return {
    title: `Contact ${PERSON.name}`,
    description: "Email, phone and WhatsApp.",
    updated: "2026-10-08",
    body: [
      `# Contact ${PERSON.name}`,
      "",
      `- **Email:** ${PERSON.email}`,
      `- **Phone and WhatsApp:** use the Call and WhatsApp buttons at ${abs("/contact")} (Indian mobile number; not published in machine-readable form)`,
      `- **Location:** ${PERSON.locality}, ${PERSON.region}, ${PERSON.countryName} (IST, UTC+5:30)`,
      `- **Availability:** ${PERSON.openTo}`,
      `- **Profiles:** [LinkedIn](${PERSON.linkedin}) · [GitHub](${PERSON.github}) · [X](${PERSON.x})`,
      "",
      "The most useful first message covers three things: what's actually broken, what you've already tried, and what \"done\" looks like.",
    ],
  };
}

function privacy(): Doc {
  return {
    title: "Privacy — shreyanshkumarsingh.com",
    description: "No cookies, no tracking, no forms.",
    updated: "2026-10-08",
    body: [
      "# Privacy",
      "",
      "This site sets no cookies, runs no tracking scripts and has no forms. It is hosted on Vercel, which processes standard request data to serve it. The home page stores one sessionStorage flag (intro animation already seen) and asks GitHub's public API when the public repositories were last updated. Everything else is self-hosted.",
      "",
      `Questions or removal requests: ${PERSON.email}.`,
    ],
  };
}

function projects(): Doc {
  return {
    title: `Projects — ${PERSON.name}`,
    description: "Nine projects, each with a case study.",
    updated: "2026-10-08",
    body: [
      `# Projects — ${PERSON.name}`,
      "",
      ...CASE_STUDIES.flatMap((c) => [`## [${c.h1}](${abs(projectHref(c.slug))})`, "", c.tldr, ""]),
    ],
  };
}

function project(slug: string): Doc | null {
  const c = caseStudyBySlug(slug);
  const p = projectBySlug(slug);
  if (!c || !p) return null;
  const research = RESEARCH_CASES.find((r) => r.project === p.name);
  return {
    title: c.title,
    description: c.description,
    updated: c.updated,
    body: [
      `# ${c.h1}`,
      "",
      `By ${PERSON.name}. ${c.status}`,
      "",
      `**${c.question}**`,
      "",
      c.tldr,
      "",
      ...c.facts.map(([k, v]) => `- **${k}:** ${v}`),
      "",
      "## The problem",
      "",
      ...c.problem.flatMap((t) => [t, ""]),
      "## What he built",
      "",
      ...c.built.flatMap((b) => [`### ${b.title}`, "", b.body, ""]),
      `## The hardest decision: ${c.decision.title}`,
      "",
      ...c.decision.body.flatMap((t) => [t, ""]),
      "## The result",
      "",
      ...c.result.flatMap((t) => [t, ""]),
      ...(research ? ["## Research findings", "", ...research.notes.map((n) => `- **${n.title}:** ${n.finding}`), ""] : []),
      `Stack: ${p.stack.join(", ")}`,
      ...(c.links ? ["", ...c.links.map((l) => `- [${l.label}](${l.href.startsWith("http") ? l.href : abs(l.href)})`)] : []),
    ],
  };
}

/** Markdown for a site path, or null if there's no such page. */
export function markdownFor(path: string): string | null {
  const clean = path.replace(/\/+$/, "") || "/";
  let doc: Doc | null = null;
  if (clean === "/" || clean === "/index") doc = home();
  else if (clean === "/about") doc = about();
  else if (clean === "/experience") doc = experience();
  else if (clean === "/skills") doc = skills();
  else if (clean === "/faq") doc = faq();
  else if (clean === "/contact") doc = contact();
  else if (clean === "/privacy") doc = privacy();
  else if (clean === "/projects") doc = projects();
  else if (clean.startsWith("/projects/")) doc = project(clean.slice("/projects/".length));
  if (!doc) return null;
  return [...frontmatter(clean === "/index" ? "/" : clean, doc), ...doc.body, ...footer, ""].join("\n");
}

export function notFoundMarkdown(path: string): string {
  return [
    "# 404 — page not found",
    "",
    `There is no page at \`${path}\` on ${SITE_URL}.`,
    "",
    `- Site summary for language models: ${abs("/llms.txt")}`,
    `- Full text: ${abs("/llms-full.txt")}`,
    `- Every page: ${abs("/sitemap.xml")}`,
    `- Home: ${abs("/")} · About: ${abs("/about")} · Projects: ${abs("/projects")}`,
    "",
  ].join("\n");
}

/** Every path that has a markdown view (for the sitemap of .md files, tests). */
export const MARKDOWN_PATHS = ["/", "/about", "/experience", "/skills", "/faq", "/contact", "/privacy", "/projects", ...CASE_STUDIES.map((c) => projectHref(c.slug))];
