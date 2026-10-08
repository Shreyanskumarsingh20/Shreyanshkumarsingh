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
import { PROJECTS, type Project } from "@/lib/projects";
import { FAQS } from "@/lib/faqs";
import { SITE_URL, PERSON_ID, WEBSITE_ID } from "@/lib/site";
import { graph, personNode, websiteNode } from "@/lib/jsonld";

function projectImage(p: Project): string {
  const a = p.art;
  if ("img" in a) return a.img;
  if ("main" in a) return a.main.img;
  return "/opengraph-image";
}

const TITLE = "Shreyansh Kumar Singh — Applied AI & Full-Stack Engineer, Pune";
const DESCRIPTION =
  "Shreyansh Kumar Singh is an AI and full-stack engineer in Pune, India: a RAG copilot for banking, an autonomous pentest agent, a 3D museum, and four years of production .NET and Angular.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    firstName: "Shreyansh",
    lastName: "Kumar Singh",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const jsonLd = graph(
  {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: SITE_URL,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
  },
  personNode,
  websiteNode,
  {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#range`,
    name: "THE RANGE — projects by Shreyansh Kumar Singh",
    numberOfItems: PROJECTS.length,
    itemListElement: PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: p.name,
        description: p.line,
        applicationCategory: p.domain,
        programmingLanguage: p.stack,
        author: { "@id": PERSON_ID },
        image: `${SITE_URL}${projectImage(p)}`,
        ...(p.url ? { codeRepository: p.url, url: p.url } : {}),
      },
    })),
  },
  {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
