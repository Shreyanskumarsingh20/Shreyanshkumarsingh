// Analytics opt-out for Google Analytics 4 and Microsoft Clarity.
//
// Both run by default for every visitor (disclosed on /privacy). A visitor
// can switch them off for their browser on /privacy (components/analytics/
// AnalyticsOptOut.tsx), and a browser sending Global Privacy Control
// (navigator.globalPrivacyControl) is treated as opted out automatically.
// The choice lives in localStorage; the GA bootstrap in app/layout.tsx reads
// it before sending anything.
//
// The Telegram visit log (lib/beacon) is first-party and separate — it has
// its own opt-out (?notrack=1).

export type AnalyticsChoice = "on" | "off";

/** localStorage key; "denied" = opted out (value kept from the old banner
 *  so earlier "Decline" choices still hold). */
export const OPT_OUT_STORAGE_KEY = "sks_consent";
export const OPT_OUT_VALUE = "denied";
/** Fired on window when the choice changes. */
export const ANALYTICS_EVENT = "sks-analytics";

// Public IDs (they appear in the page source anyway), so they live in code;
// a Vercel env var overrides either one, and an empty value ("") switches
// that tool off.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NQJCRJ7B2Z";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "yui86woola";
export const ANALYTICS_CONFIGURED = Boolean(GA_ID || CLARITY_ID);

/** Pure: the stored value + the browser's GPC flag → on/off. */
export function choiceFrom(stored: string | null | undefined, gpc: boolean | undefined): AnalyticsChoice {
  return stored === OPT_OUT_VALUE || gpc === true ? "off" : "on";
}

function gpc(): boolean {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function readChoice(): AnalyticsChoice {
  try {
    return choiceFrom(localStorage.getItem(OPT_OUT_STORAGE_KEY), gpc());
  } catch {
    return choiceFrom(null, gpc());
  }
}

/** True when the browser's GPC signal (not a stored choice) is what turns it off. */
export function gpcActive(): boolean {
  return gpc();
}

export function setOptOut(optOut: boolean): void {
  try {
    if (optOut) localStorage.setItem(OPT_OUT_STORAGE_KEY, OPT_OUT_VALUE);
    else localStorage.removeItem(OPT_OUT_STORAGE_KEY);
  } catch {
    // blocked storage: the choice holds for this page view only
  }
  window.dispatchEvent(new Event(ANALYTICS_EVENT));
}

export function subscribeChoice(onChange: () => void): () => void {
  window.addEventListener(ANALYTICS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ANALYTICS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The inline bootstrap for <head>: defines gtag, and sends the GA config
 *  (page view) only when the visitor hasn't opted out. Runs before
 *  hydration, so an opted-out visitor never sends a hit. */
export function gaBootstrap(id: string, allowLocal = false): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
(function(){var off=false;try{off=localStorage.getItem(${JSON.stringify(OPT_OUT_STORAGE_KEY)})===${JSON.stringify(OPT_OUT_VALUE)};}catch(e){}
if(navigator.globalPrivacyControl===true)off=true;
if(${allowLocal ? "false" : "true"}&&/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname))off=true;
window.__sksAnalyticsOff=off;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:off?'denied':'granted'});
if(off)return;gtag('js',new Date());gtag('config',${JSON.stringify(id)});})();`;
}
