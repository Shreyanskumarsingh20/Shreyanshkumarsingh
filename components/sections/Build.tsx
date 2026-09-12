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
          <p className="build-kicker rise mono">THE BUILD</p>
          <h2 className="build-headline rise">
            I don&apos;t just write code.
            <br />
            <span className="dim">
              I build things that <em>think, adapt, and solve.</em>
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
          <p className="build-close-q rise mono">SO, WHAT DO I ACTUALLY DO?</p>
          <p className="build-close-a rise">
            I take an idea
            <br />
            and turn it into something real.
            <br />
            Something people can use. Something that can scale. Something
            that can survive reality.
          </p>
          <h3 className="build-close-final">
            <span className="wipe-line-wrap">
              <span className="wipe-line">I don&apos;t just build software.</span>
            </span>
            <br />
            <span className="wipe-line-wrap">
              <span className="wipe-line" style={{ animationDelay: ".55s" }}>
                I build what comes next.
              </span>
            </span>
          </h3>
        </div>
      </div>
    </section>
  );
}
