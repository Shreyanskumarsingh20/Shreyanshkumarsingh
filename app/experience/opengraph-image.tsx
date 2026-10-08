import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Experience of Shreyansh Kumar Singh, AI & Full-Stack Engineer, at RamanByte";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "EXPERIENCE",
    headline: "Full-stack engineering at RamanByte.",
    sub: "Shreyansh Kumar Singh, since January 2023: ASP.NET Core, SQL Server, Angular and Flutter, shipped to production for real institutions.",
  });
}
