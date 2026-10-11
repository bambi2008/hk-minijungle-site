import {cachedJson,OUT} from "./import-vegetables.mjs";
for(const name of ["Eruca sativa","Rheum × hybridum","Sicyos edulis"]){const url=new URL("https://api.gbif.org/v1/species/match");url.search=new URLSearchParams({name,kingdom:"Plantae",strict:"true"}).toString();const result=await cachedJson(url,`${OUT}/crop-identity-check/raw`);console.log(JSON.stringify({requestedName:name,result}));}
