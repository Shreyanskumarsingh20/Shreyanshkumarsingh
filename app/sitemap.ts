import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { EXPERIENCE_CASES } from "@/lib/experience";

function projectImages(): string[] {
  return PROJECTS.flatMap((p) => {
    const a = p.art;
    if ("img" in a) return [a.img];
    if ("main" in a) return [a.main.img];
    return [];
  }).map((src) => `${SITE_URL}${src}`);
}

function experienceImages(): string[] {
  return EXPERIENCE_CASES.flatMap(({ gallery: g }) =>
    g.kind === "shots"
      ? g.items.map((it) => it.img)
      : g.blocks.flatMap((b) => b.items.map((it) => it.img)),
  )
    .slice(0, 50)
    .map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      images: projectImages(),
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: experienceImages(),
    },
    {
      url: `${SITE_URL}/lets-talk`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
