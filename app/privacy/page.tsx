import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { PERSON, OG_BASE } from "@/lib/site";
import TrackingOptOut from "@/components/beacon/TrackingOptOut";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// Keep this page true to what the code does. If analytics or any third-party
// request is added, update it in the same change.

const UPDATED = "2026-10-08";
const TITLE = "Privacy Policy — Shreyansh Kumar Singh";
const DESCRIPTION =
  "How Shreyansh Kumar Singh's site handles visitor data: no cookies or ads, first-party visit logging you can switch off, and what happens when you write.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/privacy", types: { "text/markdown": "/privacy.md" } },
  openGraph: { ...OG_BASE, type: "website", url: "/privacy", title: TITLE, description: DESCRIPTION },
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
          Privacy policy
        </h1>
        <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
          <b>This site sets no cookies, shows no ads and has no forms.</b> It does keep a first-party log of visits —
          which pages were read and which contact buttons were used — sent privately to Shreyansh. You can switch it
          off below.
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
              <b>No cookies, no advertising, no third-party analytics.</b> Nothing here follows you to other websites,
              and nothing is shared with an ad network.
            </li>
            <li>
              <b>Browser storage.</b> The home page remembers, for the current tab (sessionStorage), that you&apos;ve
              seen the intro animation. The visit log below keeps the current visit in sessionStorage and a visit
              counter in localStorage, so a return visit can be recognised as one.
            </li>
            <li>
              <b>Everything is self-hosted</b> — fonts, images, videos and the physics simulators load from this
              domain. Your browser makes no third-party requests.
            </li>
          </ul>

          <h2 className="pg-h2">Visit logging</h2>
          <p>
            When you load a page, the site records the visit and sends it as a private message to Shreyansh through a
            Telegram bot. It is first-party: it goes to him only. A visit log contains:
          </p>
          <ul>
            <li>
              <b>Network:</b> your IP address, the approximate city and country it resolves to, and your internet
              provider. Location comes from the IP address (via Vercel, and a lookup at ipwho.is or ipapi.co) and is
              city-level at best — the site never asks for your device&apos;s location.
            </li>
            <li>
              <b>Browser:</b> browser and operating system, screen and window size, language and time zone.
            </li>
            <li>
              <b>The visit:</b> the pages viewed and for how long, how far you scrolled, the referring page, and the
              buttons and links you clicked (for example Call, WhatsApp, Email or the résumé download). Text you type is
              never recorded.
            </li>
            <li>
              <b>Automated traffic:</b> requests from search engines, AI crawlers and scripts are logged from the request
              itself (user agent, page, IP), so he can see when answer engines read the site.
            </li>
          </ul>
          <p>
            The logs exist only as Telegram messages — there is no database — and are used to understand who reads the
            site and to reply faster to people who reach out. They are not sold or shared.
          </p>
          <TrackingOptOut />

          <h2 className="pg-h2">When you get in touch</h2>
          <p>
            Email, phone calls and WhatsApp messages go directly to Shreyansh Kumar Singh through those services
            (Gmail, your carrier, WhatsApp). He uses what you send only to reply to you, and doesn&apos;t share it or add
            you to any list.
          </p>

          <h2 className="pg-h2">Services involved</h2>
          <ul>
            <li><b>Vercel</b> — hosting; supplies the approximate location of your IP address.</li>
            <li><b>ipwho.is / ipapi.co</b> — resolve an IP address to an approximate location and network provider.</li>
            <li><b>Telegram</b> — delivers the visit messages to Shreyansh.</li>
          </ul>

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
