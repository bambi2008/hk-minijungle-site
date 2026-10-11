import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fromGbifSpecies } from "./adapters/gbif-species.mjs";
import { deduplicatePlantRecords, validatePlantRecord } from "./schema.mjs";

const GBIF_SEARCH_URL = "https://api.gbif.org/v1/species/search";
const DEFAULT_LIMIT = 1_000;
const DEFAULT_PAGE_SIZE = 200;
const MAX_LIMIT = 10_000;
const MAX_PAGE_SIZE = 1_000;
const USER_AGENT = "HK-MINIJUNGLE-plant-import/0.1";
const SCOPES = Object.freeze({
  vascular: { key: 7_707_728, name: "Tracheophyta" },
  plantae: { key: 6, name: "Plantae" },
});

export function buildGbifSpeciesSearchUrl({ offset = 0, limit = DEFAULT_PAGE_SIZE, scope = "vascular" } = {}) {
  if (!SCOPES[scope]) throw new Error(`scope must be one of ${Object.keys(SCOPES).join(", ")}`);
  const url = new URL(GBIF_SEARCH_URL);
  url.searchParams.set("highertaxon_key", String(SCOPES[scope].key));
  url.searchParams.set("rank", "SPECIES");
  url.searchParams.set("status", "ACCEPTED");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  return url;
}

