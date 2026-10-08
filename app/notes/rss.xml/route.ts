import { NOTES, noteHref } from "@/lib/notes";
import { SITE_URL, PERSON } from "@/lib/site";

// RSS 2.0 feed of /notes.
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [...NOTES]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((n) => {
      const url = `${SITE_URL}${noteHref(n.slug)}`;
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(n.published).toUTCString()}</pubDate>
      <dc:creator>${esc(PERSON.name)}</dc:creator>
      <description>${esc(n.answer)}</description>
    </item>`;
    })
    .join("\n");
  const latest = NOTES.map((n) => n.updated).sort().at(-1) ?? "2026-10-08";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Notes — ${esc(PERSON.name)}</title>
    <link>${SITE_URL}/notes</link>
    <atom:link href="${SITE_URL}/notes/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Short technical notes by ${esc(PERSON.name)}, AI &amp; full-stack engineer in Pune — each answering one question first-hand.</description>
    <language>en</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
