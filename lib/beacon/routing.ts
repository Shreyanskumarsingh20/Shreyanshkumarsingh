/**
 * Which Telegram bot hears about what.
 *
 *   "all"    — bot 1 (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID). Everything:
 *              crawler and AI-agent fetches, probes, MCP clients, and every
 *              visitor message, bots included.
 *   "human"  — bot 2 (TELEGRAM_HUMAN_BOT_TOKEN / TELEGRAM_HUMAN_CHAT_ID).
 *              Only real people: a visit's arrival and its end-of-visit report
 *              when the visitor scores as human, and hot actions (call,
 *              WhatsApp, email, résumé download, profile clicks) from anyone
 *              who isn't plainly a bot.
 *
 * Pure on purpose — no env, no I/O — so tests/beacon.test.ts can pin it down.
 */

export type Channel = "all" | "human";
export type MessageKind = "arrival" | "ended" | "report" | "event" | "crawler";

/** "Likely human" or better in bot.ts. */
export const HUMAN_SCORE = 62;
/** A hot action is strong evidence on its own; only clear bots are dropped. */
export const HOT_ACTION_SCORE = 40;

export function channelsFor(
  kind: MessageKind,
  verdict?: { score: number; crawler?: string },
  network?: { datacenter: boolean },
): Channel[] {
  if (kind === "crawler" || !verdict) return ["all"];
  if (verdict.crawler) return ["all"];

  if (kind === "event") {
    return verdict.score >= HOT_ACTION_SCORE ? ["all", "human"] : ["all"];
  }

  // The short "visit ended" notice is redundant next to the report, so the
  // human channel gets the arrival and the report only.
  const human = verdict.score >= HUMAN_SCORE && !network?.datacenter && kind !== "ended";
  return human ? ["all", "human"] : ["all"];
}
