// schema.org graph builders. Every page emits the same Person and WebSite
// nodes (by @id) so crawlers merge them into one entity instead of several
// loosely matching ones. /about is the "entity home": the ProfilePage whose
// mainEntity is this Person.

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

export const PERSON_IMAGE = `${SITE_URL}/images/shreyansh-kumar-singh.jpg`;
const EMPLOYER_ID = `${SITE_URL}/#ramanbyte`;
const SCHOOL_ID = `${SITE_URL}/#aktu`;

export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON.name,
  givenName: PERSON.givenName,
  familyName: PERSON.familyName,
  jobTitle: PERSON.jobTitle,
  description: SUMMARY,
  // the facts that separate him from other people with the same name
  disambiguatingDescription: `AI and full-stack engineer at ${PERSON.employer.name}, Pune, India — builder of Sarthi, Nythera, HallogenAI and Antarang.`,
  url: SITE_URL,
  mainEntityOfPage: `${SITE_URL}/about`,
  image: {
    "@type": "ImageObject",
    url: PERSON_IMAGE,
    width: 941,
    height: 941,
    caption: `${PERSON.name}, AI and full-stack engineer in Pune`,
  },
  email: `mailto:${PERSON.email}`,
  sameAs: SAME_AS,
  knowsAbout: KNOWS_ABOUT,
  knowsLanguage: ["en"],
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.locality,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: PERSON.locality,
    addressRegion: PERSON.region,
    addressCountry: PERSON.country,
  },
  worksFor: { "@id": EMPLOYER_ID },
  alumniOf: { "@id": SCHOOL_ID },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: PERSON.education.degree,
    credentialCategory: "degree",
    educationalLevel: "Bachelor's degree",
    recognizedBy: { "@id": SCHOOL_ID },
    dateCreated: PERSON.education.end,
  },
  hasOccupation: {
    "@type": "Occupation",
    name: PERSON.jobTitle,
    occupationLocation: { "@type": "City", name: `${PERSON.locality}, ${PERSON.countryName}` },
    skills: KNOWS_ABOUT.join(", "),
  },
  // email only — the phone number is deliberately kept out of structured data
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "professional inquiries",
    email: PERSON.email,
    url: `${SITE_URL}/contact`,
    areaServed: "Worldwide",
    availableLanguage: ["English"],
  },
};

export const employerNode = {
  "@type": "Organization",
  "@id": EMPLOYER_ID,
  name: PERSON.employer.name,
  address: {
    "@type": "PostalAddress",
    addressLocality: PERSON.locality,
    addressRegion: PERSON.region,
    addressCountry: PERSON.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "employee reference",
    url: `${SITE_URL}/experience`,
  },
};

export const schoolNode = {
  "@type": "CollegeOrUniversity",
  "@id": SCHOOL_ID,
  name: PERSON.education.school,
  url: PERSON.education.schoolUrl,
  sameAs: PERSON.education.schoolSameAs,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
};

/** His role at RamanByte as an OrganizationRole (start date included). */
export const employmentRole = {
  "@type": "OrganizationRole",
  roleName: PERSON.employer.role,
  startDate: PERSON.employer.startDate,
  worksFor: { "@id": EMPLOYER_ID },
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: "THE RANGE",
  description: SUMMARY,
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
  copyrightHolder: { "@id": PERSON_ID },
};

/** The nodes every page carries. */
export const coreNodes = [personNode, employerNode, schoolNode, websiteNode];

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

/** A WebPage-family node for an inner page. */
export function pageNode(opts: {
  type?: string;
  path: string;
  name: string;
  description: string;
  dateModified: string;
  crumbs?: { name: string; path: string }[];
  extra?: Record<string, unknown>;
}) {
  const url = `${SITE_URL}${opts.path}`;
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#page`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    dateModified: opts.dateModified,
    ...(opts.crumbs ? { breadcrumb: breadcrumbs(opts.crumbs) } : {}),
    ...opts.extra,
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
