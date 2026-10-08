import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageShell>
      <section className="nf shell shell--page">
        <div>
          <p className="nf-code">404</p>
          <h1 className="pg-h1">
            Page not found
            <br />
            <span className="dim">Try one of these pages instead</span>
          </h1>
          <p className="pg-lede">
            This page doesn&apos;t exist — it may have moved. Try one of these, or the{" "}
            <Link className="pg-link" href="/sitemap.xml">sitemap</Link>.
          </p>
          <div className="pg-cta">
            <Link className="btn btn-gold cut-sm" href="/">
              <span>Home →</span>
            </Link>
            <Link className="btn btn-ghost" href="/about">
              About Shreyansh
            </Link>
            <Link className="btn btn-ghost" href="/#range">
              The projects
            </Link>
            <Link className="btn btn-ghost" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
