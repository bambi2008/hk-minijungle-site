import { appendFile, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPlantSource } from "./source-manifest.mjs";
import { validatePlantRecord } from "./schema.mjs";

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "HK-MINIJUNGLE-plant-import/0.2 (https://hkminijungle.com/)";
const MAX_BATCH_SIZE = 50;
const MAX_CONCURRENCY = 8;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MIME_EXTENSIONS = Object.freeze({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" });
const WIKIMEDIA_IMAGE_HOSTS = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);

function positiveInteger(value, label, maximum) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new Error(`${label} must be an integer between 1 and ${maximum}`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = { batchSize: 20, concurrency: 4, resume: false, searchMissing: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--resume") options.resume = true;
    else if (argument === "--search-missing") options.searchMissing = true;
    else if (argument === "--input") options.input = argv[++index];
    else if (argument === "--out-dir") options.outDir = argv[++index];
    else if (argument === "--batch-size") options.batchSize = positiveInteger(argv[++index], "--batch-size", MAX_BATCH_SIZE);
    else if (argument === "--concurrency") options.concurrency = positiveInteger(argv[++index], "--concurrency", MAX_CONCURRENCY);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.input) throw new Error("--input is required");
  if (!options.outDir) throw new Error("--out-dir is required");
  return options;
}

function resolveWithinProject(target, cwd, label) {
  const resolved = path.resolve(cwd, target);
  const relative = path.relative(cwd, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} must be inside the current project`);
  }
  return resolved;
}

async function writeAtomic(filePath, contents) {
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, contents);
  await rm(filePath, { force: true });
  await rename(temporary, filePath);
}

async function writeJson(filePath, value) {
  await writeAtomic(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function readNdjson(filePath, { allowMissing = false } = {}) {
  let contents;
  try {
    contents = await readFile(filePath, "utf8");
  } catch (error) {
    if (allowMissing && error.code === "ENOENT") return [];
    throw error;
  }
  return contents.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch {
      throw new Error(`Invalid NDJSON at ${filePath}:${index + 1}`);
    }
  });
}

async function fetchWithRetry(url, { fetchImpl, sleep, retries = 3 }) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { Accept: "application/json", "Api-User-Agent": USER_AGENT, "User-Agent": USER_AGENT },
      });
      if (response.ok) return response;
      if ((response.status !== 429 && response.status < 500) || attempt === retries) {
        throw new Error(`Wikimedia request failed with HTTP ${response.status}`);
      }
      const retryAfter = Number(response.headers?.get?.("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1_000, 30_000) : Math.min(500 * (2 ** attempt), 4_000));
    } catch (error) {
      lastError = error;
      if (attempt === retries || /HTTP 4(?!29)/.test(error.message)) throw error;
      await sleep(Math.min(500 * (2 ** attempt), 4_000));
    }
  }
  throw lastError;
}

export function buildWikipediaBatchUrl(titles) {
  const url = new URL(WIKIPEDIA_API);
  const parameters = {
    action: "query",
    format: "json",
    formatversion: "2",
    redirects: "1",
    prop: "extracts|pageimages|info",
    exintro: "1",
    explaintext: "1",
    piprop: "name|thumbnail|original",
    pithumbsize: "1200",
    inprop: "url",
    titles: titles.join("|"),
  };
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  return url;
}

export function buildCommonsBatchUrl(fileTitles) {
  const url = new URL(COMMONS_API);
  const parameters = {
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "1200",
    titles: fileTitles.map((title) => title.startsWith("File:") ? title : `File:${title}`).join("|"),
  };
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  return url;
}

export function buildCommonsExactSearchUrl(scientificName) {
  const url = new URL(COMMONS_API);
  const parameters = {
    action: "query",
    format: "json",
    formatversion: "2",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "5",
    gsrsearch: `\"${scientificName}\" filetype:bitmap`,
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime|size",
    iiurlwidth: "1200",
  };
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  return url;
}

function titleKey(value) {
  return String(value ?? "").replace(/^File:/i, "").replaceAll("_", " ").trim().toLowerCase();
}

