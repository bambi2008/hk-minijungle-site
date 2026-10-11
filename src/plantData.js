export const plantRegions = [
  { id: "germany", label: { "zh-hk": "德國", en: "Germany" }, short: "DE" },
  { id: "usa", label: { "zh-hk": "美國", en: "United States" }, short: "US" },
  { id: "hong-kong", label: { "zh-hk": "香港", en: "Hong Kong" }, short: "HK" },
  { id: "mainland-china", label: { "zh-hk": "中國大陸", en: "Mainland China" }, short: "CN" },
  { id: "uk", label: { "zh-hk": "英國", en: "United Kingdom" }, short: "UK" },
  { id: "france", label: { "zh-hk": "法國", en: "France" }, short: "FR" },
];

const commons = {
  echinacea: {
    author: "Diego Delso",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Echinacea_purpurea,_Jard%C3%ADn_Bot%C3%A1nico,_M%C3%BAnich,_Alemania,_2013-09-08,_DD_01.jpg",
  },
  bauhinia: {
    author: "Dinkun Chen",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bauhinia_%C3%97_blakeana_in_China.jpg",
  },
  ginkgo: {
    author: "Franz van Duns",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:DSG7056-1_Yellow_Ginkgo_biloba_leaves_-_vivid_translucent_illumination_by_autumn_sunlight.jpg",
  },
  digitalis: {
    author: "H. Zell",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Digitalis_purpurea_-_Panoramic_trail_-_Northern_Black_Forest_01.jpg",
  },
  lavender: {
    author: "Валерія Матвєєва",
    license: "CC0 1.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lavandula_angustifolia_june.jpg",
  },
  oak: {
    author: "Ivar Leidus",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Quercus_robur_acorn_-_Keila.jpg",
  },
};

