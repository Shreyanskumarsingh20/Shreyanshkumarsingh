/**
 * Formats visits into Telegram messages and sends them (ported from Imprint;
 * Imprint's signed-in identity blocks are gone — this site has no accounts).
 *
 * Two bots, both optional (see lib/beacon/routing.ts for who hears what):
 *
 *   TELEGRAM_BOT_TOKEN        + TELEGRAM_CHAT_ID        — bot 1, every alert
 *   TELEGRAM_HUMAN_BOT_TOKEN  + TELEGRAM_HUMAN_CHAT_ID  — bot 2, real people
 *                                                         and hot actions only
 *
 * With a pair missing, that channel degrades to a no-op rather than throwing,
 * so a misconfigured deploy never breaks a page load.
 */
import type { BeaconPayload } from "./schema";
import { describeClient, type Verdict } from "./bot";
import { describePlace, mapLink, type Geo } from "./geo";
import type { Channel } from "./routing";

const API = "https://api.telegram.org";
const SITE = "shreyanshkumarsingh.com";

// Measured at 5.6s round-trip on a cold connection from India (1.3s connect,
// 1.9s TLS) in Imprint. A 4s budget dropped alerts silently.
const SEND_TIMEOUT_MS = 8_000;

function credentials(channel: Channel): { token: string; chatId: string } | null {
  const token = channel === "human" ? process.env.TELEGRAM_HUMAN_BOT_TOKEN : process.env.TELEGRAM_BOT_TOKEN;
  const chatId = channel === "human" ? process.env.TELEGRAM_HUMAN_CHAT_ID : process.env.TELEGRAM_CHAT_ID;
  return token && chatId ? { token, chatId } : null;
}

export function telegramConfigured(channel?: Channel): boolean {
  if (channel) return credentials(channel) !== null;
  return credentials("all") !== null || credentials("human") !== null;
}

/** Telegram's HTML mode only needs these three escaped. */
export function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function clip(text: string, max: number): string {
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function duration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return s % 60 ? `${m}m ${s % 60}s` : `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return h % 24 ? `${d}d ${h % 24}h` : `${d}d`;
  const mo = Math.floor(d / 30);
  return d % 30 ? `${mo}mo ${d % 30}d` : `${mo}mo`;
}

function verdictIcon(v: Verdict): string {
  return v.score >= 80 ? "🧑" : v.score >= 62 ? "🙂" : v.score >= 40 ? "❔" : v.score >= 20 ? "🤖" : "⛔️";
}

/** The visitor's own wall-clock time — more useful than the server's UTC. */
function localTime(tz: string | undefined): string {
  const now = new Date();
  const utc = now.toUTCString().replace("GMT", "UTC");
  if (!tz) return utc;
  try {
    const local = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz, day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(now);
    return `${local} local (${tz})`;
  } catch {
    return utc;
  }
}

/** Location, stated only as precisely as it was actually resolved. */
function locationBlock(geo: Geo): string[] {
  const lines: string[] = [];
  const link = mapLink(geo);

  if (geo.precision === "city" || geo.precision === "region") {
    lines.push(`📍 <b>${esc(describePlace(geo))}</b>${geo.flag ? ` ${geo.flag}` : ""}`);
    const coords =
      geo.latitude && geo.longitude
        ? `${Number(geo.latitude).toFixed(3)}, ${Number(geo.longitude).toFixed(3)}`
        : null;
    const bits = [geo.postal ? `postal ${esc(geo.postal)}` : null, coords, geo.timezone ? esc(geo.timezone) : null].filter(Boolean);
    if (bits.length) lines.push(`   ${bits.join(" · ")}`);
  } else if (geo.precision === "country") {
    lines.push(`📍 <b>${esc(describePlace(geo))}</b>${geo.flag ? ` ${geo.flag}` : ""} — <i>country only</i>`);
    lines.push("   ⚠️ no city resolved for this address; no map pin shown");
  } else {
    lines.push("📍 <b>Location unavailable</b>");
    lines.push("   private or unroutable address (local request)");
  }

  const net = [geo.isp ? esc(clip(geo.isp, 42)) : null, geo.asn ? esc(geo.asn) : null].filter(Boolean).join(" · ");
  lines.push(`🛰 <code>${esc(geo.ip)}</code>${net ? ` · ${net}` : ""}`);

  if (geo.mobile) lines.push("   📶 mobile network — city may be the carrier gateway, not the visitor");
  if (geo.datacenter) lines.push("   ⚠️ datacenter / hosting network");
  if (geo.disagreement) lines.push(`   ℹ️ sources differ: ${esc(geo.disagreement)}`);
  if (link) lines.push(`   <a href="${link}">open in maps</a>`);
  return lines;
}

/** Not honoured as an opt-out (see Beacon.tsx), but worth knowing it was asked for. */
function dntLine(payload: BeaconPayload): string[] {
  return payload.signals.doNotTrack ? ["🔕 <i>This visitor's browser sends Do Not Track</i>"] : [];
}

function verdictLine(verdict: Verdict, provisional: boolean): string {
  return (
    `${verdictIcon(verdict)} <b>${verdict.label}</b> ${verdict.score}/100${provisional ? " <i>(provisional)</i>" : ""}` +
    (verdict.reasons.length ? ` — ${esc(verdict.reasons.join(", "))}` : "")
  );
}

export function formatArrival(payload: BeaconPayload, geo: Geo, verdict: Verdict, ua: string): string {
  const lines: string[] = [];
  const vis = payload.visitor;
  lines.push(
    (vis.returning
      ? `🔁 <b>Returning visit</b> — visit #${vis.visitCount}` +
        (vis.sinceLastMs !== null ? ` · last seen ${duration(vis.sinceLastMs)} ago` : "")
      : "🟢 <b>New visit</b> — first time here") + ` · ${SITE}`,
  );
  lines.push("");
  lines.push(...locationBlock(geo));
  lines.push("");
  lines.push(`📄 <b>${esc(clip(payload.path, 90))}</b>`);
  if (payload.title) lines.push(`   ${esc(clip(payload.title, 70))}`);
  lines.push(`↩️ ${payload.referrer ? esc(clip(payload.referrer, 80)) : "direct / no referrer"}`);
  lines.push("");
  lines.push(
    `💻 ${esc(describeClient(ua))} · ${payload.device.viewportW}×${payload.device.viewportH}` +
      `${payload.signals.language ? ` · ${esc(payload.signals.language)}` : ""}`,
  );
  lines.push(verdictLine(verdict, true));
  lines.push(...dntLine(payload));
  lines.push("");
  lines.push(`🕒 ${localTime(payload.signals.timezone)}`);
  return lines.join("\n");
}

