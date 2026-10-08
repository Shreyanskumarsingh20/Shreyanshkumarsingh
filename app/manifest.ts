import type { MetadataRoute } from "next";
import { PERSON, SUMMARY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PERSON.name} — AI & Full-Stack Engineer`,
    short_name: "SKS",
    description: SUMMARY,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
