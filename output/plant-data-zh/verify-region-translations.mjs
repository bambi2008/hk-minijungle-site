// Independent offline evidence check; does not certify translation semantics.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import path from "node:path";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";
import { stageRegionTranslations } from "./stage-region-translations.mjs";
const input = "data/plant-import/chinese-enrichment/records-enriched.ndjson";
const out = "data/plant-import/us-gb-fr-translated-drafts";
const output = `${out}/records-enriched.ndjson`;
const sha = value => createHash("sha256").update(value).digest("hex");
const beforeText = await readFile(input, "utf8");
const afterText = await readFile(output, "utf8");
const parse = text => text.trim().split(/\r?\n/).map(JSON.parse);
const before = parse(beforeText), after = parse(afterText);
const review = JSON.parse(await readFile(`${out}/translation-review.json`, "utf8"));
const manifest = JSON.parse(await readFile(`${out}/manifest.json`, "utf8"));
assert.equal(before.length, 1439);
assert.equal(after.length, before.length);
assert.equal(new Set(after.map(r => r.id)).size, 1439);
assert.equal(new Set(after.map(r => r.slug)).size, 1439);
assert.equal(sha(beforeText), manifest.inputSha256);
const sourceSnapshots = new Map();
for (const directory of ["data/plant-import/gbif-tracheophyta/wikimedia-enrichment/raw/wikipedia", "data/plant-import/gbif-regions/wikimedia-enrichment/raw/wikipedia"]) {
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".json")) continue;
    const payload = JSON.parse(await readFile(path.join(directory, file), "utf8"));
    for (const p of payload.query?.pages || []) if (p.extract && p.fullurl) sourceSnapshots.set(`${p.fullurl}|${sha(p.extract.trim())}`, p);
  }
}
const articleQ = new Map(), entities = new Map();
for (const file of await readdir("data/plant-import/chinese-enrichment/raw")) {
  if (!file.endsWith(".json")) continue;
  const raw = JSON.parse(await readFile(`data/plant-import/chinese-enrichment/raw/${file}`, "utf8"));
  if (new URL(raw.requestUrl).hostname === "en.wikipedia.org") for (const p of raw.payload.query?.pages || []) articleQ.set(p.fullurl, p.pageprops?.wikibase_item);
  for (const e of Object.values(raw.payload.entities || {})) entities.set(e.id, e);
}
const normalize = value => value.normalize("NFKC").replace(/×/g, " × ").replace(/\s+/g, " ").trim().toLowerCase();
let changed = 0, translatedFields = 0;
const methods = {};
for (let i = 0; i < before.length; i++) {
  const b = before[i], a = after[i];
  assert.equal(a.id, b.id);
  assert.ok(validatePlantRecord(a).ok, `Schema ${a.id}`);
  const added = a.descriptions.slice(b.descriptions.length);
  if (!added.length) { assert.deepEqual(a, b); continue; }
  changed++;
  assert.ok(b.regions.some(r => ["US", "GB", "FR"].includes(r.code)));
  assert.ok(!b.descriptions.some(d => d.language.startsWith("zh")));
  assert.equal(added.length, 2);
  assert.deepEqual(added.map(d => d.language), ["zh-hk", "zh-cn"]);
  assert.deepEqual(a.descriptions.slice(0, b.descriptions.length), b.descriptions);
  const { descriptions: bd, review: br, ...baseFields } = b;
  const { descriptions: ad, review: ar, ...nextFields } = a;
  assert.deepEqual(nextFields, baseFields, `Original fields changed ${a.id}`);
  assert.deepEqual(ar, { ...br, flags: [...new Set([...br.flags, "assistant-translated-summary-not-editor-reviewed"])] });
  const source = b.descriptions.find(d => d.language === "en" && d.section === "overview");
  const sourceHash = sha(source.text);
  const snapshot = sourceSnapshots.get(`${source.sourcePage}|${sourceHash}`);
  assert.ok(snapshot, `Actual source extract ${a.id}`);
  const row = review.find(row => row.id === a.id);
  assert.equal(row.originalText, source.text);
  assert.equal(row.sourceTextSha256, sourceHash);
  assert.equal(row.sourceRevision, snapshot.lastrevid);
  assert.deepEqual(row.drafts, added);
  const evidence = added[0].identityEvidence;
  assert.equal(evidence.entityId, articleQ.get(source.sourcePage));
  const names = (entities.get(evidence.entityId)?.claims?.P225 || []).filter(c => c.rank !== "deprecated" && c.mainsnak?.snaktype === "value").map(c => c.mainsnak.datavalue.value);
  if (evidence.method === "exact-article-P225") {
    assert.ok(names.some(n => normalize(n) === normalize(a.taxonomy.canonicalName)));
  } else if (evidence.method === "GBIF-explicit-hybrid-scientific-name") {
    assert.ok(names.includes(evidence.sourceScientificName));
    assert.ok(evidence.sourceScientificName.includes("×"));
    assert.equal(normalize(evidence.sourceScientificName.replace(/×/g, " ")), normalize(a.taxonomy.canonicalName));
    const scientific = normalize(a.taxonomy.scientificName), hybrid = normalize(evidence.sourceScientificName);
    assert.ok(scientific === hybrid || scientific.startsWith(`${hybrid} `));
  } else {
    assert.equal(evidence.method, "GBIF-explicit-accepted-synonym");
    assert.ok(names.includes(evidence.sourceScientificName));
    const raw = JSON.parse(await readFile(`${out}/raw/gbif-synonyms/${evidence.acceptedKey}.json`, "utf8"));
    assert.equal(raw.requestUrl, `https://api.gbif.org/v1/species/${evidence.acceptedKey}/synonyms?limit=100`);
    assert.equal(raw.payload.endOfRecords, true);
    assert.ok(raw.payload.results.some(r => r.key === evidence.synonymKey && r.taxonomicStatus === "SYNONYM" && r.acceptedKey === evidence.acceptedKey && normalize(r.canonicalName) === normalize(evidence.sourceScientificName)));
    assert.equal(a.id, `gbif-species:${evidence.acceptedKey}`);
  }
  methods[evidence.method] = (methods[evidence.method] || 0) + 1;
  for (const d of added) {
    translatedFields++;
    assert.equal(d.sourceTextSha256, sourceHash);
    assert.equal(d.sourceRevision, snapshot.lastrevid);
    assert.equal(d.sourcePage, source.sourcePage);
    assert.equal(d.sourceId, "wikipedia-en");
    assert.equal(d.rights, "CC BY-SA 4.0");
    assert.equal(d.derivation, "assistant-translated-summary");
    assert.equal(d.originalLanguage, "en");
    assert.equal(d.reviewState, "machine-normalized");
    assert.equal(d.editorialReviewRequired, true);
    assert.equal(d.adapted, true);
    assert.equal(d.safetyReviewRequired, /poison|toxic|cyanogenic|allergic/i.test(source.text));
    assert.match(d.text, /草稿/);
    assert.deepEqual(d.identityEvidence, evidence);
  }
}
assert.equal(changed, 53);
assert.equal(translatedFields, 106);
assert.equal(review.length, 53);
assert.deepEqual(methods, manifest.identityMethods);
const chineseName = n => /^(zh(?:[-_].*)?|zho|chi|cmn|yue)$/i.test(n.language) && /[\u3400-\u9fff]/u.test(n.value);
const counts = rows => ({ records: rows.length, chineseSourceIntroductions: rows.filter(r => r.descriptions.some(d => d.sourceId === "wikipedia-zh" && d.language.startsWith("zh"))).length, translatedDraftProfiles: rows.filter(r => r.descriptions.some(d => d.derivation === "assistant-translated-summary")).length, anyChineseIntroductions: rows.filter(r => r.descriptions.some(d => d.language.startsWith("zh"))).length, images: rows.filter(r => r.media.length).length });
assert.deepEqual(counts(after), manifest.fullCatalog);
assert.equal(after.filter(r => r.names.some(chineseName)).length, 865);
for (const [code, expected] of Object.entries(manifest.regions)) assert.deepEqual(counts(after.filter(r => r.regions.some(region => region.code === code))), expected);
assert.equal(manifest.publicationEligible, false);
assert.equal(manifest.professionalReviewCompleted, false);
// A real resume must not request the network and must produce identical records.
let networkCalls = 0;
globalThis.fetch = async () => { networkCalls++; throw new Error("Network forbidden during cache-only resume"); };
await stageRegionTranslations();
assert.equal(networkCalls, 0);
assert.equal(sha(await readFile(output, "utf8")), sha(afterText));
assert.equal(sha(await readFile(input, "utf8")), sha(beforeText));
const report = { status: "passed-offline-integrity-not-professional-review", verifiedAt: new Date().toISOString(), records: after.length, uniqueIds: after.length, uniqueSlugs: after.length, schemaInvalid: 0, appendOnlyProfiles: changed, translatedFields, identityMethods: methods, inputSha256: sha(beforeText), outputSha256: sha(afterText), originalSourceFieldsUnchanged: true, sourceExtractRevisionAndHashVerified: true, chineseNames: 865, fullCatalog: counts(after), regions: manifest.regions, resumeNetworkCalls: networkCalls, resumeRecordsHashUnchanged: true, professionalReviewCompleted: false, browserQAApplicable: false, websiteIntegrationVerified: false, standardSecurityScanCompleted: false };
await writeFile(`${out}/integrity-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
