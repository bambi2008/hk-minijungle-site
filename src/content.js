export const locales = ["zh-hk", "en"];

export const settings = {
  siteUrl: "https://hkminijungle.com",
  legalNameEn: "HK MiniJungle Technology International Limited",
  legalNameZh: "香港迷你森科技國際有限公司",
  email: "hello@hkminijungle.com",
  phone: "Dr_forest2026",
  phoneNumbers: "+852 54787719 / +86 18824675385",
  whatsapp: "Dr_forest2026",
  address: {
    en: "ROOM 2712, CONVENTION PLAZA OFFICE TOWER, 1 HARBOUR ROAD, WAN CHAI, HONG KONG",
    "zh-hk": "香港灣仔港灣道1號會展廣場辦公大樓2712",
  },
};

export const copy = {
  en: {
    localeName: "EN",
    otherLocale: "繁",
    nav: {
      products: "Products",
      solutions: "Solutions",
      esg: "ESG support",
      technology: "Technology",
      journal: "Journal",
      about: "About",
      contact: "Contact",
    },
    common: {
      learnMore: "Learn more",
      explore: "Explore",
      enquire: "Enquire",
      requestPilot: "Request a pilot",
      backHome: "Back to home",
      concept: "Concept visualisation",
      prototype: "Prototype",
      contentRequired: "Content required",
      draft: "Editorial draft",
      related: "Related",
      viewAll: "View all",
      menu: "Menu",
      close: "Close",
    },
    home: {
      kicker: "Modular planting · Xponge · intelligent care",
      title: "Nature, designed into everyday space.",
      subtitle:
        "HK MINIJUNGLE brings modular planting, Xponge materials and intelligent care together for greener spaces at work and at home.",
      workCta: "Solutions for work and space",
      homeCta: "Products for home and life",
      indexEyebrow: "Our living index",
      indexTitle: ["Nature", "Art", "Technology"],
      indexBody:
        "We combine living systems, spatial design and material innovation to make nature a lasting part of everyday interiors.",
      materialTitle: "From material to living space",
      routesTitle: "Two paths. One purpose.",
      proofTitle: "From prototype to place",
      pilotTitle: "Define together, verify in the real space.",
      pilotBody:
        "HK MINIJUNGLE treats the first pilots as a shared product-validation exercise, not a one-way installation. Clients bring real spatial needs, user feedback and operating goals; we bring module configuration, planting, installation, maintenance and Doctor Forest records. Each pilot agrees scope, duration, responsibilities, data use and next-step commercial arrangements in advance so the collaboration stays transparent, measurable and useful to both sides.",
    },
  },
  "zh-hk": {
    localeName: "繁",
    otherLocale: "EN",
    nav: {
      products: "產品",
      solutions: "空間方案",
      esg: "ESG 實證支援",
      technology: "技術與實證",
      journal: "動態",
      about: "關於我們",
      contact: "聯絡我們",
    },
    common: {
      learnMore: "了解更多",
      explore: "探索",
      enquire: "查詢",
      requestPilot: "申請試點",
      backHome: "返回首頁",
      concept: "概念效果圖",
      prototype: "樣機",
      contentRequired: "內容待提供",
      draft: "編輯草稿",
      related: "相關內容",
      viewAll: "查看全部",
      menu: "選單",
      close: "關閉",
    },
    home: {
      kicker: "模組化種植 × Xponge 種植介質 × 智能養護",
      title: "讓自然成為空間的一部分。",
      subtitle:
        "HK MINIJUNGLE 將模組化種植、Xponge 材料與智能養護整合成適合工作與生活空間的自然系統。",
      workCta: "探索工作與空間方案",
      homeCta: "探索家居與生活產品",
      indexEyebrow: "我們的生活指標",
      indexTitle: ["自然", "美學", "科技"],
      indexBody:
        "我們結合生命系統、空間設計與材料創新，讓自然長久融入日常室內空間。",
      materialTitle: "從材料到生活空間",
      routesTitle: "兩條路徑，同一個方向。",
      proofTitle: "從樣機到空間",
      pilotTitle: "共同定義，真實驗證",
      pilotBody:
        "HK MINIJUNGLE 將首批試點視為一項共同完成的產品驗證，而不是一次單向安裝。客戶以真實空間需求、使用反饋及營運目標參與方案決策；我們負責模組配置、植物搭配、安裝維護及 Doctor Forest 數據記錄，並共同檢視空間使用、植物健康、維護投入與使用者感受。客戶獲得更貼合實際場景的解決方案及可用於內部匯報的實證資料，HK MINIJUNGLE 則依據真實營運結果持續改進產品與服務。每項試點都會事先明確範圍、週期、雙方責任、數據使用及後續商業安排，讓共創建立在透明、可衡量和雙方受益的基礎上。",
    },
  },
};

