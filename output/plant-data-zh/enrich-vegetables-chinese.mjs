import { enrichChinese } from "./enrich-chinese.mjs";
await enrichChinese({ inputs:["data/plant-import/vegetables-priority/vegetable-taxa.ndjson"],outDir:"data/plant-import/vegetables-priority/chinese-enrichment",batchSize:15,resume:true,onProgress:p=>console.log(JSON.stringify(p)) }).then(r=>console.log(JSON.stringify(r,null,2)));
