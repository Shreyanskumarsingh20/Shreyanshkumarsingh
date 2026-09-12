// THE BUILD — six chapters, three entrance effects rotated across them
// (rise-3d / rise-flip / rise-pop, all defined in globals.css) so no two in
// a row arrive the same way. Icons are raw hand-drawn SVG markup (ported
// verbatim, one viewBox="0 0 120 120" scene per chapter), rendered via
// dangerouslySetInnerHTML since it's static decoration, not user input.

export type BuildChapter = {
  no: string;
  effect: "rise-3d" | "rise-flip" | "rise-pop";
  title: string;
  lines: string[];
  pipeline?: string[];
  emph: string;
};

export const BUILD_ICONS: Record<string, string> = {
  // 01 — a lightbulb switching on: the idea, before anything else.
  "01": `<path class="build-icon-path" pathLength="1" d="M46,96 L46,84 C36,76 30,64 30,52 C30,30 46,16 62,16 C78,16 94,30 94,52 C94,64 88,76 78,84 L78,96 Z"/>
    <path class="build-icon-path" pathLength="1" d="M50,102 L74,102 M52,110 L72,110"/>
    <path class="build-icon-path build-icon-accent" pathLength="1" d="M48,50 L56,64 L62,44 L68,64 L76,50"/>`,
  // 02 — a focus ring finding a person: not designing for screens, for people.
  "02": `<circle class="build-icon-path build-icon-accent" pathLength="1" cx="60" cy="60" r="42"/>
    <path class="build-icon-path" pathLength="1" d="M60,8 L60,22 M60,98 L60,112 M8,60 L22,60 M98,60 L112,60"/>
    <circle class="build-icon-path" pathLength="1" cx="60" cy="50" r="11"/>
    <path class="build-icon-path" pathLength="1" d="M40,88 C40,72 48,64 60,64 C72,64 80,72 80,88"/>`,
  // 03 — a scribble resolving into three plain, connected points: chaos, then a system.
  "03": `<path class="build-icon-path build-icon-accent" pathLength="1" d="M8,60 C16,42 24,78 18,54 C22,40 32,66 28,50 C32,40 40,60 36,48"/>
    <path class="build-icon-path" pathLength="1" d="M56,60 L112,60"/>
    <circle class="build-icon-path build-icon-fill" pathLength="1" cx="56" cy="60" r="4"/>
    <circle class="build-icon-path build-icon-fill" pathLength="1" cx="84" cy="60" r="4"/>
    <circle class="build-icon-path build-icon-fill" pathLength="1" cx="112" cy="60" r="4"/>`,
  // 04 — a stress spike: what happens when 100,000 people arrive tomorrow.
  "04": `<path class="build-icon-path" pathLength="1" d="M8,90 L26,86 L40,92 L52,38 L64,102 L78,62 L92,80 L112,18"/>
    <path class="build-icon-path build-icon-accent" pathLength="1" d="M8,104 L112,104"/>`,
  // 05 — a small neural net: software that understands, not just waits.
  "05": `<path class="build-icon-path" pathLength="1" d="M30,26 L90,26 M30,26 L60,66 M90,26 L60,66 M60,66 L60,104"/>
    <circle class="build-icon-path build-icon-fill build-icon-accent" pathLength="1" cx="30" cy="26" r="5"/>
    <circle class="build-icon-path build-icon-fill build-icon-accent" pathLength="1" cx="90" cy="26" r="5"/>
    <circle class="build-icon-path build-icon-fill" pathLength="1" cx="60" cy="66" r="5"/>
    <circle class="build-icon-path build-icon-fill" pathLength="1" cx="60" cy="104" r="5"/>`,
  // 06 — a loop that keeps turning: the next version is always waiting.
  "06": `<g class="build-icon-spin">
      <circle class="build-icon-path" pathLength="1" cx="60" cy="60" r="38"/>
      <path class="build-icon-fill build-icon-accent" d="M60,16 L52,30 L68,30 Z"/>
    </g>`,
};

export const BUILD_CHAPTERS: BuildChapter[] = [
  {
    no: "01",
    effect: "rise-3d",
    title: "It starts with a “why”",
    lines: [
      "Before I write a single line of code, I ask:",
      "Why does this need to exist?",
    ],
    emph: "Because a feature without a purpose is just another button.",
  },
  {
    no: "02",
    effect: "rise-flip",
    title: "Then I find the human",
    lines: [
      "Behind every click… there's a person trying to get something done.",
      "So I don't design for screens.",
    ],
    emph: "I design for people.",
  },
  {
    no: "03",
    effect: "rise-pop",
    title: "I turn chaos into systems",
    lines: ["An idea looks simple. Until you open the door."],
    pipeline: ["UI", "API", "Logic", "Database", "AI", "Reality"],
    emph: "My job is to make all that complexity feel like one simple experience.",
  },
  {
    no: "04",
    effect: "rise-3d",
    title: "Then I try to break it",
    lines: [
      "What if the API dies? What if the user taps twice?",
      "What if 100,000 people arrive tomorrow? What if everything goes wrong?",
    ],
    emph: "That's when the real engineering begins.",
  },
  {
    no: "05",
    effect: "rise-flip",
    title: "I make software learn",
    lines: [
      "Software used to wait for instructions.",
      "Now it can understand them.",
    ],
    pipeline: ["Data", "Context", "Intelligence", "Action"],
    emph: "That's where I believe software is going.",
  },
  {
    no: "06",
    effect: "rise-pop",
    title: "Build. Break. Rebuild.",
    lines: [
      "Nothing I build is ever really finished.",
      "Every bug teaches. Every user teaches. Every failure teaches.",
    ],
    emph: "The next version is always waiting.",
  },
];
