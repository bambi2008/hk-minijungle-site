// Offline append-only catalog and an honest per-record editorial backlog.
import {readFile,writeFile,readdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {validatePlantRecord} from "../../tools/plant-import/schema.mjs";
import {plants as curated} from "../../src/plantData.js";
import {OUT,normalize} from "./import-vegetables.mjs";
import {loadCorrectedCatalog} from "./load-corrected-catalog.mjs";
const sha=b=>createHash("sha256").update(b).digest("hex");
const json=async p=>JSON.parse(await readFile(p,"utf8"));
const ndjson=async p=>(await readFile(p,"utf8")).trim().split(/\r?\n/).map(JSON.parse);
export function appendUnique(original,extra,key){const out=[...original],seen=new Set(original.map(key));for(const v of extra)if(!seen.has(key(v))){out.push(v);seen.add(key(v));}return out;}
const keys={names:v=>`${v.language}|${v.value}|${v.sourceId}`,descriptions:v=>`${v.language}|${v.section}|${v.sourceId}|${v.text}`,provenance:v=>`${v.sourceId}|${v.recordId}|${v.sourceRevision||""}`,media:v=>v.sourcePage||v.url};
export const CARE_FIELDS=["morphology","habitat","light","temperature","soil","watering","propagation","maintenance","pests","safety"];
export async function assemble(){
 const basePath="data/plant-import/us-gb-fr-translated-drafts/records-enriched.ndjson",baseText=await readFile(basePath,"utf8"),corrected=await loadCorrectedCatalog(),baseline=corrected.records,byId=new Map(baseline.map(r=>[r.id,structuredClone(r)])),bindings=corrected.bindings;
 const enrichmentDirs=["wikimedia-enrichment","additional-wikimedia-enrichment","synonym-wikimedia-enrichment","corrected-wikimedia-enrichment"];
 const downloadedMedia=new Map();
 const merge=(target,extra,directory)=>{for(const field of Object.keys(keys)){const values=(extra[field]||[]).map(v=>field==="media"?{...v,importDirectory:directory,identityReviewStatus:"taxon-level-source-image; crop-cultivar-not-certified"}:v);if(field==="media"&&values.length)downloadedMedia.set(target.id,values[0]);target[field]=appendUnique(target[field],values,keys[field]);}};
 for(const dir of enrichmentDirs)for(const extra of await ndjson(`${OUT}/${dir}/records-enriched.ndjson`)){
   let target=byId.get(extra.id);
   if(!target){const binding=bindings.find(b=>`gbif-species:${b.matchUsageKey}`===extra.id&&b.recordId===extra.taxonomy.acceptedId);assert.ok(binding,"Unproven synonym enrichment");target=byId.get(binding.recordId);assert.ok(target);extra.provenance=[...extra.provenance,{sourceId:"gbif-species",recordId:String(binding.matchUsageKey),url:binding.identityMethod==="existing-exact-canonical"?extra.provenance[0].url:`https://api.gbif.org/v1/species/${binding.matchUsageKey}`,retrievedAt:extra.provenance[0].retrievedAt,rights:"GBIF taxonomy evidence; source-rights review required",acceptedRecordId:binding.recordId,requestedName:binding.requestedName}];}
   merge(target,extra,`${OUT}/${dir}`);
 }
 const chayote=await json(`${OUT}/chayote-image/image-result.json`);merge(byId.get(chayote.recordId),{media:[chayote.media]},`${OUT}/chayote-image`);
 const chineseManifest=await json(`${OUT}/chinese-enrichment/manifest.json`);assert.equal(chineseManifest.status,"complete","Chinese acquisition must finish before assembly");
 for(const extra of await json(`${OUT}/chinese-enrichment/results.json`)){const target=byId.get(extra.recordId);assert.ok(target);assert.equal(target.taxonomy.canonicalName,extra.canonicalName);if(extra.descriptions.length||extra.names.length)assert.equal(extra.identityMethod,"exact-P225-and-matching-Wikipedia-wikibase-item");merge(target,extra,`${OUT}/chinese-enrichment`);}
 const draftEntries=(await json("output/plant-data-zh/vegetable-overview-drafts.json")).entries;
 const currentSources=await json(`${OUT}/knowledge/collection-results.json`);
 for(const entry of draftEntries){
  const target=byId.get(entry.recordId);assert.ok(target);assert.ok(entry.text.trim());
  let description,provenance;
  if(entry.primarySourceUrl){const correction=corrected.corrections.find(c=>c.recordId===entry.recordId);assert.ok(correction);assert.equal(correction.evidenceUrl,entry.primarySourceUrl);description={language:"zh-cn",section:"overview",text:entry.text,sourceId:"editorial-source-summary",sourcePage:entry.primarySourceUrl,rights:"Original editorial paraphrase; source is referenced, not rehosted",derivedFrom:entry.sourceId,identityMethod:"primary-source-and-GBIF-crop-correction"};provenance={sourceId:entry.sourceId,recordId:entry.primarySourceUrl,url:entry.primarySourceUrl,retrievedAt:target.provenance[0].retrievedAt,rights:"Source reference only; original short paraphrase"};}
  else{const file=entry.sourceFile?`${OUT}/knowledge/sources/${entry.sourceFile}`:currentSources.find(r=>r.sourcePage===entry.sourcePage&&r.associations.some(a=>a.id===entry.recordId))?.sourceFile;assert.ok(file);const packet=await json(file);assert.ok(packet.associations.some(a=>a.id===entry.recordId&&a.identityStatus==="exact-cached-P225"));assert.equal(sha(packet.text),packet.sourceTextSha256);description={language:"zh-cn",section:"overview",text:entry.text,sourceId:"editorial-source-summary",sourcePage:packet.sourcePage,rights:"CC BY-SA 4.0",derivedFrom:"wikipedia-en",originalLanguage:"en",adapted:true,sourceRevision:packet.sourceRevision,sourceTextSha256:packet.sourceTextSha256};provenance={sourceId:"wikipedia-en",recordId:packet.sourcePage,url:packet.sourcePage,retrievedAt:packet.retrievedAt,rights:packet.rights,sourceRevision:packet.sourceRevision};}
  description.reviewStatus="source-derived-editorial-draft-not-professionally-reviewed";description.publicationEligible=false;merge(target,{descriptions:[description],provenance:[provenance]},OUT);
 }
 const records=[...byId.values()];
 for(const original of baseText.trim().split(/\r?\n/).map(JSON.parse)){
   const after=byId.get(original.id);for(const field of Object.keys(original))if(!Object.keys(keys).includes(field))assert.deepEqual(after[field],original[field]);
   for(const field of Object.keys(keys))assert.deepEqual(after[field].slice(0,original[field].length),original[field]);
 }
 assert.ok(records.every(r=>validatePlantRecord(r).ok));assert.equal(new Set(records.map(r=>r.id)).size,records.length);assert.equal(new Set(records.map(r=>r.slug)).size,records.length);
 const sourceResults=await json(`${OUT}/knowledge/collection-results.json`),sourcesById=new Map();let auditedArticles=0;
 const rawPages=new Map();for(const file of await readdir(`${OUT}/knowledge/raw`)){if(!file.endsWith(".json"))continue;const raw=await json(`${OUT}/knowledge/raw/${file}`);const request=new URL(raw.requestUrl);assert.ok(["en.wikipedia.org","zh.wikipedia.org","www.wikidata.org"].includes(request.hostname));assert.equal(request.protocol,"https:");for(const page of raw.payload.query?.pages||[])if(page.extract&&page.lastrevid)rawPages.set(`${page.fullurl}|${page.lastrevid}|${sha(page.extract)}`,page);}
 for(const result of sourceResults.filter(r=>r.status==="source-downloaded")){
  const packet=await json(result.sourceFile);assert.equal(sha(packet.text),packet.sourceTextSha256);assert.ok(packet.sourceRevision>0);assert.equal(packet.publicationEligible,false);assert.equal(packet.rights,"CC BY-SA 4.0");
  const page=rawPages.get(`${packet.sourcePage}|${packet.sourceRevision}|${packet.sourceTextSha256}`);assert.ok(page,"Missing matching raw article URL/revision/text hash");assert.equal(page.extract,packet.text);auditedArticles++;
  for(const a of packet.associations){if(!sourcesById.has(a.id))sourcesById.set(a.id,[]);sourcesById.get(a.id).push({sourceFile:result.sourceFile,sourcePage:packet.sourcePage,sourceRevision:packet.sourceRevision,language:packet.language,identityStatus:a.identityStatus,semanticReviewStatus:"unreviewed-source-not-a-verified-care-profile"});}
 }
 const care=await json("output/plant-data-zh/crop-care-drafts.json"),additionalCare=await json("output/plant-data-zh/crop-care-next-drafts.json"),crops=corrected.crops;assert.equal(care.language,additionalCare.language);care.entries.push(...additionalCare.entries);
 const cropKnowledge=crops.map(c=>({...c,knowledgeStatus:"source-collected-editorial-pending",sources:sourcesById.get(c.cropRecordId)||[],careDrafts:care.entries.filter(e=>e.cropIds.includes(c.id)).flatMap(e=>Object.entries(e.fields).map(([field,text])=>({field,text,language:care.language,sourceUrl:e.sourceUrl,sourceRegion:e.sourceRegion,sourceLabel:e.sourceLabel,sourceDate:e.sourceDate||null,reviewStatus:"source-backed-editorial-draft-not-professionally-reviewed",publicationEligible:false}))),missingCareFields:CARE_FIELDS.filter(f=>!care.entries.some(e=>e.cropIds.includes(c.id)&&e.fields[f])),publicationEligible:false}));
 const extras=curated.filter(p=>!records.some(r=>r.id===p.catalogId||normalize(r.taxonomy.canonicalName)===normalize(p.canonicalName)));
 const coverage=records.map(r=>({recordId:r.id,canonicalName:r.taxonomy.canonicalName,rank:r.taxonomy.rank,taxonomy:"source-normalized-not-editor-reviewed",chineseName:r.names.some(n=>/^(zh|zho|chi|cmn|yue)(-|$)/.test(n.language)&&/[\u3400-\u9fff]/u.test(n.value)),chineseOverview:r.descriptions.some(d=>d.language.startsWith("zh")&&d.text),image:r.media.length>0,sources:sourcesById.get(r.id)||[],linkedCropIds:cropKnowledge.filter(c=>c.taxonRecordId===r.id).map(c=>c.cropRecordId),missingVerifiedCareFields:[...CARE_FIELDS],professionalReviewCompleted:false,publicationEligible:false}));
 for(const p of extras)coverage.push({recordId:`curated:${p.slug}`,canonicalName:p.canonicalName,rank:"curated-profile",taxonomy:"curated-archive-not-recertified",sources:sourcesById.get(`curated:${p.slug}`)||[],missingVerifiedCareFields:[...CARE_FIELDS],professionalReviewCompleted:false,publicationEligible:false});
 const imageAudit=[];for(const binding of corrected.activeBindings){const r=byId.get(binding.recordId);assert.ok(r.media.length,`Vegetable image missing ${r.id}`);const m=downloadedMedia.get(r.id);assert.ok(m,`Missing new download evidence ${r.id}`);assert.ok(m.creator&&m.licence&&m.attribution);const filename=path.resolve(m.importDirectory,m.localPath),root=path.resolve(OUT);assert.ok(filename.startsWith(root+path.sep));const bytes=await readFile(filename);assert.equal(sha(bytes),m.sha256);assert.equal(bytes.length,m.bytes);assert.ok((m.mimeType==="image/jpeg"&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)||(m.mimeType==="image/png"&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))));imageAudit.push({recordId:r.id,sha256:m.sha256,bytes:bytes.length,licence:m.licence});}
 const manifest={status:"offline-catalog-baseline-complete-knowledge-partial",generatedAt:new Date().toISOString(),originalImportedRecords:1439,importedRecords:records.length,uniqueArchives:coverage.length,newTaxonomyRecords:records.length-1439,cropTypes:cropKnowledge.length,vegetableTaxa:corrected.activeBindings.length,vegetableTaxaWithImages:imageAudit.length,vegetableImageBytes:imageAudit.reduce((n,m)=>n+m.bytes,0),importedRecordsWithImages:coverage.slice(0,records.length).filter(r=>r.image).length,importedRecordsWithChineseNames:coverage.filter(r=>r.chineseName).length,importedRecordsWithChineseOverview:coverage.filter(r=>r.chineseOverview).length,fullSourceArticles:auditedArticles,taxonArchivesWithSources:coverage.filter(r=>r.sources.length).length,taxonArchivesWithExactIdentitySources:coverage.filter(r=>r.sources.some(s=>s.identityStatus==="exact-cached-P225")).length,cropTypesWithSources:cropKnowledge.filter(c=>c.sources.length).length,cropTypesWithChineseCareDrafts:cropKnowledge.filter(c=>c.careDrafts.length).length,chineseCareDraftFields:cropKnowledge.reduce((n,c)=>n+c.careDrafts.length,0),professionalProfilesCompleted:0,allPlantKnowledgeCompleted:false,publicationEligible:false,websiteChanged:false,originalInputSha256:sha(baseText)};
 manifest.uniqueFullSourcePages=new Set(sourceResults.filter(r=>r.status==="source-downloaded").map(r=>r.sourcePage)).size;
 manifest.fullSourceSnapshots=auditedArticles;
 manifest.vegetableTaxaWithChineseOverview=corrected.activeBindings.filter(b=>coverage.find(r=>r.recordId===b.recordId)?.chineseOverview).length;
 manifest.vegetableTaxaWithChineseNames=corrected.activeBindings.filter(b=>coverage.find(r=>r.recordId===b.recordId)?.chineseName).length;
 assert.equal(sha(await readFile(basePath)),sha(baseText));
 await writeFile(`${OUT}/records-knowledge-enriched.ndjson`,records.map(r=>JSON.stringify(r)).join("\n")+"\n");
 for(const [filename,value]of Object.entries({"crop-knowledge.json":cropKnowledge,"knowledge-coverage.json":coverage,"image-integrity.json":imageAudit,"knowledge-completeness-manifest.json":manifest}))await writeFile(`${OUT}/${filename}`,JSON.stringify(value,null,2));
 return manifest;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))assemble().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.stack);process.exitCode=1;});
