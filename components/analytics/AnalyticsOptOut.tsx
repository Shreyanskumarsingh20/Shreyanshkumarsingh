"use client";

/**
 * The opt-out switch for Google Analytics + Microsoft Clarity, on /privacy.
 * Reads and writes the same localStorage key the GA bootstrap and
 * Analytics.tsx check, so what it shows is the real state for this browser.
 */

import { useSyncExternalStore } from "react";
import { gpcActive, readChoice, setOptOut, subscribeChoice, type AnalyticsChoice } from "@/lib/consent";

export default function AnalyticsOptOut() {
  const choice = useSyncExternalStore<AnalyticsChoice | "loading">(subscribeChoice, readChoice, () => "loading");
  const gpc = choice !== "loading" && gpcActive();

  return (
    <div className="optout">
      <p className="optout-k mono">Analytics in this browser</p>
      <p className="optout-state">
        {choice === "loading" && "Checking…"}
        {choice === "on" && "Google Analytics and Microsoft Clarity are on for this browser."}
        {choice === "off" &&
          (gpc
            ? "Off — your browser sends Global Privacy Control, so neither tool runs here."
            : "Off — Google Analytics and Microsoft Clarity don't run in this browser.")}
      </p>
      {choice !== "loading" && !gpc && (
        <button
          type="button"
          className={choice === "off" ? "btn btn-ghost" : "btn btn-gold cut-sm"}
          onClick={() => setOptOut(choice === "on")}
        >
          {choice === "off" ? "Turn analytics back on" : <span>Turn off analytics</span>}
        </button>
      )}
      <p className="optout-note">
        The choice is stored in this browser only, so it needs repeating on each browser and device. Turning it off
        also deletes the analytics cookies this site set.
      </p>
    </div>
  );
}
