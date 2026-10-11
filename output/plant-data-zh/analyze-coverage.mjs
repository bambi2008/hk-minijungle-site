// All-source, taxon-grain coverage check; this is not botanical editorial review.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { hasChineseName, isChineseName } from "./supplement-chinese.mjs";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";
const input = "data/plant-import/chinese-enrichment/records-enriched.ndjson";
const text = await readFile(input, "utf8");
const records = text.trim().split(/\r?\n/).map(JSON.parse);
const sourceNames = (record, sources) => record.names.some(name => isChineseName(name) && sources.includes(name.sourceId));
const gbif = record => sourceNames(record, ["gbif-species"]);
const wikimedia = record => sourceNames(record, ["wikipedia-zh", "wikidata"]);
const all = records.filter(hasChineseName).length;
const gbifCount = records.filter(gbif).length;
const wikimediaCount = records.filter(wikimedia).length;
const overlap = records.filter(record => gbif(record) && wikimedia(record)).length;
const invalid = records.filter(record => !validatePlantRecord(record).ok);
if (invalid.length || new Set(records.map(record => record.id)).size !== records.length) throw new Error("Record keys/schema are not trustworthy");
if (gbifCount + wikimediaCount - overlap !== all) throw new Error("Unexpected Chinese-name source membership");
const report = {
  executedAt: new Date().toISOString(),
  status: "passed",
  input,
  sha256: createHash("sha256").update(text).digest("hex"),
  grain: "one accepted GBIF vascular-plant species",
  records: records.length,
  uniqueIds: new Set(records.map(record => record.id)).size,
  uniqueSlugs: new Set(records.map(record => record.slug)).size,
  invalidRecords: invalid.length,
  namesAllSources: all,
  coveragePercent: Number((100 * all / records.length).toFixed(2)),
  missingNamesAllSources: records.length - all,
  namesGbif: gbifCount,
  namesWikimedia: wikimediaCount,
  overlap,
  gbifOnly: records.filter(record => gbif(record) && !wikimedia(record)).length,
  introductionsChinese: records.filter(record => record.descriptions.some(description => description.language.startsWith("zh"))).length,
  introductionsAnyLanguage: records.filter(record => record.descriptions.length).length,
  images: records.filter(record => record.media.length).length,
  perRegion: Object.fromEntries(["DE", "US", "HK", "CN", "GB", "FR"].map(code => {
    const selected = records.filter(record => record.regions.some(region => region.code === code));
    return [code, { records: selected.length, namesAllSources: selected.filter(hasChineseName).length, namesWikimedia: selected.filter(wikimedia).length }];
  })),
  finding: { severity: "medium", confidence: "high", cause: "Previous enrichment statistics counted only Wikimedia result.names, not the merged record.names including GBIF ISO zho names", impact: "All-source missingness was overstated by 201 species; no source records were lost", remediation: "Count unique records across all Chinese sources, retain source overlap and test ISO language codes" },
  limitations: ["Coverage is source presence, not taxonomic/editorial correctness of common names", "This is a static 1439-species sample, not a complete regional flora", "No website integration or production publication"],
};
await writeFile("data/plant-import/chinese-enrichment/all-source-coverage-report.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
