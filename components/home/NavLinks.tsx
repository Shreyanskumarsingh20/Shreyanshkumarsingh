import Link from "next/link";
import { HOME_NAV } from "@/lib/nav";

/**
 * The home page's nav links, shared by the desktop top bar (HomeTopBar.tsx)
 * and the small-screen menu overlay (components/ui/MobileNav.tsx). In-page
 * sections stay plain anchors so Lenis's anchor handling scrolls to them;
 * routes go through next/link.
 */
export default function NavLinks() {
  return (
    <>
      {HOME_NAV.map((l) =>
        l.href.startsWith("#") ? (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ) : (
          <Link key={l.href} href={l.href} className={l.cta ? "topbar-cta" : undefined}>
            {l.label}
          </Link>
        )
      )}
    </>
  );
}
