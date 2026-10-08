import Link from "next/link";
import { FOOTER_NAV } from "@/lib/nav";
import { PERSON, GITHUB_USER } from "@/lib/site";
import ContactLinks from "@/components/site/ContactLinks";

/**
 * Sitewide footer for every page except home (whose footer is the video
 * "Contact" section, which links here too). Every page links to every other
 * page from here — the internal-linking backbone for crawlers.
 */
export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="site-foot-top">
          <div className="site-foot-id">
            <p className="site-foot-name">Shreyansh Kumar Singh</p>
            <p className="site-foot-role">
              AI &amp; full-stack engineer · Pune, India · open to full-time or hybrid roles
            </p>
            <ContactLinks />
          </div>
          <div className="site-foot-cols">
            {FOOTER_NAV.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="site-foot-h">{col.heading}</p>
                {col.links.map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            ))}
            <nav aria-label="Profiles">
              <p className="site-foot-h">Elsewhere</p>
              <a href={PERSON.linkedin} target="_blank" rel="noopener me">
                LinkedIn
              </a>
              <a href={PERSON.github} target="_blank" rel="noopener me">
                GitHub — {GITHUB_USER}
              </a>
              <a href={PERSON.x} target="_blank" rel="noopener me">
                X — {PERSON.xHandle}
              </a>
            </nav>
          </div>
        </div>
        <div className="foot-meta">
          <span>© {new Date().getFullYear()} Shreyansh Kumar Singh — THE RANGE</span>
          <span className="mono">shreyanshkumarsingh.com</span>
        </div>
      </div>
    </footer>
  );
}
