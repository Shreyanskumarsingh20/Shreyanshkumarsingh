import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { PROJECTS, projectBySlug, projectHref, projectImage } from "@/lib/projects";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { RESEARCH_CASES } from "@/lib/research";
import { NOTES, noteHref } from "@/lib/notes";
import { SITE_URL, PERSON_ID, WEBSITE_ID, OG_BASE } from "@/lib/site";
import { graph, coreNodes, breadcrumbs } from "@/lib/jsonld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  if (!cs) return {};
  const path = projectHref(slug);
  return {
    title: { absolute: cs.title },
    description: cs.description,
    keywords: cs.keywords,
    alternates: { canonical: path, types: { "text/markdown": `${path}.md` } },
    openGraph: { ...OG_BASE, type: "article", url: path, title: cs.title, description: cs.description, modifiedTime: cs.updated },
    twitter: { card: "summary_large_image", title: cs.title, description: cs.description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  const p = projectBySlug(slug);
  if (!cs || !p) notFound();

  const path = projectHref(slug);
  const url = `${SITE_URL}${path}`;
  const img = projectImage(p);
  const research = RESEARCH_CASES.find((r) => r.project === p.name);
  const relatedNotes = NOTES.filter((n) => n.project === slug);
  const idx = PROJECTS.indexOf(p);
  const others = [1, 2, 3].map((k) => PROJECTS[(idx + k) % PROJECTS.length]);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: p.name === p.name.toUpperCase() ? titleCase(p.name) : p.name, path },
  ];
  const repo = cs.links?.find((l) => l.href.includes("github.com"));

  const jsonLd = graph(
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      url,
      headline: cs.h1,
      name: cs.title,
      description: cs.description,
      abstract: cs.tldr,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      isPartOf: { "@id": WEBSITE_ID },
      mainEntityOfPage: url,
      dateModified: cs.updated,
      datePublished: cs.updated,
      keywords: cs.keywords.join(", "),
      ...(img ? { image: `${SITE_URL}${img.src}` } : {}),
      about: { "@id": `${url}#software` },
      breadcrumb: breadcrumbs(crumbs),
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${url}#software`,
      name: titleCase(p.name),
      description: p.line,
      programmingLanguage: p.stack,
      author: { "@id": PERSON_ID },
      creator: { "@id": PERSON_ID },
      ...(repo ? { codeRepository: repo.href } : {}),
      ...(img ? { image: `${SITE_URL}${img.src}` } : {}),
    },
    ...coreNodes,
  );

  return (
    <PageShell current="/projects" crumbs={crumbs}>
      <JsonLd data={jsonLd} />
      <article>
        <header className="pg-hero shell shell--page">
          <p className="pg-kicker mono rise now">
            Case study · {p.domain} · {p.ref}
          </p>
          <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
            {cs.h1}
          </h1>
          <div className="cs-tldr rise now" style={{ animationDelay: "120ms" }}>
            <p className="cs-tldr-q">{cs.question}</p>
            <p>{cs.tldr}</p>
          </div>
          <p className="pg-meta">
            By <Link href="/about">Shreyansh Kumar Singh</Link> · Updated{" "}
            <time dateTime={cs.updated}>
              {new Date(cs.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </time>{" "}
            · {cs.status}
          </p>
          {cs.links && (
            <div className="pg-cta">
              {/* repos and the standalone sims/demo both open in a new tab */}
              {cs.links.map((l, i) => (
                <a key={l.href} className={i === 0 ? "btn btn-gold cut-sm" : "btn btn-ghost"} href={l.href} target="_blank" rel="noopener">
                  <span>{l.label} →</span>
                </a>
              ))}
            </div>
          )}
        </header>

        {img && (
          <figure className="cs-shot shell shell--page rise">
            <div className="pg-photo">
              <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="(max-width: 1040px) 92vw, 960px" />
            </div>
          </figure>
        )}

        <section className="pg-section shell shell--page">
          <dl className="pg-facts">
            {cs.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pg-section shell shell--page">
          <h2 className="pg-h2 rise">
            <small>01</small>The problem it solves
          </h2>
          <div className="pg-prose">
            {cs.problem.map((t) => (
              <p key={t.slice(0, 32)}>{t}</p>
            ))}
          </div>
        </section>

        <section className="pg-section shell shell--page">
          <h2 className="pg-h2 rise">
            <small>02</small>What he built
          </h2>
          <div className="pg-cards">
            {cs.built.map((b, i) => (
              <div className="pg-card rise" key={b.title} style={{ transitionDelay: `${(i % 2) * 60}ms` }}>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pg-section shell shell--page">
          <h2 className="pg-h2 rise">
            <small>03 — THE HARDEST DECISION</small>
            {cs.decision.title}
          </h2>
          <div className="pg-prose">
            {cs.decision.body.map((t) => (
              <p key={t.slice(0, 32)}>{t}</p>
            ))}
          </div>
        </section>

        <section className="pg-section shell shell--page">
          <h2 className="pg-h2 rise">
            <small>04</small>The result
          </h2>
          <div className="pg-prose">
            {cs.result.map((t) => (
              <p key={t.slice(0, 32)}>{t}</p>
            ))}
          </div>
        </section>

        {research && (
          <section className="pg-section shell shell--page">
            <h2 className="pg-h2 rise">
              <small>RESEARCH</small>Research findings from this project
            </h2>
            <div className="pg-cards">
              {research.notes.map((n) => (
                <div className="pg-card rise" key={n.n}>
                  <h3>
                    <span className="mono" style={{ color: "var(--gold)", marginRight: 8 }}>
                      {n.n}
                    </span>
                    {n.title}
                  </h3>
                  <p>{n.finding}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedNotes.length > 0 && (
          <section className="pg-section shell shell--page">
            <h2 className="pg-h2 rise">
              <small>NOTES</small>Questions this project answers
            </h2>
            <ul className="note-list">
              {relatedNotes.map((n) => (
                <li key={n.slug}>
                  <Link href={noteHref(n.slug)}>
                    <span className="note-q">{n.question}</span>
                    <span className="note-a">{n.answer.split(/(?<=\.)\s/)[0]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="pg-section shell shell--page">
          <h2 className="pg-h2 rise">
            <small>STACK</small>Tech stack
          </h2>
          <ul className="cs-stack">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </article>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>MORE OF THE RANGE</small>More projects by Shreyansh Kumar Singh
        </h2>
        <div className="pg-cards cs-others">
          {others.map((o) => (
            <Link className="pg-card" href={projectHref(o.slug)} key={o.slug}>
              <span className="mono" style={{ fontSize: 11, color: "var(--steel)" }}>
                {o.domain}
              </span>
              <h3>{caseStudyBySlug(o.slug)?.h1 ?? o.name}</h3>
              <p>{o.line}</p>
            </Link>
          ))}
        </div>
        <div className="pg-cta">
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Talk to Shreyansh about this →</span>
          </Link>
          <Link className="btn btn-ghost" href="/projects">
            All projects
          </Link>
          <Link className="btn btn-ghost" href="/skills">
            Skills
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/(^|[\s:'’—-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/\bAi\b/g, "AI")
    .replace(/\bVaultiq\b/g, "VaultIQ")
    .replace(/\bHallogenai\b/g, "HallogenAI")
    .replace(/'S\b/g, "'s");
}
