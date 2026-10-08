import { RESEARCH_CASES } from "@/lib/research";
import { PROJECTS } from "@/lib/projects";

/**
 * RESEARCH — the evidence wall: findings grouped into case files by source
 * project. Domain filter pills are computed here (server-rendered, from the
 * same PROJECTS domain taxonomy Range uses — never a second, invented copy);
 * HomeInteractions.tsx wires up the click-to-filter behavior on #researchFilters
 * afterward, toggling `.filtered-out` exactly like the original script.
 */
export default function Research() {
  const domainByProject = Object.fromEntries(PROJECTS.map((p) => [p.name, p.domain]));
  const researchDomains = [
    "ALL",
    ...Array.from(new Set(RESEARCH_CASES.map((c) => domainByProject[c.project]).filter(Boolean))),
  ];

  return (
    <section className="section" id="research">
      <div className="shell">
        <div className="section-head">
          <h2 className="rise">Research findings</h2>
          <p className="rise" style={{ transitionDelay: "60ms" }}>
            Ten technical findings from six of my AI and full-stack projects —
            each one pinned under the project it came out of.
          </p>
        </div>
        <div className="research-filters" id="researchFilters">
          {researchDomains.map((d, i) => (
            <button
              key={d}
              type="button"
              className={`rf-pill${i === 0 ? " active" : ""}`}
              data-domain={d}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="research-board" id="researchGrid">
          {RESEARCH_CASES.map((c, i) => (
            <div
              key={c.caseNo}
              className="case rise"
              id={`case-${i + 1}`}
              data-domain={domainByProject[c.project] || ""}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="case-tab">
                <span className="case-icon" dangerouslySetInnerHTML={{ __html: c.icon }} />
                <div className="case-meta">
                  <span className="case-no mono">{c.caseNo}</span>
                  <span className="case-project">{c.project}</span>
                </div>
                <span className="case-count mono">
                  {c.notes.length} finding{c.notes.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="case-notes">
                {c.notes.map((r, j) => (
                  <div key={r.n} className="pin-note rise rise-3d" style={{ transitionDelay: `${j * 60}ms` }}>
                    <span className="pin"></span>
                    <div className="n mono">{r.n}</div>
                    <h3>{r.title}</h3>
                    <p>{r.finding}</p>
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
