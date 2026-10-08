// Navigation in one place.
//
// HOME_NAV is the home page's top bar: it renders twice — inline from 980px
// up, and inside the hamburger overlay below that (components/home/
// NavLinks.tsx). "#…" entries are in-page sections; "/…" entries are routes.
//
// SITE_NAV is the top bar on every other page, and FOOTER_NAV the sitewide
// footer — together they make sure every page is linked from every page.

export type NavLink = { label: string; href: string; cta?: boolean };

export const HOME_NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Range", href: "#range" },
  { label: "Experience", href: "/experience" },
  { label: "Research", href: "#research" },
  { label: "Method", href: "#method" },
  { label: "Notes", href: "/notes" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact", cta: true },
];

export const SITE_NAV: NavLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
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
      { label: "The Range", href: "/#range" },
      { label: "Notes — technical articles", href: "/notes" },
      { label: "Research board", href: "/#research" },
      { label: "Method", href: "/#method" },
    ],
  },
  {
    heading: "Site",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "llms.txt", href: "/llms.txt" },
      { label: "RSS", href: "/notes/rss.xml" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];
