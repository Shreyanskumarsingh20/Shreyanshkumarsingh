import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { PERSON } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// Keep this page true to what the code does. If analytics or any third-party
// request is added, update it in the same change.

const UPDATED = "2026-10-08";
const TITLE = "Privacy — shreyanshkumarsingh.com";
const DESCRIPTION =
  "How shreyanshkumarsingh.com handles visitor data: no cookies, no tracking, no forms — and what happens when you get in touch.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/privacy", types: { "text/markdown": "/privacy.md" } },
  openGraph: { type: "website", url: "/privacy", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({ path: "/privacy", name: TITLE, description: DESCRIPTION, dateModified: UPDATED, crumbs: CRUMBS }),
  ...coreNodes,
);

export default function PrivacyPage() {
  return (
    <PageShell crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <section className="pg-hero shell shell--page">
        <p className="pg-kicker mono rise now">Privacy</p>
        <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
          Privacy
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>This site sets no cookies, runs no tracking scripts and has no forms.</b> It&apos;s a portfolio — the only
          data it ever receives from you is what your browser sends to load a web page.
        </p>
        <p className="pg-meta">Last updated 8 October 2026</p>
      </section>

      <section className="pg-section shell shell--page">
        <div className="pg-prose">
          <h2 className="pg-h2">What happens when you visit</h2>
          <ul>
            <li>
              <b>Hosting.</b> The site is hosted on Vercel. Like any web host, Vercel processes standard request data
              (IP address, browser, the page requested) to serve the site and protect it from abuse.
            </li>
            <li>
              <b>No cookies, no analytics, no advertising.</b> Nothing here identifies or follows you across visits or
              other websites.
            </li>
            <li>
              <b>One browser setting.</b> The home page remembers, for the current tab only (sessionStorage), that
              you&apos;ve already seen the intro animation, so it plays short the next time. It never leaves your
              browser and is gone when you close the tab.
            </li>
            <li>
              <b>Everything else is self-hosted</b> — fonts, images, videos and the physics simulators load from this
              domain.
            </li>
          </ul>

          <h2 className="pg-h2">When you get in touch</h2>
          <p>
            Email, phone calls and WhatsApp messages go directly to Shreyansh Kumar Singh through those services
            (Gmail, your carrier, WhatsApp). He uses what you send only to reply to you, and doesn&apos;t share it or add
            you to any list.
          </p>

          <h2 className="pg-h2">Questions or removal requests</h2>
          <p>
            Email <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a> or use the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
