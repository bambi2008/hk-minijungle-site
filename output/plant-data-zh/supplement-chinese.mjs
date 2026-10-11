// Targeted offline supplement, independent from the website runtime and v1 batch.
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chineseResult, matchesScientificName, resolvePages, wikipediaUrl, withinProject } from "./enrich-chinese.mjs";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";

const BASE = "data/plant-import/chinese-enrichment/records-enriched.ndjson";
const OUT = "data/plant-import/chinese-supplement";
const hash = value => createHash("sha256").update(value).digest("hex");
export const isChineseName = name => (/^zh/.test(name.language || "") || ["chi", "cmn", "yue"].includes(name.language)) && /[\u3400-\u9fff]/u.test(name.value || "");
export const hasChineseName = record => record.names.some(isChineseName);
const unique = values => [...new Set(values)];
export function appendUnique(original, additions, key) {
  const result = [...original];
  const seen = new Set(original.map(key));
  for (const item of additions) if (!seen.has(key(item))) { seen.add(key(item)); result.push(item); }
  return result;
}
export function selectExactEntity(entities, scientificName) {
  const matches = entities.filter(entity => matchesScientificName(entity, scientificName));
  return matches.length === 1 ? matches[0] : null;
}
export function withChineseAliases(record, entity, pages) {
  const result = chineseResult(record, entity, pages);
  if (!matchesScientificName(entity, record.taxonomy.canonicalName)) return result;
  result.identityMethod = result.descriptions.length ? "exact-P225-and-matching-Wikipedia-wikibase-item" : "exact-P225";
  const aliases = Object.entries(entity.aliases || {}).flatMap(([language, values]) => values.map(value => ({ value: value.value, language, type: "common", region: "", sourceId: "wikidata", sourcePage: `https://www.wikidata.org/wiki/${entity.id}`, sourceField: "alias", sourceRevision: entity.lastrevid }))).filter(isChineseName);
  result.names = appendUnique(result.names, aliases, name => `${name.language}|${name.value}|${name.sourceId}`);
  return result;
}

