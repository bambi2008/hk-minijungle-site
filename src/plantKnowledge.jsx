import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  Brain,
  CheckCircle,
  Database,
  Drop,
  Flower,
  Heart,
  ImageSquare,
  Leaf,
  MagnifyingGlass,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sun,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { Breadcrumbs, SiteLink } from "./components.jsx";
import { getPlant, getRegion, localPlantText, plantRegions, plants } from "./plantData.js";
import { getCatalogPlant, loadPlantCatalog, mergeCatalogPlants } from "./plantCatalog.js";
import { identifyPlant, plantRecognitionStatus, validatePlantImage } from "./plantRecognition.js";

const words = {
  "zh-hk": {
    eyebrow: "GLOBAL PLANT LIBRARY · 全球植物知識庫",
    title: "從一株植物，讀懂它的世界。",
    intro: "從植物分類到養護檔案，探索德國、美國、香港、中國大陸、英國與法國的植物。搜尋學名、瀏覽實拍圖片，並沿著資料來源繼續了解。",
    search: "搜尋植物名、學名、科名或特徵",
    all: "全部地區",
    filters: "篩選",
    results: "個已接入植物檔案",
    demo: "條來源型植物記錄",
    demoBody: ({ descriptions, images }) => `分類來自 GBIF；${descriptions.toLocaleString()} 條含英文導言，${images.toLocaleString()} 條含授權圖片。地區篩選包含當地觀察記錄；原生分布與種植適應性需另行查證。`,
    form: "植物類型",
    light: "光照",
    safety: "安全提示",
    any: "不限",
    tree: "喬木",
    perennial: "多年生草本",
    biennial: "二年生",
    shrub: "灌木",
    sun: "全日照",
    sunPart: "日照／半陰",
    toxic: "有毒警示",
    view: "查看植物檔案",
    noResult: "找不到符合條件的植物。試試清除篩選或搜尋另一個名稱。",
    clear: "清除篩選",
    loading: "正在載入植物目錄…",
    recorded: "有記錄",
    loadError: "批量植物目錄暫時無法載入；六個人工策展檔案仍可使用。",
    loadMore: "載入更多植物",
    machineRecord: "來源型分類資料",
    imagePending: "圖片待補",
    sources: "資料來源",
    photo: "圖片授權",
    taxonomy: "分類與來源地",
    habitat: "生境與形態",
    care: "養護指南",
    flowers: "花、葉與果",
    related: "同一座全球植物庫",
    back: "返回植物知識庫",
    localName: "地區名稱",
    family: "科",
    order: "目",
    genus: "屬",
    accepted: "接受名",
    native: "原生分布",
    soil: "土壤",
    watering: "澆水",
    pruning: "修剪",
    propagation: "繁殖",
    sourceNote: "知識內容為來源資料的原創摘要；請以連結內的機構原文作專業判斷依據。",
  },
  en: {
    eyebrow: "GLOBAL PLANT LIBRARY",
    title: "Understand a plant — and the world around it.",
    intro: "Explore plants from Germany, the United States, Hong Kong, Mainland China, the United Kingdom and France. Search scientific names, discover plant photographs and follow the sources behind each record.",
    search: "Search common name, scientific name, family or trait",
    all: "All regions",
    filters: "Filters",
    results: "plant profiles connected",
    demo: "source plant records",
    demoBody: ({ descriptions, images }) => `Taxonomy comes from GBIF; ${descriptions.toLocaleString()} records include English introductions and ${images.toLocaleString()} include licensed images. Regional filters include recorded observations; native status and garden suitability need separate evidence.`,
    form: "Plant form",
    light: "Light",
    safety: "Safety",
    any: "Any",
    tree: "Tree",
    perennial: "Perennial",
    biennial: "Biennial",
    shrub: "Shrub",
    sun: "Full sun",
    sunPart: "Sun / part shade",
    toxic: "Toxicity warning",
    view: "View plant profile",
    noResult: "No plants match those filters. Clear the filters or try another name.",
    clear: "Clear filters",
    loading: "Loading the plant catalogue…",
    recorded: "Recorded",
    loadError: "The bulk catalogue could not be loaded. The six editorial profiles remain available.",
    loadMore: "Load more plants",
    machineRecord: "Source taxonomy record",
    imagePending: "Image pending",
    sources: "Sources",
    photo: "Image licence",
    taxonomy: "Taxonomy & origin",
    habitat: "Habitat & form",
    care: "Care guide",
    flowers: "Flowers, leaves & fruit",
    related: "Explore the global collection",
    back: "Back to plant library",
    localName: "Regional name",
    family: "Family",
    order: "Order",
    genus: "Genus",
    accepted: "Accepted name",
    native: "Native range",
    soil: "Soil",
    watering: "Watering",
    pruning: "Pruning",
    propagation: "Propagation",
    sourceNote: "Knowledge copy is an original summary of the linked sources. Consult the source institution for professional decisions.",
  },
};

