import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createPlantRecord } from "../../tools/plant-import/schema.mjs";
import { enrichChinese, chineseResult, matchesScientificName, resolvePages, wikipediaUrl, withinProject } from "./enrich-chinese.mjs";

const entity = { id: "Q43284", claims: { P225: [{ rank: "normal", mainsnak: { snaktype: "value", datavalue: { value: "Ginkgo biloba" } } }] }, labels: { "zh-hant": { value: "銀杏" }, "zh-hans": { value: "银杏" } }, sitelinks: { zhwiki: { title: "银杏" } } };
const record = createPlantRecord({ taxonomy: { canonicalName: "Ginkgo biloba", rank: "SPECIES", status: "ACCEPTED", family: "Ginkgoaceae" }, sourceId: "gbif-species", sourceRecordId: "5284884", provenance: [{ sourceId: "gbif-species", recordId: "5284884", url: "https://www.gbif.org/species/5284884" }], regions: [{ code: "CN" }] });
const zhPage = { pageid: 23937, ns: 0, title: "银杏", pageprops: { wikibase_item: "Q43284" }, extract: "繁體來源夾具，不是真實植物導言。", fullurl: "https://zh.wikipedia.org/wiki/银杏", lastrevid: 1 };

test("scientific identity is exact and preserves hybrid distinction and rank deprecation", () => {
  assert.equal(matchesScientificName(entity, "ginkgo biloba"), true);
  assert.equal(matchesScientificName(entity, "Ginkgo"), false);
  const hybrid = structuredClone(entity);
  hybrid.claims.P225[0].mainsnak.datavalue.value = "Bauhinia × blakeana";
  assert.equal(matchesScientificName(hybrid, "Bauhinia ×blakeana"), true);
  assert.equal(matchesScientificName(hybrid, "Bauhinia blakeana"), false);
  hybrid.claims.P225[0].rank = "deprecated";
  assert.equal(matchesScientificName(hybrid, "Bauhinia × blakeana"), false);
});

test("Wikipedia URL is bounded and resolves only official redirect mappings", () => {
  const url = wikipediaUrl(["Ginkgo biloba"], "zh-hk");
  assert.equal(url.hostname, "zh.wikipedia.org");
  assert.equal(url.searchParams.get("variant"), "zh-hk");
  assert.equal(url.searchParams.get("exlimit"), "max");
  assert.throws(() => wikipediaUrl(Array(21).fill("x")), /1–20/);
  const resolved = resolvePages(["Ginkgo_biloba", "unknown"], { query: { normalized: [{ from: "Ginkgo_biloba", to: "Ginkgo biloba" }], redirects: [{ from: "Ginkgo biloba", to: "银杏" }], pages: [zhPage, { title: "unknown", missing: true }] } });
  assert.equal(resolved.get("Ginkgo_biloba"), zhPage);
  assert.equal(resolved.get("unknown"), null);
});

test("Chinese text requires the same exact entity and retains revision/licence/variant", () => {
  const result = chineseResult(record, entity, { "zh-hk": zhPage, "zh-cn": { ...zhPage, extract: "简体来源夹具。" } });
  assert.equal(result.names.length, 3);
  assert.equal(result.descriptions.length, 2);
  assert.equal(result.descriptions[0].rights, "CC BY-SA 4.0");
  assert.equal(result.descriptions[0].sourceRevision, 1);
  assert.match(result.descriptions[0].conversion, /zh-hk/);
  assert.equal(result.provenance.length, 2);
  const wrong = chineseResult(record, entity, { "zh-hk": { ...zhPage, pageprops: { wikibase_item: "Q999" } } });
  assert.equal(wrong.descriptions.length, 0);
  assert.ok(wrong.reasons.includes("zh-hk-entity-identity-mismatch"));
  const mismatch = chineseResult({ ...record, taxonomy: { canonicalName: "Ginkgo genus" } }, entity, { "zh-hk": zhPage });
  assert.equal(mismatch.names.length, 0);
  assert.equal(mismatch.descriptions.length, 0);
  const badUrl = chineseResult(record, entity, { "zh-hk": { ...zhPage, fullurl: "javascript:alert(1)" } });
  assert.equal(badUrl.descriptions.length, 0);
  assert.ok(badUrl.reasons.includes("zh-hk-source-url-rejected"));
});

test("path confinement rejects workspace root and traversal", () => {
  assert.throws(() => withinProject(process.cwd(), "."), /inside/);
  assert.throws(() => withinProject(process.cwd(), "../outside"), /inside/);
});

test("batch acquisition preserves inputs and resumes without network; changed inputs are rejected", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "hk-plant-zh-test-"));
  try {
    await writeFile(path.join(cwd, "input.ndjson"), `${JSON.stringify(record)}\n`);
    let calls = 0;
    const fetchImpl = async url => {
      calls += 1;
      let payload;
      if (url.hostname === "www.wikidata.org") payload = { entities: { Q43284: entity } };
      else if (url.hostname === "en.wikipedia.org") payload = { query: { pages: [{ pageid: 67963, ns: 0, title: "Ginkgo biloba", pageprops: { wikibase_item: "Q43284" }, langlinks: [{ lang: "zh", title: "银杏" }] }] } };
      else payload = { query: { redirects: [{ from: "Ginkgo biloba", to: "银杏" }], pages: [{ ...zhPage, extract: url.searchParams.get("variant") === "zh-cn" ? "简体测试夹具。" : zhPage.extract }] } };
      return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });
    };
    const options = { cwd, inputs: ["input.ndjson"], outDir: "result", fetchImpl, sleep: async () => {} };
    const manifest = await enrichChinese(options);
    assert.equal(manifest.status, "complete");
    assert.equal(manifest.chineseNames, 1);
    assert.equal(manifest.chineseIntroductions, 1);
    assert.equal(calls, 4);
    assert.equal(manifest.publicationEligible, false);
    const enriched = JSON.parse((await readFile(path.join(cwd, "result/records-enriched.ndjson"), "utf8")).trim());
    assert.deepEqual(enriched.regions, record.regions);
    assert.equal(enriched.descriptions.length, 2);
    const resumed = await enrichChinese({ ...options, resume: true, fetchImpl: async () => { throw new Error("network should not run"); } });
    assert.equal(resumed.networkRequestsThisRun, 0);
    await assert.rejects(enrichChinese(options), /resume/);
    await writeFile(path.join(cwd, "input.ndjson"), `${JSON.stringify({ ...record, review: { ...record.review, flags: ["changed"] } })}\n`);
    await assert.rejects(enrichChinese({ ...options, resume: true }), /fingerprint/);
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