const HOT_TITLES: Record<string, string> = {
  call: "📞 <b>Tapped Call</b>",
  whatsapp: "💬 <b>Opened WhatsApp</b>",
  email: "✉️ <b>Clicked Email</b>",
  "show-number": "🔢 <b>Revealed the phone number</b>",
  "resume-pdf": "📄 <b>Downloaded the PDF résumé</b>",
  linkedin: "🔗 <b>Opened LinkedIn</b>",
  github: "🐙 <b>Opened GitHub</b>",
  x: "𝕏 <b>Opened X</b>",
  "contact-page": "🔥 <b>Went to the contact page</b>",
};

export function formatEvent(payload: BeaconPayload, geo: Geo, verdict: Verdict, ua: string): string {
  const title = HOT_TITLES[payload.hot ?? ""] ?? "🔥 <b>Hot action</b>";
  const lines: string[] = [`${title} — ${SITE}`, ""];
  if (payload.hotLabel) lines.push(`🖱 “${esc(clip(payload.hotLabel, 80))}”`);
  lines.push(`📄 on <b>${esc(clip(payload.path, 90))}</b>`);
  if (payload.pages.length > 1) {
    lines.push(`🧭 ${esc(clip(payload.pages.map((p) => p.path).join(" → "), 300))}`);
  }
  lines.push(`⏱ ${duration(payload.sessionMs)} into the visit`);
  lines.push("");
  lines.push(...locationBlock(geo));
  lines.push("");
  lines.push(`💻 ${esc(describeClient(ua))}`);
  lines.push(verdictLine(verdict, false));
  lines.push(...dntLine(payload));
  lines.push(`🕒 ${localTime(payload.signals.timezone)}`);
  return lines.join("\n");
}

/** Short: the visit is over. The detail follows in the report. */
export function formatEnded(payload: BeaconPayload, geo: Geo): string {
  const lines: string[] = [];
  const vis = payload.visitor;
  lines.push(`⚪️ <b>Visit ended</b> — ${SITE}`);
  lines.push("");
  lines.push(`⏱ <b>${duration(payload.sessionMs)}</b> on site · <b>${duration(payload.activeMs)}</b> active`);
  lines.push(
    `🧭 ${payload.pages.length} page${payload.pages.length === 1 ? "" : "s"}` +
      ` · ${payload.actions.length} action${payload.actions.length === 1 ? "" : "s"}` +
      ` · left from <b>${esc(clip(payload.path, 60))}</b>`,
  );
  if (vis.returning) lines.push(`🔁 visit #${vis.visitCount} from this browser`);
  lines.push("");
  lines.push(...locationBlock(geo));
  lines.push(...dntLine(payload));
  lines.push("");
  lines.push("<i>Full report follows.</i>");
  return lines.join("\n");
}

