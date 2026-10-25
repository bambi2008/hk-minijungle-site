import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import config from "../vite.config.mjs";

let middleware;
config.plugins.find((plugin) => plugin.name === "prerendered-preview-routes")
  .configurePreviewServer({ middlewares: { use(handler) { middleware = handler; } } });

function rewrite(url, method = "GET") {
  const request = { url, method };
  let continued = false;
  middleware(request, {}, () => { continued = true; });
  assert.equal(continued, true);
  return request.url;
}

test("preview serves each approved clean route's own prerendered document", () => {
  assert.equal(rewrite("/zh-hk/solutions"), "/zh-hk/solutions/index.html");
  assert.equal(rewrite("/en/technology/xponge"), "/en/technology/xponge/index.html");
  assert.equal(rewrite("/zh-hk/contact?intent=quotation", "HEAD"), "/zh-hk/contact/index.html?intent=quotation");
});

test("preview leaves assets, API, writes, unknown paths and traversal variants untouched", () => {
  for (const url of ["/", "/assets/main.js", "/api/contact", "/missing", "/zh-hk/solutions/", "/zh-hk/solutions/../../private", "/zh-hk/%2e%2e/private"]) {
    assert.equal(rewrite(url), url);
  }
  assert.equal(rewrite("/zh-hk/contact", "POST"), "/zh-hk/contact");
});

test("Vercel maps every sitemap route to its own built document before SPA fallback", () => {
  const hosting = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const routes = [...sitemap.matchAll(/<loc>https:\/\/hkminijungle\.com([^<]*)<\/loc>/g)].map((match) => match[1]);
  assert.equal(hosting.rewrites.length, routes.length + 1);
  for (const route of routes) {
    const rule = hosting.rewrites.find((item) => item.source === route);
    assert.equal(rule?.destination, `${route}/index.html`);
    assert.ok(existsSync(new URL(`../dist/client${rule.destination}`, import.meta.url)));
  }
  assert.deepEqual(hosting.rewrites.at(-1), { source: "/(.*)", destination: "/index.html" });
  assert.ok(hosting.rewrites.slice(0, -1).every((rule) => /^\/(en|zh-hk)(\/[a-z0-9-]+)*$/.test(rule.source)));
});
