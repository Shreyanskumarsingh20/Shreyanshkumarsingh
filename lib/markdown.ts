// Markdown views of every page, for AI agents that send
// `Accept: text/markdown` or request `<path>.md` (see proxy.ts and
// app/md/[[...slug]]/route.ts). Built from the same data modules the HTML
// pages render, so the two can't drift. The phone number is deliberately
// never included — agents get email and the /contact page.

import { SITE_URL, PERSON, SUMMARY, KNOWS_ABOUT, GITHUB_USER, RESUME_PDF } from "@/lib/site";
import { PROJECTS, projectBySlug, projectHref } from "@/lib/projects";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { RESEARCH_CASES } from "@/lib/research";
import { FAQS, FAQ_GROUPS, FAQ_GROUP_LABELS } from "@/lib/faqs";
import { SKILL_GROUPS } from "@/lib/skills";
import { EXPERIENCE_CASES, COMPANY_FACTS, HOW_THE_WORK_RUNS } from "@/lib/experience";
import { ABOUT_SECTIONS, ABOUT_TIMELINE, ABOUT_UPDATED } from "@/lib/about";
import { NOTES, noteBySlug, noteHref } from "@/lib/notes";
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
    title: `${PERSON.name} — AI & Full-Stack Engineer, Pune`,
    description: SUMMARY,
    updated: "2026-10-08",
    body: [
      `# ${PERSON.name} — ${PERSON.jobTitle}`,
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
      "## Projects (THE RANGE) — nine case studies",
      "",
      ...PROJECTS.map((p) => `- [${caseStudyBySlug(p.slug)?.h1 ?? p.name}](${abs(projectHref(p.slug))}) — ${p.line}`),
      "",
      "## Research findings",
      "",
      ...RESEARCH_CASES.flatMap((c) => c.notes.map((n) => `- **${n.title}** (${c.project}): ${n.finding}`)),
    ],
  };
}