export const products = [
  {
    slug: "canviva",
    legacySlugs: ["greencanvas", "green-canvas"],
    name: "CANVIVA",
    nameZh: "生命畫境",
    descriptor: "Smart Living Art System",
    descriptorZh: "智能植物藝術系統",
    kind: "product",
    audience: "work",
    category: "systems",
    status: "pilot",
    evidence: "concept",
    image: "/images/canviva-art-wall.jpg",
    en: {
      short: "A smart living-art system designed to make modular planting part of an interior, not an afterthought.",
      problem: "For teams seeking a clear spatial feature with a defined path from design to ongoing care.",
      users: ["Workplaces", "Hospitality and retail", "Property and FM teams"],
      features: ["Modular spatial composition", "Planting and lighting coordination", "Maintenance-aware planning", "Co-created delivery"],
    },
    "zh-hk": {
      short: "把模組化種植真正納入室內空間，而不是事後加上的裝飾。",
      problem: "適合希望建立清晰空間焦點，並從設計延伸至持續養護的團隊。",
      users: ["辦公空間", "酒店及零售", "物業與設施管理團隊"],
      features: ["模組化空間組合", "種植與照明協調", "養護前置規劃", "以場景共創交付"],
    },
  },
  {
    slug: "cuisviva-kitchen",
    legacySlugs: ["home-panel", "homepadel"],
    name: "CUISVIVA KITCHEN",
    nameZh: "鮮香植園",
    descriptor: "Smart Culinary Growing System",
    descriptorZh: "智能香草種植系統",
    kind: "product",
    audience: "home",
    category: "products",
    status: "development",
    evidence: "concept",
    image: "/images/cuisviva-kitchen-european.png",
    en: {
      short: "A smart culinary growing system for fresh herbs in compact kitchens and balconies.",
      problem: "For health-conscious households that want fresh, everyday herbs within easy reach.",
      users: ["Compact homes", "Design-led households", "Early product testers"],
      features: ["Compact footprint", "Kitchen and balcony formats", "Replaceable planting elements", "Guided intelligent care"],
    },
    "zh-hk": {
      short: "為緊湊廚房與陽台而設的智能新鮮香草種植系統。",
      problem: "給重視健康生活的家庭，在日常伸手可及的位置種植新鮮香草。",
      users: ["小型家居", "重視設計的家庭", "早期產品測試者"],
      features: ["緊湊佔地", "廚房與陽台形式", "可替換種植組件", "智能養護指引"],
    },
  },
  {
    slug: "xponge",
    name: "Xponge",
    kind: "technology",
    audience: "both",
    category: "materials",
    status: "validation",
    evidence: null,
    image: "/images/xponge-material-concept.jpg",
    en: {
      short: "A polyurethane bio-growth matrix built around the DualFlow™ principle: macro-pores keep air moving while micro-pores hold water and nutrients at the root zone.",
      problem: "An engineered root-zone layer that gives vertical planting a stable balance of air, moisture and structure.",
      users: ["Product systems", "Home products", "Research and design partners"],
      features: ["DualFlow™ macro- and micro-pore channels", "Demand-driven water and nutrient reservoir", "Continuous root-zone airflow", "Lightweight modular integration"],
    },
    "zh-hk": {
      short: "以聚氨酯生長基質為基礎，透過 DualFlow™ 雙通道結構讓宏孔保持空氣流動，微孔按需承托水分與養分。",
      problem: "為垂直種植建立空氣、濕度與結構之間穩定平衡的根區材料層。",
      users: ["空間產品系統", "家居產品", "研發及設計夥伴"],
      features: ["DualFlow™ 宏孔與微孔雙通道", "按需供應水分與養分", "持續根區空氣流動", "輕量化模組整合"],
    },
  },
  {
    slug: "doctor-forest",
    name: "DR FOREST",
    kind: "technology",
    audience: "both",
    category: "care",
    status: "development",
    evidence: "concept",
    image: "/images/doctor-forest-concept.png",
    en: {
      short: "An intelligent-care and service layer that brings monitoring, guidance and maintenance records into one operating loop.",
      problem: "A care operating layer that makes plant status, service responsibility and follow-up easier to understand and act on.",
      users: ["Operations teams", "Service partners", "Future home users"],
      features: ["Multi-sensor monitoring", "Plant and equipment records", "Alert and work-order routing", "Service history and scheduling"],
    },
    "zh-hk": {
      short: "把監測、養護指引與服務記錄連成一個運行閉環的智能養護層。",
      problem: "讓植物狀態、服務責任與後續跟進更容易被理解和執行的養護運維層。",
      users: ["營運團隊", "服務夥伴", "未來家居使用者"],
      features: ["多維感測監測", "植物與設備檔案", "警報與工單分派", "服務歷史與排程"],
    },
  },
];

// CANVIVA is one product family with multiple workplace-facing formats.
// These entries are visual variants for catalogue and homepage browsing; they
// intentionally route to the shared CANVIVA detail page rather than inventing
// separate product claims or unsupported standalone routes.
export const officeProductVariants = [
  {
    slug: "canviva-office-wall",
    detailSlug: "canviva",
    name: "CANVIVA · Living Wall",
    nameZh: "生命畫境 · 垂直綠牆",
    descriptor: "Framed Vertical Living Wall",
    descriptorZh: "框架式垂直綠牆",
    kind: "product-variant",
    variantOf: "canviva",
    audience: "work",
    category: "systems",
    status: "pilot",
    evidence: "concept",
    image: "/images/canviva-office-wall.png",
    en: {
      short: "A framed vertical living-wall format for workplace, reception and collaboration spaces.",
      problem: "For teams that want a calm planted focal point while keeping the floor plan clear.",
      users: ["Workplaces", "Reception and collaboration areas", "Hospitality and property teams"],
      features: ["Framed vertical composition", "Planting and lighting coordination", "Maintenance-aware planning", "Shared CANVIVA system"],
    },
    "zh-hk": {
      short: "以框架式垂直綠牆，把密集種植帶進辦公、接待及協作空間。",
      problem: "適合希望保留地面動線，同時建立安定綠意焦點的團隊。",
      users: ["辦公空間", "接待與協作區域", "酒店及物業團隊"],
      features: ["框架式垂直構成", "種植與照明協調", "養護前置規劃", "共用 CANVIVA 系統"],
    },
  },
  {
    slug: "canviva-art-lobby",
    detailSlug: "canviva",
    name: "CANVIVA · Art Wall",
    nameZh: "生命畫境 · 藝術款",
    descriptor: "Sculptural Living Art Wall",
    descriptorZh: "雕塑式植物藝術牆",
    kind: "product-variant",
    variantOf: "canviva",
    audience: "work",
    category: "systems",
    status: "pilot",
    evidence: "concept",
    image: "/images/canviva-art-lobby.png",
    en: {
      short: "A sculptural living-art format that combines planting, framing and light as a spatial focal point.",
      problem: "For workplaces, hotels and public interiors where nature also needs to carry a strong visual identity.",
      users: ["Workplace feature walls", "Hotel and club arrivals", "Design and property teams"],
      features: ["Sculptural framing", "Planting, material and light as one composition", "Maintenance-aware planning", "Shared CANVIVA system"],
    },
    "zh-hk": {
      short: "把種植、框架與光影結合成空間焦點的雕塑式植物藝術牆。",
      problem: "適合辦公室、酒店及公共室內空間，在引入自然的同時建立鮮明識別。",
      users: ["辦公室主牆", "酒店與會所入口", "設計及物業團隊"],
      features: ["雕塑式框架", "種植、材料與光影一體構成", "養護前置規劃", "共用 CANVIVA 系統"],
    },
  },
];

