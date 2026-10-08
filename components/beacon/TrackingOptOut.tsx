"use client";

/**
 * The visitor-facing switch for the visit logging described on /privacy
 * (ported from Imprint). Reads and writes the same localStorage key the
 * beacon checks, so what it shows is the real state for this browser.
 */

import { useSyncExternalStore } from "react";
import { OPT_OUT_KEY } from "@/lib/beacon/opt-out";

type State = "loading" | "on" | "off" | "unavailable";

// localStorage is an external store, so read it with useSyncExternalStore:
// "loading" on the server, the real value after hydration.
const CHANGE = "sks-beacon-optout";
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}
function snapshot(): State {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "1" ? "off" : "on";
  } catch {
    return "unavailable";
  }
}

export default function TrackingOptOut() {
  const state = useSyncExternalStore(subscribe, snapshot, (): State => "loading");

  const set = (optOut: boolean) => {
    try {
      if (optOut) localStorage.setItem(OPT_OUT_KEY, "1");
      else localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      // blocked storage — the snapshot reports "unavailable"
    }
    window.dispatchEvent(new Event(CHANGE));
  };

  return (
    <div className="optout">
      <p className="optout-k mono">This browser</p>
      <p className="optout-state">
        {state === "loading" && "Checking…"}
        {state === "on" && "Visits from this browser are logged, as described above."}
        {state === "off" && "Visits from this browser are not logged. Nothing is collected and nothing is sent."}
        {state === "unavailable" &&
          "This browser is blocking local storage, so the choice cannot be saved here. Use the link below, or email to ask."}
      </p>
      {(state === "on" || state === "off") && (
        <button type="button" className={state === "off" ? "btn btn-ghost" : "btn btn-gold cut-sm"} onClick={() => set(state === "on")}>
          {state === "off" ? "Turn logging back on" : <span>Don&apos;t log my visits</span>}
        </button>
      )}
      <p className="optout-note">
        {/* plain <a>, not <Link>: the beacon reads ?notrack on a full page load */}
        The same thing as a link you can bookmark:{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/?notrack=1">/?notrack=1</a> (undo with{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/?notrack=0">/?notrack=0</a>). The choice is stored in this browser only, so it needs repeating on each
        browser and device.
      </p>
    </div>
  );
}
