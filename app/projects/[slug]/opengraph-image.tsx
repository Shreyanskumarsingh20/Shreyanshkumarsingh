import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { CASE_STUDIES, caseStudyBySlug } from "@/lib/case-studies";
import { projectBySlug } from "@/lib/projects";

export const alt = "Case study by Shreyansh Kumar Singh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  const p = projectBySlug(slug);
  return renderOg({
    kicker: `CASE STUDY · ${p?.domain ?? "PROJECT"}`,
    headline: p?.name ?? "Project",
    sub: p?.line ?? cs?.description ?? "",
  });
}
