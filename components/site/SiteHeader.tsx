import Link from "next/link";
import { SITE_NAV } from "@/lib/nav";

/**
 * Top bar for every page except home (which keeps its own, with the ⌘K
 * palette). Links show inline from 980px up; below that a <details> menu
 * opens the same list — no JavaScript needed.
 */
export default function SiteHeader({ current }: { current?: string }) {
  const links = SITE_NAV.map((l) => (
    <Link
      key={l.href}
      href={l.href}
      className={l.cta ? "topbar-cta" : undefined}
      aria-current={current === l.href ? "page" : undefined}
    >
      {l.label}
    </Link>
  ));
  return (
    <header className="topbar topbar--site">
      <Link className="topbar-id" href="/">
        <span className="trident" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        Shreyansh Kumar Singh
      </Link>
      <nav className="topbar-nav topbar-nav--site" aria-label="Main">
        {links}
      </nav>
      <details className="site-menu">
        <summary aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </summary>
        <nav className="site-menu-list" aria-label="Main">
          <Link href="/">Home</Link>
          {links}
        </nav>
      </details>
    </header>
  );
}
