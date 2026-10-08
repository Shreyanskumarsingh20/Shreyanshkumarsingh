import Image from "next/image";
import type { Project } from "@/lib/projects";

/**
 * The right-hand "card-art" panel inside each Range stack card — a fake
 * browser-chrome frame around a real screenshot, a gallery inset, the sim
 * quad-grid (THE EVOLUTION), the HallogenAI pipeline diagram, or the
 * Revuelto teardown's own tri-strip. Sim/tab triggers are plain elements
 * with data-* attributes; the click delegation lives in HomeInteractions.tsx
 * (attached once on #range), exactly like the original script.
 */
export default function ProjectCardArt({ project }: { project: Project }) {
  const { art } = project;

  if (art.kind === "scrollable") {
    return (
      <div className="card-art">
        <div className="chrome">
          <i></i>
          <i></i>
          <i></i>
          <span className="chrome-label mono">{art.chromeLabel}</span>
          <span className="chrome-hint mono">scroll ↓ full page</span>
        </div>
        <div className="shot scrollable" data-lenis-prevent>
          <Image src={art.img} alt={art.alt} width={art.w} height={art.h} unoptimized />
        </div>
      </div>
    );
  }

  if (art.kind === "gallery") {
    return (
      <div className="card-art">
        <div className="chrome">
          <i></i>
          <i></i>
          <i></i>
          <span className="chrome-label mono">{art.chromeLabel}</span>
        </div>
        <div className="shot">
          <Image src={art.img} alt={art.alt} fill sizes="(min-width: 860px) 50vw, 100vw" />
        </div>
        <Image className="inset-shot" src={art.insetImg} alt={art.insetAlt} width={art.insetW} height={art.insetH} />
      </div>
    );
  }

  if (art.kind === "sim-quad") {
    return (
      <div className="card-art">
        <div className="chrome">
          <i></i>
          <i></i>
          <i></i>
          <span className="chrome-label mono">{art.chromeLabel}</span>
          <span className="chrome-hint mono">click to run live</span>
        </div>
        <div
          className="shot sim-trigger"
          data-open-sim={art.main.sim}
          data-sim-label={art.main.label}
        >
          <Image src={art.main.img} alt={art.main.alt} fill sizes="(min-width: 860px) 50vw, 100vw" />
          <span className="sim-play">
            <span>▶ Run it live — real canvas, this machine</span>
          </span>
        </div>
        <div className="tri">
          {art.tri.map((t) => (
            <div key={t.sim} className="sim-trigger" data-open-sim={t.sim} data-sim-label={t.label}>
              <Image src={t.img} alt={t.alt} width={t.w} height={t.h} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (art.kind === "pipeline") {
    return (
      <div className="card-art hg-art">
        <div className="chrome">
          <i></i>
          <i></i>
          <i></i>
          <span className="chrome-label mono">{art.chromeLabel}</span>
          <span className="chrome-hint mono">{art.chromeHint}</span>
        </div>
        <div className="hg-pipeline-wrap">
          <div className="pipeline">
            {art.nodes.map((node, i) => (
              <span key={node}>
                {i > 0 && <span className="pipeline-arrow">→</span>}
                <span className="pipeline-node">{node}</span>
              </span>
            ))}
          </div>
          <p className="hg-principle mono">{art.principle}</p>
        </div>
      </div>
    );
  }

  // revuelto
  return (
    <div className="card-art">
      <div className="chrome">
        <i></i>
        <i></i>
        <i></i>
        <span className="chrome-label mono">{art.chromeLabel}</span>
        <span className="chrome-hint mono">click to assemble live</span>
      </div>
      <div className="shot sim-trigger" data-open-tab="/sims/revuelto.html">
        <Image src={art.main.img} alt={art.main.alt} fill sizes="(min-width: 860px) 50vw, 100vw" />
        <span className="sim-play">
          <span>▶ Scroll it together yourself — opens in a new tab</span>
        </span>
      </div>
      <div className="tri">
        {art.tri.map((t) => (
          <Image key={t.img} src={t.img} alt={t.alt} width={t.w} height={t.h} />
        ))}
      </div>
    </div>
  );
}
