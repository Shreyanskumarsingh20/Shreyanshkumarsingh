import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { NOTES, noteHref } from "@/lib/notes";
import { SITE_URL, PERSON_ID, OG_BASE } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

const UPDATED = "2026-10-08";
const TITLE = "Notes — Shreyansh Kumar Singh, AI & Full-Stack Engineer";
const DESCRIPTION =
  "Technical notes by Shreyansh Kumar Singh, AI & full-stack engineer, from his own projects: RAG, pentest false positives, AI bug-fix checks, k6.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["RAG pipeline architecture", "AI pentest false positives", "AI bug fix verification", "React Three Fiber performance", "k6 load testing"],
  alternates: {
    canonical: "/notes",
    types: { "text/markdown": "/notes.md", "application/rss+xml": "/notes/rss.xml" },
  },
  openGraph: { ...OG_BASE, type: "website", url: "/notes", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "CollectionPage",
    path: "/notes",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: {
      mainEntity: {
        "@type": "Blog",
        "@id": `${SITE_URL}/notes#blog`,
        name: "Notes by Shreyansh Kumar Singh",
        author: { "@id": PERSON_ID },
        blogPost: NOTES.map((n) => ({ "@id": `${SITE_URL}${noteHref(n.slug)}#article` })),
      },
    },
  }),
  ...coreNodes,
);

export default function NotesPage() {
  return (
    <PageShell current="/notes" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">Notes</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          Technical notes by Shreyansh Kumar Singh
          <br />
          <span className="dim">AI &amp; full-stack engineering</span>
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>Short technical notes by Shreyansh Kumar Singh</b> — each answers one question first-hand, from a system he
          built. Answer first, then the evidence. Also as an <a className="pg-link" href="/notes/rss.xml">RSS feed</a>.
        </p>
      </section>
      <section className="shell shell--page">
        <ol className="note-list">
          {NOTES.map((n) => (
            <li key={n.slug} className="rise">
              <Link href={noteHref(n.slug)}>
                <span className="note-q">{n.question}</span>
                <span className="note-a">{n.answer.split(/(?<=\.)\s/)[0]}</span>
                <span className="note-meta mono">
                  <time dateTime={n.updated}>{n.updated}</time> · Read the note →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
