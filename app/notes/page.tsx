import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { NOTES, noteHref } from "@/lib/notes";
import { SITE_URL, PERSON_ID } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

const UPDATED = "2026-10-08";
const TITLE = "Notes — Shreyansh Kumar Singh on RAG, AI Agents & Security";
const DESCRIPTION =
  "Short technical notes by Shreyansh Kumar Singh, each answering one question from his own projects: RAG pipeline structure, pentest false positives, AI bug-fix verification, R3F jitter, k6 at scale.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: "/notes",
    types: { "text/markdown": "/notes.md", "application/rss+xml": "/notes/rss.xml" },
  },
  openGraph: { type: "website", url: "/notes", title: TITLE, description: DESCRIPTION },
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
          Questions his
          <br />
          <span className="dim">projects answer</span>
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
