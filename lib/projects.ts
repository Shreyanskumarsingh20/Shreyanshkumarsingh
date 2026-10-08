import { repo } from "@/lib/site";

// THE RANGE — the nine project cards. Every field traces back to the
// project's own real repository/design tokens (see RESEARCH.md /
// CHANGELOG.md for provenance) — nothing here is invented.

export type ProjectArt =
  | {
      kind: "scrollable";
      chromeLabel: string;
      img: string;
      alt: string;
      /** real intrinsic pixel size (full-page screenshot) */
      w: number;
      h: number;
    }
  | {
      kind: "gallery";
      chromeLabel: string;
      img: string;
      alt: string;
      w: number;
      h: number;
      insetImg: string;
      insetAlt: string;
      insetW: number;
      insetH: number;
    }
  | {
      kind: "sim-quad";
      chromeLabel: string;
      main: { img: string; alt: string; sim: string; label: string; w: number; h: number };
      tri: { img: string; alt: string; sim: string; label: string; w: number; h: number }[];
    }
  | {
      kind: "pipeline";
      chromeLabel: string;
      chromeHint: string;
      nodes: string[];
      principle: string;
    }
  | {
      kind: "revuelto";
      chromeLabel: string;
      main: { img: string; alt: string; w: number; h: number };
      tri: { img: string; alt: string; w: number; h: number }[];
    };

export type Project = {
  n: string;
  /** URL slug for /projects/[slug] */
  slug: string;
  name: string;
  ref: string;
  domain: string;
  /** CSS color used for the small domain readout ("dom" in the original data) */
  domColor: "gold" | "rosso";
  accent: string;
  line: string;
  figs: [string, string][];
  stack: string[];
  url: string | null;
  /** shown instead of the repo button when `url` is null */
  sourceNote?: string;
  art: ProjectArt;
};

