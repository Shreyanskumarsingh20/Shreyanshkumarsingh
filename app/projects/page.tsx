import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { PROJECTS, projectHref, projectImage } from "@/lib/projects";
import { caseStudyBySlug } from "@/lib/case-studies";
import { SITE_URL, PERSON_ID } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

const UPDATED = "2026-10-08";
const TITLE = "Projects — Shreyansh Kumar Singh, AI & Full-Stack Engineer";
const DESCRIPTION =
  "Nine projects by Shreyansh Kumar Singh, AI & full-stack engineer: a RAG banking copilot, an AI pentest agent, multi-agent QA, a 3D museum and more.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Shreyansh Kumar Singh projects", "RAG copilot", "AI pentest agent", "multi-agent QA", "React Three Fiber museum", "case studies"],
  alternates: { canonical: "/projects", types: { "text/markdown": "/projects.md" } },
  openGraph: { type: "website", url: "/projects", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "CollectionPage",
    path: "/projects",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}${projectHref(p.slug)}`,
          name: caseStudyBySlug(p.slug)?.h1 ?? p.name,
        })),
      },
      about: { "@id": PERSON_ID },
    },
  }),
  ...coreNodes,
);

export default function ProjectsPage() {
  return (
    <PageShell current="/projects" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">Projects</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          Projects by Shreyansh Kumar Singh
          <br />
          <span className="dim">AI &amp; full-stack case studies</span>
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>Shreyansh Kumar Singh&apos;s independent work</b>, each written up as a case study: the problem, what he
          built, the hardest decision and why, and the result. For his production work at RamanByte, see{" "}
          <Link className="pg-link" href="/experience">experience</Link>.
        </p>
      </section>

      <section className="shell shell--page">
        <div className="proj-grid">
          {PROJECTS.map((p, i) => {
            const cs = caseStudyBySlug(p.slug);
            const img = projectImage(p);
            return (
              <article className="proj-card rise" key={p.slug} style={{ transitionDelay: `${(i % 2) * 60}ms` }}>
                <Link href={projectHref(p.slug)} className="proj-card-link">
                  <div className="proj-card-img">
                    {img ? (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.w}
                        height={img.h}
                        sizes="(max-width: 720px) 92vw, 480px"
                      />
                    ) : (
                      <div className="proj-card-ph mono" style={{ color: p.accent }}>
                        {p.name}
                      </div>
                    )}
                  </div>
                  <div className="proj-card-body">
                    <span className="proj-card-domain mono" style={{ color: p.accent === "#00674D" ? "#3fbf98" : undefined }}>
                      {p.n} · {p.domain}
                    </span>
                    <h2>{cs?.h1 ?? p.name}</h2>
                    <p>{p.line}</p>
                    <span className="proj-card-more">Read the case study →</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
