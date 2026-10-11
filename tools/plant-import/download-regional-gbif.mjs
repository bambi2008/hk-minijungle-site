import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromGbifSpecies } from "./adapters/gbif-species.mjs";
import { validatePlantRecord } from "./schema.mjs";

export const targetCountries = Object.freeze(["DE", "US", "HK", "CN", "GB", "FR"]);
const OCCURRENCE_API = "https://api.gbif.org/v1/occurrence/search";
const SPECIES_API = "https://api.gbif.org/v1/species";
const VASCULAR_KEY = 7707728;

function boundedInteger(value, label, max) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > max) throw new Error(`${label} must be between 1 and ${max}`);
  return number;
}

function localDirectory(target, cwd) {
  const resolved = path.resolve(cwd, target);
  const relative = path.relative(cwd, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("outDir must be inside the current project");
  return resolved;
}

export function buildRegionalFacetUrl(country, perRegion = 100) {
  if (!targetCountries.includes(country)) throw new Error("Unsupported target country");
  boundedInteger(perRegion, "perRegion", 500);
  const url = new URL(OCCURRENCE_API);
  for (const [key, value] of Object.entries({ country, taxonKey: VASCULAR_KEY, occurrenceStatus: "PRESENT", hasCoordinate: true, hasGeospatialIssue: false, limit: 0, facet: "speciesKey", facetLimit: perRegion * 2 })) url.searchParams.set(key, String(value));
  return url;
}

export function regionalEvidenceUrl(country, key) {
  if (!targetCountries.includes(country) || !/^\d+$/.test(String(key))) throw new Error("Invalid regional evidence identifier");
  const url = new URL(OCCURRENCE_API);
  for (const [name, value] of Object.entries({ country, taxonKey: key, occurrenceStatus: "PRESENT", hasCoordinate: true, hasGeospatialIssue: false, limit: 0 })) url.searchParams.set(name, String(value));
  return url.href;
}

async function jsonFile(file) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

async function atomic(file, contents) {
  await writeFile(`${file}.tmp`, contents, "utf8");
  await rename(`${file}.tmp`, file);
}

async function writeJson(file, value) { await atomic(file, `${JSON.stringify(value, null, 2)}\n`); }

async function requestJson(url, { fetchImpl, sleep }) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetchImpl(url, { headers: { Accept: "application/json", "User-Agent": "HK-MINIJUNGLE-plant-import/0.3 (https://hkminijungle.com/)" }, signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`GBIF HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === 3 || /HTTP 4(?!29)/.test(error.message)) throw error;
      await sleep(Math.min(500 * 2 ** attempt, 4000));
    }
  }
}

async function mapLimit(items, concurrency, task) {
  let next = 0;
  const errors = [];
  await Promise.all(Array.from({ length: Math.min(items.length, concurrency) }, async () => {
    while (next < items.length) {
      const index = next++;
      try { await task(items[index]); } catch (error) { errors.push(error); }
    }
  }));
  if (errors.length) throw errors[0];
}

function acceptedVascularSpecies(raw) {
  return raw?.rank === "SPECIES" && (raw.taxonomicStatus || raw.status) === "ACCEPTED" && raw.phylum === "Tracheophyta" && raw.canonicalName;
}

export async function downloadRegionalGbif(options) {
  const cwd = options.cwd ?? process.cwd();
  const directory = localDirectory(options.outDir, cwd);
  const perRegion = boundedInteger(options.perRegion ?? 100, "perRegion", 500);
  const concurrency = boundedInteger(options.concurrency ?? 4, "concurrency", 8);
  const countries = options.countries ?? targetCountries;
  if (!countries.length || new Set(countries).size !== countries.length || countries.some(country => !targetCountries.includes(country))) throw new Error("Invalid target countries");
  const manifestFile = path.join(directory, "manifest.json");
  const previous = await jsonFile(manifestFile);
  if (previous && !options.resume) throw new Error("Output exists; use --resume");
  if (previous && (previous.perRegion !== perRegion || JSON.stringify(previous.countries) !== JSON.stringify(countries))) throw new Error("Resume options must match the existing manifest");
  const retrievedAt = previous?.retrievedAt || options.retrievedAt || new Date().toISOString();
  const facetDirectory = path.join(directory, "raw", "regions");
  const taxonDirectory = path.join(directory, "raw", "species");
  await Promise.all([mkdir(facetDirectory, { recursive: true }), mkdir(taxonDirectory, { recursive: true })]);
  const context = { fetchImpl: options.fetchImpl ?? fetch, sleep: options.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms))) };
  const facets = new Map();
  const rawSpecies = new Map();
  const chosen = () => new Map(countries.filter(country => facets.has(country)).map(country => [country, facets.get(country).facets.find(facet => facet.field === "SPECIES_KEY").counts.filter(entry => acceptedVascularSpecies(rawSpecies.get(String(entry.name)))).slice(0, perRegion)]));
  const records = () => {
    const byKey = new Map();
    for (const [country, entries] of chosen()) {
      for (const entry of entries) {
        const key = String(entry.name);
        let record = byKey.get(key);
        if (!record) { record = fromGbifSpecies(rawSpecies.get(key), { retrievedAt }); byKey.set(key, record); }
        const url = regionalEvidenceUrl(country, key);
        record.regions.push({ code: country, presence: "recorded", nativeStatus: "unknown", sourceId: "gbif-occurrence", occurrenceCount: entry.count, evidenceUrl: url, retrievedAt });
        record.provenance.push({ sourceId: "gbif-occurrence", recordId: `${country}:${key}`, url, retrievedAt, rights: "GBIF aggregate occurrence counts; contributing datasets retain their own rights." });
      }
    }
    const result = [...byKey.values()];
    for (const record of result) {
      const validation = validatePlantRecord(record);
      if (!validation.ok) throw new Error(`Invalid regional species ${record.id}: ${validation.errors.join(", ")}`);
    }
    return result;
  };
  const checkpoint = async (status, error) => {
    const selected = records();
    const regionCounts = Object.fromEntries(countries.map(country => [country, chosen().get(country)?.length || 0]));
    const manifest = { schemaVersion: "1.0.0", sourceId: "gbif-occurrence", perRegion, countries, regionCounts, records: selected.length, retrievedAt, updatedAt: new Date().toISOString(), status, sampling: "Most frequently recorded species among georeferenced PRESENT observations without geospatial issues; not a complete flora or a recommendation.", publicationEligible: false, ...(error ? { error } : {}) };
    await atomic(path.join(directory, "records.ndjson"), selected.map(record => JSON.stringify(record)).join("\n") + (selected.length ? "\n" : ""));
    await writeJson(manifestFile, manifest);
    options.onProgress?.(manifest);
    return manifest;
  };
  await checkpoint("in-progress");
  try {
    await mapLimit(countries, concurrency, async country => {
      const file = path.join(facetDirectory, `${country}.json`);
      const payload = await jsonFile(file) ?? await requestJson(buildRegionalFacetUrl(country, perRegion), context);
      const entries = payload.facets?.find(facet => facet.field === "SPECIES_KEY")?.counts;
      if (!Array.isArray(entries) || entries.some(entry => !/^\d+$/.test(String(entry.name)) || !Number.isSafeInteger(entry.count) || entry.count < 1)) throw new Error(`Invalid GBIF facet for ${country}`);
      await writeJson(file, payload);
      facets.set(country, payload);
    });
    let loaded = 0;
    while (true) {
      const queue = new Set();
      for (const country of countries) {
        const needed = perRegion - (chosen().get(country)?.length || 0);
        if (needed <= 0) continue;
        const candidates = facets.get(country).facets.find(facet => facet.field === "SPECIES_KEY").counts;
        for (const entry of candidates.filter(entry => !rawSpecies.has(String(entry.name))).slice(0, needed)) queue.add(String(entry.name));
      }
      if (!queue.size) break;
      await mapLimit([...queue], concurrency, async key => {
        const file = path.join(taxonDirectory, `${key}.json`);
        const raw = await jsonFile(file) ?? await requestJson(`${SPECIES_API}/${key}`, context);
        if (String(raw.key) !== key) throw new Error(`GBIF taxon key mismatch for ${key}`);
        await writeJson(file, raw);
        rawSpecies.set(key, raw);
        loaded++;
        if (loaded % 25 === 0) options.onProgress?.({ status: "taxonomy", loaded });
      });
      await checkpoint("in-progress");
    }
    return await checkpoint("complete");
  } catch (error) { await checkpoint("failed", error.message); throw error; }
}

async function main() {
  const options = { outDir: "data/plant-import/gbif-regions", perRegion: 100, concurrency: 4 };
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--resume") options.resume = true;
    else if (args[index] === "--per-region") options.perRegion = args[++index];
    else if (args[index] === "--concurrency") options.concurrency = args[++index];
    else if (args[index] === "--out-dir") options.outDir = args[++index];
    else throw new Error(`Unknown argument ${args[index]}`);
  }
  const manifest = await downloadRegionalGbif({ ...options, onProgress: value => process.stderr.write(`${JSON.stringify(value)}\n`) });
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
