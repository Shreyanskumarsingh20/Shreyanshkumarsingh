import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Call, WhatsApp or email. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "CONTACT",
    headline: "Call, WhatsApp or email.",
    sub: "Shreyansh Kumar Singh, AI & full-stack engineer in Pune \u2014 open to full-time or hybrid roles.",
  });
}
