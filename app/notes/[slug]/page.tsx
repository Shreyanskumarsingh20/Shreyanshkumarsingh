import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { NOTES, noteBySlug, noteHref } from "@/lib/notes";
import { projectBySlug, projectHref } from "@/lib/projects";
import { caseStudyBySlug } from "@/lib/case-studies";
import { SITE_URL, PERSON_ID, WEBSITE_ID, OG_BASE } from "@/lib/site";
import { graph, coreNodes, breadcrumbs } from "@/lib/jsonld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return NOTES.map((n) => ({ slug: n.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = noteBySlug(slug);
  if (!n) return {};
  const path = noteHref(slug);
  return {
    title: { absolute: `${n.title} — Shreyansh Kumar Singh` },
    description: n.description,
    keywords: n.keywords,
    alternates: { canonical: path, types: { "text/markdown": `${path}.md` } },
    openGraph: { ...OG_BASE,
      type: "article",
      url: path,
      title: n.title,
      description: n.description,
      publishedTime: n.published,
      modifiedTime: n.updated,
      authors: ["Shreyansh Kumar Singh"],
    },
    twitter: { card: "summary_large_image", title: n.title, description: n.description },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const n = noteBySlug(slug);
  if (!n) notFound();

  const path = noteHref(slug);
  const url = `${SITE_URL}${path}`;
  const proj = n.project ? projectBySlug(n.project) : undefined;
  const source = proj
    ? { label: caseStudyBySlug(proj.slug)?.h1 ?? proj.name, href: projectHref(proj.slug) }
    : n.context;
  const others = NOTES.filter((o) => o.slug !== slug).slice(0, 3);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes" },
    { name: n.title, path },
  ];

  const jsonLd = graph(
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      url,
      headline: n.title,
      description: n.description,
      abstract: n.answer,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      isPartOf: [{ "@id": WEBSITE_ID }, { "@id": `${SITE_URL}/notes#blog` }],
      mainEntityOfPage: url,
      datePublished: n.published,
      dateModified: n.updated,
      keywords: n.keywords.join(", "),
      ...(proj ? { about: { "@id": `${SITE_URL}${projectHref(proj.slug)}#software` } } : {}),
      breadcrumb: breadcrumbs(crumbs),
      // the question this note answers, and its direct answer
      mainEntity: {
        "@type": "Question",
        name: n.question,
        acceptedAnswer: { "@type": "Answer", text: n.answer, author: { "@id": PERSON_ID } },
      },
    },
    ...coreNodes,
  );

  return (
    <PageShell current="/notes" crumbs={crumbs}>
      <JsonLd data={jsonLd} />
      <article>
        <header className="pg-hero shell shell--page">
          <p className="pg-kicker mono rise now">Note</p>
          <h1 className="pg-h1 note-h1 rise now" style={{ animationDelay: "60ms" }}>
            {n.title}
          </h1>
          <div className="cs-tldr rise now" style={{ animationDelay: "120ms" }}>
            <p className="cs-tldr-q">{n.question}</p>
            <p>{n.answer}</p>
          </div>
          <p className="pg-meta">
            By <Link href="/about">Shreyansh Kumar Singh</Link> · Published{" "}
            <time dateTime={n.published}>{n.published}</time>
            {n.updated !== n.published && (
              <>
                {" "}
                · Updated <time dateTime={n.updated}>{n.updated}</time>
              </>
            )}
            {source && (
              <>
                {" "}
                · From <Link href={source.href}>{source.label}</Link>
              </>
            )}
          </p>
        </header>

        <div className="shell shell--page">
          <div className="pg-prose note-body">
            {n.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((t) => <p key={t.slice(0, 40)}>{t}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((t) => (
                      <li key={t.slice(0, 40)}>{t}</li>
                    ))}
                  </ul>
                )}
                {s.code && (
                  <pre className="note-code" data-lenis-prevent>
                    <code>{s.code.text}</code>
                  </pre>
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>MORE NOTES</small>Keep reading
        </h2>
        <div className="pg-cards cs-others">
          {others.map((o) => (
            <Link className="pg-card" href={noteHref(o.slug)} key={o.slug}>
              <h3>{o.title}</h3>
              <p>{o.question}</p>
            </Link>
          ))}
        </div>
        <div className="pg-cta">
          {source && (
            <Link className="btn btn-gold cut-sm" href={source.href}>
              <span>{proj ? "Read the case study →" : "See the production work →"}</span>
            </Link>
          )}
          <Link className="btn btn-ghost" href="/notes">
            All notes
          </Link>
          <Link className="btn btn-ghost" href="/contact">
            Contact Shreyansh
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
