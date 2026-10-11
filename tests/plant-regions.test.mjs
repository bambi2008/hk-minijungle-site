import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildRegionalFacetUrl, downloadRegionalGbif } from "../tools/plant-import/download-regional-gbif.mjs";
import { createPlantRecord } from "../tools/plant-import/schema.mjs";
import { fromGbifSpecies } from "../tools/plant-import/adapters/gbif-species.mjs";
import { publishPlantCatalog } from "../tools/plant-import/publish-plant-catalog.mjs";
import { mergeCatalogPlants } from "../src/plantCatalog.js";

const taxon = key => ({ key, rank: "SPECIES", taxonomicStatus: "ACCEPTED", kingdom: "Plantae", phylum: "Tracheophyta", family: "Asteraceae", genus: "Echinacea", canonicalName: `Echinacea test${key}`, scientificName: `Echinacea test${key} L.` });
const response = value => ({ ok: true, json: async () => value });

test("regional query requests bounded georeferenced present species facets", () => {
  const url = buildRegionalFacetUrl("HK", 100);
  assert.equal(url.searchParams.get("country"), "HK");
  assert.equal(url.searchParams.get("taxonKey"), "7707728");
  assert.equal(url.searchParams.get("facetLimit"), "200");
  assert.equal(url.searchParams.get("hasGeospatialIssue"), "false");
  assert.equal(url.searchParams.get("occurrenceStatus"), "PRESENT");
  assert.throws(() => buildRegionalFacetUrl("XX", 100));
  assert.throws(() => buildRegionalFacetUrl("HK", 501));
});

test("regional download merges country evidence and resumes without network", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "plant-region-test-"));
  try {
    const manifest = await downloadRegionalGbif({ cwd, outDir: "regional", countries: ["DE", "US"], perRegion: 2, sleep: async () => {}, fetchImpl: async input => {
      const url = new URL(input);
      if (url.pathname.endsWith("search")) return response({ facets: [{ field: "SPECIES_KEY", counts: url.searchParams.get("country") === "DE" ? [{ name: "11", count: 7 }, { name: "12", count: 3 }] : [{ name: "12", count: 8 }, { name: "13", count: 4 }] }] });
      return response(taxon(Number(url.pathname.split("/").at(-1))));
    } });
    assert.equal(manifest.records, 3);
    assert.deepEqual(manifest.regionCounts, { DE: 2, US: 2 });
    const records = (await readFile(path.join(cwd, "regional/records.ndjson"), "utf8")).trim().split("\n").map(JSON.parse);
    const shared = records.find(record => record.id === "gbif-species:12");
    assert.deepEqual(shared.regions.map(region => region.code), ["DE", "US"]);
    assert.deepEqual(shared.regions.map(region => region.occurrenceCount), [3, 8]);
    assert.equal(shared.regions[0].nativeStatus, "unknown");
    assert.equal(shared.provenance.filter(source => source.sourceId === "gbif-occurrence").length, 2);
    assert.deepEqual(createPlantRecord(shared).regions, shared.regions);
    const resumed = await downloadRegionalGbif({ cwd, outDir: "regional", countries: ["DE", "US"], perRegion: 2, resume: true, fetchImpl: async () => { throw new Error("must not fetch cached data"); } });
    assert.deepEqual(resumed.regionCounts, manifest.regionCounts);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test("regional sampler backfills rejected algae without publishing them", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "plant-region-filter-"));
  try {
    const manifest = await downloadRegionalGbif({ cwd, outDir: "regional", countries: ["HK"], perRegion: 2, fetchImpl: async input => {
      const url = new URL(input);
      if (url.pathname.endsWith("search")) return response({ facets: [{ field: "SPECIES_KEY", counts: [{ name: "11", count: 10 }, { name: "12", count: 8 }, { name: "13", count: 6 }] }] });
      const key = Number(url.pathname.split("/").at(-1));
      return response({ ...taxon(key), ...(key === 11 ? { phylum: "Chlorophyta" } : {}) });
    } });
    assert.equal(manifest.records, 2);
    assert.equal(manifest.publicationEligible, false);
    const records = await readFile(path.join(cwd, "regional/records.ndjson"), "utf8");
    assert.ok(!records.includes("gbif-species:11"));
    await assert.rejects(downloadRegionalGbif({ cwd, outDir: "../outside", perRegion: 2 }), /inside the current project/);
    await assert.rejects(downloadRegionalGbif({ cwd, outDir: "regional", perRegion: 2 }), /Output exists/);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test("catalogue merge preserves regional evidence while keeping one curated profile", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "plant-region-publish-"));
  try {
    const base = fromGbifSpecies(taxon(11), { retrievedAt: "2026-10-06" });
    const regional = structuredClone(base);
    regional.regions = [{ code: "HK", presence: "recorded", nativeStatus: "unknown", sourceId: "gbif-occurrence", occurrenceCount: 8, evidenceUrl: "https://api.gbif.org/v1/occurrence/search?country=HK&taxonKey=11", retrievedAt: "2026-10-06" }];
    await writeFile(path.join(cwd, "base.ndjson"), JSON.stringify(base) + "\n");
    await writeFile(path.join(cwd, "regional.ndjson"), JSON.stringify(regional) + "\n");
    const manifest = await publishPlantCatalog({ cwd, inputs: [{ input: "base.ndjson", mediaSource: "base-media" }, { input: "regional.ndjson", mediaSource: "regional-media" }], jsonOut: "public/data", mediaOut: "public/images" });
    assert.equal(manifest.records, 1);
    assert.equal(manifest.regionCounts["hong-kong"], 1);
    const catalog = JSON.parse(await readFile(path.join(cwd, "public/data/index.json"), "utf8"));
    assert.equal(catalog[0].regionalEvidence[0].occurrenceCount, 8);
    assert.equal(catalog[0].sources.find(source => source.type === "regional records").url, regional.regions[0].evidenceUrl);
    const merged = mergeCatalogPlants([{ scientificName: "Echinacea test11 Alternative-author", canonicalName: "Echinacea test11", region: "usa", sources: [], slug: "curated-echinacea" }], catalog);
    assert.equal(merged.length, 1);
    assert.equal(merged[0].slug, "curated-echinacea");
    assert.deepEqual(merged[0].regionIds, ["usa", "hong-kong"]);
    assert.equal(merged[0].regionalEvidence[0].nativeStatus, "unknown");
    const hybrid = mergeCatalogPlants([{ scientificName: "Bauhinia × blakeana Dunn", canonicalName: "Bauhinia × blakeana", catalogId: "gbif-species:2953373", region: "hong-kong", sources: [] }], [{ ...catalog[0], id: "gbif-species:2953373", canonicalName: "Bauhinia blakeana", scientificName: "Bauhinia ×blakeana Dunn" }]);
    assert.equal(hybrid.length, 1);
    assert.equal(hybrid[0].scientificName, "Bauhinia × blakeana Dunn");
    assert.equal(hybrid[0].regionalEvidence[0].occurrenceCount, 8);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
