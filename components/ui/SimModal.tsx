/**
 * Live simulator modal — near-fullscreen, an iframe does the work. The
 * iframe's src is only set on open and cleared (`about:blank`) on close, so
 * the vendored zero-dependency sim pages under public/sims/ never run until
 * a visitor actually asks for one. openSim() lives in HomeInteractions.tsx.
 * The scroll-driven Revuelto teardown is NOT opened here — it opens
 * `/sims/revuelto.html` in a new tab instead (see data-open-tab handling),
 * since it doesn't nest reliably in an iframe's own scroll context.
 */
export default function SimModal() {
  return (
    <div className="ov" id="simOv" role="dialog" aria-modal="true" aria-labelledby="simTitle">
      <div className="ov-panel sim-panel">
        <div className="sim-head">
          <button type="button" className="ov-close" data-close>
            ×
          </button>
          <span className="sim-domain mono" id="simDomain">
            running live in this tab
          </span>
          <h3 className="pm-title" id="simTitle"></h3>
        </div>
        <div className="sim-body">
          <iframe id="simFrame" title="Live physics simulator" loading="lazy"></iframe>
        </div>
        <div className="sim-foot">
          <span className="micro" style={{ color: "var(--graphite)" }}>
            Zero dependencies · runs entirely in this iframe, nothing sent anywhere
          </span>
          <a className="btn btn-ghost" id="simRepo" target="_blank" rel="noopener">
            Open full-screen ↗
          </a>
        </div>
      </div>
    </div>
  );
}
