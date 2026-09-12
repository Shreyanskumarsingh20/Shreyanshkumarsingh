// RESEARCH — the evidence wall: 6 case files, one per source project, each
// fronted by a small hand-drawn SVG exhibit icon. Icons are stored as raw
// markup (rendered via dangerouslySetInnerHTML in CaseIcon) since they're
// static, author-authored decorative SVGs ported verbatim from index.html —
// not user input.

export type ResearchNote = {
  n: string;
  title: string;
  finding: string;
};

export type ResearchCase = {
  caseNo: string;
  project: string;
  icon: string;
  notes: ResearchNote[];
};

export const RESEARCH_CASES: ResearchCase[] = [
  {
    caseNo: "CASE 01",
    project: "THE EVOLUTION",
    icon: `<svg viewBox="0 0 24 24"><path d="M3 20h18M3 20V3" stroke="var(--steel)" stroke-width="1"/><path d="M3 20 Q7 20 9 14 T15 6 Q18 3 21 3" fill="none" stroke="var(--gold)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    notes: [
      {
        n: "R-01",
        title: "Cube-root scaling as the spine of a consequence model",
        finding:
          "A thousandfold increase in yield multiplies the damage radius by ten, not a thousand — one exponent covers seven orders of magnitude.",
      },
      {
        n: "R-02",
        title: "Lagrangian parcels instead of an ellipse",
        finding:
          "Fallout dose becomes a function of position and time-since-detonation — activity falls ~100× in the first two days (Way–Wigner t^-1.2).",
      },
    ],
  },
  {
    caseNo: "CASE 02",
    project: "NYTHERA",
    icon: `<svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="7" fill="none" stroke="var(--rosso-text)" stroke-width="1.6"/><path d="M6 12l2 2 4-5" stroke="var(--rosso-text)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="17" y="5" width="5" height="13" rx="2.5" fill="none" stroke="var(--steel)" stroke-width="1.3"/><circle cx="19.5" cy="8.5" r="1.4" fill="var(--steel)"/></svg>`,
    notes: [
      {
        n: "R-03",
        title: "A finding is not a finding until it is confirmed",
        finding:
          "Every active check needs physical evidence — a DB error signature, a reflected payload, real command output — or it's discarded, not downgraded.",
      },
      {
        n: "R-04",
        title: "The dangerous capability is the one you default to off",
        finding:
          "Internal-network scanning is a separate, explicitly authorized switch, host-locked with include/exclude rules and a rate limiter in front.",
      },
    ],
  },
  {
    caseNo: "CASE 03",
    project: "IDBI SARTHI",
    icon: `<svg viewBox="0 0 24 24"><g fill="none" stroke="var(--gold)" stroke-width="1.4"><rect x="2" y="4" width="7" height="7"/><rect x="15" y="4" width="7" height="7"/><rect x="2" y="15" width="7" height="7"/><rect x="15" y="15" width="7" height="7"/></g><path d="M9 7.5h6M12 11v2M5.5 11v4M18.5 11v4" stroke="var(--steel)" stroke-width="1"/></svg>`,
    notes: [
      {
        n: "R-05",
        title: "Splitting RAG into four modules that can each be wrong alone",
        finding:
          "Embeddings, vectors, retrieval and generation are separate modules — each stage independently inspectable and replaceable.",
      },
      {
        n: "R-06",
        title: "Auditing your own code as the attacker",
        finding:
          "P0 self-reported: no auth on any endpoint, sequential enumerable IDs — scrapeable with a for-loop. Published, not quietly patched.",
      },
    ],
  },
  {
    caseNo: "CASE 04",
    project: "ANTARANG",
    icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="var(--gold)" stroke-width="1" opacity=".5"/><circle cx="12" cy="12" r="3" fill="var(--gold)"/><path d="M2 12h4M18 12h4" stroke="var(--gold)" stroke-width="1" opacity=".7"/></svg>`,
    notes: [
      {
        n: "R-07",
        title: "A single permitted source, and what to do about copyright",
        finding:
          "Verified Wikipedia/Wikimedia data only; in-copyright modern artists become biography nodes rather than invented reproductions.",
      },
      {
        n: "R-08",
        title: "Jitter is a bigger problem than framerate",
        finding:
          "A focus raycast throttled to ~10×/s fixed perceived smoothness more than any framerate tuning did.",
      },
    ],
  },
  {
    caseNo: "CASE 05",
    project: "THE COLLECTOR'S PULSE",
    icon: `<svg viewBox="0 0 24 24"><rect x="1.5" y="9" width="6" height="6" fill="#2E8BFF"/><rect x="9" y="9" width="6" height="6" fill="#C24BF5"/><rect x="16.5" y="9" width="6" height="6" fill="#E8C96A"/></svg>`,
    notes: [
      {
        n: "R-09",
        title: "Writing the design system before the interface",
        finding:
          "Three marques, three non-overlapping jobs — averaging references produces mud; assigning each a distinct role produces a system.",
      },
    ],
  },
  {
    caseNo: "CASE 06",
    project: "HALLOGENAI",
    icon: `<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="var(--steel)" stroke-width="1.3"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="var(--gold)" stroke-width="1.4"/><path d="M10.4 12.1l1.2 1.2 2.1-2.5" stroke="var(--gold)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    notes: [
      {
        n: "R-10",
        title: "Evidence outranks the commit log",
        finding:
          "A bug is never marked fixed because code changed or a commit exists — only because its actual behavior in the QA environment, captured as evidence, says so.",
      },
    ],
  },
];