function resolveWikipediaPages(inputTitles, payload) {
  const normalized = new Map((payload.query?.normalized || []).map((item) => [titleKey(item.from), item.to]));
  const redirects = new Map((payload.query?.redirects || []).map((item) => [titleKey(item.from), item.to]));
  const pages = new Map((payload.query?.pages || []).map((page) => [titleKey(page.title), page]));
  return new Map(inputTitles.map((input) => {
    let current = normalized.get(titleKey(input)) || input;
    const seen = new Set();
    while (redirects.has(titleKey(current)) && !seen.has(titleKey(current))) {
      seen.add(titleKey(current));
      current = redirects.get(titleKey(current));
    }
    return [input, pages.get(titleKey(current)) || null];
  }));
}

function resolveCommonsPages(fileTitles, payload) {
  const pages = new Map((payload.query?.pages || []).map((page) => [titleKey(page.title), page]));
  return new Map(fileTitles.map((title) => [title, pages.get(titleKey(title)) || null]));
}

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function metadataValue(metadata, key) {
  return metadata?.[key]?.value ?? "";
}

function normalizeLicence(value) {
  const licence = decodeHtml(value).replace(/Creative Commons/gi, "CC").trim();
  if (/^CC0(?: 1\.0)?$/i.test(licence)) return "CC0 1.0";
  if (/^public domain$/i.test(licence)) return "Public domain";
  return licence.toUpperCase().replace(/^CC BY-SA /, "CC BY-SA ").replace(/^CC BY /, "CC BY ");
}

function uniqueBy(values, keyFor) {
  return [...new Map(values.map((value) => [keyFor(value), value])).values()];
}

