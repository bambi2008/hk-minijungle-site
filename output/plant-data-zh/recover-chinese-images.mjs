// Offline supplement using only identity-verified Chinese Wikipedia lead files.
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCommonsBatchUrl } from "../../tools/plant-import/enrich-wikimedia.mjs";
import { getPlantSource } from "../../tools/plant-import/source-manifest.mjs";
import { validatePlantRecord } from "../../tools/plant-import/schema.mjs";

const OUT = "data/plant-import/chinese-enrichment";
const MAX_BYTES = 8 * 1024 * 1024;
const MIME = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const IMAGE_HOSTS = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const text = value => String(value || "").replace(/<[^>]*>/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

export function imageCandidate(page) {
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error("image-metadata-missing");
  const value = name => info.extmetadata?.[name]?.value || "";
  let licence = text(value("LicenseShortName")).replace(/Creative Commons/gi, "CC").toUpperCase();
  if (/^CC0(?: 1\.0)?$/.test(licence)) licence = "CC0 1.0";
  if (licence === "PUBLIC DOMAIN") licence = "Public domain";
  if (!getPlantSource("wikimedia-commons").allowedLicences.includes(licence)) throw new Error(`licence-rejected:${licence}`);
  if (!MIME[info.mime]) throw new Error(`mime-rejected:${info.mime}`);
  const creator = text(value("Artist") || value("Credit"));
  const sourcePage = info.descriptionurl;
  const url = info.thumburl || info.url;
  if (!creator || !sourcePage || !url) throw new Error("attribution-incomplete");
  const remote = new URL(url);
  const source = new URL(sourcePage);
  if (remote.protocol !== "https:" || !IMAGE_HOSTS.has(remote.hostname) || source.protocol !== "https:" || source.hostname !== "commons.wikimedia.org") throw new Error("unapproved-image-or-source-host");
  return { kind: "image", url, sourcePage, creator, licence, licenceUrl: value("LicenseUrl"), attribution: `${creator} · ${licence} · Wikimedia Commons`, sourceId: "wikimedia-commons", mimeType: info.mime, width: info.thumbwidth || info.width, height: info.thumbheight || info.height };
}

export function verifyImage(buffer, mimeType) {
  if (buffer.length > MAX_BYTES || !buffer.length) throw new Error("image-size-rejected");
  const valid = mimeType === "image/jpeg" ? buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
    : mimeType === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : mimeType === "image/webp" && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  if (!valid) throw new Error("image-signature-rejected");
}

async function request(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000), headers: { "Api-User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.3", "User-Agent": "HK-MINIJUNGLE-offline-plant-data/0.3 (https://hkminijungle.com/)" } });
      if (!response.ok) {
        const error = new Error(`HTTP-${response.status}`);
        error.permanent = response.status < 500 && response.status !== 429;
        throw error;
      }
      return response;
    } catch (error) {
      if (error.permanent || attempt === 3) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
}

