import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Questions about Shreyansh Kumar Singh. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "FAQ",
    headline: "Questions about Shreyansh Kumar Singh.",
    sub: "Who he is, what he has built, his experience, education and availability \u2014 answered directly.",
  });
}
