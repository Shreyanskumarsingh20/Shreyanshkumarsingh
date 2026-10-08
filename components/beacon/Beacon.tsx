"use client";

/**
 * Visitor beacon (ported from Imprint). Reports visits to Telegram through
 * /api/beacon; lib/beacon/routing.ts decides which of the two bots hears what.
 *
 * A *visit* is one tab and spans page loads, so its state lives in
 * sessionStorage (cleared when the tab closes — exactly a visit's lifetime).
 *
 *   arrival  once, when the visit starts — new or returning
 *   event    a hot action as it happens: Call, WhatsApp, Email, Show number,
 *            the PDF résumé, a LinkedIn/GitHub/X profile, the contact page
 *   ended    the visit finished
 *   report   the full journey and actions for that visit
 *
 * Every listener is passive; exit uses sendBeacon, the only send that
 * survives page unload. Opt out with ?notrack=1 (see /privacy). Nothing runs
 * on localhost unless NEXT_PUBLIC_BEACON_DEBUG=1.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { OPT_OUT_KEY } from "@/lib/beacon/opt-out";

const ENDPOINT = "/api/beacon";
const ARRIVAL_DELAY_MS = 700; // let the page settle without making the alert late
const IDLE_AFTER_MS = 30_000; // no input for this long stops the "active" clock
const VISIT_GAP_MS = 30 * 60_000; // a tab resumed after this long is a new visit
const INTERNAL_NAV_MS = 2_500; // window in which an unload means "still here"
const MAX_REPORTS = 3; // a visitor who comes back can produce an updated report

const OPT_OUT_PARAM = "notrack";
const VISIT_KEY = "sks_visit"; // sessionStorage — this tab's visit
const VISITOR_KEY = "sks_visitor"; // localStorage — has this browser been here

type ActionType = "click" | "submit" | "input" | "key" | "copy" | "download" | "external" | "hot";
type Hot =
  | "call"
  | "whatsapp"
  | "email"
  | "show-number"
  | "resume-pdf"
  | "linkedin"
  | "github"
  | "x"
  | "contact-page";
const HOT_VALUES: readonly Hot[] = ["call", "whatsapp", "email", "show-number", "resume-pdf", "linkedin", "github", "x", "contact-page"];

interface Action {
  t: number;
  type: ActionType;
  label: string;
  path?: string;
}
interface PageVisit {
  path: string;
  title?: string;
  t: number;
  ms?: number;
}
interface Visit {
  sid: string;
  startedAt: number;
  lastActivity: number;
  activeMs: number;
  pages: PageVisit[];
  actions: Action[];
  scroll: { maxPx: number; maxPct: number; milestones: number[]; events: number };
  pointerMoves: number;
  clicks: number;
  keys: number;
  touches: number;
  visibilityChanges: number;
  firstActionMs: number | null;
  lastActionMs: number | null;
  arrivalSent: boolean;
  reportsSent: number;
  dirtySinceReport: boolean;
  hotSent: Hot[];
  pageLoads: number;
  returning: boolean;
  visitCount: number;
  sinceLastMs: number | null;
}

let visit: Visit | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
/** Set while a same-origin navigation is in flight, so unload is not an exit. */
let internalNavUntil = 0;

// ── Storage ─────────────────────────────────────────────────────────────────

function readJson<T>(store: Storage, key: string): T | null {
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeJson(store: Storage, key: string, value: unknown): void {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full quota; losing the record is not worth an error.
  }
}
function persist(): void {
  if (visit) writeJson(sessionStorage, VISIT_KEY, visit);
}

/** ?notrack=1 silences this browser permanently; ?notrack=0 turns it back on. */
function applyOptOutParam(): void {
  let value: string | null = null;
  try {
    value = new URLSearchParams(location.search).get(OPT_OUT_PARAM);
  } catch {
    return;
  }
  if (value === null) return;
  try {
    if (value === "0" || value === "false") localStorage.removeItem(OPT_OUT_KEY);
    else localStorage.setItem(OPT_OUT_KEY, "1");
  } catch {
    // Blocked storage: the choice cannot be remembered, which is not fatal.
  }
}

function newSid(): string {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("");
}

function visitorMemory(): { returning: boolean; visitCount: number; sinceLastMs: number | null } {
  const prior = readJson<{ visits: number; lastSeen: number }>(localStorage, VISITOR_KEY);
  const now = Date.now();
  writeJson(localStorage, VISITOR_KEY, { visits: (prior?.visits ?? 0) + 1, lastSeen: now });
  return {
    returning: Boolean(prior),
    visitCount: (prior?.visits ?? 0) + 1,
    sinceLastMs: prior?.lastSeen ? Math.max(0, now - prior.lastSeen) : null,
  };
}

function startVisit(): Visit {
  return {
    sid: newSid(),
    startedAt: Date.now(),
    lastActivity: Date.now(),
    activeMs: 0,
    pages: [],
    actions: [],
    scroll: { maxPx: 0, maxPct: 0, milestones: [], events: 0 },
    pointerMoves: 0,
    clicks: 0,
    keys: 0,
    touches: 0,
    visibilityChanges: 0,
    firstActionMs: null,
    lastActionMs: null,
    arrivalSent: false,
    reportsSent: 0,
    dirtySinceReport: true,
    hotSent: [],
    pageLoads: 0,
    ...visitorMemory(),
  };
}

