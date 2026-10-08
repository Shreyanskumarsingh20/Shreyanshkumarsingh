import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { NOTES, noteBySlug } from "@/lib/notes";

export const alt = "Note by Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = noteBySlug(slug);
  return renderOg({ kicker: "NOTE", headline: n?.title ?? "Note", sub: n?.question ?? "" });
}
