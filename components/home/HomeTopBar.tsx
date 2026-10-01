import NavLinks from "@/components/home/NavLinks";

/**
 * The home page's full top bar — desktop nav, the ⌘K command-palette
 * trigger, and (below 980px, where the inline nav is hidden) the hamburger
 * that opens the same links as an overlay (components/ui/MobileNav.tsx).
 * Purely presentational; HomeInteractions.tsx wires up #cmdkTrigger's and
 * #navToggle's click handlers after mount (element ids are stable, so the
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
          <NavLinks />
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
          <button
            type="button"
            className="nav-toggle"
            id="navToggle"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-controls="navOv"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
