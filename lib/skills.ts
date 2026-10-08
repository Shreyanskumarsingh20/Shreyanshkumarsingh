// Skills, each tied to where it was actually used. Sources: the client's
// brief (§4 skills table), his résumé's skills section, and the projects and
// case studies on this site. `evidence` points at the proof; recruiters'
// exact search strings (C#, ASP.NET Core, Angular 16+, SQL Server, RAG…)
// each appear once, literally.

import { projectHref } from "@/lib/projects";

export type Skill = { name: string; detail: string; evidence?: { label: string; href: string }[] };
export type SkillGroup = { id: string; title: string; summary: string; skills: Skill[] };

const xp = (id: string, label: string) => ({ label, href: `/experience#${id}` });
const pj = (slug: string, label: string) => ({ label, href: projectHref(slug) });

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "applied-ai",
    title: "Applied AI",
    summary: "Systems with the model inside the loop from the first design — and audited afterwards.",
    skills: [
      {
        name: "RAG pipelines",
        detail: "Embeddings, vector storage, retrieval and generation as separately testable modules.",
        evidence: [pj("sarthi-rag-banking-copilot", "Sarthi"), pj("bookverse-ai-book-summaries", "BookVerse AI")],
      },
      {
        name: "Embeddings & vector retrieval",
        detail: "Vector retrieval over document corpora, on Supabase.",
        evidence: [pj("sarthi-rag-banking-copilot", "Sarthi")],
      },
      {
        name: "LLM agent loops",
        detail: "Agents that act, observe and verify before reporting.",
        evidence: [pj("nythera-ai-penetration-testing-agent", "Nythera")],
      },
      {
        name: "Multi-agent systems",
        detail: "Eight specialized agents coordinating bug-fix verification.",
        evidence: [pj("hallogenai-multi-agent-bug-fix-verification", "HallogenAI")],
      },
      {
        name: "Prompt & context design",
        detail: "Grounding answers in source text; graceful fallback when no model is available.",
        evidence: [pj("bookverse-ai-book-summaries", "BookVerse AI")],
      },
      {
        name: "Groq, Gemini, Ollama",
        detail: "Hosted and local models, chosen by cost and reliability.",
        evidence: [pj("collectors-pulse-ai-newsroom", "The Collector's Pulse"), pj("bookverse-ai-book-summaries", "BookVerse AI")],
      },
      { name: "OCR (Tesseract)", detail: "Text extraction feeding document pipelines." },
    ],
  },
  {
    id: "backend",
    title: "Back end",
    summary: "API-first: the contract and the schema come before the screens.",
    skills: [
      {
        name: "C# · ASP.NET Core 8 · ASP.NET Web API",
        detail: "Production APIs for Classroom+, PIBM and Dada Udyogini.",
        evidence: [xp("case", "PIBM journal"), xp("case-5", "Dada Udyogini")],
      },
      {
        name: "Clean Architecture · EF Core",
        detail: "Four-layer .NET 8 solution with an Angular 18 Signals front end.",
        evidence: [pj("vaultiq-dotnet-angular-clean-architecture", "VaultIQ")],
      },
      { name: "SignalR", detail: "Real-time orchestration of the DadaLoad load-test fleet.", evidence: [xp("case-5", "Dada Udyogini")] },
      {
        name: "Python · FastAPI · Pydantic v2 · SQLAlchemy",
        detail: "Agent back ends and security tooling.",
        evidence: [pj("hallogenai-multi-agent-bug-fix-verification", "HallogenAI"), pj("nythera-ai-penetration-testing-agent", "Nythera")],
      },
      { name: "REST API design", detail: "Typed contracts shared between API and client models." },
    ],
  },
  {
    id: "frontend",
    title: "Front end",
    summary: "Typed models, validated reactive forms, and motion only where it earns its place.",
    skills: [
      {
        name: "Angular 16–18 · Signals · RxJS",
        detail: "Admin, student and faculty apps; reactive forms; Angular Material.",
        evidence: [xp("case-2", "Classroom+ admin"), xp("case-4", "Classroom+ faculty")],
      },
      {
        name: "Next.js (App Router) · React 19 · TypeScript",
        detail: "Five Next.js AI projects, from RAG to an AI-curated newsroom.",
        evidence: [pj("sarthi-rag-banking-copilot", "Sarthi"), pj("collectors-pulse-ai-newsroom", "The Collector's Pulse")],
      },
      { name: "Tailwind CSS · Bootstrap · shadcn/Radix", detail: "Design systems written as tokens before components." },
      {
        name: "GSAP · Lenis · Framer Motion",
        detail: "Scroll-driven motion without scroll-jacking.",
        evidence: [pj("revuelto-scroll-canvas-animation", "Revuelto")],
      },
    ],
  },
  {
    id: "data",
    title: "Data",
    summary: "Schema first, then the API that serves it.",
    skills: [
      { name: "SQL Server", detail: "Schemas behind the Classroom+ platform and PIBM portal.", evidence: [xp("case", "PIBM journal")] },
      { name: "PostgreSQL · Redis", detail: "Dada Udyogini and Vidur back ends.", evidence: [xp("case-5", "Dada Udyogini"), xp("case-6", "Vidur")] },
      {
        name: "Prisma · Drizzle · Supabase · Neon",
        detail: "Typed data layers for the Next.js projects.",
        evidence: [pj("antarang-3d-art-museum-react-three-fiber", "Antarang")],
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    summary: "Flutter clients on the same .NET back ends.",
    skills: [
      {
        name: "Flutter · Dart · flutter_bloc · go_router",
        detail: "Seller and buyer marketplace apps; a multi-tenant request-tracking app.",
        evidence: [xp("case-5", "Dada Udyogini"), xp("case-6", "Vidur")],
      },
      { name: "Firebase SDK · Google Maps SDK", detail: "Data layer, OTP and logistics tracking.", evidence: [xp("case-5", "Dada Udyogini")] },
    ],
  },
  {
    id: "3d",
    title: "3D & graphics",
    summary: "Walkable spaces and simulations, tuned for perceived smoothness.",
    skills: [
      {
        name: "React Three Fiber · Three.js",
        detail: "A walkable 3D museum of Indian and world art.",
        evidence: [pj("antarang-3d-art-museum-react-three-fiber", "Antarang")],
      },
      {
        name: "Canvas 2D · N-body & particle simulation",
        detail: "Four zero-dependency physics simulators, ~5,000 lines.",
        evidence: [pj("the-evolution-physics-simulators", "The Evolution")],
      },
      {
        name: "Scroll-driven image sequences",
        detail: "110 WebP frames scrubbed to scroll on a 5.5 MB page.",
        evidence: [pj("revuelto-scroll-canvas-animation", "Revuelto")],
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    summary: "A finding without physical evidence is discarded, not downgraded.",
    skills: [
      {
        name: "OWASP Top 10 · CWE mapping · PTES workflow",
        detail: "Nine vulnerability classes across a seven-phase workflow.",
        evidence: [pj("nythera-ai-penetration-testing-agent", "Nythera")],
      },
      { name: "Validated exploitation", detail: "Every finding confirmed with evidence before it's reported.", evidence: [pj("nythera-ai-penetration-testing-agent", "Nythera")] },
      { name: "Security self-audit (P0–P3)", detail: "Published audit of his own system, worst finding first.", evidence: [pj("sarthi-rag-banking-copilot", "Sarthi")] },
      { name: "Auth hardening · rate limiting", detail: "Default-off dangerous capabilities, host-locked scanning." },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & tooling",
    summary: "Ship it, measure it, and prove capacity before launch day.",
    skills: [
      { name: "Microsoft Azure", detail: "App Service and Static Web Apps; right-sized against real traffic.", evidence: [xp("case-5", "Dada Udyogini")] },
      { name: "AWS S3 · Firebase / Google Cloud", detail: "Document uploads and mobile data.", evidence: [xp("case", "PIBM journal")] },
      { name: "k6 load testing (distributed)", detail: "DadaLoad: k6 orchestrated across 10 machines before a fixed launch date.", evidence: [xp("case-5", "Dada Udyogini")] },
      { name: "Docker · GitHub Actions · Playwright", detail: "Containerized tools, CI deploy gates, browser automation.", evidence: [pj("hallogenai-multi-agent-bug-fix-verification", "HallogenAI")] },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    summary: "Five in production use.",
    skills: [
      { name: "TypeScript · JavaScript", detail: "Next.js, React, Angular." },
      { name: "C#", detail: ".NET 8 and ASP.NET Core." },
      { name: "Python", detail: "Agents and security tooling." },
      { name: "SQL", detail: "SQL Server and PostgreSQL." },
      { name: "Dart", detail: "Flutter apps." },
    ],
  },
];
