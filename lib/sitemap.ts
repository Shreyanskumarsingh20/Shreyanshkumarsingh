import { SITE_URL } from "@/lib/site";
import { PROJECTS, projectBySlug, projectHref, projectImage } from "@/lib/projects";
import { CASE_STUDIES } from "@/lib/case-studies";
import { NOTES, noteHref } from "@/lib/notes";
import { EXPERIENCE_CASES } from "@/lib/experience";

// Sitemap entries, served as XML by app/sitemap.xml/route.ts.
//
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
  projects: "2026-10-08",
  notes: "2026-10-08",
  resume: "2026-10-08",
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

export type SitemapEntry = { url: string; lastModified: string; images?: string[] };

export function sitemapEntries(): SitemapEntry[] {
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
    { url: `${SITE_URL}/resume`, lastModified: UPDATED.resume },
    { url: `${SITE_URL}/notes`, lastModified: UPDATED.notes },
    ...NOTES.map((n) => ({ url: `${SITE_URL}${noteHref(n.slug)}`, lastModified: n.updated })),
    { url: `${SITE_URL}/projects`, lastModified: UPDATED.projects, images: projectImages() },
    ...CASE_STUDIES.map((cs) => {
      const p = projectBySlug(cs.slug);
      const img = p ? projectImage(p) : null;
      return {
        url: `${SITE_URL}${projectHref(cs.slug)}`,
        lastModified: cs.updated,
        ...(img ? { images: [`${SITE_URL}${img.src}`] } : {}),
      };
    }),
  ];
}
