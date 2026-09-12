import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Beau_Rivage, Italianno } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
});

export const metadata: Metadata = {
  // placeholder — the original index.html carried the same TODO ("og:url and
  // og:image are relative — point them at the real domain once this is
  // deployed"). Swap this for the real production domain at deploy time.
  metadataBase: new URL("https://ansh-the-range.example.com"),
  title: {
    default: "Shreyansh Kumar Singh — THE RANGE",
    template: "%s — Shreyansh Kumar Singh",
  },
  description:
    "Shreyansh Kumar Singh — nine repositories, stacked. A scroll-driven range of real, running work.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23000'/%3E%3Cg fill='%23FFC000'%3E%3Crect x='4' y='11' width='3' height='9'/%3E%3Crect x='10.5' y='6' width='3' height='14'/%3E%3Crect x='17' y='9' width='3' height='11'/%3E%3C/g%3E%3C/svg%3E",
  },
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
      <body>{children}</body>
    </html>
  );
}
