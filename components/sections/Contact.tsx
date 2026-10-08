import Link from "next/link";
import { PERSON, GITHUB_USER } from "@/lib/site";
import BgVideo from "@/components/BgVideo";

/**
 * CONTACT — the footer. Uses `.site-footer` (not a bare `footer{}` element
 * selector) since the plain-footer variant on /experience and /lets-talk
 * needed different padding and no video background — see globals.css.
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
        <p className="measure rise" style={{ transitionDelay: "60ms", color: "var(--ash)" }}>
          Email and source, below. This page — like everything referenced in
          it — is source-visible: this repository, Next.js App Router, no
          hidden build step.
        </p>
        <div className="foot-links rise" style={{ transitionDelay: "120ms" }}>
          <Link className="btn btn-gold cut-sm" href="/lets-talk">
            <span>Let&apos;s talk →</span>
          </Link>
          <button type="button" className="btn btn-ghost" id="contactTrigger">
            Email
          </button>
          <a
            className="btn btn-ghost"
            href={PERSON.github}
            target="_blank"
            rel="noopener"
          >
            GitHub — {GITHUB_USER}
          </a>
          <button type="button" className="btn btn-ghost" id="printTrigger">
            Résumé (PDF) ↓
          </button>
        </div>
        <div className="foot-meta">
          <span>THE RANGE — a scroll-driven stack of the work above</span>
          <span className="mono">v1 · {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
