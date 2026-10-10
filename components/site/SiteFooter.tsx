import Link from "next/link";
import { FOOTER_NAV } from "@/lib/nav";
import { PERSON, GITHUB_USER } from "@/lib/site";
import BgVideo from "@/components/BgVideo";
import ContactLinks from "@/components/site/ContactLinks";

/**
 * The one footer, on every page: the home page's video footer. The video
 * only downloads when the footer is about to scroll into view (BgVideo), so
 * pages pay for a ~55 KB poster until then. A layered scrim keeps every line
 * of text legible over the brightest frames.
 *
 * `page` narrows it to the inner pages' 1180px column so its headline and
 * links line up with the content above; the home page keeps the wide shell.
 */
export default function SiteFooter({ page = false }: { page?: boolean }) {
  return (
    <footer className="site-footer" id="contact">
      <BgVideo name="footer" className="footer-video" />
      <div className="footer-video-overlay" aria-hidden="true"></div>
      <div className={page ? "shell shell--page" : "shell"}>
        <h2 className="rise">
          Work with Shreyansh Kumar Singh
          <span className="foot-h2-role">AI &amp; Full-Stack Engineer, Pune</span>
        </h2>
        <p className="measure rise foot-lede" style={{ transitionDelay: "60ms" }}>
          Call, WhatsApp or email Shreyansh directly — he reads everything himself. Based in Pune, India, and open to
          full-time or hybrid roles.
        </p>
        <div className="rise" style={{ transitionDelay: "100ms" }}>
          <ContactLinks />
        </div>
        <div className="foot-links rise" style={{ transitionDelay: "140ms" }}>
          <Link className="btn btn-gold cut-sm" href="/contact">
            <span>Contact page →</span>
          </Link>
          <Link className="btn btn-ghost" href="/resume">
            Résumé
          </Link>
          <a className="btn btn-ghost" href={PERSON.linkedin} target="_blank" rel="noopener me">
            LinkedIn
          </a>
          <a className="btn btn-ghost" href={PERSON.github} target="_blank" rel="noopener me">
            GitHub
          </a>
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
            <a href={`mailto:${PERSON.email}`}>Email</a>
          </nav>
        </div>

        <div className="foot-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/sks-wordmark-white.webp"
            width={507}
            height={200}
            alt="Shreyansh Kumar Singh — SKS monogram and wordmark"
            loading="lazy"
          />
          <p>AI &amp; full-stack engineer · Pune, India</p>
        </div>
        <div className="foot-meta">
          <span>© {new Date().getFullYear()} Shreyansh Kumar Singh — THE RANGE</span>
          <span className="mono">shreyanshkumarsingh.com</span>
        </div>
      </div>
    </footer>
  );
}
