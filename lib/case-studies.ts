// Long-form case studies for /projects/[slug] — the brief's four-part format
// (problem → what he built → hardest decision and why → result), answer-first.
//
// Sources, and nothing else: each repository's own README / PROJECT_REPORT /
// audit / docs (read 2026-10-08), the client's brief and résumé, and the
// project data already on this site (lib/projects.ts, lib/research.ts).
// Sarthi is never tied to a named bank (client's instruction), and its repo
// isn't linked until it's renamed. HallogenAI and Revuelto are private
// repositories, so their write-ups stay at the level the site already states.

export type CaseStudy = {
  slug: string;
  /** <title> — ~50–65 chars, primary phrase first */
  title: string;
  description: string;
  /** visible H1 */
  h1: string;
  /** the question this page answers best (for H2s, FAQ, llms.txt) */
  question: string;
  /** 1–2 sentence direct answer, shown first */
  tldr: string;
  problem: string[];
  built: { title: string; body: string }[];
  decision: { title: string; body: string[] };
  result: string[];
  facts: [string, string][];
  links?: { label: string; href: string }[];
  /** honest status line */
  status: string;
  keywords: string[];
  updated: string;
};

const U = "2026-10-08";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "sarthi-rag-banking-copilot",
    title: "Sarthi — RAG Relationship-Manager Copilot for Banking",
    description:
      "Sarthi is an AI relationship-manager copilot for banking built by Shreyansh Kumar Singh: a Customer 360 dashboard, LLM chat grounded in policy documents, and a published P0–P3 security self-audit.",
    h1: "Sarthi: an AI relationship-manager copilot for banking",
    question: "How should a RAG copilot for banking be structured — and audited?",
    tldr:
      "Sarthi is an AI copilot for bank relationship managers: twelve modules — Customer 360, risk, loans, lead scoring, a policy-grounded chat assistant, document intelligence — over a synthetic customer book. Its most useful artefact is the security audit Shreyansh wrote against his own build, graded P0 to P3 with the worst finding first, followed by the fixes.",
    problem: [
      "A relationship manager's day is spread across a dozen systems: the customer's accounts and transactions, credit risk, loan products, government schemes, policy circulars and KYC documents. The questions they actually ask — is this customer drifting into risk, which loan fits, what does the policy say — need all of that at once, in plain language.",
      "Sarthi started as a hackathon brief: build that copilot. The harder brief Shreyansh set himself was to make it honest about where AI helps, where it guesses, and where the system itself is unsafe.",
    ],
    built: [
      {
        title: "Twelve modules on one customer book",
        body: "Customer 360, Financial Health Score (six weighted factors), Risk Prediction, Loan Recommendation with EMI estimates, Lead Qualification, an explainability view, a policy knowledge base, RM Chat, Next Best Action, a government-scheme matcher, Document Intelligence (classification, entity extraction and compliance flags) and an analytics dashboard — over a seeded, synthetic dataset of 24 customers, 16 leads, policies, schemes and loan products, so no real customer data is ever involved.",
      },
      {
        title: "Grounded chat, not a free-floating chatbot",
        body: "RM Chat answers with the selected customer's context and the policy corpus in the prompt, so responses cite the bank's own policies (e.g. 'POL-003') instead of general knowledge. It runs on Groq (Llama 3.3 70B) and tells the user plainly when no model key is configured rather than pretending a fallback works.",
      },
      {
        title: "A pipeline split so stages fail alone",
        body: "Shreyansh's design keeps embedding, storage, retrieval and generation as separate modules, each inspectable and replaceable on its own — so a weak retrieval step can't hide behind a fluent answer.",
      },
      {
        title: "Next.js 16 and TypeScript end to end",
        body: "An API route behind each module, Groq and Gemini for models, and seeded data held in memory for the prototype — with the move to a real database written down as the next step rather than implied.",
      },
    ],
    decision: {
      title: "Publish the audit instead of quietly patching it",
      body: [
        "Once the demo worked, Shreyansh reviewed it as an outsider would and wrote the result down: twenty findings, graded P0 (security) to P3 (polish), worst first. P0 #1: no authentication on any endpoint, and sequential customer IDs (CUST-1001…CUST-1024) — the whole book scrapeable with a for-loop. P0 #2: the chat API accepted a caller-supplied 'system' role in its history — a full prompt-injection override. P0 #3: no rate limit in front of a paid LLM API.",
        "The decision was to keep that document in the repository, alongside the fixes — role whitelisting and a ten-turn cap on chat history, zod validation on every POST route, response checks in every client fetch, a per-IP rate limiter with a stricter cap on chat, an optional API gate token, and security headers — and to state plainly what was deliberately deferred: real per-user authorization and a move off in-memory data, both unnecessary for a synthetic-data prototype but essential before real customers.",
      ],
    },
    result: [
      "A working twelve-module copilot, and a written record that separates a hackathon build from something you could put in front of real customer data. Every P0–P3 finding was addressed except the two deferred items, which are named as such.",
      "It's the clearest example on this site of how Shreyansh treats AI systems: the model sits inside the loop, and the system around it is audited like any other code.",
    ],
    facts: [
      ["Modules", "12"],
      ["Audit findings", "20, graded P0–P3"],
      ["Highest severity", "P0 — self-reported"],
      ["Data", "Synthetic only — no real PII"],
      ["Stack", "Next.js 16 · TypeScript · Prisma · Supabase · Groq · Gemini"],
    ],
    status: "Independent hackathon project. Source available on request.",
    keywords: ["RAG copilot for banking", "AI relationship manager", "LLM security audit", "prompt injection", "Next.js RAG"],
    updated: U,
  },
  {
    slug: "nythera-ai-penetration-testing-agent",
    title: "Nythera — Autonomous Pentest Agent That Validates Findings",
    description:
      "Nythera is an open-source autonomous web penetration-testing platform by Shreyansh Kumar Singh. It validates every finding with evidence before reporting it, across nine vulnerability classes and a seven-phase workflow.",
    h1: "Nythera: autonomous penetration testing that proves every finding",
    question: "How do autonomous penetration-testing tools avoid reporting false positives?",
    tldr:
      "Nythera avoids false positives by refusing to report anything it can't prove: every active finding needs physical evidence — a database error signature, an unencoded reflected payload, real command output, a file signature, or evaluated template math — or it's discarded, not downgraded. It's an open-source, MIT-licensed scanner for in-house web applications, with internal-network scanning switched off by default.",
    problem: [
      "Automated scanners are noisy. A report with forty 'possible' findings teaches a team to ignore the report — and the one real vulnerability goes with it. At the same time, the most useful place to scan is the one most scanners can't reach: behind the login, on internal hosts.",
    ],
    built: [
      {
        title: "A seven-phase, PTES-style workflow",
        body: "Reconnaissance (headers, cookies, TLS, tech disclosure) → attack-surface mapping (an in-scope crawler for endpoints, forms and parameters, plus content discovery) → API import (OpenAPI/Swagger and GraphQL introspection) → active exploitation → access-control testing (authenticated vs anonymous) → an optional LLM agent deep-dive → reporting with OWASP and CWE mapping.",
      },
      {
        title: "Nine validated vulnerability classes",
        body: "SQL injection (error signatures + boolean inference), reflected XSS, OS command injection, path traversal / LFI, server-side template injection, open redirect, broken access control, GraphQL introspection exposure, and security misconfiguration — each confirmed by its own evidence signature.",
      },
      {
        title: "Built for in-house applications",
        body: "Authenticated scanning (Bearer, cookie, custom headers, HTTP Basic), self-signed TLS, host-locked scope with include/exclude rules and a request rate limiter. A live FastAPI dashboard streams phases and findings over Server-Sent Events; a headless CLI exits with code 2 when a finding meets a severity threshold, so it can gate a CI/CD pipeline.",
      },
    ],
    decision: {
      title: "Make the dangerous capability opt-in",
      body: [
        "Scanning localhost, private IP ranges and internal hosts is exactly what makes Nythera useful for in-house testing — and exactly what makes it dangerous if it's pointed somewhere it shouldn't be. So internal mode is off by default and has to be switched on explicitly; requests stay host-scoped; private hosts are refused unless internal mode is on; and every scan requires an authorization confirmation first.",
        "The same principle governs the LLM agent: it's an optional phase that reasons about the target and probes further, never a replacement for the validated checks underneath it.",
      ],
    },
    result: [
      "Reports a team can act on: deduplicated findings with severity, evidence, remediation and OWASP/CWE mapping, exportable as HTML or JSON — and a CI gate that fails a build only on proven issues.",
    ],
    facts: [
      ["Vulnerability classes", "9, all validated"],
      ["Workflow phases", "7 (PTES-style)"],
      ["Internal-network mode", "Off by default"],
      ["CI gate", "Exit code 2 at/above --fail-on severity"],
      ["Stack", "Python · FastAPI · async HTTP · SSE · optional LLM agent · Docker"],
      ["License", "MIT"],
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/Nythera" }],
    status: "Open source. Authorized testing only.",
    keywords: ["autonomous penetration testing", "AI pentest agent", "validated findings", "false positives", "open-source security scanner"],
    updated: U,
  },
  {
    slug: "hallogenai-multi-agent-bug-fix-verification",
    title: "HallogenAI — Multi-Agent QA That Verifies Bug Fixes",
    description:
      "HallogenAI, by Shreyansh Kumar Singh, uses eight specialized AI agents to re-verify reported bugs against live application behavior, marking a bug fixed only on captured evidence — never on a commit.",
    h1: "HallogenAI: verifying bug fixes by evidence, not by commit",
    question: "How can an AI agent verify that a bug is actually fixed rather than trusting the commit log?",
    tldr:
      "HallogenAI re-tests each reported bug against the running application and marks it fixed only when the observed behavior, captured as evidence, says so. Eight specialized agents split the work — taking in the report, understanding it, automating the reproduction, collecting evidence and writing the verdict — and the governing rule is simple: never guess.",
    problem: [
      "In most teams a bug is 'fixed' when someone pushes a commit and closes the ticket. Whether the behavior actually changed in the QA environment is assumed, not checked — and regressions slip through on exactly that assumption.",
    ],
    built: [
      {
        title: "A five-stage verification pipeline",
        body: "Intake → Understand → Automate → Evidence → Report. Eight specialized agents divide the stages so each one does a narrow job well, instead of one general agent improvising the whole thing.",
      },
      {
        title: "Real browsers, typed data",
        body: "Playwright drives the application the way a tester would; FastAPI serves the system; Pydantic v2 and SQLAlchemy keep every report, step and verdict typed and stored; Groq provides the models. It works across two automation platforms.",
      },
    ],
    decision: {
      title: "Evidence outranks the commit log",
      body: [
        "The tempting shortcut is to let an agent read the diff and decide the fix 'looks right'. HallogenAI deliberately ignores that signal. A bug is marked fixed only when its behavior in the QA environment — reproduced, observed and captured — shows the defect is gone. If the evidence can't be produced, the verdict isn't 'probably fixed'; it's not verified.",
      ],
    },
    result: [
      "Bug status that reflects what the application actually does, with the evidence attached — the same 'prove it' standard Nythera applies to security findings, applied to QA.",
    ],
    facts: [
      ["Specialized agents", "8"],
      ["Pipeline", "Intake → Understand → Automate → Evidence → Report"],
      ["Automation platforms", "2"],
      ["Stack", "Python · FastAPI · Playwright · Pydantic v2 · SQLAlchemy · Groq"],
    ],
    status: "Private repository — details available on request.",
    keywords: ["multi-agent QA", "bug fix verification", "AI agents Playwright", "QA automation"],
    updated: U,
  },
  {
    slug: "bookverse-ai-book-summaries",
    title: "BookVerse AI — Book Summaries That Run Without an API Key",
    description:
      "BookVerse AI by Shreyansh Kumar Singh turns any book into a study guide — summary, timeline, mind map, character map and a grounded tutor — and keeps working with no API key through graceful fallbacks.",
    h1: "BookVerse AI: step inside any book — even with no API key",
    question: "How can an AI book-summary app keep working when no API key is available?",
    tldr:
      "BookVerse AI keeps working without an API key by treating the model as optional: with no provider configured it serves grounded, structured previews from an offline path, and when a configured model or database is slow or down, timeouts and a circuit breaker drop it to the fallback instead of hanging. Configure Groq, OpenAI, Gemini or a local Ollama and the same app generates full study guides.",
    problem: [
      "Most AI demos are a single API call wrapped in a UI — remove the key, or let the provider stall, and the whole product is a spinner. A study tool has to be dependable before it can be clever.",
    ],
    built: [
      {
        title: "A study guide from a title",
        body: "Enter a book and get a structured summary, chapter breakdown, key lessons, a timeline, a radial mind map, a character map and an AI tutor grounded in the book's content. Ten public-domain books are seeded and served instantly; summaries are paraphrased and transformative, never reproduced text.",
      },
      {
        title: "Provider-agnostic AI layer",
        body: "One provider interface over Groq, OpenAI, Gemini, any OpenAI-compatible endpoint, or local Ollama. A status badge turns green only when the configured model is actually reachable — verified against the provider's model list, not just the presence of a key.",
      },
      {
        title: "Untrusted model output, validated",
        body: "Generated JSON is extracted from prose, then normalised with zod: every field has a fallback, strings and arrays are clamped, and the mind map is repaired so it always has exactly one root. Results are cached so a book is generated once.",
      },
    ],
    decision: {
      title: "Degrade honestly instead of failing hard",
      body: [
        "Every external dependency — hosted database, remote model, session refresh — is wrapped in a timeout and a circuit breaker. A dead Supabase costs about two slow requests per 30-second window and then nothing, because the circuit opens after two consecutive failures and calls go straight to the local SQLite fallback.",
        "The same rule shapes the UI: when the app is running on its offline path it says so, with a badge, rather than passing previews off as model output.",
      ],
    },
    result: [
      "A Next.js 16 app that runs fully on first `npm run dev` — embedded SQLite, offline AI previews, a localStorage shelf — and scales up to hosted models, Supabase persistence and accounts by adding environment variables, with rate limiting, request-scoped logging and Vitest and Playwright test suites along the way.",
    ],
    facts: [
      ["API keys required", "0"],
      ["Model paths", "Groq · OpenAI · Gemini · Ollama (+ offline)"],
      ["Circuit breaker", "Opens after 2 failures, for 30 s"],
      ["Seed library", "10 public-domain books"],
      ["Stack", "Next.js 16 · TypeScript · Tailwind · zod · SQLite · Supabase · Vitest · Playwright"],
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/BookVerseAi" }],
    status: "Source available on GitHub (proprietary license).",
    keywords: ["AI book summary app", "graceful degradation", "LLM fallback", "Ollama", "circuit breaker"],
    updated: U,
  },
  {
    slug: "antarang-3d-art-museum-react-three-fiber",
    title: "Antarang — Walkable 3D Art Museum in React Three Fiber",
    description:
      "Antarang, by Shreyansh Kumar Singh, is a browser-based walkable 3D museum built with React Three Fiber that places Indian art history on the world art timeline, using verified Wikimedia data only.",
    h1: "Antarang: a walkable 3D museum of Indian and world art",
    question: "How do you build a walkable 3D museum on the web with React Three Fiber?",
    tldr:
      "Antarang is a walkable first-person museum in the browser, built with React Three Fiber: a zoomable time-river puts Indian art (below the axis) and world art (above it) on one shared timeline, and gold markers open era-specific 3D galleries you walk through with WASD and mouse-look. Every artwork and fact comes from Wikipedia and Wikimedia Commons — nothing is invented.",
    problem: [
      "Indian art history usually appears in world-art timelines as a footnote. Antarang's premise is that it belongs on the same axis — Indus Valley to the Progressive Artists' Group alongside the Renaissance to Modernism — and that the way to feel that is to walk through it.",
    ],
    built: [
      {
        title: "A time-river, then a museum",
        body: "A horizontal, drag-to-pan, zoomable timeline: World above, India below, 24 periods, 30+ artists and 25 public-domain artworks in the verified catalogue. Gold pulsing dots are walkable museums; any artwork opens a zoom-and-pan inspect view with its story, significance and sources.",
      },
      {
        title: "Era-specific 3D galleries",
        body: "Sandstone temple halls with pillars for Indian dynasties, a warm salon for Old Masters, a white cube for the moderns — with PBR materials, a reflective floor, per-artwork spotlights, soft shadows, bloom and ACES tone mapping, plus a guided auto-tour that flies the camera to each work.",
      },
      {
        title: "Data you can trust",
        body: "A seed script resolves each artwork's canonical image, licence and credit from the Wikimedia Commons API into Neon Postgres (via Drizzle); without a database the app runs from the bundled verified catalogue.",
      },
    ],
    decision: {
      title: "Fix jitter, not frame rate",
      body: [
        "The gallery felt jittery, and the instinct is to chase frames per second. The bigger win was elsewhere: the centre-screen focus raycast — the check that decides which artwork you're looking at — ran every frame. Throttling it to roughly ten times a second improved perceived smoothness more than any frame-rate tuning did.",
        "The same performance thinking runs through the build: an adaptive device-pixel-ratio capped at 1.8 with a performance monitor to hold 60 fps on weaker GPUs, the 3D code split out of the initial bundle, and dust motes and head-bob that switch off under reduced-motion settings.",
      ],
    },
    result: [
      "A museum that treats Indian art as a first-class citizen of art history, built on a single permitted data source — and where copyright forbids a reproduction, a modern artist appears as a biography node rather than an invented image.",
    ],
    facts: [
      ["Periods", "24"],
      ["Artists", "30+"],
      ["Data source", "Wikipedia / Wikimedia Commons only"],
      ["Target", "60 fps in-gallery"],
      ["Stack", "Next.js · React Three Fiber · Three.js · drei · postprocessing · Zustand · Drizzle · Neon"],
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/3dIndianmusem" }],
    status: "Source available on GitHub.",
    keywords: ["walkable 3D museum", "React Three Fiber", "3D art gallery Three.js", "Indian art history", "raycast throttling"],
    updated: U,
  },
  {
    slug: "the-evolution-physics-simulators",
    title: "The Evolution — Four Zero-Dependency Physics Simulators",
    description:
      "The Evolution by Shreyansh Kumar Singh: four physics simulators, one HTML file each, with no build step or dependencies — including AEON, a weapons-consequence model where every zone comes from a published effects model.",
    h1: "The Evolution: four physics simulators, one HTML file each",
    question: "Why does blast damage radius scale with the cube root of yield?",
    tldr:
      "Blast radius scales with the cube root of yield because the energy of a blast fills a volume, and volume grows with the cube of distance — so a thousandfold bigger explosion reaches only about ten times further (Hopkinson–Cranz scaling). AEON, one of The Evolution's four simulators, is built on exactly that law, verified against published reference figures.",
    problem: [
      "Some things are too large, too fast, too slow or too violent for intuition to hold — the effects of a weapon, the life of a universe, evolution itself. The Evolution's premise: model them, animate them on a timeline, and let a non-expert feel the scale.",
    ],
    built: [
      {
        title: "Four simulators, no dependencies",
        body: "AEON (weapons consequences), COSMOS (the life and death of a universe), GENLIFE (organisms with genomes and neural brains, speciating under selection) and GENESIS (a particle-and-gravity sandbox). Each is one HTML file — no build step, no server, no network access — about 5,000 lines across the four.",
      },
      {
        title: "AEON: every zone from a published model",
        body: "Air blast via Hopkinson–Cranz cube-root scaling from Glasstone & Dolan; thermal fluence with atmospheric attenuation; prompt radiation; a Lagrangian fallout plume after WSEG-10 with Way–Wigner t^-1.2 decay; cratering and seismic magnitude; Kinney & Graham for conventional explosives; Karzas & Latter for EMP; OTA casualty curves. Terrain shadows the blast; a logarithmic timeline runs from 0.1 ms to 48 hours.",
      },
    ],
    decision: {
      title: "Test the physics like code",
      body: [
        "A simulator that draws for effect is easy; one that is right is not. AEON ships with 85 physics checks against published reference values — the cube-root law to 1e-9, the 1 Mt 5 psi radius at 7.00 km, optimum burst height 178 m at 1 kt — plus a headless smoke test that runs the real renderer through 210 scenarios (3,682 frames, 84,262 draw calls) against a canvas mock that throws on anything a browser would reject.",
        "Scope is a decision too: AEON models consequences only — no weapon design, construction or targeting information — and states that its casualty figures are upper-bound estimates with wide error bars.",
      ],
    },
    result: [
      "Four simulators that open in any browser and run offline, with numbers that trace to sources. AEON's yield slider spans seven orders of magnitude, and the cube-root law is why one exponent can cover them all.",
    ],
    facts: [
      ["Simulators", "4"],
      ["Lines", "≈5,000 total"],
      ["Dependencies", "0"],
      ["AEON physics checks", "85 against published figures"],
      ["Smoke test", "210 scenarios · 3,682 frames"],
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/THE_EVOLUTION" },
      { label: "Run AEON in the browser", href: "/sims/aeon.html" },
    ],
    status: "Open source. Runs offline.",
    keywords: ["cube root scaling blast radius", "physics simulation JavaScript", "zero-dependency canvas simulation", "Hopkinson-Cranz"],
    updated: U,
  },
  {
    slug: "collectors-pulse-ai-newsroom",
    title: "The Collector's Pulse — AI-Curated Newsroom in Next.js",
    description:
      "The Collector's Pulse by Shreyansh Kumar Singh: a daily AI-curated newsroom for trading cards, anime figures and luxury watches, built in Next.js 16 with Gemini, Supabase and a written design system.",
    h1: "The Collector's Pulse: an AI-curated newsroom for collectors",
    question: "How do you build an AI-curated news site that stays fresh and doesn't break?",
    tldr:
      "The Collector's Pulse is a daily newsroom for collectors of trading cards, anime figures and luxury watches: it ingests live news, uses Gemini to classify stories and write article bodies, and publishes them through Supabase — with a fallback chain from database to cached live feed to sample data so the site never renders empty.",
    problem: [
      "Collecting communities live on news — releases, drops, auctions — scattered across feeds, forums and retailer pages. A single daily front page for three very different collecting worlds needs fresh content, and a design that lets each world feel like itself.",
    ],
    built: [
      {
        title: "Ingestion and AI processing",
        body: "Live Google News RSS for each category, a Reddit scraper, and a Gemini processor that classifies stories and writes article bodies; ingestion runs from a cron endpoint and a background worker. Pages read published rows from Supabase first, then a cached live feed (90 s), then sample data.",
      },
      {
        title: "An image pipeline that rejects junk",
        body: "Each story's image is resolved from the feed, then the page's og:image or largest content image, then a category fallback — rejecting interstitial logos, and serving remote URLs on Vercel where the disk is read-only.",
      },
      {
        title: "A hub, a newsroom and article pages",
        body: "An art-driven front door, a filterable newsroom with a top story and trending sidebar, and long-form article pages with related stories and source links, in light and dark themes.",
      },
    ],
    decision: {
      title: "Write the design system before the interface",
      body: [
        "Three collecting worlds could easily average into mud. Instead the design system was written first, giving each category a distinct, non-overlapping job — trading cards in blue, figures in violet, watches in gold — over a dark obsidian base with ember accents, Cormorant, Space Grotesk and Inter, and motion tokens for the living backgrounds.",
      ],
    },
    result: [
      "A Next.js 16 newsroom with six specification documents behind it, a 30-day freshness filter on what counts as news, and an architecture that degrades to a working page at every layer.",
    ],
    facts: [
      ["Collecting worlds", "3"],
      ["Freshness filter", "30 days"],
      ["Spec documents", "6"],
      ["Stack", "Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase · Gemini"],
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/the-collectors-pulse" }],
    status: "Source available on GitHub.",
    keywords: ["AI news site Next.js", "Gemini content pipeline", "AI-curated newsroom", "design system"],
    updated: U,
  },
  {
    slug: "vaultiq-dotnet-angular-clean-architecture",
    title: "VaultIQ — ASP.NET Core 8 + Angular 18 Clean Architecture",
    description:
      "VaultIQ by Shreyansh Kumar Singh: an AI startup-idea generator built with ASP.NET Core 8 in four-layer Clean Architecture and an Angular 18 front end using standalone components and Signals.",
    h1: "VaultIQ: ASP.NET Core 8 and Angular 18 in Clean Architecture",
    question: "What does a Clean Architecture project with ASP.NET Core 8 and Angular 18 Signals look like?",
    tldr:
      "VaultIQ is an AI startup-idea generator laid out the way enterprise .NET teams build to last: an ASP.NET Core 8 Web API in four Clean Architecture layers with EF Core and SQL Server, and an Angular 18 front end built from standalone components with Signals for state.",
    problem: [
      "Prototypes get rewritten the moment a second client arrives. VaultIQ is the enterprise half of the range: a deliberately small product built with the structure a real .NET + Angular team would use, so it could survive that second client.",
    ],
    built: [
      {
        title: "Back end: four layers",
        body: "An ASP.NET Core 8 Web API split into four Clean Architecture layers, with EF Core over SQL Server (run locally in Docker), so business rules don't depend on the database or the web framework.",
      },
      {
        title: "Front end: Angular 18 with Signals",
        body: "Standalone components and Signals instead of NgModules and ad-hoc subscriptions, and a landing page in the product's own violet-and-pink brand.",
      },
    ],
    decision: {
      title: "Structure first, even for a small product",
      body: [
        "Clean Architecture costs more files on day one. The trade is that each layer can be tested and replaced on its own — the same reasoning behind Sarthi's separately testable pipeline stages, applied to a conventional enterprise stack. It mirrors how Shreyansh builds production systems at RamanByte: the API contract and the schema first, then the client that consumes them.",
      ],
    },
    result: [
      "A .NET 8 and Angular 18 codebase that shows the enterprise patterns hiring teams look for — layering, separation of concerns, Signals — in a product small enough to read in an afternoon.",
    ],
    facts: [
      ["Clean Architecture layers", "4"],
      [".NET", "8"],
      ["Angular", "18 (standalone + Signals)"],
      ["Stack", "C# · ASP.NET Core 8 · EF Core · SQL Server · Docker · Angular 18"],
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/Shreyanskumarsingh20/vaultIQ" }],
    status: "Source available on GitHub.",
    keywords: ["ASP.NET Core 8 Clean Architecture", "Angular 18 Signals", ".NET Angular full-stack", "EF Core SQL Server"],
    updated: U,
  },
  {
    slug: "revuelto-scroll-canvas-animation",
    title: "Revuelto: Assembled — Scroll-Driven Canvas Animation",
    description:
      "Revuelto: Assembled by Shreyansh Kumar Singh: a Lamborghini Revuelto that assembles frame by frame as you scroll — 110 WebP frames scrubbed on a canvas, on a 5.5 MB page, in Next.js 16.",
    h1: "Revuelto: Assembled — a car that builds itself as you scroll",
    question: "Is a canvas image sequence better than a video element for scroll-driven product animation?",
    tldr:
      "For scroll-scrubbed product animation, a canvas image sequence beats a <video> element: each scroll position maps to an exact frame that can be drawn instantly in either direction, while seeking a compressed video backwards is slow and imprecise. Revuelto: Assembled scrubs 110 WebP frames of a Lamborghini Revuelto on a canvas — scroll down and it assembles, scroll up and it comes apart — on a 5.5 MB page.",
    problem: [
      "Apple-style product pages tie animation to the scroll bar. The obvious implementations — scrubbing a video, or rebuilding the object in 3D — tend to stutter when scrolled backwards or cost far more than the effect is worth.",
    ],
    built: [
      {
        title: "A frame sequence on a canvas",
        body: "A locked-off clip exported as 110 WebP frames and drawn to a Canvas 2D element according to scroll progress, with Lenis smoothing the scroll and GSAP sequencing the story beats: the exploded intro, mid-assembly, the reveal and the specification section.",
      },
    ],
    decision: {
      title: "Drop Three.js for a canvas",
      body: [
        "A real-time 3D model was the obvious choice and the expensive one. A pre-rendered frame sequence gives photographic quality, deterministic frames in both scroll directions, and a predictable budget — the whole page weighs 5.5 MB — so Three.js and React Three Fiber were dropped in favour of a canvas.",
      ],
    },
    result: [
      "A scroll-driven teardown that runs smoothly forwards and backwards, built in Next.js 16 and React 19 with Tailwind v4 — the motion end of the range.",
    ],
    facts: [
      ["Frames", "110 WebP, scrubbed live"],
      ["Page weight", "5.5 MB"],
      ["3D libraries", "0 — dropped for canvas"],
      ["Stack", "Next.js 16 · React 19 · Canvas 2D · Lenis · GSAP · Tailwind v4"],
    ],
    links: [{ label: "Open the live teardown", href: "/sims/revuelto.html" }],
    status: "Private repository — live demo above.",
    keywords: ["scroll-driven canvas animation", "image sequence vs video", "Apple-style scroll animation", "Lenis GSAP"],
    updated: U,
  },
];

export const caseStudyBySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
