import type { MetadataRoute } from "next";
import { PERSON, SUMMARY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.name} — THE RANGE`,
    short_name: "THE RANGE",
    description: SUMMARY,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
