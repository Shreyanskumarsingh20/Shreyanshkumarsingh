import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "What Shreyansh builds with. \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "SKILLS",
    headline: "What Shreyansh builds with.",
    sub: "RAG and LLM agents \u00b7 C#, ASP.NET Core, SQL Server, Angular \u00b7 Next.js \u00b7 Flutter \u00b7 React Three Fiber \u2014 each linked to the work.",
  });
}
