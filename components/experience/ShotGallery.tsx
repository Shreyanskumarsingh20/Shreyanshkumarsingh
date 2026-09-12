"use client";

import { useState } from "react";
import Image from "next/image";
import type { ShotItem } from "@/lib/experience";
import Lightbox from "./Lightbox";

/**
 * The desktop screenshot gallery — a browser-chrome frame around a main
 * image, a thumbnail strip that swaps it, and a click-to-enlarge lightbox.
 * Ported as a self-contained client component with real React state (a
 * cleaner fit here than the original's getElementById-per-instance pattern,
 * since each case study's gallery is independent and doesn't need to
 * interoperate with the rest of the page the way the home page's monolithic
 * script does).
 */
export default function ShotGallery({ items, caption }: { items: ShotItem[]; caption: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = items[active];

  return (
    <figure className="shots rise">
      <div className="shot-frame">
        <div className="shot-chrome">
          <i></i>
          <i></i>
          <i></i>
          <span className="shot-url mono">{current.label}</span>
          <span className="shot-hint">click to enlarge</span>
        </div>
        <div className="shot-stage" onClick={() => setLightbox(true)}>
          <Image src={current.img} alt={current.alt} fill sizes="(min-width: 900px) 900px, 100vw" />
        </div>
      </div>
      <div className="shot-thumbs">
        {items.map((item, i) => (
          <button
            key={item.img}
            type="button"
            className={`shot-thumb${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <Image src={item.img} alt="" fill sizes="140px" />
            <span>{item.thumb}</span>
          </button>
        ))}
      </div>
      <figcaption className="shot-cap" dangerouslySetInnerHTML={{ __html: caption }} />
      {lightbox && <Lightbox src={current.img} alt={current.alt} onClose={() => setLightbox(false)} />}
    </figure>
  );
}
