import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { canvivaModels, duoSceneImages } from "../src/canvivaModels.js";
import { officeSceneImages, shoppingMallImages, brandStoreImages } from "../src/sceneGalleries.js";

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
test("public choices stay ONE and DUO, with no live availability claim", async () => {
  assert.deepEqual(canvivaModels.map(p => p.slug), ["canviva-one", "canviva-duo"]);
  const fallback = await read("index.html");
  assert.doesNotMatch(fallback, /CANVIVA SIGNATURE|CANVIVA WALL|CANVIVA PANEL/);
  assert.match(fallback, /CANVIVA ONE/);
  assert.match(fallback, /CANVIVA DUO/);
  for (const locale of ["zh-hk", "en"]) {
    const home = await read(`dist/client/${locale}/index.html`);
    assert.match(home, locale === "en" ? /Living systems for public spaces/ : /為公共空間而設的生命系統/);
    for (const slug of ["canviva-one", "canviva-duo"]) {
      const html = await read(`dist/client/${locale}/products/${slug}/index.html`);
      assert.match(html, new RegExp(`CANVIVA ${slug.endsWith("one") ? "ONE" : "DUO"}</h1>`));
      assert.doesNotMatch(html, /CANVIVA SIGNATURE|CANVIVA WALL|CANVIVA PANEL|InStock|PreOrder/);
      assert.match(html, /srcSet=/);
      if (slug.endsWith("duo")) {
        assert.match(html, locale === "en" ? /Coming soon/ : /即將上市/);
        assert.match(html, /duo-interest/);
        assert.equal((html.match(/class="home-office-slide"/g) || []).length, 3);
        assert.match(html, locale === "en" ? /not an order or reservation/ : /不構成訂購或預留/);
        for (const image of duoSceneImages) assert.ok(html.includes(image.src));
      }
    }
  }
});

test("all supplied public gallery scenes have lightweight proportional derivatives", async () => {
  const manifest = JSON.parse(await read("src/imageManifest.json"));
  for (const image of [...officeSceneImages, ...shoppingMallImages, ...brandStoreImages, ...duoSceneImages]) {
    const item = manifest[image.src];
    assert.ok(item, `missing responsive image ${image.src}`);
    assert.equal(item.width, image.width);
    assert.equal(item.height, image.height);
    for (const variant of item.variants) {
      const bytes = await readFile(new URL(`public${variant.src}`, root));
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      assert.equal(bytes.length, variant.bytes);
      assert.ok(variant.width <= image.width);
      assert.ok(Math.abs(variant.height - image.height * variant.width / image.width) <= 1);
      assert.ok(variant.bytes < item.originalBytes);
    }
  }
});
