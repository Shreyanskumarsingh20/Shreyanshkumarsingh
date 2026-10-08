import { NextResponse, type NextRequest } from "next/server";

// Markdown for agents (Next 16 "proxy", formerly middleware).
//
// - `GET /about.md` (or `/index.md` for home) → the page as markdown
// - `Accept: text/markdown` preferred over HTML → the same markdown, at the
//   page's own URL (content negotiation, RFC 9110 q-values honoured)
// - Accept lists neither HTML, markdown, nor a wildcard → 406
// - Every page response says `Vary: Accept` (so a CDN never hands cached
//   HTML to a markdown client or vice versa) and advertises its markdown
//   twin and llms.txt in a `Link` header (RFC 8288).
//
// The markdown itself comes from app/md/[[...slug]]/route.ts, which builds
// it from the same data the pages render (lib/markdown.ts).

type Pref = { type: string; q: number };

function parseAccept(header: string | null): Pref[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [type, ...params] = part.trim().toLowerCase().split(";");
      const qp = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qp ? Number.parseFloat(qp.slice(2)) : 1;
      return { type: type.trim(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((p) => p.type);
}

/** q for a media type, by RFC 9110 specificity: exact > type/* > *\/* */
function qFor(prefs: Pref[], type: string): number {
  const [major] = type.split("/");
  const exact = prefs.find((p) => p.type === type);
  if (exact) return exact.q;
  const group = prefs.find((p) => p.type === `${major}/*`);
  if (group) return group.q;
  const any = prefs.find((p) => p.type === "*/*");
  return any ? any.q : 0;
}

function mdTarget(pathname: string) {
  const p = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `/md${p}`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // explicit markdown URLs: /about.md, /projects/x.md, /index.md
  if (pathname.endsWith(".md")) {
    const page = pathname === "/index.md" ? "/" : pathname.slice(0, -3);
    return NextResponse.rewrite(new URL(mdTarget(page), request.url));
  }

  // other files (images, scripts, .txt, .xml…) pass straight through
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const accept = request.headers.get("accept");
  const prefs = parseAccept(accept);
  if (prefs.length) {
    const md = qFor(prefs, "text/markdown");
    const html = Math.max(qFor(prefs, "text/html"), qFor(prefs, "application/xhtml+xml"));
    if (md > 0 && md > html) {
      const res = NextResponse.rewrite(new URL(mdTarget(pathname), request.url));
      res.headers.set("Vary", "Accept");
      return res;
    }
    if (md <= 0 && html <= 0) {
      return new NextResponse("Not Acceptable. This site serves text/html and text/markdown.\n", {
        status: 406,
        headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" },
      });
    }
  }

  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  const mdHref = pathname === "/" ? "/index.md" : `${pathname.replace(/\/+$/, "")}.md`;
  res.headers.set(
    "Link",
    [
      `<${mdHref}>; rel="alternate"; type="text/markdown"`,
      `</llms.txt>; rel="describedby"; type="text/plain"`,
      `</sitemap.xml>; rel="sitemap"; type="application/xml"`,
    ].join(", "),
  );
  return res;
}

export const config = {
  matcher: [
    // everything except Next internals, API routes, well-known files,
    // static asset folders and metadata files
    "/((?!_next/|api/|md/|\\.well-known/|media/|images/|shots/|sims/|logo/|favicon|apple-icon|opengraph-image|manifest|robots\\.txt|sitemap\\.xml|llms).*)",
  ],
};
