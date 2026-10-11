// Offline acquisition helper only; not imported by or wired into the website.
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deduplicatePlantRecords, validatePlantRecord } from "../../tools/plant-import/schema.mjs";

const ENDPOINTS = Object.freeze({ en: "https://en.wikipedia.org/w/api.php", zh: "https://zh.wikipedia.org/w/api.php", data: "https://www.wikidata.org/w/api.php" });
const DEFAULT_INPUTS = ["data/plant-import/gbif-tracheophyta/wikimedia-enrichment/records-enriched.ndjson", "data/plant-import/gbif-regions/wikimedia-enrichment/records-enriched.ndjson"];
const VARIANTS = ["zh-hk", "zh-cn"];
const RIGHTS = "CC BY-SA 4.0";
const key = value => String(value || "").replaceAll("_", " ").replace(/\s+/g, " ").trim().toLowerCase();
// Preserve the hybrid marker: an ordinary species must not match a hybrid.
export const scientificKey = value => key(value).replace(/\s*×\s*/g, "×");
const unique = (values, getKey) => [...new Map(values.map(value => [getKey(value), value])).values()];
const digest = value => createHash("sha256").update(value).digest("hex");

export function withinProject(cwd, value) {
  const absolute = path.resolve(cwd, value);
  const relative = path.relative(cwd, absolute);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Path must be inside the project");
  return absolute;
}

function apiUrl(service, parameters) {
  const url = new URL(ENDPOINTS[service]);
  for (const [name, value] of Object.entries({ format: "json", formatversion: "2", maxlag: "5", ...parameters })) url.searchParams.set(name, value);
  return url;
}

export function wikipediaUrl(titles, variant = "en") {
  if (!titles.length || titles.length > 20) throw new Error("Wikipedia batches must contain 1–20 titles");
  const common = { action: "query", titles: titles.join("|"), redirects: "1", inprop: "url" };
  return variant === "en"
    ? apiUrl("en", { ...common, prop: "langlinks|pageprops|info", lllang: "zh", llprop: "url", lllimit: "max" })
    : apiUrl("zh", { ...common, prop: "extracts|pageprops|info", exintro: "1", explaintext: "1", exlimit: "max", variant });
}

export function resolvePages(titles, payload) {
  const changes = new Map([...(payload.query?.normalized || []), ...(payload.query?.converted || []), ...(payload.query?.redirects || [])].map(item => [key(item.from), item.to]));
  const pages = new Map((payload.query?.pages || []).map(page => [key(page.title), page]));
  return new Map(titles.map(title => {
    let current = title;
    const visited = new Set();
    while (changes.has(key(current)) && !visited.has(key(current))) {
      visited.add(key(current));
      current = changes.get(key(current));
    }
    const page = pages.get(key(current));
    return [title, page && !page.missing && page.pageid && page.ns === 0 && page.pageprops?.disambiguation == null ? page : null];
  }));
}

export function matchesScientificName(entity, canonicalName) {
  return (entity?.claims?.P225 || []).some(claim => claim.rank !== "deprecated" && claim.mainsnak?.snaktype === "value" && scientificKey(claim.mainsnak.datavalue?.value) === scientificKey(canonicalName));
}

