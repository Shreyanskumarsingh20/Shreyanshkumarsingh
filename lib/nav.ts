// The home page's primary nav. It renders twice — inline in the top bar from
// 980px up, and inside the hamburger's overlay below that — so both read
// from this one list (see components/home/NavLinks.tsx). "#…" entries are
// in-page sections; "/…" entries are routes.

export type NavLink = { label: string; href: string; cta?: boolean };

export const HOME_NAV: NavLink[] = [
  { label: "Range", href: "#range" },
  { label: "Experience", href: "/experience" },
  { label: "Research", href: "#research" },
  { label: "Method", href: "#method" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "FAQ", href: "#faq" },
  { label: "Telemetry", href: "#telemetry" },
  { label: "Contact", href: "#contact" },
  { label: "Let's Talk", href: "/lets-talk", cta: true },
];
