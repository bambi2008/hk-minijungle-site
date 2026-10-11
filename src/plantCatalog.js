let catalogPromise;

export function mergeCatalogPlants(curated, catalog) {
  const keyFor = plant => (plant.canonicalName || plant.scientificName).trim().toLowerCase();
  const catalogByName = new Map(catalog.map(plant => [keyFor(plant), plant]));
  const catalogById = new Map(catalog.map(plant => [plant.id, plant]));
  const curatedNames = new Set(curated.map(keyFor));
  const curatedIds = new Set(curated.map(plant => plant.catalogId).filter(Boolean));
  return [
    ...curated.map(plant => {
      const imported = catalogById.get(plant.catalogId) || catalogByName.get(keyFor(plant));
      return { ...plant, regionIds: [...new Set([plant.region, ...(imported?.regionIds || [])].filter(Boolean))], regionalEvidence: imported?.regionalEvidence || [], sources: [...plant.sources, ...(imported?.sources || []).filter(source => source.type === "regional records")] };
    }),
    ...catalog.filter(plant => !curatedNames.has(keyFor(plant)) && !curatedIds.has(plant.id)),
  ];
}

export function loadPlantCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch("/data/plant-catalog/index.json", { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`Plant catalog failed to load (${response.status})`);
        return response.json();
      })
      .then((records) => Array.isArray(records) ? records : Promise.reject(new Error("Plant catalog response is not an array")));
  }
  return catalogPromise;
}

export async function getCatalogPlant(slug) {
  const records = await loadPlantCatalog();
  return records.find((record) => record.slug === slug) || null;
}
