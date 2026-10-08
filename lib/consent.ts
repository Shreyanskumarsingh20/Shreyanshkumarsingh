// Cookie consent for the optional third-party analytics (Google Analytics 4
// and Microsoft Clarity). Nothing from Google or Microsoft loads until the
// visitor chooses "Accept" in components/analytics/ConsentBanner.tsx; the
// choice lives in this browser's localStorage and can be changed from the
// footer's "Cookie settings" or the privacy page.
//
// The Telegram visit log (lib/beacon) is first-party and separate — it has
// its own opt-out (?notrack=1).

export type Consent = "granted" | "denied" | "unset";

export const CONSENT_KEY = "sks_consent";
/** Fired on window when the choice changes or the banner should reopen. */
export const CONSENT_EVENT = "sks-consent";
export const CONSENT_OPEN_EVENT = "sks-consent-open";

// Public IDs (they appear in the page source anyway), so they live in code;
// a Vercel env var overrides either one, and an empty value ("") switches
// that tool off.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NQJCRJ7B2Z";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "yui86woola";
/** The banner only exists once at least one tool is configured. */
export const ANALYTICS_CONFIGURED = Boolean(GA_ID || CLARITY_ID);

export function parseConsent(raw: string | null | undefined): Consent {
  return raw === "granted" || raw === "denied" ? raw : "unset";
}

export function readConsent(): Consent {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    return "unset";
  }
}

export function writeConsent(value: Exclude<Consent, "unset">): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // blocked storage: the choice holds for this page view only
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function subscribeConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openConsentBanner(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
