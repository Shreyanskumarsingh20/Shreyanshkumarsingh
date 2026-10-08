// Markdown content negotiation (proxy.ts → lib/negotiate.ts).
// Run with `npm test` (Node's built-in runner, TypeScript stripped natively).
import { test } from "node:test";
import assert from "node:assert/strict";
import { negotiate, parseAccept, qFor } from "../lib/negotiate.ts";

test("agents asking for markdown get markdown", () => {
  assert.equal(negotiate("text/markdown"), "markdown");
  assert.equal(negotiate("text/markdown, text/html;q=0.9"), "markdown");
  assert.equal(negotiate("text/markdown;q=1.0, */*;q=0.1"), "markdown");
});

test("browsers and missing headers get HTML", () => {
  assert.equal(negotiate(null), "html");
  assert.equal(negotiate(""), "html");
  assert.equal(negotiate("*/*"), "html");
  assert.equal(negotiate("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"), "html");
  // a tie goes to HTML — markdown must be strictly preferred
  assert.equal(negotiate("text/markdown, text/html"), "html");
  assert.equal(negotiate("text/html, text/markdown;q=0.5"), "html");
});

test("nothing acceptable is a 406", () => {
  assert.equal(negotiate("application/json"), "none");
  assert.equal(negotiate("image/png, text/markdown;q=0"), "none");
});

test("q-values follow RFC 9110 specificity", () => {
  const prefs = parseAccept("text/*;q=0.4, text/markdown;q=0.9, */*;q=0.1");
  assert.equal(qFor(prefs, "text/markdown"), 0.9);
  assert.equal(qFor(prefs, "text/html"), 0.4);
  assert.equal(qFor(prefs, "image/png"), 0.1);
  assert.equal(qFor(parseAccept("text/html;q=abc"), "text/html"), 1);
});
