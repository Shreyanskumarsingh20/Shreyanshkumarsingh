import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Shreyansh Kumar Singh \u2014 Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "R\u00c9SUM\u00c9",
    headline: "Shreyansh Kumar Singh",
    sub: "Full-stack & AI engineer: RamanByte since January 2023 \u2014 ASP.NET Core, Angular, Flutter, SQL Server \u2014 plus RAG and LLM-agent projects.",
  });
}
