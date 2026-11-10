import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import config from "../vite.config.mjs";

let middleware;
config.plugins.find((plugin) => plugin.name === "prerendered-preview-routes")
  .configurePreviewServer({ middlewares: { use(handler) { middleware = handler; } } });

function requestRoute(url, method = "GET") {
  const request = { url, method };
  let continued = false;
  const response = { status: 0, headers: {}, writeHead(status, headers) { this.status = status; Object.assign(this.headers, headers); }, setHeader(name, value) { this.headers[name] = value; }, end(body) { this.body = body; } };
  middleware(request, response, () => { continued = true; });
  return { url: request.url, continued, ...response };
}
const rewrite = (url, method) => requestRoute(url, method).url;

test("preview serves each approved clean route's own prerendered document", () => {
  assert.equal(rewrite("/zh-hk/solutions"), "/zh-hk/solutions/index.html");
  assert.equal(rewrite("/en/technology/xponge"), "/en/technology/xponge/index.html");
  assert.equal(rewrite("/zh-hk/contact?intent=quotation", "HEAD"), "/zh-hk/contact/index.html?intent=quotation");
});

test("preview preserves assets and methods; unknown paths and traversal get real noindex 404", () => {
  assert.equal(requestRoute("/").headers.Location, "/zh-hk");
  assert.equal(requestRoute("/favicon.ico").headers["Content-Type"], "image/x-icon");
  for (const url of ["/assets/missing.js", "/api/contact", "/missing", "/en/about/nope", "/zh-hk/solutions/../../private", "/zh-hk/%2e%2e/private", "/bad%zz"]) {
    const response = requestRoute(url);
    assert.equal(response.status, 404);
    assert.match(response.body.toString(), /name="robots" content="noindex"/);
  }
  assert.equal(rewrite("/zh-hk/contact", "POST"), "/zh-hk/contact");
});

test("preview normalizes only known paths and retains the query", () => {
  for (const [url, location] of [["/EN?source=test", "/en?source=test"], ["/zh-hk/solutions/", "/zh-hk/solutions"], ["/En/SoLuTiOnS/index.html", "/en/solutions"], ["/index.html", "/zh-hk"], ["/?source=gsc", "/zh-hk?source=gsc"], ["/INDEX.HTML/?source=gsc", "/zh-hk?source=gsc"]]) {
    const response = requestRoute(url, "HEAD");
    assert.equal(response.status, 301);
    assert.equal(response.headers.Location, location);
  }
});

test("Vercel maps exact prerendered pages and no SPA catch-all", () => {
  const hosting = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  const rootRedirect = hosting.redirects.find(rule => rule.source === "/");
  assert.equal(rootRedirect?.statusCode, 301);
  assert.equal(rootRedirect?.destination, "https://hkminijungle.com/zh-hk");
  assert.ok(!rootRedirect.has, "all root-home variants must consolidate to the same locale");
  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const routes = [...sitemap.matchAll(/<loc>https:\/\/hkminijungle\.com([^<]*)<\/loc>/g)].map((match) => match[1]);
  assert.equal(routes.length, 46);
  for (const route of routes) {
    const rule = hosting.rewrites.find((item) => item.source === route);
    assert.equal(rule?.destination, `${route}/index.html`);
    assert.ok(existsSync(new URL(`../dist/client${rule.destination}`, import.meta.url)));
  }
  assert.ok(hosting.rewrites.every((rule) => /^\/(en|zh-hk)(\/[a-z0-9-]+)*$/.test(rule.source)));
  assert.ok(existsSync(new URL("../dist/client/404.html", import.meta.url)));
  for (const rule of hosting.rewrites) {
    assert.ok(existsSync(new URL(`../dist/client${rule.destination}`, import.meta.url)));
    const redirect = hosting.redirects.find(item => item.destination === rule.source);
    assert.equal(redirect.statusCode, 301);
    const matcher = new RegExp(`^${redirect.source}$`);
    assert.ok(!matcher.test(rule.source), "canonical must never redirect to itself");
    assert.ok(matcher.test(rule.source.toUpperCase()));
    assert.ok(matcher.test(rule.source + "/"));
    assert.ok(matcher.test(rule.source + "/INDEX.HTML"));
    assert.ok(!matcher.test(rule.source + "/unknown"));
  }
});