async function json(file) { try { return JSON.parse(await readFile(file, "utf8")); } catch (error) { if (error.code === "ENOENT") return null; throw error; } }
async function save(file, value) { await writeFile(`${file}.tmp`, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`); await rename(`${file}.tmp`, file); }
async function mapLimit(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => { while (next < items.length) { const i = next++; results[i] = await fn(items[i]); } }));
  return results;
}
function dataUrl(parameters) {
  const url = new URL("https://www.wikidata.org/w/api.php");
  for (const [key, value] of Object.entries({ format: "json", formatversion: "2", maxlag: "5", ...parameters })) url.searchParams.set(key, value);
  return url;
}

export async function supplementChinese(options = {}) {
  const cwd = options.cwd || process.cwd();
  const inputPath = withinProject(cwd, options.input || BASE);
  const outputPath = withinProject(cwd, options.outDir || OUT);
  const text = await readFile(inputPath, "utf8");
  const fingerprint = hash(text);
  const records = text.split(/\r?\n/).filter(Boolean).map(JSON.parse);
  if (new Set(records.map(record => record.id)).size !== records.length || records.some(record => !validatePlantRecord(record).ok)) throw new Error("Input identities/schema invalid");
  const targets = records.filter(record => !hasChineseName(record));
  await mkdir(path.join(outputPath, "raw"), { recursive: true });
  const previous = await json(path.join(outputPath, "manifest.json"));
  if (previous && !options.resume) throw new Error("Output exists; use --resume");
  if (previous && previous.inputFingerprint !== fingerprint) throw new Error("Input fingerprint changed");
  const saved = await json(path.join(outputPath, "results.json")) || [];
  const results = new Map(saved.map(result => [result.recordId, result]));
  const targetMap = new Map(targets.map(record => [record.id, record]));
  if (saved.some(result => targetMap.get(result.recordId)?.taxonomy.canonicalName !== result.canonicalName)) throw new Error("Saved identities differ from targets");
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const sleep = options.sleep || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  let requests = 0;
  let cooldown = 0;
  const startedAt = previous?.startedAt || new Date().toISOString();

  async function request(url) {
    if (url.protocol !== "https:" || !["www.wikidata.org", "zh.wikipedia.org"].includes(url.hostname) || url.pathname !== "/w/api.php") throw new Error("Unapproved API endpoint");
    const file = path.join(outputPath, "raw", `${hash(url.href)}.json`);
    const cached = await json(file);
    if (cached) return cached.payload;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      if (cooldown > Date.now()) await sleep(Math.min(cooldown - Date.now(), 30000));
      try {
        requests += 1;
        const response = await fetchImpl(url, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { Accept: "application/json", "Accept-Encoding": "gzip,deflate", "User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.4 (https://hkminijungle.com/)", "Api-User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.4" } });
        if (response.status === 429) cooldown = Date.now() + Math.min(Math.max(Number(response.headers.get("retry-after")) || 5, 1) * 1000, 30000);
        if (!response.ok) { const error = new Error(`API HTTP ${response.status}`); error.permanent = response.status < 500 && response.status !== 429; throw error; }
        const payload = await response.json();
        if (payload.error) { if (payload.error.code === "maxlag") cooldown = Date.now() + 5000; throw new Error(`API ${payload.error.code}`); }
        if (payload.continue) throw new Error("Unexpected pagination, refusing partial results");
        await save(file, { requestUrl: url.href, retrievedAt: new Date().toISOString(), payload });
        return payload;
      } catch (error) { if (error.permanent || attempt === 3) throw error; await sleep(Math.min(500 * 2 ** attempt, 4000)); }
    }
  }
  async function checkpoint(status, error) {
    const all = [...results.values()];
    const manifest = { status, inputRecords: records.length, targetRecords: targets.length, processedTargets: all.length, inputFingerprint: fingerprint, input: path.relative(cwd, inputPath), chineseNamesBefore: records.filter(hasChineseName).length, introductionsBefore: records.filter(record => record.descriptions.some(description => description.language.startsWith("zh"))).length, newlyNamed: all.filter(result => result.names.some(isChineseName)).length, supplementIntroductions: all.filter(result => result.descriptions.length).length, exactEntities: all.filter(result => result.entityId).length, networkRequestsThisRun: requests, startedAt, updatedAt: new Date().toISOString(), publicationEligible: false, websiteChanged: false, ...(error ? { error } : {}) };
    await save(path.join(outputPath, "results.json"), all);
    await save(path.join(outputPath, "manifest.json"), manifest);
    return manifest;
  }
  try {
    const pending = targets.filter(record => !results.has(record.id));
    for (let offset = 0; offset < pending.length; offset += 20) {
      const batch = pending.slice(offset, offset + 20);
      const searches = await mapLimit(batch.filter(record => !record.chineseEnrichment?.entityId), 3, async record => ({ record, payload: await request(dataUrl({ action: "wbsearchentities", search: record.taxonomy.canonicalName, language: "en", type: "item", limit: "3" })) }));
      const candidateIds = new Map(searches.map(({ record, payload }) => [record.id, (payload.search || []).map(item => item.id).filter(id => /^Q\d+$/.test(id))]));
      for (const record of batch) if (/^Q\d+$/.test(record.chineseEnrichment?.entityId || "")) candidateIds.set(record.id, [record.chineseEnrichment.entityId]);
      const ids = unique([...candidateIds.values()].flat());
      const entityMap = {};
      for (let i = 0; i < ids.length; i += 50) Object.assign(entityMap, (await request(dataUrl({ action: "wbgetentities", ids: ids.slice(i, i + 50).join("|"), props: "info|claims|labels|aliases|sitelinks", languages: "zh|zh-hant|zh-hans|zh-hk|zh-cn|zh-tw|zh-mo" }))).entities || {});
      const selected = new Map(batch.map(record => [record.id, selectExactEntity((candidateIds.get(record.id) || []).map(id => entityMap[id]), record.taxonomy.canonicalName)]));
      const titles = unique([...selected.values()].map(entity => entity?.sitelinks?.zhwiki?.title).filter(Boolean));
      const pageMaps = {};
      for (const variant of ["zh-hk", "zh-cn"]) pageMaps[variant] = titles.length ? resolvePages(titles, await request(wikipediaUrl(titles, variant))) : new Map();
      for (const record of batch) {
        const entity = selected.get(record.id);
        const title = entity?.sitelinks?.zhwiki?.title;
        results.set(record.id, withChineseAliases(record, entity, { "zh-hk": pageMaps["zh-hk"].get(title), "zh-cn": pageMaps["zh-cn"].get(title) }));
      }
      options.onProgress?.(await checkpoint("in-progress"));
    }
    const merged = records.map(record => {
      const result = results.get(record.id);
      if (!result) return record;
      return { ...record, names: appendUnique(record.names, result.names, item => `${item.language}|${item.value}|${item.sourceId}`), descriptions: appendUnique(record.descriptions, result.descriptions, item => `${item.language}|${item.section}|${item.sourceId}`), provenance: appendUnique(record.provenance, result.provenance, item => `${item.sourceId}|${item.recordId}`), chineseSupplement: { entityId: result.entityId, identityMethod: result.identityMethod, reasons: result.reasons, retrievedAt: result.retrievedAt } };
    });
    if (merged.some(record => !validatePlantRecord(record).ok)) throw new Error("Supplement schema validation failed");
    await save(path.join(outputPath, "records-enriched.ndjson"), `${merged.map(record => JSON.stringify(record)).join("\n")}\n`);
    const manifest = await checkpoint("complete");
    manifest.chineseNamesAfter = merged.filter(hasChineseName).length;
    manifest.chineseIntroductionsAfter = merged.filter(record => record.descriptions.some(description => description.language.startsWith("zh"))).length;
    manifest.profilesWithAnySourceIntroduction = merged.filter(record => record.descriptions.some(description => description.section === "overview")).length;
    await save(path.join(outputPath, "manifest.json"), manifest);
    await save(path.join(outputPath, "missing-chinese.json"), merged.filter(record => !hasChineseName(record) || !record.descriptions.some(description => description.language.startsWith("zh"))).map(record => ({ recordId: record.id, canonicalName: record.taxonomy.canonicalName, hasChineseName: hasChineseName(record), hasChineseIntroduction: record.descriptions.some(description => description.language.startsWith("zh")), reasons: record.chineseSupplement?.reasons || record.chineseEnrichment?.reasons || [] })));
    return manifest;
  } catch (error) { await checkpoint("failed", error.message); throw error; }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) supplementChinese({ resume: process.argv.includes("--resume"), onProgress: m => console.error(`targets=${m.processedTargets}/${m.targetRecords} new-names=${m.newlyNamed} introductions=${m.supplementIntroductions}`) }).then(m => console.log(JSON.stringify(m, null, 2))).catch(error => { console.error(error.stack); process.exitCode = 1; });