async function mapLimit(values, concurrency, task) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await task(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

function hasExpectedImageSignature(buffer, mimeType) {
  if (mimeType === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/webp") return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

async function downloadCommonsImage(image, { mediaDirectory, recordId, fetchImpl, sleep }) {
  const remoteUrl = new URL(image.downloadUrl);
  if (remoteUrl.protocol !== "https:" || !WIKIMEDIA_IMAGE_HOSTS.has(remoteUrl.hostname)) {
    throw new Error("Commons image URL must use an approved Wikimedia image host");
  }
  const extension = MIME_EXTENSIONS[image.mimeType];
  if (!extension) throw new Error(`Unsupported image MIME type: ${image.mimeType}`);
  const response = await fetchWithRetry(remoteUrl, { fetchImpl, sleep });
  const responseType = String(response.headers?.get?.("content-type") || "").split(";")[0].toLowerCase();
  if (responseType && responseType !== image.mimeType) throw new Error(`Image MIME mismatch: ${responseType}`);
  const declaredBytes = Number(response.headers?.get?.("content-length"));
  if (Number.isFinite(declaredBytes) && declaredBytes > MAX_IMAGE_BYTES) throw new Error("Image exceeds the 8 MiB limit");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error("Image exceeds the 8 MiB limit");
  if (!hasExpectedImageSignature(buffer, image.mimeType)) throw new Error("Image file signature does not match its MIME type");
  const safeId = recordId.replace(/[^a-z0-9_-]+/gi, "-");
  const fileName = `${safeId}.${extension}`;
  await writeAtomic(path.join(mediaDirectory, fileName), buffer);
  return {
    localPath: `media/${fileName}`,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    bytes: buffer.length,
  };
}

function commonsCandidate(page) {
  const info = page?.imageinfo?.[0];
  if (!info) return { ok: false, reason: "commons-metadata-missing" };
  const commons = getPlantSource("wikimedia-commons");
  const licence = normalizeLicence(metadataValue(info.extmetadata, "LicenseShortName"));
  if (!commons.allowedLicences.includes(licence)) return { ok: false, reason: `licence-rejected:${licence || "missing"}` };
  const mimeType = String(info.mime || "").toLowerCase();
  if (!MIME_EXTENSIONS[mimeType]) return { ok: false, reason: `mime-rejected:${mimeType || "missing"}` };
  const creator = decodeHtml(metadataValue(info.extmetadata, "Artist") || metadataValue(info.extmetadata, "Credit"));
  const sourcePage = info.descriptionurl || "";
  const downloadUrl = info.thumburl || info.url || "";
  if (!creator || !sourcePage || !downloadUrl) return { ok: false, reason: "attribution-incomplete" };
  return {
    ok: true,
    downloadUrl,
    sourcePage,
    creator,
    licence,
    licenceUrl: metadataValue(info.extmetadata, "LicenseUrl"),
    mimeType,
    width: info.thumbwidth || info.width || null,
    height: info.thumbheight || info.height || null,
  };
}

function exactScientificNameCandidate(scientificName, payload) {
  const needle = scientificName.toLowerCase();
  for (const page of payload.query?.pages || []) {
    const info = page.imageinfo?.[0];
    const evidence = decodeHtml([
      page.title,
      metadataValue(info?.extmetadata, "ObjectName"),
      metadataValue(info?.extmetadata, "ImageDescription"),
      metadataValue(info?.extmetadata, "Categories"),
    ].join(" ")).toLowerCase();
    if (!evidence.includes(needle)) continue;
    const candidate = commonsCandidate(page);
    if (candidate.ok) return candidate;
  }
  return null;
}

function buildManifest({ inputRecords, results, status, startedAt, error = "" }) {
  const withDescription = results.filter((result) => result.descriptions.length).length;
  const withImage = results.filter((result) => result.media.length).length;
  const imageBytes = results.reduce((sum, result) => sum + (result.media[0]?.bytes || 0), 0);
  const reasonCounts = {};
  for (const result of results) {
    for (const reason of result.reasons) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  }
  return {
    schemaVersion: "1.0.0",
    sources: ["wikipedia-en", "wikimedia-commons"],
    inputRecords,
    processedRecords: results.length,
    withDescription,
    withImage,
    withoutDescription: results.length - withDescription,
    withoutImage: results.length - withImage,
    imageBytes,
    reasonCounts,
    status,
    startedAt,
    updatedAt: new Date().toISOString(),
    publicationEligible: false,
    textLicence: "CC BY-SA 4.0",
    imageLicencePolicy: "Wikimedia Commons allowlist in source-manifest.mjs",
    ...(error ? { error } : {}),
  };
}

export async function enrichWikimedia(options) {
  const cwd = options.cwd ?? process.cwd();
  const inputPath = resolveWithinProject(options.input, cwd, "--input");
  const outDirectory = resolveWithinProject(options.outDir, cwd, "--out-dir");
  const batchSize = positiveInteger(options.batchSize ?? 20, "batchSize", MAX_BATCH_SIZE);
  const concurrency = positiveInteger(options.concurrency ?? 4, "concurrency", MAX_CONCURRENCY);
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const sleep = options.sleep ?? ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));
  if (typeof fetchImpl !== "function") throw new Error("A Fetch API implementation is required");

  const rawWikipediaDirectory = path.join(outDirectory, "raw", "wikipedia");
  const rawCommonsDirectory = path.join(outDirectory, "raw", "commons");
  const rawCommonsSearchDirectory = path.join(outDirectory, "raw", "commons-search");
  const mediaDirectory = path.join(outDirectory, "media");
  const resultsPath = path.join(outDirectory, "enrichment-results.ndjson");
  const enrichedPath = path.join(outDirectory, "records-enriched.ndjson");
  const missingPath = path.join(outDirectory, "missing-and-rejected.json");
  const manifestPath = path.join(outDirectory, "manifest.json");
  await Promise.all([mkdir(rawWikipediaDirectory, { recursive: true }), mkdir(rawCommonsDirectory, { recursive: true }), mkdir(rawCommonsSearchDirectory, { recursive: true }), mkdir(mediaDirectory, { recursive: true })]);

  const records = await readNdjson(inputPath);
  const existingResults = await readNdjson(resultsPath, { allowMissing: true });
  if (existingResults.length && !options.resume) throw new Error("Enrichment output exists; use --resume or choose a new --out-dir");
  const resultById = new Map(existingResults.map((result) => [result.recordId, result]));
  const pending = records.filter((record) => {
    const existing = resultById.get(record.id);
    if (!existing) return true;
    if (options.searchMissing) return existing.media.length === 0;
    if (!options.resume) return false;
    return existing.reasons.some((reason) => reason.startsWith("image-download-failed:") || (
      reason.startsWith("licence-rejected:") && getPlantSource("wikimedia-commons").allowedLicences.includes(reason.slice("licence-rejected:".length))
    ));
  });
  let previousManifest = null;
  if (options.resume && existingResults.length) {
    try {
      previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
      throw new Error("A valid manifest.json is required to resume enrichment");
    }
    if (previousManifest.inputRecords !== records.length) throw new Error("Resume input count does not match the existing manifest");
  }
  const startedAt = previousManifest?.startedAt ?? options.startedAt ?? new Date().toISOString();
  const wikipediaSource = getPlantSource("wikipedia-en");
  const rawRunPrefix = options.resume ? `retry-${Date.now()}-` : "";

  const checkpoint = async (status, error = "") => {
    const results = [...resultById.values()];
    const manifest = buildManifest({ inputRecords: records.length, results, status, startedAt, error });
    await writeJson(manifestPath, manifest);
    return manifest;
  };

  try {
    for (let batchStart = 0; batchStart < pending.length; batchStart += batchSize) {
      const batch = pending.slice(batchStart, batchStart + batchSize);
      const titles = batch.map((record) => record.taxonomy.canonicalName);
      const batchLabel = String(batchStart).padStart(6, "0");
      const wikipediaResponse = await fetchWithRetry(buildWikipediaBatchUrl(titles), { fetchImpl, sleep });
      const wikipediaPayload = await wikipediaResponse.json();
      await writeJson(path.join(rawWikipediaDirectory, `${rawRunPrefix}batch-${batchLabel}.json`), wikipediaPayload);
      const pageByInput = resolveWikipediaPages(titles, wikipediaPayload);
      const imageTitles = uniqueBy(batch.map((record) => pageByInput.get(record.taxonomy.canonicalName)?.pageimage).filter(Boolean), titleKey);
      let commonsPayload = { query: { pages: [] } };
      if (imageTitles.length) {
        const commonsResponse = await fetchWithRetry(buildCommonsBatchUrl(imageTitles), { fetchImpl, sleep });
        commonsPayload = await commonsResponse.json();
      }
      await writeJson(path.join(rawCommonsDirectory, `${rawRunPrefix}batch-${batchLabel}.json`), commonsPayload);
      const commonsByTitle = resolveCommonsPages(imageTitles, commonsPayload);

      const batchResults = await mapLimit(batch, concurrency, async (record) => {
        const canonicalName = record.taxonomy.canonicalName;
        const page = pageByInput.get(canonicalName);
        const reasons = [];
        const descriptions = [];
        const names = [];
        const media = [];
        if (!page || page.missing || !page.pageid) reasons.push("wikipedia-page-missing");
        else {
          if (page.extract) descriptions.push({
            language: "en",
            section: "overview",
            text: String(page.extract).trim(),
            sourceId: wikipediaSource.id,
            rights: "CC BY-SA 4.0",
            sourcePage: page.fullurl,
          });
          else reasons.push("wikipedia-description-missing");
          if (page.title && titleKey(page.title) !== titleKey(canonicalName)) names.push({
            value: page.title,
            language: "en",
            type: "common",
            region: "",
            sourceId: wikipediaSource.id,
          });
          if (!page.pageimage) reasons.push("wikipedia-lead-image-missing");
          else {
            const candidate = commonsCandidate(commonsByTitle.get(page.pageimage));
            if (!candidate.ok) reasons.push(candidate.reason);
            else {
              try {
                const downloaded = await downloadCommonsImage(candidate, { mediaDirectory, recordId: record.id, fetchImpl, sleep });
                media.push({
                  kind: "image",
                  url: candidate.downloadUrl,
                  sourcePage: candidate.sourcePage,
                  creator: candidate.creator,
                  licence: candidate.licence,
                  licenceUrl: candidate.licenceUrl,
                  attribution: `${candidate.creator} · ${candidate.licence} · Wikimedia Commons`,
                  sourceId: "wikimedia-commons",
                  localPath: downloaded.localPath,
                  sha256: downloaded.sha256,
                  bytes: downloaded.bytes,
                  mimeType: candidate.mimeType,
                  width: candidate.width,
                  height: candidate.height,
                });
              } catch (error) {
                reasons.push(`image-download-failed:${error.message}`);
              }
            }
          }
        }
        if (!media.length && options.searchMissing) {
          try {
            const searchResponse = await fetchWithRetry(buildCommonsExactSearchUrl(canonicalName), { fetchImpl, sleep });
            const searchPayload = await searchResponse.json();
            const searchFile = `${record.id.replace(/[^a-z0-9_-]+/gi, "-")}.json`;
            await writeJson(path.join(rawCommonsSearchDirectory, searchFile), searchPayload);
            const candidate = exactScientificNameCandidate(canonicalName, searchPayload);
            if (!candidate) reasons.push("commons-exact-search-missing");
            else {
              const downloaded = await downloadCommonsImage(candidate, { mediaDirectory, recordId: record.id, fetchImpl, sleep });
              media.push({
                kind: "image",
                url: candidate.downloadUrl,
                sourcePage: candidate.sourcePage,
                creator: candidate.creator,
                licence: candidate.licence,
                licenceUrl: candidate.licenceUrl,
                attribution: `${candidate.creator} · ${candidate.licence} · Wikimedia Commons`,
                sourceId: "wikimedia-commons",
                localPath: downloaded.localPath,
                sha256: downloaded.sha256,
                bytes: downloaded.bytes,
                mimeType: candidate.mimeType,
                width: candidate.width,
                height: candidate.height,
              });
            }
          } catch (error) {
            reasons.push(`commons-exact-search-failed:${error.message}`);
          }
        }
        return {
          recordId: record.id,
          canonicalName,
          wikipediaPage: page?.fullurl || "",
          descriptions,
          names,
          media,
          reasons,
          retrievedAt: new Date().toISOString(),
        };
      });

      await appendFile(resultsPath, `${batchResults.map((result) => JSON.stringify(result)).join("\n")}\n`, "utf8");
      for (const result of batchResults) resultById.set(result.recordId, result);
      const progress = await checkpoint("in-progress");
      options.onProgress?.(progress);
    }

    const merged = records.map((record) => {
      const enrichment = resultById.get(record.id);
      const next = structuredClone(record);
      if (enrichment) {
        next.names = uniqueBy([...next.names, ...enrichment.names], (item) => `${item.value.toLowerCase()}|${item.language}|${item.region}`);
        next.descriptions = uniqueBy([...next.descriptions, ...enrichment.descriptions], (item) => `${item.language}|${item.section}|${item.sourceId}`);
        next.media = uniqueBy([...next.media, ...enrichment.media], (item) => item.sourcePage || item.url);
        next.provenance = uniqueBy([...next.provenance, ...(enrichment.wikipediaPage ? [{
          sourceId: wikipediaSource.id,
          recordId: enrichment.wikipediaPage,
          url: enrichment.wikipediaPage,
          retrievedAt: enrichment.retrievedAt,
          rights: wikipediaSource.rights,
        }] : [])], (item) => `${item.sourceId}|${item.recordId}`);
        next.enrichment = { source: "wikimedia", reasons: enrichment.reasons, retrievedAt: enrichment.retrievedAt };
      }
      return next;
    });
    const invalid = merged.map((record) => ({ record, validation: validatePlantRecord(record) })).filter((item) => !item.validation.ok);
    if (invalid.length) throw new Error(`${invalid.length} enriched records failed schema validation`);
    await writeAtomic(enrichedPath, `${merged.map((record) => JSON.stringify(record)).join("\n")}\n`);
    const missing = [...resultById.values()].filter((result) => !result.descriptions.length || !result.media.length).map((result) => ({
      recordId: result.recordId,
      canonicalName: result.canonicalName,
      hasDescription: Boolean(result.descriptions.length),
      hasImage: Boolean(result.media.length),
      reasons: result.reasons,
    }));
    await writeJson(missingPath, missing);
    return checkpoint("complete");
  } catch (error) {
    await checkpoint("failed", error.message);
    throw error;
  }
}

async function main() {
  const manifest = await enrichWikimedia({
    ...parseArgs(process.argv.slice(2)),
    onProgress: (progress) => process.stderr.write(`processed=${progress.processedRecords}/${progress.inputRecords} descriptions=${progress.withDescription} images=${progress.withImage}\n`),
  });
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
