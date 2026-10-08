import { PROJECTS } from "@/lib/projects";
import { RESEARCH_CASES } from "@/lib/research";
import ProjectCardArt from "@/components/home/ProjectCardArt";
import type { CSSVarStyle } from "@/lib/css-vars";
import { onColor } from "@/lib/color";
import { projectHref } from "@/lib/projects";
import Link from "next/link";

/**
 * THE RANGE — sticky-stacking cards. The stacking mechanic itself is pure
 * CSS: `.stack-card`'s `top: calc(92px + var(--k,0) * 8px)` /
 * `z-index: calc(1 + var(--k,0))` formula (globals.css), driven by the
 * `--k` custom property set per card below — DO NOT change this math, see
 * CHANGELOG.md 2026-08-21 for the overflow-x:hidden trap it replaced.
 * The `.is-behind` dimming toggle is the one bit of scroll-linked JS,
 * applied by HomeInteractions.tsx's layout() function.
 */
export default function Range() {
  const caseHrefByProject = Object.fromEntries(
    RESEARCH_CASES.map((c, i) => [c.project, `#case-${i + 1}`])
  );

  return (
    <div className="range-wrap">
      <div className="range-intro shell">
        <h2 className="rise">Projects</h2>
        <p className="rise measure" style={{ transitionDelay: "60ms" }}>
          Nine AI and full-stack projects by Shreyansh Kumar Singh — THE
          RANGE. Every repository below is real: the reference numbers are derived
          from commit dates (<span className="mono">YYMM.CODE.serial</span>),
          not invented. Keep scrolling — each project pins to the top of the
          stack as the next rises over it.
        </p>
      </div>

      <div className="stack" id="range">
        {PROJECTS.map((p, i) => {
          const caseHref = caseHrefByProject[p.name];
          return (
            <article
              key={p.n}
              className="stack-card"
              id={`project-${p.n}`}
              style={{ "--accent": p.accent, "--on-accent": onColor(p.accent), "--k": i } as CSSVarStyle}
            >
              <div className="stack-card-inner">
                <div className="stack-left">
                  <div className="stack-head">
                    <span className="stack-idx mono">{p.n}</span>
                    <span className="stack-dash" aria-hidden="true">
                      ――
                    </span>
                    <span className="stack-domain">{p.domain}</span>
                    <span className="stack-ref mono">{p.ref}</span>
                  </div>
                  <h3 className="stack-title">{p.name}</h3>
                  <p className="stack-line">{p.line}</p>
                  <div className="stack-badges">
                    {p.figs.map(([v, k]) => (
                      <span className="badge" key={k}>
                        <b>{v}</b> {k}
                      </span>
                    ))}
                  </div>
                  <div className="stack-stack">
                    <span className="stack-stack-label mono">STACK</span>
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <div className="stack-actions">
                    {p.url ? (
                      <a className="btn btn-gold cut-sm" href={p.url} target="_blank" rel="noopener">
                        <span>View repository →</span>
                      </a>
                    ) : (
                      <span className="badge">{p.sourceNote ?? "Not yet public"}</span>
                    )}
                    {caseHref && (
                      <a className="btn btn-ghost" href={caseHref}>
                        Research case →
                      </a>
                    )}
                    <Link className="btn btn-ghost" href={projectHref(p.slug)}>
                      Case study →
                    </Link>
                    {/* the original pop-up summary, kept as a quick preview */}
                    <button type="button" className="btn btn-ghost" data-open-project={p.n}>
                      Quick look
                    </button>
                  </div>
                </div>
                <div className="stack-right">
                  <ProjectCardArt project={p} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="range-progress" id="progress" aria-hidden="true">
        {PROJECTS.map((_, i) => (
          <i key={i} data-index={i}></i>
        ))}
      </div>
    </div>
  );
}
