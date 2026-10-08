import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Beau_Rivage, Italianno } from "next/font/google";
import "./globals.css";
import "./pages.css";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import Beacon from "@/components/beacon/Beacon";
import Analytics from "@/components/analytics/Analytics";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import { SITE_URL, SITE_NAME, SUMMARY, PERSON, KEYWORDS } from "@/lib/site";

// Inter as its single variable-font file (every weight 100–900) rather than
// five static weights, each of which was a separate preloaded download.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const beauRivage = Beau_Rivage({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-beau-rivage",
  display: "swap",
});

// only a fallback behind Beau Rivage in the loader signature — the browser
// fetches it only if it's actually needed, so don't preload it
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  // set NEXT_PUBLIC_SITE_URL at deploy time — see lib/site.ts
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shreyansh Kumar Singh — AI & Full-Stack Engineer, Pune",
    template: "%s — Shreyansh Kumar Singh",
  },
  description: SUMMARY,
  applicationName: SITE_NAME,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  keywords: KEYWORDS,
  category: "technology",
  // canonicals are set per page — a root default would leak onto the 404
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image", creator: PERSON.xHandle },
  formatDetection: { email: false, telephone: false, address: false },
  other: {
    // tells is-agentic.com which report view fits this site
    "is-agentic-site-type": "content",
  },
  // favicon.ico, icon.png and apple-icon.png in app/ are picked up by Next's
  // file conventions — the SKS monogram on black
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${beauRivage.variable} ${italianno.variable}`}
    >
      <head>
        {/* runs before anything else paints — stops the browser's own scroll-
            position memory (and any leftover #hash from a previous visit)
            from landing a fresh load partway down the page. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ("scrollRestoration" in history) history.scrollRestoration = "manual";`,
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        {children}
        {/* WebMCP: registers three read-only tools (get_profile,
            list_projects, get_contact) with in-browser AI agents where the
            browser supports document.modelContext; a no-op elsewhere.
            Loaded last so it never competes with the page. */}
        <Script src="/api/mcp?webmcp-script" strategy="lazyOnload" />
        {/* first-party visit log → Telegram (see /privacy, lib/beacon) */}
        <Beacon />
        {/* GA4 + Clarity: nothing loads until the visitor accepts (lib/consent.ts) */}
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
