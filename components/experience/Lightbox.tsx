"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Lightbox({
  src,
  alt,
  phone,
  onClose,
}: {
  src: string;
  alt: string;
  phone?: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className={phone ? "lightbox phone" : "lightbox"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        &times;
      </button>
      <Image
        src={src}
        alt={alt}
        width={phone ? 380 : 1600}
        height={phone ? 760 : 900}
        style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
        unoptimized
      />
    </div>
  );
}
