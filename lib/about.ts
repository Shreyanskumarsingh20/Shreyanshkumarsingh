// Plain-data parts of /about, shared by the page and its markdown view
// (lib/markdown.ts) so agents and visitors read the same facts.

export const ABOUT_UPDATED = "2026-10-08";

export const ABOUT_TIMELINE: { when: string; what: string; detail: string }[] = [
  { when: "2017 – 2021", what: "B.Tech, Computer Science", detail: "Dr. A.P.J. Abdul Kalam Technical University." },
  { when: "Jan 2023", what: "Joins RamanByte, Pune", detail: "Full-stack developer on Classroom+: ASP.NET Web API, SQL Server, Angular and Flutter." },
  { when: "Oct 2023 – Mar 2024", what: "A Journal of Management (PIBM)", detail: "Rebuilt a hardcoded template into the live submission portal for a peer-reviewed journal (ISSN 2455-8796) — 93 commits." },
  { when: "At RamanByte", what: "Classroom+ admin, student and faculty apps; Dada Udyogini", detail: "Production apps for institutions, and a two-app Flutter marketplace launched on a fixed public date, load-tested beforehand with DadaLoad across 10 machines." },
  { when: "2026", what: "The range", detail: "Sarthi, Nythera, HallogenAI, BookVerse AI, Antarang, The Collector's Pulse, The Evolution, VaultIQ and Revuelto — each with a written specification, most with an audit." },
  { when: "Aug – Sep 2026", what: "Vidur Industry Connect", detail: "Admin dashboard, request lifecycle, near-duplicate guard and citizen profile suite on a multi-tenant Flutter + ASP.NET Core platform." },
];

/** The About page's argument, as plain paragraphs (headline → body). */
export const ABOUT_SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "Two halves that explain each other",
    p: [
      "For nearly four years at RamanByte he has built the learning platform Classroom+ and client systems on top of it: a peer-reviewed journal portal, admin, student and faculty apps, and a two-app artisan marketplace launched on a fixed public date.",
      "Alongside it he has built nine independent projects across nine domains: retrieval-augmented generation, autonomous security testing, AI quality assurance, 3D, physics simulation, editorial products, enterprise architecture and scroll-driven motion. The production work taught him what fails when real users arrive; the independent work is where he applies that lesson to newer problems.",
    ],
  },
  {
    h: "How he thinks",
    p: [
      "He starts with purpose: why the thing needs to exist and who is trying to get something done with it.",
      "He treats complexity as a chain to be made legible — interface, API, logic, database, model, and the real world it touches.",
      "He assumes failure. For the Dada Udyogini launch he designed DadaLoad, a distributed k6 load-testing system run across ten machines, so the team could prove capacity before launch day.",
    ],
  },
  {
    h: "AI capabilities",
    p: [
      "Retrieval-augmented generation: in Sarthi, an AI relationship-manager copilot for banking, the pipeline is split into separately testable modules for embeddings, vector storage, retrieval and generation.",
      "Agent systems: Nythera runs an LLM agent loop through a seven-phase penetration-testing workflow and confirms each finding with evidence; HallogenAI coordinates eight specialized agents to verify bug fixes against live application behavior.",
      "Grounded products: BookVerse AI generates study guides grounded in the source text across several model paths, including local Ollama, and keeps running with no API key.",
      "Responsible design: dangerous capabilities default to off (Nythera's internal-network scanning), and data provenance is enforced (Antarang uses only verified Wikimedia sources).",
    ],
  },
  {
    h: "Engineering discipline",
    p: [
      "Almost every repository ships with a specification and a handoff document. After shipping, he audits his own work: the Sarthi audit ranks twenty findings from P0 to P3, worst first, and was published rather than quietly patched.",
    ],
  },
  {
    h: "What he's looking for",
    p: [
      "Work where AI is load-bearing and correctness matters: document understanding, agent systems, security, and products that must survive real users. Open to full-time or hybrid roles in applied AI engineering, AI-focused full-stack engineering, security tooling, and senior .NET and Angular work.",
    ],
  },
];
