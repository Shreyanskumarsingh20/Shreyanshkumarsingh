// Builds /llms.txt (the llmstxt.org summary) and /llms-full.txt (the whole
// site as plain markdown) from the same data the pages render, so what
// answer engines read can't drift from what visitors see.

import { SITE_URL, PERSON, SUMMARY, KNOWS_ABOUT } from "@/lib/site";
import { PROJECTS, projectHref } from "@/lib/projects";
import { caseStudyBySlug } from "@/lib/case-studies";
import { EXPERIENCE_CASES, COMPANY_FACTS, HOW_THE_WORK_RUNS } from "@/lib/experience";
import { FAQS } from "@/lib/faqs";
import { plain } from "@/lib/jsonld";

function title(name: string) {
  return name
    .toLowerCase()
    .replace(/(^|[\s:—-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bVaultiq\b/g, "VaultIQ")
    .replace(/\bHallogenai\b/g, "HallogenAI");
}

export function buildLlmsTxt(full: boolean): string {
  const out: string[] = [];

  out.push(`# ${PERSON.name}`, "", `> ${SUMMARY}`, "");
  out.push(
    "## Key facts",
    "",
    `- Role: ${PERSON.jobTitle}`,
    `- Location: ${PERSON.locality}, ${PERSON.countryName}`,
    `- Current work: full-stack developer at ${PERSON.employer.name} (${PERSON.employer.product}) since January 2023`,
    `- Education: ${PERSON.education.degree}, ${PERSON.education.school}, ${PERSON.education.start}–${PERSON.education.end}`,
    `- Open to: ${PERSON.openTo}`,
    `- LinkedIn: ${PERSON.linkedin}`,
    `- Focus: ${KNOWS_ABOUT.slice(0, 6).join(", ")}`,
    `- GitHub: ${PERSON.github}`,
    `- Email: ${PERSON.email}`,
    "",
  );

  out.push(
    "## Pages",
    "",
    `- [About](${SITE_URL}/about): who Shreyansh Kumar Singh is — profile, key facts, timeline`,
    `- [THE RANGE — portfolio](${SITE_URL}/): nine projects, research notes and method`,
    `- [Projects](${SITE_URL}/projects): nine case studies — problem, build, hardest decision, result`,
    `- [Experience](${SITE_URL}/experience): production .NET, SQL Server, Angular and Flutter work at RamanByte since January 2023`,
    `- [Skills](${SITE_URL}/skills): every skill, linked to where it was used`,
    `- [FAQ](${SITE_URL}/faq): direct answers about his background, work and availability`,
    `- [Contact](${SITE_URL}/contact): email, phone and WhatsApp`,
    full ? "" : `- [Full text](${SITE_URL}/llms-full.txt): every project, case study and FAQ answer in one file`,
    "",
  );

  out.push("## Projects", "");
  for (const p of PROJECTS) {
    const cs = caseStudyBySlug(p.slug);
    const link = p.url ? ` — [source](${p.url})` : "";
    out.push(
      `- **[${title(p.name)}](${SITE_URL}${projectHref(p.slug)})** (${p.domain.toLowerCase()}): ${p.line} Stack: ${p.stack.join(", ")}.${link}`,
    );
    if (cs) out.push(`  - Answers: "${cs.question}" — ${cs.tldr}`);
  }
  out.push("");

  out.push("## Professional experience", "");
  for (const f of COMPANY_FACTS) out.push(`- ${f.dt}: ${f.dd}`);
  out.push("");
  for (const c of EXPERIENCE_CASES) {
    out.push(`### ${plain(c.title)}`, "", `${plain(c.line)}`, "");
    if (full) {
      for (const para of c.aboutHtml) out.push(plain(para), "");
      if (c.built.length) {
        out.push("What was built:", "");
        for (const b of c.built) out.push(`- ${plain(b.title)}: ${plain(b.bodyHtml)}`);
        out.push("");
      }
    }
    out.push(`Stack: ${[...new Set(c.stackGroups.flatMap((g) => g.tags))].join(", ")}`, "");
    out.push(`Details: ${SITE_URL}/experience#${c.id}`, "");
  }

  if (full) {
    out.push("## How the work runs", "");
    for (const b of HOW_THE_WORK_RUNS) out.push(`${b.n}. **${b.title}** — ${plain(b.bodyHtml)}`);
    out.push("");
  }

  out.push("## FAQ", "");
  for (const f of FAQS) {
    out.push(`### ${f.q}`, "", full ? f.a : f.a.split(/(?<=\.)\s/)[0], "");
  }

  return out.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
}
