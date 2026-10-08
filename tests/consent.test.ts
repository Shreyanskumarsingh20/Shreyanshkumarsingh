// Cookie-consent parsing (lib/consent.ts): anything but an explicit choice
// is "unset", so the banner shows and nothing third-party loads.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConsent } from "../lib/consent.ts";

test("only an explicit choice counts as consent", () => {
  assert.equal(parseConsent("granted"), "granted");
  assert.equal(parseConsent("denied"), "denied");
  for (const v of [null, undefined, "", "yes", "true", "GRANTED", "1"]) assert.equal(parseConsent(v), "unset");
});
