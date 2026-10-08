import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { crawlerAlert } from "@/lib/beacon/crawler-alert";
import { negotiate } from "@/lib/negotiate";

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
//
// It also fires the Telegram crawler/agent alerts (lib/beacon/crawler-alert.ts)
// via waitUntil, so an alert never adds latency to a response. That's why the
// matcher includes llms*.txt, /.well-known/* and /api/mcp — those requests
// are only observed here, then passed straight through.

function mdTarget(pathname: string) {
  const p = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `/md${p}`;
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Telemetry first, and never allowed to break a request: a synchronous throw
  // here (a malformed URL, an odd header) loses one alert, not the page.
  try {
    const alert = crawlerAlert(request);
    if (alert) event.waitUntil(alert);
  } catch {
    // deliberately silent — this runs on every request
  }

  // observed for the alert only; their own routes handle them
  if (pathname.startsWith("/api/") || pathname.startsWith("/.well-known/") || pathname.startsWith("/llms")) {
    return NextResponse.next();
  }

  // explicit markdown URLs: /about.md, /projects/x.md, /index.md
  if (pathname.endsWith(".md")) {
    const page = pathname === "/index.md" ? "/" : pathname.slice(0, -3);
    return NextResponse.rewrite(new URL(mdTarget(page), request.url));
  }

  // other files (images, scripts, .txt, .xml…) pass straight through
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const want = negotiate(request.headers.get("accept"));
  if (want === "markdown") {
    const res = NextResponse.rewrite(new URL(mdTarget(pathname), request.url));
    res.headers.set("Vary", "Accept");
    return res;
  }
  if (want === "none") {
    return new NextResponse("Not Acceptable. This site serves text/html and text/markdown.\n", {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" },
    });
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
    // everything except Next internals, API routes, static asset folders and
    // metadata files. /.well-known/* and llms*.txt are included for the
    // agent alerts (and passed straight through above).
    "/((?!_next/|api/|md/|media/|images/|shots/|sims/|logo/|brand/|favicon|apple-icon|opengraph-image|manifest|robots\\.txt|sitemap\\.xml).*)",
    // MCP clients connecting — observed for the alert, then passed through
    "/api/mcp",
  ],
};