export function chineseResult(record, entity, pages, extraReasons = []) {
  const reasons = [...extraReasons];
  const names = [];
  const descriptions = [];
  const provenance = [];
  const retrievedAt = new Date().toISOString();
  const validEntity = matchesScientificName(entity, record.taxonomy.canonicalName);
  if (!validEntity) reasons.push("no-exact-wikidata-scientific-name");
  if (validEntity) {
    const entityUrl = `https://www.wikidata.org/wiki/${entity.id}`;
    for (const [language, label] of Object.entries(entity.labels || {})) {
      if (language.startsWith("zh") && /[\u3400-\u9fff]/u.test(label.value)) names.push({ value: label.value, language, type: "common", region: "", sourceId: "wikidata", sourcePage: entityUrl });
    }
    provenance.push({ sourceId: "wikidata", recordId: entity.id, url: entityUrl, retrievedAt, rights: "CC0 1.0" });
    for (const variant of VARIANTS) {
      const page = pages[variant];
      if (!page) { reasons.push(`${variant}-article-missing`); continue; }
      if (page.pageprops?.wikibase_item !== entity.id) { reasons.push(`${variant}-entity-identity-mismatch`); continue; }
      let sourceUrl;
      try { sourceUrl = new URL(page.fullurl); } catch { /* Invalid provenance is rejected, not guessed. */ }
      if (!sourceUrl || sourceUrl.protocol !== "https:" || sourceUrl.hostname !== "zh.wikipedia.org") { reasons.push(`${variant}-source-url-rejected`); continue; }
      if (page.title && /[\u3400-\u9fff]/u.test(page.title)) names.push({ value: page.title, language: "zh", type: "common", region: "", sourceId: "wikipedia-zh", sourcePage: page.fullurl });
      if (page.extract?.trim()) descriptions.push({ language: variant, section: "overview", text: page.extract.trim(), sourceId: "wikipedia-zh", rights: RIGHTS, sourcePage: page.fullurl, sourceRevision: page.lastrevid, conversion: `Wikimedia LanguageConverter ${variant}` });
      else reasons.push(`${variant}-extract-missing`);
      provenance.push({ sourceId: "wikipedia-zh", recordId: String(page.pageid), url: page.fullurl, retrievedAt, rights: RIGHTS, sourceRevision: page.lastrevid });
    }
  }
  return {
    recordId: record.id,
    canonicalName: record.taxonomy.canonicalName,
    entityId: validEntity ? entity.id : "",
    identityMethod: validEntity ? "exact-P225-and-matching-Wikipedia-wikibase-item" : "unmatched",
    names: unique(names, name => `${name.language}|${name.value}|${name.sourceId}`),
    descriptions,
    provenance: unique(provenance, source => `${source.sourceId}|${source.recordId}`),
    reasons: [...new Set(reasons)],
    retrievedAt,
  };
}

async function atomicJson(file, value) {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, file);
}

async function optionalJson(file) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

async function mapLimit(items, concurrency, work) {
  let next = 0;
  const results = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) { const i = next++; results[i] = await work(items[i]); }
  }));
  return results;
}

