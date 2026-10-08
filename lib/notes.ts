// /notes — short technical articles, each answering one question from the
// client's brief (§3) that his own projects answer first-hand. Answer first,
// then the evidence. Sources: the projects' repositories and docs, the
// brief, and the site's case studies. Kept deliberately few and specific —
// no filler articles.

export type NoteSection = { h: string; p?: string[]; list?: string[]; code?: { lang: string; text: string } };
export type Note = {
  slug: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  sections: NoteSection[];
  /** the case study this note comes from */
  project?: string;
  /** where the note comes from when it isn't one of the nine projects */
  context?: { label: string; href: string };
  published: string;
  updated: string;
  keywords: string[];
};

const D = "2026-10-08";

export const NOTES: Note[] = [
  {
    slug: "ai-pentest-agent-false-positives",
    title: "How Autonomous Pentest Tools Avoid False Positives",
    description:
      "An autonomous penetration-testing tool avoids false positives by reporting only findings it can prove with physical evidence. How Nythera validates SQLi, XSS, command injection, LFI, SSTI and redirects.",
    question: "How do autonomous penetration-testing tools avoid reporting false positives?",
    answer:
      "By refusing to report anything they can't prove. A finding should only reach the report when the scanner has captured physical evidence of exploitation — a database error signature, an unencoded reflection of a unique payload, real command output, a known file signature, or a template expression that actually evaluated — and anything without that evidence should be discarded, not downgraded to 'possible'.",
    sections: [
      {
        h: "Why 'possible' findings are the real problem",
        p: [
          "A report with forty 'possible' issues trains a team to ignore the report. The one real vulnerability gets ignored with the rest. So the useful design goal for an automated scanner isn't maximum coverage of suspicions — it's a report where every line is something a developer can reproduce.",
          "Nythera, an open-source scanner Shreyansh built for in-house web applications, is designed around that rule: every active check carries its own proof criterion, and a check that can't meet it produces nothing.",
        ],
      },
      {
        h: "What counts as evidence, per vulnerability class",
        list: [
          "SQL injection — a database error signature in the response, or boolean inference: a true condition and a false condition produce consistently different responses.",
          "Reflected XSS — a unique payload comes back unencoded in the response body, so it would execute.",
          "OS command injection — the output of an injected command appears in the response.",
          "Path traversal / LFI — the response contains the signature of a known operating-system file.",
          "Server-side template injection — a template expression is evaluated (a maths expression comes back as its result), then confirmed with a second expression.",
          "Open redirect — the Location header actually points at the attacker-supplied host.",
          "Broken access control — the same request as an authenticated and an anonymous user returns the protected data both times.",
        ],
      },
      {
        h: "Discard, don't downgrade",
        p: [
          "The tempting compromise is to keep unconfirmed hits as 'low confidence'. That quietly reintroduces the noise. If a payload was reflected but encoded, there's no XSS; if an error appeared but isn't a database error, there's no SQL injection. The finding is dropped.",
          "This also makes the CI integration trustworthy: Nythera's headless mode exits with a failure code only when a finding at or above a chosen severity exists, so a red build always means a proven issue.",
        ],
      },
      {
        h: "Where an LLM agent fits",
        p: [
          "An LLM agent can reason about a target and suggest further probes, and Nythera includes one as an optional phase. But it sits on top of the validated checks, not in place of them: anything the agent proposes still has to produce evidence before it's reported.",
        ],
      },
      {
        h: "Should internal-network scanning be off by default?",
        p: [
          "Yes. Scanning localhost and private address ranges is what makes a tool useful for in-house testing — and what makes it dangerous when it's pointed at the wrong place. In Nythera internal mode is off by default and has to be enabled explicitly; requests stay locked to the target host with include/exclude rules and a rate limiter; private hosts are refused unless internal mode is on; and every scan requires confirming authorization first.",
        ],
      },
    ],
    project: "nythera-ai-penetration-testing-agent",
    published: D,
    updated: D,
    keywords: ["autonomous penetration testing false positives", "AI pentest agent", "validated findings", "SQL injection boolean inference"],
  },
  {
    slug: "ai-app-security-self-audit-p0-p3",
    title: "An Honest Security Self-Audit of an AI App, P0 to P3",
    description:
      "What an honest security self-audit of an AI application looks like: findings graded P0 to P3, worst first, with prompt injection, missing auth and unmetered LLM endpoints at the top — and fixes published alongside.",
    question: "What does an honest security self-audit of an AI application look like, and how should findings be ranked P0 to P3?",
    answer:
      "Review your own system as an outsider would, write every finding down graded by consequence — P0 for security and data exposure, P1 for crashes, P2 for correctness and scale, P3 for polish — lead with the worst, and keep the document next to the fixes. For AI apps, the P0s are usually the same three: no authentication, prompt injection through user-controlled message history, and an unmetered paid model endpoint.",
    sections: [
      {
        h: "The grading scale",
        list: [
          "P0 — Critical: security loopholes and data exposure. Fix before anyone real touches it.",
          "P1 — High: crashes and robustness — malformed input, unhandled errors, error bodies rendered as data.",
          "P2 — Medium: correctness and scale — wrong results at the edges, work recomputed on every request, missing pagination.",
          "P3 — Low: polish — leftover scaffolding, misleading labels, platform-specific scripts.",
        ],
      },
      {
        h: "The three P0s that show up in AI apps",
        p: [
          "In the audit Shreyansh wrote against Sarthi — his AI relationship-manager copilot for banking — the worst findings were exactly these:",
        ],
        list: [
          "No authentication on any endpoint, with sequential record IDs: the whole (synthetic) customer book could be scraped with a for-loop.",
          "Prompt injection via chat history: the API accepted a caller-supplied 'system' role in the history array and forwarded it to the model — a full policy override from one request. The fix is to whitelist roles (anything not 'assistant' becomes 'user') and cap history length.",
          "No rate limit in front of a paid LLM API: one script could run up the bill or exhaust the key. The fix is a per-IP limit with a stricter cap on the chat route, plus a hard budget.",
        ],
      },
      {
        h: "What the lower tiers catch",
        p: [
          "The P1s were the classic prototype crash paths: clients that never check the response status before parsing it, POST routes that throw on malformed JSON, and inputs that are type-cast instead of validated — even though a validation library was already installed. P2 caught an analytics route recomputing every score on every request (some twice), a hard-coded cap that silently skipped records, and a chart built on Math.random().",
          "One P3 is worth singling out for AI work: an 'explainable AI' view whose contributions didn't actually sum to the prediction. Fine as a visual; wrong to call it SHAP in a compliance setting. Honest labelling is part of the audit.",
        ],
      },
      {
        h: "Publish it, and say what you deferred",
        p: [
          "The audit stayed in the repository alongside four batches of fixes. Just as important, it names what was deliberately not done — per-user authorization and a move off in-memory data — because a prototype on synthetic data doesn't need them, and a production system would. That sentence is what separates a hackathon build from something you could put in front of real customers.",
        ],
      },
    ],
    project: "sarthi-rag-banking-copilot",
    published: D,
    updated: D,
    keywords: ["AI application security audit", "prompt injection chat history", "LLM rate limiting", "P0 P1 P2 P3 severity"],
  },
  {
    slug: "ai-agent-bug-fix-verification",
    title: "How an AI Agent Can Verify a Bug Is Actually Fixed",
    description:
      "An AI agent verifies a bug fix by reproducing the original bug against the running application and checking the observed behavior — not by reading the commit. How HallogenAI's eight agents do it.",
    question: "How can an AI agent verify that a bug is actually fixed rather than trusting the commit log?",
    answer:
      "Make it re-run the bug, not read the diff: the agent reproduces the reported steps against the live QA environment, captures what the application actually does, and marks the bug fixed only if that evidence shows the defect is gone. If the evidence can't be produced, the result is 'not verified' — never 'probably fixed'.",
    sections: [
      {
        h: "Why the commit log is the wrong signal",
        p: [
          "A commit that touches the right file says someone tried. It doesn't say the behavior changed in the environment the bug was reported in — config, data and deployment all sit between the two. Teams that close tickets on commits find out about the gap from users.",
        ],
      },
      {
        h: "Split the job into narrow agents",
        p: [
          "HallogenAI, which Shreyansh built, coordinates eight specialized agents across five stages instead of asking one general agent to improvise the whole thing:",
        ],
        list: [
          "Intake — take in the bug report as written.",
          "Understand — turn it into concrete, reproducible steps and an expected behavior.",
          "Automate — drive the application through those steps with a real browser (Playwright).",
          "Evidence — capture what actually happened at each step.",
          "Report — compare observed with expected and write the verdict.",
        ],
      },
      {
        h: "The rule that makes it work: never guess",
        p: [
          "Every stage can fail, and the system is built to say so rather than fill the gap. If the steps can't be reproduced, or the evidence is ambiguous, the bug isn't marked fixed. Typed data models (Pydantic v2, SQLAlchemy) keep each report, step and verdict explicit, so 'not verified' is a first-class outcome, not a silent default.",
          "It's the same standard Nythera applies to security findings: evidence or it didn't happen.",
        ],
      },
    ],
    project: "hallogenai-multi-agent-bug-fix-verification",
    published: D,
    updated: D,
    keywords: ["AI agent bug fix verification", "multi-agent QA", "Playwright AI agents", "QA automation evidence"],
  },
  {
    slug: "modular-rag-pipeline-architecture",
    title: "How to Structure a RAG Pipeline You Can Test Stage by Stage",
    description:
      "Structure a RAG pipeline as separate embedding, storage, retrieval and generation stages with fixed contracts, so each can be tested and replaced on its own. Lessons from Sarthi, a RAG copilot for banking.",
    question: "How should a RAG pipeline be structured so each stage can be tested and replaced independently?",
    answer:
      "Split it into four stages with explicit contracts — embedding (text in, vectors out), storage (vectors and their source passages), retrieval (question in, ranked passages out) and generation (question plus passages in, cited answer out) — and test each stage against its own fixed inputs. Then a weak stage shows up on its own scorecard instead of hiding behind a fluent final answer.",
    sections: [
      {
        h: "The failure a monolithic pipeline hides",
        p: [
          "When a RAG system gives a wrong answer, the cause is usually upstream: the right passage was never retrieved, or was chunked so badly it lost its meaning. But if retrieval and generation live in one function, the only thing you can evaluate is the final answer — and a capable model will write a confident, fluent answer from the wrong passage. The bug looks like a model problem and isn't.",
        ],
      },
      {
        h: "Four stages, four contracts",
        list: [
          "Embedding — text in, vectors out. Testable on its own: the same text gives the same vector, and near-duplicate passages land near each other.",
          "Storage — vectors plus the passage, source and metadata they came from. Testable on its own: everything you indexed can be found again with its provenance intact.",
          "Retrieval — question in, ranked passages out. Testable on its own with a fixed set of questions whose correct source passages you know.",
          "Generation — question plus passages in, answer with citations out. Testable on its own by feeding it known-good passages, so you measure the model rather than the retriever.",
        ],
      },
      {
        h: "Why 'replaceable' matters as much as 'testable'",
        p: [
          "In Sarthi, Shreyansh's AI relationship-manager copilot for banking, the pipeline is organised as these separate modules. That made the prototype honest about its own maturity: its retrieval stage could start simple — the first version answered from the bank's policy corpus with straightforward keyword retrieval — behind the same interface a vector retriever implements, so upgrading retrieval doesn't touch generation, and the generation tests keep passing while retrieval improves.",
          "The same separation lets you swap embedding models or vector stores without re-validating the whole system, and makes cost and latency attributable to a stage.",
        ],
      },
      {
        h: "Grounding is a generation-stage contract",
        p: [
          "Citations belong in the generation contract: the model is given numbered passages and must reference them. In Sarthi's chat, answers cite the bank's own policy identifiers rather than general knowledge — which is only checkable because the passages that went in are known.",
        ],
      },
    ],
    project: "sarthi-rag-banking-copilot",
    published: D,
    updated: D,
    keywords: ["RAG pipeline architecture", "modular RAG", "test RAG retrieval separately", "RAG for banking documents"],
  },
  {
    slug: "blast-radius-cube-root-scaling",
    title: "Why Blast Radius Scales With the Cube Root of Yield",
    description:
      "Blast damage radius scales with the cube root of explosive yield because blast energy fills a volume. The Hopkinson–Cranz law, verified in AEON: 1,000× the yield reaches only 10× further.",
    question: "Why does blast damage radius scale with the cube root of yield?",
    answer:
      "Because a blast's energy spreads through a volume, and volume grows with the cube of distance: to get the same overpressure at a larger distance R, you need energy proportional to R³, so R grows as the cube root of the energy. That's Hopkinson–Cranz scaling — a thousand times the yield moves any given overpressure contour only about ten times further out.",
    sections: [
      {
        h: "The law in one line",
        p: [
          "Overpressure at distance R from an explosion of yield W depends only on the scaled distance Z = R / W^(1/3). Two explosions produce the same overpressure wherever they have the same Z. Double the radius and you need eight times the yield to reach the same overpressure there.",
        ],
      },
      {
        h: "What that looks like with real numbers",
        p: [
          "AEON, the weapons-consequence simulator in Shreyansh's The Evolution, builds its air-blast model on this law from the 1 kt reference curve in Glasstone & Dolan, and its test suite checks it against published figures: the cube-root law to 1e-9, the 5 psi radius of a 1 Mt burst at 7.00 km, and the optimum burst height at 178 m for 1 kt versus 1,780 m for 1 Mt — a thousandfold yield, a tenfold height. One exponent is why a single slider can span seven orders of magnitude of yield.",
        ],
      },
      {
        h: "Not every effect follows it",
        p: [
          "Cube-root scaling is a blast law. Other effects scale differently, which is why a consequence model can't use one radius for everything: thermal fluence falls off with the square of distance plus atmospheric attenuation, prompt radiation follows its own exponential attenuation, and crater radius in AEON scales closer to Y^(1/3.4). Each zone in AEON comes from its own published model for exactly that reason.",
        ],
      },
      {
        h: "Scope",
        p: [
          "AEON models consequences only — blast, heat, radiation, cratering and fallout — for the same reason public references like The Effects of Nuclear Weapons exist: the numbers are otherwise abstract. It contains no weapon design or targeting information, and its casualty figures are labelled as upper-bound estimates with wide error bars.",
        ],
      },
    ],
    project: "the-evolution-physics-simulators",
    published: D,
    updated: D,
    keywords: ["cube root scaling blast radius", "Hopkinson-Cranz scaling", "scaled distance", "blast overpressure yield"],
  },
  {
    slug: "react-three-fiber-raycast-throttling",
    title: "Reduce Jitter in React Three Fiber Without Raising FPS",
    description:
      "Perceived jitter in a React Three Fiber scene often comes from per-frame work like raycasting, not low frame rate. Throttling a focus raycast to ~10 times a second fixed it in Antarang's walkable 3D museum.",
    question: "How do you reduce jitter in a React Three Fiber scene without raising the frame rate?",
    answer:
      "Find the per-frame work that changes what's on screen and run it less often. In Antarang's walkable 3D museum, the centre-screen raycast that decides which artwork you're focused on ran every frame; throttling it to about ten times a second made the gallery feel smoother than any frame-rate tuning did.",
    sections: [
      {
        h: "Jitter isn't the same as low FPS",
        p: [
          "A scene can hold 60 frames per second and still feel jittery. The usual cause is state that flips back and forth between frames: a focus highlight toggling as the crosshair sits on the edge of a frame, a label re-rendering, a React state update every frame that re-renders part of the tree. Each frame is on time; the content is unstable.",
        ],
      },
      {
        h: "Throttle the raycast",
        p: [
          "A raycast every frame is both expensive and twitchy. Accumulate time in useFrame and only cast when enough has passed — and only set React state when the focused object actually changes:",
        ],
        code: {
          lang: "tsx",
          text: `// illustrative — the pattern, not Antarang's exact source
const raycaster = new THREE.Raycaster();
const centre = new THREE.Vector2(0, 0);
let acc = 0;

useFrame((state, delta) => {
  acc += delta;
  if (acc < 0.1) return;            // ~10 checks per second
  acc = 0;
  raycaster.setFromCamera(centre, state.camera);
  const hit = raycaster.intersectObjects(artworks, false)[0];
  const id = hit?.object.userData.id ?? null;
  if (id !== focusedRef.current) {  // update state only on change
    focusedRef.current = id;
    setFocused(id);
  }
});`,
        },
      },
      {
        h: "Then hold the frame rate cheaply",
        p: [
          "Once the jitter is gone, protect the frame rate on weaker GPUs instead of chasing it everywhere: Antarang caps the device pixel ratio (to 1.8), uses drei's PerformanceMonitor and AdaptiveDpr to lower resolution under load, code-splits the 3D gallery out of the first page load, and turns off decorative motion (dust motes, head-bob) under reduced-motion settings.",
        ],
      },
    ],
    project: "antarang-3d-art-museum-react-three-fiber",
    published: D,
    updated: D,
    keywords: ["React Three Fiber jitter", "raycast throttling", "R3F performance", "useFrame raycaster"],
  },
  {
    slug: "canvas-image-sequence-vs-video-scroll-animation",
    title: "Canvas Image Sequence vs Video for Scroll Animation",
    description:
      "For scroll-scrubbed product animation, a canvas image sequence beats a video element: exact frames in both directions without seek stutter. Trade-offs and numbers from Revuelto: Assembled (110 frames, 5.5 MB).",
    question: "Is a canvas image sequence better than a video element for scroll-driven product animation in Next.js?",
    answer:
      "For animation scrubbed directly by the scroll bar, yes: a canvas image sequence maps each scroll position to one exact, already-decoded frame and draws it instantly in either direction, while seeking a compressed video — especially backwards — waits on the decoder and stutters. Use video when the clip plays on its own; use a frame sequence when the user's scroll is the playhead.",
    sections: [
      {
        h: "Why video seeking stutters",
        p: [
          "Compressed video stores occasional keyframes and encodes most frames as differences from earlier ones. To show an arbitrary frame the browser decodes forward from the previous keyframe — cheap when playing forward, slow and uneven when the user scrubs back and forth. You can re-encode with every frame as a keyframe, but then the file balloons.",
        ],
      },
      {
        h: "How the frame sequence works",
        p: [
          "Revuelto: Assembled — a Lamborghini Revuelto that assembles as you scroll and comes apart as you scroll back — uses 110 WebP frames drawn to a Canvas 2D element. Scroll progress picks the frame index; drawing an already-loaded image is a single drawImage call, so forwards and backwards cost the same. Lenis smooths the scroll input and GSAP sequences the story beats around it. The whole page weighs 5.5 MB.",
        ],
      },
      {
        h: "The trade-offs to plan for",
        list: [
          "Download size: you ship every frame. Keep the frame count to what the motion needs and compress frames as WebP or AVIF.",
          "Memory: decoded frames cost width × height × 4 bytes each, so frame size matters more than file size on phones.",
          "Loading: draw the first frame immediately and load the rest progressively, so the page is usable before the sequence is complete.",
          "Why not real-time 3D: Three.js or React Three Fiber can rebuild the object live, but a pre-rendered sequence gives photographic quality and a predictable budget — Revuelto dropped 3D for exactly that reason.",
        ],
      },
    ],
    project: "revuelto-scroll-canvas-animation",
    published: D,
    updated: D,
    keywords: ["scroll-driven canvas animation", "image sequence vs video", "Apple-style scroll animation Next.js", "canvas frame scrubbing"],
  },
  {
    slug: "distributed-k6-load-testing",
    title: "Load-Testing a Mobile Backend With k6 Across Machines",
    description:
      "How to load-test a mobile app's backend with k6 across several machines before a fixed launch date: DadaLoad's controller-and-agents design, a scripted buyer journey, and how to aggregate results correctly.",
    question: "How do you load-test a mobile app's backend with k6 across several machines before a fixed launch date?",
    answer:
      "Run k6 as an agent on each machine, coordinate them from one controller that splits the target request rate and starts them together, script the real user journey rather than single endpoints, and merge the raw results instead of averaging per-machine summaries. For the Dada Udyogini launch, Shreyansh designed DadaLoad to do exactly that across up to ten Windows machines.",
    sections: [
      {
        h: "Why one machine isn't enough",
        p: [
          "A single load generator runs out of CPU, sockets or bandwidth before a real backend does, and then you're measuring the generator. When the launch date is fixed and public — Dada Udyogini's two Flutter apps went live together at a launch event in Maharashtra — the team needs proof of capacity beforehand, not a guess.",
        ],
      },
      {
        h: "DadaLoad's design",
        list: [
          "Agents: a .NET Worker Service on each Windows machine that runs k6 locally.",
          "Controller: an ASP.NET Core service that distributes the target requests-per-second across connected agents and starts and stops them together, over SignalR.",
          "Journey: a scripted buyer path against the real API — login, browse, product, cart, checkout, order — because the expensive requests are the ones in the middle of a flow.",
          "Results: live metrics streamed back during the run, and final reports exported as PDF, XLSX and JSON.",
        ],
      },
      {
        h: "Aggregate correctly",
        p: [
          "The most common mistake with distributed load tests is averaging each machine's p95 latency. Percentiles don't average: the p95 across all requests can be far from the mean of per-machine p95s. Collect raw timings (or mergeable histograms) centrally and compute percentiles once over the whole run.",
        ],
      },
      {
        h: "Make it realistic",
        list: [
          "Seed realistic data first — catalogue size and user counts change query plans.",
          "Add think time between steps so request rates match how people actually use the app.",
          "Ramp up instead of starting at peak, and hold at the target long enough to see slow leaks.",
          "Watch the backend's own metrics (database, CPU, queue depth) alongside the client-side numbers.",
        ],
      },
    ],
    // DadaLoad is RamanByte production work, not one of the nine projects
    context: { label: "Dada Udyogini at RamanByte", href: "/experience#case-5" },
    published: D,
    updated: D,
    keywords: ["distributed k6 load testing", "k6 multiple machines", "load test mobile backend", "k6 percentile aggregation"],
  },
];

export const noteBySlug = (slug: string) => NOTES.find((n) => n.slug === slug);
export const noteHref = (slug: string) => `/notes/${slug}`;
