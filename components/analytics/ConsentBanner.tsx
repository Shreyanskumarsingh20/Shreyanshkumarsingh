"use client";

/**
 * The cookie banner for Google Analytics + Microsoft Clarity. Shown until the
 * visitor chooses; Accept and Decline carry equal weight (no pre-ticked
 * boxes, no dark patterns). Reopened by "Cookie settings" in the footer and
 * on /privacy. Renders nothing until an analytics ID is configured.
 */

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ANALYTICS_CONFIGURED,
  CONSENT_OPEN_EVENT,
  openConsentBanner,
  readConsent,
  subscribeConsent,
  writeConsent,
  type Consent,
} from "@/lib/consent";

export default function ConsentBanner() {
  const consent = useSyncExternalStore<Consent>(subscribeConsent, readConsent, () => "granted");
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  if (!ANALYTICS_CONFIGURED) return null;
  if (consent !== "unset" && !reopened) return null;

  const choose = (value: "granted" | "denied") => {
    writeConsent(value);
    setReopened(false);
  };

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <p className="consent-text">
        <b>Cookies for analytics?</b> With your OK, this site uses Google Analytics and Microsoft Clarity to see how
        visitors use it (pages, clicks, scrolling). No ads, nothing sold. Decline and neither loads.{" "}
        <Link href="/privacy#cookies">Privacy policy</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn btn-ghost" onClick={() => choose("denied")}>
          Decline
        </button>
        <button type="button" className="btn btn-gold cut-sm" onClick={() => choose("granted")}>
          <span>Accept</span>
        </button>
      </div>
    </div>
  );
}

/** "Cookie settings" — a footer/privacy-page link that reopens the banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!ANALYTICS_CONFIGURED) return null;
  return (
    <button
      type="button"
      className={className ?? "consent-link"}
      onClick={openConsentBanner}
    >
      Cookie settings
    </button>
  );
}
