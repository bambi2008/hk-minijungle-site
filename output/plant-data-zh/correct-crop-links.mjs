import {readFile,writeFile,mkdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
import {fromGbifSpecies} from "../../tools/plant-import/adapters/gbif-species.mjs";
import {cachedJson,normalize,OUT} from "./import-vegetables.mjs";
const corrections=[{cropId:"rocket",oldRecordId:"gbif-species:5375920",requestedName:"Eruca sativa",wiki:"Eruca sativa",key:7474861,evidenceUrl:"https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:1110374-2",reason:"Kew accepts the cultivated garden rocket separately from Eruca vesicaria; GBIF exact accepted match."},{cropId:"rhubarb",oldRecordId:"gbif-species:2888867",requestedName:"Rheum × hybridum",wiki:"Rhubarb",key:4037896,evidenceUrl:"https://www.rhs.org.uk/plants/113552/rheum-%C3%97-hybridum/details",reason:"RHS garden rhubarb is Rheum × hybridum, not the same archive as Rheum rhabarbarum."}];
const directory=`${OUT}/crop-identity-check`;await mkdir(directory,{recursive:true});const records=[];
for(const c of corrections){
 const matchUrl=new URL("https://api.gbif.org/v1/species/match");
 matchUrl.search=new URLSearchParams({name:c.requestedName,kingdom:"Plantae",strict:"true"}).toString();
 const match=await cachedJson(matchUrl,`${directory}/raw`);
 assert.equal(match.matchType,"EXACT");assert.equal(match.status,"ACCEPTED");assert.equal(match.usageKey,c.key);assert.equal(match.kingdom,"Plantae");assert.equal(match.rank,"SPECIES");
 if(c.requestedName.includes("×")){
  assert.ok(normalize(match.scientificName).startsWith(normalize(c.requestedName)+" "));
  assert.equal(normalize(match.canonicalName),normalize(c.requestedName.replace("× ","")));
 }else assert.equal(normalize(match.canonicalName),normalize(c.requestedName));
 const url=new URL(`https://api.gbif.org/v1/species/${c.key}`),raw=await cachedJson(url,`${directory}/raw`);
 assert.equal(raw.key,c.key);assert.equal(raw.taxonomicStatus,"ACCEPTED");
 assert.equal(normalize(raw.scientificName),normalize(match.scientificName));
 const hash=createHash("sha256").update(url.href).digest("hex"),evidence=JSON.parse(await readFile(`${directory}/raw/${hash}.json`,"utf8"));
 const r=fromGbifSpecies(raw,{retrievedAt:evidence.retrievedAt});r.review.flags.push("crop-identity-correction-not-professional-certification");records.push(r);
 c.recordId=r.id;c.acceptedCanonicalName=r.taxonomy.canonicalName;c.matchEvidenceUrl=matchUrl.href;c.hybridMarkerRetainedInScientificName=c.requestedName.includes("×");
}
await writeFile(`${directory}/records.ndjson`,records.map(r=>JSON.stringify(r)).join("\n")+"\n");await writeFile(`${directory}/corrections.json`,JSON.stringify(corrections,null,2));console.log(JSON.stringify(corrections));
