// Analytics opt-out (lib/consent.ts): GA4 + Clarity run by default; a stored
// opt-out, Global Privacy Control, or localhost turns them off — and the
// <head> bootstrap then never sends a GA `config` (page view).
import { test } from "node:test";
import assert from "node:assert/strict";
import { choiceFrom, gaBootstrap } from "../lib/consent.ts";

test("on by default; off on opt-out or Global Privacy Control", () => {
  assert.equal(choiceFrom(null, false), "on");
  assert.equal(choiceFrom(undefined, undefined), "on");
  assert.equal(choiceFrom("granted", false), "on");
  assert.equal(choiceFrom("denied", false), "off");
  assert.equal(choiceFrom(null, true), "off");
});

function run(host: string, stored: string | null, gpc: boolean) {
  const g = globalThis as Record<string, unknown>;
  g.window = globalThis;
  g.dataLayer = undefined;
  g.localStorage = { getItem: () => stored };
  g.location = { hostname: host };
  Object.defineProperty(globalThis, "navigator", { value: { globalPrivacyControl: gpc }, configurable: true });
  new Function(gaBootstrap("G-TEST123"))();
  const layer = g.dataLayer as unknown[][];
  return layer.some((a) => a[0] === "config");
}

test("the GA bootstrap sends a page view only when allowed", () => {
  assert.equal(run("www.shreyanshkumarsingh.com", null, false), true);
  assert.equal(run("www.shreyanshkumarsingh.com", "denied", false), false);
  assert.equal(run("www.shreyanshkumarsingh.com", null, true), false);
  assert.equal(run("localhost", null, false), false);
  assert.equal(run("127.0.0.1", null, false), false);
});
