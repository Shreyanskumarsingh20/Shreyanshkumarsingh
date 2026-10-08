import Link from "next/link";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail; pair with lib/jsonld.ts `breadcrumbs()`. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs shell shell--page" aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={c.path}>
            {i < items.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