function copy(locale) {
  return words[locale] || words.en;
}

function PlantProfileIcon({ type }) {
  const Icon = { light: Sun, water: Drop, height: Ruler, bloom: Flower, hardiness: Snowflake, safety: WarningCircle }[type] || Leaf;
  return <Icon aria-hidden="true" weight="regular" />;
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="plant-filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function FilterPanel({ locale, form, setForm, light, setLight, safety, setSafety, onClear }) {
  const c = copy(locale);
  return (
    <div className="plant-filter-panel">
      <div className="plant-filter-panel__heading"><SlidersHorizontal aria-hidden="true" /><strong>{c.filters}</strong></div>
      <SelectFilter label={c.form} value={form} onChange={setForm} options={[
        { value: "all", label: c.any },
        { value: "tree", label: c.tree },
        { value: "perennial", label: c.perennial },
        { value: "biennial", label: c.biennial },
        { value: "shrub", label: c.shrub },
      ]} />
      <SelectFilter label={c.light} value={light} onChange={setLight} options={[
        { value: "all", label: c.any },
        { value: "sun", label: c.sun },
        { value: "sun-part", label: c.sunPart },
      ]} />
      <SelectFilter label={c.safety} value={safety} onChange={setSafety} options={[
        { value: "all", label: c.any },
        { value: "toxic", label: c.toxic },
      ]} />
      <button className="plant-filter-clear" type="button" onClick={onClear}>{c.clear}</button>
    </div>
  );
}

function PlantCard({ plant, locale, saved, onSave }) {
  const c = copy(locale);
  const region = getRegion(plant.region);
  const href = `/${locale}/plants/${plant.slug}`;
  return (
    <article className="plant-card">
      <SiteLink href={href} className="plant-card__image">
        {plant.image
          ? <img src={plant.image} alt={localPlantText(plant.imageAlt, locale)} loading="lazy" decoding="async" />
          : <span className="plant-card__placeholder"><Leaf aria-hidden="true" weight="thin" />{c.imagePending}</span>}
        <span className="plant-region-chip">{region ? `${region.short} · ${localPlantText(region.label, locale)}` : plant.regionIds?.length ? `${c.recorded} · ${plant.regionIds.map(id => getRegion(id)?.short).filter(Boolean).join(" / ")}` : c.machineRecord}</span>
      </SiteLink>
      <div className="plant-card__body">
        <div className="plant-card__heading">
          <div>
            <h2><SiteLink href={href}>{localPlantText(plant.name, locale)}</SiteLink></h2>
            <p className="plant-scientific">{plant.scientificName}</p>
          </div>
          <button type="button" className={saved ? "plant-save is-saved" : "plant-save"} aria-label={saved ? (locale === "en" ? "Remove from saved plants" : "取消收藏植物") : (locale === "en" ? "Save plant" : "收藏植物")} aria-pressed={saved} onClick={onSave}>
            <Heart aria-hidden="true" weight={saved ? "fill" : "regular"} />
          </button>
        </div>
        <p className="plant-card__summary">{localPlantText(plant.summary, locale)}</p>
        {plant.catalog ? (
          <div className="plant-card__facts">
            <span><Leaf aria-hidden="true" />{plant.family || (locale === "en" ? "Family pending" : "科名待校訂")}</span>
            <span><Database aria-hidden="true" />GBIF</span>
          </div>
        ) : (
          <div className="plant-card__facts">
            <span><Sun aria-hidden="true" />{localPlantText(plant.profile.light.value, locale)}</span>
            <span><Drop aria-hidden="true" />{localPlantText(plant.profile.water.value, locale)}</span>
          </div>
        )}
        <SiteLink href={href} className="plant-card__link">{c.view}<ArrowRight aria-hidden="true" /></SiteLink>
      </div>
    </article>
  );
}

