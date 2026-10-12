import Link from "next/link";
import { RELATED } from "@/lib/nav";

/** "Related pages" — the onward links at the foot of an inner page. */
export default function RelatedPages({ path }: { path: string }) {
  const links = RELATED[path];
  if (!links?.length) return null;
  return (
    <nav className="pg-section shell shell--page related" aria-label="Related pages">
      <h2 className="pg-h2 rise">
        <small>KEEP READING</small>Related pages
      </h2>
      <div className="pg-cards related-cards">
        {links.map((l, i) => (
          <Link key={l.href} href={l.href} className="pg-card rise" style={{ transitionDelay: `${i * 60}ms` }}>
            <h3>{l.title} →</h3>
            <p>{l.text}</p>
          </Link>
        ))}
      </div>
    </nav>
  );
}
