import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import JsonLd from "@/components/JsonLd";
import PrintButton from "@/components/site/PrintButton";
import { PERSON, PERSON_ID, GITHUB_USER, SITE_URL } from "@/lib/site";
import { PROJECTS, projectHref } from "@/lib/projects";
import { graph, coreNodes, pageNode } from "@/lib/jsonld";

// HTML résumé — the same document on screen and in print (Print → Save as
// PDF). Facts: the client's résumé and brief, restricted to what's been
// confirmed (RamanByte only; Sarthi without the bank's name; no phone here —
// it's on /contact). Swap in the PDF download once the corrected file lands.

const UPDATED = "2026-10-08";
const TITLE = "Résumé — Shreyansh Kumar Singh, AI & Full-Stack Engineer";
const DESCRIPTION =
  "Résumé of Shreyansh Kumar Singh, AI and full-stack engineer in Pune: RamanByte since January 2023 (ASP.NET Core, Angular, Flutter, SQL Server), RAG and LLM-agent projects, B.Tech Computer Science.";
const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Résumé", path: "/resume" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/resume", types: { "text/markdown": "/resume.md" } },
  openGraph: { type: "profile", url: "/resume", title: TITLE, description: DESCRIPTION },
};

const jsonLd = graph(
  pageNode({ path: "/resume", name: TITLE, description: DESCRIPTION, dateModified: UPDATED, crumbs: CRUMBS, extra: { mainEntity: { "@id": PERSON_ID } } }),
  ...coreNodes,
);

const SKILLS: [string, string][] = [
  ["Languages", "C#, TypeScript, JavaScript, Python, Dart, SQL, HTML, CSS/SCSS"],
  ["Back end", "ASP.NET Core 8, ASP.NET Web API, REST APIs, Entity Framework Core, Clean Architecture, SignalR, FastAPI, Pydantic, SQLAlchemy"],
  ["Front end", "Angular 16–18 (RxJS, Signals, Reactive Forms, Angular Material), React 19, Next.js, Tailwind CSS, Bootstrap 5"],
  ["Mobile", "Flutter, Dart, flutter_bloc, go_router, Firebase SDK, Google Maps SDK"],
  ["Databases", "SQL Server, PostgreSQL, Redis, Supabase, Neon, Prisma, Drizzle"],
  ["AI / ML", "RAG pipelines, embeddings and vector retrieval, LLM agent loops, Groq, Gemini, Ollama, OCR (Tesseract)"],
  ["Cloud & DevOps", "Microsoft Azure (App Service, Static Web Apps), AWS S3, Firebase / Google Cloud, GitHub Actions, Docker, Git, k6"],
  ["Security & QA", "OWASP Top 10, CWE mapping, PTES workflow, auth hardening, rate limiting, Playwright"],
  ["Other", "Three.js, React Three Fiber, GSAP, Canvas 2D, Excel / PDF export, i18n"],
];

