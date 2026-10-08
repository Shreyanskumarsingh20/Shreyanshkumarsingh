import Link from "next/link";
import BgVideo from "@/components/BgVideo";

/**
 * HERO — the working thesis, headline stats, and the live particle field
 * (#fieldHero) that doubles as the SURVIVE minigame's play area. The
 * particle physics + game loop are wired up by HomeInteractions.tsx after
 * mount (canvas ids are stable across the port).
 */
export default function Hero() {
  return (
    <>
      <section className="hero" id="top">
        <BgVideo name="hero" className="hero-video" />
        <div className="hero-video-overlay" aria-hidden="true"></div>
        <div className="hero-grid" aria-hidden="true"></div>

        <canvas id="fieldHero" aria-hidden="true"></canvas>
        <button type="button" className="field-hint mono" id="fieldHint">
          ▶ play — survive the shockwave
        </button>
        <div className="field-hud mono" id="fieldHud">
          <span>SURVIVE</span>
          <span className="big" id="fieldScore">
            0.0s
          </span>
        </div>
        <div className="field-over" id="fieldOver">
          <div className="field-over-card">
            {/* not a heading — it's a game-over overlay, and as an <h4> it
                was the first heading in the raw HTML, ahead of the <h1> */}
            <p className="field-over-title">Caught in the blast</p>
            <p id="fieldOverStat">Survived 0.0s</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-gold cut-sm" id="fieldRetry">
                <span>Try again</span>
              </button>
              <button type="button" className="btn btn-ghost" id="fieldQuit">
                Back to ambient
              </button>
            </div>
          </div>
        </div>

        <div className="shell" style={{ position: "relative" }}>
          <div className="hero-eyebrow rise now">
            <span className="trident">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className="label">Shreyansh Kumar Singh — AI &amp; Full-Stack Engineer · Pune</span>
          </div>
          <h1 className="rise now" style={{ animationDelay: "60ms" }}>
            {/* the name is already visible in the eyebrow above; repeating it
                inside the h1 ties the page's one heading to the person */}
            <span className="sr-only">Shreyansh Kumar Singh, AI &amp; full-stack engineer in Pune: </span>
            Nine repositories.
            <br />
            <span className="dim">One stack.</span>
          </h1>
          <p className="thesis measure rise now" style={{ animationDelay: "120ms" }}>
            I build systems that make invisible things legible — blast
            physics, attack surfaces, a thousand years of art, a bank&apos;s
            document pile — and I write the specification before I write the
            code. This page is a scroll-driven stack of the work itself.
          </p>
          <div className="hero-cta rise now" style={{ animationDelay: "180ms" }}>
            <a href="#range" className="btn btn-gold cut-sm">
              <span>See the range</span>
            </a>
            <a href="#research" className="btn btn-ghost">
              The research
            </a>
          </div>
          <div className="hero-tickers">
            <div className="gh-ticker mono" id="ghTicker">
              <i></i>Syncing GitHub…
            </div>
            <Link
              className="gh-ticker building-ticker mono on"
              id="buildingTicker"
              href="/experience#case-6"
            >
              <i></i>Building now — <b>Vidur Industry Connect</b>
              <span id="buildDay"></span> →
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="shell" style={{ paddingInline: 0 }}>
            <div className="row">
              <div className="cell">
                <div className="v mono">9</div>
                <div className="k label">Repositories shipped</div>
              </div>
              <div className="cell">
                <div className="v mono">5</div>
                <div className="k label">Languages in production</div>
              </div>
              <div className="cell">
                <div className="v mono">0</div>
                <div className="k label">Dependencies in THE EVOLUTION</div>
              </div>
              <div className="cell">
                <div className="v mono">P0</div>
                <div className="k label">Severity found in own code</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="line"></span>SCROLL
        </div>
      </section>

      <div className="concept-note">
        <div className="shell">
          <p>
            <strong>The concept —</strong> every project below is real,
            screenshotted live off a running server, not mocked up. Scroll
            and each one pins to the top of the stack as the next rises to
            cover it — like flipping through a stack of case files. No
            parallax library: the stacking itself is{" "}
            <span className="mono">position: sticky</span>, one per project;
            the only scroll-driven code left dims a card once the next one
            has covered it.
          </p>
        </div>
      </div>
    </>
  );
}
