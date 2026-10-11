import {readFile,readdir,writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import {fromGbifSpecies} from "../../tools/plant-import/adapters/gbif-species.mjs";
const dir="data/plant-import/vegetables-priority";
for(const file of await readdir(`${dir}/raw`)){
  const raw=JSON.parse(await readFile(`${dir}/raw/${file}`,"utf8"));
  const url=new URL(raw.requestUrl);
  if(url.pathname!=="/v1/species/match"||url.searchParams.get("name")!=="Scorzonera hispanica")continue;
  const m=raw.payload;
  assert.equal(m.matchType,"EXACT");assert.equal(m.status,"SYNONYM");
  const record=fromGbifSpecies({...m,key:m.usageKey,taxonomicStatus:m.status,acceptedKey:m.acceptedUsageKey},{retrievedAt:raw.retrievedAt});
  record.provenance[0].url=raw.requestUrl;
  record.review.flags.push("synonym-image-query-only-not-additional-catalogue-species");
  await writeFile(`${dir}/synonym-image-query.ndjson`,`${JSON.stringify(record)}\n`);
  console.log(JSON.stringify({queryTaxon:record.taxonomy.canonicalName,synonymId:record.id,acceptedId:record.taxonomy.acceptedId}));
}
