import type { Metadata } from "next";
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
import CommandPalette from "@/components/ui/CommandPalette";
import Terminal from "@/components/ui/Terminal";
import ProjectModal from "@/components/ui/ProjectModal";
import SimModal from "@/components/ui/SimModal";
import ContactModal from "@/components/ui/ContactModal";
import Toast from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Shreyansh Kumar Singh — THE RANGE",
  description:
    "Shreyansh Kumar Singh — nine repositories, stacked. A scroll-driven range of real, running work.",
  openGraph: {
    type: "website",
    title: "Shreyansh Kumar Singh — THE RANGE",
    description:
      "Shreyansh Kumar Singh — nine repositories, stacked. A scroll-driven range of real, running work.",
    images: ["/shots/collectors-real.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyansh Kumar Singh — THE RANGE",
    description:
      "Shreyansh Kumar Singh — nine repositories, stacked. A scroll-driven range of real, running work.",
    images: ["/shots/collectors-real.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shreyansh Kumar Singh",
  jobTitle: "Engineer",
  url: "https://github.com/gamersinghxx-creator",
  sameAs: ["https://github.com/gamersinghxx-creator"],
  description:
    "Builds systems that make invisible things legible — blast physics, attack surfaces, a thousand years of art, a bank's document pile.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

      <Hero />
      <Build />
      <Range />
      <Research />
      <Method />
      <Philosophy />
      <Faq />
      <Telemetry />
      <Contact />

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
