import Link from "next/link";

/**
 * The narrower two-item top bar used on /experience and /lets-talk — just
 * the wordmark and a "back to the portfolio" link, unlike the home page's
 * full nav + command-palette trigger (see components/home/HomeTopBar.tsx).
 */
export default function SimpleTopBar({
  backHref,
  backLabel,
  variant,
}: {
  backHref: string;
  backLabel: string;
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
        ANSH
      </Link>
      <Link className="topbar-back" href={backHref}>
        {backLabel}
      </Link>
    </header>
  );
}
