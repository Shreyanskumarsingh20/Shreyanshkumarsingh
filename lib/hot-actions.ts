// "Hot actions" — the clicks that mean someone wants to reach or hire
// Shreyansh: Call, WhatsApp, Email, Show number, the PDF résumé, his
// profiles, the contact page. Shared by the Telegram beacon
// (components/beacon/Beacon.tsx) and Google Analytics key events
// (components/analytics/Analytics.tsx) so both count the same things.

export type Hot =
  | "call"
  | "whatsapp"
  | "email"
  | "show-number"
  | "resume-pdf"
  | "linkedin"
  | "github"
  | "x"
  | "contact-page";

export const HOT_VALUES: readonly Hot[] = ["call", "whatsapp", "email", "show-number", "resume-pdf", "linkedin", "github", "x", "contact-page"];

/** The hot action a click on `el` represents, or null. Explicit `data-hot`
 *  attributes win (ContactLinks, the PDF button); otherwise the link target
 *  decides. */
export function hotFor(el: Element): Hot | null {
  const tagged = el.closest("[data-hot]")?.getAttribute("data-hot") as Hot | null | undefined;
  if (tagged && HOT_VALUES.includes(tagged)) return tagged;
  const a = el.closest("a") as HTMLAnchorElement | null;
  if (!a?.href) return null;
  const href = a.href;
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "call";
  if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp";
  if (/\.pdf($|\?)/i.test(href)) return "resume-pdf";
  if (/linkedin\.com\/in\//i.test(href)) return "linkedin";
  if (/github\.com\//i.test(href)) return "github";
  if (/(^|\/\/)(www\.)?(x|twitter)\.com\//i.test(href)) return "x";
  if (a.origin === location.origin && a.pathname === "/contact" && location.pathname !== "/contact") return "contact-page";
  return null;
}
