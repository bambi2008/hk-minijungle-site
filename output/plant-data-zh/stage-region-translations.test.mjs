import test from "node:test";
import assert from "node:assert/strict";
import { identityEvidence, translatedDescriptions } from "./stage-region-translations.mjs";
const record = { id: "gbif-species:123", taxonomy: { canonicalName: "Fixture species", scientificName: "Fixture species Author" } };
const entity = name => ({ id: "Q1", claims: { P225: [{ rank: "normal", mainsnak: { snaktype: "value", datavalue: { value: name } } }] } });
test("exact source identity and explicit accepted synonym, never fuzzy matching", () => {
  assert.equal(identityEvidence(record, entity("Fixture species")).method, "exact-article-P225");
  const synonyms = { results: [{ key: 456, canonicalName: "Old species", acceptedKey: 123, taxonomicStatus: "SYNONYM" }] };
  assert.equal(identityEvidence(record, entity("Old species"), synonyms).method, "GBIF-explicit-accepted-synonym");
  assert.throws(() => identityEvidence(record, entity("Old species"), { results: [{ ...synonyms.results[0], acceptedKey: 999 }] }), /Unconfirmed/);
  assert.throws(() => identityEvidence(record, entity("Fixture genus")), /Unconfirmed/);
});
test("GBIF canonical hybrid omission requires explicit scientific marker", () => {
  const hybrid = { ...record, taxonomy: { canonicalName: "Fixture species", scientificName: "Fixture ×species Author" } };
  assert.equal(identityEvidence(hybrid, entity("Fixture × species")).method, "GBIF-explicit-hybrid-scientific-name");
  assert.throws(() => identityEvidence(record, entity("Fixture × species")), /Unconfirmed/);
});
test("adaptations retain rights/hash/revision/draft warning and reject absent text or unsafe source", () => {
  const draft = { name: "Fixture species", "zh-hk": "繁體測試草稿", "zh-cn": "简体测试草稿" };
  const source = { language: "en", rights: "CC BY-SA 4.0", sourcePage: "https://en.wikipedia.org/wiki/Fixture_species", text: "Fixture source text only, not botanical content." };
  const output = translatedDescriptions(record, draft, source, 1, identityEvidence(record, entity("Fixture species")));
  assert.equal(output.length, 2);
  assert.equal(output[0].derivation, "assistant-translated-summary");
  assert.equal(output[0].editorialReviewRequired, true);
  assert.equal(output[0].sourceTextSha256.length, 64);
  assert.match(output[0].text, /未經植物學/);
  assert.throws(() => translatedDescriptions(record, { ...draft, "zh-cn": "" }, source, 1, {}));
  assert.throws(() => translatedDescriptions(record, draft, { ...source, sourcePage: "https://en.wikipedia.org.bad.invalid/wiki/Fixture" }, 1, {}));
  assert.throws(() => translatedDescriptions(record, draft, source, 0, {}));
});