export const plants = [
  {
    slug: "quercus-robur",
    region: "germany",
    name: { "zh-hk": "夏櫟", en: "English oak" },
    localName: { "zh-hk": "Stiel-Eiche", en: "Stiel-Eiche" },
    scientificName: "Quercus robur L.",
    canonicalName: "Quercus robur",
    family: "Fagaceae",
    form: "tree",
    image: "/images/plants/quercus-robur.jpg",
    imageAlt: { "zh-hk": "夏櫟枝上的綠色橡果", en: "Green acorns on an English oak branch" },
    imageCredit: commons.oak,
    summary: {
      "zh-hk": "德國原生落葉喬木。FloraWeb 將夏櫟列為德國原生種，並提供其全國分布與保育狀態資料；成熟樹冠能形成重要的林地結構。",
      en: "A deciduous tree native to Germany. FloraWeb records its national distribution and conservation status, while mature crowns form an important part of woodland structure.",
    },
    profile: {
      light: { code: "sun-part", value: { "zh-hk": "全日照至半日照", en: "Sun to partial shade" } },
      water: { code: "moderate", value: { "zh-hk": "中等", en: "Moderate" } },
      height: { value: { "zh-hk": "大型喬木", en: "Large tree" } },
      bloom: { value: { "zh-hk": "春季", en: "Spring" } },
      hardiness: { value: { "zh-hk": "耐寒", en: "Hardy" } },
      safety: { code: "caution", value: { "zh-hk": "橡實不供一般生食", en: "Acorns are not a casual edible" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Fagales", genus: "Quercus", accepted: true },
    nativeRange: { "zh-hk": "德國及歐洲大部分地區", en: "Germany and much of Europe" },
    habitat: { "zh-hk": "低地林、河谷與開闊林地；適合保留充足根域的大型景觀。", en: "Lowland woodland, river valleys and open forest; suited to landscapes with generous rooting volume." },
    care: {
      soil: { "zh-hk": "深厚、能保濕而排水良好的土壤。", en: "Deep, moisture-retentive but free-draining soil." },
      watering: { "zh-hk": "定植初期規律澆水；成熟後按長期乾旱補水。", en: "Water regularly while establishing; supplement mature trees during prolonged drought." },
      pruning: { "zh-hk": "只作結構性修剪，避免不必要的大切口。", en: "Use structural pruning only and avoid unnecessary large cuts." },
      propagation: { "zh-hk": "新鮮橡實播種。", en: "Sow fresh acorns." },
    },
    details: {
      flowers: { "zh-hk": "雌雄花同株，春季隨新葉出現。", en: "Male and female flowers occur on the same tree and appear with new foliage in spring." },
      leaves: { "zh-hk": "互生、深裂的落葉，葉柄較短。", en: "Alternate, deeply lobed deciduous leaves with short stalks." },
      fruits: { "zh-hk": "橡實由長果梗承托，是其德文名稱 Stiel-Eiche 的辨識特徵之一。", en: "Acorns are held on long stalks, a characteristic reflected in the German name Stiel-Eiche." },
    },
    sources: [
      { label: "FloraWeb — Quercus robur", url: "https://www.floraweb.de/php/artenhome.php?suchnr=4685", type: "national flora" },
    ],
  },
  {
    slug: "echinacea-purpurea",
    region: "usa",
    name: { "zh-hk": "紫錐菊", en: "Eastern purple coneflower" },
    localName: { "zh-hk": "Purple coneflower", en: "Purple coneflower" },
    scientificName: "Echinacea purpurea (L.) Moench",
    canonicalName: "Echinacea purpurea",
    family: "Asteraceae",
    form: "perennial",
    image: "/images/plants/echinacea-purpurea.jpg",
    imageAlt: { "zh-hk": "盛放的紫錐菊花序", en: "Purple coneflower blooms" },
    imageCredit: commons.echinacea,
    summary: {
      "zh-hk": "原產美國中部及東部的溫帶多年生草本。其紫色舌狀花圍繞突出的中央花盤，常見於自然式花境與授粉者友善花園。",
      en: "A temperate perennial native to the central and eastern United States. Purple ray florets surround a prominent cone, making it useful in naturalistic and pollinator-oriented planting.",
    },
    profile: {
      light: { code: "sun", value: { "zh-hk": "全日照", en: "Full sun" } },
      water: { code: "moderate", value: { "zh-hk": "中等", en: "Moderate" } },
      height: { value: { "zh-hk": "約 0.6–1.8 米", en: "About 0.6–1.8 m" } },
      bloom: { value: { "zh-hk": "夏季至初秋", en: "Summer to early autumn" } },
      hardiness: { value: { "zh-hk": "溫帶耐寒多年生", en: "Temperate hardy perennial" } },
      safety: { code: "standard", value: { "zh-hk": "觀賞植物；藥用須專業建議", en: "Ornamental; seek advice for medicinal use" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Asterales", genus: "Echinacea", accepted: true },
    nativeRange: { "zh-hk": "美國中部及東部", en: "Central and eastern United States" },
    habitat: { "zh-hk": "草原、林緣及陽光充足的開闊生境。", en: "Prairies, woodland margins and sunny open habitats." },
    care: {
      soil: { "zh-hk": "一般排水良好的園土。", en: "Average, well-drained garden soil." },
      watering: { "zh-hk": "定植期保持均勻濕度，成株可承受短期乾燥。", en: "Keep evenly moist while establishing; mature plants tolerate short dry periods." },
      pruning: { "zh-hk": "花後可剪除部分殘花；保留部分種頭可供冬季景觀與鳥類利用。", en: "Deadhead selectively; leave some seed heads for winter structure and birds." },
      propagation: { "zh-hk": "播種或春季分株。", en: "Seed or divide in spring." },
    },
    details: {
      flowers: { "zh-hk": "頭狀花序中央呈圓錐狀，外圍舌狀花通常為粉紫色。", en: "Cone-shaped flower heads have a prominent disc surrounded by usually purple-pink ray florets." },
      leaves: { "zh-hk": "葉片卵形至披針形，表面較粗糙。", en: "Leaves are ovate to lanceolate with a comparatively coarse texture." },
      fruits: { "zh-hk": "乾燥種頭可在花期後持續保留。", en: "Dry seed heads can persist beyond flowering." },
    },
    sources: [
      { label: "Kew — Plants of the World Online", url: "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1174497-2/general-information", type: "taxonomy & distribution" },
      { label: "USDA Plant Guide", url: "https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_ecpu.pdf", type: "plant guide" },
    ],
  },
  {
    slug: "bauhinia-blakeana",
    region: "hong-kong",
    name: { "zh-hk": "洋紫荊", en: "Hong Kong orchid tree" },
    localName: { "zh-hk": "香港市花", en: "Hong Kong city flower" },
    scientificName: "Bauhinia × blakeana Dunn",
    canonicalName: "Bauhinia × blakeana",
    catalogId: "gbif-species:2953373",
    family: "Fabaceae",
    form: "tree",
    image: "/images/plants/bauhinia-blakeana.jpg",
    imageAlt: { "zh-hk": "開滿洋紅色花朵的洋紫荊樹冠", en: "Canopy of a Hong Kong orchid tree in flower" },
    imageCredit: commons.bauhinia,
    summary: {
      "zh-hk": "洋紫荊於 1965 年獲選為香港市花，冬季開出大型洋紅色花朵。香港植物標本室指出它通常以無性方式繁殖，並廣泛種植於本地城市景觀。",
      en: "Selected as Hong Kong’s city flower in 1965, this tree bears large magenta flowers in winter. The Hong Kong Herbarium notes that it is normally propagated vegetatively and is widely planted in the city.",
    },
    profile: {
      light: { code: "sun", value: { "zh-hk": "全日照", en: "Full sun" } },
      water: { code: "moderate", value: { "zh-hk": "中等", en: "Moderate" } },
      height: { value: { "zh-hk": "中型喬木", en: "Medium-sized tree" } },
      bloom: { value: { "zh-hk": "約 11 月至 3 月", en: "About November to March" } },
      hardiness: { value: { "zh-hk": "亞熱帶；不耐嚴寒", en: "Subtropical; frost tender" } },
      safety: { code: "standard", value: { "zh-hk": "城市觀賞植物", en: "Urban ornamental" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Fabales", genus: "Bauhinia", accepted: true },
    nativeRange: { "zh-hk": "香港發現並廣泛栽植的園藝雜交種", en: "A horticultural hybrid discovered and widely cultivated in Hong Kong" },
    habitat: { "zh-hk": "道路、公共花園及其他陽光充足的城市綠地。", en: "Roadsides, public gardens and other sunny urban green spaces." },
    care: {
      soil: { "zh-hk": "肥沃、排水良好的土壤。", en: "Fertile, free-draining soil." },
      watering: { "zh-hk": "幼樹規律澆水；避免根部長期積水。", en: "Water young trees regularly and avoid prolonged waterlogging." },
      pruning: { "zh-hk": "花後作輕度整形，保留自然開張樹冠。", en: "Prune lightly after flowering while retaining the naturally spreading crown." },
      propagation: { "zh-hk": "以扦插、壓條或嫁接等無性方法繁殖。", en: "Propagate vegetatively by cuttings, layering or grafting." },
    },
    details: {
      flowers: { "zh-hk": "大型、具香氣、洋紅至紫紅色的五瓣花，主要在冬季出現。", en: "Large, fragrant, five-petalled flowers in magenta to purple-red, appearing mainly in winter." },
      leaves: { "zh-hk": "闊大的雙裂葉，輪廓像蝴蝶或羊蹄。", en: "Broad, bilobed leaves with a butterfly- or hoof-like outline." },
      fruits: { "zh-hk": "一般不結果，園藝繁殖依靠無性方法。", en: "Usually does not set fruit, so horticultural propagation is vegetative." },
    },
    sources: [
      { label: "香港植物標本室 — 洋紫荊", url: "https://www.herbarium.gov.hk/en/special-topics/hong-kong-plants/hong-kong-plants-detail/index-id-2.html", type: "government herbarium" },
      { label: "香港植物資料庫", url: "https://herbarium.gov.hk/en/hk-plant-database/index.html", type: "regional database" },
    ],
  },
  {
    slug: "ginkgo-biloba",
    region: "mainland-china",
    name: { "zh-hk": "銀杏", en: "Ginkgo" },
    localName: { "zh-hk": "白果樹", en: "Maidenhair tree" },
    scientificName: "Ginkgo biloba L.",
    canonicalName: "Ginkgo biloba",
    family: "Ginkgoaceae",
    form: "tree",
    image: "/images/plants/ginkgo-biloba.jpg",
    imageAlt: { "zh-hk": "秋日陽光照亮金黃色銀杏葉", en: "Golden ginkgo leaves lit by autumn sun" },
    imageCredit: commons.ginkgo,
    summary: {
      "zh-hk": "銀杏是中國原產的落葉喬木，也是銀杏科現存代表。中國植物志記載其可高達約 40 米，扇形葉在秋季轉為鮮黃色。",
      en: "A deciduous tree native to China and the living representative of Ginkgoaceae. Flora of China records trees reaching about 40 m, with fan-shaped leaves turning vivid yellow in autumn.",
    },
    profile: {
      light: { code: "sun-part", value: { "zh-hk": "全日照至半日照", en: "Sun to partial shade" } },
      water: { code: "moderate", value: { "zh-hk": "中等", en: "Moderate" } },
      height: { value: { "zh-hk": "可達約 40 米", en: "Up to about 40 m" } },
      bloom: { value: { "zh-hk": "春季產生生殖結構", en: "Reproductive structures in spring" } },
      hardiness: { value: { "zh-hk": "耐寒落葉喬木", en: "Hardy deciduous tree" } },
      safety: { code: "caution", value: { "zh-hk": "種子外層會刺激皮膚；食用須正確處理", en: "Seed coat may irritate skin; edible use needs proper preparation" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Ginkgoales", genus: "Ginkgo", accepted: true },
    nativeRange: { "zh-hk": "中國", en: "China" },
    habitat: { "zh-hk": "現多見於栽培環境、公園、寺院與城市街道。", en: "Now widely encountered in cultivation, parks, temple grounds and urban streets." },
    care: {
      soil: { "zh-hk": "深厚、排水良好的土壤，對多種城市土壤具適應性。", en: "Deep, well-drained soil; adaptable to a range of urban soils." },
      watering: { "zh-hk": "幼樹保持均勻水分，成樹避免長期積水。", en: "Keep young trees evenly watered; avoid persistent waterlogging around mature trees." },
      pruning: { "zh-hk": "冬季休眠期作少量結構修剪。", en: "Carry out limited structural pruning during winter dormancy." },
      propagation: { "zh-hk": "種子或扦插；街道栽培常選用雄株。", en: "Seed or cuttings; male selections are commonly used for streets." },
    },
    details: {
      flowers: { "zh-hk": "裸子植物，不形成真正花朵；雌雄異株。", en: "A gymnosperm with no true flowers; male and female structures occur on separate trees." },
      leaves: { "zh-hk": "具長柄的扇形葉，葉脈二叉分枝，秋季變黃。", en: "Long-stalked fan-shaped leaves have dichotomous veins and turn yellow in autumn." },
      fruits: { "zh-hk": "不形成真正果實；雌株種子具肉質外層。", en: "No true fruit is formed; female trees produce seeds with a fleshy outer layer." },
    },
    sources: [
      { label: "Flora of China — Ginkgo biloba", url: "https://www.efloras.org/florataxon.aspx?flora_id=3&taxon_id=200005235", type: "national flora" },
    ],
  },
  {
    slug: "digitalis-purpurea",
    region: "uk",
    name: { "zh-hk": "毛地黃", en: "Common foxglove" },
    localName: { "zh-hk": "Foxglove", en: "Foxglove" },
    scientificName: "Digitalis purpurea L.",
    canonicalName: "Digitalis purpurea",
    family: "Plantaginaceae",
    form: "biennial",
    image: "/images/plants/digitalis-purpurea.jpg",
    imageAlt: { "zh-hk": "粉紫色毛地黃花序", en: "Pink-purple common foxglove flower spikes" },
    imageCredit: commons.digitalis,
    summary: {
      "zh-hk": "英國花園與林緣常見的二年生或短命多年生植物。RHS 記載其通常高 1–2 米，適合日照或半陰、濕潤但排水良好的環境；全株有毒。",
      en: "A familiar biennial or short-lived perennial of British gardens and woodland edges. RHS lists a typical height of 1–2 m, sun or partial shade, moist but well-drained soil, and toxicity throughout the plant.",
    },
    profile: {
      light: { code: "sun-part", value: { "zh-hk": "全日照至半陰", en: "Sun to partial shade" } },
      water: { code: "moist", value: { "zh-hk": "濕潤而不積水", en: "Moist, not waterlogged" } },
      height: { value: { "zh-hk": "約 1–2 米", en: "About 1–2 m" } },
      bloom: { value: { "zh-hk": "初夏至盛夏", en: "Early to midsummer" } },
      hardiness: { value: { "zh-hk": "RHS H7", en: "RHS H7" } },
      safety: { code: "toxic", value: { "zh-hk": "全株有毒", en: "All parts toxic" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Lamiales", genus: "Digitalis", accepted: true },
    nativeRange: { "zh-hk": "西歐及西南歐，包括英國", en: "Western and southwestern Europe, including Britain" },
    habitat: { "zh-hk": "林緣、林間空地、堤岸及受擾動地點。", en: "Woodland edges, clearings, banks and disturbed ground." },
    care: {
      soil: { "zh-hk": "富含腐殖質、濕潤而排水良好的土壤。", en: "Humus-rich, moist but well-drained soil." },
      watering: { "zh-hk": "乾旱期補水，避免土壤長期飽和。", en: "Water during dry spells and avoid persistent saturation." },
      pruning: { "zh-hk": "若不需自播，花後剪除花序。操作時戴手套。", en: "Cut flower spikes after bloom if self-seeding is not wanted. Wear gloves." },
      propagation: { "zh-hk": "春季或晚夏播種。", en: "Sow in spring or late summer." },
    },
    details: {
      flowers: { "zh-hk": "高直花序上排列下垂的鐘形花，內側常有斑點。", en: "Nodding bell-shaped flowers line tall upright spikes and are often spotted inside." },
      leaves: { "zh-hk": "基生蓮座葉大而柔軟，表面具毛。", en: "Large, soft, hairy leaves form a basal rosette." },
      fruits: { "zh-hk": "蒴果含大量細小種子，容易自播。", en: "Capsules contain many fine seeds and can self-sow freely." },
    },
    sources: [
      { label: "RHS — Digitalis purpurea", url: "https://www.rhs.org.uk/plants/5862/digitalis-purpurea/details", type: "horticultural profile" },
    ],
  },
  {
    slug: "lavandula-angustifolia",
    region: "france",
    name: { "zh-hk": "狹葉薰衣草", en: "English lavender" },
    localName: { "zh-hk": "Lavande vraie", en: "Lavande vraie" },
    scientificName: "Lavandula angustifolia Mill.",
    canonicalName: "Lavandula angustifolia",
    family: "Lamiaceae",
    form: "shrub",
    image: "/images/plants/lavandula-angustifolia.jpg",
    imageAlt: { "zh-hk": "陽光下的狹葉薰衣草紫色花穗", en: "Purple English lavender spikes in sunlight" },
    imageCredit: commons.lavender,
    summary: {
      "zh-hk": "原產法國至意大利一帶的芳香亞灌木。Kew 記載其天然分布由西班牙東北部延伸至意大利，常生於溫帶岩石地、草地、山坡與崖壁，夏季開花。",
      en: "An aromatic subshrub native from France towards Italy. Kew records a native range from northeastern Spain to Italy, with plants occurring on rocky ground, meadows, hills and cliffs and flowering in summer.",
    },
    profile: {
      light: { code: "sun", value: { "zh-hk": "全日照", en: "Full sun" } },
      water: { code: "dry", value: { "zh-hk": "偏乾", en: "Low once established" } },
      height: { value: { "zh-hk": "灌木可達約 2 米", en: "Shrub to about 2 m" } },
      bloom: { value: { "zh-hk": "6–8 月", en: "June–August" } },
      hardiness: { value: { "zh-hk": "耐寒薰衣草類型", en: "Hardy lavender type" } },
      safety: { code: "standard", value: { "zh-hk": "芳香觀賞植物；內服須專業建議", en: "Aromatic ornamental; seek advice before ingestion" } },
    },
    taxonomy: { kingdom: "Plantae", order: "Lamiales", genus: "Lavandula", accepted: true },
    nativeRange: { "zh-hk": "西班牙東北部、法國至意大利", en: "Northeastern Spain, France and Italy" },
    habitat: { "zh-hk": "溫帶岩石土壤、草地、山坡及崖壁。", en: "Rocky soils, grassy meadows, hills and cliffs in temperate regions." },
    care: {
      soil: { "zh-hk": "偏鹼至中性、貧瘠而排水非常良好的土壤。", en: "Neutral to alkaline, lean and very free-draining soil." },
      watering: { "zh-hk": "定植後耐旱；潮濕氣候中尤其避免冬季積水。", en: "Drought tolerant once established; avoid winter wet, especially in humid climates." },
      pruning: { "zh-hk": "花後輕剪，但避免剪入無葉老枝。", en: "Trim lightly after flowering without cutting into old leafless wood." },
      propagation: { "zh-hk": "半熟枝扦插或播種。", en: "Semi-ripe cuttings or seed." },
    },
    details: {
      flowers: { "zh-hk": "芳香的紫色小花集合成頂生花穗，主要於夏季盛開。", en: "Fragrant violet flowers form terminal spikes, blooming mainly in summer." },
      leaves: { "zh-hk": "線形至狹卵形、灰綠色且具芳香。", en: "Linear to narrowly ovate, grey-green and aromatic." },
      fruits: { "zh-hk": "花後形成細小分果。", en: "Small nutlets follow flowering." },
    },
    sources: [
      { label: "Tela Botanica — Lavandula angustifolia", url: "https://www.tela-botanica.org/eflore/?action=fiche&module=fiche&num_nom=38072&onglet=synthese&referentiel=bdtfx", type: "French flora network" },
      { label: "Kew — English lavender", url: "https://www.kew.org/plants/english-lavender", type: "botanical profile" },
      { label: "Kew — Plants of the World Online", url: "https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A449008-1/general-information", type: "taxonomy & distribution" },
    ],
  },
];

export function getPlant(slug) {
  return plants.find((plant) => plant.slug === slug);
}

export function getRegion(id) {
  return plantRegions.find((region) => region.id === id);
}

export function localPlantText(value, locale) {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return value;
  return value[locale] || value.en || value["zh-hk"] || "";
}
