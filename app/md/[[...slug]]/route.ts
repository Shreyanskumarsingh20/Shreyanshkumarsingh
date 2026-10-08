import { markdownFor, notFoundMarkdown } from "@/lib/markdown";

// Markdown twin of every page. Reached through proxy.ts (".md" URLs and
// `Accept: text/markdown`), not linked directly. Unknown paths get a real
// 404 with a short markdown body pointing at llms.txt and the sitemap.

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = "/" + (slug ?? []).join("/");
  const md = markdownFor(path);
  const headers = {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": "noindex",
  };
  if (md === null) return new Response(notFoundMarkdown(path), { status: 404, headers });
  return new Response(md, { status: 200, headers });
}
