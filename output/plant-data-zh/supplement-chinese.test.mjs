import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createPlantRecord } from "../../tools/plant-import/schema.mjs";
import { isChineseName, appendUnique, selectExactEntity, withChineseAliases, supplementChinese } from "./supplement-chinese.mjs";
const entity = { id: "Q1", claims: { P225: [{ rank: "normal", mainsnak: { snaktype: "value", datavalue: { value: "Fixture species" } } }] }, labels: {}, aliases: { "zh-hant": [{ value: "中文測試別名" }] } };
test("Chinese coverage includes ISO zho but not Japanese kanji or Latin-only labels", () => {
  assert.equal(isChineseName({ language: "zho", value: "中文測試" }), true);
  assert.equal(isChineseName({ language: "zh-hk", value: "中文測試" }), true);
  assert.equal(isChineseName({ language: "jpn", value: "漢字" }), false);
  assert.equal(isChineseName({ language: "zh", value: "Latin name" }), false);
});
test("append-only merging never replaces existing source text", () => {
  const original = [{ language: "en", text: "original" }];
  const result = appendUnique(original, [{ language: "en", text: "replacement" }, { language: "zh-hk", text: "新增" }], item => item.language);
  assert.equal(result.length, 2);
  assert.equal(result[0].text, "original");
  assert.equal(original.length, 1);
});
test("ambiguous and mismatched entities are rejected; exact aliases retain source type", () => {
  assert.equal(selectExactEntity([entity], "Fixture species"), entity);
  assert.equal(selectExactEntity([entity, { ...entity, id: "Q2" }], "Fixture species"), null);
  assert.equal(selectExactEntity([entity], "Another species"), null);
  const result = withChineseAliases({ id: "fixture", taxonomy: { canonicalName: "Fixture species" } }, entity, {});
  assert.equal(result.names[0].sourceField, "alias");
  assert.equal(result.names[0].sourcePage, "https://www.wikidata.org/wiki/Q1");
  assert.equal(result.identityMethod, "exact-P225");
  assert.equal(withChineseAliases({ id: "fixture", taxonomy: { canonicalName: "Another species" } }, entity, {}).names.length, 0);
});

test("full supplement is append-only, refuses changed inputs and resumes without fetch", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "hk-plant-supplement-test-"));
  try {
    const record = { ...createPlantRecord({ taxonomy: { canonicalName: "Fixture species" }, sourceId: "gbif-species", sourceRecordId: "fixture", provenance: [{ sourceId: "gbif-species", recordId: "fixture", url: "https://www.gbif.org/" }] }), chineseEnrichment: { entityId: "Q1" } };
    await writeFile(path.join(cwd, "input.ndjson"), JSON.stringify(record));
    let calls = 0;
    const options = { cwd, input: "input.ndjson", outDir: "out", fetchImpl: async () => { calls += 1; return new Response(JSON.stringify({ entities: { Q1: entity } })); }, sleep: async () => {} };
    const manifest = await supplementChinese(options);
    assert.equal(calls, 1);
    assert.equal(manifest.chineseNamesBefore, 0);
    assert.equal(manifest.chineseNamesAfter, 1);
    const before = await readFile(path.join(cwd, "out/records-enriched.ndjson"), "utf8");
    const resumed = await supplementChinese({ ...options, resume: true, fetchImpl: async () => { throw new Error("No fetch permitted"); } });
    assert.equal(resumed.networkRequestsThisRun, 0);
    assert.equal(await readFile(path.join(cwd, "out/records-enriched.ndjson"), "utf8"), before);
    const merged = JSON.parse(before);
    assert.deepEqual(merged.taxonomy, record.taxonomy);
    assert.deepEqual(merged.media, record.media);
    await writeFile(path.join(cwd, "input.ndjson"), JSON.stringify({ ...record, traits: { changed: true } }));
    await assert.rejects(supplementChinese({ ...options, resume: true }), /fingerprint/);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
