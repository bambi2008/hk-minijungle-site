#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fromGbifSpecies } from "./adapters/gbif-species.mjs";
import { deduplicatePlantRecords, validatePlantRecord } from "./schema.mjs";

const adapters = { gbif: fromGbifSpecies };

function parseArgs(argv) {
  const args = { dryRun: false, publish: false, region: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--dry-run") args.dryRun = true;
    else if (token === "--publish") args.publish = true;
    else if (["--source", "--input", "--out", "--region", "--retrieved-at"].includes(token)) args[token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = argv[++index];
    else throw new Error(`Unknown argument: ${token}`);
  }
  if (!args.source || !adapters[args.source]) throw new Error(`--source must be one of: ${Object.keys(adapters).join(", ")}`);
  if (!args.input) throw new Error("--input is required and must point to a local JSON file");
  if (!args.dryRun && !args.out) throw new Error("--out is required unless --dry-run is used");
  if (/^https?:/i.test(args.input)) throw new Error("Remote input is disabled; download and review source data separately");
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const payload = JSON.parse(await readFile(inputPath, "utf8"));
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload.results) ? payload.results : [payload];
  const normalized = rows.map((row) => adapters[args.source](row, {
    region: args.region,
    retrievedAt: args.retrievedAt || "",
  }));
  const deduplicated = deduplicatePlantRecords(normalized);
  const validation = deduplicated.records.map((record) => ({ id: record.id, ...validatePlantRecord(record, { publish: args.publish }) }));
  const invalid = validation.filter((item) => !item.ok);
  const summary = {
    source: args.source,
    inputRecords: rows.length,
    normalizedRecords: deduplicated.records.length,
    invalidRecords: invalid.length,
    warnings: validation.reduce((total, item) => total + item.warnings.length, 0),
    conflicts: deduplicated.conflicts,
    dryRun: args.dryRun,
  };
  if (invalid.length) {
    process.stderr.write(`${JSON.stringify({ summary, invalid }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }
  if (!args.dryRun) {
    const outputPath = path.resolve(args.out);
    if (outputPath === inputPath) throw new Error("Input and output paths must differ");
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: args.source, records: deduplicated.records }, null, 2)}\n`, "utf8");
    summary.output = outputPath;
  }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