function loadVisit(): Visit {
  const saved = readJson<Visit>(sessionStorage, VISIT_KEY);
  // A tab left open overnight is not one very long visit.
  if (saved?.sid && typeof saved.startedAt === "number" && Date.now() - saved.lastActivity < VISIT_GAP_MS) {
    saved.hotSent = Array.isArray(saved.hotSent) ? saved.hotSent : [];
    saved.pages = Array.isArray(saved.pages) ? saved.pages : [];
    saved.actions = Array.isArray(saved.actions) ? saved.actions : [];
    return saved;
  }
  return startVisit();
}

// ── Measurement ─────────────────────────────────────────────────────────────

function since(): number {
  return visit ? Date.now() - visit.startedAt : 0;
}
function markActivity() {
  if (!visit) return;
  visit.lastActivity = Date.now();
  visit.dirtySinceReport = true;
}

/** Long digit runs are stripped from labels: clicking the revealed phone
 *  number must never put the number itself into an alert. */
function scrub(label: string): string {
  return label.replace(/\+?\d[\d\s-]{6,}\d/g, "[number]").slice(0, 120);
}

function recordAction(type: ActionType, label: string) {
  if (!visit) return;
  const t = since();
  if (visit.firstActionMs === null) visit.firstActionMs = t;
  visit.lastActionMs = t;
  if (visit.actions.length < 30) visit.actions.push({ type, label: scrub(label), t, path: location.pathname });
  markActivity();
}

/** A human-readable name for whatever was clicked. */
function labelFor(el: Element): string {
  const node = el.closest("a, button, [role='button'], input[type='submit'], input[type='button'], summary, label") ?? el;
  const aria = node.getAttribute?.("aria-label");
  if (aria) return aria.trim();
  const text = (node as HTMLElement).innerText?.trim();
  if (text) return text.replace(/\s+/g, " ").slice(0, 120);
  const title = node.getAttribute?.("title");
  if (title) return title.trim();
  if (node instanceof HTMLAnchorElement && node.href) return node.href;
  return node.tagName.toLowerCase();
}

/** Is this click one of the actions worth an immediate alert? */
function hotFor(el: Element): Hot | null {
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

function currentScrollPct(): number {
  const doc = document.documentElement;
  const height = Math.max(doc.scrollHeight, document.body.scrollHeight);
  const seen = window.scrollY + window.innerHeight;
  if (height <= window.innerHeight) return 100;
  return Math.max(0, Math.min(100, Math.round((seen / height) * 100)));
}

// ── Sending ─────────────────────────────────────────────────────────────────

type Kind = "arrival" | "ended" | "report" | "event";

function build(kind: Kind, hot?: Hot, hotLabel?: string) {
  if (!visit) return null;
  const pages = visit.pages.map((p) => ({ ...p }));
  const last = pages[pages.length - 1];
  if (last && last.ms === undefined) last.ms = Math.max(0, since() - last.t);

  return {
    v: 1 as const,
    sid: visit.sid,
    kind,
    ...(hot ? { hot, hotLabel: hotLabel ? scrub(hotLabel) : undefined } : {}),
    visitor: {
      returning: visit.returning,
      visitCount: visit.visitCount,
      sinceLastMs: visit.sinceLastMs,
      pageLoads: Math.max(1, visit.pageLoads),
    },
    path: (location.pathname + location.search).slice(0, 300),
    title: document.title?.slice(0, 160),
    referrer: document.referrer ? document.referrer.slice(0, 400) : undefined,
    sessionMs: since(),
    activeMs: Math.round(visit.activeMs),
    pages,
    actions: visit.actions,
    scroll: visit.scroll,
    signals: {
      pointerMoves: visit.pointerMoves,
      clicks: visit.clicks,
      keys: visit.keys,
      touches: visit.touches,
      visibilityChanges: visit.visibilityChanges,
      firstActionMs: visit.firstActionMs,
      lastActionMs: visit.lastActionMs,
      webdriver: Boolean(navigator.webdriver),
      touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === "1",
      languages: navigator.languages?.length ?? 0,
      plugins: navigator.plugins?.length ?? 0,
      hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    },
    device: {
      screenW: screen.width,
      screenH: screen.height,
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    },
  };
}

function send(kind: Kind, viaBeacon: boolean, hot?: Hot, hotLabel?: string) {
  const body = build(kind, hot, hotLabel);
  if (!body) return;
  const json = JSON.stringify(body);
  if (viaBeacon && typeof navigator.sendBeacon === "function") {
    try {
      if (navigator.sendBeacon(ENDPOINT, new Blob([json], { type: "application/json" }))) return;
    } catch {
      // fall through to fetch
    }
  }
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: json, keepalive: true }).catch(() => {
    // A dropped beacon is not worth surfacing to the visitor.
  });
}

