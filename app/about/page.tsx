import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import { PERSON, SITE_URL, PERSON_ID, GITHUB_USER } from "@/lib/site";
import { graph, coreNodes, pageNode, employmentRole, PERSON_IMAGE } from "@/lib/jsonld";
import { ABOUT_TIMELINE, ABOUT_UPDATED } from "@/lib/about";

// The "entity home": the one page that says who Shreyansh Kumar Singh is,
// carries the ProfilePage → Person markup, and is what every external
// profile (LinkedIn, GitHub, X) should link back to.

const UPDATED = ABOUT_UPDATED;
const TITLE = "About Shreyansh Kumar Singh — AI Engineer in Pune, India";
const DESCRIPTION =
  "Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India: RAG pipelines, LLM agents and security tooling, on top of production .NET, SQL Server and Angular work at RamanByte since 2023.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/about", types: { "text/markdown": "/about.md" } },
  openGraph: {
    type: "profile",
    url: "/about",
    title: TITLE,
    description: DESCRIPTION,
    firstName: "Shreyansh",
    lastName: "Kumar Singh",
    images: [{ url: "/images/shreyansh-kumar-singh-desk.jpg", width: 1672, height: 941, alt: "Shreyansh Kumar Singh at his desk" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/shreyansh-kumar-singh-desk.jpg"] },
};

const jsonLd = graph(
  pageNode({
    type: "ProfilePage",
    path: "/about",
    name: TITLE,
    description: DESCRIPTION,
    dateModified: UPDATED,
    crumbs: CRUMBS,
    extra: {
      mainEntity: { "@id": PERSON_ID },
      dateCreated: "2026-10-08",
      primaryImageOfPage: PERSON_IMAGE,
    },
  }),
  ...coreNodes,
  { ...employmentRole, "@id": `${SITE_URL}/about#role`, member: { "@id": PERSON_ID } },
);

const FACTS: [string, React.ReactNode][] = [
  ["Role", "AI & full-stack engineer — applied AI (RAG, LLM agents) on a production full-stack foundation"],
  ["Based in", "Pune, Maharashtra, India"],
  [
    "Current work",
    <>
      Full-Stack Developer at {PERSON.employer.name}, since January 2023 — the Classroom+ learning platform and client
      systems built on it (<Link href="/experience">experience</Link>)
    </>,
  ],
  ["Education", `${PERSON.education.degree}, ${PERSON.education.school}, ${PERSON.education.start}–${PERSON.education.end}`],
  [
    "Independent work",
    <>
      Nine projects across nine domains — RAG, autonomous security testing, AI QA, 3D, physics simulation, editorial,
      enterprise architecture and scroll-driven motion (<Link href="/#range">the range</Link>)
    </>,
  ],
  ["Open to", "Full-time or hybrid roles: applied AI engineering first, then AI-focused full-stack, AI security tooling, and senior .NET / Angular"],
  [
    "Elsewhere",
    <>
      <a href={PERSON.linkedin} rel="me noopener" target="_blank">LinkedIn</a> ·{" "}
      <a href={PERSON.github} rel="me noopener" target="_blank">GitHub ({GITHUB_USER})</a> ·{" "}
      <a href={PERSON.x} rel="me noopener" target="_blank">X ({PERSON.xHandle})</a>
    </>,
  ],
];

const TIMELINE = ABOUT_TIMELINE;

export default function AboutPage() {
  return (
    <PageShell current="/about" crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />

      <section className="pg-hero shell shell--page">
        <div className="pg-split">
          <div>
            <p className="pg-kicker mono rise now">About</p>
            <h1 className="pg-h1 rise now" style={{ animationDelay: "60ms" }}>
              Shreyansh Kumar Singh
              <br />
              <span className="dim">AI &amp; full-stack engineer</span>
            </h1>
            <p className="pg-lede rise now" style={{ animationDelay: "120ms" }}>
              <b>Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India.</b> He pairs nearly four years of
              production enterprise software at RamanByte with a body of independent AI work — retrieval-augmented
              generation, LLM agent systems and autonomous security tooling. His distinguishing habit: he writes down what
              a system must be before he builds it, then attacks it as an outsider would once it exists.
            </p>
            <p className="pg-meta">Last updated {new Date(UPDATED).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <figure className="pg-photo rise now" style={{ animationDelay: "160ms" }}>
            <Image
              src="/images/shreyansh-kumar-singh.jpg"
              alt="Shreyansh Kumar Singh, AI and full-stack engineer, in a cream linen shirt"
              width={941}
              height={941}
              sizes="(max-width: 900px) 90vw, 420px"
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>IN BRIEF</small>Key facts
        </h2>
        <dl className="pg-facts">
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>01</small>Two halves that explain each other
        </h2>
        <div className="pg-prose">
          <p>
            For nearly four years at <b>RamanByte</b> he has built the learning platform <b>Classroom+</b> and client
            systems on top of it. That work runs for real institutions: a peer-reviewed journal portal, admin, student and
            faculty apps, and a two-app artisan marketplace launched on a fixed public date.
          </p>
          <p>
            Alongside it he has built <Link href="/#range">nine independent projects across nine domains</Link>:
            retrieval-augmented generation, autonomous security testing, AI quality assurance, 3D, physics simulation,
            editorial products, enterprise architecture and scroll-driven motion. The production work taught him what fails
            when real users arrive. The independent work is where he applies that lesson to newer problems.
          </p>
        </div>
        <figure className="pg-photo pg-photo--wide rise">
          <Image
            src="/images/shreyansh-kumar-singh-desk.jpg"
            alt="Shreyansh Kumar Singh at his desk in Pune, in an olive shirt, with his workstation behind him"
            width={1672}
            height={941}
            sizes="(max-width: 1040px) 92vw, 960px"
          />
          <figcaption>Shreyansh Kumar Singh — Pune, India</figcaption>
        </figure>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>02</small>How he thinks
        </h2>
        <div className="pg-prose">
          <p>
            <b>He starts with purpose.</b> Before any code, he asks why the thing needs to exist and who is trying to get
            something done with it. A feature without a reason, in his view, is only another button.
          </p>
          <p>
            <b>He treats complexity as a chain to be made legible:</b> interface, API, logic, database, model, and the
            real world it touches. His job is to make that chain feel like one simple experience to the person using it.
          </p>
          <p>
            <b>He assumes failure.</b> What happens if the API dies, if a user taps twice, if traffic jumps a hundredfold
            overnight? For the Dada Udyogini launch this was concrete: he designed DadaLoad, a distributed k6 load-testing
            system run across ten machines, so the team could prove capacity before launch day instead of hoping for it.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>03</small>AI capabilities
        </h2>
        <div className="pg-prose">
          <p>
            He treats AI as infrastructure rather than a feature: the model sits inside the system&apos;s loop from the
            first design, and its output is reviewed like any engineer&apos;s code.
          </p>
          <ul>
            <li>
              <b>Retrieval-augmented generation.</b> In Sarthi, an AI relationship-manager copilot for banking, he split
              the pipeline into four modules — embeddings, vector storage, retrieval and generation — so each can be
              inspected, tested and replaced on its own, and one weak stage can&apos;t hide inside the others.
            </li>
            <li>
              <b>Agent systems.</b> Nythera runs an LLM agent loop through a seven-phase penetration-testing workflow and
              confirms each finding with evidence before reporting it. HallogenAI coordinates eight specialized agents to
              verify bug fixes against live application behavior.
            </li>
            <li>
              <b>Grounded products.</b> BookVerse AI generates summaries, timelines, mind maps and a tutor grounded in the
              source text, across three model paths including local Ollama — and keeps running with no API key.
            </li>
            <li>
              <b>Model fluency.</b> He works with Groq, Gemini and Ollama, chooses between hosted and local models by cost
              and reliability, and designs for the model being unavailable.
            </li>
            <li>
              <b>Responsible design.</b> Dangerous capabilities default to off — Nythera&apos;s internal-network scanning
              needs explicit authorization. Data provenance is enforced — Antarang uses only verified Wikimedia sources and
              refuses to fabricate copyrighted artworks.
            </li>
          </ul>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>04</small>Technical depth
        </h2>
        <div className="pg-cards">
          <div className="pg-card rise">
            <h3>Enterprise full-stack</h3>
            <p>
              Designs ASP.NET Web API endpoints and SQL Server schemas first, gives every response a typed Angular model,
              and builds validated reactive forms on top. Shipped Angular 16–18, ASP.NET Core 8, EF Core, PostgreSQL,
              Redis and SignalR, and Flutter for mobile.
            </p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "60ms" }}>
            <h3>Modern web</h3>
            <p>
              Next.js and React 19 with TypeScript and Tailwind; GSAP, Lenis and Canvas 2D for motion. This portfolio uses
              plain CSS sticky positioning in place of a parallax library — choosing the simplest tool that works.
            </p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "120ms" }}>
            <h3>3D and simulation</h3>
            <p>
              A walkable 3D museum in React Three Fiber and four zero-dependency physics simulators. In the museum,
              throttling a focus check to about ten times a second improved perceived smoothness more than any frame-rate
              tuning.
            </p>
          </div>
          <div className="pg-card rise" style={{ transitionDelay: "180ms" }}>
            <h3>Security</h3>
            <p>
              Works from OWASP Top 10, CWE mapping and the PTES workflow. The standard is strict: a finding without
              physical evidence is discarded, not downgraded.
            </p>
          </div>
        </div>
        <p className="pg-prose" style={{ marginTop: 24 }}>
          The full list, with the project behind each skill, is on the <Link className="pg-link" href="/skills">skills page</Link>.
        </p>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>05</small>Engineering discipline
        </h2>
        <div className="pg-prose">
          <p>
            Almost every repository ships with a project specification and a handoff document, written so a stranger
            could pick the work up cold. Visual design is written as a token system before any component exists. Every
            number in his simulators traces to a published model.
          </p>
          <p>
            After shipping, he audits his own work. His Sarthi audit ranks findings from P0 to P3 and leads with the
            worst: no authentication on any endpoint and guessable record IDs. He published it rather than quietly
            patching it — which says more about his standards than any list of skills.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>06</small>As a colleague
        </h2>
        <div className="pg-prose">
          <p>
            <b>He is direct.</b> He would rather hear the real problem than sit through a meeting about nothing, and he
            asks three questions of every new piece of work: what is actually broken, what has been tried, and what done
            looks like.
          </p>
          <p>
            <b>He is self-critical without being slow.</b> He has shipped nine projects in five languages while still
            writing the specification and the audit for each. Speed, in his view, makes rigor affordable — not optional.
          </p>
          <p>
            <b>He works across roles naturally:</b> specification writer, designer, security reviewer and systems
            architect, often in the same week on the same project — which he sees as the modern engineer&apos;s job
            rather than a collection of side skills.
          </p>
          <p>
            What drew him to engineering is the moment a confusing system becomes legible. It&apos;s why so much of his
            independent work starts from a subject he wanted to understand rather than a brief: Indian art history placed
            properly on the world timeline in Antarang, the physics of blast waves and orbits in The Evolution, the culture
            of collecting in The Collector&apos;s Pulse.
          </p>
        </div>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>07</small>Timeline
        </h2>
        <ol className="pg-timeline">
          {TIMELINE.map((t) => (
            <li key={t.when + t.what} className="rise">
              <span className="when">{t.when}</span>
              <b>{t.what}</b>
              <span className="what">{t.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="pg-section shell shell--page">
        <h2 className="pg-h2 rise">
          <small>08</small>What he&apos;s looking for
        </h2>
        <div className="pg-prose">
          <p>
            Work where AI is load-bearing and correctness matters: document understanding, agent systems, security, and
            products that must survive real users. He is open to <b>full-time or hybrid</b> roles in applied AI
            engineering, AI-focused full-stack engineering, security tooling, and senior .NET and Angular work.
          </p>
        </div>
        <div className="pg-cta">
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact Shreyansh →</span>
          </Link>
          <Link className="btn btn-ghost" href="/experience">
            Experience at RamanByte
          </Link>
          <Link className="btn btn-ghost" href="/#range">
            The nine projects
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
