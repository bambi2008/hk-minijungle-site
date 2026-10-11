import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildCommonsBatchUrl, buildCommonsExactSearchUrl, buildWikipediaBatchUrl, enrichWikimedia } from "../tools/plant-import/enrich-wikimedia.mjs";
import { toPublicCatalogRecord } from "../tools/plant-import/publish-plant-catalog.mjs";
import { createPlantRecord } from "../tools/plant-import/schema.mjs";

function response(payload, { status = 200, contentType = "application/json" } = {}) {
  const buffer = Buffer.isBuffer(payload) ? payload : Buffer.from(JSON.stringify(payload));
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => name.toLowerCase() === "content-type" ? contentType : name.toLowerCase() === "content-length" ? String(buffer.length) : null },
    json: async () => JSON.parse(buffer.toString("utf8")),
    arrayBuffer: async () => buffer,
  };
}

function plant(id, name) {
  return createPlantRecord({
    id,
    taxonomy: { scientificName: name, canonicalName: name, rank: "SPECIES", status: "ACCEPTED", kingdom: "Plantae", phylum: "Tracheophyta", family: "Testaceae" },
    provenance: [{ sourceId: "fixture", recordId: id, url: `https://example.invalid/${id}` }],
  });
}

test("builds official Wikimedia batch queries", () => {
  const wikipedia = buildWikipediaBatchUrl(["Abies alba", "Quercus robur"]);
  assert.equal(wikipedia.hostname, "en.wikipedia.org");
  assert.equal(wikipedia.searchParams.get("titles"), "Abies alba|Quercus robur");
  assert.equal(wikipedia.searchParams.get("explaintext"), "1");
  const commons = buildCommonsBatchUrl(["Abies_alba.jpg"]);
  assert.equal(commons.hostname, "commons.wikimedia.org");
  assert.equal(commons.searchParams.get("titles"), "File:Abies_alba.jpg");
  assert.equal(commons.searchParams.get("iiurlwidth"), "1200");
  const search = buildCommonsExactSearchUrl("Abies alba");
  assert.equal(search.searchParams.get("gsrsearch"), "\"Abies alba\" filetype:bitmap");
});

test("maps enriched records to a transparent public catalogue shape", () => {
  const record = plant("gbif-species:42", "Abies testii");
  record.names.push({ value: "test fir", language: "en", type: "common", region: "", sourceId: "wikipedia-en" });
  record.descriptions.push({ language: "en", section: "overview", text: "A sourced introduction.", sourceId: "wikipedia-en", rights: "CC BY-SA 4.0" });
  record.media.push({ url: "https://upload.wikimedia.org/test.jpg", sourcePage: "https://commons.wikimedia.org/wiki/File:Test.jpg", creator: "Test Author", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0", sourceId: "wikimedia-commons", localPath: "media/gbif-species-42.jpg", sha256: "abc" });
  const published = toPublicCatalogRecord(record);
  assert.equal(published.catalog, true);
  assert.equal(published.name.en, "test fir");
  assert.equal(published.summary.en, "A sourced introduction.");
  assert.equal(published.summary["zh-hk"], "目前提供英文來源導言；中文編輯摘要待校訂。");
  assert.equal(published.image, "/images/plants/catalog/gbif-species-42.jpg");
  assert.equal(published.imageCredit.author, "Test Author");
});

test("enriches exact Wikipedia matches and downloads allowlisted Commons images", async () => {
  const projectDirectory = await mkdtemp(path.join(os.tmpdir(), "hk-minijungle-wikimedia-"));
  const input = path.join(projectDirectory, "data", "records.ndjson");
  await import("node:fs/promises").then(({ mkdir }) => mkdir(path.dirname(input), { recursive: true }));
  const records = [plant("gbif-species:1", "Abies testii"), plant("gbif-species:2", "Missing plantii")];
  await writeFile(input, `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
  const imageBytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  let calls = 0;
  const fetchImpl = async (url) => {
    calls += 1;
    const parsed = new URL(url);
    if (parsed.hostname === "en.wikipedia.org") return response({ query: { pages: [
      { pageid: 10, title: "Abies testii", extract: "Abies testii is a test conifer.", pageimage: "Abies_testii.jpg", fullurl: "https://en.wikipedia.org/wiki/Abies_testii" },
      { title: "Missing plantii", missing: true, fullurl: "https://en.wikipedia.org/wiki/Missing_plantii" },
    ] } });
    if (parsed.hostname === "commons.wikimedia.org") return response({ query: { pages: [{
      title: "File:Abies testii.jpg",
      imageinfo: [{
        mime: "image/jpeg",
        thumburl: "https://upload.wikimedia.org/test/Abies_testii.jpg",
        thumbwidth: 1200,
        thumbheight: 800,
        descriptionurl: "https://commons.wikimedia.org/wiki/File:Abies_testii.jpg",
        extmetadata: {
          Artist: { value: "<a>Test Author</a>" },
          LicenseShortName: { value: "CC BY-SA 4.0" },
          LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/4.0" },
        },
      }],
    }] } });
    if (parsed.hostname === "upload.wikimedia.org" || parsed.hostname === "thumb.wikimedia.org") return response(imageBytes, { contentType: "image/jpeg" });
    throw new Error(`Unexpected URL: ${url}`);
  };
  try {
    const manifest = await enrichWikimedia({
      cwd: projectDirectory,
      input: "data/records.ndjson",
      outDir: "data/enrichment",
      batchSize: 2,
      concurrency: 2,
      fetchImpl,
      sleep: async () => {},
      startedAt: "2026-10-06T00:00:00.000Z",
    });
    assert.equal(manifest.status, "complete");
    assert.equal(manifest.processedRecords, 2);
    assert.equal(manifest.withDescription, 1);
    assert.equal(manifest.withImage, 1);
    assert.equal(manifest.publicationEligible, false);
    const enriched = (await readFile(path.join(projectDirectory, "data/enrichment/records-enriched.ndjson"), "utf8")).trim().split("\n").map(JSON.parse);
    assert.equal(enriched[0].descriptions[0].rights, "CC BY-SA 4.0");
    assert.equal(enriched[0].media[0].creator, "Test Author");
    assert.equal(enriched[0].media[0].licence, "CC BY-SA 4.0");
    assert.equal(enriched[0].media[0].localPath, "media/gbif-species-1.jpg");
    assert.equal((await readFile(path.join(projectDirectory, "data/enrichment/media/gbif-species-1.jpg"))).toString(), imageBytes.toString());
    const callsBeforeResume = calls;
    const resumed = await enrichWikimedia({ cwd: projectDirectory, input: "data/records.ndjson", outDir: "data/enrichment", batchSize: 2, concurrency: 2, fetchImpl, sleep: async () => {}, resume: true });
    assert.equal(resumed.startedAt, manifest.startedAt);
    assert.equal(calls, callsBeforeResume);
  } finally {
    await rm(projectDirectory, { recursive: true, force: true });
  }
});
