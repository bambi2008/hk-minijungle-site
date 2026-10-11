# Plant import pipeline

This folder turns reviewed local source exports into a stable plant-record format. It is intentionally offline-first: the CLI does not crawl Gardify or download remote sources.

## Current flow

```text
reviewed source export → source adapter → normalized record → validation → deduplication → JSON output → editorial review → publication
```

The first adapter accepts the JSON shape returned by the GBIF Species API. It preserves GBIF identifiers and taxonomy but flags every record for dataset-rights and regional editorial review. It does not import images, care copy or occurrence data automatically.

The GBIF downloader is the only network-enabled step. Its default `vascular` scope requests accepted species under Tracheophyta, which avoids the algae included in GBIF's broad Plantae kingdom. Use `--scope plantae` only when that wider botanical scope is intentional. The downloader saves every raw response page, writes a checkpoint after each page and caps one run at 10,000 records. Downloaded folders are ignored by Git and are never publication-ready by default.

Run a non-writing check:

```powershell
npm.cmd run plants:dry-run
```

Run the dedicated tests:

```powershell
npm.cmd run test:plants
```

Download the bounded 1,000-record sample batch:

```powershell
npm.cmd run plants:download:sample
```

Resume an interrupted batch without refetching saved pages:

```powershell
node tools/plant-import/download-gbif.mjs --scope vascular --limit 1000 --page-size 200 --out-dir data/plant-import/gbif-tracheophyta --resume
```

Enrich the complete 1,000-record batch with exact-title English Wikipedia introductions and allowlisted Wikimedia Commons lead images:

```powershell
npm.cmd run plants:enrich:wikimedia
```

The enrichment command stores raw Wikimedia responses, downloaded 1200px images, creator/licence attribution, SHA-256 checksums, enriched NDJSON and a missing/rejected report. It never substitutes fuzzy image-search results. Add `--resume` after an interrupted run.

After the lead-image pass, run the strict exact-name Commons fallback for remaining gaps:

```powershell
npm.cmd run plants:enrich:commons-fallback
```

Fallback results are accepted only when the complete canonical scientific name appears in the Commons file title or metadata. Missing matches stay in `missing-and-rejected.json`.

Create an offline normalized file after reviewing a local source export:

```powershell
node tools/plant-import/import-plants.mjs --source gbif --input reviewed-gbif.json --region US --retrieved-at 2026-10-06 --out output/plants/gbif-us.json
```

`--publish` activates stricter checks: descriptions need explicit rights and records must already be editor-reviewed. Machine-normalized records are never publishable by default.

## Adding another source

1. Add its legal and operational status to `source-manifest.mjs`.
2. Keep the adapter source-specific; never put source quirks into the shared schema.
3. Preserve record IDs, source URLs, retrieval dates and field-level rights.
4. Require explicit licences for every media item.
5. Add fixtures and offline tests before enabling network acquisition.
6. Keep sources marked `automation: disabled` until their bulk-use terms are recorded.

The six website examples in `src/plantData.js` remain editorial records. This pipeline is the staging layer for growing beyond them; it does not silently overwrite curated copy.
