import Link from "next/link";

/**
 * The narrower two-item top bar used on /experience and /lets-talk — just
 * the wordmark and a "back to the portfolio" link, unlike the home page's
 * full nav + command-palette trigger (see components/home/HomeTopBar.tsx).
 *
 * `backLabelTail` is the part of the link text that's dropped on the
 * narrowest phones (≤400px), where the wordmark and the full label don't
 * fit side by side.
 */
export default function SimpleTopBar({
  backHref,
  backLabel,
  backLabelTail,
  variant,
}: {
  backHref: string;
  backLabel: string;
  backLabelTail?: string;
  variant: "exp" | "talk";
}) {
  return (
    <header className={`topbar topbar--${variant}`}>
      <Link className="topbar-id" href="/">
        <span className="trident">
          <span></span>
          <span></span>
          <span></span>
        </span>
        Shreyansh Kumar Singh
      </Link>
      <Link className="topbar-back" href={backHref}>
        {backLabel}
        {backLabelTail && <span className="topbar-back-tail">{backLabelTail}</span>}
      </Link>
    </header>
  );
}
