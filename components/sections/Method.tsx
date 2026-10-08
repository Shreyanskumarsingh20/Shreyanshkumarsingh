import { METHOD_ACTS } from "@/lib/method";

/**
 * METHOD — two illustrated acts. Act art is raw SVG markup (ported verbatim,
 * rendered via dangerouslySetInnerHTML — static decoration, not user input).
 */
export default function Method() {
  return (
    <section className="section" id="method">
      <div className="shell">
        <div className="section-head">
          <h2 className="rise">Engineering method</h2>
          <p className="rise" style={{ transitionDelay: "60ms" }}>
            How I build: write the specification before the code, then audit
            the result after it ships.
          </p>
        </div>
        <div className="method-story" id="methodStory">
          {METHOD_ACTS.map((act, i) => (
            <div
              key={act.chapter}
              className={`method-act rise rise-flip${i === 1 ? " flip" : ""}`}
              data-tone={act.tone}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="method-art-wrap">
                <div dangerouslySetInnerHTML={{ __html: act.art }} />
                <div>
                  <div className="method-chapter mono">{act.chapter}</div>
                  <h3 className="method-act-title">{act.title}</h3>
                  <p className="method-act-narrative">{act.narrative}</p>
                </div>
              </div>
              <div className="method-beats">
                {act.beats.map((b) => (
                  <div key={b.n} className="method-beat">
                    <div className="n mono">{b.n}</div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                    <span className="ev mono">{b.ev}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
