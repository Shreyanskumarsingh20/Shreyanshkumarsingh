import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/beacon/rate-limit";
import { BeaconSchema } from "@/lib/beacon/schema";
import { describeClient, judge } from "@/lib/beacon/bot";
import { resolveGeo } from "@/lib/beacon/geo";
import { channelsFor } from "@/lib/beacon/routing";
import {
  formatArrival,
  formatEnded,
  formatEvent,
  formatSummary,
  sendToChannels,
  telegramConfigured,
} from "@/lib/beacon/telegram";

// Visitor beacon → Telegram (ported from Imprint). Geolocation comes from
// per-request edge headers, so this must never be cached or statically built.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Worst case: a 1.5s geolocation lookup followed by an 8s Telegram send.
export const maxDuration = 20;

// Per visitor: enough for a long browse plus hot actions, not enough to flood.
const PER_IP_LIMIT = 20;
const PER_IP_WINDOW_MS = 10 * 60_000;
// A crawl arrives from many addresses, so cap the endpoint as a whole too.
const GLOBAL_LIMIT = 150;
const GLOBAL_WINDOW_MS = 10 * 60_000;
const MAX_BODY_BYTES = 24_000;

const empty = () => new NextResponse(null, { status: 204 });

export async function GET(req: NextRequest) {
  // Health check: proves the credentials are present on this deploy and shows
  // what the server resolved for the caller. Reveals only the caller's own
  // network facts — never a token or chat id.
  const geo = await resolveGeo(req.headers);
  if (!rateLimit(`beacon-check:${geo.ip}`, 20, 10 * 60_000).allowed) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }
  const ua = req.headers.get("user-agent") ?? "";
  return NextResponse.json(
    {
      ok: true,
      telegram: { allAlerts: telegramConfigured("all"), humanAlerts: telegramConfigured("human") },
      geo,
      request: { userAgent: ua, client: describeClient(ua), acceptLanguage: req.headers.get("accept-language") },
      optOutUrl: "/?notrack=1",
    },
    { headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );
}

export async function POST(req: NextRequest) {
  // Fire-and-forget by design: every path returns 204 and nothing surfaces to
  // the visitor.
  try {
    if (!telegramConfigured()) return empty();

    const raw = await req.text();
    if (!raw || raw.length > MAX_BODY_BYTES) return empty();

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return empty();
    }
    const parsed = BeaconSchema.safeParse(json);
    if (!parsed.success) return empty();
    const payload = parsed.data;
    if (payload.kind === "event" && !payload.hot) return empty();

    const geo = await resolveGeo(req.headers);
    const ua = req.headers.get("user-agent") ?? "";
    const verdict = judge(payload, geo, ua, req.headers.get("accept-language"));

    // Separate buckets, so automated traffic can never starve a real visitor
    // of their alert.
    const bucket = verdict.score >= 40 ? "human" : "suspect";
    if (!rateLimit(`beacon:${bucket}:${geo.ip}`, PER_IP_LIMIT, PER_IP_WINDOW_MS).allowed) return empty();
    if (!rateLimit(`beacon:global:${bucket}`, GLOBAL_LIMIT, GLOBAL_WINDOW_MS).allowed) return empty();

    const text =
      payload.kind === "event"
        ? formatEvent(payload, geo, verdict, ua)
        : payload.kind === "arrival"
          ? formatArrival(payload, geo, verdict, ua)
          : payload.kind === "ended"
            ? formatEnded(payload, geo)
            : formatSummary(payload, geo, verdict, ua);

    // Awaited rather than backgrounded: work started after the response is
    // returned can be killed on serverless, and the message would vanish.
    await sendToChannels(text, channelsFor(payload.kind, verdict, geo));
    return empty();
  } catch (err) {
    console.error("[beacon] unhandled:", err);
    return empty();
  }
}
