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
      { label: "llms.txt", href: "/llms.txt" },
      { label: "RSS", href: "/notes/rss.xml" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];
