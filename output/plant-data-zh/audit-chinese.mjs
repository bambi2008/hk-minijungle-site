// Offline integrity audit; does not modify or publish the website.
import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { deduplicatePlantRecords, validatePlantRecord } from "../../tools/plant-import/schema.mjs";
import { matchesScientificName } from "./enrich-chinese.mjs";

const directory = "data/plant-import/chinese-enrichment";
const manifest = JSON.parse(await readFile(path.join(directory, "manifest.json"), "utf8"));
assert.equal(manifest.status, "complete", "A completed download is required");
const results = JSON.parse(await readFile(path.join(directory, "results.json"), "utf8"));
const readRecords = async file => (await readFile(file, "utf8")).split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
const records = await readRecords(path.join(directory, "records-enriched.ndjson"));
const inputs = deduplicatePlantRecords((await Promise.all(manifest.inputs.map(input => readRecords(input.input)))).flat()).records;
const originals = new Map(inputs.map(record => [record.id, record]));
const resultMap = new Map(results.map(result => [result.recordId, result]));
const entities = new Map();
const chinesePages = new Map();
const rawFiles = await readdir(path.join(directory, "raw"));
for (const file of rawFiles.filter(file => file.endsWith(".json"))) {
  const response = JSON.parse(await readFile(path.join(directory, "raw", file), "utf8"));
  const url = new URL(response.requestUrl);
  assert.ok(["en.wikipedia.org", "zh.wikipedia.org", "www.wikidata.org"].includes(url.hostname));
  assert.equal(url.protocol, "https:");
  assert.equal(file, `${createHash("sha256").update(response.requestUrl).digest("hex")}.json`);
  for (const entity of Object.values(response.payload.entities || {})) entities.set(entity.id, entity);
  if (url.hostname === "zh.wikipedia.org") {
    for (const page of response.payload.query?.pages || []) {
      if (page.pageid) chinesePages.set(`${page.pageid}|${page.lastrevid}|${url.searchParams.get("variant")}`, page);
    }
  }
}
assert.equal(records.length, manifest.inputRecords);
assert.equal(results.length, records.length);
assert.equal(new Set(records.map(record => record.id)).size, records.length);
let verifiedEntities = 0;
let verifiedDescriptions = 0;
let verifiedNames = 0;
let addedIntroductionsWithoutEnglish = 0;
for (const record of records) {
  assert.ok(validatePlantRecord(record).ok, `${record.id} schema invalid`);
  const original = originals.get(record.id);
  const result = resultMap.get(record.id);
  assert.ok(original && result, `${record.id} missing input/result`);
  assert.deepEqual(record.taxonomy, original.taxonomy);
  assert.deepEqual(record.regions, original.regions);
  assert.deepEqual(record.media, original.media);
  assert.deepEqual(record.descriptions.filter(item => item.sourceId !== "wikipedia-zh"), original.descriptions);
  assert.equal(record.review.state, original.review.state);
  if (result.entityId) {
    assert.ok(matchesScientificName(entities.get(result.entityId), record.taxonomy.canonicalName), `${record.id} exact P225 mismatch`);
    verifiedEntities += 1;
  }
  for (const name of result.names) {
    assert.ok(result.entityId && name.language.startsWith("zh") && name.value);
    const source = new URL(name.sourcePage);
    assert.equal(source.protocol, "https:");
    assert.ok(["zh.wikipedia.org", "www.wikidata.org"].includes(source.hostname));
    assert.ok(record.names.some(item => item.language === name.language && item.value === name.value && item.sourceId === name.sourceId));
    verifiedNames += 1;
  }
  for (const description of result.descriptions) {
    assert.ok(["zh-hk", "zh-cn"].includes(description.language));
    assert.equal(description.rights, "CC BY-SA 4.0");
    assert.equal(description.sourceId, "wikipedia-zh");
    assert.equal(new URL(description.sourcePage).hostname, "zh.wikipedia.org");
    assert.ok(description.text && Number.isSafeInteger(description.sourceRevision) && description.sourceRevision > 0);
    assert.match(description.conversion, /Wikimedia LanguageConverter zh-/);
    const attribution = result.provenance.find(source => source.sourceId === "wikipedia-zh" && source.url === description.sourcePage);
    assert.ok(attribution, `${record.id} missing article attribution`);
    const rawPage = chinesePages.get(`${attribution.recordId}|${description.sourceRevision}|${description.language}`);
    assert.ok(rawPage, `${record.id} missing original Chinese API response`);
    assert.equal(rawPage.pageprops?.wikibase_item, result.entityId, `${record.id} Chinese article entity mismatch`);
    assert.equal(rawPage.extract?.trim(), description.text, `${record.id} source extract changed`);
    verifiedDescriptions += 1;
  }
  if (result.descriptions.length && !original.descriptions.some(description => description.language === "en")) addedIntroductionsWithoutEnglish += 1;
}
const report = {
  verifiedAt: new Date().toISOString(),
  status: "passed",
  records: records.length,
  uniqueIds: new Set(records.map(record => record.id)).size,
  chineseNames: results.filter(result => result.names.length).length,
  chineseIntroductions: results.filter(result => result.descriptions.length).length,
  verifiedEntities,
  verifiedNameFields: verifiedNames,
  verifiedDescriptionFields: verifiedDescriptions,
  rawResponses: rawFiles.filter(file => file.endsWith(".json")).length,
  addedIntroductionsWithoutEnglish,
  missingChineseNames: results.filter(result => !result.names.length).length,
  missingChineseIntroductions: results.filter(result => !result.descriptions.length).length,
  perRegion: Object.fromEntries(["DE", "US", "HK", "CN", "GB", "FR"].map(code => {
    const selected = records.filter(record => record.regions.some(region => region.code === code));
    return [code, { records: selected.length, chineseNames: selected.filter(record => resultMap.get(record.id).names.length).length, chineseIntroductions: selected.filter(record => resultMap.get(record.id).descriptions.length).length }];
  })),
  preserved: ["taxonomy", "regional evidence", "English source text", "media and attribution", "review state"],
  publicationEligible: false,
  websiteChanged: false,
  limitations: ["Machine identity checks are not an editorial botanical review", "Missing strategy brief blocks website source integration", "Previously required standard security launcher has not produced a scanId"],
};
await writeFile(path.join(directory, "integrity-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
