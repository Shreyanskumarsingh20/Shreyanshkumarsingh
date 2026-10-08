// METHOD — two illustrated acts. `art` is raw hand-drawn SVG markup (ported
// verbatim), rendered via dangerouslySetInnerHTML since it's static,
// author-authored decoration, not user input.

export type MethodBeat = {
  n: string;
  title: string;
  body: string;
  ev: string;
};

export type MethodAct = {
  tone: "spec" | "audit";
  chapter: string;
  title: string;
  narrative: string;
  art: string;
  beats: MethodBeat[];
};

export const METHOD_ACTS: MethodAct[] = [
  {
    tone: "spec",
    chapter: "Step 1 — before the code exists",
    title: "Write the specification first",
    narrative:
      "The shape of the thing gets written down first — what it is, what it looks like, where every number came from — so it can be picked up cold by anyone, including a future me.",
    art: `<svg class="method-art" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two stacked specification documents, sealed off with a checkmark and a measurement annotation">
      <g opacity=".22" stroke="var(--gold)" stroke-width=".5">
        <path d="M0 36h240M0 72h240M0 108h240M0 144h240"/>
        <path d="M40 0v180M80 0v180M120 0v180M160 0v180M200 0v180"/>
      </g>
      <rect x="32" y="22" width="132" height="148" fill="var(--blu)" stroke="var(--line)"/>
      <rect x="18" y="8" width="132" height="148" fill="var(--blu-lift)" stroke="var(--gold)" stroke-opacity=".45"/>
      <rect x="32" y="24" width="72" height="7" fill="var(--gold)"/>
      <rect x="32" y="44" width="102" height="3" fill="#9aaabf"/>
      <rect x="32" y="56" width="102" height="3" fill="#9aaabf"/>
      <rect x="32" y="68" width="86" height="3" fill="#9aaabf"/>
      <rect x="32" y="90" width="102" height="3" fill="#9aaabf"/>
      <rect x="32" y="102" width="102" height="3" fill="#9aaabf"/>
      <rect x="32" y="114" width="64" height="3" fill="#9aaabf"/>
      <polygon points="152,9 169,18 169,35 152,44 135,35 135,18" fill="var(--black)" stroke="var(--gold)" stroke-width="1.5"/>
      <path d="M144 27l6 6 11-12" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 164h60M18 158v12M78 158v12" stroke="var(--gold)" stroke-width="1"/>
      <text x="20" y="177" fill="var(--gold)" font-size="9" font-family="JetBrains Mono, ui-monospace, monospace" letter-spacing="1">SPEC FIRST</text>
    </svg>`,
    beats: [
      {
        n: "01",
        title: "Write the project spec before the code",
        body: "Almost every repository ships a PROJECT_BIBLE.md and HANDOFF.md alongside the source, written to be picked up cold.",
        ev: "PROJECT_BIBLE · HANDOFF · AGENTS · CLAUDE — across 5 repositories",
      },
      {
        n: "02",
        title: "Document the design system before building components",
        body: "The visual language gets its own document with named surfaces and roles before a component exists. Reference the token, never hardcode a hex.",
        ev: "DESIGN_SYSTEM.md — every colour tokenised",
      },
      {
        n: "03",
        title: "Trace every number to a published source",
        body: "Blast, thermal and fallout curves cite a published model. ANTARANG uses only verified Wikimedia data.",
        ev: "Model tables in README.md",
      },
    ],
  },
  {
    tone: "audit",
    chapter: "Step 2 — after it ships",
    title: "Audit and stress-test the result",
    narrative:
      "Then it gets turned on itself — attacked like an outsider, run without its safety nets, and judged on whether the tool actually fit the job or just felt familiar.",
    art: `<svg class="method-art" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A hexagonal system diagram with a flagged critical node under a magnifying glass">
      <polygon points="60,20 140,20 180,90 140,160 60,160 20,90" fill="var(--iron)" stroke="var(--line)"/>
      <g stroke="var(--gold)" stroke-width="1" opacity=".5">
        <path d="M100 90L60 20M100 90L180 90M100 90L60 160"/>
      </g>
      <circle cx="100" cy="90" r="4" fill="var(--gold)"/>
      <circle cx="60" cy="20" r="3.5" fill="var(--gold)"/>
      <circle cx="60" cy="160" r="3.5" fill="var(--gold)"/>
      <circle cx="180" cy="90" r="3.5" fill="var(--rosso-text)"/>
      <rect x="150" y="10" width="34" height="16" fill="var(--black)" stroke="var(--rosso-text)" stroke-width="1.2"/>
      <text x="167" y="21" fill="var(--rosso-text)" font-size="8" font-family="JetBrains Mono, ui-monospace, monospace" text-anchor="middle" letter-spacing=".5">P0</text>
      <circle cx="196" cy="86" r="30" fill="var(--black)" fill-opacity=".55" stroke="var(--rosso-text)" stroke-width="2.6"/>
      <path d="M180 86h32M196 70v32" stroke="var(--rosso-text)" stroke-width="1" opacity=".6"/>
      <path d="M217 107l19 19" stroke="var(--rosso-text)" stroke-width="6" stroke-linecap="round"/>
      <path d="M20 166h60M20 160v12M80 160v12" stroke="var(--rosso-text)" stroke-width="1"/>
      <text x="26" y="179" fill="var(--rosso-text)" font-size="9" font-family="JetBrains Mono, ui-monospace, monospace" letter-spacing="1">PROVE IT</text>
    </svg>`,
    beats: [
      {
        n: "04",
        title: "Security-audit my own code like an attacker",
        body: "SARTHI ships a full static self-review, graded P0 to P3, most damaging finding written first.",
        ev: "QA_AUDIT.md",
      },
      {
        n: "05",
        title: "Fail gracefully when a service is missing",
        body: "BookVerse runs fully without an API key and says so with a badge. Nythera's internal mode is off by default.",
        ev: "Preview-mode fallback · internal mode default-off",
      },
      {
        n: "06",
        title: "Choose the right tool for each problem",
        body: "Vanilla canvas physics. Python security tooling. R3F galleries. Next.js RAG. ASP.NET Clean Architecture. A canvas frame-sequence scrubbed to scroll instead of a video element. The range is deliberate.",
        ev: "9 repositories · TS · JS · Python · C# · WebGL",
      },
    ],
  },
];