// Technology layers remain in the shared catalogue for routing and system composition,
// but are not presented as top-level retail product families.
export const productFamilies = products.filter((product) => product.kind === "product");
export const productCatalog = [...productFamilies, ...officeProductVariants];

export const solutions = [
  {
    slug: "workplace",
    image: "/images/docx-workplace-wall.png",
    gallery: ["/images/docx-workplace-wall.png"],
    products: ["canviva", "xponge", "doctor-forest"],
    en: { name: "Workplace", problem: "Bring nature into compact workplaces without letting installation or care disrupt the day.", cta: "Request a workplace pilot", fit: ["Reception and collaboration zones", "Teams open to a measured pilot", "Spaces with a clear maintenance owner"], limit: ["Not a zero-maintenance promise", "Site review required before specification"] },
    "zh-hk": { name: "辦公空間", problem: "在香港緊湊辦公室中引入自然，同時減少安裝與養護對日常工作的干擾。", cta: "申請辦公室試點", fit: ["接待與協作區域", "願意參與實證試點的團隊", "具備明確養護責任人的空間"], limit: ["不承諾零維護", "規格確認前需要場地評估"] },
  },
  {
    slug: "hospitality-retail",
    image: "/images/docx-hospitality-wall.jpg",
    gallery: ["/images/docx-hospitality-wall.jpg", "/images/docx-hospitality-circle.jpg"],
    products: ["canviva", "xponge", "doctor-forest"],
    en: { name: "Hospitality & Clubs", problem: "Create a memorable living space in a hotel or club while keeping care aligned with operating hours.", cta: "Request a space proposal", fit: ["Guest arrival and waiting areas", "Club and lounge focal points", "Spaces with planned service access"], limit: ["Plant palette depends on real site conditions", "Service windows are agreed with the operator"] },
    "zh-hk": { name: "酒店與會所", problem: "在酒店或會所建立有記憶點的自然空間，同時讓養護配合營業時間進行。", cta: "索取空間方案", fit: ["到達及等候區", "會所與休息空間焦點", "具備計劃養護通道的空間"], limit: ["植物配置取決於真實場地條件", "服務時段需與營運團隊協議"] },
  },
  {
    slug: "property-fm",
    image: "/images/docx-fine-dining-grower.jpg",
    gallery: ["/images/docx-fine-dining-grower.jpg"],
    products: ["cuisviva-kitchen", "xponge", "doctor-forest"],
    en: { name: "Fine Dining", problem: "Give high-end restaurants a fresh, edible growing cabinet, with intelligent care supporting consistent ingredient quality.", cta: "Discuss a restaurant system", fit: ["Chef-led ingredient programmes", "Back-of-house or guest-facing installations", "Teams with a defined service owner"], limit: ["Crop selection depends on menu and site conditions", "Food-safety procedures remain the operator’s responsibility"] },
    "zh-hk": { name: "高檔餐廳", problem: "為高檔餐廳提供新鮮可食用的蔬菜生長櫃，智能養護保證高品質的食材。", cta: "討論餐廳系統", fit: ["由主廚主導的食材計劃", "後場或面向客人的安裝位置", "具備明確服務責任人的團隊"], limit: ["作物選擇取決於菜單與場地條件", "食品安全程序仍由營運方負責"] },
  },
  {
    slug: "home",
    image: "/images/docx-home-kitchen.jpg",
    gallery: ["/images/docx-home-kitchen.jpg", "/images/docx-home-balcony.jpg"],
    products: ["cuisviva-kitchen", "xponge", "doctor-forest"],
    en: { name: "Healthy Home", problem: "Give health-conscious households a kitchen or balcony herb grower, so fresh herbs are available every day.", cta: "Explore home products", fit: ["Compact urban homes", "Kitchen or balcony installation", "Homes with suitable light and access"], limit: ["Plant selection depends on home conditions", "Care routines are agreed to fit the household"] },
    "zh-hk": { name: "健康家庭", problem: "為專注健康的家庭提供廚房和陽台的香料生長倉，每日吃到新鮮的香料。", cta: "探索家居產品", fit: ["緊湊城市家居", "廚房或陽台安裝位置", "具備合適光線與養護空間的家居"], limit: ["植物選擇取決於家居條件", "養護節奏按家庭日常安排"] },
  },
];

