// Offline priority importer. Crop types never masquerade as separate species.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
import { fromGbifSpecies } from "../../tools/plant-import/adapters/gbif-species.mjs";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";
const BASE = "data/plant-import/us-gb-fr-translated-drafts/records-enriched.ndjson";
export const OUT = "data/plant-import/vegetables-priority";
const sha = text => createHash("sha256").update(text).digest("hex");
export const normalize = text => String(text).normalize("NFKC").replace(/×/g, " × ").replace(/\s+/g, " ").trim().toLowerCase();
export function checkMatch(name, match) {
  assert.equal(match.matchType, "EXACT", `Non-exact match ${name}`);
  assert.equal(normalize(match.canonicalName), normalize(name), `Wrong canonical match ${name}`);
  assert.equal(match.kingdom, "Plantae");
  assert.ok(["SPECIES", "SUBSPECIES", "VARIETY", "HYBRID"].includes(match.rank));
  assert.ok(["ACCEPTED", "SYNONYM"].includes(match.status));
  assert.ok(Number.isSafeInteger(match.usageKey) && match.usageKey > 0);
  return match.status === "SYNONYM" ? match.acceptedUsageKey : match.usageKey;
}
async function readJson(file) { try { return JSON.parse(await readFile(file, "utf8")); } catch(e) { if (e.code !== "ENOENT") throw e; return null; } }
export async function cachedJson(url, directory = `${OUT}/raw`) {
  assert.equal(url.protocol, "https:");
  assert.ok(["api.gbif.org", "en.wikipedia.org", "zh.wikipedia.org", "www.wikidata.org", "commons.wikimedia.org"].includes(url.hostname));
  const file = `${directory}/${sha(url.href)}.json`;
  const cached = await readJson(file);
  if (cached) { assert.equal(cached.requestUrl, url.href); assert.ok(!cached.payload.error); return cached.payload; }
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { "User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.6 (https://hkminijungle.com/)", "Api-User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.6" } });
  assert.equal(response.status, 200, `HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(`API ${payload.error.code}: ${payload.error.info}`);
  await mkdir(directory, { recursive: true });
  await writeFile(file, JSON.stringify({ requestUrl: url.href, retrievedAt: new Date().toISOString(), payload }, null, 2));
  return payload;
}
export async function importVegetables() {
  const baseText = await readFile(BASE, "utf8");
  const records = baseText.trim().split(/\r?\n/).map(JSON.parse);
  const priorities = JSON.parse(await readFile("output/plant-data-zh/vegetable-priority.json", "utf8"));
  assert.equal(new Set(priorities.entries.map(c => c.id)).size, priorities.entries.length);
  await mkdir(`${OUT}/raw`, { recursive: true });
  const names = [...new Set(priorities.entries.map(c => c.taxon))];
  const byId = new Map(records.map(r => [r.id, r]));
  const bindings = [];
  for (const name of names) {
    const current = records.find(r => normalize(r.taxonomy.canonicalName) === normalize(name));
    if (current) { bindings.push({ requestedName: name, recordId: current.id, acceptedCanonicalName: current.taxonomy.canonicalName, status: "existing", identityMethod: "existing-exact-canonical" }); continue; }
    try {
      const url = new URL("https://api.gbif.org/v1/species/match");
      url.search = new URLSearchParams({ name, kingdom: "Plantae", strict: "true" }).toString();
      const match = await cachedJson(url);
      const key = checkMatch(name, match);
      assert.ok(Number.isSafeInteger(key) && key > 0, "Missing accepted taxon key");
      const raw = await cachedJson(new URL(`https://api.gbif.org/v1/species/${key}`));
      assert.equal(raw.key, key);
      assert.equal(raw.kingdom, "Plantae");
      assert.equal(raw.taxonomicStatus, "ACCEPTED");
      if (match.status === "ACCEPTED") assert.equal(normalize(raw.canonicalName), normalize(name));
      const rawEvidence = await readJson(`${OUT}/raw/${sha(`https://api.gbif.org/v1/species/${key}`)}.json`);
      const record = fromGbifSpecies(raw, { retrievedAt: rawEvidence.retrievedAt });
      assert.ok(validatePlantRecord(record).ok);
      record.review.flags.push("crop-type-and-horticultural-editorial-review-required");
      if (!byId.has(record.id)) byId.set(record.id, record);
      bindings.push({ requestedName: name, recordId: record.id, acceptedCanonicalName: raw.canonicalName, status: "resolved", identityMethod: match.status === "SYNONYM" ? "GBIF-exact-synonym-acceptedUsageKey" : "GBIF-exact-accepted", matchUsageKey: match.usageKey, acceptedKey: key, evidenceUrl: url.href });
    } catch (e) { bindings.push({ requestedName: name, status: "unresolved", error: e.message }); }
    console.error(`taxonomy=${bindings.length}/${names.length} resolved=${bindings.filter(b => b.recordId).length}`);
    await writeFile(`${OUT}/taxonomy-bindings.json`, JSON.stringify(bindings, null, 2));
  }
  const crops = priorities.entries.map(crop => {
    const binding = bindings.find(b => b.requestedName === crop.taxon);
    return { ...crop, cropRecordId: `crop:${crop.id}`, taxonRecordId: binding?.recordId || null, acceptedCanonicalName: binding?.acceptedCanonicalName || null, taxonomyStatus: binding?.recordId ? "linked" : "unresolved", editorialPriorityMarkets: priorities.scope, marketOccurrenceVerified: false, chineseLabelStatus: "editorial-checklist-label-not-imported-vernacular-name", knowledgeStatus: "source-collection-pending", professionalReviewCompleted: false };
  });
  const merged = [...byId.values()];
  assert.ok(merged.every(r => validatePlantRecord(r).ok));
  assert.equal(new Set(merged.map(r => r.slug)).size, merged.length, "Slug collision");
  assert.equal(sha(await readFile(BASE, "utf8")), sha(baseText));
  for (const original of records) assert.deepEqual(byId.get(original.id), original);
  await writeFile(`${OUT}/records-enriched.ndjson`, `${merged.map(r => JSON.stringify(r)).join("\n")}\n`);
  const vegetableIds = new Set(bindings.filter(b=>b.recordId).map(b=>b.recordId));
  await writeFile(`${OUT}/vegetable-taxa.ndjson`, `${merged.filter(r=>vegetableIds.has(r.id)).map(r=>JSON.stringify(r)).join("\n")}\n`);
  await writeFile(`${OUT}/crop-profiles.json`, JSON.stringify(crops, null, 2));
  const report = { generatedAt: new Date().toISOString(), status: bindings.some(b => !b.recordId) ? "partial-taxonomy" : "taxonomy-baseline-complete-knowledge-pending", inputSha256: sha(baseText), inputRecords: records.length, outputRecords: merged.length, newTaxa: merged.length-records.length, cropTypes: crops.length, requestedTaxa: names.length, resolvedTaxa: bindings.filter(b => b.recordId).length, unresolved: bindings.filter(b => !b.recordId), cropTypesLinked: crops.filter(c => c.taxonRecordId).length, publicWebsiteChanged: false, fullKnowledgeCompleted: false, professionalReviewCompleted: false, publicationEligible: false };
  await writeFile(`${OUT}/manifest.json`, JSON.stringify(report, null, 2));
  return report;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) importVegetables().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => { console.error(e.stack); process.exitCode=1; });
