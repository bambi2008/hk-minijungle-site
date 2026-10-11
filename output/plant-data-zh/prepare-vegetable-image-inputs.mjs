import { readFile, writeFile } from "node:fs/promises";
const directory="data/plant-import/vegetables-priority";
const old=(await readFile(`${directory}/wikimedia-enrichment/records-enriched.ndjson`,"utf8")).trim().split(/\r?\n/).map(JSON.parse);
const current=(await readFile(`${directory}/vegetable-taxa.ndjson`,"utf8")).trim().split(/\r?\n/).map(JSON.parse);
const oldIds=new Set(old.map(r=>r.id));
await writeFile(`${directory}/image-recovery-input.ndjson`,`${old.map(r=>JSON.stringify(r)).join("\n")}\n`);
const added=current.filter(r=>!oldIds.has(r.id));
await writeFile(`${directory}/additional-vegetable-taxa.ndjson`,`${added.map(r=>JSON.stringify(r)).join("\n")}\n`);
console.log(JSON.stringify({recoveryRecords:old.length,additionalRecords:added.length}));
