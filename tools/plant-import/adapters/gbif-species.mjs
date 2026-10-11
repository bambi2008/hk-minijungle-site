import { createPlantRecord } from "../schema.mjs";
import { getPlantSource } from "../source-manifest.mjs";

function splitScientificName(scientificName, canonicalName) {
  if (!scientificName || !canonicalName || !scientificName.startsWith(canonicalName)) return { canonicalName: canonicalName || scientificName || "", authorship: "" };
  return { canonicalName, authorship: scientificName.slice(canonicalName.length).trim() };
}

export function fromGbifSpecies(raw, options = {}) {
  const source = getPlantSource("gbif-species");
  const key = String(raw.key ?? raw.usageKey ?? raw.nubKey ?? "").trim();
  const split = splitScientificName(raw.scientificName, raw.canonicalName);
  const names = (options.vernacularNames || raw.vernacularNames || []).map((name) => ({
    value: name.vernacularName || name.value,
    language: name.language || name.lang || "und",
    region: options.region || "",
    sourceId: source.id,
  })).filter((name) => name.value);
  const regions = options.region ? [{
    code: options.region,
    presence: options.presence || "recorded",
    nativeStatus: options.nativeStatus || "unknown",
    sourceId: source.id,
  }] : [];
  return createPlantRecord({
    id: `${source.id}:${key}`,
    sourceId: source.id,
    sourceRecordId: key,
    taxonomy: {
      scientificName: raw.scientificName,
      canonicalName: split.canonicalName,
      authorship: raw.authorship || split.authorship,
      rank: raw.rank,
      status: raw.taxonomicStatus || raw.status || "UNKNOWN",
      acceptedId: raw.acceptedKey ? `${source.id}:${raw.acceptedKey}` : "",
      kingdom: raw.kingdom,
      phylum: raw.phylum,
      className: raw.class,
      order: raw.order,
      family: raw.family,
      genus: raw.genus,
    },
    names,
    regions,
    descriptions: [],
    traits: {},
    media: [],
    provenance: [{
      sourceId: source.id,
      recordId: key,
      url: `${source.apiBase}/${encodeURIComponent(key)}`,
      retrievedAt: options.retrievedAt || "",
      rights: source.rights,
    }],
    review: {
      state: "machine-normalized",
      flags: ["dataset-rights-review-required", "regional-editorial-review-required"],
    },
  });
}
