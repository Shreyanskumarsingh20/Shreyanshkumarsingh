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
  "Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India, building AI-native systems — RAG pipelines, LLM agent loops, autonomous security tooling — backed by four years shipping production .NET, SQL Server and Angular software at RamanByte.";

export const SITE_NAME = "Shreyansh Kumar Singh — THE RANGE";

export const KEYWORDS = [
  "Shreyansh Kumar Singh",
  "Shreyansh Kumar Singh AI engineer",
  "Shreyansh Kumar Singh portfolio",
  "Applied AI engineer",
  "AI engineer Pune",
  "RAG pipeline",
  "LLM agents",
  "full-stack developer",
  "ASP.NET Core",
  "Angular",
  "Next.js",
  "React Three Fiber",
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

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
