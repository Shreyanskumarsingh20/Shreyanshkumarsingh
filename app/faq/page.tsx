import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { FAQS, FAQ_GROUPS } from "@/lib/faqs";
import { SITE_URL, PERSON_ID } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// The canonical home of every FAQ answer (the home page shows a teaser that
// links here). Answers sit in native <details> elements, so the full text is
// in the HTML for crawlers and AI agents and works without JavaScript.

const UPDATED = "2026-10-08";
const TITLE = "FAQ — Shreyansh Kumar Singh, AI & Full-Stack Engineer";
const DESCRIPTION =
  "Answers about Shreyansh Kumar Singh: who he is, where he's based, his AI systems (Sarthi, Nythera, HallogenAI), his RamanByte experience, education, tech stack and availability.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: { type: "website", url: "/faq", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "FAQPage",
    path: "/faq",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: {
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        "@id": `${SITE_URL}/faq#${f.id}`,
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a, author: { "@id": PERSON_ID } },
      })),
    },
  }),
  ...coreNodes,
);

export default function FaqPage() {
  return (
    <PageShell current="/faq" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">FAQ</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          Questions about
          <br />
          <span className="dim">Shreyansh Kumar Singh</span>
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          Direct answers for recruiters, founders and collaborators — each one leads with the answer. For anything not
          covered here, <Link className="pg-link" href="/contact">contact him directly</Link>.
        </p>
      </section>

      <section className="shell shell--page">
        {FAQ_GROUPS.map((g) => (
          <div className="faq-page-group" key={g}>
            <h2>{g}</h2>
            {FAQS.filter((f) => f.group === g).map((f) => (
              <details className="faq-d" id={f.id} key={f.id} open={f.id === "who-is-shreyansh-kumar-singh"}>
                <summary>{f.q}</summary>
                <div className="faq-d-a">
                  <p>{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        ))}
        <div className="pg-cta">
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact Shreyansh →</span>
          </Link>
          <Link className="btn btn-ghost" href="/about">
            About
          </Link>
          <Link className="btn btn-ghost" href="/skills">
            Skills
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