export function PlantLibraryPage({ locale }) {
  const c = copy(locale);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [form, setForm] = useState("all");
  const [light, setLight] = useState("all");
  const [safety, setSafety] = useState("all");
  const [mobileFilters, setMobileFilters] = useState(false);
  const filterDialogRef = useRef(null);
  const [saved, setSaved] = useState(() => new Set());
  const [catalog, setCatalog] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState("loading");
  const [visibleCount, setVisibleCount] = useState(48);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let active = true;
    loadPlantCatalog()
      .then((records) => {
        if (!active) return;
        setCatalog(records);
        setCatalogStatus("ready");
      })
      .catch(() => {
        if (active) setCatalogStatus("error");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!mobileFilters) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const sheet = filterDialogRef.current?.querySelector(".plant-filter-dialog__sheet");
    document.body.style.overflow = "hidden";
    sheet?.querySelector(".plant-filter-dialog__close")?.focus();
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileFilters(false);
      }
      if (event.key !== "Tab" || !sheet) return;
      const controls = [...sheet.querySelectorAll("button:not(:disabled), select:not(:disabled), input:not(:disabled), a[href], [tabindex]")].filter(control => control.tabIndex >= 0 && control.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (!sheet.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [mobileFilters]);

  const allPlants = useMemo(() => mergeCatalogPlants(plants, catalog), [catalog]);
  const catalogStats = useMemo(() => ({ descriptions: catalog.filter(plant => plant.hasDescription).length, images: catalog.filter(plant => plant.image).length }), [catalog]);
  const regionCounts = useMemo(() => Object.fromEntries(plantRegions.map(item => [item.id, allPlants.filter(plant => plant.region === item.id || plant.regionIds?.includes(item.id)).length])), [allPlants]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLocaleLowerCase();
    return allPlants.filter((plant) => {
      const haystack = [
        localPlantText(plant.name, locale),
        localPlantText(plant.localName, locale),
        plant.scientificName,
        plant.family,
        localPlantText(plant.summary, locale),
      ].join(" ").toLocaleLowerCase();
      return (!needle || haystack.includes(needle))
        && (region === "all" || plant.region === region || plant.regionIds?.includes(region))
        && (form === "all" || plant.form === form)
        && (light === "all" || plant.profile?.light?.code === light || (light === "sun" && plant.profile?.light?.code === "sun-part"))
        && (safety === "all" || plant.profile?.safety?.code === safety);
    });
  }, [allPlants, deferredQuery, form, light, locale, region, safety]);

  useEffect(() => { setVisibleCount(48); }, [deferredQuery, form, light, region, safety]);

  function clearFilters() {
    setRegion("all");
    setForm("all");
    setLight("all");
    setSafety("all");
    setQuery("");
  }

  function toggleSaved(slug) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  return (
    <div className="plant-library">
      <section className="plant-library-hero">
        <div className="page-shell plant-library-hero__inner">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h1>{c.title}</h1>
            <p>{c.intro}</p>
          </div>
          <div className="plant-library-hero__mark" aria-hidden="true"><Leaf weight="thin" /></div>
        </div>
      </section>

      <section className="plant-search-shell">
        <div className="page-shell">
          <label className="plant-search-box">
            <MagnifyingGlass aria-hidden="true" />
            <span className="sr-only">{c.search}</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} />
            {query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X aria-hidden="true" /></button> : null}
          </label>
          <div className="plant-region-tabs" aria-label={locale === "en" ? "Filter by region" : "按地區篩選"}>
            <button type="button" aria-pressed={region === "all"} onClick={() => setRegion("all")}>{c.all}</button>
            {plantRegions.map((item) => (
              <button type="button" key={item.id} aria-pressed={region === item.id} onClick={() => setRegion(item.id)}>
                <span>{item.short}</span>{localPlantText(item.label, locale)}<small>{regionCounts[item.id]}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="plant-results-section">
        <div className="page-shell">
          <div className="plant-dataset-note">
            <div><Database aria-hidden="true" /><strong>{catalog.length.toLocaleString()} {c.demo}</strong></div>
            <p>{c.demoBody(catalogStats)}</p>
          </div>
          {catalogStatus === "loading" ? <p className="plant-catalog-status" role="status">{c.loading}</p> : null}
          {catalogStatus === "error" ? <p className="plant-catalog-status is-error" role="alert">{c.loadError}</p> : null}
          <div className="plant-results-toolbar">
            <p><strong>{filtered.length}</strong> {c.results}</p>
            <button type="button" className="plant-mobile-filter-button" aria-expanded={mobileFilters} onClick={() => setMobileFilters(true)}><SlidersHorizontal aria-hidden="true" />{c.filters}</button>
          </div>
          <div className="plant-results-layout">
            <aside className="plant-filter-sidebar" aria-label={c.filters}>
              <FilterPanel locale={locale} form={form} setForm={setForm} light={light} setLight={setLight} safety={safety} setSafety={setSafety} onClear={clearFilters} />
            </aside>
            <div>
              {filtered.length ? (
                <div className="plant-grid">
                  {filtered.slice(0, visibleCount).map((plant) => <PlantCard key={plant.slug} plant={plant} locale={locale} saved={saved.has(plant.slug)} onSave={() => toggleSaved(plant.slug)} />)}
                </div>
              ) : (
                <div className="plant-empty"><Leaf aria-hidden="true" /><p>{c.noResult}</p><button type="button" onClick={clearFilters}>{c.clear}</button></div>
              )}
              {visibleCount < filtered.length ? <button type="button" className="plant-load-more" onClick={() => setVisibleCount((count) => count + 48)}>{c.loadMore}<span>{Math.min(visibleCount, filtered.length)} / {filtered.length}</span></button> : null}
            </div>
          </div>
        </div>
      </section>

      {mobileFilters ? (
        <div ref={filterDialogRef} className="plant-filter-dialog" role="dialog" aria-modal="true" aria-label={c.filters}>
          <button type="button" className="plant-filter-dialog__backdrop" aria-label="Close filters" onClick={() => setMobileFilters(false)} />
          <div className="plant-filter-dialog__sheet">
            <button type="button" className="plant-filter-dialog__close" aria-label="Close filters" onClick={() => setMobileFilters(false)}><X aria-hidden="true" /></button>
            <FilterPanel locale={locale} form={form} setForm={setForm} light={light} setLight={setLight} safety={safety} setSafety={setSafety} onClear={clearFilters} />
            <button type="button" className="plant-filter-dialog__apply" onClick={() => setMobileFilters(false)}>{filtered.length} {c.results}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FactGrid({ plant, locale }) {
  const keys = ["light", "water", "height", "bloom", "hardiness", "safety"];
  const labels = locale === "en"
    ? { light: "Light", water: "Water", height: "Height", bloom: "Season", hardiness: "Hardiness", safety: "Safety" }
    : { light: "光照", water: "水分", height: "高度", bloom: "花期", hardiness: "耐寒", safety: "安全" };
  return (
    <div className="plant-fact-grid">
      {keys.map((key) => (
        <div key={key} className={key === "safety" && plant.profile.safety.code === "toxic" ? "is-warning" : ""}>
          <PlantProfileIcon type={key} />
          <span>{labels[key]}</span>
          <strong>{localPlantText(plant.profile[key].value, locale)}</strong>
        </div>
      ))}
    </div>
  );
}

function DetailRows({ rows }) {
  return <dl className="plant-detail-rows">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function RegionalEvidence({ plant, locale }) {
  const evidence = (plant.regionalEvidence || []).filter(region => region.occurrenceCount && region.url);
  if (!evidence.length) return null;
  return (
    <section className="plant-regional-evidence page-shell">
      <h2>{locale === "en" ? "Recorded in these regions" : "地區觀察記錄"}</h2>
      <p>{locale === "en" ? "GBIF records may include cultivated plants and historical observations. They do not establish native status or garden suitability." : "GBIF 記錄可能包含栽培植物與歷史觀察；這些資料不代表原生分布或種植適應性。"}</p>
      <div className="plant-regional-grid">
        {evidence.map(region => <a key={region.code} href={region.url} target="_blank" rel="noreferrer"><span>{localPlantText(getRegion(region.regionId)?.label, locale)}<ArrowSquareOut aria-hidden="true" /></span><strong>{region.occurrenceCount.toLocaleString()}</strong><small>{locale === "en" ? "GBIF records" : "筆 GBIF 記錄"} · {region.retrievedAt.slice(0, 10)}</small></a>)}
      </div>
    </section>
  );
}

function CatalogPlantDetail({ plant, locale }) {
  useEffect(() => {
    const libraryName = locale === "en" ? "Global Plant Library" : "全球植物知識庫";
    document.title = `${plant.scientificName} | ${libraryName} | HK MINIJUNGLE`;
  }, [locale, plant.scientificName]);

  const c = copy(locale);
  const englishOnly = locale !== "en" && plant.hasDescription;
  return (
    <article className="plant-detail-page">
      <div className="page-shell"><Breadcrumbs locale={locale} items={[{ label: locale === "en" ? "Plant library" : "植物知識庫", href: `/${locale}/plants` }, { label: localPlantText(plant.name, locale) }]} /></div>
      <section className="plant-detail-hero page-shell">
        <figure>
          {plant.image
            ? <img src={plant.image} alt={localPlantText(plant.imageAlt, locale)} />
            : <div className="plant-detail-placeholder"><Leaf aria-hidden="true" weight="thin" /><span>{c.imagePending}</span></div>}
          {plant.imageCredit ? <figcaption>{c.photo} · {plant.imageCredit.author} · {plant.imageCredit.license} · <a href={plant.imageCredit.sourceUrl} target="_blank" rel="noreferrer">Wikimedia Commons<ArrowSquareOut aria-hidden="true" /></a></figcaption> : null}
        </figure>
        <div className="plant-detail-hero__copy">
          <span className="plant-region-chip">{c.machineRecord}</span>
          <p className="eyebrow">{plant.family || "FAMILY PENDING"}</p>
          <h1>{localPlantText(plant.name, locale)}</h1>
          <p className="plant-detail-scientific">{plant.scientificName}</p>
          <p className="plant-detail-lede">{localPlantText(plant.summary, locale)}</p>
          {englishOnly ? <p className="plant-language-note">English source text is available below; Chinese editorial translation is pending.</p> : null}
          <div className="plant-source-inline"><ShieldCheck aria-hidden="true" /><span>{c.sources}: {plant.sources.map((source) => source.label).join(" · ")}</span></div>
        </div>
      </section>
      <RegionalEvidence plant={plant} locale={locale} />
      <section className="section plant-detail-content">
        <div className="page-shell plant-detail-content__grid">
          <div className="plant-detail-main">
            <section>
              <p className="eyebrow">01</p><h2>{c.taxonomy}</h2>
              <DetailRows rows={[
                [c.family, plant.family || (locale === "en" ? "Pending" : "待校訂")],
                [c.order, plant.taxonomy.order || (locale === "en" ? "Pending" : "待校訂")],
                [c.genus, plant.taxonomy.genus || (locale === "en" ? "Pending" : "待校訂")],
                [locale === "en" ? "Phylum" : "門", plant.taxonomy.phylum],
                [locale === "en" ? "Rank" : "分類階元", plant.taxonomy.rank],
                [locale === "en" ? "Status" : "分類狀態", plant.taxonomy.status],
              ]} />
            </section>
            <section>
              <p className="eyebrow">02</p><h2>{locale === "en" ? "Source introduction" : "來源導言"}</h2>
              <p>{plant.hasDescription ? plant.summary.en : (locale === "en" ? "No editorial description is available yet. The taxonomic record remains searchable and source-linked." : "尚未有可用的編輯導言；此分類記錄仍可搜尋並保留來源連結。")}</p>
            </section>
            <section>
              <p className="eyebrow">03</p><h2>{locale === "en" ? "Editorial status" : "編輯狀態"}</h2>
              <p>{locale === "en" ? "This is a machine-staged source record. Care, toxicity, native range and regional suitability have not been inferred and require horticultural review before publication as advice." : "這是機器暫存的來源型記錄。養護、毒性、原生分布與地區適應性均未作推測；如要作為建議發布，仍須園藝編輯審核。"}</p>
            </section>
          </div>
          <aside className="plant-source-card">
            <ShieldCheck aria-hidden="true" weight="regular" />
            <p className="eyebrow">{c.sources}</p>
            <ul>{plant.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer"><span>{source.label}</span><small>{source.type}</small><ArrowSquareOut aria-hidden="true" /></a></li>)}</ul>
            <p>{locale === "en" ? "Wikipedia text is CC BY-SA 4.0. Image rights follow the licence shown above. This record is not yet editorial advice." : "Wikipedia 文字採用 CC BY-SA 4.0；圖片權利依上方所示授權。本記錄目前不是經編輯的養護建議。"}</p>
          </aside>
        </div>
      </section>
    </article>
  );
}

export function PlantDetailPage({ locale, slug }) {
  const curatedPlant = getPlant(slug);
  const [catalogResult, setCatalogResult] = useState({ slug: null, record: null, status: "loading" });

  useEffect(() => {
    let active = true;
    getCatalogPlant(slug)
      .then((record) => {
        if (!active) return;
        setCatalogResult({ slug, record, status: record ? "ready" : "missing" });
      })
      .catch(() => { if (active) setCatalogResult({ slug, record: null, status: "error" }); });
    return () => { active = false; };
  }, [slug]);

  const catalogPlant = catalogResult.slug === slug ? catalogResult.record : null;
  const catalogStatus = catalogResult.slug === slug ? catalogResult.status : "loading";
  const plant = curatedPlant ? mergeCatalogPlants([curatedPlant], catalogPlant ? [catalogPlant] : [])[0] : catalogPlant;
  if (!plant) {
    return <div className="plant-detail-loading page-shell" role={catalogStatus === "error" ? "alert" : "status"}><Leaf aria-hidden="true" weight="thin" /><p>{catalogStatus === "loading" ? (locale === "en" ? "Loading plant record…" : "正在載入植物記錄…") : (locale === "en" ? "This plant record is unavailable." : "此植物記錄暫時無法使用。")}</p><SiteLink href={`/${locale}/plants`}>{copy(locale).back}</SiteLink></div>;
  }
  if (plant.catalog) return <CatalogPlantDetail plant={plant} locale={locale} />;
  const c = copy(locale);
  const region = getRegion(plant.region);
  const related = plants.filter((item) => item.slug !== plant.slug).slice(0, 3);
  return (
    <article className="plant-detail-page">
      <div className="page-shell"><Breadcrumbs locale={locale} items={[{ label: locale === "en" ? "Plant library" : "植物知識庫", href: `/${locale}/plants` }, { label: localPlantText(plant.name, locale) }]} /></div>
      <section className="plant-detail-hero page-shell">
        <figure>
          <img src={plant.image} alt={localPlantText(plant.imageAlt, locale)} />
          <figcaption>{c.photo} · {plant.imageCredit.author} · {plant.imageCredit.license} · <a href={plant.imageCredit.sourceUrl} target="_blank" rel="noreferrer">Wikimedia Commons<ArrowSquareOut aria-hidden="true" /></a></figcaption>
        </figure>
        <div className="plant-detail-hero__copy">
          <span className="plant-region-chip">{region.short} · {localPlantText(region.label, locale)}</span>
          <p className="eyebrow">{plant.family}</p>
          <h1>{localPlantText(plant.name, locale)}</h1>
          <p className="plant-detail-scientific">{plant.scientificName}</p>
          <p className="plant-detail-lede">{localPlantText(plant.summary, locale)}</p>
          <div className="plant-source-inline"><ShieldCheck aria-hidden="true" /><span>{c.sources}: {plant.sources.map((source) => source.label).join(" · ")}</span></div>
        </div>
      </section>

      <section className="plant-detail-facts"><div className="page-shell"><FactGrid plant={plant} locale={locale} /></div></section>
      <RegionalEvidence plant={plant} locale={locale} />

      <section className="section plant-detail-content">
        <div className="page-shell plant-detail-content__grid">
          <div className="plant-detail-main">
            <section>
              <p className="eyebrow">01</p><h2>{c.taxonomy}</h2>
              <DetailRows rows={[
                [c.localName, localPlantText(plant.localName, locale)],
                [c.family, plant.family],
                [c.order, plant.taxonomy.order],
                [c.genus, plant.taxonomy.genus],
                [c.accepted, plant.taxonomy.accepted ? (locale === "en" ? "Yes" : "是") : (locale === "en" ? "Review needed" : "待校訂")],
                [c.native, localPlantText(plant.nativeRange, locale)],
              ]} />
            </section>
            <section>
              <p className="eyebrow">02</p><h2>{c.habitat}</h2>
              <p>{localPlantText(plant.habitat, locale)}</p>
            </section>
            <section>
              <p className="eyebrow">03</p><h2>{c.care}</h2>
              <DetailRows rows={[
                [c.soil, localPlantText(plant.care.soil, locale)],
                [c.watering, localPlantText(plant.care.watering, locale)],
                [c.pruning, localPlantText(plant.care.pruning, locale)],
                [c.propagation, localPlantText(plant.care.propagation, locale)],
              ]} />
            </section>
            <section>
              <p className="eyebrow">04</p><h2>{c.flowers}</h2>
              <DetailRows rows={[
                [locale === "en" ? "Flowers" : "花", localPlantText(plant.details.flowers, locale)],
                [locale === "en" ? "Leaves" : "葉", localPlantText(plant.details.leaves, locale)],
                [locale === "en" ? "Fruit / seeds" : "果實／種子", localPlantText(plant.details.fruits, locale)],
              ]} />
            </section>
          </div>
          <aside className="plant-source-card">
            <ShieldCheck aria-hidden="true" weight="regular" />
            <p className="eyebrow">{c.sources}</p>
            <ul>{plant.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer"><span>{source.label}</span><small>{source.type}</small><ArrowSquareOut aria-hidden="true" /></a></li>)}</ul>
            <p>{c.sourceNote}</p>
          </aside>
        </div>
      </section>

      <section className="section section--sand plant-related">
        <div className="page-shell">
          <div className="plant-related__heading"><div><p className="eyebrow">{c.related}</p><h2>{locale === "en" ? "Continue across regions." : "繼續探索不同地區。"}</h2></div><SiteLink href={`/${locale}/plants`} className="plant-card__link">{c.back}<ArrowRight aria-hidden="true" /></SiteLink></div>
          <div className="plant-grid plant-grid--related">{related.map((item) => <PlantCard key={item.slug} plant={item} locale={locale} saved={false} onSave={() => {}} />)}</div>
        </div>
      </section>
    </article>
  );
}

export function PlantScanPage({ locale }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const zh = locale !== "en";

  useEffect(() => {
    if (!file) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function acceptFile(candidate) {
    const validation = validatePlantImage(candidate);
    if (!validation.ok) {
      setMessage(validation.code === "file-too-large" ? (zh ? "圖片不可超過 12 MB。" : "Images must be 12 MB or smaller.") : (zh ? "請選擇 JPEG、PNG、WebP 或 HEIC 圖片。" : "Choose a JPEG, PNG, WebP or HEIC image."));
      return;
    }
    setFile(candidate);
    setMessage("");
  }

  async function runIdentification() {
    const result = await identifyPlant({ file, locale });
    if (result.status === "model-not-configured") setMessage(zh ? "圖片管線已就緒；AI 識別模型尚未連接。接入供應商後，此處會返回候選植物、信心分數與相似特徵。" : "The image pipeline is ready; no AI model is connected yet. Once a provider is configured, this area will return candidate plants, confidence scores and matching traits.");
  }

  return (
    <div className="plant-scan-page">
      <section className="plant-scan-hero">
        <div className="page-shell">
          <p className="eyebrow">AI PLANT RECOGNITION · {zh ? "架構原型" : "ARCHITECTURE PROTOTYPE"}</p>
          <h1>{zh ? "拍下一株植物，讓知識庫接手。" : "Photograph a plant. Let the library take over."}</h1>
          <p>{zh ? "上傳流程、圖片驗證、結果結構及知識庫跳轉已經建立。識別模型與 API 憑證刻意留作下一階段接入。" : "Upload handling, image validation, result contracts and knowledge-library routing are in place. The recognition model and API credentials are intentionally left for the next phase."}</p>
        </div>
      </section>
      <section className="section plant-scan-workspace">
        <div className="page-shell plant-scan-layout">
          <div>
            <div
              className={dragging ? "plant-upload is-dragging" : "plant-upload"}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files[0]); }}
            >
              {preview ? (
                <div className="plant-upload__preview"><img src={preview} alt={zh ? "待識別植物預覽" : "Plant awaiting identification"} /><button type="button" aria-label={zh ? "移除圖片" : "Remove image"} onClick={() => { setFile(null); setMessage(""); if (inputRef.current) inputRef.current.value = ""; }}><X aria-hidden="true" /></button></div>
              ) : (
                <div className="plant-upload__empty"><ImageSquare aria-hidden="true" weight="thin" /><h2>{zh ? "拖放植物照片到這裡" : "Drop a plant photo here"}</h2><p>{zh ? "使用清晰、光線充足、主體完整的葉、花或整株照片。" : "Use a clear, well-lit image of a leaf, flower or the full plant."}</p><button type="button" onClick={() => inputRef.current?.click()}><UploadSimple aria-hidden="true" />{zh ? "選擇圖片" : "Choose image"}</button></div>
              )}
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden onChange={(event) => acceptFile(event.target.files[0])} />
            </div>
            {file ? <button type="button" className="plant-identify-button" onClick={runIdentification}><Brain aria-hidden="true" />{zh ? "開始識別" : "Identify plant"}</button> : null}
            {message ? <div className="plant-scan-message" role="status"><WarningCircle aria-hidden="true" /><p>{message}</p></div> : null}
          </div>
          <aside className="plant-scan-status">
            <div className="plant-scan-status__badge"><span />{zh ? "架構已就緒 · 模型未連接" : "Architecture ready · model not connected"}</div>
            <h2>{zh ? "識別服務接入點" : "Recognition service contract"}</h2>
            <ol>
              <li><CheckCircle aria-hidden="true" weight="fill" /><div><strong>{zh ? "圖片輸入" : "Image input"}</strong><span>{zh ? "格式、大小與預覽驗證" : "Format, size and preview validation"}</span></div></li>
              <li><CheckCircle aria-hidden="true" weight="fill" /><div><strong>{zh ? "供應商介面" : "Provider interface"}</strong><span><code>{plantRecognitionStatus.endpoint}</code></span></div></li>
              <li><CheckCircle aria-hidden="true" weight="fill" /><div><strong>{zh ? "標準化結果" : "Normalised result"}</strong><span>{zh ? "候選種、信心分數、可見特徵" : "Candidates, confidence and visible traits"}</span></div></li>
              <li><Brain aria-hidden="true" /><div><strong>{zh ? "待接入模型" : "Model to be connected"}</strong><span>{zh ? "可替換雲端 API 或自託管模型" : "Replaceable cloud API or self-hosted model"}</span></div></li>
            </ol>
            <div className="plant-scan-privacy"><ShieldCheck aria-hidden="true" /><p>{zh ? "目前原型不會把圖片上傳到外部服務。正式接入時需要補充保存期限、同意機制與私隱說明。" : "This prototype does not upload images to an external service. A production connection must add retention, consent and privacy terms."}</p></div>
          </aside>
        </div>
      </section>
      <section className="section section--forest plant-scan-tips"><div className="page-shell"><div><p className="eyebrow">{zh ? "拍攝提示" : "PHOTO TIPS"}</p><h2>{zh ? "一張好照片，先解決一半的辨識問題。" : "A good photograph solves half the identification problem."}</h2></div><ul><li><span>01</span>{zh ? "避免逆光，讓葉脈與花瓣清楚可見。" : "Avoid backlight; keep veins and petals visible."}</li><li><span>02</span>{zh ? "拍攝一張整株，再補一張花或葉的近照。" : "Capture the whole plant, then a close-up of flower or leaf."}</li><li><span>03</span>{zh ? "不要使用重度濾鏡或模糊的社交媒體截圖。" : "Avoid heavy filters and blurred social-media screenshots."}</li></ul></div></section>
    </div>
  );
}
