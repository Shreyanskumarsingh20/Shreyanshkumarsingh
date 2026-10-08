import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Questions his projects answer. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "NOTES",
    headline: "Questions his projects answer.",
    sub: "RAG pipelines, pentest false positives, AI bug-fix verification, R3F jitter, distributed k6 \u2014 answered first-hand.",
  });
}
