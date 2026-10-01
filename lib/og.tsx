import { ImageResponse } from "next/og";

// Shared 1200×630 social card in the site's black + gold palette. Each
// route's opengraph-image.tsx passes its own kicker/headline.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const GOLD = "#FFC000";

function Bars({ scale = 1 }: { scale?: number }) {
  const bar = (h: number) => (
    <div style={{ width: 18 * scale, height: h * scale, background: GOLD }} />
  );
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 * scale }}>
      {bar(54)}
      {bar(84)}
      {bar(66)}
    </div>
  );
}

export function renderOg({
  kicker,
  headline,
  sub,
}: {
  kicker: string;
  headline: string;
  sub: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#000",
          backgroundImage:
            "linear-gradient(rgba(255,192,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,192,0,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Bars scale={0.6} />
          <div style={{ fontSize: 26, letterSpacing: 6, color: GOLD }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {headline}
          </div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>
            {sub}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <div style={{ color: "#fff" }}>Shreyansh Kumar Singh</div>
          <div style={{ color: "rgba(255,255,255,0.55)" }}>AI &amp; Full-Stack Engineer · Pune, India</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export function renderIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        <Bars scale={size / 150} />
      </div>
    ),
    { width: size, height: size },
  );
}
