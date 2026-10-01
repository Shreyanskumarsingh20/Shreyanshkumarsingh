"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// matches the .lightbox.closing animation in globals.css
const EXIT_MS = 200;

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
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<number | undefined>(undefined);

  // play the exit animation first, then let the parent unmount us
  const close = useCallback(() => {
    if (exitTimer.current !== undefined) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return onClose();
    setClosing(true);
    exitTimer.current = window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [close]);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  return (
    <div
      className={`lightbox${phone ? " phone" : ""}${closing ? " closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button className="lightbox-close" aria-label="Close" onClick={close}>
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
