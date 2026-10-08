import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";
import { EXPERIENCE_CASES } from "@/lib/experience";

// lastModified is the date the page's *content* last changed — never the
// build time. Google only trusts <lastmod> when it's "consistently and
// verifiably accurate"; stamping every URL with new Date() on each deploy
// teaches it to ignore the field. changefreq/priority are omitted because
// Google ignores both. Bump a date here when that page's content changes.
const UPDATED = {
  home: "2026-10-08",
  about: "2026-10-08",
  experience: "2026-10-08",
  skills: "2026-10-08",
  faq: "2026-10-08",
  contact: "2026-10-08",
  privacy: "2026-10-08",
} as const;

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
  return [
    { url: SITE_URL, lastModified: UPDATED.home, images: projectImages() },
    {
      url: `${SITE_URL}/about`,
      lastModified: UPDATED.about,
      images: [`${SITE_URL}/images/shreyansh-kumar-singh.jpg`, `${SITE_URL}/images/shreyansh-kumar-singh-desk.jpg`],
    },
    { url: `${SITE_URL}/experience`, lastModified: UPDATED.experience, images: experienceImages() },
    { url: `${SITE_URL}/skills`, lastModified: UPDATED.skills },
    { url: `${SITE_URL}/faq`, lastModified: UPDATED.faq },
    {
      url: `${SITE_URL}/contact`,
      lastModified: UPDATED.contact,
      images: [`${SITE_URL}/images/shreyansh-kumar-singh-portrait.jpg`],
    },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED.privacy },
  ];
}
