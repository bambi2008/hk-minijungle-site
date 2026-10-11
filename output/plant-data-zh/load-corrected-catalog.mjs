import {readFile} from "node:fs/promises";
import assert from "node:assert/strict";
import {OUT} from "./import-vegetables.mjs";
const json=async p=>JSON.parse(await readFile(p,"utf8"));
const ndjson=async p=>(await readFile(p,"utf8")).trim().split(/\r?\n/).map(JSON.parse);
export async function loadCorrectedCatalog(){
 const records=await ndjson(`${OUT}/records-enriched.ndjson`),extra=await ndjson(`${OUT}/crop-identity-check/records.ndjson`),corrections=await json(`${OUT}/crop-identity-check/corrections.json`),bindings=await json(`${OUT}/taxonomy-bindings.json`),originalCrops=await json(`${OUT}/crop-profiles.json`);
 for(const r of extra){assert.ok(!records.some(x=>x.id===r.id));records.push(r);}
 const crops=originalCrops.map(c=>{const change=corrections.find(x=>x.cropId===c.id);if(!change)return c;assert.equal(c.taxonRecordId,change.oldRecordId);return {...c,taxon:change.requestedName,wiki:change.wiki,taxonRecordId:change.recordId,acceptedCanonicalName:change.acceptedCanonicalName,taxonomyCorrection:{oldRecordId:change.oldRecordId,reason:change.reason,evidenceUrl:change.evidenceUrl,matchEvidenceUrl:change.matchEvidenceUrl},taxonomyStatus:"linked-corrected-source-backed-editorial-pending"};});
 const activeIds=new Set(crops.map(c=>c.taxonRecordId));
 const activeBindings=[...bindings.filter(b=>activeIds.has(b.recordId)),...corrections.map(c=>({requestedName:c.requestedName,recordId:c.recordId,acceptedCanonicalName:c.acceptedCanonicalName,identityMethod:"GBIF-exact-accepted-crop-correction",evidenceUrl:c.matchEvidenceUrl}))];
 assert.equal(new Set(activeBindings.map(b=>b.recordId)).size,activeIds.size);
 return {records,crops,bindings:[...bindings,...activeBindings.filter(b=>!bindings.some(x=>x.recordId===b.recordId))],activeBindings,corrections};
}
