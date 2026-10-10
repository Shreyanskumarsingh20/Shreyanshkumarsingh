"use client";

/**
 * Microsoft Clarity loader + Google Analytics key events, on by default
 * (disclosed on /privacy). Google Analytics itself is bootstrapped by a
 * plain <script> in app/layout.tsx's <head>, so Google's "Test
 * installation" checker can see the tag in the HTML.
 *
 * - Visitors who opt out on /privacy, or whose browser sends Global Privacy
 *   Control, get neither tool: GA's bootstrap never sends `config`, Clarity
 *   never loads. Opting out later sends consent "denied" to both and deletes
 *   their cookies.
 * - Off in development and on localhost (NEXT_PUBLIC_ANALYTICS_DEBUG=1 to
 *   test locally).
 * - Hot actions (lib/hot-actions.ts) → GA events, to mark as key events:
 *   `generate_lead` (contact actions), `resume_download`, `profile_click`.
 * - The CSP in next.config.ts allows exactly the GA and Clarity hosts.
 */

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { CLARITY_ID, GA_ID, readChoice, subscribeChoice, type AnalyticsChoice } from "@/lib/consent";
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
  // server snapshot "off" → nothing renders until the browser has decided
  const choice = useSyncExternalStore<AnalyticsChoice>(subscribeChoice, readChoice, () => "off");
  const on = choice === "on" && typeof window !== "undefined" && enabledHere();

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

  // opted out (now or earlier): tell both tools, and remove their cookies
  useEffect(() => {
    if (choice !== "off") return;
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
  }, [choice]);

  // opted back in on this page: GA's bootstrap skipped `config`, so send it now
  useEffect(() => {
    if (!on || !GA_ID) return;
    const w = window as Window & { gtag?: Gtag; __sksAnalyticsOff?: boolean };
    if (w.__sksAnalyticsOff && w.gtag) {
      w.__sksAnalyticsOff = false;
      w.gtag("consent", "update", { analytics_storage: "granted" });
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
    }
  }, [on]);

  if (!on || !CLARITY_ID) return null;

  return (
    <Script id="clarity-init" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});
window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"granted"});`}
    </Script>
  );
}