export const PROJECTS: Project[] = [
  {
    n: "01",
    slug: "collectors-pulse-ai-newsroom",
    name: "THE COLLECTOR'S PULSE",
    ref: "2606.EDT.06",
    domain: "EDITORIAL",
    domColor: "gold",
    accent: "#F2762E",
    line: "An AI-curated daily newsroom for trading cards, figures and luxury watches — with its own written design system.",
    figs: [
      ["3", "Collecting worlds"],
      ["30d", "Freshness filter"],
      ["6", "Spec docs shipped"],
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Gemini"],
    url: repo("the-collectors-pulse"),
    art: {
      kind: "scrollable",
      chromeLabel: "thecollectorshub — newsroom, live",
      img: "/shots/collectors-real.jpg",
      alt: "The Collector's Pulse real homepage, full length — 'Every rare find, decoded.' with live trending articles",
      w: 900,
      h: 1258,
    },
  },
  {
    n: "02",
    slug: "nythera-ai-penetration-testing-agent",
    name: "NYTHERA",
    ref: "2607.SEC.02",
    domain: "SECURITY",
    domColor: "rosso",
    accent: "#E13527",
    line: "An autonomous penetration-testing platform that validates every finding before it reports it.",
    figs: [
      ["9", "Validated vuln. classes"],
      ["7", "Workflow phases"],
      ["1", "Default-off internal mode"],
    ],
    stack: ["Python", "Async HTTP", "LLM agent loop", "Docker"],
    url: repo("Nythera"),
    art: {
      kind: "scrollable",
      chromeLabel: "nythera — open-source scanner · localhost:8000",
      img: "/shots/nythera-real.jpg",
      alt: "Nythera's real landing page, full length — live scan-report mock showing a critical exposed .env finding",
      w: 900,
      h: 2928,
    },
  },
  {
    n: "03",
    slug: "sarthi-rag-banking-copilot",
    name: "SARTHI",
    ref: "2607.AI.03",
    domain: "APPLIED AI",
    domColor: "gold",
    accent: "#00674D",
    line: "An AI relationship-manager copilot for banking — RAG and document intelligence, then a written audit of its own P0 holes.",
    figs: [
      ["P0", "Highest self-reported"],
      ["4", "Severity tiers"],
      ["17", "Library modules"],
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "Supabase", "Groq", "Gemini"],
    // repo link withheld until the repository is renamed — its current
    // name and description identify the bank, which the client doesn't want named
    url: null,
    sourceNote: "Source on request",
    art: {
      kind: "scrollable",
      chromeLabel: "sarthi — AI RM Copilot · Customer 360",
      img: "/shots/sarthi-dashboard.jpg",
      alt: "Sarthi's real Customer 360 dashboard, full length, populated with a live synthetic customer record",
      w: 900,
      h: 789,
    },
  },
  {
    n: "04",
    slug: "antarang-3d-art-museum-react-three-fiber",
    name: "ANTARANG",
    ref: "2607.SPT.04",
    domain: "SPATIAL",
    domColor: "gold",
    accent: "#C9A45A",
    line: "A walkable 3D museum where Indian art history sits as a first-class citizen on the world timeline.",
    figs: [
      ["2", "Axes on one timeline"],
      ["60fps", "Target in-gallery"],
      ["1", "Permitted data source"],
    ],
    stack: ["Next.js", "React Three Fiber", "Three.js", "Drizzle", "Neon"],
    url: repo("3dIndianmusem"),
    art: {
      kind: "gallery",
      chromeLabel: "antarang — world & indian art timeline",
      img: "/shots/antarang-gallery.jpg",
      alt: "ANTARANG's real dual-axis timeline UI — World Art and Indian Art, gold rings opening a walkable gallery",
      w: 1280,
      h: 800,
      insetImg: "/shots/antarang-real.jpg",
      insetAlt: "ANTARANG's real particle-field intro screen",
      insetW: 1280,
      insetH: 800,
    },
  },
  {
    n: "05",
    slug: "bookverse-ai-book-summaries",
    name: "BOOKVERSE AI",
    ref: "2607.PRD.05",
    domain: "PRODUCT",
    domColor: "gold",
    accent: "#ff2e55",
    line: "Step inside any book — summaries, timelines, mind maps, character graphs and a grounded AI tutor.",
    figs: [
      ["0", "API keys required"],
      ["3", "Model paths"],
      ["∞", "Cache lifetime"],
    ],
    stack: ["Next.js 16", "React", "TypeScript", "Tailwind", "Groq", "Ollama"],
    url: repo("BookVerseAi"),
    art: {
      kind: "scrollable",
      chromeLabel: "bookverse — step inside any book",
      img: "/shots/bookverse-real.jpg",
      alt: "BookVerse AI's real landing page, full length — 'Step inside any book', with its live model badge and Summon search",
      w: 900,
      h: 2334,
    },
  },
  {
    n: "06",
    slug: "the-evolution-physics-simulators",
    name: "THE EVOLUTION",
    ref: "2607.SIM.01",
    domain: "SIMULATION",
    domColor: "gold",
    accent: "#D09A56",
    line: "Four physics simulators. One HTML file each. No build step, no dependencies, no network.",
    figs: [
      ["4", "Simulators"],
      ["5,034", "Lines total"],
      ["0", "Dependencies"],
    ],
    stack: ["Vanilla JS", "Canvas 2D", "Zero deps"],
    url: repo("THE_EVOLUTION"),
    art: {
      kind: "sim-quad",
      chromeLabel: "aeon.html — local file · zero deps",
      main: {
        img: "/shots/evolution.png",
        alt: "AEON — weapons-consequence simulator, one of the four THE EVOLUTION simulators",
        sim: "aeon",
        label: "AEON — weapons-consequence simulator",
        w: 560,
        h: 360,
      },
      tri: [
        {
          img: "/shots/evolution-cosmos.png",
          alt: "COSMOS simulator",
          sim: "cosmos",
          label: "COSMOS — orbital-mechanics simulator",
          w: 560,
          h: 360,
        },
        {
          img: "/shots/evolution-genesis.png",
          alt: "GENESIS simulator",
          sim: "genesis",
          label: "GENESIS — a pocket universe",
          w: 560,
          h: 360,
        },
        {
          img: "/shots/evolution-genlife.png",
          alt: "GENLIFE simulator",
          sim: "genlife",
          label: "GENLIFE — artificial-life simulator",
          w: 560,
          h: 360,
        },
      ],
    },
  },
  {
    n: "07",
    slug: "vaultiq-dotnet-angular-clean-architecture",
    name: "VAULTIQ",
    ref: "2606.PLT.07",
    domain: "PLATFORM",
    domColor: "gold",
    accent: "#7C3AED",
    line: "Angular 18 and ASP.NET Core 8 in Clean Architecture — the enterprise half of the range.",
    figs: [
      ["4", "Clean Arch. layers"],
      ["8", ".NET major version"],
      ["18", "Angular major version"],
    ],
    stack: ["C#", ".NET 8", "Angular 18", "Signals", "EF Core", "SQL Server"],
    url: repo("vaultIQ"),
    art: {
      kind: "scrollable",
      chromeLabel: "vaultiq — AI startup idea generator",
      img: "/shots/vaultiq-real.jpg",
      alt: "VaultIQ's real landing page, full length — 'Find your next big startup idea in seconds.'",
      w: 900,
      h: 2918,
    },
  },
  {
    n: "08",
    slug: "hallogenai-multi-agent-bug-fix-verification",
    name: "HALLOGENAI",
    ref: "2607.VER.08",
    domain: "VERIFICATION",
    domColor: "gold",
    accent: "#2F7FE0",
    line: "An autonomous QA agent that re-verifies reported bugs against live application behavior — never against a commit message.",
    figs: [
      ["8", "Specialized agents"],
      ["2", "Automation platforms"],
      ["0", "Guesses allowed"],
    ],
    stack: [
      "Python",
      "FastAPI",
      "Playwright",
      "Pydantic v2",
      "SQLAlchemy",
      "Groq",
    ],
    url: null,
    art: {
      kind: "pipeline",
      chromeLabel: "hallogenai — verification pipeline",
      chromeHint: "evidence, not assumption",
      nodes: ["Intake", "Understand", "Automate", "Evidence", "Report"],
      principle:
        '"Never guess." A bug is marked fixed only when observed application behavior says so — never because a commit exists.',
    },
  },
  {
    n: "09",
    slug: "revuelto-scroll-canvas-animation",
    name: "REVUELTO: ASSEMBLED",
    ref: "2609.MOT.09",
    domain: "MOTION",
    domColor: "gold",
    accent: "#FF6A1A",
    line: "A locked-off clip of a Lamborghini Revuelto, scrubbed frame-by-frame to scroll — scroll down and it assembles itself; scroll up and it comes apart again.",
    figs: [
      ["110", "WebP frames, scrubbed live"],
      ["5.5MB", "Total page weight"],
      ["0", "Three.js/R3F — dropped for canvas"],
    ],
    stack: ["Next.js 16", "React 19", "Canvas 2D", "Lenis", "GSAP", "Tailwind v4"],
    url: null,
    art: {
      kind: "revuelto",
      chromeLabel: "revuelto — scroll-driven teardown",
      main: {
        img: "/shots/lambo/revuelto-reveal.jpg",
        alt: "Revuelto: Assembled — the reveal beat, 'Back where it belongs,' the fully assembled Lamborghini Revuelto with its 1,001 HP spec chip",
        w: 1366,
        h: 633,
      },
      tri: [
        {
          img: "/shots/lambo/revuelto-intro.jpg",
          alt: "The intro — the Revuelto fully exploded into its parts, wordmark over it",
          w: 1366,
          h: 633,
        },
        {
          img: "/shots/lambo/revuelto-assembly.jpg",
          alt: "Mid-scrub — body panels and active aero drawing in toward the chassis",
          w: 1366,
          h: 633,
        },
        {
          img: "/shots/lambo/revuelto-spec.jpg",
          alt: "The specification section — real engine and hybrid-system figures",
          w: 1366,
          h: 633,
        },
      ],
    },
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/** Link target for a project's case-study page. */
export const projectHref = (slug: string) => `/projects/${slug}`;

/** The project's lead image (for cards, OG fallbacks and JSON-LD), if any. */
export function projectImage(p: Project): { src: string; alt: string; w: number; h: number } | null {
  const a = p.art;
  if (a.kind === "scrollable" || a.kind === "gallery") return { src: a.img, alt: a.alt, w: a.w, h: a.h };
  if (a.kind === "sim-quad") return { src: a.main.img, alt: a.main.alt, w: a.main.w, h: a.main.h };
  if (a.kind === "revuelto") return { src: a.main.img, alt: a.main.alt, w: a.main.w, h: a.main.h };
  return null;
}
