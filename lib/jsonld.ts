// schema.org graph builders. Every page emits the same Person and WebSite
// nodes (by @id) so crawlers merge them into one entity instead of several
// loosely matching ones.

import {
  SITE_URL,
  SITE_NAME,
  PERSON,
  PERSON_ID,
  WEBSITE_ID,
  SAME_AS,
  SUMMARY,
  KNOWS_ABOUT,
} from "@/lib/site";

export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON.name,
  jobTitle: PERSON.jobTitle,
  description: SUMMARY,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: `mailto:${PERSON.email}`,
  sameAs: SAME_AS,
  knowsAbout: KNOWS_ABOUT,
  address: {
    "@type": "PostalAddress",
    addressLocality: PERSON.locality,
    addressRegion: PERSON.region,
    addressCountry: PERSON.country,
  },
  worksFor: {
    "@type": "Organization",
    name: PERSON.employer.name,
  },
  hasOccupation: {
    "@type": "Occupation",
    name: PERSON.jobTitle,
    occupationLocation: {
      "@type": "City",
      name: `${PERSON.locality}, ${PERSON.countryName}`,
    },
    skills: KNOWS_ABOUT.join(", "),
  },
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SUMMARY,
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Strips the inline markup some data strings carry, for plain-text fields. */
export function plain(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
