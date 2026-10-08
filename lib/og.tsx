import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared 1200×630 social card in the site's black + gold palette, carrying
// the SKS monogram and wordmark. Each route's opengraph-image.tsx passes its
// own kicker/headline. Rendered at build time, so reading the logo files
// from disk is fine.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const GOLD = "#FFC000";

function dataUri(file: string) {
  return `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "brand", file)).toString("base64")}`;
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
  const mark = dataUri("sks-mark-og.png");
  const wordmark = dataUri("sks-wordmark-og.png");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "#000",
          backgroundImage:
            "linear-gradient(rgba(255,192,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,192,0,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={56} height={55} alt="" />
          <div style={{ fontSize: 24, letterSpacing: 6, color: GOLD }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{headline}</div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)", lineHeight: 1.3 }}>{sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={304} height={120} alt="" style={{ height: 64, width: 162 }} />
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.6)" }}>AI &amp; Full-Stack Engineer · Pune, India</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
