import { INSTRUMENTS, TECH_META } from "@/lib/telemetry";
import type { CSSVarStyle } from "@/lib/css-vars";
import BgVideo from "@/components/BgVideo";

/**
 * TELEMETRY — the instrument rack. Each tile's glyph is either a lettermark
 * or raw hand-drawn SVG markup (rendered via dangerouslySetInnerHTML —
 * static decoration, not user input).
 */
export default function Telemetry() {
  return (
    <section className="section" id="telemetry">
      <BgVideo name="telemetry" className="telemetry-video" />
      <div className="telemetry-video-overlay" aria-hidden="true"></div>
      <div className="shell">
        <div className="section-head">
          <h2 className="rise">Tech stack</h2>
          <p className="rise" style={{ transitionDelay: "60ms" }}>
            The languages, frameworks and AI tools I use in production.
          </p>
        </div>
        <div className="instr-grid" id="instrGrid">
          {INSTRUMENTS.map((g, i) => (
            <div key={g.g} className="instr-group rise" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="label">{g.g}</div>
              <div className="instr-tags">
                {g.items.map((name) => {
                  const meta = TECH_META[name] || { c: "#333", mono: name.slice(0, 2).toUpperCase() };
                  return (
                    <div className="tech-tile" key={name}>
                      <div className="tech-box" style={{ "--c": meta.c } as CSSVarStyle}>
                        {meta.mono ? (
                          <span className="tech-mono" style={{ color: meta.dark ? "#111" : "#fff" }}>
                            {meta.mono}
                          </span>
                        ) : (
                          <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: meta.svg || "" }} />
                        )}
                      </div>
                      <span className="tech-name">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
