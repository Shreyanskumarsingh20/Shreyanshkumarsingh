import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/SimpleTopBar";
import ConstellationBackground from "@/components/ConstellationBackground";
import RevealObserver from "@/components/RevealObserver";
import Toast from "@/components/ui/Toast";
import LetsTalkInteractions from "@/components/LetsTalkInteractions";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON, PERSON_ID, WEBSITE_ID, GITHUB_USER } from "@/lib/site";
import { graph, personNode, websiteNode, breadcrumbs } from "@/lib/jsonld";

const DESCRIPTION =
  "Contact Shreyansh Kumar Singh, AI and full-stack engineer in Pune, India — a direct way to start a real conversation about a system that needs to exist, not a form that goes nowhere.";

export const metadata: Metadata = {
  title: "Let's Talk — Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/lets-talk" },
  openGraph: {
    type: "website",
    url: "/lets-talk",
    title: "Let's Talk — Shreyansh Kumar Singh",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Let's Talk — Shreyansh Kumar Singh",
    description: DESCRIPTION,
  },
};

const jsonLd = graph(
  {
    "@type": "ContactPage",
    "@id": `${SITE_URL}/lets-talk#page`,
    url: `${SITE_URL}/lets-talk`,
    name: "Let's Talk — Shreyansh Kumar Singh",
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    breadcrumb: breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Let's Talk", path: "/lets-talk" },
    ]),
  },
  personNode,
  websiteNode,
);

