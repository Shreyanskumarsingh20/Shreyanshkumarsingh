import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { SKILL_GROUPS } from "@/lib/skills";
import { SITE_URL, PERSON_ID } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

const UPDATED = "2026-10-08";
const TITLE = "Skills — Shreyansh Kumar Singh: RAG, LLM Agents, .NET, Angular";
const DESCRIPTION =
  "Shreyansh Kumar Singh's skills, each linked to where he used it: RAG pipelines and LLM agents, C# and ASP.NET Core, Angular 16–18, Next.js, SQL Server, Flutter, React Three Fiber, security and k6.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Skills", path: "/skills" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/skills" },
  openGraph: { type: "website", url: "/skills", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "CollectionPage",
    path: "/skills",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: {
      mainEntity: {
        "@type": "DefinedTermSet",
        "@id": `${SITE_URL}/skills#set`,
        name: "Skills of Shreyansh Kumar Singh",
        hasDefinedTerm: SKILL_GROUPS.flatMap((g) =>
          g.skills.map((s) => ({ "@type": "DefinedTerm", name: s.name, description: s.detail, inDefinedTermSet: `${SITE_URL}/skills#set` })),
        ),
      },
      about: { "@id": PERSON_ID },
    },
  }),
  ...coreNodes,
);

export default function SkillsPage() {
  return (
    <PageShell current="/skills" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">Skills</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          What Shreyansh
          <br />
          <span className="dim">builds with</span>
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>Shreyansh Kumar Singh works across applied AI and production full-stack engineering</b> — RAG pipelines and
          LLM agents on one side; C#, ASP.NET Core, SQL Server and Angular on the other; Next.js, Flutter and React Three
          Fiber in between. Every skill below links to the project or production work where he used it.
        </p>
        <nav className="pg-cta" aria-label="Skill groups">
          {SKILL_GROUPS.map((g) => (
            <a key={g.id} className="btn btn-ghost" href={`#${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </section>

      <div className="shell shell--page">
        {SKILL_GROUPS.map((g) => (
          <section className="skill-group" id={g.id} key={g.id}>
            <h2 className="rise">
              {g.title}
              <small>{g.summary}</small>
            </h2>
            <ul className="skill-list">
              {g.skills.map((s) => (
                <li key={s.name}>
                  <b>{s.name}</b>
                  <span>
                    {s.detail}
                    {s.evidence && (
                      <>
                        {" "}
                        —{" "}
                        {s.evidence.map((e, i) => (
                          <span key={e.href + e.label} style={{ display: "inline" }}>
                            {i > 0 && ", "}
                            <Link href={e.href}>{e.label}</Link>
                          </span>
                        ))}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className="pg-cta">
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact Shreyansh →</span>
          </Link>
          <Link className="btn btn-ghost" href="/experience">
            Production experience
          </Link>
          <Link className="btn btn-ghost" href="/about">
            About
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