function positiveInteger(value, label, maximum) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new Error(`${label} must be an integer between 1 and ${maximum}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = { limit: DEFAULT_LIMIT, pageSize: DEFAULT_PAGE_SIZE, scope: "vascular", resume: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--resume") options.resume = true;
    else if (argument === "--limit") options.limit = positiveInteger(argv[++index], "--limit", MAX_LIMIT);
    else if (argument === "--page-size") options.pageSize = positiveInteger(argv[++index], "--page-size", MAX_PAGE_SIZE);
    else if (argument === "--scope") options.scope = argv[++index];
    else if (argument === "--out-dir") options.outDir = argv[++index];
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.outDir) throw new Error("--out-dir is required");
  return options;
}

function assertLocalOutputDirectory(outDir, cwd = process.cwd()) {
  const resolved = path.resolve(cwd, outDir);
  const relative = path.relative(cwd, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("--out-dir must be a subdirectory of the current project");
  }
  return resolved;
}

async function writeAtomic(filePath, contents) {
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, contents, "utf8");
  await rm(filePath, { force: true });
  await rename(temporary, filePath);
}

async function writeJson(filePath, value) {
  await writeAtomic(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function fetchJsonWithRetry(url, { fetchImpl, sleep, retries = 3 }) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      });
      if (response.ok) return response.json();
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === retries) throw new Error(`GBIF request failed with HTTP ${response.status}`);
      const retryAfter = Number(response.headers?.get?.("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1_000, 30_000)
        : Math.min(500 * (2 ** attempt), 4_000);
      await sleep(waitMs);
    } catch (error) {
      lastError = error;
      if (attempt === retries || /HTTP 4(?!29)/.test(error.message)) throw error;
      await sleep(Math.min(500 * (2 ** attempt), 4_000));
    }
  }
  throw lastError;
}

function normalizeRawRecords(rawRecords, retrievedAt) {
  const valid = [];
  const invalid = [];
  for (const raw of rawRecords) {
    try {
      const record = fromGbifSpecies(raw, { retrievedAt });
      const validation = validatePlantRecord(record);
      if (validation.ok) valid.push(record);
      else invalid.push({ key: raw.key ?? null, errors: validation.errors });
    } catch (error) {
      invalid.push({ key: raw.key ?? null, errors: [error.message] });
    }
  }
  const deduplicated = deduplicatePlantRecords(valid);
  return { records: deduplicated.records, conflicts: deduplicated.conflicts, invalid };
}

async function readRawPages(rawDirectory) {
  let entries = [];
  try {
    entries = await readdir(rawDirectory);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const pages = entries.filter((entry) => /^page-\d{6}\.json$/.test(entry)).sort();
  const rawRecords = [];
  let endOfRecords = false;
  for (const page of pages) {
    const payload = JSON.parse(await readFile(path.join(rawDirectory, page), "utf8"));
    if (!Array.isArray(payload.results)) throw new Error(`Invalid cached GBIF page: ${page}`);
    rawRecords.push(...payload.results);
    endOfRecords = Boolean(payload.endOfRecords);
  }
  return { pages, rawRecords, endOfRecords };
}

export async function downloadGbifSpecies(options) {
  const limit = positiveInteger(options.limit ?? DEFAULT_LIMIT, "limit", MAX_LIMIT);
  const pageSize = positiveInteger(options.pageSize ?? DEFAULT_PAGE_SIZE, "pageSize", MAX_PAGE_SIZE);
  const scope = options.scope ?? "vascular";
  if (!SCOPES[scope]) throw new Error(`scope must be one of ${Object.keys(SCOPES).join(", ")}`);
  const outDirectory = assertLocalOutputDirectory(options.outDir, options.cwd);
  const rawDirectory = path.join(outDirectory, "raw");
  const manifestPath = path.join(outDirectory, "manifest.json");
  const recordsPath = path.join(outDirectory, "records.ndjson");
  const invalidPath = path.join(outDirectory, "invalid-records.json");
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const sleep = options.sleep ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
  if (typeof fetchImpl !== "function") throw new Error("A Fetch API implementation is required");

  await mkdir(rawDirectory, { recursive: true });
  let cached = await readRawPages(rawDirectory);
  if (cached.pages.length && !options.resume) {
    throw new Error("Output contains downloaded pages; use --resume or choose a new --out-dir");
  }
  if (cached.rawRecords.length > limit) {
    throw new Error("The resumed batch already exceeds the requested --limit");
  }
  let previousManifest;
  if (cached.pages.length && options.resume) {
    try {
      previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
      throw new Error("A valid manifest.json is required to resume a batch");
    }
    if (previousManifest.requestedRecords !== limit || previousManifest.pageSize !== pageSize || previousManifest.scope !== scope) {
      throw new Error("Resume options must match the existing manifest");
    }
  }

  const startedAt = options.startedAt ?? previousManifest?.startedAt ?? new Date().toISOString();
  const retrievedAt = options.retrievedAt ?? previousManifest?.retrievedAt ?? startedAt;
  let rawRecords = cached.rawRecords;
  let endOfRecords = cached.endOfRecords;
  let offset = rawRecords.length;

  const checkpoint = async (status, errorMessage = "") => {
    const normalized = normalizeRawRecords(rawRecords, retrievedAt);
    await writeAtomic(recordsPath, normalized.records.map((record) => JSON.stringify(record)).join("\n") + (normalized.records.length ? "\n" : ""));
    await writeJson(invalidPath, normalized.invalid);
    const manifest = {
      schemaVersion: "1.0.0",
      sourceId: "gbif-species",
      endpoint: GBIF_SEARCH_URL,
      scope,
      scopeName: SCOPES[scope].name,
      query: { highertaxon_key: SCOPES[scope].key, rank: "SPECIES", status: "ACCEPTED" },
      requestedRecords: limit,
      pageSize,
      downloadedRawRecords: rawRecords.length,
      normalizedRecords: normalized.records.length,
      invalidRecords: normalized.invalid.length,
      conflictCount: normalized.conflicts.length,
      nextOffset: offset,
      endOfRecords,
      status,
      startedAt,
      retrievedAt,
      updatedAt: new Date().toISOString(),
      rightsReviewRequired: true,
      publicationEligible: false,
      files: { rawDirectory: "raw/", records: "records.ndjson", invalidRecords: "invalid-records.json" },
      ...(errorMessage ? { error: errorMessage } : {}),
    };
    await writeJson(manifestPath, manifest);
    return manifest;
  };

  try {
    while (rawRecords.length < limit && !endOfRecords) {
      const requestLimit = Math.min(pageSize, limit - rawRecords.length);
      const url = buildGbifSpeciesSearchUrl({ offset, limit: requestLimit, scope });
      const payload = await fetchJsonWithRetry(url, { fetchImpl, sleep });
      if (!Array.isArray(payload.results)) throw new Error("GBIF response is missing a results array");
      if (payload.results.length === 0 && !payload.endOfRecords) throw new Error("GBIF returned an empty page before endOfRecords");
      const pagePath = path.join(rawDirectory, `page-${String(offset).padStart(6, "0")}.json`);
      await writeJson(pagePath, payload);
      rawRecords = [...rawRecords, ...payload.results].slice(0, limit);
      offset = rawRecords.length;
      endOfRecords = Boolean(payload.endOfRecords);
      await checkpoint("in-progress");
    }
    return checkpoint("complete");
  } catch (error) {
    await checkpoint("failed", error.message);
    throw error;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifest = await downloadGbifSpecies(options);
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
