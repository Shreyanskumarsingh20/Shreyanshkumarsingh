import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Nine projects, nine domains. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "PROJECTS",
    headline: "Nine projects, nine domains.",
    sub: "RAG for banking, an autonomous pentest agent, multi-agent QA, a 3D museum, physics simulators and more \u2014 each a case study.",
  });
}
