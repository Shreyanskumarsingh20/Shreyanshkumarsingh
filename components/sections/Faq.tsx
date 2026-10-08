import Link from "next/link";
import { FAQS } from "@/lib/faqs";

/**
 * FAQ teaser — each row is a switch that flips independently on click, and
 * the list rides a continuous scroll-tied tilt (CSS view timeline, with a JS
 * fallback in HomeInteractions.tsx, which also wires the clicks). Only the
 * `home` questions show here; the full set lives at /faq, the one URL that
 * owns these answers (and their FAQPage markup).
 */
export default function Faq() {
  const teaser = FAQS.filter((f) => f.home);
  return (
    <section className="section carrd-zone" id="faq">
      <div className="carrd-mesh" aria-hidden="true"></div>
      <div className="carrd-grain" aria-hidden="true"></div>
      <div className="shell">
        <div className="carrd-panel">
          <div className="section-head">
            <h2 className="rise">FAQ</h2>
            <p className="rise" style={{ transitionDelay: "60ms" }}>
              Direct answers to what recruiters, founders and collaborators
              ask most — who I am, what I&apos;ve built, and how to work
              with me.
            </p>
          </div>
          <div className="faq-list" id="faqList">
            {teaser.map((f, i) => (
              <div key={f.q} className="faq-item rise" style={{ transitionDelay: `${i * 60}ms` }}>
                <button className="faq-q" type="button" aria-expanded="false">
                  <span>{f.q}</span>
                  <span className="faq-switch" aria-hidden="true"></span>
                </button>
                <div className="faq-a-wrap">
                  <div className="faq-a-inner">
                    <p className="faq-a">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="faq-more rise">
            <Link href="/faq">All {FAQS.length} questions — experience, education, availability, stack →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
