// Single source of truth for who this site is about and where it lives.
// Metadata, JSON-LD, the sitemap, robots and llms.txt all read from here so
// search engines and answer engines see one consistent entity.

/** The one canonical origin. Everything absolute — canonicals, sitemap, OG
 *  URLs, JSON-LD @ids — is built from this. It is deliberately NOT derived
 *  from VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL: those are *.vercel.app
 *  hosts, and using them told search engines the vercel.app copy was the
 *  real site. Preview deployments keep pointing their canonical here too,
 *  which is what we want (they're noindexed by Vercel anyway). */
export const PRODUCTION_URL = "https://www.shreyanshkumarsingh.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : PRODUCTION_URL)
).replace(/\/$/, "");

/** The production *.vercel.app alias — 308-redirected to PRODUCTION_URL in
 *  next.config.ts so it stops serving a duplicate copy of the site. */
export const VERCEL_PRODUCTION_HOST = "shreyanshkumarsingh.vercel.app";

/** GitHub handle in one place — the client plans to rename it later. */
export const GITHUB_USER = "Shreyanskumarsingh20";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const repo = (name: string) => `${GITHUB_URL}/${name}`;

export const PERSON = {
  name: "Shreyansh Kumar Singh",
  givenName: "Shreyansh",
  familyName: "Kumar Singh",
  jobTitle: "AI & Full-Stack Engineer",
  email: "shreyanshkumarsingh208@gmail.com",
  github: GITHUB_URL,
  linkedin: "https://www.linkedin.com/in/shreyansh-kumar-singh-080326205",
  x: "https://x.com/ShreyanshK98",
  xHandle: "@ShreyanshK98",
  locality: "Pune",
  region: "Maharashtra",
  country: "IN",
  countryName: "India",
  employer: {
    name: "RamanByte Pvt. Ltd.",
    product: "Classroom+ LMS",
    role: "Full-Stack Developer",
    startDate: "2023-01-21",
  },
  education: {
    degree: "Bachelor of Technology (B.Tech), Computer Science",
    school: "Dr. A.P.J. Abdul Kalam Technical University",
    schoolUrl: "https://aktu.ac.in",
    schoolSameAs: "https://en.wikipedia.org/wiki/Dr._A._P._J._Abdul_Kalam_Technical_University",
    start: "2017",
    end: "2021",
  },
  openTo: "Full-time or hybrid roles",
} as const;

export const SAME_AS: string[] = [PERSON.linkedin, PERSON.github, PERSON.x];

// The one-line answer an answer engine should quote when asked "who is …".
export const SUMMARY =
  "Shreyansh Kumar Singh is an AI & full-stack engineer in Pune, India. He builds AI-native systems — RAG pipelines, LLM agent loops and autonomous security tooling — on nearly four years of shipping production .NET, SQL Server and Angular software at RamanByte.";

/** The two phrases the site is built to rank and be cited for. Every page
 *  title, H1 and description works at least one of them in naturally. */
export const PRIMARY_KEYWORDS = ["Shreyansh Kumar Singh", "AI & Full-Stack Engineer"] as const;

// The site's brand is his name and role. THE RANGE is the portfolio's
// concept name and only ever appears next to his name, never instead of it
// (is-agentic's brand check searched "THE RANGE — Shreyansh Kumar Singh
// developer portfolio", which is not what anyone types).
export const SITE_NAME = "Shreyansh Kumar Singh — AI & Full-Stack Engineer";

export const KEYWORDS = [
  "Shreyansh Kumar Singh",
  "AI & Full-Stack Engineer",
  "Shreyansh Kumar Singh AI & Full-Stack Engineer",
  "AI and full-stack engineer",
  "Shreyansh Kumar Singh AI engineer",
  "Shreyansh Kumar Singh full-stack developer",
  "Shreyansh Kumar Singh portfolio",
  "AI & full-stack engineer Pune",
  "applied AI engineer",
  "RAG pipeline engineer",
  "LLM agents",
  "ASP.NET Core and Angular developer",
  "Next.js developer",
];

export const KNOWS_ABOUT = [
  "Retrieval-augmented generation",
  "LLM agents",
  "Multi-agent systems",
  "Applied AI",
  "Penetration testing automation",
  "Full-stack web development",
  "ASP.NET Core",
  "C#",
  "SQL Server",
  "Angular",
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "Flutter",
  "Three.js",
  "React Three Fiber",
  "k6 load testing",
];

/** The client's own PDF résumé (corrected 8 Oct 2026). It carries his phone
 *  number, so next.config.ts serves it with X-Robots-Tag: noindex. */
export const RESUME_PDF = "/Shreyansh_Kumar_Singh_Resume.pdf";

/** The photo share card (app/opengraph-image.jpg, 1200×630, supplied by the
 *  client). Pages that set their own `openGraph` / `twitter` metadata replace
 *  the inherited image, so they reference it explicitly. */
export const SHARE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Shreyansh Kumar Singh, AI & Full-Stack Engineer in Pune, India, at his desk — available for hire",
};

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
