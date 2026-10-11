import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fromGbifSpecies } from "../tools/plant-import/adapters/gbif-species.mjs";
import { createPlantRecord, deduplicatePlantRecords, validatePlantRecord } from "../tools/plant-import/schema.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = path.join(root, "tools", "plant-import", "fixtures", "gbif-echinacea.json");

test("normalizes a GBIF species record with provenance and review flags", async () => {
  const raw = JSON.parse(await readFile(fixturePath, "utf8"));
  const record = fromGbifSpecies(raw, { region: "US", retrievedAt: "2026-10-06" });
  assert.equal(record.id, "gbif-species:3150935");
  assert.equal(record.slug, "echinacea-purpurea");
  assert.equal(record.taxonomy.authorship, "(L.) Moench");
  assert.equal(record.taxonomy.family, "Asteraceae");
  assert.equal(record.names[0].value, "eastern purple coneflower");
  assert.equal(record.regions[0].code, "US");
  assert.match(record.provenance[0].url, /3150935$/);
  assert.deepEqual(validatePlantRecord(record).errors, []);
});

test("requires complete media attribution", () => {
  const record = createPlantRecord({
    id: "fixture:1",
    taxonomy: { scientificName: "Ginkgo biloba", rank: "SPECIES", status: "ACCEPTED", family: "Ginkgoaceae" },
    provenance: [{ sourceId: "fixture", recordId: "1", url: "https://example.invalid/1" }],
    media: [{ url: "https://example.invalid/image.jpg", sourceId: "fixture" }],
  });
  const validation = validatePlantRecord(record);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.includes("media[0].sourcePage is required"));
  assert.ok(validation.errors.includes("media[0].creator is required"));
  assert.ok(validation.errors.includes("media[0].licence is required"));
});

test("enforces the Wikimedia Commons licence allowlist", () => {
  const record = createPlantRecord({
    id: "fixture:commons",
    taxonomy: { scientificName: "Ginkgo biloba", rank: "SPECIES", status: "ACCEPTED", family: "Ginkgoaceae" },
    provenance: [{ sourceId: "fixture", recordId: "commons", url: "https://example.invalid/commons" }],
    media: [{
      url: "https://upload.wikimedia.org/example.jpg",
      sourcePage: "https://commons.wikimedia.org/wiki/File:Example.jpg",
      creator: "Example creator",
      licence: "All rights reserved",
      sourceId: "wikimedia-commons"
    }],
  });
  const validation = validatePlantRecord(record);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.includes("media[0].licence is not in the Wikimedia Commons allowlist"));
});

test("blocks machine-normalized records from publication", async () => {
  const raw = JSON.parse(await readFile(fixturePath, "utf8"));
  const record = fromGbifSpecies(raw, { region: "US", retrievedAt: "2026-10-06" });
  const validation = validatePlantRecord(record, { publish: true });
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.includes("An editor-reviewed record is required for publication"));
});

test("deduplicates matching taxa while preserving provenance", () => {
  const first = createPlantRecord({
    id: "a:1",
    taxonomy: { scientificName: "Quercus robur L.", canonicalName: "Quercus robur", rank: "SPECIES", status: "ACCEPTED", family: "Fagaceae" },
    names: [{ value: "English oak", language: "eng", sourceId: "a" }],
    provenance: [{ sourceId: "a", recordId: "1", url: "https://example.invalid/a" }],
  });
  const second = createPlantRecord({
    id: "b:2",
    taxonomy: { scientificName: "Quercus robur L.", canonicalName: "Quercus robur", rank: "SPECIES", status: "ACCEPTED", family: "Fagaceae" },
    names: [{ value: "夏櫟", language: "zh-hant", region: "HK", sourceId: "b" }],
    provenance: [{ sourceId: "b", recordId: "2", url: "https://example.invalid/b" }],
  });
  const result = deduplicatePlantRecords([first, second]);
  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].names.length, 2);
  assert.equal(result.records[0].provenance.length, 2);
  assert.equal(result.conflicts.length, 0);
});

test("CLI dry-run validates without writing output", () => {
  const result = spawnSync(process.execPath, [
    path.join(root, "tools", "plant-import", "import-plants.mjs"),
    "--source", "gbif",
    "--input", fixturePath,
    "--region", "US",
    "--retrieved-at", "2026-10-06",
    "--dry-run",
  ], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(result.stdout);
  assert.equal(summary.inputRecords, 1);
  assert.equal(summary.normalizedRecords, 1);
  assert.equal(summary.invalidRecords, 0);
  assert.equal(summary.dryRun, true);
  assert.equal(summary.output, undefined);
});
