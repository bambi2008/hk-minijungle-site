import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { officeSceneImages, shoppingMallImages, brandStoreImages, publicSpaceImages } from "../src/sceneGalleries.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function structuredData(html) {
  return Array.from(html.matchAll(/<script type="application\/ld\+json" data-geo-structured-data>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]));
}

test("Hero continuity preserves readable static images and the CANVIVA family hierarchy", async () => {
  const home = await read("dist/client/zh-hk/index.html");
  const product = await read("dist/client/zh-hk/products/canviva/index.html");
  const technology = await read("dist/client/zh-hk/technology/xponge/index.html");
  assert.match(home, /home-entry--immersive/);
  assert.match(home, /data-motion="auto"/);
  assert.doesNotMatch(home, /data-reveal="pending"/);
  assert.match(product, /<h1>CANVIVA<\/h1>/);
  assert.match(product, /page-hero__family/);
  for (const name of ["CANVIVA SIGNATURE", "CANVIVA WALL", "CANVIVA PANEL"]) assert.ok(product.includes(name));
  assert.match(technology, /system-tech-head--immersive/);
  assert.match(technology, /data-motion="none"/);
  const styles = await read("src/site.css");
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.home-office-gallery \.image-frame\[data-reveal\] \{ transform: none; \}/);
});

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

test("home public-space gallery has one representative per setting and preserves all office assets", async () => {
  const scenes = ["meeting", "executive", "studio", "collaboration", "shared", "design-studio", "plant-interaction", "team-break", "window-lounge", "creative-discussion", "lounge"];
  const hashes = new Set();
  for (const scene of scenes) {
    const bytes = await readFile(path.join(root, "public/images", `canviva-office-${scene}-concept.png`));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    hashes.add(createHash("sha256").update(bytes).digest("hex"));
  }
  assert.equal(hashes.size, 11, "every supplied scene must be distinct");
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/index.html`);
    const section = html.match(/<section class="section section--sand home-entry home-entry--immersive" id="office-scenes">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(section);
    assert.equal((section.match(/class="home-entry-card home-entry-card--office"/g) || []).length, 1);
    assert.doesNotMatch(section, /同一套生命系統，按場景定義|One living system, shaped around the setting/);
    assert.match(section, locale === "en" ? /Designed for public spaces/ : /為公共空間而設/);
    assert.match(section, locale === "en" ? /Next image/ : /下一張圖片/);
    assert.doesNotMatch(section, /為辦公空間而設|Designed for offices/);
    for (const image of publicSpaceImages) assert.ok(section.includes(image.src));
    assert.equal((section.match(/evidence-badge--concept/g) || []).length, 3);
    assert.equal((section.match(locale === "en" ? />Concept visualisation</g : />概念效果圖</g) || []).length, 3);
    assert.match(section, new RegExp(`href="/${locale}/contact\\?intent=quotation#project-quotation"`));
  }
});

test("application galleries expose all supplied scenes, unique controls and unchanged source dimensions", async () => {
  const groups = [officeSceneImages, shoppingMallImages, brandStoreImages];
  assert.deepEqual(groups.map((images) => images.length), [11, 8, 9]);
  const unique = new Set();
  for (const image of groups.flat()) {
    const bytes = await readFile(path.join(root, "public", image.src));
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), image.width);
    assert.equal(bytes.readUInt32BE(20), image.height);
    unique.add(createHash("sha256").update(bytes).digest("hex"));
  }
  assert.equal(unique.size, 28);
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/solutions/index.html`);
    assert.match(html, /SHOPPINGMALL/);
    assert.match(html, locale === "en" ? /Sustainability-minded brand stores/ : /可持續發展理念的品牌店/);
    assert.doesNotMatch(html, /酒店與會所|物業與大堂|Hospitality &amp; Clubs|Property &amp; Lobby/);
    for (const image of groups.flat()) assert.ok(html.includes(image.src));
    assert.equal((html.match(/class="home-office-slide"/g) || []).length, 28);
    const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, "gallery instances must not duplicate IDs");
    for (const control of html.matchAll(/aria-controls="(scene-track-[^"]+)"/g)) assert.ok(ids.includes(control[1]));
    for (const [index, slug] of ["workplace", "hospitality-retail", "property-fm"].entries()) {
      const detail = await read(`dist/client/${locale}/solutions/${slug}/index.html`);
      assert.equal((detail.match(/class="home-office-slide"/g) || []).length, groups[index].length);
    }
  }
});

test("contact route exposes a stable quotation anchor, labelled form and honest price gaps", async () => {
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/contact/index.html`);
    assert.match(html, /id="project-quotation"/);
    assert.match(html, /aria-labelledby="project-quotation-title"/);
    assert.match(html, /id="project-quotation-title"/);
    assert.match(html, locale === "en" ? /Request a project quotation/ : /索取項目報價/);
    assert.match(html, locale === "en" ? /budget ranges and lead-time guidance remain pending/ : /典型預算範圍與交期指引仍待補充/);
  }
});

test("home exposes seven PDF palette choices and omits the two removed homepage sections", async () => {
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/index.html`);
    assert.match(html, /id="plant-designs"/);
    assert.equal((html.match(/aria-controls="plant-design-preview"/g) || []).length, 7);
    assert.doesNotMatch(html, /home-proof|home-process|Three product categories for commercial interiors|三個面向商業室內空間的正式產品分類/);
    assert.match(html, locale === "en" ? /not identification of physical specimens/ : /非實物品種鑑定/);
    assert.match(html, locale === "en" ? /Materials required/ : /待補充材料/);
  }
  for (let number = 1; number <= 7; number++) {
    for (const kind of ["scene", "detail"]) {
      const bytes = await readFile(path.join(root, "public/images/plant-designs", `plant-design-${String(number).padStart(2, "0")}-${kind}.png`));
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    }
  }
});

test("technology route exposes three honest technical sections and header navigation", async () => {
  for (const locale of ["en", "zh-hk"]) {
    const html = await read(`dist/client/${locale}/technology/xponge/index.html`);
    for (const id of ["system-structure", "xponge-roots", "automatic-care"]) assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, /canviva-system-exploded-concept\.png/);
    assert.match(html, /08:00–20:00/);
    assert.match(html, /25–30/);
    assert.doesNotMatch(html, /原文/);
    assert.match(html, locale === "en" ? /Furniture-like modular design/ : /家具化模組設計/);
    assert.match(html, locale === "en" ? /power connection/ : /接上電源即可運行/);
    assert.match(html, /system-tech-documentation/);
    assert.match(html, /why-your-plant-wall-wont-die-dualflow-structure/);
    assert.match(html, /tech-products-redefining-green-living-with-xponge/);
    assert.match(html, /extension\.umn\.edu/);
    for (const id of ["patent-title", "root-balance-title", "dualflow-title", "matrix-structure-title", "calcium-silicon-title"]) assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, locale === "en" ? /patented growing matrix/ : /專利種植基質/);
    assert.match(html, locale === "en" ? /patent number, title, proprietor/ : /專利號、專利名稱、權利人/);
    assert.match(html, locale === "en" ? /worldwide protection is not implied/ : /不推定為 HK MINIJUNGLE 自有或全球有效專利/);
    assert.match(html, /junglemat-vertical-greening-system-how-xponge-matrix/);
    assert.doesNotMatch(html, /95%\+|100% sterile|DR FOREST/);
    assert.match(html, locale === "en" ? /reference operating settings/ : /參考運行設定/);
    const home = await read(`dist/client/${locale}/index.html`);
    assert.match(home, new RegExp(`href="/${locale}/technology/xponge"`));
  }
});
