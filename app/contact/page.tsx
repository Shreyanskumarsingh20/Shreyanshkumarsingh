import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import ContactLinks from "@/components/site/ContactLinks";
import JsonLd from "@/components/JsonLd";
import { PERSON, PERSON_ID, GITHUB_USER } from "@/lib/site";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// The one contact page (/lets-talk 308-redirects here). Phone and WhatsApp
// are assembled client-side from lib/contact.ts — see ContactLinks.

const UPDATED = "2026-10-08";
const TITLE = "Contact Shreyansh Kumar Singh — Call, WhatsApp or Email";
const DESCRIPTION =
  "Contact Shreyansh Kumar Singh, AI and full-stack engineer in Pune — call, WhatsApp or email. Open to full-time or hybrid roles.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["contact Shreyansh Kumar Singh", "hire AI engineer Pune", "WhatsApp", "email"],
  alternates: { canonical: "/contact", types: { "text/markdown": "/contact.md" } },
  openGraph: { type: "website", url: "/contact", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({
    type: "ContactPage",
    path: "/contact",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: { mainEntity: { "@id": PERSON_ID } },
  }),
  ...coreNodes,
);

export default function ContactPage() {
  return (
    <PageShell current="/contact" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />

      <section className="pg-hero shell shell--page">
        <div className="pg-split">
          <div>
            <p className="pg-kicker mono rise now">Contact</p>
            <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
              Contact Shreyansh
              <br />
              <span className="dim">An actual conversation.</span>
            </h1>
            <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
              <b>Call, WhatsApp or email Shreyansh Kumar Singh directly</b> — he reads everything himself, no inbox
              triage. Based in Pune, India, and open to <b>full-time or hybrid roles</b> in applied AI and full-stack
              engineering.
            </p>
            <div className="rise now" style={{ animationDelay: "180ms" }}>
              <ContactLinks showNumber />
            </div>
          </div>
          <figure className="pg-photo rise now" style={{ animationDelay: "160ms", maxWidth: 420 }}>
            <Image
              src="/images/shreyansh-kumar-singh-portrait.jpg"
              alt="Portrait of Shreyansh Kumar Singh"
              width={720}
              height={960}
              sizes="(max-width: 900px) 90vw, 420px"
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>WHERE TO START</small>The three questions he asks first
        </h2>
        <div className="talk-prompts">
          <div className="talk-prompt rise">
            <span className="n mono">01</span>
            <div>
              <p>Tell him what&apos;s actually broken.</p>
              <span>Not the feature request — the underlying thing that isn&apos;t working. Specific beats vague, always.</span>
            </div>
          </div>
          <div className="talk-prompt rise" style={{ transitionDelay: "60ms" }}>
            <span className="n mono">02</span>
            <div>
              <p>Tell him what you&apos;ve already tried.</p>
              <span>It saves a conversation about the obvious first move — he&apos;d rather start past it.</span>
            </div>
          </div>
          <div className="talk-prompt rise" style={{ transitionDelay: "120ms" }}>
            <span className="n mono">03</span>
            <div>
              <p>Tell him what &quot;done&quot; looks like.</p>
              <span>Even a rough version. It&apos;s the same question he asks before writing a line of code.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>WHAT THIS IS GOOD FOR</small>Good reasons to get in touch
        </h2>
        <div className="pg-cards">
          <div className="pg-card rise">
            <h3>Hiring for applied AI or full-stack</h3>
            <p>
              Full-time or hybrid roles: applied AI engineering (RAG, LLM agents), full-stack engineering on AI products,
              AI security tooling, or senior .NET and Angular work. See <Link href="/experience">his experience</Link>.
            </p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "60ms" }}>
            <h3>AI that has to understand, not just search</h3>
            <p>A pile of documents or a workflow that needs real context, not a keyword match — the RAG work behind Sarthi and BookVerse AI.</p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "120ms" }}>
            <h3>Security you actually want tested</h3>
            <p>You suspect something&apos;s exposed and want it proven, not assumed — the discipline behind Nythera&apos;s validated-only findings.</p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "180ms" }}>
            <h3>Bugs verified by evidence, not vibes</h3>
            <p>An agent that checks whether something is actually fixed against live application behavior — the approach behind HallogenAI.</p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "240ms" }}>
            <h3>Something that needs to be walkable</h3>
            <p>3D on the web, not a slideshow pretending to be one — the React Three Fiber gallery work behind Antarang.</p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "300ms" }}>
            <h3>Systems built to survive the second client</h3>
            <p>Clean Architecture, not a prototype held together with hope — the enterprise half of the range, behind VaultIQ.</p>
          </div>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>DETAILS</small>Everything in one place
        </h2>
        <dl className="pg-facts">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
            </dd>
          </div>
          <div>
            <dt>Phone &amp; WhatsApp</dt>
            <dd>Use the Call and WhatsApp buttons above — Indian mobile number, +91.</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Pune, Maharashtra, India (IST, UTC+5:30)</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>Open to full-time or hybrid roles</dd>
          </div>
          <div>
            <dt>Profiles</dt>
            <dd>
              <a href={PERSON.linkedin} rel="me noopener" target="_blank">LinkedIn</a> ·{" "}
              <a href={PERSON.github} rel="me noopener" target="_blank">GitHub ({GITHUB_USER})</a> ·{" "}
              <a href={PERSON.x} rel="me noopener" target="_blank">X ({PERSON.xHandle})</a>
            </dd>
          </div>
        </dl>
      </section>
    </PageShell>
  );
}
