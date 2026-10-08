"use client";

/**
 * Google Analytics 4 + Microsoft Clarity, loaded only after the visitor
 * accepts cookies (lib/consent.ts, ConsentBanner.tsx) — "basic" consent
 * mode: before that, not a single request goes to Google or Microsoft.
 *
 * - Off unless NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_CLARITY_ID are set at build
 *   time (Vercel env vars → redeploy), off in development and on localhost.
 * - Scripts load `afterInteractive` (GA) / on idle (Clarity) so they never
 *   compete with the first paint.
 * - Page views on client-side navigation come from GA4's enhanced
 *   measurement ("page changes based on browser history"), on by default.
 * - Hot actions (lib/hot-actions.ts — Call, WhatsApp, Email, Show number,
 *   résumé PDF, profiles, contact page) are sent as GA events so they can
 *   be marked as key events: `generate_lead` (contact actions),
 *   `resume_download`, `profile_click`.
 * - The CSP in next.config.ts allows exactly these hosts.
 */

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { CLARITY_ID, GA_ID, readConsent, subscribeConsent, type Consent } from "@/lib/consent";
import { hotFor, type Hot } from "@/lib/hot-actions";

type Gtag = (...args: unknown[]) => void;

function enabledHere(): boolean {
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1") return true;
  if (process.env.NODE_ENV !== "production") return false;
  return !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
}

const EVENT_FOR: Record<Hot, [string, Record<string, string>]> = {
  call: ["generate_lead", { method: "call" }],
  whatsapp: ["generate_lead", { method: "whatsapp" }],
  email: ["generate_lead", { method: "email" }],
  "show-number": ["generate_lead", { method: "show_number" }],
  "contact-page": ["generate_lead", { method: "contact_page" }],
  "resume-pdf": ["resume_download", { file_name: "Shreyansh_Kumar_Singh_Resume.pdf" }],
  linkedin: ["profile_click", { profile: "linkedin" }],
  github: ["profile_click", { profile: "github" }],
  x: ["profile_click", { profile: "x" }],
};

export default function Analytics() {
  const consent = useSyncExternalStore<Consent>(subscribeConsent, readConsent, () => "unset");
  const on = consent === "granted" && typeof window !== "undefined" && enabledHere();

  // hot actions → GA events
  useEffect(() => {
    if (!on || !GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest) return;
      const hot = hotFor(el);
      if (!hot) return;
      const gtag = (window as Window & { gtag?: Gtag }).gtag;
      const [name, params] = EVENT_FOR[hot];
      gtag?.("event", name, { ...params, page_path: location.pathname, transport_type: "beacon" });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [on]);

  // withdrawn after accepting: tell both tools, and remove their cookies
  useEffect(() => {
    if (consent !== "denied") return;
    const w = window as Window & { gtag?: Gtag; clarity?: (...a: unknown[]) => void };
    w.gtag?.("consent", "update", { analytics_storage: "denied" });
    w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    const host = location.hostname.replace(/^www\./, "");
    for (const c of document.cookie.split(";")) {
      const name = c.split("=")[0].trim();
      if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID|ANONCHK|SM)/.test(name)) continue;
      for (const domain of ["", `; domain=.${host}`, `; domain=${location.hostname}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    }
  }, [consent]);

  if (!on) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config',${JSON.stringify(GA_ID)});`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});
window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"granted"});`}
        </Script>
      )}
    </>
  );
}
