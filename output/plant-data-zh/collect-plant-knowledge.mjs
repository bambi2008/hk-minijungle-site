// Collect licensed source sections for editorial work. Never declares a care profile complete.
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { cachedJson, normalize, OUT } from "./import-vegetables.mjs";
import { plants as curatedPlants } from "../../src/plantData.js";
import {loadCorrectedCatalog} from "./load-corrected-catalog.mjs";
const KNOWLEDGE = `${OUT}/knowledge`;
const sha = text => createHash("sha256").update(text).digest("hex");
export function splitSections(text) {
  const matches = [...text.matchAll(/^(={2,6})\s*(.+?)\s*\1\s*$/gm)];
  const sections = [{ heading: "Overview", level: 1, text: text.slice(0, matches[0]?.index ?? text.length).trim() }];
  for (let i = 0; i < matches.length; i++) sections.push({ heading: matches[i][2].trim(), level: matches[i][1].length, text: text.slice(matches[i].index + matches[i][0].length, matches[i+1]?.index ?? text.length).trim() });
  return sections.filter(s => s.text);
}
export function buildFullTextUrl(host, title) {
  assert.ok(["en.wikipedia.org", "zh.wikipedia.org"].includes(host));
  const url = new URL(`https://${host}/w/api.php`);
  url.search = new URLSearchParams({ action: "query", format: "json", formatversion: "2", redirects: "1", prop: "extracts|info|pageprops|pageimages", explaintext: "1", exlimit: "1", exsectionformat: "wiki", inprop: "url", piprop: "name", titles: title, maxlag: "5" }).toString();
  return url;
}
export function sourceIdentity(page, entity, expectedNames) {
  if (!entity || page.pageprops?.wikibase_item !== entity.id) return "editorial-identity-review-required";
  const names = (entity.claims?.P225 || []).filter(c => c.rank !== "deprecated" && c.mainsnak?.snaktype === "value").map(c => c.mainsnak.datavalue?.value).filter(n => typeof n === "string");
  return names.some(n => expectedNames.some(e => normalize(e) === normalize(n))) ? "exact-cached-P225" : "editorial-identity-review-required";
}
export async function collectPlantKnowledge({ fetchEntities = true } = {}) {
  await mkdir(`${KNOWLEDGE}/raw`, { recursive: true });
  await mkdir(`${KNOWLEDGE}/sources`, { recursive: true });
  const {records,crops,bindings}=await loadCorrectedCatalog();
  const entities = new Map();
  for (const file of await readdir("data/plant-import/chinese-enrichment/raw")) {
    if (!file.endsWith(".json")) continue;
    const raw = JSON.parse(await readFile(`data/plant-import/chinese-enrichment/raw/${file}`, "utf8"));
    for (const entity of Object.values(raw.payload.entities || {})) entities.set(entity.id, entity);
  }
  for(const file of await readdir(`${KNOWLEDGE}/raw`)) {
    if(!file.endsWith(".json"))continue;
    const raw=JSON.parse(await readFile(`${KNOWLEDGE}/raw/${file}`,"utf8"));
    for(const entity of Object.values(raw.payload.entities||{}))entities.set(entity.id,entity);
  }
  const requests = new Map();
  const add = (host, title, association) => {
    const key = `${host}|${title.replaceAll("_", " ")}`;
    if (!requests.has(key)) requests.set(key, { key, host, title, associations: [] });
    const entry = requests.get(key);
    if (!entry.associations.some(a => a.id === association.id)) entry.associations.push(association);
  };
  // Priority sources first. Crop and accepted-taxon identities have different grain.
  for (const crop of crops) add("en.wikipedia.org", crop.wiki, { id: crop.cropRecordId, grain: "crop", expectedNames: [crop.taxon, crop.acceptedCanonicalName].filter(Boolean), taxonRecordId: crop.taxonRecordId });
  for (const binding of bindings.filter(b => b.recordId)) add("en.wikipedia.org", binding.requestedName, { id: binding.recordId, grain: "taxon", expectedNames: [binding.requestedName, binding.acceptedCanonicalName] });
  for (const record of records) {
    const preferred = record.descriptions.find(d => d.language === "en" && d.sourcePage) || record.descriptions.find(d => d.sourceId === "wikipedia-zh" && d.sourcePage);
    if (!preferred) {
      add("en.wikipedia.org", record.taxonomy.canonicalName, { id: record.id, grain: "taxon", expectedNames: [record.taxonomy.canonicalName] });
      continue;
    }
    const url = new URL(preferred.sourcePage);
    if (!["en.wikipedia.org", "zh.wikipedia.org"].includes(url.hostname) || !url.pathname.startsWith("/wiki/")) continue;
    add(url.hostname, decodeURIComponent(url.pathname.slice(6)), { id: record.id, grain: "taxon", expectedNames: [record.taxonomy.canonicalName], originalSourcePage: preferred.sourcePage });
  }
  for (const plant of curatedPlants) {
    if (records.some(r=>r.id===plant.catalogId||normalize(r.taxonomy.canonicalName)===normalize(plant.canonicalName))) continue;
    add("en.wikipedia.org",plant.canonicalName,{id:`curated:${plant.slug}`,grain:"taxon",expectedNames:[plant.canonicalName]});
  }
  const results = [];
  let next = 0, overload = false;
  const pending = [...requests.values()];
  const save = async status => {
    const report = { status, generatedAt: new Date().toISOString(), requestedArticles: pending.length, processedArticles: results.length, downloadedArticles: results.filter(r => r.status === "source-downloaded").length, failedArticles: results.filter(r => r.status !== "source-downloaded").length, sourceSections: results.reduce((n,r)=>n+(r.sections||0),0), uniqueTaxaWithSources: new Set(results.filter(r=>r.status==="source-downloaded").flatMap(r=>r.associations.filter(a=>a.grain==="taxon").map(a=>a.id))).size, cropTypesWithSources: new Set(results.filter(r=>r.status==="source-downloaded").flatMap(r=>r.associations.filter(a=>a.grain==="crop").map(a=>a.id))).size, semanticCareProfileCompleted: false, professionalReviewCompleted: false, websiteChanged: false, publicationEligible: false, stopReason: overload ? "Wikimedia maxlag load protection" : null };
    await writeFile(`${KNOWLEDGE}/manifest.json`, JSON.stringify(report,null,2));
    return report;
  };
  async function worker() {
    while (next < pending.length && !overload) {
      const request = pending[next++];
      let cacheHit = false;
      try {
        const api = buildFullTextUrl(request.host, request.title);
        try { await stat(`${KNOWLEDGE}/raw/${sha(api.href)}.json`); cacheHit=true; } catch(e) { if(e.code!=="ENOENT") throw e; }
        const payload = await cachedJson(api, `${KNOWLEDGE}/raw`);
        const rawEvidence=JSON.parse(await readFile(`${KNOWLEDGE}/raw/${sha(api.href)}.json`,"utf8"));
        const page = payload.query?.pages?.find(p => !p.missing && p.pageid);
        assert.ok(page?.extract?.trim(), "Full article extract missing");
        assert.ok(Number.isSafeInteger(page.lastrevid) && page.lastrevid > 0, "Article revision absent");
        const url = new URL(page.fullurl);
        assert.equal(url.hostname, request.host);
        const sections = splitSections(page.extract);
        const qid = page.pageprops?.wikibase_item;
        const packet = { sourcePage: page.fullurl, sourceRevision: page.lastrevid, sourceTextSha256: sha(page.extract), wikibaseItem: qid || null, language: request.host.startsWith("zh.") ? "zh" : "en", rights: "CC BY-SA 4.0", authorCredit: "Wikipedia contributors; authors listed in the linked article history", retrievedAt: rawEvidence.retrievedAt, text: page.extract, sections, pageimage: page.pageimage || null, associations: request.associations.map(a => ({ ...a, identityStatus: sourceIdentity(page, entities.get(qid), a.expectedNames) })), semanticEditorialReviewCompleted: false, safetyReviewRequired: true, publicationEligible: false };
        const file = `${KNOWLEDGE}/sources/${sha(request.key)}.json`;
        await writeFile(file, JSON.stringify(packet,null,2));
        results.push({ key: request.key, status: "source-downloaded", sourceFile: file, sourcePage: page.fullurl, sections: sections.length, associations: packet.associations });
      } catch (e) {
        if (/API maxlag|HTTP (429|503)/.test(e.message)) overload = true;
        results.push({ key: request.key, status: "failed", error: e.message, associations: request.associations });
      }
      if (results.length % 20 === 0 || overload) {
        console.error(`full-articles=${results.length}/${pending.length} downloaded=${results.filter(r=>r.status==="source-downloaded").length}`);
        await save("in-progress");
        await writeFile(`${KNOWLEDGE}/collection-results.json`,JSON.stringify(results,null,2));
      }
      if(!cacheHit) await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
  await Promise.all([worker(),worker()]);
  // One bounded entity enrichment stage. Load protection errors leave identity pending.
  let identityFetchError = null;
  const missingEntities = [...new Set(results.filter(r=>r.status==="source-downloaded").flatMap(r=>r.associations.filter(a=>a.identityStatus!=="exact-cached-P225").map(()=>r.sourceFile)))];
  const sourcePackets = await Promise.all(missingEntities.map(async file => ({file, packet: JSON.parse(await readFile(file,"utf8"))})));
  const ids = [...new Set(sourcePackets.map(p=>p.packet.wikibaseItem).filter(id=>id&&!entities.has(id)))];
  if (fetchEntities) for (let start=0; start<ids.length; start+=20) {
    try {
      const url = new URL("https://www.wikidata.org/w/api.php");
      url.search = new URLSearchParams({action:"wbgetentities",format:"json",ids:ids.slice(start,start+20).join("|"),props:"claims",maxlag:"5"}).toString();
      const payload = await cachedJson(url,`${KNOWLEDGE}/raw`);
      for (const entity of Object.values(payload.entities||{})) entities.set(entity.id,entity);
    } catch(e) { identityFetchError=e.message; break; }
  }
  for (const row of results.filter(r=>r.status==="source-downloaded")) {
    const packet = JSON.parse(await readFile(row.sourceFile,"utf8"));
    packet.associations = packet.associations.map(a=>({...a,identityStatus:sourceIdentity({pageprops:{wikibase_item:packet.wikibaseItem}},entities.get(packet.wikibaseItem),a.expectedNames)}));
    row.associations=packet.associations;
    await writeFile(row.sourceFile,JSON.stringify(packet,null,2));
  }
  await writeFile(`${KNOWLEDGE}/collection-results.json`,JSON.stringify(results,null,2));
  const report=await save(overload?"partial-load-protection":results.some(r=>r.status!=="source-downloaded")?"collected-with-explicit-missing-sources":"source-collection-complete-editorial-pending");
  report.identityFetchError=identityFetchError;
  report.verifiedTaxonAssociations=results.flatMap(r=>r.associations).filter(a=>a.grain==="taxon"&&a.identityStatus==="exact-cached-P225").length;
  await writeFile(`${KNOWLEDGE}/manifest.json`,JSON.stringify(report,null,2));
  return report;
}
if (process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])) collectPlantKnowledge().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.stack);process.exitCode=1;});
