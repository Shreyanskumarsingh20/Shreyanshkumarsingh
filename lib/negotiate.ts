// Content negotiation for proxy.ts: does this Accept header want the
// markdown view, the HTML page, or neither (406)? RFC 9110 q-values and
// specificity (exact > type/* > */*) are honoured. Pure, so the unit tests
// (tests/negotiate.test.ts) can load it directly.

type Pref = { type: string; q: number };

export function parseAccept(header: string | null): Pref[] {
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
export function qFor(prefs: Pref[], type: string): number {
  const [major] = type.split("/");
  const exact = prefs.find((p) => p.type === type);
  if (exact) return exact.q;
  const group = prefs.find((p) => p.type === `${major}/*`);
  if (group) return group.q;
  const any = prefs.find((p) => p.type === "*/*");
  return any ? any.q : 0;
}

/** "markdown" only when it is strictly preferred over HTML; a missing Accept
 *  header means HTML. A client that takes plain text but not HTML (some AI
 *  fetchers send `Accept: text/plain`) gets the markdown — it is plain text —
 *  rather than a 406; 406 is kept for clients that accept no text at all. */
export function negotiate(accept: string | null): "markdown" | "html" | "none" {
  const prefs = parseAccept(accept);
  if (!prefs.length) return "html";
  const md = qFor(prefs, "text/markdown");
  const html = Math.max(qFor(prefs, "text/html"), qFor(prefs, "application/xhtml+xml"));
  const plain = qFor(prefs, "text/plain");
  if (md > 0 && md > html) return "markdown";
  if (html <= 0 && plain > 0) return "markdown";
  if (md <= 0 && html <= 0) return "none";
  return "html";
}
