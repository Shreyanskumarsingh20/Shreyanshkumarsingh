/**
 * Per-project case-study modal — populated from PROJECTS + its matching
 * Research case (if any) by HomeInteractions.tsx's openProjectModal(), which
 * fills these ids in on click. Kept as a plain shell here (not per-project
 * pre-rendered JSX) since only one project's data is shown at a time and the
 * original data-attribute click-delegation pattern is what triggers it.
 */
export default function ProjectModal() {
  return (
    <div className="ov" id="pmOv" role="dialog" aria-modal="true" aria-labelledby="pmTitle">
      <div className="ov-panel pm-panel">
        <div className="pm-head">
          <button type="button" className="ov-close" data-close>
            ×
          </button>
          <div className="pm-domain mono" id="pmDomain"></div>
          <h3 className="pm-title" id="pmTitle"></h3>
        </div>
        <div className="pm-body" data-lenis-prevent>
          <p id="pmLine"></p>
          <div id="pmFindingsWrap">
            <div className="pm-section-label">From the research board</div>
            <div className="pm-findings" id="pmFindings"></div>
          </div>
          <div className="pm-section-label">Stack</div>
          <div className="pm-stack" id="pmStack"></div>
          <div className="pm-actions">
            <a className="btn btn-gold cut-sm" id="pmRepo" target="_blank" rel="noopener">
              <span>View repository →</span>
            </a>
            <button type="button" className="btn btn-ghost" data-close>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
