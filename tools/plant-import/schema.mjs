import { getPlantSource } from "./source-manifest.mjs";

const ALLOWED_RANKS = new Set(["SPECIES", "SUBSPECIES", "VARIETY", "FORM", "HYBRID", "GENUS"]);
const ALLOWED_STATUSES = new Set(["ACCEPTED", "SYNONYM", "DOUBTFUL", "PROVISIONAL", "UNKNOWN"]);
const ALLOWED_REVIEW_STATES = new Set(["unreviewed", "machine-normalized", "editor-reviewed", "published"]);
const REGION_CODES = new Set(["DE", "US", "HK", "CN", "GB", "FR"]);

export const plantRecordSchemaVersion = "1.0.0";

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeScientificName(value) {
  return cleanText(value).replace(/\s×\s/g, " × ");
}

export function plantSlug(value) {
  return normalizeScientificName(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+×\s+/g, "-x-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createPlantRecord(input) {
  const canonicalName = normalizeScientificName(input.taxonomy?.canonicalName || input.taxonomy?.scientificName);
  const scientificName = normalizeScientificName(input.taxonomy?.scientificName || canonicalName);
  const sourceId = cleanText(input.provenance?.[0]?.sourceId || input.sourceId);
  const sourceRecordId = cleanText(input.provenance?.[0]?.recordId || input.sourceRecordId);
  return {
    schemaVersion: plantRecordSchemaVersion,
    id: cleanText(input.id || `${sourceId}:${sourceRecordId}`),
    slug: cleanText(input.slug || plantSlug(canonicalName)),
    taxonomy: {
      scientificName,
      canonicalName,
      authorship: cleanText(input.taxonomy?.authorship),
      rank: cleanText(input.taxonomy?.rank || "SPECIES").toUpperCase(),
      status: cleanText(input.taxonomy?.status || "UNKNOWN").toUpperCase(),
      acceptedId: cleanText(input.taxonomy?.acceptedId),
      kingdom: cleanText(input.taxonomy?.kingdom),
      phylum: cleanText(input.taxonomy?.phylum),
      className: cleanText(input.taxonomy?.className),
      order: cleanText(input.taxonomy?.order),
      family: cleanText(input.taxonomy?.family),
      genus: cleanText(input.taxonomy?.genus),
    },
    names: (input.names || []).map((name) => ({
      value: cleanText(name.value),
      language: cleanText(name.language || "und").toLowerCase(),
      type: cleanText(name.type || "common"),
      region: cleanText(name.region).toUpperCase(),
      sourceId: cleanText(name.sourceId || sourceId),
    })),
    regions: (input.regions || []).map((region) => ({
      code: cleanText(region.code).toUpperCase(),
      presence: cleanText(region.presence || "unknown"),
      nativeStatus: cleanText(region.nativeStatus || "unknown"),
      sourceId: cleanText(region.sourceId || sourceId),
      ...(region.occurrenceCount != null ? { occurrenceCount: Number(region.occurrenceCount) } : {}),
      ...(region.evidenceUrl ? { evidenceUrl: cleanText(region.evidenceUrl) } : {}),
      ...(region.retrievedAt ? { retrievedAt: cleanText(region.retrievedAt) } : {}),
    })),
    descriptions: (input.descriptions || []).map((description) => ({
      language: cleanText(description.language || "und").toLowerCase(),
      section: cleanText(description.section || "overview"),
      text: cleanText(description.text),
      sourceId: cleanText(description.sourceId || sourceId),
      rights: cleanText(description.rights),
    })),
    traits: input.traits && typeof input.traits === "object" ? input.traits : {},
    media: (input.media || []).map((media) => ({
      kind: cleanText(media.kind || "image"),
      url: cleanText(media.url),
      sourcePage: cleanText(media.sourcePage),
      creator: cleanText(media.creator),
      licence: cleanText(media.licence),
      licenceUrl: cleanText(media.licenceUrl),
      attribution: cleanText(media.attribution),
      sourceId: cleanText(media.sourceId),
      localPath: cleanText(media.localPath),
      sha256: cleanText(media.sha256),
      mimeType: cleanText(media.mimeType),
      width: Number.isFinite(Number(media.width)) ? Number(media.width) : null,
      height: Number.isFinite(Number(media.height)) ? Number(media.height) : null,
    })),
    provenance: (input.provenance || []).map((source) => ({
      sourceId: cleanText(source.sourceId),
      recordId: cleanText(source.recordId),
      url: cleanText(source.url),
      retrievedAt: cleanText(source.retrievedAt),
      rights: cleanText(source.rights),
    })),
    review: {
      state: cleanText(input.review?.state || "machine-normalized"),
      flags: [...new Set((input.review?.flags || []).map(cleanText).filter(Boolean))],
      reviewedBy: cleanText(input.review?.reviewedBy),
      reviewedAt: cleanText(input.review?.reviewedAt),
    },
  };
}

export function validatePlantRecord(record, { publish = false } = {}) {
  const errors = [];
  const warnings = [];
  const required = [
    ["id", record.id],
    ["slug", record.slug],
    ["taxonomy.scientificName", record.taxonomy?.scientificName],
    ["taxonomy.canonicalName", record.taxonomy?.canonicalName],
    ["taxonomy.rank", record.taxonomy?.rank],
  ];
  for (const [field, value] of required) if (!cleanText(value)) errors.push(`${field} is required`);
  if (record.schemaVersion !== plantRecordSchemaVersion) errors.push(`schemaVersion must be ${plantRecordSchemaVersion}`);
  if (!ALLOWED_RANKS.has(record.taxonomy?.rank)) errors.push(`Unsupported taxonomic rank: ${record.taxonomy?.rank}`);
  if (!ALLOWED_STATUSES.has(record.taxonomy?.status)) errors.push(`Unsupported taxonomic status: ${record.taxonomy?.status}`);
  if (!ALLOWED_REVIEW_STATES.has(record.review?.state)) errors.push(`Unsupported review state: ${record.review?.state}`);
  if (!record.provenance?.length) errors.push("At least one provenance entry is required");
  record.provenance?.forEach((source, index) => {
    if (!source.sourceId) errors.push(`provenance[${index}].sourceId is required`);
    if (!source.recordId) errors.push(`provenance[${index}].recordId is required`);
    if (!source.url) warnings.push(`provenance[${index}].url is missing`);
  });
  record.names?.forEach((name, index) => {
    if (!name.value) errors.push(`names[${index}].value is required`);
    if (!name.sourceId) errors.push(`names[${index}].sourceId is required`);
  });
  record.regions?.forEach((region, index) => {
    if (!REGION_CODES.has(region.code)) errors.push(`regions[${index}].code must be one of ${[...REGION_CODES].join(", ")}`);
    if (!region.sourceId) errors.push(`regions[${index}].sourceId is required`);
    if (region.occurrenceCount != null && (!Number.isSafeInteger(region.occurrenceCount) || region.occurrenceCount < 1)) errors.push(`regions[${index}].occurrenceCount must be a positive integer`);
  });
  record.descriptions?.forEach((description, index) => {
    if (!description.text) errors.push(`descriptions[${index}].text is required`);
    if (!description.sourceId) errors.push(`descriptions[${index}].sourceId is required`);
    if (publish && !description.rights) errors.push(`descriptions[${index}].rights is required for publication`);
  });
  record.media?.forEach((media, index) => {
    for (const field of ["url", "sourcePage", "creator", "licence", "sourceId"]) {
      if (!media[field]) errors.push(`media[${index}].${field} is required`);
    }
    if (media.sourceId === "wikimedia-commons") {
      const allowed = getPlantSource("wikimedia-commons").allowedLicences;
      if (!allowed.includes(media.licence)) errors.push(`media[${index}].licence is not in the Wikimedia Commons allowlist`);
    }
  });
  if (publish && record.review?.state !== "editor-reviewed" && record.review?.state !== "published") {
    errors.push("An editor-reviewed record is required for publication");
  }
  if (!record.taxonomy?.family) warnings.push("taxonomy.family is missing");
  if (!record.names?.length) warnings.push("No vernacular names are present");
  if (!record.regions?.length) warnings.push("No target-region assertion is present");
  return { ok: errors.length === 0, errors, warnings };
}

export function deduplicatePlantRecords(records) {
  const byTaxon = new Map();
  const conflicts = [];
  for (const record of records) {
    const key = `${record.taxonomy.canonicalName.toLowerCase()}|${record.taxonomy.rank}`;
    const current = byTaxon.get(key);
    if (!current) {
      byTaxon.set(key, structuredClone(record));
      continue;
    }
    const hasStatusConflict = current.taxonomy.status !== record.taxonomy.status;
    if (hasStatusConflict) {
      conflicts.push({ key, field: "taxonomy.status", values: [current.taxonomy.status, record.taxonomy.status] });
    }
    current.names = uniqueObjects([...current.names, ...record.names], (item) => `${item.value.toLowerCase()}|${item.language}|${item.region}`);
    current.regions = uniqueObjects([...current.regions, ...record.regions], (item) => `${item.code}|${item.presence}|${item.nativeStatus}`);
    current.descriptions = uniqueObjects([...current.descriptions, ...record.descriptions], (item) => `${item.language}|${item.section}|${item.sourceId}`);
    current.media = uniqueObjects([...current.media, ...record.media], (item) => item.sourcePage || item.url);
    current.provenance = uniqueObjects([...current.provenance, ...record.provenance], (item) => `${item.sourceId}|${item.recordId}`);
    current.review.flags = [...new Set([...current.review.flags, ...record.review.flags, ...(hasStatusConflict ? ["deduplication-conflict"] : [])])];
  }
  return { records: [...byTaxon.values()], conflicts };
}

function uniqueObjects(values, keyFor) {
  return [...new Map(values.map((value) => [keyFor(value), value])).values()];
}
