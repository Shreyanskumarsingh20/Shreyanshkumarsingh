import ConstellationBackground from "@/components/ConstellationBackground";
import RevealObserver from "@/components/RevealObserver";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Breadcrumbs, { type Crumb } from "@/components/site/Breadcrumbs";

/**
 * Chrome shared by the inner pages (about, contact, faq, skills, privacy,
 * projects, notes): header, the constellation backdrop, a <main> landmark,
 * optional visible breadcrumbs, and the sitewide footer.
 */
export default function PageShell({
  current,
  crumbs,
  children,
}: {
  /** the nav href to mark aria-current */
  current?: string;
  crumbs?: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <>
      <ConstellationBackground />
      <SiteHeader current={current} />
      <main id="main" className="pg">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {children}
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
