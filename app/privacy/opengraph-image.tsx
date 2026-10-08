import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Privacy policy of shreyanshkumarsingh.com";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "PRIVACY",
    headline: "Privacy policy.",
    sub: "No cookies, no ads, no third-party analytics. First-party visit logging you can switch off.",
  });
}