export async function enrichChinese(options = {}) {
  const cwd = options.cwd || process.cwd();
  const out = withinProject(cwd, options.outDir || "data/plant-import/chinese-enrichment");
  const batchSize = options.batchSize ?? 20;
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 20) throw new Error("batchSize must be 1–20");
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const sleep = options.sleep || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  const inputs = await Promise.all((options.inputs || DEFAULT_INPUTS).map(async input => {
    const text = await readFile(withinProject(cwd, input), "utf8");
    return { input, hash: digest(text), records: text.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line)) };
  }));
  const inputFingerprint = digest(JSON.stringify(inputs.map(({ input, hash }) => ({ input, hash }))));
  const dedup = deduplicatePlantRecords(inputs.flatMap(input => input.records));
  if (dedup.conflicts.length) throw new Error("Taxonomy conflicts require review");
  const records = dedup.records;
  if (new Set(records.map(record => record.id)).size !== records.length) throw new Error("Duplicate record IDs");
  for (const record of records) if (!validatePlantRecord(record).ok) throw new Error(`Invalid input: ${record.id}`);
  await mkdir(path.join(out, "raw"), { recursive: true });
  const previous = await optionalJson(path.join(out, "manifest.json"));
  if (previous && !options.resume) throw new Error("Output exists; --resume is required");
  if (previous && previous.inputFingerprint !== inputFingerprint) throw new Error("Input fingerprint changed; choose a new output directory");
  const saved = await optionalJson(path.join(out, "results.json")) || [];
  const byId = new Map(saved.map(result => [result.recordId, result]));
  if (saved.some(result => !records.some(record => record.id === result.recordId && record.taxonomy.canonicalName === result.canonicalName))) throw new Error("Saved result identity does not match inputs");
  const startedAt = previous?.startedAt || new Date().toISOString();
  let networkRequests = 0;

  async function request(url) {
    if (!Object.values(ENDPOINTS).some(endpoint => url.origin + url.pathname === endpoint)) throw new Error("Unapproved API endpoint");
    const cache = path.join(out, "raw", `${digest(url.href)}.json`);
    const existing = await optionalJson(cache);
    if (existing) return existing.payload;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      let delay = Math.min(500 * 2 ** attempt, 4000);
      try {
        networkRequests += 1;
        const response = await fetchImpl(url, { signal: AbortSignal.timeout(30000), redirect: "error", headers: { Accept: "application/json", "User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.3 (https://hkminijungle.com/)", "Api-User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.3" } });
        if (!response.ok) {
          const error = new Error(`API HTTP ${response.status}`);
          error.permanent = response.status < 500 && response.status !== 429;
          const retryAfter = Number(response.headers.get("retry-after"));
          if (retryAfter > 0) delay = Math.min(retryAfter * 1000, 30000);
          throw error;
        }
        const payload = await response.json();
        if (payload.error) throw new Error(`API error: ${payload.error.code}`);
        if (payload.continue) throw new Error("Unexpected pagination; no silent partial results accepted");
        await atomicJson(cache, { requestUrl: url.href, retrievedAt: new Date().toISOString(), payload });
        await sleep(100);
        return payload;
      } catch (error) {
        if (attempt === 3 || error.permanent) throw error;
        await sleep(delay);
      }
    }
  }

  async function entities(ids) {
    if (!ids.length) return {};
    if (ids.length > 50) throw new Error("Wikidata entity batches may not exceed 50");
    const payload = await request(apiUrl("data", { action: "wbgetentities", ids: ids.join("|"), props: "claims|labels|sitelinks", languages: "zh|zh-hant|zh-hans|zh-hk|zh-cn" }));
    return payload.entities || {};
  }

  async function checkpoint(status, error = "") {
    const results = [...byId.values()];
    const countsFor = selected => ({ processed: selected.length, chineseNames: selected.filter(result => result.names.length).length, chineseIntroductions: selected.filter(result => result.descriptions.length).length });
    const totals = countsFor(results);
    const regionalIds = new Set(records.filter(record => record.regions.length).map(record => record.id));
    const reasonCounts = {};
    for (const result of results) for (const reason of result.reasons) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    const manifest = { schemaVersion: "1.0.0", status, inputRecords: records.length, inputFingerprint, inputs: inputs.map(({ input, hash }) => ({ input, sha256: hash })), ...totals, regional: countsFor(results.filter(result => regionalIds.has(result.recordId))), variants: VARIANTS, reasonCounts, startedAt, updatedAt: new Date().toISOString(), networkRequestsThisRun: networkRequests, publicationEligible: false, reviewState: "machine-normalized", sources: [{ id: "wikipedia-zh", rights: RIGHTS, url: "https://zh.wikipedia.org/" }, { id: "wikidata", rights: "CC0 1.0", url: "https://www.wikidata.org/wiki/Wikidata:Licensing" }], ...(error ? { error } : {}) };
    // Save data before manifest; a restart can safely re-use all completed identities.
    await atomicJson(path.join(out, "results.json"), results);
    await atomicJson(path.join(out, "manifest.json"), manifest);
    return manifest;
  }

  try {
    const pending = records.filter(record => !byId.has(record.id));
    for (let offset = 0; offset < pending.length; offset += batchSize) {
      const batch = pending.slice(offset, offset + batchSize);
      const titles = batch.map(record => record.taxonomy.canonicalName);
      const [enPayload, zhPayload] = await Promise.all([request(wikipediaUrl(titles)), request(wikipediaUrl(titles, "zh-hk"))]);
      const enPages = resolvePages(titles, enPayload);
      const zhPages = resolvePages(titles, zhPayload);
      const alternativeTitles = unique(batch.filter(record => !zhPages.get(record.taxonomy.canonicalName)).map(record => enPages.get(record.taxonomy.canonicalName)?.langlinks?.find(link => link.lang === "zh")?.title).filter(Boolean), key);
      if (alternativeTitles.length) {
        const linkedPages = resolvePages(alternativeTitles, await request(wikipediaUrl(alternativeTitles, "zh-hk")));
        for (const record of batch) {
          const title = record.taxonomy.canonicalName;
          const linked = enPages.get(title)?.langlinks?.find(link => link.lang === "zh")?.title;
          if (!zhPages.get(title) && linkedPages.get(linked)) zhPages.set(title, linkedPages.get(linked));
        }
      }
      const ids = unique([...enPages.values(), ...zhPages.values()].map(page => page?.pageprops?.wikibase_item).filter(id => /^Q\d+$/.test(id)), String);
      const entityMap = await entities(ids);
      const recordEntity = new Map();
      const ambiguousIds = new Set();
      for (const record of batch) {
        const title = record.taxonomy.canonicalName;
        const candidates = unique([enPages.get(title)?.pageprops?.wikibase_item, zhPages.get(title)?.pageprops?.wikibase_item].filter(Boolean), String).map(id => entityMap[id]).filter(entity => matchesScientificName(entity, title));
        if (candidates.length === 1) recordEntity.set(record.id, candidates[0]);
        if (candidates.length > 1) ambiguousIds.add(record.id);
      }
      // Missing regional plants may have no Wikipedia page but an exact Wikidata name.
      const searchRecords = batch.filter(record => record.regions.length && !recordEntity.has(record.id) && !ambiguousIds.has(record.id));
      const searches = await mapLimit(searchRecords, 3, async record => ({ record, payload: await request(apiUrl("data", { action: "wbsearchentities", search: record.taxonomy.canonicalName, language: "en", type: "item", limit: "3" })) }));
      const searchedIds = unique(searches.flatMap(({ payload }) => (payload.search || []).map(result => result.id)).filter(id => /^Q\d+$/.test(id)), String);
      const searchedEntities = {};
      for (let i = 0; i < searchedIds.length; i += 50) Object.assign(searchedEntities, await entities(searchedIds.slice(i, i + 50)));
      for (const { record, payload } of searches) {
        const matches = (payload.search || []).map(result => searchedEntities[result.id]).filter(entity => matchesScientificName(entity, record.taxonomy.canonicalName));
        if (matches.length === 1) recordEntity.set(record.id, matches[0]);
      }
      const extraTitles = unique(batch.filter(record => !zhPages.get(record.taxonomy.canonicalName)).map(record => recordEntity.get(record.id)?.sitelinks?.zhwiki?.title).filter(Boolean), key);
      if (extraTitles.length) {
        const linkedPages = resolvePages(extraTitles, await request(wikipediaUrl(extraTitles, "zh-hk")));
        for (const record of batch) if (!zhPages.get(record.taxonomy.canonicalName)) zhPages.set(record.taxonomy.canonicalName, linkedPages.get(recordEntity.get(record.id)?.sitelinks?.zhwiki?.title) || null);
      }
      const selectedTitles = unique([...zhPages.values()].map(page => page?.title).filter(Boolean), key);
      const cnPages = selectedTitles.length ? resolvePages(selectedTitles, await request(wikipediaUrl(selectedTitles, "zh-cn"))) : new Map();
      for (const record of batch) {
        const page = zhPages.get(record.taxonomy.canonicalName);
        byId.set(record.id, chineseResult(record, recordEntity.get(record.id), { "zh-hk": page, "zh-cn": cnPages.get(page?.title) }, ambiguousIds.has(record.id) ? ["conflicting-exact-entity-identities"] : []));
      }
      options.onProgress?.(await checkpoint("in-progress"));
    }
    const merged = records.map(record => {
      const result = byId.get(record.id);
      return { ...record, names: unique([...record.names, ...result.names], item => `${item.language}|${item.value}|${item.sourceId}`), descriptions: unique([...record.descriptions, ...result.descriptions], item => `${item.language}|${item.section}|${item.sourceId}`), provenance: unique([...record.provenance, ...result.provenance], item => `${item.sourceId}|${item.recordId}`), chineseEnrichment: { entityId: result.entityId, identityMethod: result.identityMethod, reasons: result.reasons, retrievedAt: result.retrievedAt }, review: { ...record.review, flags: [...new Set([...record.review.flags, "chinese-source-text-not-editor-reviewed"])] } };
    });
    if (merged.some(record => !validatePlantRecord(record).ok)) throw new Error("Enriched records failed schema validation");
    await atomicJson(path.join(out, "records-enriched.ndjson"), `${merged.map(record => JSON.stringify(record)).join("\n")}\n`);
    await atomicJson(path.join(out, "missing-chinese.json"), [...byId.values()].filter(result => !result.names.length || !result.descriptions.length).map(({ recordId, canonicalName, entityId, names, descriptions, reasons }) => ({ recordId, canonicalName, entityId, hasChineseName: Boolean(names.length), hasChineseIntroduction: Boolean(descriptions.length), reasons })));
    return checkpoint("complete");
  } catch (error) {
    await checkpoint("failed", error.message);
    throw error;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  enrichChinese({ resume: process.argv.includes("--resume"), onProgress: manifest => process.stderr.write(`processed=${manifest.processed}/${manifest.inputRecords} zh-names=${manifest.chineseNames} zh-intros=${manifest.chineseIntroductions}\n`) }).then(manifest => process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`)).catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1; });
}
