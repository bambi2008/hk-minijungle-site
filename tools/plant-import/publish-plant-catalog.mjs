import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deduplicatePlantRecords, validatePlantRecord } from "./schema.mjs";

const countryRegions = { DE: "germany", US: "usa", HK: "hong-kong", CN: "mainland-china", GB: "uk", FR: "france" };

function resolveWithinProject(target, cwd, label) {
  const resolved = path.resolve(cwd, target);
  const relative = path.relative(cwd, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} must be inside the current project`);
  return resolved;
}

async function readNdjson(filePath) {
  const contents = await readFile(filePath, "utf8");
  return contents.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function firstEnglishName(record) {
  return record.names?.find((name) => name.language === "en" && name.type === "common")?.value || record.taxonomy.canonicalName;
}

export function toPublicCatalogRecord(record) {
  const description = record.descriptions?.find((item) => item.language === "en" && item.section === "overview");
  const media = record.media?.find((item) => item.sourceId === "wikimedia-commons" && item.localPath);
  const gbif = record.provenance?.find((item) => item.sourceId === "gbif-species");
  const wikipedia = record.provenance?.find((item) => item.sourceId === "wikipedia-en");
  const imageFile = media ? path.basename(media.localPath) : "";
  const regionalEvidence = (record.regions || []).filter(region => countryRegions[region.code]).map(region => ({
    regionId: countryRegions[region.code],
    code: region.code,
    occurrenceCount: region.occurrenceCount ?? null,
    presence: region.presence,
    nativeStatus: region.nativeStatus,
    url: region.evidenceUrl || "",
    retrievedAt: region.retrievedAt || "",
  }));
  return {
    id: record.id,
    slug: record.slug,
    catalog: true,
    name: { en: firstEnglishName(record), "zh-hk": record.taxonomy.canonicalName },
    localName: { en: firstEnglishName(record), "zh-hk": "中文名稱待校訂" },
    scientificName: record.taxonomy.scientificName,
    canonicalName: record.taxonomy.canonicalName,
    regionIds: [...new Set(regionalEvidence.map(region => region.regionId))],
    regionalEvidence,
    family: record.taxonomy.family,
    taxonomy: {
      kingdom: record.taxonomy.kingdom,
      phylum: record.taxonomy.phylum,
      className: record.taxonomy.className,
      order: record.taxonomy.order,
      genus: record.taxonomy.genus,
      rank: record.taxonomy.rank,
      status: record.taxonomy.status,
    },
    summary: {
      en: description?.text || `A source-labelled taxonomic record for ${record.taxonomy.canonicalName}. An editorial plant profile has not yet been added.`,
      "zh-hk": description ? "目前提供英文來源導言；中文編輯摘要待校訂。" : "目前提供來源型分類資料；中文編輯摘要及養護資料待校訂。",
    },
    hasDescription: Boolean(description),
    image: imageFile ? `/images/plants/catalog/${imageFile}` : "",
    imageAlt: { en: `${record.taxonomy.canonicalName} plant photograph`, "zh-hk": `${record.taxonomy.canonicalName} 植物圖片` },
    imageCredit: media ? {
      author: media.creator,
      license: media.licence,
      licenseUrl: media.licenceUrl,
      sourceUrl: media.sourcePage,
      sha256: media.sha256,
    } : null,
    sources: [
      ...(gbif ? [{ label: "GBIF Species", url: gbif.url, type: "taxonomy", rights: gbif.rights }] : []),
      ...(wikipedia ? [{ label: "English Wikipedia", url: wikipedia.url, type: "introductory text", rights: wikipedia.rights }] : []),
      ...regionalEvidence.filter(region => region.url).map(region => ({ label: `GBIF Occurrence · ${region.code}`, url: region.url, type: "regional records", rights: "Aggregated occurrence evidence; native status unknown." })),
    ],
    review: record.review,
  };
}

async function mapLimit(values, concurrency, task) {
  let index = 0;
  async function worker() {
    while (index < values.length) {
      const current = index++;
      await task(values[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
}

export async function publishPlantCatalog({ cwd = process.cwd(), input, mediaSource, inputs, jsonOut, mediaOut }) {
  const batches = inputs || [{ input, mediaSource }];
  const normalized = [];
  const mediaFiles = new Map();
  for (const batch of batches) {
    const inputPath = resolveWithinProject(batch.input, cwd, "input");
    const sourceDirectory = resolveWithinProject(batch.mediaSource, cwd, "mediaSource");
    const batchRecords = await readNdjson(inputPath);
    for (const record of batchRecords) {
      const validation = validatePlantRecord(record);
      if (!validation.ok) throw new Error(`Invalid catalogue input ${record.id}: ${validation.errors.join(", ")}`);
      normalized.push(record);
      for (const media of record.media || []) {
        if (!media.localPath) continue;
        const fileName = path.basename(media.localPath);
        if (!mediaFiles.has(fileName)) mediaFiles.set(fileName, path.join(sourceDirectory, fileName));
      }
    }
  }
  const deduplicated = deduplicatePlantRecords(normalized);
  if (deduplicated.conflicts.length) throw new Error("Conflicting taxonomy requires review before catalogue generation");
  const jsonDirectory = resolveWithinProject(jsonOut, cwd, "jsonOut");
  const mediaDirectory = resolveWithinProject(mediaOut, cwd, "mediaOut");
  const records = deduplicated.records.map(toPublicCatalogRecord);
  await Promise.all([mkdir(jsonDirectory, { recursive: true }), mkdir(mediaDirectory, { recursive: true })]);
  const withImage = records.filter((record) => record.image);
  await mapLimit(withImage, 8, async (record) => {
    const fileName = path.basename(record.image);
    await copyFile(mediaFiles.get(fileName), path.join(mediaDirectory, fileName));
  });
  const manifest = {
    generatedAt: new Date().toISOString(),
    records: records.length,
    descriptions: records.filter((record) => record.hasDescription).length,
    images: withImage.length,
    regionalRecords: records.filter(record => record.regionIds.length).length,
    regionCounts: Object.fromEntries(Object.values(countryRegions).map(region => [region, records.filter(record => record.regionIds.includes(region)).length])),
    publicationState: "machine-staged",
    source: "GBIF + English Wikipedia + Wikimedia Commons",
  };
  await Promise.all([
    writeFile(path.join(jsonDirectory, "index.json"), JSON.stringify(records), "utf8"),
    writeFile(path.join(jsonDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  ]);
  return manifest;
}

async function main() {
  const inputs = [{ input: "data/plant-import/gbif-tracheophyta/wikimedia-enrichment/records-enriched.ndjson", mediaSource: "data/plant-import/gbif-tracheophyta/wikimedia-enrichment/media" }];
  try {
    const regionalManifest = JSON.parse(await readFile("data/plant-import/gbif-regions/wikimedia-enrichment/manifest.json", "utf8"));
    if (regionalManifest.status !== "complete") throw new Error("Regional enrichment must finish before catalogue generation");
    inputs.push({ input: "data/plant-import/gbif-regions/wikimedia-enrichment/records-enriched.ndjson", mediaSource: "data/plant-import/gbif-regions/wikimedia-enrichment/media" });
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  const manifest = await publishPlantCatalog({
    inputs,
    jsonOut: "public/data/plant-catalog",
    mediaOut: "public/images/plants/catalog",
  });
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