export const esgContent = {
  en: {
    eyebrow: "ESG evidence support",
    title: "Make the living layer count in the project record.",
    intro: "Indoor planting can support the social side of ESG when it is designed for employee wellbeing, cared for over time and documented with the same discipline as the rest of the interior.",
    valueTitle: "A practical focus on S—health and wellbeing",
    valueBody: "The strongest ESG contribution of indoor planting is a healthier, biophilic work environment and the everyday experience it creates. It should not be presented as a substitute for ventilation, air treatment or a measured carbon reduction programme.",
    research: "Office studies in the UK and Netherlands have reported improvements in job satisfaction, concentration and perceived air quality after plants were introduced; one study recorded an approximately 15% productivity improvement. The same research shows why plants cannot replace ventilation: ordinary pots would require roughly 10–1,000 plants per square metre to match typical VOC removal by mechanical systems.",
    frameworkTitle: "Evidence that can travel with the project",
    frameworkBody: "At project start, HK MINIJUNGLE can help teams set planting area, location and sightline relationships against WELL v2 M02 Nature and Place and BEAM Plus Interiors v2.0 HWB-01-02 Biophilic Design. After handover, Doctor Forest keeps the plant asset list, plans and area calculations, installation photos, substrate moisture, water quality, CO₂, temperature and humidity readings, water and energy records, service work orders and replacement history in one exportable evidence pack.",
    metricTitle: "A measurable design input",
    metricBody: "For BEAM Plus Interiors v2.0, a planting bed, pot-plant or plant-wall area reaching 1% of the assessed indoor floor area can be used as one quantitative condition within the biophilic-design item. The final score or certification remains the responsibility of the recognised assessor and qualified consultant.",
    cta: "Discuss an ESG evidence pack",
    disclosureTitle: "Map planting decisions to the HKEX disclosure conversation.",
    disclosureIntro: "Office planting is a supporting evidence layer across environmental and social disclosures. It should sit beside measured building systems, not replace them.",
    disclosureRows: [
      ["A3 · Environment and natural resources", "A nature-based indoor-environment measure can support a resource-efficiency narrative.", "Direct"],
      ["A1 · Emissions", "A plant wall may support a cooling strategy and an indirect Scope 2 discussion when building data is available.", "Supporting"],
      ["B2 · Health and safety", "Planting, humidity and indoor-environment records can support a healthier workplace narrative and follow-up on health complaints.", "Strong when measured"],
      ["B1 · Employment", "Employee surveys can connect the workplace experience with satisfaction, attraction and retention discussions.", "Data-led"],
      ["Part D · Climate disclosure", "A plant wall can be part of a wider heat-adaptation and resilience strategy; it is not a standalone carbon claim.", "Indirect"],
    ],
    metricsTitle: "Reference metrics for an evidence plan",
    metricsIntro: "The following figures are research references supplied in the ESG brief. They are not project guarantees; a real project needs its own baseline, method, period and source record.",
    metrics: [
      ["Relative humidity", "29.1% → 38.9% → 49.2%", "PLOS ONE 2024"],
      ["Plant-wall cooling", "Net cooling of 3–5°C", "Building & Environment 2023"],
      ["Indoor CO₂", "5–50% reduction reported", "Building & Environment 2023"],
      ["Electricity use", "About 20% / ≈1,400 kWh per year", "Building & Environment 2023"],
      ["Employee experience", "Satisfaction and attention up; health complaints down", "Three UK / Netherlands field studies"],
      ["Health / dry-air complaints", "Significant reduction after at least four months", "Frontiers in Psychology 2023"],
    ],
    certificationsTitle: "Three certification routes, three different roles",
    certificationsIntro: "The right route depends on whether the scope is an interior fit-out, a whole building or a broader innovation and indoor-environment strategy.",
    certifications: [
      ["BEAM Plus Interiors v2.0", "HWB 2 Biophilic Design", "Hong Kong office interiors; the most direct local fit."],
      ["WELL Building Standard", "Feature 100 v5 + Feature 88", "Quantitative and qualitative biophilic design; potted plants ≥1% and plant walls ≥2% of floor area are reference thresholds in the supplied brief."],
      ["LEED", "Innovation: Biophilic Design + Indoor Environmental Quality", "Biophilic design can support innovation and indoor-environment credits indirectly."],
    ],
    pathTitle: "A lower-cost path from planting to disclosure",
    pathSteps: ["Install and record the planting layer", "Collect humidity, temperature and employee-survey data", "Disclose the relevant HKEX A3 and B2 evidence", "Prepare BEAM Plus Interiors HWB 2 documentation", "Optionally assess WELL for a multi-floor or whole-building scope"],
    actionsTitle: "Key actions for a Hong Kong office",
    actions: ["Use a reference target of planting ≥1% of floor area and plant-wall area ≥2% where the selected WELL route requires it.", "Deploy IAQ sensors to record temperature, humidity and related trends.", "Add a workplace-environment dimension to onboarding and recurring employee surveys.", "Report traceable KPIs such as planting area and plants per employee, with the baseline and method shown."],
    disclaimer: "Certification scores, health outcomes and carbon or energy effects must be verified for the actual site by the relevant assessor, consultant or study method.",
  },
  "zh-hk": {
    eyebrow: "ESG 實證支援",
    title: "ESG 在香港的應用",
    intro: "室內綠化對 ESG 的主要價值，在於「S—員工健康與福祉」及健康、具親自然感的工作環境，而不是把少量植物宣稱為顯著減碳或空氣淨化設備。",
    valueTitle: "聚焦 S—員工健康與福祉",
    valueBody: "英國與荷蘭的三項辦公室實地研究發現，引入植物可改善工作滿意度、專注度及感知空氣品質，其中一項研究錄得約 15% 的生產效率提升；但研究亦指出，普通盆栽若要達到典型通風系統的 VOC 去除能力，可能需要每平方米 10–1,000 株，因此植物不能取代通風和空氣處理系統。",
    research: "HK MINIJUNGLE 在項目前期可按照 WELL v2 M02 Nature and Place 及 BEAM Plus Interiors v2.0 HWB-01-02 Biophilic Design 要求，協助設定綠化面積、位置與視線關係。這些框架把親自然設計放回可量度、可提交的項目語境，而不是把植物當作機械通風的替代品。",
    frameworkTitle: "可隨項目交付的實證",
    frameworkBody: "交付後則透過 Doctor Forest 運維系統持續保存植物資產清單、平面圖及面積計算、安裝照片、基質含水率、水質、CO₂、溫濕度、用水與用電、維護工單及植物更換記錄，形成可匯出的項目證據包。香港室內空氣質素認證計劃採用「卓越級」及「良好級」兩級標準，證書有效期為 12 個月；Doctor Forest 的讀數主要服務於日常運維和趨勢提示，不能替代認可機構進行的正式 IAQ 檢測。",
    metricTitle: "把設計輸入量化",
    metricBody: "以 BEAM Plus Interiors v2.0 為例，盆栽或種植床面積、或植物牆面積達評估範圍室內樓面面積的 1%，可作為親自然設計分項中的一項量化條件，提交資料包括平面圖、合規說明及照片記錄。HK MINIJUNGLE 提供的是可追溯的設計與營運證據，協助客戶進行認證申報及 ESG 披露；最終得分或認證仍由相關認證機構及合資格顧問審核確認。",
    cta: "討論 ESG 實證資料包",
    disclosureTitle: "把綠化決定接到 HKEX 披露語境。",
    disclosureIntro: "辦公室綠化可以成為環境與社會披露的輔助證據層，但應與建築設備的實測數據並列，不能取代通風、空氣處理或正式碳核算。",
    disclosureRows: [
      ["A3．環境與天然資源", "以自然為本的室內環境改善措施，可支援資源使用效率的政策敘述。", "直接相關"],
      ["A1．排放", "植物牆可作為降溫策略的一部分；只有在具備建築數據時，才適合討論間接 Scope 2 影響。", "輔助"],
      ["B2．健康與安全", "植物、濕度與室內環境記錄可支援健康工作環境敘述，並跟進健康投訴。", "有量測時較強"],
      ["B1．僱傭", "員工調查可把工作環境體驗連接到滿意度、吸引力與留任的討論。", "以數據為本"],
      ["Part D．氣候披露", "植物牆可以是降溫、適應與韌性策略的一部分，但不是單獨的減碳主張。", "間接"],
    ],
    metricsTitle: "可放入實證計劃的研究參考",
    metricsIntro: "以下數字來自本次 ESG 文件提供的研究參考，不是項目保證；實際項目仍需建立自己的基線、方法、週期和來源記錄。",
    metrics: [
      ["相對濕度", "29.1% → 38.9% → 49.2%", "PLOS ONE 2024"],
      ["植物牆降溫", "淨降溫 3–5°C", "Building & Environment 2023"],
      ["室內二氧化碳", "研究報告降低 5–50%", "Building & Environment 2023"],
      ["植物牆節電", "約 20%／約 1,400 kWh／年", "Building & Environment 2023"],
      ["員工體驗", "滿意度、注意力上升；健康投訴下降", "英國／荷蘭三項實地研究"],
      ["健康／乾燥空氣投訴", "至少四個月後顯著減少", "Frontiers in Psychology 2023"],
    ],
    certificationsTitle: "三條認證路徑，各有不同角色",
    certificationsIntro: "應按項目是室內裝修、整棟建築，還是更廣泛的創新與室內環境策略，選擇合適路徑。",
    certifications: [
      ["BEAM Plus Interiors v2.0", "HWB 2 Biophilic Design", "針對香港室內裝修，最貼近香港寫字樓項目的路徑。"],
      ["WELL Building Standard", "Feature 100 v5 ＋ Feature 88", "兼顧量化與質化親生物設計；文件提供的參考門檻為盆栽 ≥1% 及植物牆 ≥2% 樓面面積。"],
      ["LEED", "Innovation: Biophilic Design ＋ Indoor Environmental Quality", "親生物設計可間接支援創新及室內環境相關分項。"],
    ],
    pathTitle: "由綠化到披露的較低成本路徑",
    pathSteps: ["部署並記錄辦公室綠化", "收集濕度、溫度及員工調查數據", "在 HKEX A3 及 B2 中披露相關證據", "準備 BEAM Plus Interiors HWB 2 文件", "如屬多樓層或整棟項目，再評估 WELL 認證"],
    actionsTitle: "香港辦公室的關鍵動作",
    actions: ["如選用 WELL 量化路徑，可把綠化面積 ≥1% 及植物牆 ≥2% 作為規劃參考目標。", "部署 IAQ 傳感器，記錄溫度、濕度及相關趨勢。", "在入職及定期員工調查加入工作環境維度。", "以綠化面積、員工人均植物數等可追溯 KPI 披露，並顯示基線和計算方法。"],
    disclaimer: "認證得分、健康結果及碳排或能源影響，均需由相關認證機構、合資格顧問或研究方法針對實際場地核實。",
  },
};