/** A hot action, reported once per kind per visit. */
function sendHot(hot: Hot, label: string) {
  if (!visit || visit.hotSent.includes(hot)) return;
  visit.hotSent.push(hot);
  visit.dirtySinceReport = true;
  persist();
  // sendBeacon: Call, WhatsApp and the PDF can navigate away immediately
  send("event", true, hot, label);
}

function endVisit() {
  if (!visit) return;
  if (visit.reportsSent >= MAX_REPORTS) return;
  if (visit.reportsSent > 0 && !visit.dirtySinceReport) return;
  visit.reportsSent += 1;
  visit.dirtySinceReport = false;
  persist();
  send("ended", true);
  send("report", true);
}

function shouldRun(): boolean {
  if (typeof window === "undefined") return false;
  // Do Not Track is reported in the alert but not treated as the opt-out: it
  // is often switched on by extensions without the person knowing. The
  // opt-out is ?notrack=1 or the switch on /privacy.
  applyOptOutParam();
  try {
    if (localStorage.getItem(OPT_OUT_KEY) === "1") return false;
  } catch {
    // Blocked storage is not a reason to skip.
  }
  if (process.env.NEXT_PUBLIC_BEACON_DEBUG === "1") return true;
  if (process.env.NODE_ENV !== "production") return false;
  return !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
}

export default function Beacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldRun()) return;

    if (!visit) {
      visit = loadVisit();
      visit.pageLoads += 1;
      visit.pages.push({ path: location.pathname + location.search, title: document.title, t: since() });
      visit.scroll.maxPct = Math.max(visit.scroll.maxPct, currentScrollPct());
      persist();
    }

    const v = visit;
    const passive = { passive: true } as const;

    const onPointerMove = () => {
      v.pointerMoves += 1;
      markActivity();
    };
    const onScroll = () => {
      v.scroll.events += 1;
      v.scroll.maxPx = Math.max(v.scroll.maxPx, Math.round(window.scrollY));
      const pct = currentScrollPct();
      if (pct > v.scroll.maxPct) v.scroll.maxPct = pct;
      for (const m of [25, 50, 75, 100]) {
        if (v.scroll.maxPct >= m && !v.scroll.milestones.includes(m)) v.scroll.milestones.push(m);
      }
      markActivity();
    };
    const onClick = (e: MouseEvent) => {
      v.clicks += 1;
      const el = e.target as Element | null;
      if (!el?.closest) {
        markActivity();
        return;
      }
      const anchor = el.closest("a") as HTMLAnchorElement | null;
      // A same-origin link means the tab is navigating, not leaving.
      if (anchor?.href && anchor.origin === location.origin && !anchor.target) {
        internalNavUntil = Date.now() + INTERNAL_NAV_MS;
      }
      const label = labelFor(el);
      const hot = hotFor(el);
      let type: ActionType = "click";
      if (hot) type = "hot";
      else if (anchor?.hasAttribute("download")) type = "download";
      else if (anchor?.href && anchor.origin !== location.origin) type = "external";
      recordAction(type, label);
      if (hot) sendHot(hot, label);
      persist();
    };
    const onKey = () => {
      v.keys += 1;
      markActivity();
    };
    const onTouch = () => {
      v.touches += 1;
      markActivity();
    };
    const onCopy = () => recordAction("copy", "copied text");
    const onVisibility = () => {
      v.visibilityChanges += 1;
      if (document.visibilityState === "hidden") persist();
      else markActivity();
    };
    const onPageHide = () => {
      persist();
      if (Date.now() < internalNavUntil) return; // the next document resumes this visit
      endVisit();
    };

    window.addEventListener("pointermove", onPointerMove, passive);
    window.addEventListener("scroll", onScroll, passive);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, passive);
    window.addEventListener("touchstart", onTouch, passive);
    document.addEventListener("copy", onCopy, passive);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    if (!timer) {
      timer = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        if (Date.now() - v.lastActivity > IDLE_AFTER_MS) return;
        v.activeMs += 1000;
        if (v.activeMs % 5000 === 0) persist();
      }, 1000);
    }

    // Announced once per visit, not once per page load.
    const arrival = v.arrivalSent
      ? null
      : setTimeout(() => {
          if (!v.arrivalSent) {
            v.arrivalSent = true;
            persist();
            send("arrival", false);
          }
        }, ARRIVAL_DELAY_MS);

    return () => {
      if (arrival) clearTimeout(arrival);
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouch);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  // ── Client-side route changes ─────────────────────────────────────────────
  useEffect(() => {
    const v = visit;
    if (!v) return;
    const path = location.pathname + location.search;
    const last = v.pages[v.pages.length - 1];
    if (last?.path === path) return; // initial render; already recorded
    if (last && last.ms === undefined) last.ms = Math.max(0, since() - last.t);
    if (v.pages.length < 40) v.pages.push({ path, title: document.title, t: since() });
    v.dirtySinceReport = true;
    markActivity();
    persist();
  }, [pathname]);

  return null;
}
