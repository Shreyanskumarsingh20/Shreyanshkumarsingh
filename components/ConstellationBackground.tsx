"use client";

import { useEffect, useRef } from "react";

/**
 * A fixed starfield canvas behind the whole page — verbatim port of the
 * canvas logic shared by experience.html and lets-talk.html. Star count
 * scales with viewport area; lines only draw between stars close enough to
 * read as a constellation, not a web. One static frame under reduced motion.
 */
export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w: number, h: number;
    let stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
    let raf = 0;

    function resize() {
      const prevW = w,
        prevH = h;
      w = canvas!.width = Math.floor(window.innerWidth * dpr);
      h = canvas!.height = Math.floor(window.innerHeight * dpr);
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
      // height-only resizes are mobile browsers showing/hiding the URL bar
      // mid-scroll — stretch the existing field instead of re-randomizing
      // every star, which read as a visible jump
      if (stars.length && prevW === w && prevH) {
        const k = h / prevH;
        stars.forEach((s) => (s.y *= k));
        if (reduce) draw(0);
        return;
      }
      const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 26000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.1 + 0.5) * dpr,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
      }));
      // no rAF loop under reduced motion — resizing clears the canvas, so redraw
      if (reduce && prevW) draw(0);
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      const linkDist = 105 * dpr;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x,
            dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx!.strokeStyle = `rgba(255,192,0,${(1 - dist / linkDist) * 0.09})`;
            ctx!.lineWidth = dpr;
            ctx!.beginPath();
            ctx!.moveTo(stars[i].x, stars[i].y);
            ctx!.lineTo(stars[j].x, stars[j].y);
            ctx!.stroke();
          }
        }
      }
      stars.forEach((s) => {
        const twinkle = reduce ? 1 : 0.45 + Math.sin(((t || 0) / 1000) * s.speed + s.phase) * 0.55;
        ctx!.fillStyle = `rgba(255,255,255,${0.3 + twinkle * 0.6})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      });
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} id="constellation" aria-hidden="true" />;
}
