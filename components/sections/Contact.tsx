import Link from "next/link";
import { PERSON, GITHUB_USER } from "@/lib/site";
import { FOOTER_NAV } from "@/lib/nav";
import BgVideo from "@/components/BgVideo";
import ContactLinks from "@/components/site/ContactLinks";

/**
 * CONTACT — the home page's footer. Uses `.site-footer` (not a bare
 * `footer{}` element selector) since the inner pages use the plain
 * SiteFooter instead — see globals.css. Carries the same call / WhatsApp /
 * email actions and the same sitewide links as SiteFooter.
 */
export default function Contact() {
  return (
    <footer className="site-footer" id="contact">
      <BgVideo name="footer" className="footer-video" />
      <div className="footer-video-overlay" aria-hidden="true"></div>
      <div className="shell">
        <h2 className="rise">
          Let&apos;s build the next
          <br />
          legible system.
        </h2>
        <p className="measure rise foot-lede" style={{ transitionDelay: "60ms" }}>
          Call, WhatsApp or email — I read everything myself. Based in Pune,
          open to full-time or hybrid roles.
        </p>
        <div className="rise" style={{ transitionDelay: "100ms" }}>
          <ContactLinks />
        </div>
        <div className="foot-links rise" style={{ transitionDelay: "140ms" }}>
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact page →</span>
          </Link>
          {/* opens the contact modal (wired in HomeInteractions.tsx) */}
          <button type="button" className="btn btn-ghost" id="contactTrigger">
            Email
          </button>
          <a className="btn btn-ghost" href={PERSON.linkedin} target="_blank" rel="noopener me">
            LinkedIn
          </a>
          <a className="btn btn-ghost" href={PERSON.github} target="_blank" rel="noopener me">
            GitHub — {GITHUB_USER}
          </a>
          <Link className="btn btn-ghost" href="/resume">
            Résumé
          </Link>
        </div>
        <div className="site-foot-cols site-foot-cols--home">
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
        </div>
        <div className="foot-meta">
          <span>© {new Date().getFullYear()} Shreyansh Kumar Singh — THE RANGE</span>
          <span className="mono">AI &amp; full-stack engineer · Pune, India</span>
        </div>
      </div>
    </footer>
  );
}
