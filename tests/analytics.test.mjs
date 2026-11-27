import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { safeAnalyticsUrl } from "../src/analyticsPolicy.js";

test("every indexed page can be counted without collecting URL parameters", async () => {
  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(urls.length, 46);
  for (const url of urls) assert.equal(safeAnalyticsUrl(url + "?email=qa@example.test#private-message"), url);
});
test("analytics drops unknown paths, credentials, non-web URLs and external origins", () => {
  for (const url of ["https://hkminijungle.com/en/contact/qa@example.test", "https://hkminijungle.com/en/plants/private", "https://attacker.test/en/contact", "https://qa:password@hkminijungle.com/en", "mailto:qa@example.test", "not-a-page"]) assert.equal(safeAnalyticsUrl(url), null);
  assert.equal(safeAnalyticsUrl("http://127.0.0.1:4176/en/contact?secret=1"), "http://127.0.0.1:4176/en/contact");
});