export async function recoverChineseImages() {
  const manifest = JSON.parse(await readFile(path.join(OUT, "manifest.json"), "utf8"));
  if (manifest.status !== "complete") throw new Error("Chinese acquisition must finish first");
  const records = (await readFile(path.join(OUT, "records-enriched.ndjson"), "utf8")).split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  const missing = records.filter(record => record.regions.length && !record.media.length && record.chineseEnrichment?.entityId);
  if (missing.length > 20) throw new Error("This recovery is bounded to 20 identity-verified missing regional images");
  const pages = new Map();
  for (const file of await readdir(path.join(OUT, "raw"))) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(await readFile(path.join(OUT, "raw", file), "utf8"));
    if (new URL(raw.requestUrl).hostname !== "zh.wikipedia.org") continue;
    for (const page of raw.payload.query?.pages || []) if (page.pageprops?.page_image_free && page.pageprops.wikibase_item) pages.set(page.pageprops.wikibase_item, page);
  }
  await mkdir(path.join(OUT, "media"), { recursive: true });
  await mkdir(path.join(OUT, "raw", "image-recovery"), { recursive: true });
  const attempts = [];
  let recovered = 0;
  for (const record of missing) {
    const page = pages.get(record.chineseEnrichment.entityId);
    const result = { recordId: record.id, canonicalName: record.taxonomy.canonicalName, entityId: record.chineseEnrichment.entityId, chineseArticle: page?.fullurl || "", fileTitle: page?.pageprops.page_image_free || "", recovered: false };
    try {
      if (!result.fileTitle) throw new Error("verified-chinese-lead-image-missing");
      const payload = await (await request(buildCommonsBatchUrl([result.fileTitle]))).json();
      if (payload.error) throw new Error(`commons-api:${payload.error.code}`);
      await writeFile(path.join(OUT, "raw", "image-recovery", `${record.id.replace(/[^a-z0-9-]/gi, "-")}.json`), JSON.stringify({ requestUrl: buildCommonsBatchUrl([result.fileTitle]).href, retrievedAt: new Date().toISOString(), payload }, null, 2));
      const expected = `File:${result.fileTitle}`.replaceAll("_", " ").toLowerCase();
      const commonsPage = payload.query?.pages?.find(item => item.title?.replaceAll("_", " ").toLowerCase() === expected);
      const media = imageCandidate(commonsPage);
      const response = await request(new URL(media.url));
      if (response.headers.get("content-type")?.split(";")[0] !== media.mimeType) throw new Error("image-mime-mismatch");
      if (Number(response.headers.get("content-length")) > MAX_BYTES) throw new Error("image-size-rejected");
      const chunks = [];
      let bytes = 0;
      for await (const chunk of response.body) {
        bytes += chunk.length;
        if (bytes > MAX_BYTES) throw new Error("image-size-rejected");
        chunks.push(Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);
      verifyImage(buffer, media.mimeType);
      media.localPath = `media/${record.id.replace(/[^a-z0-9-]/gi, "-")}.${MIME[media.mimeType]}`;
      media.localRoot = OUT;
      media.sha256 = hash(buffer);
      media.bytes = buffer.length;
      media.identityEvidence = { entityId: result.entityId, article: result.chineseArticle, method: "exact-P225-matching-Chinese-page-lead-file" };
      await writeFile(path.join(OUT, media.localPath), buffer);
      record.media.push(media);
      result.recovered = true;
      result.media = media;
      recovered += 1;
    } catch (error) { result.reason = error.message; }
    attempts.push(result);
    console.error(`${record.taxonomy.canonicalName}: ${result.recovered ? "recovered" : result.reason}`);
  }
  for (const record of records) if (!validatePlantRecord(record).ok) throw new Error(`Invalid recovered record ${record.id}`);
  for (const result of attempts.filter(result => result.recovered)) {
    const buffer = await readFile(path.join(OUT, result.media.localPath));
    verifyImage(buffer, result.media.mimeType);
    if (hash(buffer) !== result.media.sha256) throw new Error("Saved image hash mismatch");
  }
  await writeFile(path.join(OUT, "records-with-photos.ndjson"), `${records.map(record => JSON.stringify(record)).join("\n")}\n`);
  const report = { status: "complete", attempted: missing.length, recovered, imageBytes: attempts.reduce((sum, result) => sum + (result.media?.bytes || 0), 0), verifiedHashesAndSignatures: recovered, updatedAt: new Date().toISOString(), totalRecords: records.length, totalImages: records.filter(record => record.media.length).length, missingRegionalImages: records.filter(record => record.regions.length && !record.media.length).length, publicationEligible: false, websiteChanged: false, attempts };
  await writeFile(path.join(OUT, "image-recovery-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) recoverChineseImages().then(report => console.log(JSON.stringify({ ...report, attempts: undefined }, null, 2))).catch(error => { console.error(error.stack); process.exitCode = 1; });
