import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Projects by Shreyansh Kumar Singh, AI & Full-Stack Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "PROJECTS",
    headline: "AI & full-stack projects.",
    sub: "RAG for banking, an autonomous pentest agent, multi-agent QA, a 3D museum, physics simulators and more \u2014 each a case study.",
  });
}
