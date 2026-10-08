import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ConstellationBackground from "@/components/ConstellationBackground";
import RevealObserver from "@/components/RevealObserver";
import CaseStudy from "@/components/experience/CaseStudy";
import {
  EXPERIENCE_CASES,
  COMPANY_FACTS,
  HOW_THE_WORK_RUNS,
  EXP_HERO_STATS,
  EXP_TECH_GROUPS,
} from "@/lib/experience";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, PERSON_ID, WEBSITE_ID } from "@/lib/site";
import { graph, coreNodes, employmentRole, breadcrumbs, plain } from "@/lib/jsonld";

const DESCRIPTION =
  "Shreyansh Kumar Singh has been a full-stack developer at RamanByte, Pune, since January 2023: ASP.NET Web API and SQL Server back ends, Angular and Flutter front ends, shipped to production for real institutions.";

export const metadata: Metadata = {
  title: { absolute: "Experience — Shreyansh Kumar Singh, Full-Stack .NET & Angular at RamanByte" },
  description: DESCRIPTION,
  alternates: { canonical: "/experience", types: { "text/markdown": "/experience.md" } },
  openGraph: {
    type: "profile",
    url: "/experience",
    title: "Experience — Shreyansh Kumar Singh",
    description:
      "At RamanByte since January 2023 — full-stack .NET + Angular, shipped to production. Case studies: PIBM's A Journal of Management, Classroom+, Dada Udyogini, Vidur.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience — Shreyansh Kumar Singh",
    description: DESCRIPTION,
  },
};

const jsonLd = graph(
  {
    "@type": "WebPage",
    "@id": `${SITE_URL}/experience#page`,
    url: `${SITE_URL}/experience`,
    name: "Experience — Shreyansh Kumar Singh",
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    dateModified: "2026-10-08",
    breadcrumb: breadcrumbs([
      { name: "Home", path: "/" },
      { name: "Experience", path: "/experience" },
    ]),
    hasPart: EXPERIENCE_CASES.map((c) => ({
      "@type": "CreativeWork",
      "@id": `${SITE_URL}/experience#${c.id}`,
      name: plain(c.title),
      description: plain(c.line),
      genre: "Case study",
      about: c.domain,
      creator: { "@id": PERSON_ID },
      keywords: c.stackGroups.flatMap((g) => g.tags).join(", "),
      ...(c.sideLink ? { url: c.sideLink.href } : {}),
    })),
  },
  ...coreNodes,
  { ...employmentRole, "@id": `${SITE_URL}/experience#role`, member: { "@id": PERSON_ID } },
);

