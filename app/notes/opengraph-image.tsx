import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Technical notes by Shreyansh Kumar Singh, AI & Full-Stack Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "NOTES",
    headline: "Technical notes by Shreyansh Kumar Singh.",
    sub: "RAG pipelines, pentest false positives, AI bug-fix verification, R3F jitter, distributed k6 \u2014 answered first-hand.",
  });
}
