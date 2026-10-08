import type { Metadata } from "next";
import { preconnect } from "react-dom";
import HomeTopBar from "@/components/home/HomeTopBar";
import Loader from "@/components/home/Loader";
import HomeInteractions from "@/components/home/HomeInteractions";
import Hero from "@/components/sections/Hero";
import Build from "@/components/sections/Build";
import Range from "@/components/sections/Range";
import Research from "@/components/sections/Research";
import Method from "@/components/sections/Method";
import Philosophy from "@/components/sections/Philosophy";
import Faq from "@/components/sections/Faq";
import Telemetry from "@/components/sections/Telemetry";
import Contact from "@/components/sections/Contact";
import MobileNav from "@/components/ui/MobileNav";
import CommandPalette from "@/components/ui/CommandPalette";
import Terminal from "@/components/ui/Terminal";
import ProjectModal from "@/components/ui/ProjectModal";
import SimModal from "@/components/ui/SimModal";
import ContactModal from "@/components/ui/ContactModal";
import Toast from "@/components/ui/Toast";
import JsonLd from "@/components/JsonLd";
import { PROJECTS, projectHref, projectImage } from "@/lib/projects";
import { SITE_URL, PERSON_ID, WEBSITE_ID } from "@/lib/site";
import { graph, coreNodes } from "@/lib/jsonld";

const TITLE = "Shreyansh Kumar Singh — Applied AI & Full-Stack Engineer, Pune";
const DESCRIPTION =
  "Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India: a RAG copilot for banking, an autonomous pentest agent, a 3D museum, and four years of production .NET and Angular.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
  openGraph: {
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = graph(
  {
    // /about is the ProfilePage ("entity home"); the home page is the
    // portfolio about him
    "@type": "WebPage",
    "@id": `${SITE_URL}/#page`,
    url: SITE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
    inLanguage: "en",
  },
  ...coreNodes,
  {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#range`,
    name: "THE RANGE — projects by Shreyansh Kumar Singh",
    numberOfItems: PROJECTS.length,
    // each item is the SoftwareSourceCode node on its case-study page
    itemListElement: PROJECTS.map((p, i) => {
      const url = `${SITE_URL}${projectHref(p.slug)}`;
      const img = projectImage(p);
      return {
        "@type": "ListItem",
        position: i + 1,
        url,
        item: {
          "@type": "SoftwareSourceCode",
          "@id": `${url}#software`,
          name: p.name,
          description: p.line,
          programmingLanguage: p.stack,
          author: { "@id": PERSON_ID },
          ...(img ? { image: `${SITE_URL}${img.src}` } : {}),
          ...(p.url ? { codeRepository: p.url } : {}),
        },
      };
    }),
  },
);

export default function HomePage() {
  // the "Last shipped" ticker calls the GitHub API right after hydration
  preconnect("https://api.github.com", { crossOrigin: "anonymous" });
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* background particle field — real gravity/cursor physics, fixed behind
          the whole page, visible in every gap between opaque sections. */}
      <canvas id="fieldBg" aria-hidden="true"></canvas>

      <Loader />

      <HomeTopBar />

      <div className="hud mono" id="hud">
        <div id="hudLine">DEPTH — / —</div>
        <div className="bar">
          <i id="hudBar"></i>
        </div>
      </div>

      <main id="main">
        <Hero />
        <Build />
        <Range />
        <Research />
        <Method />
        <Philosophy />
        <Faq />
        <Telemetry />
      </main>
      <Contact />

      <MobileNav />
      <CommandPalette />
      <Terminal />
      <ProjectModal />
      <SimModal />
      <ContactModal />
      <Toast />

      <HomeInteractions />
    </>
  );
}
