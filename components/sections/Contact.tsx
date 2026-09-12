import Link from "next/link";

/**
 * CONTACT — the footer. Uses `.site-footer` (not a bare `footer{}` element
 * selector) since the plain-footer variant on /experience and /lets-talk
 * needed different padding and no video background — see globals.css.
 */
export default function Contact() {
  return (
    <footer className="site-footer" id="contact">
      <video
        className="footer-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
          type="video/mp4"
        />
      </video>
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
            href="https://github.com/gamersinghxx-creator"
            target="_blank"
            rel="noopener"
          >
            GitHub — gamersinghxx-creator
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
