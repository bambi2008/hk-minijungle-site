import test from "node:test";
import assert from "node:assert/strict";
import {checkMatch, normalize} from "./import-vegetables.mjs";
import {splitSections, buildFullTextUrl, sourceIdentity} from "./collect-plant-knowledge.mjs";
import {appendUnique} from "./assemble-vegetable-knowledge.mjs";
test("assembly appends without overwriting an older source or introduction",()=>{
  const original=[{id:"one",text:"Original"}];
  const merged=appendUnique(original,[{id:"one",text:"Changed"},{id:"two",text:"New"}],v=>v.id);
  assert.deepEqual(merged,[original[0],{id:"two",text:"New"}]);
  assert.deepEqual(original,[{id:"one",text:"Original"}]);
});
test("taxonomy rejects genus/fuzzy/canonical ambiguity and preserves accepted synonym key",()=>{
  const match={matchType:"EXACT",canonicalName:"Pisum sativum",kingdom:"Plantae",rank:"SPECIES",status:"SYNONYM",usageKey:5347845,acceptedUsageKey:5347846};
  assert.equal(checkMatch("Pisum sativum",match),5347846);
  for(const change of [{matchType:"FUZZY"},{rank:"GENUS"},{canonicalName:"Pisum"},{kingdom:"Fungi"},{status:"DOUBTFUL"}]) assert.throws(()=>checkMatch("Pisum sativum",{...match,...change}));
  assert.notEqual(normalize("Plant × hybrid"),normalize("Plant hybrid"));
});
test("source parser retains exact text sections, not fabricated care fields",()=>{
  const text="Lead\n\n== Description ==\nLeaf text.\n=== Flowers ===\nFlower text.\n== Cultivation ==\nSoil text.";
  assert.deepEqual(splitSections(text),[{heading:"Overview",level:1,text:"Lead"},{heading:"Description",level:2,text:"Leaf text."},{heading:"Flowers",level:3,text:"Flower text."},{heading:"Cultivation",level:2,text:"Soil text."}]);
  assert.deepEqual(splitSections("Lead only"),[{heading:"Overview",level:1,text:"Lead only"}]);
});
test("full-source requests keep maxlag and fixed public hosts",()=>{
  const url=buildFullTextUrl("en.wikipedia.org","Tomato");
  assert.equal(url.searchParams.get("maxlag"),"5");
  assert.equal(url.searchParams.get("exlimit"),"1");
  assert.equal(url.searchParams.has("exintro"),false);
  assert.throws(()=>buildFullTextUrl("attacker.invalid","Tomato"));
});
test("source candidate is not a confirmed taxon without matching QID/P225",()=>{
  const p={pageprops:{wikibase_item:"Q1"}},e={id:"Q1",claims:{P225:[{rank:"normal",mainsnak:{snaktype:"value",datavalue:{value:"Solanum lycopersicum"}}}]}};
  assert.equal(sourceIdentity(p,e,["Solanum lycopersicum"]),"exact-cached-P225");
  assert.equal(sourceIdentity(p,e,["Solanum tuberosum"]),"editorial-identity-review-required");
  assert.equal(sourceIdentity(p,{...e,id:"Q2"},["Solanum lycopersicum"]),"editorial-identity-review-required");
  assert.equal(sourceIdentity(p,null,["Solanum lycopersicum"]),"editorial-identity-review-required");
});
test("crop groups remain distinct while taxonomic parents can repeat",async()=>{
  const {readFile}=await import("node:fs/promises");
  const p=JSON.parse(await readFile("output/plant-data-zh/vegetable-priority.json","utf8"));
  assert.equal(new Set(p.entries.map(c=>c.id)).size,p.entries.length);
  const groups=p.entries.filter(c=>c.taxon==="Brassica oleracea");
  assert.ok(groups.some(c=>c.id==="broccoli")&&groups.some(c=>c.id==="cauliflower")&&groups.some(c=>c.id==="cabbage"));
  assert.ok(p.entries.every(c=>!c.taxon.startsWith("Agaricus")));
});
test("care drafts link only specific crop types and do not certify regional suitability",async()=>{
  const {readFile}=await import("node:fs/promises");
  const care=JSON.parse(await readFile("output/plant-data-zh/crop-care-drafts.json","utf8"));
  const p=JSON.parse(await readFile("output/plant-data-zh/vegetable-priority.json","utf8"));
  const ids=new Set(p.entries.map(c=>c.id));
  for(const entry of care.entries){assert.ok(entry.sourceRegion);assert.equal(new URL(entry.sourceUrl).protocol,"https:");assert.ok(entry.cropIds.every(id=>ids.has(id)));assert.ok(Object.values(entry.fields).every(value=>typeof value==="string"&&value.trim()));}
  const broccoli=care.entries.find(e=>e.cropIds.includes("broccoli"));
  assert.deepEqual(broccoli.cropIds,["broccoli"]);
});
test("corrected crop links preserve related wild taxa and hybrid marker",async()=>{
 const {loadCorrectedCatalog}=await import("./load-corrected-catalog.mjs"),data=await loadCorrectedCatalog();
 assert.equal(data.records.length,1513);
 assert.equal(data.crops.find(c=>c.id==="rocket").taxonRecordId,"gbif-species:7474861");
 assert.equal(data.crops.find(c=>c.id==="rhubarb").taxonRecordId,"gbif-species:4037896");
 assert.ok(data.records.find(r=>r.id==="gbif-species:4037896").taxonomy.scientificName.includes("×"));
 assert.ok(data.records.some(r=>r.id==="gbif-species:2888867"));
 assert.ok(data.records.some(r=>r.id==="gbif-species:5375920"));
 assert.equal(data.activeBindings.length,75);
});
test("new care entries are explicit crop claims, not family-wide defaults",async()=>{
 const {readFile}=await import("node:fs/promises"),care=JSON.parse(await readFile("output/plant-data-zh/crop-care-next-drafts.json","utf8"));
 const {loadCorrectedCatalog}=await import("./load-corrected-catalog.mjs"),{crops}=await loadCorrectedCatalog();
 for(const e of care.entries){assert.ok(e.cropIds.every(id=>crops.some(c=>c.id===id)));assert.ok(e.sourceRegion);assert.equal(new URL(e.sourceUrl).protocol,"https:");}
 assert.deepEqual(care.entries.find(e=>e.cropIds.includes("cabbage")).cropIds,["cabbage"]);
 assert.ok(!care.entries.some(e=>e.cropIds.includes("water-spinach")));
});
