import { sitemapEntries } from "@/lib/sitemap";

// The sitemap, written by hand rather than by Next's app/sitemap.ts.
// Next emits each <url>'s <image:image> blocks *before* <lastmod>, but the
// sitemaps.org schema is a strict sequence — loc, lastmod, changefreq,
// priority, then extension elements such as images. Bing accepted the old
// order; Google Search Console reported "Sitemap could not be read".

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const urls = sitemapEntries().map((e) =>
    [
      "<url>",
      `<loc>${esc(e.url)}</loc>`,
      `<lastmod>${esc(e.lastModified)}</lastmod>`,
      ...(e.images ?? []).map((src) => `<image:image><image:loc>${esc(src)}</image:loc></image:image>`),
      "</url>",
    ].join("\n"),
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
