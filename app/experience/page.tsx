import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/SimpleTopBar";
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

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Shreyansh Kumar Singh — four years as a full-stack developer at RamanByte: .NET / SQL Server APIs bound into Angular front-ends, shipped to production for real institutions.",
  openGraph: {
    type: "profile",
    title: "Experience — Shreyansh Kumar Singh",
    description:
      "Four years at RamanByte — full-stack .NET + Angular, shipped to production. Case study: PIBM's A Journal of Management.",
  },
};

export default function ExperiencePage() {
  return (
    <>
      <ConstellationBackground />
      <SimpleTopBar backHref="/" backLabel="← Back to the portfolio" variant="exp" />

      {/* ============================================================ HERO */}
      <section className="exp-hero">
        <div className="exp-grid" aria-hidden="true"></div>
        <div className="exp-glow" aria-hidden="true"></div>
        <div className="shell shell--exp" style={{ position: "relative" }}>
          <p className="exp-kicker rise mono">
            <span className="trident">
              <span></span>
              <span></span>
              <span></span>
            </span>{" "}
            EXPERIENCE
          </p>
          <h1 className="exp-h1 rise" style={{ transitionDelay: "60ms" }}>
            Four years
            <br />
            at <span className="dim">RamanByte.</span>
          </h1>
          <p className="exp-thesis rise measure" style={{ transitionDelay: "120ms" }}>
            I&apos;m a <b>full-stack developer</b> at RamanByte, a Pune ed-tech
            company that builds the <b>Classroom+</b> learning platform. My
            work is the whole vertical slice: <b>ASP.NET Web API and SQL
            Server</b> on the back end, then <b>Angular</b> models,
            data-binding and reactive forms on the front — shipped to
            production for institutions that pay for it, not demos parked on
            a laptop.
          </p>
          <div className="exp-hero-cta rise" style={{ transitionDelay: "180ms" }}>
            <a href="#case" className="btn btn-gold cut-sm">
              <span>See the case studies</span>
            </a>
            <Link href="/#range" className="btn btn-ghost">
              The personal range
            </Link>
          </div>
        </div>

        <div className="exp-stats rise" style={{ transitionDelay: "240ms" }}>
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
          <Link className="btn btn-gold cut-sm" href="/lets-talk">
            <span>Let&apos;s talk →</span>
          </Link>
          <Link className="btn btn-ghost" href="/">
            Back to the portfolio
          </Link>
        </div>
      </section>

      <footer className="simple-footer shell shell--exp">
        <div className="foot-meta">
          <span>EXPERIENCE — four years at RamanByte, told through the work</span>
          <span className="mono">v1 · {new Date().getFullYear()}</span>
        </div>
      </footer>

      <RevealObserver />
    </>
  );
}
