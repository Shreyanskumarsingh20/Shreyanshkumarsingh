"use client";

import { useState } from "react";
import Image from "next/image";
import type { PhoneItem } from "@/lib/experience";
import Lightbox from "./Lightbox";

/**
 * The phone-bezel gallery (Dada Udyogini's case study) — real store-listing
 * screenshots at native small resolution, shown true-size instead of
 * stretched into the wide desktop .shot-stage frame.
 */
export default function PhoneGallery({
  blocks,
  caption,
}: {
  blocks: { label: string; count: string; items: PhoneItem[] }[];
  caption: string;
}) {
  const [lightboxItem, setLightboxItem] = useState<PhoneItem | null>(null);

  return (
    <figure className="shots rise">
      {blocks.map((block) => (
        <div className="phone-block" key={block.label}>
          <p className="phone-block-label mono">
            {block.label} <span className="count">{block.count}</span>
          </p>
          <div className="phone-row">
            {block.items.map((item) => (
              <div className="phone-card" key={item.img} onClick={() => setLightboxItem(item)}>
                <div className="ph-screen">
                  <Image src={item.img} alt={item.alt} width={150} height={267} unoptimized />
                </div>
                <p className="ph-cap">{item.cap}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <figcaption className="shot-cap">{caption}</figcaption>
      {lightboxItem && (
        <Lightbox src={lightboxItem.img} alt={lightboxItem.alt} phone onClose={() => setLightboxItem(null)} />
      )}
    </figure>
  );
}