const ROLES: { title: string; bullets: string[] }[] = [
  {
    title: "Vidur Industry Connect — multi-tenant engagement platform (Flutter, ASP.NET Core, SQL Server, Redis, Azure)",
    bullets: [
      "Built the tenant admin dashboard from scratch with status and type analytics and custom date-range filters; 38 commits across 9 merged PRs in 3-week sprints.",
      "Delivered the citizen engagement lifecycle — search, filter, rating, cancel/reopen with reason — and a near-duplicate guard flagging requests ~85% similar to one raised in the past week.",
      "Built the citizen profile suite; fixed analyzer errors that were blocking the GitHub Actions staging deploy gate.",
    ],
  },
  {
    title: "Dada Udyogini — seller & buyer marketplace apps (Flutter, ASP.NET Core, PostgreSQL, Azure, Firebase)",
    bullets: [
      "Integrated SMS/OTP messaging and logistics vendors into signup, order and fulfilment flows, including rate calculation, shipment creation and live tracking.",
      "Designed DadaLoad, a distributed load-testing platform: a .NET Worker Service running k6 across 10 Windows machines, orchestrated via ASP.NET Core and SignalR, with PDF/XLSX/JSON reports.",
      "Right-sized Azure resources against real traffic; both apps launched together on a fixed public date.",
    ],
  },
  {
    title: "Classroom+ LMS — admin, faculty & student portals (Angular, ASP.NET Web API, SQL Server)",
    bullets: [
      "Admin console: timetable planning with copy mode and Excel export, faculty availability, program/batch/subject masters with bulk import, 6-language i18n.",
      "Student app (student.classroomplus.in): attendance and assessment dashboards, a 7-step placement-profile wizard, a job board and a 9-stage recruitment pipeline.",
      "Faculty app (faculty.classroomplus.in): workload calendar, assessment authoring and grading, late-submission approvals, attendance and mentorship.",
    ],
  },
  {
    title: "A Journal of Management — PIBM journal portal (Angular 16, ASP.NET Web API, SQL Server, AWS S3)",
    bullets: [
      "Converted a static template into a live, API-driven portal for a double-blind peer-reviewed journal (ISSN 2455-8796): 11 public routes, 3 roles (author, reviewer, editor), 93 commits.",
      "Built email-verified author onboarding, manuscript submission and revision flows, the reviewer workflow, and AWS S3 document uploads.",
    ],
  },
];

export default function ResumePage() {
  return (
    <PageShell crumbs={CRUMBS}>
      <JsonLd data={jsonLd} />
      <div className="resume shell shell--page">
        <header className="resume-head">
          <h1>{PERSON.name}</h1>
          <p className="resume-role">Full-Stack &amp; AI Engineer · ASP.NET Core · Angular · Flutter · SQL Server · LLM / RAG</p>
          <p className="resume-contact">
            {PERSON.locality}, {PERSON.region}, India · <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a> ·{" "}
            <a href={PERSON.linkedin}>LinkedIn</a> · <a href={PERSON.github}>GitHub ({GITHUB_USER})</a> ·{" "}
            <a href={SITE_URL}>shreyanshkumarsingh.com</a>
          </p>
          <div className="resume-actions">
            <PrintButton />
            <Link className="btn btn-ghost" href="/contact">
              Phone &amp; WhatsApp →
            </Link>
          </div>
        </header>

        <section>
          <h2>Summary</h2>
          <p>
            Full-stack and AI engineer with nearly four years of production experience at RamanByte, building ed-tech and
            marketplace software used by real institutions across India. Owns the full vertical slice: ASP.NET Web API /
            ASP.NET Core with SQL Server or PostgreSQL, Angular 16–18 and Flutter front ends, and cloud delivery on Azure,
            AWS S3 and Firebase. Independently builds AI-native systems — RAG pipelines, LLM agent loops, and autonomous
            security and QA agents — with a spec-first, audit-after discipline. Open to full-time or hybrid roles.
          </p>
        </section>

        <section>
          <h2>Experience</h2>
          <h3>
            Full-Stack Developer · RamanByte Pvt. Ltd., Pune <span>January 2023 – Present</span>
          </h3>
          <p>Ed-tech company building Classroom+, a cloud LMS used by schools and institutes across India.</p>
          {ROLES.map((r) => (
            <div key={r.title} className="resume-role-block">
              <h4>{r.title}</h4>
              <ul>
                {r.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          <ul className="resume-projects">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <b>
                  <Link href={projectHref(p.slug)}>{p.name}</Link>
                </b>{" "}
                — {p.line} <span className="resume-stack">{p.stack.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Technical skills</h2>
          <dl className="resume-skills">
            {SKILLS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Education</h2>
          <h3>
            {PERSON.education.degree} · {PERSON.education.school}{" "}
            <span>
              {PERSON.education.start} – {PERSON.education.end}
            </span>
          </h3>
        </section>
      </div>
    </PageShell>
  );
}