function about(): Doc {
  return {
    title: `About ${PERSON.name} — ${PERSON.jobTitle}`,
    description: SUMMARY,
    updated: ABOUT_UPDATED,
    body: [
      `# About ${PERSON.name}`,
      "",
      `${PERSON.name} is an AI & full-stack engineer in ${PERSON.locality}, ${PERSON.countryName}. He pairs nearly four years of production enterprise software at ${PERSON.employer.name} with independent AI work — retrieval-augmented generation, LLM agent systems and autonomous security tooling — and writes down what a system must be before building it, then attacks it as an outsider would.`,
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
      "## Career timeline",
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
      `# Experience — ${PERSON.name}, full-stack at ${PERSON.employer.name}`,
      "",
      `${PERSON.name} has been a full-stack developer at ${PERSON.employer.name}, Pune, since January 2023, owning the whole vertical slice: ASP.NET Web API, SQL Server schema, and the Angular or Flutter client.`,
      "",
      "## About RamanByte, the company",
      "",
      ...COMPANY_FACTS.map((f) => `- **${f.dt}:** ${plain(f.dd)}`),
      "",
      "## How projects run at RamanByte",
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
    title: `Skills — ${PERSON.name}, ${PERSON.jobTitle}`,
    description: "Every skill, linked to where it was used.",
    updated: "2026-10-08",
    body: [
      `# Skills of ${PERSON.name} — ${PERSON.jobTitle}`,
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
    title: `FAQ — ${PERSON.name}, ${PERSON.jobTitle}`,
    description: "Direct answers about his background, work and availability.",
    updated: "2026-10-08",
    body: [
      `# Frequently asked questions about ${PERSON.name}`,
      "",
      ...FAQ_GROUPS.flatMap((g) => [
        `## ${FAQ_GROUP_LABELS[g]}`,
        "",
        ...FAQS.filter((f) => f.group === g).flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
      ]),
    ],
  };
}

function contact(): Doc {
  return {
    title: `Contact ${PERSON.name} — ${PERSON.jobTitle}`,
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
    title: `Privacy Policy — ${PERSON.name}`,
    description: "No cookies or ads; first-party visit logging you can switch off.",
    updated: "2026-10-08",
    body: [
      "# Privacy policy",
      "",
      "This site sets no cookies, shows no ads and has no forms. Everything is self-hosted — the browser makes no third-party requests. It is hosted on Vercel.",
      "",
      "## Visit logging",
      "",
      "Each visit is logged first-party and sent privately to Shreyansh as a Telegram message: IP address and its approximate city, country and network provider (from Vercel and ipwho.is / ipapi.co), browser, OS, screen size, language and time zone, pages viewed, scroll depth, referrer and the buttons clicked. Typed text is never recorded. Requests from crawlers and AI agents are logged from the request itself. There is no database; logs are not sold or shared.",
      "",
      `Opt out in your browser: ${abs("/?notrack=1")} (undo: ${abs("/?notrack=0")}), or use the switch at ${abs("/privacy")}.`,
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
      `# Projects by ${PERSON.name} — AI & full-stack case studies`,
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
      "## The problem it solves",
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

function notes(): Doc {
  return {
    title: `Notes — ${PERSON.name}`,
    description: "Technical answers from his own projects.",
    updated: "2026-10-08",
    body: [`# Technical notes by ${PERSON.name} — AI & full-stack engineering`, "", ...NOTES.flatMap((n) => [`## [${n.question}](${abs(noteHref(n.slug))})`, "", n.answer, ""])],
  };
}

const FENCE = "`".repeat(3);

function note(slug: string): Doc | null {
  const n = noteBySlug(slug);
  if (!n) return null;
  return {
    title: n.title,
    description: n.description,
    updated: n.updated,
    body: [
      `# ${n.title}`,
      "",
      `By ${PERSON.name} · ${n.published}`,
      "",
      `**${n.question}**`,
      "",
      n.answer,
      "",
      ...n.sections.flatMap((s) => [
        `## ${s.h}`,
        "",
        ...(s.p ?? []).flatMap((t) => [t, ""]),
        ...(s.list ? [...s.list.map((t) => `- ${t}`), ""] : []),
        ...(s.code ? [FENCE + s.code.lang, s.code.text, FENCE, ""] : []),
      ]),
    ],
  };
}

function resume(): Doc {
  return {
    title: `Résumé — ${PERSON.name}`,
    description: SUMMARY,
    updated: "2026-10-08",
    body: [
      `# ${PERSON.name} — Résumé`,
      "",
      `${PERSON.jobTitle} · ${PERSON.locality}, ${PERSON.countryName} · ${PERSON.email} · ${PERSON.linkedin}`,
      "",
      `PDF version: ${abs(RESUME_PDF)} (phone number on request via ${abs("/contact")})`,
      "",
      "## Experience",
      "",
      `- **${PERSON.employer.role}, ${PERSON.employer.name}, Pune** — January 2023 – present. Classroom+ LMS (admin, student, faculty apps), PIBM journal portal, Dada Udyogini marketplace apps (with DadaLoad distributed k6 load testing), Vidur Industry Connect. Details: ${abs("/experience")}`,
      "",
      "## Projects",
      "",
      ...PROJECTS.map((p) => `- [${p.name}](${abs(projectHref(p.slug))}) — ${p.line} (${p.stack.join(", ")})`),
      "",
      "## Skills",
      "",
      ...SKILL_GROUPS.map((g) => `- **${g.title}:** ${g.skills.map((s) => s.name).join("; ")}`),
      "",
      "## Education",
      "",
      `- ${PERSON.education.degree}, ${PERSON.education.school}, ${PERSON.education.start}–${PERSON.education.end}`,
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
  else if (clean === "/notes") doc = notes();
  else if (clean.startsWith("/notes/")) doc = note(clean.slice("/notes/".length));
  else if (clean === "/resume") doc = resume();
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
export const MARKDOWN_PATHS = [
  "/", "/about", "/experience", "/skills", "/faq", "/contact", "/privacy", "/resume", "/projects", "/notes",
  ...CASE_STUDIES.map((c) => projectHref(c.slug)),
  ...NOTES.map((n) => noteHref(n.slug)),
];
