import Link from "next/link";
import { preload } from "react-dom";
import BgVideo from "@/components/BgVideo";
import { getLastShipped, relativeDays } from "@/lib/github";

/**
 * HERO — the working thesis, headline stats, and the live particle field
 * (#fieldHero) that doubles as the SURVIVE minigame's play area. The
 * particle physics + game loop are wired up by HomeInteractions.tsx after
 * mount (canvas ids are stable across the port).
 */
export default async function Hero() {
  const shipped = await getLastShipped();
  // the hero poster is the largest thing painted above the fold — fetch it
  // with the HTML instead of after the <video> element is parsed
  preload("/media/hero-poster.webp", { as: "image", fetchPriority: "high" });
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
            <span className="label">Pune, India · Open to full-time or hybrid roles</span>
          </div>
          {/* the page's one H1 is exactly the two phrases the site ranks for:
              his name, and what he does */}
          <h1 className="hero-h1 rise now" style={{ animationDelay: "60ms" }}>
            Shreyansh Kumar Singh
            <span className="hero-role">AI &amp; Full-Stack Engineer</span>
          </h1>
          <p className="thesis measure rise now" style={{ animationDelay: "120ms" }}>
            I build AI products that hold up in production — RAG pipelines,
            LLM agents and autonomous security tools — on nearly four years of
            shipping .NET, SQL Server and Angular software at RamanByte. Below
            are nine of my projects, each with screenshots and a written case
            study.
          </p>
          <div className="hero-cta rise now" style={{ animationDelay: "180ms" }}>
            <a href="#range" className="btn btn-gold cut-sm">
              <span>View my projects</span>
            </a>
            <a href="/about" className="btn btn-ghost">
              About me
            </a>
          </div>
          <div className="hero-tickers">
            {shipped && (
              <div className="gh-ticker mono on" id="ghTicker">
                <i></i>Last shipped — <b>{relativeDays(shipped.pushedAt)}</b> · {shipped.repo}
              </div>
            )}
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

        <div className="scroll-cue" aria-hidden="true">
          <span className="line"></span>SCROLL
        </div>

        <div className="hero-stats">
          <div className="shell">
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
                <div className="k label">Dependencies in my physics simulators</div>
              </div>
              <div className="cell">
                <div className="v mono">P0</div>
                <div className="k label">Top-severity flaw caught in my own audit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="concept-note">
        <div className="shell">
          <p>
            <strong>How this page works —</strong> every project below is real,
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
