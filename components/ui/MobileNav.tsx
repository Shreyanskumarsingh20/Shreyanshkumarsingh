import NavLinks from "@/components/home/NavLinks";

/**
 * The home page's nav as an overlay, for screens narrower than 980px where
 * the top bar's inline nav is hidden. Opened by #navToggle (the hamburger in
 * HomeTopBar.tsx); open/close is wired imperatively by HomeInteractions.tsx
 * alongside the other .ov overlays, so it shares their backdrop/Escape
 * handling and one-open-at-a-time rule.
 */
export default function MobileNav() {
  return (
    <div className="ov" id="navOv" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="ov-panel nav-panel">
        <button type="button" className="ov-close" data-close aria-label="Close menu">
          ×
        </button>
        <p className="label">Menu</p>
        <nav className="nav-list" data-lenis-prevent>
          <NavLinks />
        </nav>
      </div>
    </div>
  );
}
