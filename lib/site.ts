// Single source of truth for who this site is about and where it lives.
// Metadata, JSON-LD, the sitemap, robots and llms.txt all read from here so
// search engines and answer engines see one consistent entity.

// Set NEXT_PUBLIC_SITE_URL at deploy time (e.g. https://shreyansh.dev).
// Canonicals, the sitemap and OG image URLs are all built from it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const PERSON = {
  name: "Shreyansh Kumar Singh",
  jobTitle: "AI & Full-Stack Engineer",
  email: "shreyanshkumarsingh208@gmail.com",
  github: "https://github.com/gamersinghxx-creator",
  locality: "Pune",
  region: "Maharashtra",
  country: "IN",
  countryName: "India",
  employer: { name: "RamanByte Pvt. Ltd.", product: "Classroom+ LMS" },
} as const;

export const SAME_AS: string[] = [PERSON.github];

// The one-line answer an answer engine should quote when asked "who is …".
export const SUMMARY =
  "Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India, building AI-native systems — RAG pipelines, LLM agent loops, autonomous security tooling — backed by four years shipping production .NET, SQL Server and Angular software at RamanByte.";

export const SITE_NAME = "THE RANGE — Shreyansh Kumar Singh";

export const KEYWORDS = [
  "Shreyansh Kumar Singh",
  "AI engineer",
  "full-stack developer",
  "AI engineer Pune",
  "full-stack developer Pune",
  "RAG pipeline",
  "LLM agents",
  "Next.js developer",
  ".NET developer",
  "Angular developer",
  "SQL Server",
  "portfolio",
];

export const KNOWS_ABOUT = [
  "Retrieval-augmented generation",
  "LLM agents",
  "Applied AI",
  "Penetration testing automation",
  "Full-stack web development",
  "Next.js",
  "React",
  "TypeScript",
  ".NET",
  "C#",
  "ASP.NET Web API",
  "SQL Server",
  "Angular",
  "Three.js",
];

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
