// Offline translation staging only. Never imported into the archived website.
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { matchesScientificName, scientificKey } from "./enrich-chinese.mjs";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";
const INPUT = "data/plant-import/chinese-enrichment/records-enriched.ndjson";
const OUT = "data/plant-import/us-gb-fr-translated-drafts";
const DRAFTS = "output/plant-data-zh/region-translation-drafts.json";
const hash = text => createHash("sha256").update(text).digest("hex");
const WARNINGS = { "zh-hk": "中文譯編草稿，未經植物學及安全性專業審校；不構成食用、藥用或種植建議。", "zh-cn": "中文译编草稿，未经植物学及安全性专业审校；不构成食用、药用或种植建议。" };
const hasChineseText = record => record.descriptions.some(description => description.language.startsWith("zh"));

export function identityEvidence(record, entity, synonymPayload) {
  const canonical = record.taxonomy.canonicalName;
  if (matchesScientificName(entity, canonical)) return { method: "exact-article-P225", entityId: entity.id };
  for (const claim of entity?.claims?.P225 || []) {
    if (claim.rank === "deprecated" || claim.mainsnak?.snaktype !== "value") continue;
    const name = claim.mainsnak.datavalue?.value;
    if (typeof name !== "string") continue;
    const hybrid = scientificKey(name);
    const scientific = scientificKey(record.taxonomy.scientificName);
    if (hybrid.includes("×") && scientificKey(name.replace(/×/g, " ")) === scientificKey(canonical) && (scientific === hybrid || scientific.startsWith(`${hybrid} `))) {
      return { method: "GBIF-explicit-hybrid-scientific-name", entityId: entity.id, sourceScientificName: name };
    }
    const acceptedKey = Number(record.id.replace("gbif-species:", ""));
    const synonym = synonymPayload?.results?.find(row => row.taxonomicStatus === "SYNONYM" && row.acceptedKey === acceptedKey && scientificKey(row.canonicalName) === scientificKey(name));
    if (synonym) return { method: "GBIF-explicit-accepted-synonym", entityId: entity.id, synonymKey: synonym.key, acceptedKey, sourceScientificName: name, evidenceUrl: `https://api.gbif.org/v1/species/${acceptedKey}/synonyms` };
  }
  throw new Error(`Unconfirmed article identity: ${canonical}`);
}

export function translatedDescriptions(record, draft, source, revision, evidence) {
  assert.equal(draft.name, record.taxonomy.canonicalName);
  assert.equal(source.language, "en");
  assert.equal(source.rights, "CC BY-SA 4.0");
  const url = new URL(source.sourcePage);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "en.wikipedia.org");
  assert.ok(Number.isSafeInteger(revision) && revision > 0, "Source revision is required");
  return ["zh-hk", "zh-cn"].map(language => {
    assert.ok(typeof draft[language] === "string" && /[\u3400-\u9fff]/u.test(draft[language]), `Missing translated text ${draft.name}/${language}`);
    return { language, section: "overview", text: `${draft[language]}\n\n${WARNINGS[language]}`, sourceId: "wikipedia-en", sourcePage: source.sourcePage, sourceRevision: revision, sourceTextSha256: hash(source.text), rights: "CC BY-SA 4.0", derivation: "assistant-translated-summary", originalLanguage: "en", reviewState: "machine-normalized", editorialReviewRequired: true, adapted: true, safetyReviewRequired: /poison|toxic|cyanogenic|allergic/i.test(source.text), identityEvidence: evidence };
  });
}

async function readRecords(file) { return (await readFile(file, "utf8")).trim().split(/\r?\n/).map(JSON.parse); }
async function loadRaw(directory) {
  const files = (await readdir(directory)).filter(file => file.endsWith(".json"));
  return Promise.all(files.map(async file => JSON.parse(await readFile(path.join(directory, file), "utf8"))));
}

