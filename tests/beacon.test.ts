// The Telegram beacon's pure decisions: who is a crawler, which paths are
// worth an alert, how a visitor is scored, and which bot hears about it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { identifyCrawler } from "../lib/beacon/crawlers.ts";
import { classifyPath, isReportablePath } from "../lib/beacon/paths.ts";
import { judge, type JudgeInput } from "../lib/beacon/bot.ts";
import { channelsFor } from "../lib/beacon/routing.ts";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

test("live AI fetchers are told apart from training crawlers", () => {
  assert.equal(identifyCrawler("Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0")?.kind, "live");
  assert.equal(identifyCrawler("Mozilla/5.0; compatible; GPTBot/1.2")?.kind, "ai");
  assert.equal(identifyCrawler("Claude-SearchBot/1.0")?.name, "Claude-SearchBot");
  assert.equal(identifyCrawler("Claude-User/1.0")?.kind, "live");
  assert.equal(identifyCrawler("Mozilla/5.0 (compatible; Googlebot/2.1)")?.kind, "search");
  assert.equal(identifyCrawler("LinkedInBot/1.0")?.kind, "social");
  assert.equal(identifyCrawler("curl/8.4.0")?.kind, "tool");
  assert.equal(identifyCrawler(null)?.kind, "unknown");
  assert.equal(identifyCrawler(CHROME), null);
});

test("real pages, markdown twins and agent files are known routes", () => {
  for (const p of ["/", "/about", "/resume", "/about.md", "/index.md", "/projects/sarthi-rag-banking-copilot", "/notes/x-y.md", "/llms.txt", "/.well-known/ai-catalog.json", "/api/mcp"]) {
    assert.equal(classifyPath(p).known, true, p);
    assert.equal(classifyPath(p).probe, null, p);
  }
});

test("scanner probes are named, unknown pages are plain 404s", () => {
  assert.match(classifyPath("/.env").probe ?? "", /env file/);
  assert.equal(classifyPath("/wp-login.php").probe, "WordPress");
  assert.equal(classifyPath("/.git/HEAD").probe?.startsWith("git"), true);
  assert.deepEqual(classifyPath("/no-such-page"), { known: false, probe: null });
  assert.deepEqual(classifyPath("/.well-known/unknown.json"), { known: false, probe: null });
});

test("only pages and agent files raise alerts, not assets", () => {
  assert.equal(isReportablePath("/about"), true);
  assert.equal(isReportablePath("/about.md"), true);
  assert.equal(isReportablePath("/llms-full.txt"), true);
  assert.equal(isReportablePath("/api/mcp"), true);
  assert.equal(isReportablePath("/api/beacon"), false);
  assert.equal(isReportablePath("/robots.txt"), false);
  assert.equal(isReportablePath("/shots/nythera-real.jpg"), false);
  assert.equal(isReportablePath("/about/opengraph-image-1x2y3z"), false);
});

function payload(over: Partial<JudgeInput["signals"]> = {}, kind: JudgeInput["kind"] = "arrival"): JudgeInput {
  return {
    kind,
    activeMs: 0,
    sessionMs: 1500,
    scroll: { maxPx: 0, maxPct: 0, milestones: [], events: 0 },
    device: { screenW: 1920, screenH: 1080, viewportW: 1366, viewportH: 768, dpr: 1 },
    signals: {
      pointerMoves: 0, clicks: 0, keys: 0, touches: 0, visibilityChanges: 0,
      firstActionMs: null, lastActionMs: null, webdriver: false, touchSupport: false,
      cookiesEnabled: true, doNotTrack: false, languages: 2, plugins: 5,
      hardwareConcurrency: 8, deviceMemory: 8, timezone: "Asia/Kolkata", language: "en-IN",
      ...over,
    },
  };
}
const home = { datacenter: false, isp: "Reliance Jio" };

test("an ordinary browser arrival scores as human", () => {
  const v = judge(payload(), home, CHROME, "en-IN,en;q=0.9");
  assert.ok(v.score >= 80, `score ${v.score}`);
  assert.equal(v.label, "Human");
});

test("headless automation and Lighthouse score as bots", () => {
  // webdriver alone drops a full browser below the human-channel bar
  assert.ok(judge(payload({ webdriver: true }), home, CHROME, "en").score < 62);
  const lh = judge(payload({ languages: 0, plugins: 0 }), { datacenter: true, isp: "Google LLC" }, `${CHROME} Chrome-Lighthouse`, null);
  assert.ok(lh.score < 20, `score ${lh.score}`);
  assert.equal(judge(payload(), home, "Mozilla/5.0 (compatible; Googlebot/2.1)", "en").crawler, "Googlebot");
});

test("bot 1 hears everything; bot 2 only humans and hot actions", () => {
  const human = { score: 85 };
  assert.deepEqual(channelsFor("arrival", human, { datacenter: false }), ["all", "human"]);
  assert.deepEqual(channelsFor("report", human, { datacenter: false }), ["all", "human"]);
  // the short "ended" notice stays out of the human channel
  assert.deepEqual(channelsFor("ended", human, { datacenter: false }), ["all"]);
  // datacenter traffic is never a "real human visit"
  assert.deepEqual(channelsFor("arrival", human, { datacenter: true }), ["all"]);
  assert.deepEqual(channelsFor("arrival", { score: 45 }, { datacenter: false }), ["all"]);
  // a hot action from an uncertain visitor still reaches bot 2; a bot's doesn't
  assert.deepEqual(channelsFor("event", { score: 45 }, { datacenter: false }), ["all", "human"]);
  assert.deepEqual(channelsFor("event", { score: 10 }, { datacenter: false }), ["all"]);
  assert.deepEqual(channelsFor("arrival", { score: 2, crawler: "Googlebot" }), ["all"]);
  assert.deepEqual(channelsFor("crawler"), ["all"]);
});
