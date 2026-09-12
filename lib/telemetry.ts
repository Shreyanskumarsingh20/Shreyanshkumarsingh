// TELEMETRY — the instrument rack. Each technology gets a brand-colored "3D
// box" tile: either a real lettermark ("mono") or a small hand-drawn SVG
// pictogram ("svg", raw markup rendered via dangerouslySetInnerHTML — static
// decoration, not user input). Color families echo the domain colours used
// in lib/projects.ts (gold for Applied AI/Graphics, rosso for Security).

export type TechMeta = {
  c: string;
  mono?: string;
  svg?: string;
  dark?: boolean;
};

export const TECH_META: Record<string, TechMeta> = {
  TypeScript: { c: "#3178C6", mono: "TS" },
  JavaScript: { c: "#F0DB4F", mono: "JS", dark: true },
  Python: {
    c: "#30475E",
    svg: '<path d="M12 3c-1.5 0-2.7.3-3.6.8-.8.5-1.2 1.1-1.2 2v1.7h4.8v.6H5.4C4 8.1 3 9.4 3 11.4v2.6c0 2 1.1 3.3 3 3.3h1.4v-2.1c0-1.9 1.6-3.4 3.6-3.4h3.6c1.6 0 2.9-1.3 2.9-2.9V5.8c0-1.5-1.3-2.6-2.9-2.8-.9-.2-1.8-.3-2.6-.3z" fill="#3776AB"/><path d="M12 21c1.5 0 2.7-.3 3.6-.8.8-.5 1.2-1.1 1.2-2v-1.7h-4.8v-.6h6.6c1.4 0 2.4-1.3 2.4-3.3v-2.6c0-2-1.1-3.3-3-3.3h-1.4v2.1c0 1.9-1.6 3.4-3.6 3.4H9.4c-1.6 0-2.9 1.3-2.9 2.9v3.1c0 1.5 1.3 2.6 2.9 2.8.9.2 1.8.3 2.6.3z" fill="#FFD43B"/>',
  },
  "C#": { c: "#684D9C", mono: "C#" },
  SQL: {
    c: "#00618A",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.5"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></g>',
  },
  "HTML/CSS": {
    c: "#E34F26",
    svg: '<path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  },

  "Next.js (App Router)": { c: "#FFFFFF", mono: "N", dark: true },
  "React 19": {
    c: "#20232A",
    svg: '<g fill="none" stroke="#61DAFB" stroke-width="1.3"><circle cx="12" cy="12" r="2" fill="#61DAFB" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/></g>',
  },
  "Angular 18 + Signals": { c: "#DD0031", mono: "ng" },
  Tailwind: {
    c: "#0F172A",
    svg: '<path d="M6 12c1-3 3-4.5 6-4.5s4 1.5 6 4.5c-1-1-2.2-1.5-3.6-1.2C13 11.6 12 13 10 13.2 7.8 13.5 6.6 12.7 6 12z" fill="#38BDF8"/><path d="M2 16.5c1-3 3-4.5 6-4.5s4 1.5 6 4.5c-1-1-2.2-1.5-3.6-1.2-1.4.3-2.4 1.7-4.4 1.9-2.2.3-3.4-.5-4-1.7z" fill="#38BDF8"/>',
  },
  "Framer Motion": { c: "#0055FF", mono: "FM" },
  GSAP: { c: "#88CE02", mono: "GS", dark: true },
  Lenis: { c: "#1a1a1a", mono: "LN" },
  "Radix / shadcn": {
    c: "#242424",
    svg: '<rect x="4" y="4" width="10" height="10" rx="1" fill="none" stroke="#fff" stroke-width="1.4"/><rect x="10" y="10" width="10" height="10" rx="1" fill="#fff"/>',
  },

  "RAG pipelines": {
    c: "#C9960A",
    svg: '<g fill="none" stroke="#111" stroke-width="1.6"><circle cx="5" cy="12" r="2.1" fill="#111"/><circle cx="19" cy="12" r="2.1" fill="#111"/><path d="M7.1 12h9.8" stroke-dasharray="2.2 2.2"/><rect x="9.5" y="8" width="5" height="8" rx="1" fill="#111" stroke="none"/></g>',
  },
  "Embeddings + vector retrieval": {
    c: "#E0A100",
    svg: '<g fill="#111" stroke="#111" stroke-width="1.2"><circle cx="6" cy="7" r="1.5"/><circle cx="18" cy="7" r="1.5"/><circle cx="6" cy="17" r="1.5"/><circle cx="18" cy="17" r="1.5"/><circle cx="12" cy="12" r="1.7"/><path d="M7.2 8.2 10.8 11M17 8.2 13.4 11M7.2 15.8 10.8 13M17 15.8 13.4 13" fill="none"/></g>',
  },
  "LLM agent loops": {
    c: "#FFC000",
    svg: '<g fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.6-5.7L20 8M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.6 5.7L4 16M4 20v-4h4"/></g>',
  },
  Groq: { c: "#F55036", mono: "Gq" },
  Gemini: {
    c: "#171730",
    svg: '<path d="M12 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6z" fill="#9AB6FF"/>',
  },
  Ollama: {
    c: "#181818",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.4"><circle cx="12" cy="13" r="6"/><path d="M8 8 7 3M16 8l1-5" stroke-linecap="round"/><circle cx="9.5" cy="12.5" r="1" fill="#fff" stroke="none"/><circle cx="14.5" cy="12.5" r="1" fill="#fff" stroke="none"/></g>',
  },
  "OCR (Tesseract)": {
    c: "#4C6EF5",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.5"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/></g>',
  },

  "React Three Fiber": {
    c: "#111827",
    svg: '<g fill="none" stroke="#61DAFB" stroke-width="1.3"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3z"/><path d="M12 3v9M12 12 4 7.5M12 12l8-4.5M12 12v9"/></g>',
  },
  "Three.js": {
    c: "#0d1117",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.3"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3z"/><path d="M12 3v9M12 12 4 7.5M12 12l8-4.5M12 12v9"/></g>',
  },
  "Canvas 2D": {
    c: "#FF6F3C",
    svg: '<g fill="none" stroke="#111" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke-width="1"/></g>',
  },
  "Bloom · ACES postprocessing": {
    c: "#FFC000",
    svg: '<g stroke="#111" stroke-width="1.4"><circle cx="12" cy="12" r="4" fill="#111" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" stroke-linecap="round"/></g>',
  },
  "N-body + particle systems": {
    c: "#E0A100",
    svg: '<g fill="#111" stroke="#111"><circle cx="12" cy="12" r="1.5" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke-width="1.2"/><circle cx="20.5" cy="12" r="1.1" stroke="none"/><ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke-width="1.2" transform="rotate(30 12 12)"/><circle cx="15.2" cy="4.4" r="1" stroke="none"/></g>',
  },

  "ASP.NET Core 8": {
    c: "#512BD4",
    svg: '<path d="M7 9a3 3 0 1 0 0 6c1.8 0 2.6-1 3.5-2l3-3c.9-1 1.7-2 3.5-2a3 3 0 1 1 0 6c-1.8 0-2.6-1-3.5-2l-3-3c-.9-1-1.7-2-3.5-2z" fill="none" stroke="#fff" stroke-width="1.5"/>',
  },
  "Clean Architecture": {
    c: "#1f2937",
    svg: '<g fill="none" stroke="#fff"><circle cx="12" cy="12" r="3" stroke-width="1.3"/><circle cx="12" cy="12" r="6.5" stroke-width="1.1" opacity=".7"/><circle cx="12" cy="12" r="10" stroke-width="1" opacity=".4"/></g>',
  },
  Prisma: {
    c: "#0C344B",
    svg: '<path d="M12 2 21 20H3L12 2z" fill="none" stroke="#5AC8FA" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  Drizzle: {
    c: "#0F172A",
    svg: '<path d="M12 3c3.5 4.2 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.5 7.2 12 3z" fill="#22C55E"/>',
  },
  Supabase: {
    c: "#0f2e24",
    svg: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="#3ECF8E"/>',
  },
  Neon: {
    c: "#07211c",
    svg: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="none" stroke="#00E5A0" stroke-width="1.4" stroke-linejoin="round"/>',
  },
  "EF Core": { c: "#2d2d5f", mono: "EF" },
  "SQL Server": {
    c: "#A91D22",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.5"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/></g>',
  },
  FastAPI: { c: "#009485", mono: "Fa" },
  "Pydantic v2": { c: "#E92063", mono: "Pyd" },
  SQLAlchemy: { c: "#26415E", mono: "SQA" },

  "OWASP Top 10": {
    c: "#8a1c15",
    svg: '<g fill="none" stroke="#fff"><path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3z" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>',
  },
  "CWE mapping": {
    c: "#7a1712",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"><circle cx="12" cy="13" r="5" stroke-width="1.3"/><path d="M12 8V5M9 6 7.5 4M15 6l1.5-2M5 13H3M21 13h-2M6 17l-2 1.5M18 17l2 1.5"/></g>',
  },
  "PTES workflow": {
    c: "#6b1410",
    svg: '<g fill="#fff" stroke="#fff"><circle cx="4" cy="12" r="1.8" stroke="none"/><circle cx="12" cy="6" r="1.8" stroke="none"/><circle cx="12" cy="18" r="1.8" stroke="none"/><circle cx="20" cy="12" r="1.8" stroke="none"/><path d="M5.6 11 10.4 7M5.6 13 10.4 17M13.6 7 18.4 11M13.6 17 18.4 13" stroke-width="1.2"/></g>',
  },
  "Validated exploitation": {
    c: "#9c2318",
    svg: '<g fill="none" stroke="#fff"><circle cx="12" cy="12" r="9" stroke-width="1.4"/><path d="M8 12l3 3 5-6" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g>',
  },
  "Auth hardening": {
    c: "#5c1512",
    svg: '<g fill="none" stroke="#fff" stroke-width="1.4"><rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></g>',
  },
  "Rate limiting": {
    c: "#4d100e",
    svg: '<g fill="none" stroke="#fff"><path d="M4 16a8 8 0 1 1 16 0" stroke-width="1.4"/><path d="M12 16 16 10" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="16" r="1.3" fill="#fff" stroke="none"/></g>',
  },
};

export type InstrumentGroup = {
  g: string;
  items: string[];
};

export const INSTRUMENTS: InstrumentGroup[] = [
  {
    g: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C#", "SQL", "HTML/CSS"],
  },
  {
    g: "Web",
    items: [
      "Next.js (App Router)",
      "React 19",
      "Angular 18 + Signals",
      "Tailwind",
      "Framer Motion",
      "GSAP",
      "Lenis",
      "Radix / shadcn",
    ],
  },
  {
    g: "Applied AI",
    items: [
      "RAG pipelines",
      "Embeddings + vector retrieval",
      "LLM agent loops",
      "Groq",
      "Gemini",
      "Ollama",
      "OCR (Tesseract)",
    ],
  },
  {
    g: "Graphics + simulation",
    items: [
      "React Three Fiber",
      "Three.js",
      "Canvas 2D",
      "Bloom · ACES postprocessing",
      "N-body + particle systems",
    ],
  },
  {
    g: "Backend + data",
    items: [
      "ASP.NET Core 8",
      "Clean Architecture",
      "Prisma",
      "Drizzle",
      "Supabase",
      "Neon",
      "EF Core",
      "SQL Server",
      "FastAPI",
      "Pydantic v2",
      "SQLAlchemy",
    ],
  },
  {
    g: "Security",
    items: [
      "OWASP Top 10",
      "CWE mapping",
      "PTES workflow",
      "Validated exploitation",
      "Auth hardening",
      "Rate limiting",
    ],
  },
];
