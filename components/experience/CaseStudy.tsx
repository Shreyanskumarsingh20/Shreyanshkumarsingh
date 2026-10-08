import type { ExperienceCase } from "@/lib/experience";
import ShotGallery from "./ShotGallery";
import PhoneGallery from "./PhoneGallery";

export default function CaseStudy({ c }: { c: ExperienceCase }) {
  return (
    <section className="xp-case shell shell--exp" id={c.id}>
      <div className="xp-case-head rise">
        <span className="xp-case-no mono">{c.no}</span>
        <span className="xp-case-dash mono">—</span>
        <span className="xp-case-domain">{c.domain}</span>
        <span className="xp-case-ref mono">{c.ref}</span>
      </div>
      <h2
        className="xp-case-title rise"
        style={{ transitionDelay: "60ms" }}
        dangerouslySetInnerHTML={{ __html: c.title }}
      />
      <p className="xp-case-line rise" style={{ transitionDelay: "120ms" }}>
        {c.line}
      </p>
      <div className="xp-case-badges rise" style={{ transitionDelay: "180ms" }}>
        {c.badges.map((b) => (
          <span key={b.text} className={`badge${b.variant ? ` ${b.variant}` : ""}`}>
            {b.text}
          </span>
        ))}
      </div>

      {c.gallery.kind === "shots" ? (
        <ShotGallery items={c.gallery.items} caption={c.gallery.caption} />
      ) : (
        <PhoneGallery blocks={c.gallery.blocks} caption={c.gallery.caption} />
      )}

      <div className="case-cols">
        <div className="case-about">
          <p className="case-sub rise">What it is</p>
          {c.aboutHtml.map((html, i) => (
            <p key={i} className="rise" style={{ transitionDelay: `${i * 60}ms` }} dangerouslySetInnerHTML={{ __html: html }} />
          ))}

          <p className="case-sub rise" style={{ marginTop: 36 }}>
            What I built
          </p>
          <div className="built">
            {c.built.map((item, i) => (
              <div key={item.title} className="built-item rise" style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                <p dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="case-side rise">
            {c.stackGroups.map((group) => (
              <div className="stack-group" key={group.label}>
                <span className="label" dangerouslySetInnerHTML={{ __html: group.label }} />
                <div className="stack-tags">
                  {group.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="case-side rise" style={{ transitionDelay: "60ms" }}>
            <span className="label" style={{ display: "block", marginBottom: 12 }}>
              The numbers
            </span>
            <div className="nums">
              {c.nums.map((n, i) => (
                <div key={i}>
                  <div className="v" dangerouslySetInnerHTML={{ __html: n.vHtml }} />
                  <div className="k" dangerouslySetInnerHTML={{ __html: n.kHtml }} />
                </div>
              ))}
            </div>
          </div>
          <div className="case-side rise" style={{ transitionDelay: "120ms" }}>
            <span className="label" style={{ display: "block", marginBottom: 10 }}>
              {c.sideLabel}
            </span>
            <p style={{ margin: c.sideLink ? "0 0 14px" : 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--ash)" }}>
              {c.sideHtml}
            </p>
            {c.sideLink && (
              <a className="btn btn-ghost" style={{ minHeight: 44, fontSize: 11.5 }} href={c.sideLink.href} target="_blank" rel="noopener">
                {c.sideLink.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