export default function ExperiencePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ConstellationBackground />
      <SiteHeader current="/experience" />
      <main id="main">

      {/* ============================================================ HERO */}
      <section className="exp-hero">
        <div className="exp-grid" aria-hidden="true"></div>
        <div className="exp-glow" aria-hidden="true"></div>
        <div className="shell shell--exp" style={{ position: "relative" }}>
          <p className="exp-kicker rise now mono">
            <span className="trident">
              <span></span>
              <span></span>
              <span></span>
            </span>{" "}
            EXPERIENCE
          </p>
          <h1 className="exp-h1 rise now" style={{ animationDelay: "60ms" }}>
            <span className="sr-only">Shreyansh Kumar Singh — </span>
            Four years
            <br />
            at <span className="dim">RamanByte.</span>
          </h1>
          <p className="exp-thesis rise now measure" style={{ animationDelay: "120ms" }}>
            I&apos;m a <b>full-stack developer</b> at RamanByte, a Pune ed-tech
            company that builds the <b>Classroom+</b> learning platform. My
            work is the whole vertical slice: <b>ASP.NET Web API and SQL
            Server</b> on the back end, then <b>Angular</b> models,
            data-binding and reactive forms on the front — shipped to
            production for institutions that pay for it, not demos parked on
            a laptop.
          </p>
          <div className="exp-hero-cta rise now" style={{ animationDelay: "180ms" }}>
            <a href="#case" className="btn btn-gold cut-sm">
              <span>See the case studies</span>
            </a>
            <Link href="/#range" className="btn btn-ghost">
              The personal range
            </Link>
          </div>
        </div>

        <div className="exp-stats rise now" style={{ animationDelay: "240ms" }}>
          <div className="shell shell--exp" style={{ paddingInline: 0 }}>
            <div className="row">
              {EXP_HERO_STATS.map((s) => (
                <div className="cell" key={s.k}>
                  <div className="v mono">{s.v}</div>
                  <div className="k">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ THE COMPANY */}
      <section className="exp-co shell shell--exp">
        <h2 className="rise">The company</h2>
        <div className="exp-co-grid">
          <div>
            <p className="exp-co-lead rise">
              RamanByte builds <b>Classroom+</b> — a cloud learning-management
              platform used by schools and institutes across India.
            </p>
            <p className="rise" style={{ transitionDelay: "60ms" }}>
              Client projects are delivered on top of that same platform:
              shared auth, shared storage, shared APIs. So a &quot;new
              site&quot; is rarely greenfield — it&apos;s a new front end and
              a new set of endpoints wired into infrastructure that already
              carries real users.
            </p>
            <p className="rise" style={{ transitionDelay: "120ms" }}>
              My seat is full-stack. I design and write the C# Web API and
              its SQL Server schema, then build the Angular layer that
              consumes it — typed models, services, reactive forms, and the
              slow, unglamorous job of turning a static template into
              something that reads and writes live data.
            </p>
          </div>
          <dl className="exp-co-facts rise" style={{ transitionDelay: "60ms" }}>
            {COMPANY_FACTS.map((f) => (
              <div key={f.dt}>
                <dt>{f.dt}</dt>
                <dd>{f.dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================================================ HOW THE WORK RUNS */}
      <section className="exp-method shell shell--exp">
        <h2 className="rise">How the work runs</h2>
        <div className="beats">
          {HOW_THE_WORK_RUNS.map((b, i) => (
            <div key={b.n} className="beat rise" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="n mono">{b.n}</span>
              <h3>{b.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: b.bodyHtml }} />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ CASE STUDIES */}
      {EXPERIENCE_CASES.map((c) => (
        <CaseStudy key={c.id} c={c} />
      ))}

      {/* ============================================================ ALSO AT RAMANBYTE */}
      <section className="more shell shell--exp">
        <h2 className="rise">Also at RamanByte</h2>
        <p className="more-note rise">
          Six written up. The rest of the four years is still being pulled
          together from backups.
        </p>
        <div className="more-grid" style={{ gridTemplateColumns: "1fr", maxWidth: 420 }}>
          <div className="slot rise">
            <span className="plus">+</span>
            <span className="no mono">07</span>
            <h3>Next case study</h3>
            <p>Another RamanByte build. Drop the repo or the link and this fills in.</p>
            <span className="drop">drop repo → E:\Project-Backups\journal\</span>
          </div>
        </div>
      </section>

      {/* ============================================================ TECH */}
      <section className="tech shell shell--exp">
        <h2 className="rise">The stack, across the four years</h2>
        <div className="tech-grid">
          {EXP_TECH_GROUPS.map((g, i) => (
            <div className="tech-group rise" style={{ transitionDelay: `${i * 60}ms` }} key={g.label}>
              <span className="label">{g.label}</span>
              <div className="tech-tags">
                {g.items.map((item) => (
                  <span className="tech-chip" key={item.name}>
                    <b>{item.mono}</b>
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ SIGNATURE */}
      <section className="exp-sign shell shell--exp">
        <span className="exp-sign-text rise">Shreyansh Kumar Singh</span>
        <p className="exp-sign-meta rise" style={{ transitionDelay: "60ms" }}>
          Full-stack developer — RamanByte
        </p>
        <div className="exp-sign-cta rise" style={{ transitionDelay: "120ms" }}>
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact Shreyansh →</span>
          </Link>
          <Link className="btn btn-ghost" href="/">
            Back to the portfolio
          </Link>
        </div>
      </section>

      </main>
      <SiteFooter />

      <RevealObserver />
    </>
  );
}
