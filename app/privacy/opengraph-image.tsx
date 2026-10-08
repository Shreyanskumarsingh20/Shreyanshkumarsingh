import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "No cookies. No tracking. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "PRIVACY",
    headline: "No cookies. No tracking.",
    sub: "How shreyanshkumarsingh.com handles visitor data.",
  });
}
