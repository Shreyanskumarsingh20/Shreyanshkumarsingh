import { BUILD_CHAPTERS, BUILD_ICONS } from "@/lib/build-chapters";

/**
 * THE BUILD — an illustrated origin story in six chapters, between Hero and
 * Range. Each chapter draws its own small line-art icon as it scrolls in
 * (raw SVG markup, ported verbatim, rendered via dangerouslySetInnerHTML —
 * static decoration, not user input); the spine (#buildSpineFill) fills as
 * you pass through it, updated by HomeInteractions.tsx.
 */
export default function Build() {
  return (
    <section className="build-wrap" id="build">
      <div className="build-grid" aria-hidden="true"></div>
      <div className="shell" style={{ position: "relative" }}>
        <div className="build-intro">
          <p className="build-kicker rise mono">HOW I WORK</p>
          <h2 className="build-headline rise">
            How I build software,
            <br />
            <span className="dim">
              from the first question <em>to production.</em>
            </span>
          </h2>
        </div>

        <div className="build-figure rise" style={{ transitionDelay: "60ms" }} aria-hidden="true">
          <svg
            className="figure-svg"
            viewBox="0 0 420 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="A single spark, and the line of thought it casts"
          >
            <path
              className="figure-wavy"
              pathLength={1}
              d="M14,110 C50,88 84,132 120,110 C156,88 190,128 226,106 C262,84 296,120 332,100 C368,80 392,94 406,88"
            />
            <circle className="figure-spark" cx="14" cy="110" r="5" />
          </svg>
        </div>

        <div className="build-story">
          <div className="build-spine" aria-hidden="true">
            <i id="buildSpineFill"></i>
          </div>
          <div className="build-chapters" id="buildChapters">
            {BUILD_CHAPTERS.map((c) => (
              <div key={c.no} className={`build-chapter rise ${c.effect}`}>
                <svg
                  className="build-icon"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: BUILD_ICONS[c.no] }}
                />
                <div className="build-chapter-body">
                  <span className="build-no" aria-hidden="true">
                    {c.no}
                  </span>
                  <h3>{c.title}</h3>
                  <div className="build-lines">
                    {c.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                  {c.pipeline && (
                    <div className="pipeline">
                      {c.pipeline.map((s, j) => (
                        <span key={s}>
                          {j > 0 && (
                            <span className="pipeline-arrow rise" style={{ transitionDelay: `${(j * 2 - 1) * 60}ms` }}>
                              →
                            </span>
                          )}
                          <span className="pipeline-node rise" style={{ transitionDelay: `${j * 2 * 60}ms` }}>
                            {s}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="build-emph">{c.emph}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="build-close rise">
          <p className="build-close-q rise mono">IN SHORT</p>
          <p className="build-close-a rise">
            I take an idea and turn it into software people can use — software
            that scales and survives real traffic, real data and real users.
          </p>
          {/* a closing statement, not a section heading — so a <p> */}
          <p className="build-close-final">
            <span className="wipe-line-wrap">
              <span className="wipe-line">AI-powered, full-stack software</span>
            </span>
            <br />
            <span className="wipe-line-wrap">
              <span className="wipe-line" style={{ animationDelay: ".55s" }}>
                that holds up in production.
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
