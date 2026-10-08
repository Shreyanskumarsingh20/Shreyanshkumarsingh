import Link from "next/link";
import { NAV } from "@/lib/nav";

/**
 * The one top bar, on every page. Links show inline from 1080px up; below
 * that a <details> menu opens the same list (no JavaScript needed). The home
 * page also gets the ⌘K "Jump to…" trigger, wired by HomeInteractions.tsx.
 */
export default function SiteHeader({ current, withPalette = false }: { current?: string; withPalette?: boolean }) {
  const links = NAV.map((l) => (
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
      <Link className="topbar-id" href="/" aria-label="Shreyansh Kumar Singh — home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="topbar-mark" src="/brand/sks-mark-white.webp" width={33} height={32} alt="" />
        <span>Shreyansh Kumar Singh</span>
      </Link>
      <div className="topbar-right">
        <nav className="topbar-nav topbar-nav--site" aria-label="Main">
          {links}
        </nav>
        {withPalette && (
          <button type="button" className="cmdk-trigger" id="cmdkTrigger" aria-label="Jump to a section or page">
            <span className="cmdk-label">Jump to…</span>
            <kbd>⌘K</kbd>
          </button>
        )}
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
      </div>
    </header>
  );
}
