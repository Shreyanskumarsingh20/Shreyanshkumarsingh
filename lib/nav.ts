// Navigation in one place. NAV is the top bar on every page — home
// included — so the menu is identical everywhere; FOOTER_NAV is the
// sitewide footer. Together they link every page from every page.

export type NavLink = { label: string; href: string; cta?: boolean };

export const NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Notes", href: "/notes" },
  { label: "Skills", href: "/skills" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact", cta: true },
];

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Profile",
    links: [
      { label: "About Shreyansh", href: "/about" },
      { label: "Experience at RamanByte", href: "/experience" },
      { label: "Skills", href: "/skills" },
      { label: "Résumé", href: "/resume" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Projects — nine case studies", href: "/projects" },
      { label: "Notes — technical articles", href: "/notes" },
      { label: "Project stack (THE RANGE)", href: "/#range" },
      { label: "Research findings", href: "/#research" },
    ],
  },
  {
    heading: "Site",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Developer API", href: "/developers" },
      { label: "llms.txt", href: "/llms.txt" },
      { label: "RSS", href: "/notes/rss.xml" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

/** "Related pages" at the foot of each inner page (components/site/
 *  RelatedPages.tsx, rendered by PageShell) — every page links onward to
 *  the pages a reader (or crawler) most likely wants next. */
export type RelatedLink = { href: string; title: string; text: string };

const R: Record<string, RelatedLink> = {
  about: { href: "/about", title: "About Shreyansh Kumar Singh", text: "Who he is, key facts, career timeline and the roles he's open to." },
  projects: { href: "/projects", title: "AI & full-stack projects", text: "Nine case studies: RAG for banking, an AI pentest agent, multi-agent QA, a 3D museum and more." },
  experience: { href: "/experience", title: "Experience at RamanByte", text: "Production ASP.NET Core, SQL Server, Angular and Flutter work since January 2023." },
  skills: { href: "/skills", title: "Skills", text: "Applied AI, back end, front end, data, mobile, 3D, security — each linked to real work." },
  notes: { href: "/notes", title: "Technical notes", text: "Short answers to engineering questions, first-hand from systems he built." },
  resume: { href: "/resume", title: "Résumé", text: "One-page résumé of the AI & full-stack engineer, with a PDF download." },
  faq: { href: "/faq", title: "Frequently asked questions", text: "Direct answers about his background, work, education and availability." },
  contact: { href: "/contact", title: "Contact Shreyansh", text: "Call, WhatsApp or email — open to full-time or hybrid roles." },
  developers: { href: "/developers", title: "Developer API", text: "Read-only JSON API, OpenAPI spec and MCP server over this portfolio." },
};

export const RELATED: Record<string, RelatedLink[]> = {
  "/about": [R.experience, R.projects, R.skills, R.resume],
  "/experience": [R.about, R.skills, R.projects, R.resume],
  "/skills": [R.projects, R.experience, R.notes, R.resume],
  "/faq": [R.about, R.projects, R.experience, R.contact],
  "/contact": [R.about, R.resume, R.projects, R.faq],
  "/privacy": [R.contact, R.about, R.developers],
  "/resume": [R.experience, R.projects, R.skills, R.contact],
  "/developers": [R.projects, R.notes, R.about],
  "/notes": [R.projects, R.skills, R.developers],
  "/projects": [R.experience, R.notes, R.skills, R.contact],
};