export const proofNotes = [
  {
    slug: "greencanvas-prototype",
    type: "Prototype",
    status: "prototype",
    product: "CANVIVA",
    en: { title: "CANVIVA prototype record", tested: "Prototype structure and service-access assumptions.", why: "To prepare a real pilot without presenting a render as a completed project.", method: "[CONTENT REQUIRED: document the actual prototype method and version.]", observation: "[CONTENT REQUIRED: add only verified observations.]", limits: "No performance or client outcome is claimed." },
    "zh-hk": { title: "CANVIVA 樣機記錄", tested: "樣機結構與服務通道假設。", why: "為真實試點做好準備，同時避免把效果圖當成已完成項目。", method: "[CONTENT REQUIRED：補充真實樣機方法與版本。]", observation: "[CONTENT REQUIRED：只加入已驗證觀察。]", limits: "目前不主張任何性能或客戶成效。" },
  },
  {
    slug: "xponge-observation",
    type: "Material note",
    status: "validation",
    product: "Xponge",
    en: { title: "Xponge material observation framework", tested: "A framework for documenting root-zone and handling observations.", why: "Material claims should be tied to visible methods and limitations.", method: "[CONTENT REQUIRED: add the actual material, plant, duration and conditions.]", observation: "[CONTENT REQUIRED: add verified observations only.]", limits: "The concept image on this site is not test evidence." },
    "zh-hk": { title: "Xponge 材料觀察框架", tested: "記錄根區與操作觀察的方法框架。", why: "材料主張需要連結可見的方法與限制。", method: "[CONTENT REQUIRED：補充真實材料、植物、時長和條件。]", observation: "[CONTENT REQUIRED：只加入已驗證觀察。]", limits: "本網站概念圖並非測試證據。" },
  },
  {
    slug: "founding-pilot",
    type: "Pilot note",
    status: "pilot",
    product: "Founding Pilot Programme",
    en: { title: "Founding pilot preparation", tested: "The scope, responsibilities and evidence needed before opening applications.", why: "A pilot should have a useful learning plan for both the site partner and HK MINIJUNGLE.", method: "[CONTENT REQUIRED: confirm geography, duration, responsibilities and response time.]", observation: "Applications are not yet represented as open until scope is confirmed.", limits: "No artificial scarcity or guaranteed outcome." },
    "zh-hk": { title: "首批共創試點準備", tested: "開放申請前所需的範圍、責任和證據。", why: "試點應為場地夥伴與 HK MINIJUNGLE 提供有用的學習計劃。", method: "[CONTENT REQUIRED：確認地區、時長、責任和回覆時間。]", observation: "在範圍確認前，不會把申請描述為已正式開放。", limits: "不製造虛假稀缺，亦不保證結果。" },
  },
];