export default function LetsTalkPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ConstellationBackground />
      <SimpleTopBar backHref="/#contact" backLabel="← Back" backLabelTail=" to the portfolio" variant="talk" />

      {/* ============================================================ HERO */}
      <section className="talk-hero">
        <div className="talk-grid" aria-hidden="true"></div>
        <div className="talk-glow" aria-hidden="true"></div>
        <div className="shell shell--talk" style={{ position: "relative" }}>
          <p className="talk-kicker rise now mono">LET&apos;S TALK</p>
          <h1 className="talk-h1 rise now" style={{ animationDelay: "60ms" }}>
            Not a form.
            <br />
            <span className="dim">An actual conversation.</span>
          </h1>
          <p className="talk-thesis rise now" style={{ animationDelay: "120ms" }}>
            If there&apos;s a system that needs to exist and doesn&apos;t yet
            — an idea that&apos;s still mostly chaos, a security posture
            nobody&apos;s actually tested, a pile of documents nobody&apos;s
            turned into something usable — that&apos;s worth an email.
            I&apos;d rather hear the real problem than sit through a call
            about nothing.
          </p>
        </div>
      </section>

      {/* ============================================================ START HERE */}
      <section className="talk-start shell shell--talk">
        <h2 className="rise">Where to start</h2>
        <div className="talk-prompts">
          <div className="talk-prompt rise" style={{ transitionDelay: "60ms" }}>
            <span className="n mono">01</span>
            <div>
              <p>Tell me what&apos;s actually broken.</p>
              <span>Not the feature request — the underlying thing that isn&apos;t working. Specific beats vague, always.</span>
            </div>
          </div>
          <div className="talk-prompt rise" style={{ transitionDelay: "120ms" }}>
            <span className="n mono">02</span>
            <div>
              <p>Tell me what you&apos;ve already tried.</p>
              <span>Saves both of us a conversation about the obvious first move. I&apos;d rather start past it.</span>
            </div>
          </div>
          <div className="talk-prompt rise" style={{ transitionDelay: "180ms" }}>
            <span className="n mono">03</span>
            <div>
              <p>Tell me what &quot;done&quot; looks like.</p>
              <span>Even a rough version. It&apos;s the same question I ask before I write a line of code for myself.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ WHAT THIS IS GOOD FOR */}
      <section className="talk-good shell shell--talk">
        <h2 className="rise">What this is good for</h2>
        <div className="talk-good-grid">
          <div className="talk-good-card rise" style={{ transitionDelay: "60ms" }}>
            <b>Security you actually want tested</b>
            <span>You suspect something&apos;s exposed and want it proven, not assumed — the same discipline behind Nythera&apos;s validated-only findings.</span>
          </div>
          <div className="talk-good-card rise" style={{ transitionDelay: "120ms" }}>
            <b>AI that has to understand, not just search</b>
            <span>A pile of documents or a workflow that needs real context, not a keyword match — the RAG work behind Sarthi and BookVerse AI.</span>
          </div>
          <div className="talk-good-card rise" style={{ transitionDelay: "180ms" }}>
            <b>Something that needs to be walkable</b>
            <span>3D on the web, not a slideshow pretending to be one — the R3F gallery work behind ANTARANG.</span>
          </div>
          <div className="talk-good-card rise" style={{ transitionDelay: "240ms" }}>
            <b>Systems built to survive the second client</b>
            <span>Clean Architecture, not a prototype held together with hope — the enterprise half of the range, behind VaultIQ.</span>
          </div>
          <div className="talk-good-card rise" style={{ transitionDelay: "300ms" }}>
            <b>Bugs verified by evidence, not vibes</b>
            <span>An agent that checks whether something is actually fixed against live application behavior, not a closed ticket — the discipline behind HallogenAI.</span>
          </div>
        </div>
      </section>

      {/* ============================================================ HOW IT WORKS */}
      <section className="talk-how shell shell--talk">
        <h2 className="rise">How this actually works</h2>
        <div className="talk-how-steps">
          <div className="talk-how-step rise" style={{ transitionDelay: "60ms" }}>
            <span className="n mono">01</span>
            <p>
              <b>I write the spec first.</b> What it is, what it looks like,
              where every number came from — before a line of code exists.
              Every repository on this site ships one.
            </p>
          </div>
          <div className="talk-how-step rise" style={{ transitionDelay: "120ms" }}>
            <span className="n mono">02</span>
            <p>
              <b>I build it, then I try to break it.</b> The same scrutiny
              documented in Method — attacked like an outsider, run without
              its safety nets — applies to whatever we build together.
            </p>
          </div>
          <div className="talk-how-step rise" style={{ transitionDelay: "180ms" }}>
            <span className="n mono">03</span>
            <p>
              <b>You get something real.</b> A running thing you can click
              through, or a clear, specific reason it isn&apos;t ready yet —
              never a deck standing in for either.
            </p>
          </div>
        </div>
        <p className="talk-how-link rise" style={{ transitionDelay: "240ms" }}>
          Not just words — see the process in{" "}
          <Link href="/#method">Method</Link>, and see it applied across nine
          real repositories in <Link href="/#range">The Range</Link>.
        </p>
      </section>

      {/* ============================================================ REACH */}
      <section className="talk-reach shell shell--talk">
        <div>
          <h2 className="rise">Email</h2>
          <div className="talk-email rise" id="talkEmail" style={{ transitionDelay: "60ms" }}>
            shreyanshkumarsingh208@gmail.com
          </div>
          <div className="talk-actions rise" style={{ transitionDelay: "120ms" }}>
            <button type="button" className="btn btn-gold cut-sm" id="talkCopy">
              <span>Copy email</span>
            </button>
            <a className="btn btn-ghost" href="mailto:shreyanshkumarsingh208@gmail.com">
              Open in mail app
            </a>
          </div>
        </div>
        <div className="talk-note">
          <h2 className="rise" style={{ transitionDelay: "60ms" }}>
            Elsewhere
          </h2>
          <p className="rise" style={{ transitionDelay: "120ms" }}>
            <b>GitHub —</b>{" "}
            <a href={PERSON.github} target="_blank" rel="noopener">
              {GITHUB_USER}
            </a>
            , every repository referenced on this site, source-visible.
          </p>
          <p className="rise" style={{ transitionDelay: "180ms" }}>
            <b>Response time —</b> I read everything myself. No inbox triage,
            no forwarding.
          </p>
        </div>
      </section>

      {/* ============================================================ SIGNATURE */}
      <section className="talk-sign shell shell--talk">
        <span className="talk-sign-text rise">Shreyansh Kumar Singh</span>
        <p className="talk-sign-meta rise" style={{ transitionDelay: "60ms" }}>
          Engineer — THE RANGE
        </p>
      </section>

      <footer className="simple-footer shell shell--talk">
        <div className="foot-meta">
          <span>LET&apos;S TALK — a direct line, not a contact form</span>
          <span className="mono">v1 · {new Date().getFullYear()}</span>
        </div>
      </footer>

      <Toast />
      <RevealObserver />
      <LetsTalkInteractions />
    </>
  );
}
