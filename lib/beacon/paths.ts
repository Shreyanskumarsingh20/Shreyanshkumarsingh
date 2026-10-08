/**
 * What a request was actually asking for (ported from Imprint, routes
 * rewritten for this site).
 *
 * proxy.ts runs *before* routes are resolved and cannot see the response, so
 * without this a request for `/.git/HEAD` and a request for `/about` would read
 * identically in an alert. The path is classified by two independent questions
 * that fail in opposite directions and must not be collapsed:
 *
 *   known  — does this match the shape of a real route? Errs toward "yes". A
 *            mistyped note slug reported as a page is a shrug; a real page
 *            reported as a 404 is a lie.
 *   probe  — is this a recognised attack target? Errs toward "no". Nothing on
 *            this site mentions wp-admin, so a hit there is never ambiguous.
 *
 * ⚠ Add a route, add it here (STATIC_ROUTES / ROUTE_SHAPES). This file must not
 * import the content modules — it runs in the proxy on every request.
 */

/** Machine-readable files an agent fetches on purpose — the most interesting
 *  arrivals this site can log. */
const AGENT_FILES = new Set([
  "/llms.txt",
  "/llms-full.txt",
  "/.well-known/ai-catalog.json",
  "/.well-known/ard.json",
  "/.well-known/mcp/server-card.json",
  "/.well-known/security.txt",
  "/notes/rss.xml",
  // a search engine reading the sitemap — rare, and the only proof that
  // Search Console's "Couldn't fetch" has actually turned into a fetch
  "/sitemap.xml",
]);

/**
 * Paths worth an alert at all. Assets are noise: one page view would otherwise
 * fan out into a dozen messages. robots.txt is excluded too — every
 * well-behaved crawler fetches it first, and the page fetch that follows
 * carries the same news. sitemap.xml is reported (see AGENT_FILES).
 *
 * ⚠ Not the first filter: nearly every probe target ends in what looks like a
 * file extension (`.env`, `wp-login.php`, `dump.sql`), so callers check
 * `classifyPath(...).probe` before this.
 */
export function isReportablePath(pathname: string): boolean {
  if (AGENT_FILES.has(pathname)) return true;
  if (pathname === "/api/mcp") return true; // an MCP client connecting
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) return false;
  if (pathname === "/robots.txt") return false;
  // the markdown twin of a page — an agent reading on purpose
  if (pathname.endsWith(".md")) return true;
  // Next's generated share cards have no extension: /about/opengraph-image-1x2y
  if (/(^|\/)(opengraph-image|twitter-image|icon|apple-icon)(-[a-z0-9]+)?$/i.test(pathname)) return false;
  // anything else with a file extension is an asset, not a page
  return !/\.[a-z0-9]{2,5}$/i.test(pathname);
}

const STATIC_ROUTES = new Set([
  "/",
  "/about",
  "/contact",
  "/experience",
  "/faq",
  "/notes",
  "/privacy",
  "/projects",
  "/resume",
  "/skills",
  "/index.md",
  "/api/mcp",
  ...AGENT_FILES,
]);

const SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";
const PAGES = "about|contact|experience|faq|notes|privacy|projects|resume|skills";

/** The dynamic families, as shapes rather than lookups. */
const ROUTE_SHAPES = [
  new RegExp(`^/projects/${SLUG}(?:\\.md)?$`),
  new RegExp(`^/notes/${SLUG}(?:\\.md)?$`),
  new RegExp(`^/(?:${PAGES})\\.md$`),
];

/**
 * Recognised probe targets, each with what the scanner was hoping to find.
 * Every pattern is anchored to whole path segments, never a bare substring.
 */
const SEG = "(?:^|/)";
const PROBES: [RegExp, string][] = [
  [/^\/\.git(\/|$)/i, "git repository — source and history"],
  [/^\/\.env(\.|\/|$)/i, "env file — API keys, bot tokens"],
  [/^\/\.(aws|ssh|npmrc|docker|htpasswd|svn|hg|vscode|idea)(\/|$)/i, "developer credentials"],
  [new RegExp(`${SEG}(wp-admin|wp-login\\.php|wp-content|wp-includes|xmlrpc\\.php|wordpress)(/|$)`, "i"), "WordPress"],
  [new RegExp(`${SEG}(phpmyadmin|phpinfo\\.php|eval-stdin\\.php|cgi-bin|vendor|phpunit)(/|$)`, "i"), "PHP tooling"],
  [/^\/(administrator|admin|cpanel|webmail|manager)(\/|$)/i, "admin panel"],
  [new RegExp(`${SEG}(backup|backups|dump|db|database)(/|$)|\\.(sql|bak|dump)$`, "i"), "database backup"],
  [new RegExp(`${SEG}(config\\.json|credentials|secrets?)(/|$)|\\.(pem|key|p12|pfx)$|${SEG}id_rsa`, "i"), "secrets file"],
  [new RegExp(`${SEG}(actuator|server-status|telescope|_profiler|debug)(/|$)`, "i"), "framework debug endpoint"],
];

export interface PathVerdict {
  /** Matches a real route, so something was genuinely served. */
  known: boolean;
  /** What the request was fishing for, or null if it is not a known probe. */
  probe: string | null;
}

export function classifyPath(pathname: string): PathVerdict {
  const known =
    STATIC_ROUTES.has(pathname) ||
    STATIC_ROUTES.has(pathname.replace(/\/$/, "")) ||
    ROUTE_SHAPES.some((re) => re.test(pathname));

  // A path that resolves to a real route cannot be a probe, whatever it is
  // called — the worst a careless pattern can do is miss an attack.
  if (known) return { known, probe: null };

  for (const [re, what] of PROBES) {
    if (re.test(pathname)) return { known, probe: what };
  }
  // /.well-known/ is a standard, not an intrusion: an unknown file there is an
  // ordinary 404, not an attack.
  if (pathname.startsWith("/.well-known/")) return { known, probe: null };

  // Any other dotted segment. Nothing this site serves looks like that.
  if (/(^|\/)\.[^/]/.test(pathname)) return { known, probe: "hidden dotfile" };

  return { known, probe: null };
}