export async function stageRegionTranslations() {
  const inputText = await readFile(INPUT, "utf8");
  const draftPayload = JSON.parse(await readFile(DRAFTS, "utf8"));
  assert.equal(hash(inputText), draftPayload.inputSha256, "Input changed since source text was read");
  assert.equal(draftPayload.status, "assistant-translated-summary-draft-not-editor-reviewed");
  const records = inputText.trim().split(/\r?\n/).map(JSON.parse);
  const targets = records.filter(record => record.regions.some(region => ["US", "GB", "FR"].includes(region.code)) && !hasChineseText(record));
  const drafts = new Map(draftPayload.entries.map(draft => [draft.name, draft]));
  assert.equal(drafts.size, draftPayload.entries.length, "Duplicate drafts");
  assert.deepEqual([...drafts.keys()].sort(), targets.map(record => record.taxonomy.canonicalName).sort(), "Drafts do not match missing region records");
  const articleInfo = new Map();
  const entities = new Map();
  for (const raw of await loadRaw("data/plant-import/chinese-enrichment/raw")) {
    if (new URL(raw.requestUrl).hostname === "en.wikipedia.org") for (const page of raw.payload.query?.pages || []) if (page.fullurl && page.pageprops?.wikibase_item) articleInfo.set(page.fullurl, page);
    for (const entity of Object.values(raw.payload.entities || {})) entities.set(entity.id, entity);
  }
  const sourceSnapshots = new Map();
  for (const directory of ["data/plant-import/gbif-tracheophyta/wikimedia-enrichment/raw/wikipedia", "data/plant-import/gbif-regions/wikimedia-enrichment/raw/wikipedia"]) {
    for (const payload of await loadRaw(directory)) for (const page of payload.query?.pages || []) {
      if (page.fullurl && page.extract && page.lastrevid) sourceSnapshots.set(`${page.fullurl}|${hash(page.extract.trim())}`, page);
    }
  }
  await mkdir(path.join(OUT, "raw", "gbif-synonyms"), { recursive: true });
  const synonymPayloads = new Map();
  for (const key of [11071158, 5364245]) {
    const file = path.join(OUT, "raw", "gbif-synonyms", `${key}.json`);
    let raw;
    try { raw = JSON.parse(await readFile(file, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
    if (!raw) {
      const url = `https://api.gbif.org/v1/species/${key}/synonyms?limit=100`;
      const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { "User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.5 (https://hkminijungle.com/)" } });
      assert.equal(response.status, 200, "GBIF synonym request failed");
      raw = { requestUrl: url, retrievedAt: new Date().toISOString(), payload: await response.json() };
      assert.equal(raw.payload.endOfRecords, true, "Incomplete GBIF synonym page");
      await writeFile(file, JSON.stringify(raw, null, 2));
    }
    synonymPayloads.set(key, raw.payload);
  }
  const byId = new Map();
  const auditRows = [];
  for (const record of targets) {
    const source = record.descriptions.find(description => description.language === "en" && description.section === "overview");
    assert.ok(source, "Missing English source");
    const sourcePage = sourceSnapshots.get(`${source.sourcePage}|${hash(source.text)}`);
    assert.ok(sourcePage, `Original extract snapshot missing for ${record.id}`);
    const info = articleInfo.get(source.sourcePage);
    const entity = entities.get(info?.pageprops?.wikibase_item);
    const evidence = identityEvidence(record, entity, synonymPayloads.get(Number(record.id.split(":")[1])));
    const descriptions = translatedDescriptions(record, drafts.get(record.taxonomy.canonicalName), source, sourcePage.lastrevid, evidence);
    const next = { ...record, descriptions: [...record.descriptions, ...descriptions], review: { ...record.review, flags: [...new Set([...record.review.flags, "assistant-translated-summary-not-editor-reviewed"])] } };
    assert.deepEqual(next.taxonomy, record.taxonomy);
    assert.deepEqual(next.names, record.names);
    assert.deepEqual(next.media, record.media);
    assert.deepEqual(next.regions, record.regions);
    assert.deepEqual(next.descriptions.filter(description => description.derivation !== "assistant-translated-summary"), record.descriptions);
    assert.ok(validatePlantRecord(next).ok);
    byId.set(record.id, next);
    auditRows.push({ id: record.id, canonicalName: record.taxonomy.canonicalName, sourcePage: source.sourcePage, sourceTextSha256: hash(source.text), sourceRevision: sourcePage.lastrevid, identityEvidence: evidence, originalText: source.text, drafts: descriptions });
  }
  const merged = records.map(record => byId.get(record.id) || record);
  assert.equal(new Set(merged.map(record => record.id)).size, records.length);
  await writeFile(path.join(OUT, "records-enriched.ndjson"), `${merged.map(record => JSON.stringify(record)).join("\n")}\n`);
  await writeFile(path.join(OUT, "translation-review.json"), JSON.stringify(auditRows, null, 2));
  const counts = selected => ({ records: selected.length, chineseSourceIntroductions: selected.filter(record => record.descriptions.some(description => description.language.startsWith("zh") && description.sourceId === "wikipedia-zh")).length, translatedDraftProfiles: selected.filter(record => record.descriptions.some(description => description.derivation === "assistant-translated-summary")).length, anyChineseIntroductions: selected.filter(hasChineseText).length, images: selected.filter(record => record.media.length).length });
  const report = { status: "staged-drafts", generatedAt: new Date().toISOString(), inputSha256: hash(inputText), input: INPUT, output: OUT, translatedProfiles: targets.length, translatedTextFields: auditRows.length * 2, identityMethods: Object.fromEntries([...new Set(auditRows.map(row => row.identityEvidence.method))].map(method => [method, auditRows.filter(row => row.identityEvidence.method === method).length])), fullCatalog: counts(merged), regions: Object.fromEntries(["US", "GB", "FR"].map(code => [code, counts(merged.filter(record => record.regions.some(region => region.code === code)))])), publicationEligible: false, professionalReviewCompleted: false, sourceTextAdapted: true, noChineseNamesInvented: true, websiteChanged: false, notes: ["Chinese original source extracts and assistant translated summaries are distinct", "Text claims and translations are draft adaptations, not professional horticultural or safety advice", "Archived plant-library public entry points remain unchanged"] };
  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(report, null, 2));
  // Independently re-read output; neither a schema check nor this audit certifies semantics.
  const reread = await readRecords(path.join(OUT, "records-enriched.ndjson"));
  assert.equal(reread.length, records.length);
  assert.ok(reread.every(record => validatePlantRecord(record).ok));
  assert.equal(hash(await readFile(INPUT, "utf8")), draftPayload.inputSha256);
  return report;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) stageRegionTranslations().then(report => console.log(JSON.stringify(report, null, 2))).catch(error => { console.error(error.stack); process.exitCode = 1; });
