import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Shreyansh Kumar Singh — AI & Full-Stack Engineer, THE RANGE portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "THE RANGE",
    headline: "Nine repositories. One stack.",
    sub: "A RAG copilot for banking, an autonomous pentest agent, a 3D museum — and four years of production .NET + Angular.",
  });
}
