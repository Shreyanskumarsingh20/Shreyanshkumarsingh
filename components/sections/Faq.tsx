import { FAQS } from "@/lib/faqs";

/**
 * FAQ — each row is a switch that flips independently on click, and the
 * whole list rides a continuous scroll-tied tilt (updateFaqTilt in
 * HomeInteractions.tsx) rather than a one-time entrance. Click handling and
 * aria-expanded toggling are wired up there too, matching the original
 * script's per-item click listeners.
 */
export default function Faq() {
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
              ask most about the beliefs above.
            </p>
          </div>
          <div className="faq-list" id="faqList">
            {FAQS.map((f, i) => (
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
        </div>
      </div>
    </section>
  );
}
