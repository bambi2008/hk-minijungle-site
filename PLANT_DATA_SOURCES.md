# Plant library sources and licences

The plant library is a first-stage, source-labelled dataset. It currently contains six regional examples and a schema designed for later bulk import; it does **not** claim to contain every plant in the linked databases.

## Knowledge sources

| Region | Plant | Primary sources |
|---|---|---|
| Germany | *Quercus robur* | [FloraWeb](https://www.floraweb.de/php/artenhome.php?suchnr=4685) |
| United States | *Echinacea purpurea* | [Kew Plants of the World Online](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1174497-2/general-information), [USDA Plant Guide](https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_ecpu.pdf) |
| Hong Kong | *Bauhinia × blakeana* | [Hong Kong Herbarium](https://www.herbarium.gov.hk/en/special-topics/hong-kong-plants/hong-kong-plants-detail/index-id-2.html), [Hong Kong Plant Database](https://herbarium.gov.hk/en/hk-plant-database/index.html) |
| Mainland China | *Ginkgo biloba* | [Flora of China](https://www.efloras.org/florataxon.aspx?flora_id=3&taxon_id=200005235) |
| United Kingdom | *Digitalis purpurea* | [Royal Horticultural Society](https://www.rhs.org.uk/plants/5862/digitalis-purpurea/details) |
| France | *Lavandula angustifolia* | [Tela Botanica](https://www.tela-botanica.org/eflore/?action=fiche&module=fiche&num_nom=38072&onglet=synthese&referentiel=bdtfx), [Kew](https://www.kew.org/plants/english-lavender), [Kew Plants of the World Online](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A449008-1/general-information) |

Site copy is an original bilingual summary of the cited facts. It is not copied from Gardify and is not a substitute for professional horticultural, medical or food-safety advice.

## Images

All six images are stored locally under `public/images/plants/` and linked back to their Wikimedia Commons source from the plant-detail page.

| File | Author | Licence |
|---|---|---|
| `quercus-robur.jpg` | Ivar Leidus | CC BY-SA 4.0 |
| `echinacea-purpurea.jpg` | Diego Delso | CC BY-SA 3.0 |
| `bauhinia-blakeana.jpg` | Dinkun Chen | CC BY-SA 4.0 |
| `ginkgo-biloba.jpg` | Franz van Duns | CC BY-SA 4.0 |
| `digitalis-purpurea.jpg` | H. Zell | CC BY-SA 3.0 |
| `lavandula-angustifolia.jpg` | Валерія Матвєєва | CC0 1.0 |

## Recognition boundary

`src/plantRecognition.js` defines validation and a provider-neutral contract only. The current prototype keeps uploaded images in the browser, makes no external recognition request, and returns `model-not-configured`. A production provider must add explicit consent, retention terms, secrets handling, rate limits, server-side validation and a privacy notice.

## Bulk import staging

`tools/plant-import/` provides the offline staging layer for future catalogue growth. It currently normalizes reviewed GBIF Species API JSON, preserves source identifiers, validates provenance and media attribution, merges duplicate taxa and blocks machine-normalized records from publication. Regional sources remain disabled for automation until their bulk-use terms are documented.

`tools/plant-import/download-gbif.mjs` is the bounded acquisition step. Its recommended `vascular` scope uses GBIF's accepted Tracheophyta phylum (`7707728`); `plantae` is available only as an explicit broader scope because GBIF's kingdom includes algae. It stores raw pages, a manifest, normalized NDJSON and invalid-record diagnostics under `data/plant-import/`, which is excluded from Git. No images, descriptions or regional presence claims are downloaded by this tool.

`tools/plant-import/enrich-wikimedia.mjs` adds English Wikipedia introductory text and Wikimedia Commons images. Wikipedia matching is limited to exact scientific titles and official redirects; Commons fallback search requires the complete scientific name in the file title or metadata. Text is stored with its article URL and CC BY-SA 4.0 marker. Images are limited to allowlisted CC/Public-domain licences and retain creator, licence URL, Commons source page, checksum and local path. The current local batch contains 629 descriptions and 676 images for 1,000 taxa; 324 image gaps remain documented rather than guessed.
