"use client";

import { useLayoutEffect, useState } from "react";

/**
 * The opening loader — your name signed live in Beau Rivage, a circuit-line
 * field breathing behind it, a fixed timer (not a real asset-load race) so
 * the reveal is always the same crafted length. Purely presentational;
 * nothing below depends on it, and it always self-releases.
 */
export default function Loader() {
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    // body starts scrollable on hydration (no server-rendered "loading"
    // class, since <body> is shared across routes in app/layout.tsx) — add
    // it synchronously, pre-paint, so there's no scrollable flash before the
    // loader (which already covers the viewport at z-index 300) takes over.
    document.body.classList.add("loading");
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
    const statusEl = document.getElementById("loaderStatus");
    const pctEl = document.getElementById("loaderPct");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = reduce ? 300 : 3500;
    const lines = [
      "MOUNTING THE RANGE",
      "VERIFYING SPEC INTEGRITY",
      "CALIBRATING TELEMETRY",
      "SIGN-OFF",
    ];
    let li = 0;
    const tick =
      statusEl && !reduce
        ? window.setInterval(() => {
            li = (li + 1) % lines.length;
            statusEl.textContent = lines[li];
          }, 620)
        : null;
    const start = Date.now();
    const pctTick =
      pctEl && !reduce
        ? window.setInterval(() => {
            const pct = Math.min(100, Math.round(((Date.now() - start) / DURATION) * 100));
            pctEl.textContent = pct + "%";
          }, 40)
        : null;
    function finish() {
      if (tick) clearInterval(tick);
      if (pctTick) clearInterval(pctTick);
      if (pctEl) pctEl.textContent = "100%";
      window.scrollTo(0, 0);
      document.body.classList.remove("loading");
      loader!.classList.add("hide");
      // unmount through React rather than detaching the node by hand —
      // a manual removeChild leaves React holding a stale node, and it
      // throws NotFoundError when the page later unmounts on navigation
      removeT = window.setTimeout(() => setDone(true), 900);
    }
    let removeT: number | undefined;
    const t = setTimeout(finish, DURATION);
    return () => {
      clearTimeout(t);
      clearTimeout(removeT);
      document.body.classList.remove("loading");
      if (tick) clearInterval(tick);
      if (pctTick) clearInterval(pctTick);
    };
  }, []);

  if (done) return null;

  return (
    <div className="loader" id="loader" role="status" aria-live="polite" aria-label="Loading THE RANGE">
      <div className="loader-grid" aria-hidden="true"></div>
      <div className="loader-breathe" aria-hidden="true"></div>
      <div className="loader-circuit" aria-hidden="true"></div>
      <div className="loader-nodes" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="loader-stage">
        <div className="loader-sig-wrap">
          <span className="loader-sig-text" aria-hidden="true">
            Shreyansh Kumar Singh
          </span>
          <span className="loader-pen" aria-hidden="true"></span>
        </div>
        <div className="loader-status mono" id="loaderStatus">
          MOUNTING THE RANGE
        </div>
        <div className="loader-pct mono" id="loaderPct">
          0%
        </div>
        <div className="loader-bar">
          <i></i>
        </div>
      </div>
    </div>
  );
}