export const journalPosts = [
  ["why-hk-minijungle", "Company", "Let nature, art and technology grow together in the city", "讓自然、藝術與科技，共同生長於城市"],
  ["compact-hong-kong-workplaces", "Ideas", "Designing for compact Hong Kong workplaces", "為香港緊湊辦公室而設計"],
  ["inside-xponge", "Product", "HK MINIJUNGLE and Hong Kong Googol Technology explore smart planting", "HK MINIJUNGLE 與香港固高科技有限公司就智慧種植進行深度溝通"],
  ["low-interruption-care", "ESG", "ESG in Hong Kong", "ESG 在香港的應用"],
  ["prototype-to-place", "Partnership", "HK MINIJUNGLE and HKPC start a local GreenCanvas trial", "HK MINIJUNGLE 與香港生產力促進局啟動 GreenCanvas 本地試驗合作"],
  ["founding-pilot-programme", "Pilot", "Define together, verify in the real space", "共同定義，真實驗證"],
].map(([slug, category, titleEn, titleZh], index) => ({
  slug,
  category,
  readingTime: `${4 + (index % 3)} min`,
  image: [
    "/images/docx-why-hk-minijungle.png",
    "/images/docx-hk-density-office.png",
    "/images/docx-hk-googol-team.png",
    "/images/docx-esg-office.png",
    "/images/docx-hkpc-team.png",
    "/images/docx-pilot-co-creation.png",
  ][index],
  imageLabel: index === 0 || index === 3 ? "concept" : null,
  galleryLayout: index === 1 ? "hero-plus-gallery" : null,
  galleryLabel: index === 1 ? "concept" : null,
  gallery: index === 1
    ? ["/images/canviva-office-living-wall.png", "/images/canviva-art-wall.jpg"]
    : index === 2
      ? ["/images/docx-hk-googol-smart-growing.png"]
    : index === 3
      ? []
    : index === 4
      ? ["/images/docx-hkpc-green-wall.png"]
      : [],
  en: {
    title: titleEn,
    excerpt: [
      "A short editorial note connecting space, plant life, material choices and ongoing care.",
      "In a city where every square foot has to work harder, a smarter vertical system can bring nature into the office without asking for more floor area.",
      "HK MINIJUNGLE and Hong Kong Googol Technology Co., Ltd. discuss smart planting, control integration and future application scenarios.",
      "ESG evidence starts with employee wellbeing, precise biophilic design inputs and records that can travel with the project.",
      "HK MINIJUNGLE and HKPC start a six-month local trial to evaluate GreenCanvas in real Hong Kong settings.",
      "The first pilots are a shared product-validation exercise, with scope, responsibilities and evidence agreed before installation.",
    ][index],
    body: [
      [
        "HK MINIJUNGLE was born in Hong Kong, where denser cities and more expensive space push people and nature further apart. Traditional indoor planting can take up scarce floor area, depend on frequent maintenance and lose its beauty when plant health declines.",
        "We believe indoor planting should be a fusion of nature, art and technology. Nature is living growth; art is the expression formed by plants, materials, light and space; technology is the foundation that lets life and beauty endure. Each product is designed as a continuously growing living artwork that can enter architecture and interior design without taking too much space.",
        "Built on Xponge, HK MINIJUNGLE integrates modular products, plant composition, lighting art, intelligent sensing and Doctor Forest data operations so indoor nature is lighter, lower-maintenance, more monitorable and more valuable to the space. Technology does not replace nature; it helps plants grow healthier. Art is not a surface layer; it lets nature enter buildings, furniture and daily life.",
        "We do not use plant counts to package ‘green’. We use healthy long-lived plants, restrained and recognisable design, and transparent traceable operating records to reconnect cities, people and nature. Hong Kong is the starting point; the NATURE + ART + TECHNOLOGY micro-ecosystem can travel to more Asian and international cities, giving even a small space room for a growing work of natural art.",
      ],
      [
        "Hong Kong’s compactness is more than a visual impression. Government figures put the territory’s land area at about 1,114.57 square kilometres, with a mid-2025 population of roughly 7.5 million and an average density of 6,870 people per square kilometre. In a core business district such as Central, space is no longer just a container for desks; it is an asset that needs to be managed precisely.",
        "That pressure is visible in rent. Grade-A Central office rents rose 7.3% in the first half of 2026; landmark buildings such as One IFC and Two IFC were above HKD 130 per square foot per month, while Central’s vacancy rate fell to 8.8% at the end of June. At HKD 130 as an illustration, a 500-square-foot office represents about HKD 65,000 in basic monthly rent, or HKD 780,000 a year before management fees, rates and fit-out.",
        "CBRE’s 2015 workplace research recorded Hong Kong workstation allocations falling from about 100 square feet to 50–60 square feet, a range it described as a productivity danger zone when it drops below 60. Compact-office design therefore needs to move more functions from the floor to the wall, rather than only shrinking desks and corridors.",
        "That is the starting point for CANVIVA. A standard module of roughly 550 mm wide by 2,400 mm high can form a 1.32-square-metre vertical planting face for about 45 plants—about 34 plants per square metre—integrating planting, Xponge growth media, circulation, lighting and structure without a large planter or green island.",
        "Compact space also changes faster: concentrated occupancy, long air-conditioning hours and limited natural ventilation can move temperature, humidity and carbon dioxide over the course of a day. Doctor Forest connects these readings to plant records, equipment state, alerts, inspections, work orders and service history, creating a loop from discovery to resolution.",
        "CANVIVA’s operating target is routine on-site care about once a month, with continuous monitoring filling the information gap between visits. Planned AI analysis will support anomaly recognition, risk alerts, care guidance and scheduling; it assists horticulturists and facilities teams rather than replacing them.",
        "Hong Kong’s Indoor Air Quality Certification Scheme has Excellent and Good levels, with certificates valid for 12 months. Doctor Forest readings support daily operations and trend prompts; they do not replace formal IAQ testing by a recognised body, and plants are not described as a substitute for mechanical ventilation.",
        "CANVIVA is not another decorative object in a compact office. It turns an underused vertical interface into living, maintainable and monitorable spatial infrastructure—creating more long-term value from limited space.",
      ],
      [
        "Recently, HK MINIJUNGLE and Hong Kong Googol Technology Co., Ltd. held an in-depth exchange on smart planting technology, control-system integration and future application scenarios. The discussion covered automated irrigation, environmental sensing, device control, operating-data capture and remote operations around the GreenCanvas smart wall ecosystem and HK MINIJUNGLE’s future product matrix.",
        "HK MINIJUNGLE shared practical needs from Hong Kong offices, commercial spaces and public environments, including substrate moisture, water quality, temperature, humidity, carbon dioxide and light monitoring, together with Doctor Forest plans for plant-health management, anomaly alerts and service records. Hong Kong Googol contributed views on automation control, hardware coordination, system stability and engineering deployment. Both sides also discussed sensor/controller interfaces, irrigation strategies, reliability, modular expansion and small-scale trials.",
        "The exchange provides useful technical reference for the next stage. Both sides will continue to study interfaces and trial plans, with any formal cooperation subject to later written confirmation.",
      ],
      [
        "Indoor planting supports the social side of ESG through employee health and wellbeing and a healthy, biophilic work environment—not by replacing ventilation or claiming a small number of plants is a carbon or air-treatment system.",
        "At project start, HK MINIJUNGLE can help set planting area, location and sightline relationships against WELL v2 M02 Nature and Place and BEAM Plus Interiors v2.0 HWB-01-02 Biophilic Design. Doctor Forest then keeps the plant asset list, plans, area calculations, installation photos, readings, utilities, work orders and replacement history in an exportable evidence pack.",
        "The evidence supports certification submissions and ESG disclosure; final scores and certification remain subject to review by the recognised assessor and qualified consultant.",
      ],
      [
        "On 23 July 2026, HK MINIJUNGLE and the Hong Kong Productivity Council (HKPC) signed a consultancy services contract to start a local trial and feasibility assessment of GreenCanvas, the Xponge smart wall ecosystem.",
        "HKPC will support product design and testing, local pilot-site selection, a six-month field operation test, regular inspections and stage assessments, with a system installed at its Resource Circulation Research Centre Green Materials Laboratory for ongoing display and testing.",
        "HK MINIJUNGLE will use real scenes to evaluate installation fit, plant growth, maintenance efficiency and operating feasibility in Hong Kong offices and commercial spaces, then refine the product and service toward a lighter, lower-maintenance and easier-to-deploy indoor ecosystem.",
      ],
      [
        "HK MINIJUNGLE treats the first pilots as a shared product-validation exercise, not a one-way installation. Clients bring real spatial needs, user feedback and operating goals; we bring module configuration, planting, installation, maintenance and Doctor Forest records.",
        "Clients receive a solution shaped around the real setting and evidence suitable for internal reporting. HK MINIJUNGLE uses operating results to improve the product and service. Each pilot agrees scope, duration, responsibilities, data use and next-step commercial arrangements in advance so co-creation stays transparent, measurable and useful to both sides.",
      ],
    ][index],
  },
  "zh-hk": {
    title: titleZh,
    excerpt: [
      "一篇連結空間、植物生命、材料選擇與持續養護的編輯短文。",
      "在每平方呎都需要被精確計算的城市，智慧的垂直系統讓自然進入辦公室，而不必佔用更多平面空間。",
      "HK MINIJUNGLE 與香港固高科技有限公司就智慧種植、控制系統整合及未來應用場景進行深入交流。",
      "ESG 實證由員工健康與福祉、準確的親自然設計輸入，以及可隨項目交付的記錄開始。",
      "HK MINIJUNGLE 與 HKPC 啟動為期六個月的本地試驗，評估 GreenCanvas 在香港真實場景的運行可行性。",
      "首批試點是共同完成的產品驗證，安裝前先明確範圍、責任與實證方法。",
    ][index],
    body: [
      [
        "HK MINIJUNGLE誕生於香港。我們看到，城市愈密集、空間愈昂貴，人與自然之間的距離反而愈來愈遠。傳統室內綠化往往佔用有限的地面空間、依賴頻繁維護，也容易在植物狀態下降後失去原有的美感。自然因此常常只是短暫的裝飾，而沒有真正成為空間與日常生活的一部分。",
        "我們相信，室內綠化不應只是把植物搬進建築，而應是自然、藝術與科技的融合。自然，是持續生長的生命；藝術，是植物、材料、光影與空間共同形成的表達；科技，則是讓這份生命與美感得以長期穩定存在的基礎。以此為核心，HK MINIJUNGLE希望把每一套產品都設計成一幅持續生長的「生命畫作」：它不佔用過多空間，能夠融入建築與室內設計，也會隨植物的生長產生層次、色彩與時間的變化。",
        "HK MINIJUNGLE以Xponge新型種植材料為基礎，將模組化產品設計、植物配置、燈光藝術、智慧感測與Doctor Forest數據化運維系統整合在一起，讓室內自然更輕量、更低維護、更可監測，也更具空間美學價值。科技並不是為了取代自然，而是讓植物更健康地生長；藝術也不是附加的外觀，而是讓自然真正融入建築、家具與人的生活。",
        "我們不希望用植物數量包裝「綠色」，而是希望以長期健康的植物、克制而有辨識度的設計，以及透明可追溯的運行記錄，重新建立城市、人與自然之間的連接。香港是HK MINIJUNGLE的起點；未來，我們希望把這套融合 NATURE + ART + TECHNOLOGY 的微型生態解決方案帶到更多亞洲及國際城市——讓空間再小，也能容納一件持續生長的自然藝術作品。",
      ],
      [
        "香港的緊湊，不只是一種視覺感受。香港政府公布的資料顯示，全港土地面積約為1,114.57平方公里，2025年中人口約750萬，平均人口密度約為每平方公里6,870人。當城市密度進一步集中到中環這類核心商業區，空間便不再只是容納辦公桌的容器，而是一項需要被精確管理的企業資產。",
        "這種壓力也直接反映在租金上。2026年上半年，中環甲級寫字樓租金上升7.3%；One IFC、Two IFC等指標建築的租金已超過每平方呎每月HKD 130，而中環空置率在2026年6月底下降至8.8%。若僅以HKD 130作示意，一個500平方呎的辦公室，每月基本租金便約為HKD 65,000，全年約HKD 780,000，尚未計算管理費、差餉及裝修成本。",
        "香港辦公空間的壓縮其實早已發生。CBRE在2015年的工作場所研究中指出，香港新辦公室的靜態配置曾由每個工位約100平方呎，下降至約50–60平方呎，即約4.65–5.57平方米；報告同時把低於60平方呎視為可能影響專注度、協作條件、員工表現及留任的「生產力危險區」。因此，緊湊辦公設計不應只是繼續縮小桌面、收窄通道，而應把更多功能從地面轉移到牆面，釋放有限的平面空間。",
        "這正是 CANVIVA 的設計起點。單組標準模組約為550毫米寬、2,400毫米高，可形成1.32平方米的垂直種植展示面，配置約45株植物；按展示面計算，相當於每平方米約34株。植物、Xponge生長介質、循環水路、植物照明及固定結構被整合到同一套垂直系統中，不需要以大型盆器或獨立綠化島佔用主要辦公平面。僅以一段550毫米寬的牆面，便能建立從桌面高度延伸至天花附近的完整自然界面。",
        "緊湊空間同時意味著環境變化更快：人員集中、冷氣長時間運行、自然通風有限，溫度、濕度及二氧化碳水平都可能在一天內出現明顯波動。Doctor Forest 將透過水質、基質含水率（MC）、二氧化碳、溫度及濕度等感測手段，持續掌握植物生長條件與辦公環境變化。數據會進入運維平台，與植物檔案、設備狀態、異常警報、巡檢任務、維護工單及服務記錄連接，形成從問題發現、任務分派到處理完成的閉環。",
        "目前 CANVIVA 的運維設計目標，是把常規現場維護控制在約每月一次，同時利用持續監測補足兩次服務之間的資訊空白。即將導入的AI技術，將進一步分析即時數據與歷史趨勢，協助進行異常識別、風險預警、植物養護建議及維護排程。AI不取代園藝師或物業設施管理人員，而是幫助他們更早發現問題，並以一致、可追蹤的方式完成服務。",
        "香港的室內空氣質素認證計劃採用「卓越級」及「良好級」兩級標準，證書有效期為12個月。Doctor Forest所提供的二氧化碳、溫濕度等讀數主要服務於日常運維和趨勢提示，不能替代認可機構進行的正式IAQ檢測，也不把植物描述為機械通風的替代品。",
        "CANVIVA不是在緊湊辦公室中再加入一件裝飾物，而是把原本閒置的垂直界面轉化為可生長、可維護、可監測的空間基礎設施。對香港辦公室而言，真正有效的自然設計，不是佔用更多面積，而是讓有限空間產生更多長期價值。",
      ],
      [
        "近日，HK MINIJUNGLE 團隊與香港固高團隊就智慧種植技術、控制系統整合及未來應用場景進行了深入交流。雙方圍繞 GreenCanvas 智慧壁掛生態綠化系統及 HK MINIJUNGLE 未來產品矩陣，重點探討自動灌溉、環境感知、設備控制、運行數據採集和遠程運維等技術方向，以及如何將 Xponge 無土栽培基質、植物種植系統與自動化控制能力進一步整合。",
        "交流期間，HK MINIJUNGLE 分享了產品在香港辦公、商業及公共空間中的實際應用需求，包括基質含水率、水質、溫濕度、二氧化碳及光照等數據監測，以及 Doctor Forest 運維系統在植物健康管理、異常預警和維護記錄方面的規劃。香港固高則從自動化控制、硬件協同、系統穩定性及工程化部署等角度提出了專業意見。雙方亦就感測器與控制器接口、灌溉策略、設備可靠性、模組化擴展及小規模試驗驗證等議題交換了看法。",
        "此次交流為 HK MINIJUNGLE 進一步完善智慧種植系統提供了有價值的技術參考。下一階段，雙方將繼續研究具體技術接口和試驗方案，評估在產品樣機、真實場景測試及系統整合方面開展合作的可行性，共同探索更加穩定、低維護、可量化管理的智慧種植解決方案。本次交流屬於前期技術探討，具體合作內容將以雙方後續正式確認為準。",
      ],
      [
        "室內綠化對 ESG 的主要價值，在於「S—員工健康與福祉」及健康、具親自然感的工作環境，而不是把少量植物宣稱為顯著減碳或空氣淨化設備。英國與荷蘭的三項辦公室實地研究發現，引入植物可改善工作滿意度、專注度及感知空氣品質，其中一項研究錄得約 15% 的生產效率提升；但研究亦指出，普通盆栽若要達到典型通風系統的 VOC 去除能力，可能需要每平方米 10–1,000 株，因此植物不能取代通風和空氣處理系統。",
        "HK MINIJUNGLE 在項目前期可按照 WELL v2 M02 Nature and Place 及 BEAM Plus Interiors v2.0 HWB-01-02 Biophilic Design 要求協助設定綠化面積、位置與視線關係；交付後則透過 Doctor Forest 運維系統持續保存植物資產清單、平面圖及面積計算、安裝照片、基質含水率、水質、CO₂、溫濕度、用水與用電、維護工單及植物更換記錄，形成可匯出的項目證據包。",
        "HK MINIJUNGLE 提供的是可追溯的設計與營運證據，協助客戶進行認證申報及 ESG 披露；最終得分或認證仍由相關認證機構及合資格顧問審核確認。",
      ],
      [
        "2026 年 7 月 23 日，HK MINIJUNGLE 與香港生產力促進局（HKPC）正式簽署顧問服務合約，啟動「於本地試驗 GreenCanvas（Xponge 智慧壁掛生態綠化系統）及其可行性評估」項目。",
        "HKPC 將協助開展產品設計與測試、本地試點場地甄選、為期六個月的現場運行測試、定期巡檢及階段性評估，並於其資源循環研究中心綠色材料實驗室設置一套系統作持續展示與測試。",
        "HK MINIJUNGLE 希望透過真實場景驗證 GreenCanvas 在香港辦公及商業空間中的安裝適配性、植物生長表現、維護效率與整體運行可行性，並根據評估結果持續優化產品及服務，為香港高密度城市環境探索更輕量、低維護及易於部署的室內生態綠化方案。",
      ],
      [
        "HK MINIJUNGLE 將首批試點視為一項共同完成的產品驗證，而不是一次單向安裝。客戶以真實空間需求、使用反饋及營運目標參與方案決策；我們負責模組配置、植物搭配、安裝維護及 Doctor Forest 數據記錄，並共同檢視空間使用、植物健康、維護投入與使用者感受。",
        "客戶獲得更貼合實際場景的解決方案及可用於內部匯報的實證資料，HK MINIJUNGLE 則依據真實營運結果持續改進產品與服務。每項試點都會事先明確範圍、週期、雙方責任、數據使用及後續商業安排，讓共創建立在透明、可衡量和雙方受益的基礎上。",
      ],
    ][index],
  },
}));

export const statusLabels = {
  en: { pilot: "Pilot preparation", development: "In development", validation: "In validation", prototype: "Prototype", concept: "Concept" },
  "zh-hk": { pilot: "試點準備", development: "開發中", validation: "驗證中", prototype: "樣機", concept: "概念" },
};

export function getLocaleCopy(locale) {
  return copy[locale] || copy.en;
}

export function localize(item, locale) {
  return item?.[locale] || item?.en || {};
}