export function formatSummary(payload: BeaconPayload, geo: Geo, verdict: Verdict, ua: string): string {
  const lines: string[] = [];
  const s = payload.signals;

  lines.push(`📋 <b>Visit report</b> — ${SITE}`);
  lines.push("");
  lines.push(`⏱ <b>${duration(payload.sessionMs)}</b> on site · <b>${duration(payload.activeMs)}</b> active`);
  lines.push(
    `🚪 entered on <b>${esc(clip(payload.pages[0]?.path ?? payload.path, 50))}</b>` +
      ` · ${payload.visitor.pageLoads} page load${payload.visitor.pageLoads === 1 ? "" : "s"}`,
  );
  lines.push(`↩️ ${payload.referrer ? esc(clip(payload.referrer, 80)) : "direct / no referrer"}`);

  if (payload.pages.length) {
    const journey = payload.pages
      .map((p) => `${esc(clip(p.path, 34))}${p.ms ? ` (${duration(p.ms)})` : ""}`)
      .join("  →  ");
    lines.push(`🧭 <b>${payload.pages.length} page${payload.pages.length === 1 ? "" : "s"}</b>`);
    lines.push(`   ${clip(journey, 380)}`);
  }

  const sc = payload.scroll;
  lines.push(
    `📜 scroll <b>${sc.maxPct}%</b>${sc.maxPx ? ` (${sc.maxPx}px)` : ""}` +
      `${sc.milestones.length ? ` · hit ${sc.milestones.join("/")}` : ""} · ${sc.events} events`,
  );

  if (payload.actions.length) {
    lines.push(`🖱 <b>${payload.actions.length} action${payload.actions.length === 1 ? "" : "s"}</b>`);
    for (const a of payload.actions.slice(0, 12)) {
      lines.push(`   ${duration(a.t).padStart(5)} · ${a.type === "hot" ? "🔥" : a.type} · ${esc(clip(a.label, 52))}`);
    }
    if (payload.actions.length > 12) lines.push(`   …and ${payload.actions.length - 12} more`);
  } else {
    lines.push("🖱 no actions taken");
  }

  const timing = [
    s.firstActionMs !== null ? `first ${duration(s.firstActionMs)}` : null,
    s.lastActionMs !== null ? `last ${duration(s.lastActionMs)}` : null,
  ].filter(Boolean);
  if (timing.length) lines.push(`⌛ ${timing.join(" · ")}`);

  lines.push(`🎛 ${s.pointerMoves} moves · ${s.clicks} clicks · ${s.keys} keys · ${s.touches} touches`);
  lines.push("");
  lines.push(...locationBlock(geo));
  lines.push("");
  lines.push(`💻 ${esc(describeClient(ua))}`);
  lines.push(verdictLine(verdict, false));
  lines.push(...dntLine(payload));
  return lines.join("\n");
}

export async function sendTelegram(text: string, channel: Channel = "all"): Promise<{ ok: boolean; error?: string }> {
  const creds = credentials(channel);
  if (!creds) return { ok: false, error: "not configured" };

  const body = JSON.stringify({
    chat_id: creds.chatId,
    text: clip(text, 4000), // Telegram hard-caps a message at 4096 characters.
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  // Two attempts. The first request from a cold container pays the TCP and TLS
  // handshake. A rejected message (bad token, bad chat id) is not retried.
  let lastError = "send failed";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), SEND_TIMEOUT_MS);
      const res = await fetch(`${API}/bot${creds.token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: ctl.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.ok) return { ok: true };
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `telegram ${res.status} ${clip(detail, 160)}` };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "send failed";
    }
  }
  return { ok: false, error: lastError };
}

/** Send one message to every channel it is routed to, in parallel. */
export async function sendToChannels(text: string, channels: Channel[]): Promise<void> {
  const results = await Promise.all(channels.filter((c) => telegramConfigured(c)).map((c) => sendTelegram(text, c)));
  for (const r of results) if (!r.ok) console.error("[beacon] telegram send failed:", r.error);
}
