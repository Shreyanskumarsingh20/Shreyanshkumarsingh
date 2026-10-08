import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "FAQ about Shreyansh Kumar Singh, AI & Full-Stack Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "FAQ",
    headline: "Questions about Shreyansh Kumar Singh.",
    sub: "Who he is, what he has built, his experience, education and availability \u2014 answered directly.",
  });
}
