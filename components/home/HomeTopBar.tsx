import Link from "next/link";

/**
 * The home page's full top bar — desktop nav + the ⌘K command-palette
 * trigger. Purely presentational; HomeInteractions.tsx wires up
 * #cmdkTrigger's click handler after mount (element ids are stable, so the
 * imperative wiring from the original script ports over unchanged).
 */
export default function HomeTopBar() {
  return (
    <header className="topbar topbar--wide">
      <div className="topbar-id">
        <span className="trident">
          <span></span>
          <span></span>
          <span></span>
        </span>
        Shreyansh Kumar Singh
      </div>
      <div className="topbar-right">
        <nav className="topbar-nav">
          <a href="#range">Range</a>
          <Link href="/experience">Experience</Link>
          <a href="#research">Research</a>
          <a href="#method">Method</a>
          <a href="#philosophy">Philosophy</a>
          <a href="#faq">FAQ</a>
          <a href="#telemetry">Telemetry</a>
          <a href="#contact">Contact</a>
          <Link href="/lets-talk" className="topbar-cta">
            Let&apos;s Talk
          </Link>
        </nav>
        <div className="topbar-tools">
          <button
            type="button"
            className="cmdk-trigger"
            id="cmdkTrigger"
            aria-label="Open command palette"
          >
            <span className="cmdk-label">Jump to…</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
