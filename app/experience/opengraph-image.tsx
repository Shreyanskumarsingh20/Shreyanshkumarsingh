import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Shreyansh Kumar Singh — four years of full-stack work at RamanByte";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "EXPERIENCE",
    headline: "Four years at RamanByte.",
    sub: "ASP.NET Web API + SQL Server, bound into Angular, shipped to production for real institutions.",
  });
}
