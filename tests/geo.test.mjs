import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function structuredData(html) {
  return Array.from(html.matchAll(/<script type="application\/ld\+json" data-geo-structured-data>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]));
}

test("llms.txt reflects the current CANVIVA-only public brand architecture", async () => {
  const content = await read("dist/client/llms.txt");
  for (const name of ["CANVIVA SIGNATURE", "CANVIVA WALL", "CANVIVA PANEL"]) assert.match(content, new RegExp(name));
  for (const retired of ["CUISVIVA", "Living Wall", "Art Wall", "horticultural therapy"]) assert.doesNotMatch(content, new RegExp(retired, "i"));
  assert.match(content, /\+852 5478 7719/);
});

test("home routes contain crawlable text, correct language and WebSite schema", async () => {
  for (const [locale, lang] of [["en", "en"], ["zh-hk", "zh-Hant-HK"]]) {
    const html = await read(`dist/client/${locale}/index.html`);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, /CANVIVA/);
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="zh-Hant-HK"/);
    const schemas = structuredData(html);
    assert.ok(schemas.some((item) => item["@type"] === "Organization"));
    assert.ok(schemas.some((item) => item["@type"] === "WebSite"));
  }
});

test("product routes expose only the three approved product names", async () => {
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/products/index.html`);
    const list = structuredData(html).find((item) => item["@type"] === "ItemList");
    assert.ok(list);
    assert.deepEqual(list.itemListElement.map((entry) => entry.item.name), ["CANVIVA SIGNATURE", "CANVIVA WALL", "CANVIVA PANEL"]);
    assert.doesNotMatch(html, /CUISVIVA|CANVIVA · Living Wall|CANVIVA · Art Wall/i);
  }
});

test("About FAQ schema matches visible questions and leaves missing material visible", async () => {
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/about/index.html`);
    const faq = structuredData(html).find((item) => item["@type"] === "FAQPage");
    assert.equal(faq.mainEntity.length, 5);
    for (const question of faq.mainEntity) assert.match(html, new RegExp(question.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, locale === "en" ? /Materials required/ : /待補充材料/);
  }
});

test("every sitemap URL has a generated route document", async () => {
  const sitemap = await read("public/sitemap.xml");
  const routes = Array.from(sitemap.matchAll(/<loc>https:\/\/hkminijungle\.com([^<]+)<\/loc>/g), (match) => match[1]);
  assert.equal(routes.length, 42);
  for (const route of routes) {
    const html = await read(path.join("dist/client", ...route.split("/").filter(Boolean), "index.html"));
    assert.match(html, /<div id="root">[\s\S]+<\/div>/);
  }
});

test("robots.txt remains open to crawlers", async () => {
  const robots = await read("public/robots.txt");
  assert.match(robots, /User-agent:\s*\*/i);
  assert.doesNotMatch(robots, /User-agent:\s*(GPTBot|ClaudeBot|PerplexityBot|CCBot)/i);
  assert.doesNotMatch(robots, /Disallow:\s*\//i);
});
