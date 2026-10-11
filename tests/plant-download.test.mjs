import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildGbifSpeciesSearchUrl, downloadGbifSpecies } from "../tools/plant-import/download-gbif.mjs";

function gbifRecord(key, species) {
  const [genus] = species.split(" ");
  return {
    key,
    scientificName: `${species} L.`,
    canonicalName: species,
    rank: "SPECIES",
    taxonomicStatus: "ACCEPTED",
    kingdom: "Plantae",
    family: "Exampleaceae",
    genus,
  };
}

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    json: async () => payload,
  };
}

test("builds a bounded accepted vascular-plant species query", () => {
  const url = buildGbifSpeciesSearchUrl({ offset: 200, limit: 50 });
  assert.equal(url.origin + url.pathname, "https://api.gbif.org/v1/species/search");
  assert.equal(url.searchParams.get("highertaxon_key"), "7707728");
  assert.equal(url.searchParams.get("rank"), "SPECIES");
  assert.equal(url.searchParams.get("status"), "ACCEPTED");
  assert.equal(url.searchParams.get("limit"), "50");
  assert.equal(url.searchParams.get("offset"), "200");
});

test("downloads pages, checkpoints raw JSON and writes normalized NDJSON", async () => {
  const projectDirectory = await mkdtemp(path.join(os.tmpdir(), "hk-minijungle-download-"));
  const calls = [];
  const fetchImpl = async (url) => {
    const parsed = new URL(url);
    const offset = Number(parsed.searchParams.get("offset"));
    calls.push(offset);
    const results = offset === 0
      ? [gbifRecord(1, "Alpha plantus"), gbifRecord(2, "Beta plantus")]
      : [gbifRecord(3, "Gamma plantus")];
    return jsonResponse({ offset, limit: 2, endOfRecords: offset > 0, results });
  };
  try {
    const manifest = await downloadGbifSpecies({
      cwd: projectDirectory,
      outDir: "data/batch",
      limit: 3,
      pageSize: 2,
      fetchImpl,
      retrievedAt: "2026-10-06T00:00:00.000Z",
      startedAt: "2026-10-06T00:00:00.000Z",
    });
    assert.deepEqual(calls, [0, 2]);
    assert.equal(manifest.status, "complete");
    assert.equal(manifest.downloadedRawRecords, 3);
    assert.equal(manifest.normalizedRecords, 3);
    assert.equal(manifest.invalidRecords, 0);
    assert.equal(manifest.publicationEligible, false);
    assert.equal(manifest.scope, "vascular");
    const lines = (await readFile(path.join(projectDirectory, "data/batch/records.ndjson"), "utf8")).trim().split("\n");
    assert.equal(lines.length, 3);
    assert.equal(JSON.parse(lines[0]).review.state, "machine-normalized");
  } finally {
    await rm(projectDirectory, { recursive: true, force: true });
  }
});

test("resumes from cached pages without redownloading them", async () => {
  const projectDirectory = await mkdtemp(path.join(os.tmpdir(), "hk-minijungle-resume-"));
  let failSecondPage = true;
  const calls = [];
  const fetchImpl = async (url) => {
    const offset = Number(new URL(url).searchParams.get("offset"));
    calls.push(offset);
    if (offset === 2 && failSecondPage) return jsonResponse({}, 503);
    const results = offset === 0
      ? [gbifRecord(10, "Delta plantus"), gbifRecord(11, "Epsilon plantus")]
      : [gbifRecord(12, "Zeta plantus")];
    return jsonResponse({ offset, limit: 2, endOfRecords: offset > 0, results });
  };
  try {
    await assert.rejects(downloadGbifSpecies({
      cwd: projectDirectory,
      outDir: "data/batch",
      limit: 3,
      pageSize: 2,
      fetchImpl,
      sleep: async () => {},
    }), /HTTP 503/);
    failSecondPage = false;
    const manifest = await downloadGbifSpecies({
      cwd: projectDirectory,
      outDir: "data/batch",
      limit: 3,
      pageSize: 2,
      fetchImpl,
      sleep: async () => {},
      resume: true,
    });
    assert.equal(calls.filter((offset) => offset === 0).length, 1);
    assert.equal(manifest.downloadedRawRecords, 3);
    assert.equal(manifest.status, "complete");
    const repeated = await downloadGbifSpecies({
      cwd: projectDirectory,
      outDir: "data/batch",
      limit: 3,
      pageSize: 2,
      fetchImpl,
      sleep: async () => {},
      resume: true,
    });
    assert.equal(repeated.startedAt, manifest.startedAt);
    assert.equal(repeated.retrievedAt, manifest.retrievedAt);
  } finally {
    await rm(projectDirectory, { recursive: true, force: true });
  }
});

test("rejects unbounded and out-of-project downloads", async () => {
  const projectDirectory = await mkdtemp(path.join(os.tmpdir(), "hk-minijungle-bounds-"));
  try {
    await assert.rejects(downloadGbifSpecies({ cwd: projectDirectory, outDir: "data/batch", limit: 10_001, fetchImpl: async () => {} }), /between 1 and 10000/);
    await assert.rejects(downloadGbifSpecies({ cwd: projectDirectory, outDir: "../outside", limit: 1, fetchImpl: async () => {} }), /subdirectory/);
    await assert.rejects(downloadGbifSpecies({ cwd: projectDirectory, outDir: "data/batch", limit: 1, scope: "fungi", fetchImpl: async () => {} }), /scope must be one of/);
  } finally {
    await rm(projectDirectory, { recursive: true, force: true });
  }
});
