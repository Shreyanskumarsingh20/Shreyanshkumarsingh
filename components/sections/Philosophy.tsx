import { BELIEFS } from "@/lib/beliefs";

export default function Philosophy() {
  return (
    <section className="section carrd-zone" id="philosophy">
      <div className="carrd-mesh" aria-hidden="true"></div>
      <div className="carrd-grain" aria-hidden="true"></div>
      <div className="shell">
        <div className="carrd-panel">
          <div className="section-head">
            <h2 className="rise">Engineering principles</h2>
            <p className="rise" style={{ transitionDelay: "60ms" }}>
              Six working principles behind every system, workflow and
              decision above — how I approach AI and full-stack engineering.
            </p>
          </div>
          <div className="belief-grid" id="beliefGrid">
            {BELIEFS.map((b, i) => (
              <div key={b.no} className="belief-card rise" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="belief-no mono">{b.no}</span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
