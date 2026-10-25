import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, CaretLeft, CaretRight, CheckCircle, ShareNetwork, WarningCircle } from "@phosphor-icons/react";
import {
  journalPosts,
  esgContent,
  getLocaleCopy,
  localize,
  products,
  productFamilies,
  productCatalog,
  settings,
  solutions,
} from "./content.js";
import {
  Accordion,
  ArrowLink,
  Breadcrumbs,
  EvidenceBadge,
  FeatureList,
  ImageFrame,
  ProductCard,
  SectionHeading,
  SiteLink,
  trackEvent,
} from "./components.jsx";
import { aboutFaq } from "./seo.js";
import { OfficeSceneGallery } from "./OfficeSceneGallery.jsx";
import { publicSpaceImages } from "./sceneGalleries.js";
import { PlantDesignShowcase } from "./PlantDesignShowcase.jsx";

const GrassHero = lazy(() => import("./GrassHero.jsx").then((module) => ({ default: module.GrassHero })));

const platformSteps = [
  ["01", "Xponge", "xponge"],
  ["02", "Plant module", "canviva"],
  ["03", "Irrigation & light", "canviva"],
  ["04", "CANVIVA system", "canviva"],
  ["05", "Ongoing care", "canviva"],
];

const homeEntryCards = {
  en: [
    { number: "01", eyebrow: "Public spaces", title: "Turn an underused wall into a maintained living feature.", body: "From workplaces and shopping malls to brand stores, define the setting, installation boundary and ongoing care together.", href: "/solutions", action: "Explore the settings", status: "Typical budget range pending" },
  ],
  "zh-hk": [
    { number: "01", eyebrow: "公共空間", title: "把未被善用的牆面，變成有人負責養護的自然界面。", body: "從辦公、購物商場到品牌店，一起確認空間角色、安裝邊界與持續養護。", href: "/solutions", action: "探索應用場景", status: "典型預算範圍待補充" },
  ],
};

const homeProofCards = {
  en: [
    { number: "01", meta: "Local validation", title: "HKPC local trial record", body: "A documented local trial and feasibility-assessment path, with the current scope and limits stated rather than presented as a finished client case.", href: "/journal/prototype-to-place", action: "Read the trial record" },
    { number: "02", meta: "Product transparency", title: "Known details and missing materials shown together", body: "Product pages separate current information from dimensions, installation conditions, pricing and validation material that still need confirmation.", href: "/products/canviva", action: "Review product information" },
    { number: "03", meta: "Operations readiness", title: "Designed beyond installation", body: "CANVIVA projects define the care owner, service access and records needed to keep the living system operating after handover. AI-enabled operations are scoped only where actually configured.", href: "/technology/proof", action: "See the record approach" },
  ],
  "zh-hk": [
    { number: "01", meta: "本地驗證", title: "HKPC 本地試驗記錄", body: "公開本地試驗與可行性評估路徑，清楚標示現階段範圍和限制，而不是把它包裝成已完成客戶案例。", href: "/journal/prototype-to-place", action: "閱讀試驗記錄" },
    { number: "02", meta: "產品透明度", title: "已知資料與缺少材料並列呈現", body: "產品頁把現有資料，與仍待確認的尺寸、安裝條件、價格及驗證材料清楚分開。", href: "/products/canviva", action: "查看產品資料" },
    { number: "03", meta: "運行準備", title: "不止於完成安裝", body: "CANVIVA 項目會在交付前確認養護責任人、服務通道與持續記錄；只有在實際配置時，才描述 AI-enabled operations 能力。", href: "/technology/proof", action: "了解記錄方式" },
  ],
};

const homeProcessSteps = {
  en: [
    ["01", "Send a short brief", "Share the space type, a few current photos and the intended timing. No polished specification is needed to begin."],
    ["02", "Check site fit", "Review the usable surface, access, services, operating constraints and who will own ongoing care."],
    ["03", "Define scope and quotation", "Set out the concept, included and excluded work, information still required, programme and project quotation."],
    ["04", "Pilot and document", "Where a pilot is appropriate, agree responsibilities, review points and the evidence or service records to retain."],
  ],
  "zh-hk": [
    ["01", "提供簡短場地資料", "只需先提供空間類型、幾張現場相片及預期時間，毋須一開始便準備完整規格。"],
    ["02", "判斷場地適配", "核對可用牆面或位置、施工通道、現場條件、營運限制，以及日後養護責任人。"],
    ["03", "定義範圍與報價", "列明概念方案、包含與不包含項目、尚欠資料、預計程序和項目報價。"],
    ["04", "試點、記錄與檢視", "如適合試點，先約定雙方責任、檢視節點，以及需要保留的實證或服務記錄。"],
  ],
};

const productGuides = {
  canviva: {
    en: {
      status: "Co-created pilot",
      statusBody: "The system is being defined and verified with pilot partners. Final specification, lead time and commercial terms are agreed for each site.",
      definition: "CANVIVA is a family of modular living plant systems for workplaces, property, hospitality and public interiors. CANVIVA SIGNATURE, CANVIVA WALL and CANVIVA PANEL share planting modules, Xponge growing media, irrigation, plant lighting and an operations-ready care plan.",
      components: [
        ["Planting interface", "A vertical planting face configured around the space and the intended visual role."],
        ["Xponge root zone", "The material layer that supports moisture, nutrients and airflow around the roots."],
        ["Water and light", "Circulation and plant-lighting requirements are coordinated with the site design."],
        ["Operations layer", "Service access, care ownership and project records stay connected to the installation; monitoring is added where actually configured."],
      ],
      workflow: ["Review the site and operating owner", "Define format, planting and service access", "Confirm installation and care responsibilities", "Pilot, monitor and document"],
      specs: [
        ["Reference module", "Approx. 550 mm W × 2,400 mm H", "current"],
        ["Reference planting face", "Approx. 1.32 m² / about 45 plants", "current"],
        ["Frame, finish and fixing", "Final drawings and material schedule required", "required"],
        ["Power, water and drainage", "Site interface schedule required", "required"],
        ["Network and data connection", "System architecture and site requirements required", "required"],
        ["Routine care", "Current design target: approximately monthly; confirm in service plan", "current"],
      ],
      site: ["Verified wall or floor loading and fixing zone", "Service access without blocking daily circulation", "Confirmed power, water and drainage interfaces", "Reviewed light, air-conditioning and environmental conditions"],
      care: ["Name the client-side operating contact", "Agree routine inspection and plant-replacement boundaries", "Define alert, remote triage and site-response workflow", "Keep readings, actions and before/after records"],
      evidence: ["Current project brief and dimensional design inputs", "Visible concept imagery identified as concept visualisation", "Pilot scope and records to be agreed before installation"],
      missing: ["Issued product drawings and fixing details", "Bill of materials and finish options", "Electrical / hydraulic interface schedule", "Installation and commissioning method", "Maintenance SLA, warranty and replacement policy", "Verified pilot results and approved photography"],
      included: ["Site and needs discussion", "Module and planting proposal", "Installation scope definition", "Initial care and record plan"],
      excluded: ["Unagreed structural or building-services work", "Formal IAQ certification", "Unlisted long-term replacements", "Performance promises not supported by the pilot record"],
    },
    "zh-hk": {
      status: "共創試點",
      statusBody: "系統正與試點夥伴共同定義及驗證；最終規格、交付時間與商業條款按每個場地書面確認。",
      definition: "CANVIVA 是一套面向辦公、物業、酒店及公共室內空間的模組化活體植物產品體系。CANVIVA SIGNATURE、CANVIVA WALL 與 CANVIVA PANEL 共用植物模組、Xponge 生長介質、循環水路、植物照明及可運行的養護方案。",
      components: [
        ["種植界面", "按空間條件與視覺角色配置的垂直種植面。"],
        ["Xponge 根區", "在根部周圍承托水分、養分與空氣流動的材料層。"],
        ["水路與照明", "循環水路與植物照明需求跟隨場地設計協調。"],
        ["運行層", "服務通道、養護責任與項目記錄跟裝置保持連接；監測能力只在實際配置時納入。"],
      ],
      workflow: ["了解場地與營運責任人", "定義形式、植物與維護通道", "確認安裝及養護責任", "試點、監測並形成記錄"],
      specs: [
        ["參考模組", "約 550 mm 寬 × 2,400 mm 高", "current"],
        ["參考種植面", "約 1.32 m²／約 45 株", "current"],
        ["外框、飾面與固定", "需要正式圖紙與材料表", "required"],
        ["電力、供水與排水", "需要場地接口表", "required"],
        ["網絡與數據連接", "需要系統架構及場地要求", "required"],
        ["常規養護", "現有設計目標約每月一次；以服務計劃確認", "current"],
      ],
      site: ["經確認的牆體／地面荷載與固定區域", "不阻礙日常動線的維護通道", "已確認的電力、供水及排水接口", "經檢視的光照、冷氣及環境條件"],
      care: ["指定客戶方營運聯絡人", "確認巡檢、植物更換與責任邊界", "定義警報、遠程判斷及現場處理流程", "保存讀數、處理動作與前後記錄"],
      evidence: ["現有項目簡報與尺寸設計輸入", "已清楚標記為概念效果圖的視覺素材", "安裝前需共同確認的試點範圍與記錄方式"],
      missing: ["正式產品圖紙與固定節點", "材料表與飾面選項", "機電及水路接口表", "安裝與調試方法", "維護 SLA、保養及更換政策", "已驗證試點結果與獲批照片"],
      included: ["場地與需求溝通", "模組及植物方案", "安裝範圍定義", "初始養護與記錄計劃"],
      excluded: ["未經確認的結構或機電工程", "正式 IAQ 認證", "未列明的長期更換", "未有試點記錄支持的性能承諾"],
    },
  },
  "cuisviva-kitchen": {
    en: {
      status: "Product development",
      statusBody: "CUISVIVA KITCHEN is a development-stage home growing product. Final hardware, crop range, service model and availability have not yet been published.",
      definition: "CUISVIVA KITCHEN is a compact culinary growing system intended for kitchens and balconies, combining replaceable planting elements with guided care for everyday herbs.",
      components: [["Growing format", "A compact format intended for kitchen or balcony placement."], ["Replaceable planting elements", "Planting elements are designed to be replaceable; the final cartridge format requires documentation."], ["Light and water system", "The hardware arrangement, capacity and safety specification still require product documents."], ["Guided care", "Care guidance is part of the product definition; the final controls and interface remain to be confirmed."]],
      workflow: ["Check the intended location", "Choose crop and planting element", "Confirm light, water and power arrangement", "Follow care guidance and replacement cycle"],
      specs: [["Product dimensions", "Issued dimensioned drawing required", "required"], ["Supported crops", "Approved crop list and growth conditions required", "required"], ["Lighting", "Output, schedule and eye-comfort information required", "required"], ["Water system", "Capacity, refill cycle and cleaning method required", "required"], ["Power and noise", "Rated power, adapter and operating-noise data required", "required"], ["Availability", "Development and testing plan required", "required"]],
      site: ["Suitable kitchen or balcony location", "Verified light, power and water access", "Safe clearance from heat, cooking and children", "Space for cleaning and replacing planting elements"],
      care: ["Confirm refill and cleaning routine", "Define planting-element replacement cycle", "Provide crop-specific guidance", "Document fault, leak and power-loss handling"],
      evidence: ["Current concept imagery", "Existing product-positioning and audience definition", "No approved performance or crop-cycle report published yet"],
      missing: ["Dimensioned prototype drawings", "Approved crop list and growth-cycle records", "Lighting, irrigation and electrical specification", "Food-contact and material-safety documents", "Cleaning and maintenance guide", "Prototype test results, pricing and availability"],
      included: ["Product concept and intended use", "Early planting-format direction", "Care-guidance requirement"],
      excluded: ["Unverified crop yield or growth-time promise", "Unconfirmed food-safety certification", "Unpublished price or launch date", "A zero-maintenance promise"],
    },
    "zh-hk": {
      status: "產品開發中",
      statusBody: "鮮香植園目前屬開發階段家居種植產品；最終硬件、作物範圍、服務模式與供應時間尚未正式公布。",
      definition: "鮮香植園是一套面向廚房與陽台的緊湊型香草種植系統，以可替換種植組件配合養護指引，讓日常香草更容易進入家居生活。",
      components: [["種植形式", "面向廚房或陽台擺放的緊湊產品形式。"], ["可替換種植組件", "產品方向包含可替換組件；最終耗材形式需要正式文件。"], ["照明與供水", "硬件結構、容量及安全規格仍需產品文件。"], ["養護指引", "養護指引已納入產品定義；最終控制方式與界面待確認。"]],
      workflow: ["確認預定擺放位置", "選擇作物與種植組件", "確認照明、供水與電力安排", "按指引養護及更換組件"],
      specs: [["產品尺寸", "需要正式尺寸圖", "required"], ["支援作物", "需要獲批作物清單與生長條件", "required"], ["植物照明", "需要輸出、時段與視覺舒適資料", "required"], ["供水系統", "需要容量、補水週期與清潔方法", "required"], ["功率與噪音", "需要額定功率、電源及運行噪音資料", "required"], ["供應狀態", "需要開發及測試計劃", "required"]],
      site: ["適合廚房或陽台的擺放位置", "經確認的光線、電力及用水條件", "與熱源、烹飪區及兒童保持安全距離", "預留清潔及更換種植組件的空間"],
      care: ["確認補水與清潔節奏", "定義種植組件更換週期", "提供按作物分類的養護指引", "記錄故障、漏水及斷電處理方式"],
      evidence: ["現有概念效果圖", "既有產品定位與使用對象定義", "目前尚未公布獲批性能或種植週期報告"],
      missing: ["帶尺寸的樣機圖紙", "獲批作物清單與生長週期記錄", "照明、灌溉及電氣規格", "食品接觸與材料安全文件", "清潔及維護指南", "樣機測試結果、定價及供應時間"],
      included: ["產品概念與預定用途", "早期種植形式方向", "養護指引需求"],
      excluded: ["未驗證的產量或生長時間承諾", "未確認的食品安全認證", "未公布的價格或上市日期", "零維護承諾"],
    },
  },
  xponge: {
    en: {
      status: "Validation",
      statusBody: "The material principle and reference figures are documented, while test methods, conditions, versions and limitations still need to be published as an auditable evidence pack.",
      definition: "Xponge is a polyurethane root-zone matrix built around the DualFlow™ principle: macro-pores maintain air pathways while micro-pores hold water and nutrients near the roots.",
      components: [["Polyurethane matrix", "The current product description identifies polyurethane as the material base."], ["Macro-pore network", "Larger pores are intended to maintain continuous air pathways."], ["Micro-pore reservoir", "Smaller pores hold water and nutrients under capillary tension."], ["System interface", "Final sizes, densities and integration methods require product documentation."]],
      workflow: ["Water and nutrients enter the matrix", "Micro-pores hold available moisture", "Macro-pores retain air pathways", "Roots draw from the local water, nutrient and air balance"],
      specs: [["Material base", "Polyurethane polymer", "current"], ["Reference wet-state load", "3–8 kg/m² — test conditions required", "current"], ["Reference irrigation interval", "30+ days — crop and environment required", "current"], ["Reference material life", "3–5 years — version and use conditions required", "current"], ["Pore size, density and format", "Issued technical data sheet required", "required"], ["Water, airflow and durability performance", "Independent test method and report required", "required"]],
      site: ["Match matrix format to the planting module", "Define irrigation, nutrient and drainage conditions", "Confirm crop and root-zone compatibility", "Document cleaning, replacement and end-of-life handling"],
      care: ["Track material version and installation date", "Record irrigation and nutrient conditions", "Inspect compression, contamination and root condition", "Define replacement and disposal route"],
      evidence: ["Current DualFlow™ explanatory article", "Reference performance figures already used on the website", "No complete public test pack currently linked to each claim"],
      missing: ["Technical data sheet and version naming", "Pore-size and density measurements", "Water-retention and airflow test methods", "Crop, climate and irrigation conditions behind reference results", "Durability, cleaning and reuse evidence", "Material-safety and disposal documentation"],
      included: ["Material principle", "Root-zone role", "Current reference figures with limitations"],
      excluded: ["Universal crop-performance claim", "Results without conditions or version", "Unverified environmental or safety claim", "Project performance outside the agreed system"],
    },
    "zh-hk": {
      status: "驗證中",
      statusBody: "材料原理及參考數字已有記錄，但測試方法、條件、版本與限制仍需整理成可審核的實證資料包。",
      definition: "Xponge 是一種以聚氨酯為基礎的根區材料，採用 DualFlow™ 原理：宏孔維持空氣通道，微孔在根部附近承托水分與養分。",
      components: [["聚氨酯基質", "現有產品說明把聚氨酯列為材料基礎。"], ["宏孔網絡", "較大的孔道用於維持持續空氣路徑。"], ["微孔儲水層", "較小孔道透過毛細張力承托水分與養分。"], ["系統接口", "最終尺寸、密度及整合方式需要正式產品文件。"]],
      workflow: ["水分與養分進入基質", "微孔承托可用水分", "宏孔保留空氣通道", "根系從局部水、肥、氣平衡中吸收"],
      specs: [["材料基礎", "聚氨酯聚合物", "current"], ["濕態負荷參考", "3–8 kg/m²；需補測試條件", "current"], ["灌溉間隔參考", "30+ 日；需補作物及環境條件", "current"], ["材料壽命參考", "3–5 年；需補版本及使用條件", "current"], ["孔徑、密度與規格", "需要正式技術資料表", "required"], ["保水、通氣與耐久性能", "需要獨立測試方法與報告", "required"]],
      site: ["讓基質形式配合種植模組", "定義灌溉、養分及排水條件", "確認作物與根區兼容性", "記錄清潔、更換及壽命結束處理"],
      care: ["記錄材料版本與安裝日期", "保存灌溉及養分條件", "檢查壓縮、污染及根系狀態", "定義更換與處置路徑"],
      evidence: ["現有 DualFlow™ 說明文章", "網站已使用的參考性能數字", "目前尚未為每項說法連接完整公開測試資料包"],
      missing: ["技術資料表與版本命名", "孔徑及密度測量", "保水與空氣流動測試方法", "參考結果對應的作物、氣候及灌溉條件", "耐久、清潔及重用證據", "材料安全及棄置文件"],
      included: ["材料原理", "根區角色", "帶限制說明的現有參考數字"],
      excluded: ["適用所有作物的性能承諾", "沒有條件或版本的結果", "未驗證的環境或安全說法", "超出協議系統範圍的項目表現"],
    },
  },
  "doctor-forest": {
    en: {
      status: "System development",
      statusBody: "The monitoring and service-loop model is defined. Final sensor models, connectivity, data governance, response levels and AI functions still require issued documentation.",
      definition: "DR FOREST is HK MINIJUNGLE’s intelligent-care and operations layer, connecting environmental readings, plant and equipment records, alerts, work orders and service history.",
      components: [["Sensing", "The current scope includes water quality, substrate moisture, CO₂, temperature and humidity."], ["Plant and equipment records", "Each installation can connect readings and actions to the relevant asset record."], ["Alert and work-order loop", "Abnormal readings can move from alert to triage, task and completion record."], ["Planned AI support", "Anomaly recognition and care suggestions are a development direction, not a completed autonomous service claim."]],
      workflow: ["Collect agreed readings", "Detect an exception or scheduled task", "Review remotely and assign responsibility", "Complete site action and retain the service record"],
      specs: [["Current sensing scope", "Water quality, MC, CO₂, temperature and humidity", "current"], ["Routine site care", "Current operating target: approximately monthly", "current"], ["Sensor model and accuracy", "Calibration and specification pack required", "required"], ["Connectivity and power", "Network and electrical architecture required", "required"], ["Data frequency and retention", "Data-governance policy required", "required"], ["Alert and response levels", "Service SLA and escalation matrix required", "required"]],
      site: ["Agree sensor positions and monitored assets", "Confirm network, power and access conditions", "Name client and service-side owners", "Agree privacy, access and record-retention rules"],
      care: ["Scheduled inspection and cleaning", "Remote review of alerts", "Site response when agreed thresholds require it", "Time, readings, action, photo and completion record"],
      evidence: ["Current monitoring and service-loop description", "Existing sensor-scope and monthly-care design target", "AI functions remain described as planned capability"],
      missing: ["Sensor list, accuracy and calibration method", "Connectivity, offline and power-loss behaviour", "Dashboard and alert-state screenshots", "Data owner, access, privacy and retention policy", "Response SLA and escalation rules", "Validated AI function scope and limitations"],
      included: ["Monitoring scope definition", "Plant and equipment record model", "Alert and service-record workflow"],
      excluded: ["Autonomous diagnosis guarantee", "Replacement for formal IAQ testing", "Unagreed emergency response", "Unpublished data or AI performance claim"],
    },
    "zh-hk": {
      status: "系統開發中",
      statusBody: "監測與服務閉環模式已定義；最終感測器型號、連接方式、數據治理、回應級別與 AI 功能仍需正式文件。",
      definition: "DR FOREST 是 HK MINIJUNGLE 的智能養護與運維層，把環境讀數、植物與設備檔案、警報、工單及服務歷史連接起來。",
      components: [["多維感測", "現有範圍包括水質、基質含水率、CO₂、溫度及濕度。"], ["植物與設備檔案", "每組裝置可把讀數與處理動作連接至相應資產記錄。"], ["警報與工單閉環", "異常讀數可由警報進入判斷、任務及完成記錄。"], ["規劃中的 AI 支援", "異常識別與養護建議屬開發方向，不代表已完成的自主服務。"]],
      workflow: ["採集協議內的讀數", "識別異常或定期任務", "遠程判斷並分派責任", "完成現場處理並保存服務記錄"],
      specs: [["現有感測範圍", "水質、MC、CO₂、溫度及濕度", "current"], ["常規現場養護", "現有運行目標約每月一次", "current"], ["感測器型號與精度", "需要校準及規格資料包", "required"], ["連接方式與供電", "需要網絡及電氣架構", "required"], ["數據頻率與保留", "需要數據治理政策", "required"], ["警報與回應級別", "需要服務 SLA 與升級矩陣", "required"]],
      site: ["確認感測器位置與受監測資產", "確認網絡、供電與操作通道", "指定客戶方與服務方責任人", "協議私隱、存取及記錄保留規則"],
      care: ["定期巡檢與清潔", "對警報進行遠程判斷", "協議閾值觸發時安排現場處理", "保存時間、讀數、處理、照片及完成狀態"],
      evidence: ["現有監測與服務閉環說明", "既有感測範圍與月度養護設計目標", "AI 功能仍清楚描述為規劃能力"],
      missing: ["感測器清單、精度與校準方法", "網絡中斷、離線及斷電行為", "儀表板與警報狀態畫面", "數據擁有人、存取、私隱及保留政策", "回應 SLA 與升級規則", "已驗證 AI 功能範圍及限制"],
      included: ["監測範圍定義", "植物與設備檔案模式", "警報與服務記錄流程"],
      excluded: ["自主診斷保證", "取代正式 IAQ 檢測", "未經協議的緊急回應", "未公布的數據或 AI 性能說法"],
    },
  },
};

function ProductGuide({ locale, product }) {
  const guide = productGuides[product.slug]?.[locale] || productGuides[product.slug]?.en;
  if (!guide) return null;
  const isZh = locale === "zh-hk";
  const prefix = `product-${product.slug}`;
  const sections = [
    ["overview", isZh ? "產品概覽" : "Overview"],
    ["working", isZh ? "組成與運作" : "System & flow"],
    ["specs", isZh ? "規格與條件" : "Specifications"],
    ["care", isZh ? "安裝與養護" : "Installation & care"],
    ["evidence", isZh ? "實證與待補" : "Evidence & gaps"],
  ];
  const materialLabel = isZh ? "待補充材料" : "Material required";
  const currentLabel = isZh ? "現有資料" : "Current information";

  return (
    <div className="product-guide">
      <nav className="product-story-nav" aria-label={isZh ? "產品說明章節" : "Product information sections"}>
        <div className="page-shell product-story-nav__inner">
          <span>{locale === "en" ? product.name : (product.nameZh || product.name)}</span>
          <div>{sections.map(([id, label]) => <a key={id} href={`#${prefix}-${id}`}>{label}</a>)}</div>
        </div>
      </nav>

      <section className="section section--paper product-guide__overview" id={`${prefix}-overview`}>
        <div className="page-shell">
          <div className="product-status-card">
            <div><span className="product-status-card__label">{isZh ? "目前狀態" : "Current status"}</span><strong>{guide.status}</strong></div>
            <p>{guide.statusBody}</p>
          </div>
          <div className="product-definition">
            <div><p className="eyebrow">{isZh ? "產品定義" : "Product definition"}</p><h2>{isZh ? "先說清楚，它是甚麼。" : "Start with what it is."}</h2></div>
            <p className="large-copy">{guide.definition}</p>
          </div>
        </div>
      </section>

      <section className="section section--sand" id={`${prefix}-working`}>
        <div className="page-shell">
          <SectionHeading eyebrow={isZh ? "系統組成" : "System composition"} title={isZh ? "每一層都有清晰角色。" : "Every layer has a clear role."} />
          <div className="product-component-grid">{guide.components.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <div className="product-flow"><p className="eyebrow">{isZh ? "如何運作" : "How it works"}</p><ol>{guide.workflow.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol></div>
        </div>
      </section>

      <section className="section section--paper" id={`${prefix}-specs`}>
        <div className="page-shell product-spec-layout">
          <div><p className="eyebrow">{isZh ? "決策資料" : "Decision information"}</p><h2>{isZh ? "已知資料與缺口，分開呈現。" : "Separate known facts from open gaps."}</h2><p>{isZh ? "缺少的資料不會被隱藏；收到正式文件後可直接替換對應欄位。" : "Missing information stays visible and can be replaced directly when issued documents arrive."}</p></div>
          <div className="product-spec-table" role="table" aria-label={isZh ? "產品規格與資料狀態" : "Product specifications and information status"}>
            {guide.specs.map(([label, value, state]) => <div role="row" key={label}><strong role="rowheader">{label}</strong><span role="cell">{value}</span><em role="cell" className={`info-state info-state--${state}`}>{state === "required" ? materialLabel : currentLabel}</em></div>)}
          </div>
        </div>
      </section>

      <section className="section section--forest" id={`${prefix}-care`}>
        <div className="page-shell product-care-grid">
          <div><p className="eyebrow eyebrow--light">{isZh ? "場地與安裝" : "Site & installation"}</p><h2>{isZh ? "安裝前需要確認" : "Confirm before installation"}</h2><FeatureList items={guide.site} /></div>
          <div><p className="eyebrow eyebrow--light">{isZh ? "運行與養護" : "Operations & care"}</p><h2>{isZh ? "把責任寫清楚" : "Make responsibility explicit"}</h2><FeatureList items={guide.care} /></div>
        </div>
      </section>

      <section className="section section--paper" id={`${prefix}-evidence`}>
        <div className="page-shell product-evidence-layout">
          <div className="product-evidence-copy"><p className="eyebrow">{isZh ? "實證狀態" : "Evidence status"}</p><h2>{isZh ? "目前可以說甚麼。" : "What can be said today."}</h2><FeatureList items={guide.evidence} /></div>
          <aside className="materials-needed" aria-labelledby={`${prefix}-materials-title`}>
            <WarningCircle aria-hidden="true" />
            <div><span>{materialLabel}</span><h3 id={`${prefix}-materials-title`}>{isZh ? "完成本產品說明仍需要" : "Still needed to complete this product record"}</h3><ul>{guide.missing.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </aside>
          <div className="scope-grid">
            <article><p className="eyebrow">{isZh ? "目前包含" : "Currently included"}</p><FeatureList items={guide.included} /></article>
            <article><p className="eyebrow">{isZh ? "不代表包含" : "Not implied"}</p><FeatureList items={guide.excluded} /></article>
          </div>
        </div>
      </section>
    </div>
  );
}

const xpongeSources = [
  {
    type: "image/avif",
    srcSet: "/images/xponge-material-concept-640.avif 640w, /images/xponge-material-concept-960.avif 960w, /images/xponge-material-concept-1280.avif 1280w, /images/xponge-material-concept-1536.avif 1536w",
  },
  {
    type: "image/webp",
    srcSet: "/images/xponge-material-concept-640.webp 640w, /images/xponge-material-concept-960.webp 960w, /images/xponge-material-concept-1280.webp 1280w, /images/xponge-material-concept-1536.webp 1536w",
  },
];

const cuisvivaSpinFrames = Array.from(
  { length: 8 },
  (_, index) => `/images/cuisviva-spin-concept-v1-${String(index).padStart(2, "0")}.webp`,
);

function ProductSpin({ locale, variant = "detail" }) {
  const [frame, setFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const viewerRef = useRef(null);
  const hoverFrameRef = useRef(null);
  const isZh = locale === "zh-hk";
  const isHome = variant === "home";
  const frameLabel = isZh
    ? ["正面", "右前方", "右側", "右後方", "背面", "左後方", "左側", "左前方"][frame]
    : ["Front", "Front right", "Right side", "Rear right", "Rear", "Rear left", "Left side", "Front left"][frame];

  useEffect(() => {
    const preloadFrames = () => {
      cuisvivaSpinFrames.slice(1).forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    };
    const viewer = viewerRef.current;
    if (!viewer || !("IntersectionObserver" in window)) {
      preloadFrames();
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      preloadFrames();
      observer.disconnect();
    }, { rootMargin: "360px" });
    observer.observe(viewer);
    return () => observer.disconnect();
  }, []);

  function moveTo(nextFrame, method) {
    setFrame((nextFrame + cuisvivaSpinFrames.length) % cuisvivaSpinFrames.length);
    if (method) trackEvent("rotate_product_view", { product: "cuisviva-kitchen", method });
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, frame };
    setDragging(true);
  }

  function handlePointerMove(event) {
    if (!dragStart.current) {
      if (!isHome || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const nextFrame = Math.round(ratio * (cuisvivaSpinFrames.length - 1));
      if (nextFrame !== hoverFrameRef.current) {
        hoverFrameRef.current = nextFrame;
        setFrame(nextFrame);
      }
      return;
    }
    const frameDelta = Math.round((event.clientX - dragStart.current.x) / 34);
    moveTo(dragStart.current.frame - frameDelta);
  }

  function handlePointerLeave() {
    hoverFrameRef.current = null;
  }

  function endDrag() {
    if (dragStart.current) trackEvent("rotate_product_view", { product: "cuisviva-kitchen", method: "drag" });
    dragStart.current = null;
    setDragging(false);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(frame - 1, "keyboard");
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(frame + 1, "keyboard");
    }
  }

  const stage = (
    <div className="product-spin-stage">
          <div
            ref={viewerRef}
            className="product-spin-viewer"
            data-dragging={dragging ? "true" : "false"}
            role="slider"
            aria-label={isZh ? "鮮香植園 360 度概念產品視圖" : "CUISVIVA KITCHEN 360-degree concept product view"}
            aria-valuemin="1"
            aria-valuemax={cuisvivaSpinFrames.length}
            aria-valuenow={frame + 1}
            aria-valuetext={`${frameLabel}, ${frame * 45}°`}
            tabIndex="0"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onPointerLeave={handlePointerLeave}
          >
            <img
              src={cuisvivaSpinFrames[frame]}
              width="1536"
              height="1024"
              alt={isZh ? `鮮香植園 ${frameLabel}概念效果圖` : `CUISVIVA KITCHEN ${frameLabel} concept visualisation`}
              draggable="false"
              loading="lazy"
            />
            <span className="product-spin-badge">{isZh ? "概念效果圖" : "Concept visualisation"}</span>
            <span className="product-spin-hint" aria-hidden="true">{isHome ? (isZh ? "移動滑鼠或拖動" : "Move mouse or drag") : (isZh ? "左右拖動" : "Drag left / right")}</span>
          </div>
          <div className="product-spin-controls">
            <button type="button" onClick={() => moveTo(frame - 1, "button")} aria-label={isZh ? "上一個視角" : "Previous angle"}><CaretLeft aria-hidden="true" /></button>
            <div className="product-spin-progress" aria-hidden="true">
              {cuisvivaSpinFrames.map((_, index) => <span key={index} data-active={index === frame ? "true" : "false"} />)}
            </div>
            <span className="product-spin-count">{String(frame + 1).padStart(2, "0")} / {String(cuisvivaSpinFrames.length).padStart(2, "0")} · {frame * 45}°</span>
            <button type="button" onClick={() => moveTo(frame + 1, "button")} aria-label={isZh ? "下一個視角" : "Next angle"}><CaretRight aria-hidden="true" /></button>
          </div>
    </div>
  );

  if (isHome) {
    return (
      <article className="home-product-spin">
        <div className="home-product-spin__copy">
          <p className="eyebrow">{isZh ? "互動產品展示" : "Interactive product view"}</p>
          <h3>{isZh ? "鮮香植園" : "CUISVIVA KITCHEN"}</h3>
          <p>{isZh ? "把滑鼠在機器上左右移動，或直接拖動，查看不同角度。手機可左右拖動，亦可使用方向鍵。" : "Move the pointer across the machine or drag it to view different angles. On touch screens, swipe or use the direction controls."}</p>
          <ArrowLink href={`/${locale}/products/cuisviva-kitchen`}>{isZh ? "查看產品詳情" : "View product details"}</ArrowLink>
        </div>
        {stage}
      </article>
    );
  }

  return (
    <section className="section section--paper product-spin-section">
      <div className="page-shell product-spin-layout">
        <div className="product-spin-copy">
          <p className="eyebrow">360° product view</p>
          <h2>{isZh ? "拖動，從各角度查看。" : "Drag to see it from every angle."}</h2>
          <p>{isZh ? "左右拖動產品、點擊方向鍵，或使用鍵盤左右鍵切換視角。這組影像用來預演網站互動，並非已確認的工程外觀。" : "Drag the product, use the direction buttons, or press the keyboard arrow keys to change the view. These images preview the website interaction and are not confirmed engineering views."}</p>
          <div className="product-spin-pending">
            <span>{isZh ? "待補充材料" : "Materials required"}</span>
            <p>{isZh ? "正式 36–48 幀環拍、背面結構、接口位置與尺寸圖。收到後可原位替換，毋須重做互動。" : "Final 36–48 frame turntable photography, rear construction, interface positions and dimensioned drawings. These can replace the concept frames without rebuilding the interaction."}</p>
          </div>
        </div>
        {stage}
      </div>
    </section>
  );
}

export function HomePage({ locale }) {
  const c = getLocaleCopy(locale);
  const entryCards = homeEntryCards[locale];
  return (
    <>
      <section className="home-hero">
        <Suspense fallback={<div className="grass-hero grass-hero--fallback" aria-hidden="true" />}>
          <GrassHero locale={locale} />
        </Suspense>
        <p className="sr-only">{locale === "en" ? "An interactive field of grass responds locally to pointer and touch movement." : "互動草地會隨滑鼠或觸控方向在局部柔順倒伏。"}</p>
        <div className="home-hero__veil" />
        <span className="home-hero__media-label">{locale === "en" ? "Interactive field" : "互動草地"}</span>
        <div className="home-hero__content page-shell">
          <p className="eyebrow eyebrow--light">{c.home.kicker}</p>
          <h1>{c.home.title}</h1>
          <p className="home-hero__subtitle">{c.home.subtitle}</p>
          <div className="home-hero__actions">
            <ArrowLink href={`/${locale}/contact?intent=site-assessment`} tone="solid" eventName="click_b2b_cta" eventData={{ source: "home_hero", intent: "site_assessment" }}>{locale === "en" ? "Start a site assessment" : "開始場地初步評估"}</ArrowLink>
            <ArrowLink href={`/${locale}/products/canviva`} tone="paper" eventName="view_products" eventData={{ source: "home_hero" }}>{locale === "en" ? "Explore CANVIVA" : "探索 CANVIVA"}</ArrowLink>
          </div>
        </div>
      </section>

      <section className="section section--sand home-entry home-entry--immersive" id="office-scenes">
        <div className="page-shell">
          <div className="home-entry-grid home-entry-grid--office">
            {entryCards.map((card) => (
              <article className="home-entry-card home-entry-card--office" key={card.number}>
                <div className="home-office-intro"><p className="eyebrow">{locale === "en" ? "Designed for public spaces" : "為公共空間而設"}</p><h2>{card.title}</h2><p>{card.body}</p></div>
                <div className="home-office-actions"><a href={`/${locale}/contact?intent=quotation#project-quotation`} className="project-quotation-link">{locale === "en" ? "Project quotation" : "項目制報價"}<ArrowRight aria-hidden="true" /></a><p>{card.status}</p><ArrowLink href={`/${locale}${card.href}`} eventName="select_home_start" eventData={{ path: card.number }}>{card.action}</ArrowLink></div>
              </article>
            ))}
          </div>
          <OfficeSceneGallery images={publicSpaceImages} locale={locale} title={locale === "en" ? "Public spaces" : "公共空間"} />
        </div>
      </section>

      <PlantDesignShowcase locale={locale} />

      <section className="living-index section section--paper">
        <div className="page-shell">
          <p className="eyebrow">{c.home.indexEyebrow}</p>
          <div className="living-index__title">
            {c.home.indexTitle.map((word) => <span key={word}>{word}</span>)}
          </div>
          <div className="living-index__body">
            <p>{c.home.indexBody}</p>
            <ImageFrame src="/images/xponge-material-concept.jpg" sources={xpongeSources} sizes="(min-width: 900px) 50vw, 100vw" width="1536" height="1024" alt={locale === "en" ? "Concept macro view of Xponge material and a leaf" : "Xponge 材料與葉片的概念微距圖"} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section section--forest material-story">
        <div className="page-shell">
          <SectionHeading eyebrow="CANVIVA system" title={c.home.materialTitle} body={locale === "en" ? "Planting, Xponge, irrigation, grow lighting and maintenance access are designed as parts of one commercial-space system." : "植物、Xponge、灌溉、植物照明與養護通道，均作為同一套商業空間系統設計。"} />
          <div className="platform-steps">
            {platformSteps.map(([number, name, slug]) => (
              <SiteLink href={`/${locale}/${slug === "xponge" ? "technology" : "products"}/${slug}`} className="platform-step" key={`${number}-${name}`}>
                <span>{number}</span><strong>{name}</strong><ArrowRight aria-hidden="true" />
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand assurance-preview">
        <div className="page-shell">
          <SectionHeading eyebrow={locale === "en" ? "Designed beyond installation" : "不止於完成安裝"} title={locale === "en" ? "A living system is designed for ongoing operation." : "生命系統，為持續運行而設計。"} body={locale === "en" ? "Every project starts with a clear operating owner, practical service access and records that can support the next care decision." : "每個項目都從清晰的運行責任人、可執行的服務通道，以及支援下一次養護判斷的記錄開始。"} />
          <div className="assurance-links"><SiteLink href={`/${locale}/products/canviva`}><span>01</span><strong>{locale === "en" ? "CANVIVA system" : "CANVIVA 系統"}</strong><ArrowRight aria-hidden="true" /></SiteLink><SiteLink href={`/${locale}/technology/proof`}><span>02</span><strong>{locale === "en" ? "Operations records" : "運行記錄"}</strong><ArrowRight aria-hidden="true" /></SiteLink><SiteLink href={`/${locale}/contact?intent=site-assessment`}><span>03</span><strong>{locale === "en" ? "Discuss a project" : "討論項目"}</strong><ArrowRight aria-hidden="true" /></SiteLink></div>
        </div>
      </section>

      <section className="pilot-banner">
        <div className="page-shell pilot-banner__inner"><div><p className="eyebrow eyebrow--light">CANVIVA project</p><h2>{c.home.pilotTitle}</h2><p>{c.home.pilotBody}</p></div><ArrowLink href={`/${locale}/contact?intent=proposal`} tone="paper" eventName="click_b2b_cta" eventData={{ source: "pilot_banner" }}>{locale === "en" ? "Request a proposal" : "索取項目建議"}</ArrowLink></div>
      </section>

      <JournalPreview locale={locale} />
    </>
  );
}

export function ProductsPage({ locale }) {
  const c = getLocaleCopy(locale);
  const [application, setApplication] = useState("all");
  const [format, setFormat] = useState("all");
  const filtered = productCatalog.filter((product) => (application === "all" || product.applications?.includes(application)) && (format === "all" || product.format === format));
  function selectFilter(type, value) {
    if (type === "application") setApplication(value); else setFormat(value);
    trackEvent("filter_products", { filter_type: type, filter_value: value });
  }
  return (
    <>
      <PageHero locale={locale} eyebrow="CANVIVA · Living Art for Space" title={locale === "en" ? "Three CANVIVA products, one living-system foundation." : "三個 CANVIVA 產品，共用同一套生命系統基礎。"} body={locale === "en" ? "Explore CANVIVA SIGNATURE, CANVIVA WALL and CANVIVA PANEL. Final scope, finish and installation are confirmed for each project." : "探索 CANVIVA SIGNATURE、CANVIVA WALL 與 CANVIVA PANEL；最終範圍、飾面與安裝方式按每個項目確認。"} image="/images/canviva-hong-kong-office.png" />
      <section className="section section--paper"><div className="page-shell">
        <div className="filter-bar" aria-label={locale === "en" ? "Product filters" : "產品篩選"}>
          <div><span>{locale === "en" ? "Application" : "應用"}</span>{[["all", locale === "en" ? "All" : "全部"], ["workplace", locale === "en" ? "Workplace" : "辦公空間"], ["property", locale === "en" ? "Property" : "物業大堂"], ["hospitality", locale === "en" ? "Hospitality" : "酒店會所"]].map(([value, label]) => <button aria-pressed={application === value} key={value} onClick={() => selectFilter("application", value)}>{label}</button>)}</div>
          <div><span>{locale === "en" ? "Product" : "產品"}</span>{[["all", locale === "en" ? "All" : "全部"], ["signature", "SIGNATURE"], ["wall", "WALL"], ["panel", "PANEL"]].map(([value, label]) => <button aria-pressed={format === value} key={value} onClick={() => selectFilter("format", value)}>{label}</button>)}</div>
        </div>
        <div className="product-grid">{filtered.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
        {!filtered.length ? <div className="empty-state"><h2>{locale === "en" ? "No matching product layer yet." : "目前未有符合條件的產品層。"}</h2><p>{locale === "en" ? "Try another filter or tell us what you are looking for." : "請嘗試其他篩選，或告訴我們你的需要。"}</p><ArrowLink href={`/${locale}/contact`}>{c.common.enquire}</ArrowLink></div> : null}
      </div></section>
    </>
  );
}

export function ProductDetailPage({ locale, product }) {
  if (product.slug === "canviva") return <CanvivaDetailPage locale={locale} product={product} />;
  const c = getLocaleCopy(locale);
  const data = localize(product, locale);
  const isWork = product.audience === "work" || product.audience === "both";
  const cta = product.status === "pilot" ? c.common.requestPilot : c.common.enquire;
  return (
    <>
      <section className="detail-hero section--paper"><div className="page-shell"><Breadcrumbs locale={locale} items={[{ label: c.nav.products, href: `/${locale}/products` }, { label: locale === "en" ? product.name : (product.nameZh || product.name) }]} /><div className="detail-hero__grid"><div><div className="detail-meta"><EvidenceBadge locale={locale} type={product.evidence} /></div><h1>{locale === "en" ? product.name : (product.nameZh || product.name)}</h1>{product.nameZh ? <p className="eyebrow">{locale === "en" ? product.descriptor : product.descriptorZh}</p> : null}<p className="detail-lede">{data.short}</p><ArrowLink href={`/${locale}/contact?intent=${isWork ? "pilot" : "home"}&product=${product.slug}`} tone="solid" eventName={isWork ? "click_b2b_cta" : "click_b2c_cta"} eventData={{ product: product.slug }}>{cta}</ArrowLink></div><ImageFrame src={product.image} alt={data.short} locale={locale} eager /></div></div></section>
      {product.slug === "cuisviva-kitchen" ? <ProductSpin locale={locale} /> : null}
      <ProductGuide locale={locale} product={product} />
      <section className="section section--sand"><div className="page-shell split-copy"><div><p className="eyebrow">{locale === "en" ? "The need" : "真正需要"}</p><h2>{locale === "en" ? "Designed around the space before the technology." : "先從使用需要出發，再談科技。"}</h2></div><div><p className="large-copy">{data.problem}</p><FeatureList items={data.users} /></div></div></section>
      <section className="section section--sand"><div className="page-shell"><SectionHeading eyebrow="FAQ" title={locale === "en" ? "Before the next conversation." : "展開下一步前。"} /><Accordion items={[{ title: locale === "en" ? "Is this product available now?" : "產品現在可以訂購嗎？", body: locale === "en" ? "Final availability, lead time and commercial terms require confirmation for each project." : "最終供應、交付時間及商業條款需按每個項目確認。" }, { title: locale === "en" ? "How is maintenance handled?" : "如何安排養護？", body: locale === "en" ? "Responsibility boundaries will be documented for each pilot or project. No zero-maintenance claim is made." : "每個試點或項目都會記錄責任邊界；我們不作零維護承諾。" }, { title: locale === "en" ? "Are the images real installations?" : "圖片是真實落地項目嗎？", body: locale === "en" ? "No. The imagery on this initial site is labelled concept visualisation until approved real photographs are supplied." : "不是。本網站一期圖片均標示為概念效果圖，直至獲提供及批准真實照片。" }]} /></div></section>
      <FinalCta locale={locale} title={locale === "en" ? `Discuss ${product.name}` : `進一步了解 ${product.name}`} href={`/${locale}/contact?product=${product.slug}`} label={cta} />
    </>
  );
}

function CanvivaDetailPage({ locale, product }) {
  const c = getLocaleCopy(locale);
  const isZh = locale === "zh-hk";
  const copy = isZh
    ? {
        eyebrow: "CANVIVA · 智能植物藝術系統",
        title: "CANVIVA SIGNATURE、CANVIVA WALL 與 CANVIVA PANEL",
        body: "在每平方呎都需要被精確計算的城市，CANVIVA 把活體植物、空間設計與可長期運行的系統整合進辦公、物業、酒店會所與高品質商業室內空間。",
        imageCaption: "從中環辦公室望向層疊而密集的樓宇。窗外的城市密度，決定了室內每一寸空間都需要同時承擔功能、體驗與品牌價值。",
        metricsTitle: "香港辦公空間的密度輸入",
        metrics: [
          ["1,114.57 km²", "香港土地總面積"],
          ["約750萬人", "2025年中人口"],
          ["6,870人/km²", "香港平均人口密度"],
          ["HKD 130+/ft²/月", "2026 年中環頂級甲級寫字樓基準租金"],
          ["50–60 ft²/工位", "香港高密度辦公的歷史配置水平"],
          ["1.32 m²／約45株", "單組 CANVIVA 垂直種植面"],
        ],
        bodyTitle: "把有限平面轉化為可生長的垂直界面",
        paragraphs: [
          "香港的緊湊，不只是一種視覺感受。香港政府公布的資料顯示，全港土地面積約為 1,114.57 平方公里，2025 年中人口約 750 萬，平均人口密度約為每平方公里 6,870 人。當城市密度進一步集中到中環這類核心商業區，空間便不再只是容納辦公桌的容器，而是一項需要被精確管理的企業資產。",
          "這種壓力也直接反映在租金上。2026 年上半年，中環甲級寫字樓租金上升 7.3%；One IFC、Two IFC 等指標建築的租金已超過每平方呎每月 HKD 130。若僅以 HKD 130 作示意，一個 500 平方呎的辦公室，每月基本租金便約為 HKD 65,000，全年約 HKD 780,000，尚未計算管理費、差餉及裝修成本。",
          "香港辦公空間的壓縮其實早已發生。CBRE在2015年的工作場所研究中指出，香港新辦公室的靜態配置曾由每個工位約100平方呎，下降至約50–60平方呎，即約4.65–5.57平方米；報告同時把低於60平方呎視為可能影響專注度、協作條件、員工表現及留任的「生產力危險區」。因此，緊湊辦公設計不應只是繼續縮小桌面、收窄通道，而應把更多功能從地面轉移到牆面，釋放有限的平面空間。",
          "這正是 CANVIVA 的設計起點。單組標準模組約為550毫米寬、2,400毫米高，可形成1.32平方米的垂直種植展示面，配置約45株植物；按展示面計算，相當於每平方米約34株。植物、Xponge生長介質、循環水路、植物照明及固定結構被整合到同一套垂直系統中，不需要以大型盆器或獨立綠化島佔用主要辦公平面。僅以一段550毫米寬的牆面，便能建立從桌面高度延伸至天花附近的完整自然界面。",
          "緊湊空間同時意味著環境變化更快：人員集中、冷氣長時間運行、自然通風有限，溫度、濕度及二氧化碳水平都可能在一天內出現明顯波動。只有在項目約定並實際配置監測時，相關讀數才會連接到植物檔案、巡檢、處理動作與服務記錄。",
          "目前 CANVIVA 的運維設計目標，是把常規現場維護控制在約每月一次，同時利用持續監測補足兩次服務之間的資訊空白。即將導入的AI技術，將進一步分析即時數據與歷史趨勢，協助進行異常識別、風險預警、植物養護建議及維護排程。AI不取代園藝師或物業設施管理人員，而是幫助他們更早發現問題，並以一致、可追蹤的方式完成服務。",
          "香港的室內空氣質素認證計劃採用「卓越級」及「良好級」兩級標準，證書有效期為12個月。項目中實際配置的運行讀數主要服務於日常養護和趨勢提示，不能替代認可機構進行的正式 IAQ 檢測，也不把植物描述為機械通風的替代品。",
          "CANVIVA不是在緊湊辦公室中再加入一件裝飾物，而是把原本閒置的垂直界面轉化為可生長、可維護、可監測的空間基礎設施。對香港辦公室而言，真正有效的自然設計，不是佔用更多面積，而是讓有限空間產生更多長期價值。",
        ],
        coCreateTitle: "共同定義，真實驗證",
        coCreateBody: "HK MINIJUNGLE 將首批試點視為一項共同完成的產品驗證，而不是一次單向安裝。客戶以真實空間需求、使用反饋及營運目標參與方案決策；我們負責 CANVIVA 配置、植物搭配、安裝、養護規劃與約定的項目記錄。每項試點都會事先明確範圍、週期、雙方責任、數據使用及後續商業安排。",
        sourceLabel: "資料與設計輸入按項目文件確認",
      }
    : {
        eyebrow: "CANVIVA · Smart Living Art System",
        title: "CANVIVA SIGNATURE, CANVIVA WALL & CANVIVA PANEL",
        body: "In a city where every square foot has to work harder, CANVIVA integrates real living plants, spatial design and an operations-ready system for workplaces, property, hospitality and premium commercial interiors.",
        imageCaption: "Looking out from a Central office across a layered, dense city. The view makes the constraint clear: every indoor inch has to carry function, experience and brand value.",
        metricsTitle: "The density inputs behind the brief",
        metrics: [
          ["1,114.57 km²", "Hong Kong land area"],
          ["~7.5m", "Mid-2025 population"],
          ["6,870 people/km²", "Average population density"],
          ["HKD 130+/ft²/month", "Central Grade-A office rent benchmark"],
          ["50–60 ft²/desk", "Historical high-density workplace allocation"],
          ["1.32 m² / ~45 plants", "One CANVIVA vertical planting face"],
        ],
        bodyTitle: "Turn a constrained floor plate into a living vertical interface",
        paragraphs: [
          "Hong Kong’s compactness is more than a visual impression. Government figures put the territory’s land area at about 1,114.57 square kilometres, with a mid-2025 population of roughly 7.5 million and an average density of 6,870 people per square kilometre. In a core business district such as Central, space is no longer just a container for desks; it is an asset that needs to be managed precisely.",
          "That pressure is visible in rent. Grade-A Central office rents rose in the first half of 2026, with landmark buildings such as One IFC and Two IFC above HKD 130 per square foot per month. At HKD 130 as an illustration, a 500-square-foot office represents about HKD 65,000 in basic monthly rent, or HKD 780,000 a year before management fees, rates and fit-out.",
          "The squeeze on office space has already happened. CBRE’s 2015 workplace research recorded Hong Kong workstation allocations falling from about 100 square feet to 50–60 square feet, a range it described as a productivity danger zone when it drops below 60. Compact-office design therefore needs to move more functions from the floor to the wall, rather than only shrinking desks and corridors.",
          "That is the starting point for CANVIVA. A standard module of roughly 550 mm wide by 2,400 mm high can form a 1.32-square-metre vertical planting face for about 45 plants—about 34 plants per square metre—integrating planting, Xponge growth media, circulation, lighting and structure without a large planter or green island.",
          "Compact space also changes faster: concentrated occupancy, long air-conditioning hours and limited natural ventilation can move temperature, humidity and carbon dioxide over the course of a day. Where monitoring is included in the agreed scope, relevant readings can be connected to plant records, inspections, actions and service history.",
          "CANVIVA’s operating target is routine on-site care about once a month, with continuous monitoring filling the information gap between visits. Planned AI analysis will support anomaly recognition, risk alerts, care guidance and scheduling; it assists horticulturists and facilities teams rather than replacing them.",
          "Hong Kong’s Indoor Air Quality Certification Scheme has Excellent and Good levels, with certificates valid for 12 months. Project operations readings, where configured, support daily care and trend prompts; they do not replace formal IAQ testing by a recognised body, and plants are not described as a substitute for mechanical ventilation.",
          "CANVIVA is not another decorative object in a compact office. It turns an underused vertical interface into living, maintainable and monitorable spatial infrastructure—creating more long-term value from limited space.",
        ],
        coCreateTitle: "Define together, learn from the real space",
        coCreateBody: "HK MINIJUNGLE treats the first pilots as a shared product-validation exercise, not a one-way installation. The client brings real spatial needs, user feedback and operating goals; we bring CANVIVA configuration, planting, installation, maintenance planning and agreed project records. Scope, duration, responsibilities, data use and next-step commercial arrangements are agreed before each pilot.",
        sourceLabel: "Data and design inputs are confirmed against project documentation",
      };

  return (
    <>
      <PageHero locale={locale} eyebrow={copy.eyebrow} title="CANVIVA" family={copy.title} body={copy.body} image="/images/docx-hk-density-office.png" />
      <ProductGuide locale={locale} product={product} />
      <section className="section section--paper canviva-context">
        <div className="page-shell">
          <div className="canviva-context__image">
            <ImageFrame src="/images/docx-hk-density-office.png" alt={copy.imageCaption} locale={locale} />
            <p>{copy.imageCaption}</p>
          </div>
          <div className="canviva-context__copy">
            <p className="eyebrow">{copy.metricsTitle}</p>
            <div className="metric-grid">{copy.metrics.map(([value, label]) => <div className="metric-card" key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>
            <p className="source-note">{copy.sourceLabel}</p>
          </div>
        </div>
      </section>
      <section className="section section--sand canviva-story">
        <div className="page-shell">
          <SectionHeading eyebrow={isZh ? "CANVIVA 設計起點" : "The CANVIVA brief"} title={copy.bodyTitle} />
          <div className="canviva-story__body">{copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <section className="section section--paper canviva-cocreation">
        <div className="page-shell">
          <div className="canviva-cocreation__grid">
            <ImageFrame src="/images/docx-pilot-co-creation.png" alt={copy.coCreateTitle} locale={locale} />
            <div><p className="eyebrow">{isZh ? "共創試點" : "Co-created pilots"}</p><h2>{copy.coCreateTitle}</h2><p className="large-copy">{copy.coCreateBody}</p><ArrowLink href={`/${locale}/contact?intent=proposal&product=${product.slug}`} tone="solid">{isZh ? "索取項目建議" : "Request a proposal"}</ArrowLink></div>
          </div>
        </div>
      </section>
      <section className="section section--forest">
        <div className="page-shell two-column-list">
          <div><p className="eyebrow eyebrow--light">{isZh ? "系統角色" : "System role"}</p><h2>{isZh ? "植物、材料、空間與養護一起設計。" : "Planting, material, space and care designed together."}</h2></div>
          <div><FeatureList items={localize(product, locale).features} /><ArrowLink href={`/${locale}/esg`} tone="light">{isZh ? "了解 ESG 實證支援" : "Explore ESG evidence support"}</ArrowLink></div>
        </div>
      </section>
      <FinalCta locale={locale} title={isZh ? "把生命藝術帶進商業空間。" : "Bring living art into commercial space."} href={`/${locale}/contact?intent=proposal&product=${product.slug}`} label={isZh ? "討論 CANVIVA 項目" : "Discuss a CANVIVA project"} />
    </>
  );
}

export function SolutionsPage({ locale }) {
  const publicSolutions = solutions.filter((solution) => solution.public !== false);
  return (
    <>
      <PageHero locale={locale} eyebrow="Applications" title={locale === "en" ? "Nature, in the places we share." : "讓自然，融入共享的日常。"} body={locale === "en" ? "Workplaces, shopping malls and sustainability-minded brand stores. Explore a living system through the spaces it can inhabit." : "辦公空間、購物商場與可持續理念品牌店。從不同空間，探索生命系統的可能。"} image="/images/solution-workplace-wall.png" />
      <section className="section section--paper applications-scenes"><div className="page-shell solution-list">{publicSolutions.map((solution, index) => { const data = localize(solution, locale); return (
        <article className="application-scene" key={solution.slug} id={`scene-${solution.slug}`} aria-labelledby={`scene-title-${solution.slug}`}>
          <header className="application-scene__header">
            <div><span className="application-scene__number">0{index + 1}</span><p className="eyebrow">{data.name}</p></div>
            <div><h2 id={`scene-title-${solution.slug}`}>{data.problem}</h2><ArrowLink href={`/${locale}/solutions/${solution.slug}`}>{data.cta}</ArrowLink></div>
          </header>
          <OfficeSceneGallery images={solution.sceneImages} locale={locale} title={data.name} />
        </article>
      ); })}</div></section>
    </>
  );
}

export function SolutionDetailPage({ locale, solution }) {
  const c = getLocaleCopy(locale);
  const data = localize(solution, locale);
  const relatedProducts = productFamilies.filter((product) => solution.products.includes(product.slug));
  return (
    <>
      <section className="solution-hero"><ImageFrame src={solution.image} alt={data.name} locale={locale} eager /><div className="solution-hero__content page-shell"><Breadcrumbs locale={locale} items={[{ label: c.nav.solutions, href: `/${locale}/solutions` }, { label: data.name }]} /><p className="eyebrow eyebrow--light">Applications</p><h1>{data.name}</h1><p>{data.problem}</p><ArrowLink href={`/${locale}/contact?intent=proposal&solution=${solution.slug}`} tone="paper" eventName="click_b2b_cta" eventData={{ solution: solution.slug }}>{data.cta}</ArrowLink></div></section>
      <section className="section section--paper"><div className="page-shell two-column-list"><div><p className="eyebrow">{locale === "en" ? "Suitable when" : "適合條件"}</p><h2>{locale === "en" ? "A useful starting point" : "合適的起點"}</h2><FeatureList items={data.fit} /></div><div><p className="eyebrow">{locale === "en" ? "Not a fit when" : "不適用條件"}</p><h2>{locale === "en" ? "Clear limits build trust" : "清楚限制，建立信任"}</h2><FeatureList items={data.limit} /></div></div></section>
      {solution.sceneImages?.length > 1 ? <section className="section section--sand solution-gallery"><div className="page-shell"><SectionHeading eyebrow={locale === "en" ? "Scene references" : "場景參考"} title={locale === "en" ? "One setting, more than one way to live with it." : "同一場景，多種生活方式。"} /><OfficeSceneGallery images={solution.sceneImages} locale={locale} title={data.name} /></div></section> : null}
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Process" title={locale === "en" ? "Diagnose. Design. Pilot. Learn." : "診斷、設計、試點、學習。"} /><div className="process-steps">{[locale === "en" ? "Understand the site" : "了解場地", locale === "en" ? "Define the system" : "定義系統", locale === "en" ? "Agree responsibilities" : "確認責任", locale === "en" ? "Pilot and document" : "試點與記錄"].map((step, index) => <div key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{locale === "en" ? "Scope and evidence to be confirmed with the project partner." : "範圍與實證方法需與項目夥伴確認。"}</p></div>)}</div></div></section>
      <section className="section section--paper"><div className="page-shell"><SectionHeading eyebrow="Related products" title={locale === "en" ? "A system assembled for the setting." : "按場景組合的系統。"} /><div className="product-grid">{relatedProducts.map((product) => <ProductCard product={product} locale={locale} key={product.slug} />)}</div></div></section>
      <FinalCta locale={locale} title={data.problem} href={`/${locale}/contact?solution=${solution.slug}`} label={data.cta} />
    </>
  );
}

function EsgDisclosureTable({ rows, locale }) {
  return <div className="esg-table-wrap" tabIndex="0" role="region" aria-label={locale === "en" ? "HKEX ESG disclosure mapping" : "HKEX ESG 披露對照，可左右滑動查看完整表格"}><table className="esg-table"><caption className="sr-only">{locale === "en" ? "HKEX ESG disclosure mapping" : "HKEX ESG 披露對照"}</caption><thead><tr><th>{locale === "en" ? "HKEX disclosure" : "HKEX 披露項"}</th><th>{locale === "en" ? "How planting supports the record" : "綠化如何支援記錄"}</th><th>{locale === "en" ? "Evidence role" : "證據角色"}</th></tr></thead><tbody>{rows.map(([item, support, role]) => <tr key={item}><th scope="row">{item}</th><td>{support}</td><td><span className="esg-table__role">{role}</span></td></tr>)}</tbody></table></div>;
}

function EsgMetrics({ items, locale }) {
  return <div className="esg-metrics-grid">{items.map(([label, value, source], index) => <article key={label}><span>0{index + 1}</span><h3>{label}</h3><strong>{value}</strong><small>{locale === "en" ? "Reference" : "研究參考"} · {source}</small></article>)}</div>;
}

function EsgCertifications({ items }) {
  return <div className="esg-cert-grid">{items.map(([name, score, detail], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><strong>{score}</strong><p>{detail}</p></article>)}</div>;
}

export function ESGPage({ locale }) {
  const c = esgContent[locale] || esgContent.en;
  const isZh = locale === "zh-hk";
  return (
    <>
      <PageHero locale={locale} eyebrow={c.eyebrow} title={c.title} body={c.intro} image="/images/canviva-co-creation.png" />
      <section className="section section--paper esg-intro">
        <div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "主要價值" : "Primary value"}</p><h2>{c.valueTitle}</h2></div><div><p className="large-copy">{c.valueBody}</p></div></div>
      </section>
      <section className="section section--sand">
        <div className="page-shell esg-story"><div><p className="eyebrow">{isZh ? "研究提示" : "Research context"}</p><h2>{isZh ? "把親自然設計說得準確。" : "Keep biophilic design claims precise."}</h2></div><p>{c.research}</p></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "HKEX 對照" : "HKEX mapping"} title={c.disclosureTitle} body={c.disclosureIntro} /><EsgDisclosureTable rows={c.disclosureRows} locale={locale} /></div>
      </section>
      <section className="section section--sand">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "研究參考" : "Research references"} title={c.metricsTitle} body={c.metricsIntro} /><EsgMetrics items={c.metrics} locale={locale} /></div>
      </section>
      <section className="section section--forest">
        <div className="page-shell"><SectionHeading eyebrow={isZh ? "項目證據包" : "Project evidence pack"} title={c.frameworkTitle} body={c.frameworkBody} /><div className="esg-evidence-grid">{(isZh ? ["植物資產清單與平面圖", "綠化面積與視線關係", "安裝照片與場地記錄", "水質、MC、CO₂、溫濕度", "用水、用電與維護工單", "植物更換與服務歷史"] : ["Plant asset list and plans", "Planting area and sightlines", "Installation photos and site record", "Water, MC, CO₂, temperature and humidity", "Water, energy and service work orders", "Replacement history and service record"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "量化條件" : "Quantified input"}</p><h2>{c.metricTitle}</h2></div><div><p className="large-copy">{c.metricBody}</p><p className="source-note">{isZh ? "認證結果由相關機構及合資格顧問審核確認。" : "Certification outcomes remain subject to review by the recognised assessor and qualified consultant."}</p></div></div>
      </section>
      <section className="section section--forest">
        <div className="page-shell esg-path-layout"><div><p className="eyebrow">{isZh ? "落地路徑" : "Implementation path"}</p><h2>{c.pathTitle}</h2><ol className="esg-path">{c.pathSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong></li>)}</ol></div><div><p className="eyebrow">{isZh ? "認證路徑" : "Certification routes"}</p><h2>{c.certificationsTitle}</h2><p className="esg-path-layout__intro">{c.certificationsIntro}</p><EsgCertifications items={c.certifications} /></div></div>
      </section>
      <section className="section section--paper">
        <div className="page-shell esg-actions"><div><p className="eyebrow">{isZh ? "關鍵動作" : "Key actions"}</p><h2>{c.actionsTitle}</h2></div><ul>{c.actions.map((action) => <li key={action}>{action}</li>)}</ul></div><p className="page-shell esg-disclaimer">{c.disclaimer}</p>
      </section>
      <FinalCta locale={locale} title={c.cta} href={`/${locale}/contact?intent=proposal`} label={c.cta} />
    </>
  );
}

export function TechnologyPage({ locale }) {
  return (
    <>
      <PageHero locale={locale} eyebrow="Technology & care" title={locale === "en" ? "Quiet technology, visible care." : "安靜的科技，看得見的養護。"} body={locale === "en" ? "Understand how material, modules and intelligent care work together as one serviceable system." : "了解材料、模組與智能養護如何協作，並把每個服務責任說清楚。"} image="/images/xponge-material-concept.jpg" imageSources={xpongeSources} />
      <section className="section section--paper"><div className="page-shell technology-intro"><div><p className="eyebrow">Material layer</p><h2>Xponge</h2><p>{localize(products.find((p) => p.slug === "xponge"), locale).short}</p><ArrowLink href={`/${locale}/technology/xponge`}>{locale === "en" ? "Explore Xponge" : "探索 Xponge"}</ArrowLink></div><div><p className="eyebrow">Intelligent care</p><h2>DR FOREST</h2><p>{localize(products.find((p) => p.slug === "doctor-forest"), locale).short}</p><ArrowLink href={`/${locale}/technology/doctor-forest`}>{locale === "en" ? "Explore DR FOREST" : "探索 DR FOREST"}</ArrowLink></div></div></section>
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Operating model" title={locale === "en" ? "Every layer has a clear job." : "每一層都有清晰角色。"} body={locale === "en" ? "Material, planting and care records stay connected so a living system can be operated, not just installed." : "材料、種植與養護記錄保持連接，讓自然系統可以被持續運行，而不只是完成一次安裝。"} /><div className="technology-pillars">{(locale === "en" ? [["01", "Root zone", "Xponge DualFlow™ balances airflow and moisture around roots."], ["02", "Living composition", "CANVIVA turns vertical surfaces into considered planting interfaces."], ["03", "Service loop", "DR FOREST keeps sensors, plant records and work orders together."]] : [["01", "根區", "Xponge DualFlow™ 在根部周圍平衡空氣與濕度。"], ["02", "生命構成", "CANVIVA 把垂直界面轉化為經過設計的種植空間。"], ["03", "服務閉環", "DR FOREST 把感測、植物檔案與維護工單連在一起。"]]).map(([number, title, body]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>)}</div></div></section>
    </>
  );
}

export function TechnologyDetailPage({ locale, slug }) {
  const isXponge = slug === "xponge";
  const isDoctorForest = slug === "doctor-forest";
  const product = products.find((item) => item.slug === slug);
  const data = localize(product, locale);
  const isZh = locale === "zh-hk";
  const doctorForestCopy = isZh
    ? {
        roleTitle: "讓植物狀態和養護需要更容易被理解及跟進。",
        roleBody: "Doctor Forest 是 HK MINIJUNGLE 的智能養護與運維系統。透過水質、基質含水率（MC）、二氧化碳、溫度及濕度等多維感測技術，持續掌握植物生長環境與設備運行狀態。運維平台統一管理植物檔案、異常警報、巡檢任務、維護工單及服務記錄，形成從問題發現、任務分派到處理追蹤的完整閉環。AI 技術將進一步分析即時與歷史數據，實現異常識別、風險預警、個性化養護建議及維護排程，讓植物養護由被動處理走向可預測、可追蹤的主動管理。",
        serviceTitle: "持續監測＋定期維護＋異常觸發",
        serviceBody: "Doctor Forest 並非單獨提供一套監測軟件，而是與 HK MINIJUNGLE 的專業維護服務共同運行。系統持續採集水質、基質含水率（MC）、二氧化碳、溫濕度及設備狀態等數據；常規情況下，由維護團隊按月進行現場巡檢，完成植物修剪與健康評估、系統清潔、水質調整，以及水循環、照明和感測設備檢查。當監測數據出現異常時，平台會生成警報與維護工單，由團隊先進行遠程判斷，再按需要安排現場處理。每次服務均保留時間、檢測數據、處理內容、前後照片及完成狀態，讓客戶及物業管理團隊能夠追蹤每一組設備和植物的長期狀態。",
      }
    : {
        roleTitle: "Make plant status and care needs easier to understand and act on.",
        roleBody: "Doctor Forest is HK MINIJUNGLE’s intelligent-care and operations system. It uses water quality, substrate moisture (MC), carbon dioxide, temperature and humidity sensing to keep the growing environment and equipment state visible. The operating platform brings plant records, alerts, inspections, work orders and service history into one loop. AI analysis of live and historical data supports anomaly recognition, risk prioritisation, personalised care guidance and maintenance scheduling, moving care from reactive fixes toward predictable, traceable operations.",
        serviceTitle: "Continuous monitoring + scheduled care + triggered service",
        serviceBody: "Doctor Forest runs together with HK MINIJUNGLE’s professional maintenance service rather than as a standalone monitoring software. The system collects water quality, substrate moisture, CO₂, temperature, humidity and equipment data. In normal operation, the care team conducts a monthly site visit for pruning, health assessment, system cleaning, water adjustment, circulation, lighting and sensor checks. When a reading moves outside the agreed range, the platform creates an alert and work order; the team reviews it remotely first and schedules a site response when needed. Each visit keeps the time, readings, actions, before-and-after photos and completion state so clients and property teams can follow the long-term condition of every system.",
      };
  return (
    <>
      <PageHero locale={locale} eyebrow={isXponge ? "Material platform" : "Intelligent care layer"} title={isXponge ? "Xponge® DualFlow™" : "DR FOREST"} body={isXponge ? data.short : data.short} image={product.image} imageLabel={isXponge ? null : "concept"} />
      <ProductGuide locale={locale} product={product} />
      {isXponge ? <>
        <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "根區材料層" : "Root-zone material"}</p><h2>{isZh ? "兩套孔道，在同一個基質內各司其職。" : "Two pore populations, one engineered matrix."}</h2></div><div><p className="large-copy">{isZh ? "Xponge® Bio-Growth Matrix 以聚氨酯聚合物為基礎。宏孔形成持續的空氣通道；微孔在毛細張力下承托水分與養分，按植物需要釋放。兩套通道獨立運行，讓根部在不同灌溉狀態下仍可獲得空氣。" : "The Xponge® Bio-Growth Matrix is a polyurethane polymer. Macro-pores create a continuous airway, while micro-pores hold water and nutrients under capillary tension and release them as roots draw them. The two channel systems operate independently, keeping air available around roots through different irrigation states."}</p></div></div></section>
        <section className="section section--sand"><div className="page-shell two-column-list"><div><p className="eyebrow">{isZh ? "DualFlow™ 結構" : "The DualFlow™ structure"}</p><h2>{isZh ? "讓水分與空氣同時工作。" : "Let moisture and air work together."}</h2><FeatureList items={data.features} /></div><div><p className="eyebrow">{isZh ? "文章所述性能" : "Performance described in the reference article"}</p><div className="xponge-metrics">{(isZh ? [["95%+", "三年植物存活率"], ["30+ 日", "灌溉間隔"], ["3–8 kg/m²", "濕態基質負荷"], ["3–5 年", "材料壽命"]] : [["95%+", "Three-year plant survival"], ["30+ days", "Watering interval"], ["3–8 kg/m²", "Wet-state matrix load"], ["3–5 years", "Material lifespan"]]).map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="source-note">{isZh ? "以上數字按文檔指定的 MiniJungle® Xponge® DualFlow™ 文章整理；項目交付仍以雙方確認的技術文件為準。" : "Figures are transcribed from the MiniJungle® Xponge® DualFlow™ article specified in the brief; project delivery follows the technical documentation agreed with each partner."}</p></div></div></section>
      </> : <>
        <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">{isZh ? "系統角色" : "System role"}</p><h2>{doctorForestCopy.roleTitle}</h2></div><div><p className="large-copy">{doctorForestCopy.roleBody}</p></div></div></section>
        <section className="section section--sand"><div className="page-shell"><SectionHeading eyebrow={isZh ? "服務模式" : "Service model"} title={doctorForestCopy.serviceTitle} body={doctorForestCopy.serviceBody} /><div className="service-loop">{(isZh ? ["多維感測", "月度巡檢", "異常警報", "遠程判斷", "現場處理", "完整記錄"] : ["Multi-sensor readings", "Monthly site visit", "Alert generated", "Remote triage", "Site response", "Full service record"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></div></section>
      </>}
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow={isZh ? "系統連接" : "System connection"} title={isZh ? "硬件、材料、養護與服務，一起設計。" : "Hardware, material, care and service—designed together."} /><div className="system-map">{(isZh ? ["硬件", "Xponge", "DR FOREST", "持續養護"] : ["Hardware", "Xponge", "DR FOREST", "Ongoing care"]).map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><p>{isZh ? "角色與規格按項目文件確認，並在服務記錄中持續追蹤。" : "The role and specification are confirmed in project documentation and followed through service records."}</p></div>)}</div></div></section>
      <FinalCta locale={locale} title={isZh ? `與我們討論 ${isXponge ? "Xponge" : "DR FOREST"}。` : `Discuss ${isXponge ? "Xponge" : "DR FOREST"} with us.`} href={`/${locale}/contact?product=${slug}`} label={getLocaleCopy(locale).common.enquire} />
    </>
  );
}

export function ProofPage({ locale }) {
  const records = locale === "en"
    ? [
        ["Plant record", "Species, position, planting date and care notes."],
        ["Environment", "Water quality, substrate moisture, CO₂, temperature and humidity."],
        ["Service", "Inspection, pruning, cleaning, adjustment and replacement history."],
        ["Responsibility", "A named owner for each alert, work order and follow-up."],
      ]
    : [
        ["植物檔案", "品種、位置、種植日期與養護備註。"],
        ["環境數據", "水質、基質含水率、CO₂、溫度與濕度。"],
        ["服務記錄", "巡檢、修剪、清潔、調整與更換歷史。"],
        ["責任分工", "每個警報、工單與跟進都有清晰責任人。"],
      ];
  return (
    <>
      <PageHero locale={locale} eyebrow="System records" title={locale === "en" ? "Care that can be followed." : "每一步養護，都有記錄可追蹤。"} body={locale === "en" ? "A clear record connects the plant, the material, the equipment and the people responsible for the next action." : "清晰記錄把植物、材料、設備與下一步責任人連接起來。"} image="/images/doctor-forest-concept.png" />
      <section className="section section--paper">
        <div className="page-shell">
          <div className="record-grid">{records.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}</div>
        </div>
      </section>
    </>
  );
}

export function JournalPage({ locale }) {
  return (
    <>
      <PageHero locale={locale} eyebrow="Projects & practice" title={locale === "en" ? "Project records, product development and commercial-space practice." : "項目記錄、產品開發與商業空間實踐。"} body={locale === "en" ? "Verified historical names are preserved where they belong; current product references use CANVIVA." : "歷史項目中的正式名稱按原始語境保留；現行產品表達統一使用 CANVIVA。"} image="/images/docx-journal-cover.png" imageLabel={null} />
      <section className="section section--paper"><div className="page-shell journal-grid">{journalPosts.map((post) => <JournalCard post={post} locale={locale} key={post.slug} />)}</div></section>
    </>
  );
}

function JournalPreview({ locale }) {
  const c = getLocaleCopy(locale);
  return <section className="section section--paper"><div className="page-shell"><SectionHeading eyebrow="Projects & practice" title={locale === "en" ? "How CANVIVA moves from product development into real space." : "CANVIVA 如何由產品開發走進真實空間。"} action={<ArrowLink href={`/${locale}/journal`}>{c.common.viewAll}</ArrowLink>} /><div className="journal-grid journal-grid--three">{journalPosts.slice(0, 3).map((post) => <JournalCard post={post} locale={locale} key={post.slug} />)}</div></div></section>;
}

function JournalCard({ post, locale }) {
  const data = localize(post, locale);
  const imageLabel = post.imageLabel === undefined ? "concept" : post.imageLabel;
  return <article className="journal-card"><SiteLink href={`/${locale}/journal/${post.slug}`}><ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} /></SiteLink><div className="journal-card__meta"><span>{post.category}</span><span>{post.readingTime}</span></div><h3><SiteLink href={`/${locale}/journal/${post.slug}`}>{data.title}</SiteLink></h3><p>{data.excerpt}</p><ArrowLink href={`/${locale}/journal/${post.slug}`}>{getLocaleCopy(locale).common.learnMore}</ArrowLink></article>;
}

export function ArticlePageLegacy({ locale, post }) {
  const data = localize(post, locale);
  return <><article className="article page-shell"><Breadcrumbs locale={locale} items={[{ label: getLocaleCopy(locale).nav.journal, href: `/${locale}/journal` }, { label: data.title }]} /><div className="article__header"><EvidenceBadge locale={locale} type="draft" /><p className="eyebrow">{post.category} · {post.readingTime}</p><h1>{data.title}</h1><p>{data.excerpt}</p><button className="share-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><ShareNetwork aria-hidden="true" />{locale === "en" ? "Copy article link" : "複製文章連結"}</button></div><ImageFrame src={post.image} alt={data.title} locale={locale} eager /><div className="article__body">{data.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside><strong>{locale === "en" ? "Before publication" : "正式發佈前"}</strong><p>{locale === "en" ? "Approved sources, real product details, author, publish date and final imagery are required." : "仍需補充獲批准來源、真實產品資料、作者、發佈日期及最終圖片。"}</p></aside></div></article><FinalCta locale={locale} title={locale === "en" ? "Have a relevant space or perspective?" : "你有相關空間或觀點嗎？"} href={`/${locale}/contact?intent=partner`} label={getLocaleCopy(locale).common.enquire} /></>;
}

export function AboutPageLegacy({ locale }) {
  return <><PageHero locale={locale} eyebrow="About HK MINIJUNGLE" title={locale === "en" ? "A Hong Kong starting point for living systems." : "從香港出發的自然系統。"} body={locale === "en" ? "We are building a product platform that brings modular planting, material thinking and intelligent care into work and home." : "我們正在建立一個產品平台，把模組化種植、材料思維與智能養護帶進工作和家居空間。"} image="/images/home-life-concept.png" /><section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">Why</p><h2>{locale === "en" ? "Nature should be designed for long-term use." : "自然應為長期使用而設計。"}</h2></div><div><p className="large-copy">{locale === "en" ? "HK MINIJUNGLE begins with a simple belief: living greenery becomes more useful when beauty, product structure and care responsibility are considered together." : "HK MINIJUNGLE 從一個簡單信念出發：當美學、產品結構與養護責任被一起考慮，綠色生命才能更長久地發揮價值。"}</p></div></div></section><section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Nature + Art + Technology" title={locale === "en" ? "One brand platform, not three disconnected stories." : "同一個品牌平台，而不是三個分散故事。"} /><div className="value-grid">{[["Nature", locale === "en" ? "Real plant life and long-term growth." : "真實植物生命與長期生長。"], ["Art", locale === "en" ? "Greenery as part of spatial composition." : "把綠化視為空間構成。"], ["Technology", locale === "en" ? "Materials and care tools that reduce guesswork." : "用材料與養護工具減少猜測。"]].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></div></section><section className="section section--paper"><div className="page-shell about-grid"><div><p className="eyebrow">Team</p><h2>{locale === "en" ? "People and prior experience" : "團隊與過往經驗"}</h2><p>{locale === "en" ? "[CONTENT REQUIRED: approved biographies, portraits and advisor visibility.]" : "[CONTENT REQUIRED：獲批准的簡介、照片及顧問公開範圍。]"}</p></div><div><p className="eyebrow">Milestones</p><h2>{locale === "en" ? "Company progress" : "公司里程碑"}</h2><p>{locale === "en" ? "[CONTENT REQUIRED: verified company milestones only.]" : "[CONTENT REQUIRED：只加入已驗證公司里程碑。]"}</p></div></div></section><FinalCta locale={locale} title={locale === "en" ? "Build the next step with us." : "與我們一起建立下一步。"} href={`/${locale}/contact?intent=partner`} label={locale === "en" ? "Discuss a partnership" : "討論合作"} /></>;
}

export function ArticlePage({ locale, post }) {
  const data = localize(post, locale);
  const journalHref = "/" + locale + "/journal";
  const partnerHref = "/" + locale + "/contact?intent=proposal";
  const imageLabel = post.imageLabel === undefined ? "concept" : post.imageLabel;
  const gallery = post.gallery || [];
  const media = post.galleryLayout === "hero-plus-gallery"
    ? <><ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} eager /><div className="article__media-row article__media-row--gallery">{gallery.map((image) => <ImageFrame key={image} src={image} alt={data.title} locale={locale} label={post.galleryLabel || null} eager />)}</div></>
    : gallery.length
      ? <div className="article__media-row">{[post.image, ...gallery].map((image) => <ImageFrame key={image} src={image} alt={data.title} locale={locale} label={image === post.image ? imageLabel : null} eager />)}</div>
      : <ImageFrame src={post.image} alt={data.title} locale={locale} label={imageLabel} eager />;
  return <><article className="article page-shell"><Breadcrumbs locale={locale} items={[{ label: getLocaleCopy(locale).nav.journal, href: journalHref }, { label: data.title }]} /><div className="article__header"><p className="eyebrow">{post.category} · {post.readingTime}</p><h1>{data.title}</h1><p>{data.excerpt}</p><button className="share-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><ShareNetwork aria-hidden="true" />{locale === "en" ? "Copy article link" : "複製文章連結"}</button></div>{media}<div className="article__body">{data.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<aside><strong>{locale === "en" ? "Practice note" : "實踐筆記"}</strong><p>{locale === "en" ? "This note connects the decisions behind living systems with the spaces and people they serve." : "這篇筆記把自然系統背後的設計決定，連結到實際服務的空間與使用者。"}</p></aside></div></article><FinalCta locale={locale} title={locale === "en" ? "Have a relevant space or perspective?" : "你有相關空間或觀點嗎？"} href={partnerHref} label={getLocaleCopy(locale).common.enquire} /></>;
}

export function AboutPage({ locale }) {
  const partnerHref = "/" + locale + "/contact?intent=proposal";
  const en = locale === "en";
  return (
    <>
      <PageHero locale={locale} eyebrow="About HK MINIJUNGLE" title={en ? "A Hong Kong company for commercial living plant systems." : "為商業空間打造生命系統的香港公司。"} body={en ? "HK MINIJUNGLE develops and delivers CANVIVA for workplaces, property, hospitality and premium commercial interiors." : "HK MINIJUNGLE 為辦公、物業、酒店會所與高品質商業室內空間開發和交付 CANVIVA。"} image="/images/canviva-hong-kong-office.png" />
      <section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">What we do</p><h2>{en ? "Design and deliver the living environment." : "設計並交付可持續運行的自然空間。"}</h2></div><div><p className="large-copy">{en ? "We connect spatial design, CANVIVA product systems, planting, installation and project responsibility so living greenery becomes part of the interior—not a disposable decorative layer." : "我們把空間方案、CANVIVA 產品系統、植物配置、安裝交付與項目責任連在一起，讓綠化成為室內的一部分，而不是可被隨意更換的裝飾耗材。"}</p></div></div></section>
      <section className="section section--forest"><div className="page-shell"><SectionHeading eyebrow="Nature + Art + Technology" title={en ? "Technology supports the living asset; it does not replace it." : "科技服務於生命資產，而不是取代它。"} /><div className="value-grid">{[["Nature", en ? "Real living plants and long-term growth." : "真實活體植物與長期生長。"], ["Art", en ? "Planting as part of architectural and interior composition." : "把植物納入建築與室內構成。"], ["Technology", en ? "Materials and operations tools that reduce uncertainty where they are actually configured." : "以材料與運行工具，在實際配置的範圍內降低不確定性。"]].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></div></section>
      <section className="section section--paper"><div className="page-shell about-grid"><div><p className="eyebrow">Project responsibility</p><h2>{en ? "From proposal to handover" : "由方案到交付"}</h2><p>{en ? "HK MINIJUNGLE leads the client conversation, spatial solution, CANVIVA scope, supply, installation and overall project delivery." : "HK MINIJUNGLE 負責客戶溝通、空間方案、CANVIVA 範圍、供貨、安裝與項目整體交付。"}</p></div><div><p className="eyebrow">Living asset thinking</p><h2>{en ? "Designed beyond installation" : "不止於完成安裝"}</h2><p>{en ? "Care ownership, service access and records are considered before handover so the planting can continue to operate as a living asset." : "交付前即考慮養護責任、服務通道與記錄，讓植物作為生命資產持續運行。"}</p></div></div></section>
      <section className="section section--sand"><div className="page-shell"><SectionHeading eyebrow="FAQ" title={en ? "Clear answers for search and project teams." : "讓搜尋與項目團隊都能取得清楚答案。"} body={en ? "Only confirmed public information is answered here. Project-specific details remain visibly pending until approved." : "此處只回答已確認的公開資料；項目專屬資料在獲批前會保持清楚的待補狀態。"} /><Accordion items={aboutFaq[locale]} /><div className="home-proof-pending"><span>{en ? "Materials required" : "待補充材料"}</span><p>{en ? "Approved client cases and testimonials, verified performance data, final product dimensions and finish schedules, price and lead-time guidance, maintenance SLA and confirmed service coverage beyond Hong Kong." : "獲批准公開的客戶案例與評價、經核實性能數據、最終產品尺寸與飾面表、價格及交期指引、養護 SLA，以及香港以外已確認的服務範圍。"}</p></div></div></section>
      <FinalCta locale={locale} title={en ? "Discuss a commercial-space project." : "討論你的商業空間項目。"} href={partnerHref} label={en ? "Talk to HK MINIJUNGLE" : "聯絡 HK MINIJUNGLE"} />
    </>
  );
}

export function ContactPage({ locale }) {
  const c = getLocaleCopy(locale);
  const sourcePath = typeof window === "undefined" ? `/${locale}/contact` : window.location.pathname;
  const [intent, setIntent] = useState("site-assessment");
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const quotationRef = useRef(null);
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
  useEffect(() => {
    const requestedIntent = new URLSearchParams(window.location.search).get("intent");
    if (requestedIntent) setIntent(requestedIntent);
    if (window.location.hash !== "#project-quotation") return;
    const frame = window.requestAnimationFrame(() => {
      quotationRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      quotationRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [locale]);
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = {};
    if (!formData.get("name")) nextErrors.name = locale === "en" ? "Please enter your name." : "請填寫姓名。";
    if (!formData.get("company")) nextErrors.company = locale === "en" ? "Please enter your company." : "請填寫公司。";
    if (!formData.get("email")) nextErrors.email = locale === "en" ? "Please enter your email." : "請填寫電郵。";
    if (!formData.get("privacy")) nextErrors.privacy = locale === "en" ? "Please accept the privacy notice." : "請同意私隱聲明。";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!endpoint) { setStatus("unconfigured"); return; }
    setStatus("loading");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      if (!response.ok) throw new Error("submit failed");
      setStatus("success");
      trackEvent("submit_b2b_enquiry", { intent, source: new URLSearchParams(window.location.search).get("source") || "contact_page" });
      form.reset();
    } catch { setStatus("error"); }
  }
  const intents = [
    ["site-assessment", locale === "en" ? "Book a site review" : "預約場地評估"],
    ["proposal", locale === "en" ? "Request a proposal" : "索取項目建議"],
    ["quotation", locale === "en" ? "Request a project quotation" : "索取項目報價"],
    ["workplace", locale === "en" ? "Office" : "辦公空間"],
    ["property", locale === "en" ? "Property / lobby" : "物業／大堂"],
    ["hospitality", locale === "en" ? "Hospitality / clubhouse" : "酒店／會所"],
    ["other", locale === "en" ? "Other commercial space" : "其他商業空間"],
  ];
  return (
    <section className="contact-page section--paper">
      <div className="page-shell">
        <Breadcrumbs locale={locale} items={[{ label: c.nav.contact }]} />
        <div className="contact-page__grid">
          <div>
            <p className="eyebrow">{c.nav.contact}</p>
            <h1>{locale === "en" ? "Discuss a CANVIVA project." : "討論你的 CANVIVA 項目。"}</h1>
            <p>{locale === "en" ? "Tell us where the project is, what the space needs to do and when you hope to move forward." : "告訴我們項目位置、空間需要承擔的角色，以及希望推進的時間。"}</p>
            <div className="contact-fallback"><p><strong>{locale === "en" ? "Email" : "電郵"}</strong><a href={`mailto:${settings.email}`}>{settings.email}</a></p><p><strong>{locale === "en" ? "Telephone" : "電話"}</strong><span><a href="tel:+85254787719">+852 5478 7719</a><a href="tel:+8618824675385">+86 188 2467 5385</a></span></p></div>
          </div>
          <div id="project-quotation" className="contact-quotation" ref={quotationRef} tabIndex={-1} aria-labelledby="project-quotation-title">
            <h2 id="project-quotation-title">{locale === "en" ? "Project quotation & requirements" : "項目報價與需求"}</h2>
            <p>{locale === "en" ? "Share the site, scope and target timeline. Pricing is confirmed for each agreed project; typical budget ranges and lead-time guidance remain pending." : "請提供場地、需求範圍及目標時間。我們按確認的項目方案報價；典型預算範圍與交期指引仍待補充。"}</p>
            <div className="intent-selector" role="radiogroup" aria-label={locale === "en" ? "Project type" : "項目類型"}>{intents.map(([value, label]) => <button type="button" role="radio" aria-checked={intent === value} key={value} onClick={() => setIntent(value)}>{intent === value ? <CheckCircle weight="fill" aria-hidden="true" /> : <span className="radio-dot" />}{label}</button>)}</div>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="intent" value={intent} />
              <input type="hidden" name="source" value={sourcePath} />
              <FormField label={locale === "en" ? "Name" : "姓名"} name="name" autoComplete="name" error={errors.name} />
              <FormField label={locale === "en" ? "Company" : "公司"} name="company" autoComplete="organization" error={errors.company} />
              <FormField label={locale === "en" ? "Work email" : "工作電郵"} name="email" type="email" autoComplete="email" error={errors.email} />
              <FormField label={locale === "en" ? "Phone / WhatsApp" : "電話／WhatsApp"} name="phone" type="tel" autoComplete="tel" />
              <FormField label={locale === "en" ? "Project location" : "項目位置"} name="location" />
              <FormField label={locale === "en" ? "Approx. space / requirement" : "大約空間／需求"} name="requirement" />
              <FormField label={locale === "en" ? "Target timeline" : "目標時間"} name="timeline" />
              <label className="form-field form-field--textarea"><span>{locale === "en" ? "Project message" : "項目說明"}</span><textarea name="message" rows="5" /></label>
              <label className="privacy-check"><input type="checkbox" name="privacy" /><span>{locale === "en" ? "I agree that my details may be used to respond to this enquiry. See the privacy notice." : "我同意資料用於回覆本次查詢，詳情請參閱私隱政策。"}</span></label>
              {errors.privacy ? <p className="field-error" role="alert">{errors.privacy}</p> : null}
              <button className="submit-button" disabled={status === "loading"}>{status === "loading" ? (locale === "en" ? "Sending…" : "發送中…") : (locale === "en" ? "Send project enquiry" : "發送項目查詢")}<ArrowRight aria-hidden="true" /></button>
              <FormStatus locale={locale} status={status} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, name, type = "text", error, ...props }) {
  return <label className="form-field"><span>{label}</span><input name={name} type={type} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props} />{error ? <small className="field-error" id={`${name}-error`} role="alert">{error}</small> : null}</label>;
}

function FormStatus({ locale, status }) {
  if (status === "idle" || status === "loading") return null;
  const messages = {
    success: locale === "en" ? "Thank you. Your enquiry was sent. The confirmed response time will appear here once supplied." : "謝謝，你的查詢已送出。確認回覆時間後會在此顯示。",
    error: locale === "en" ? "We could not send the form. Your entries remain above; please use the email or telephone fallback." : "表單未能送出。已填資料仍保留，請改用電郵或電話。",
    unconfigured: locale === "en" ? "The mail service is not configured yet, so nothing was sent. Your entries remain above; use the fallback contact details once supplied." : "郵件服務尚未配置，因此未有送出資料。已填內容仍保留，待聯絡資料提供後可使用備選方式。",
  };
  return <div className={`form-status form-status--${status}`} role="status">{status === "success" ? <CheckCircle aria-hidden="true" /> : <WarningCircle aria-hidden="true" />}<p>{messages[status]}</p></div>;
}

export function LegalPageLegacy({ locale, type }) {
  const isPrivacy = type === "privacy";
  const title = locale === "en" ? (isPrivacy ? "Privacy notice" : "Terms of use") : (isPrivacy ? "私隱政策" : "使用條款");
  return <article className="legal-page page-shell"><Breadcrumbs locale={locale} items={[{ label: title }]} /><EvidenceBadge locale={locale} type="required" /><h1>{title}</h1><p className="legal-intro">{locale === "en" ? "This page is a structural draft and requires legal review before publication." : "本頁為結構草稿，正式發佈前需要法律審核。"}</p>{(isPrivacy ? [["Purpose", "Explain what enquiry data is collected and why."], ["Data collected", "Name, business details, contact details, enquiry context and consent."], ["Retention and access", "[CONTENT REQUIRED: retention period, processors and access procedure.]"], ["Contact", "[CONTENT REQUIRED: privacy contact details.]"]] : [["Website information", "Product status, concept imagery and development notes are provided with visible evidence labels."], ["No guarantee", "No unverified performance, availability or project outcome is promised."], ["Intellectual property", "[CONTENT REQUIRED: ownership and permitted-use wording.]"], ["Governing terms", "[CONTENT REQUIRED: legal review and jurisdiction.]"]]).map(([heading, body]) => <section key={heading}><h2>{locale === "en" ? heading : ({ Purpose: "用途", "Data collected": "收集資料", "Retention and access": "保留與存取", Contact: "聯絡", "Website information": "網站資訊", "No guarantee": "不作保證", "Intellectual property": "知識產權", "Governing terms": "適用條款" }[heading] || heading)}</h2><p>{body}</p></section>)}</article>;
}

export function LegalPage({ locale, type }) {
  const isPrivacy = type === "privacy";
  const en = locale === "en";
  const title = en ? (isPrivacy ? "Privacy notice" : "Terms of use") : (isPrivacy ? "私隱政策" : "使用條款");
  const sections = isPrivacy
    ? (en
      ? [["Purpose", "We explain what enquiry data is collected and why it is used."], ["Data collected", "Name, business details, contact details, enquiry context and consent."], ["Retention and access", "Enquiry records are retained only for as long as needed to respond, coordinate a project or meet applicable obligations."], ["Contact", "For privacy questions, contact hello@hkminijungle.com."]]
      : [["用途", "我們說明會收集哪些查詢資料，以及資料如何用於回覆和協調。"], ["收集資料", "姓名、公司資料、聯絡資料、查詢背景及同意記錄。"], ["保留與存取", "查詢記錄只會在回覆、協調項目或履行適用責任所需期間保留。"], ["聯絡", "如有私隱問題，請電郵 hello@hkminijungle.com。"]])
    : (en
      ? [["Website information", "Product information, concept imagery and service descriptions are presented according to their source and project scope."], ["No guarantee", "Information is provided for discussion and does not promise availability, performance or a project outcome."], ["Intellectual property", "Site copy, marks and imagery remain the property of HK MINIJUNGLE or their credited owners unless otherwise stated."], ["Governing terms", "The final terms for a project are agreed in writing with the relevant client or partner."]]
      : [["網站資訊", "產品資料、概念圖片與服務描述會按其來源及項目範圍呈現。"], ["不作保證", "網站資訊用於交流，不承諾供應、性能或項目結果。"], ["知識產權", "除另有註明外，網站文字、商標及圖片由 HK MINIJUNGLE 或標示的權利人擁有。"], ["適用條款", "具體項目的最終條款，會與相關客戶或合作夥伴以書面確認。"]]);
  return <article className="legal-page page-shell"><Breadcrumbs locale={locale} items={[{ label: title }]} /><h1>{title}</h1><p className="legal-intro">{en ? "This page explains how site information and enquiry data are handled." : "本頁說明網站資訊及查詢資料的處理方式。"}</p>{sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article>;
}

export function LegacyArchivePage({ locale, type }) {
  const en = locale === "en";
  const content = {
    cuisviva: {
      title: en ? "Consumer growing concept archive" : "消費級種植概念存檔",
      body: en ? "This former product route is retained for reference but is no longer part of the public HK MINIJUNGLE product architecture." : "此舊產品路徑保留作參考，但已不再屬於 HK MINIJUNGLE 的公開產品架構。",
      image: "/images/cuisviva-kitchen-european.png",
    },
    home: {
      title: en ? "Home application archive" : "家居應用存檔",
      body: en ? "Home-growing concepts are no longer presented as a current HK MINIJUNGLE business line." : "家居種植概念不再作為 HK MINIJUNGLE 當前業務線展示。",
      image: "/images/docx-home-kitchen.jpg",
    },
    operations: {
      title: en ? "Operations capability archive" : "運維能力存檔",
      body: en ? "DR FOREST is no longer presented as an internal HK MINIJUNGLE product line. Any future legal entity or service relationship will be described only after formal confirmation." : "DR FOREST 不再作為 HK MINIJUNGLE 的內部產品線展示。未來法律實體或服務關係只會在正式確認後公開。",
      image: "/images/doctor-forest-concept.png",
    },
    technology: {
      title: en ? "Technology catalogue archive" : "技術產品目錄存檔",
      body: en ? "Technology is now explained in service of CANVIVA rather than as a separate public product catalogue." : "技術內容現以服務 CANVIVA 為目的，不再作為獨立公開產品目錄展示。",
      image: "/images/xponge-material-concept.jpg",
    },
  }[type];
  return <><PageHero locale={locale} eyebrow={en ? "Archive notice" : "存檔說明"} title={content.title} body={content.body} image={content.image} /><section className="section section--paper"><div className="page-shell split-copy"><div><p className="eyebrow">CANVIVA</p><h2>{en ? "The current HK MINIJUNGLE focus" : "HK MINIJUNGLE 當前聚焦"}</h2></div><div><p className="large-copy">{en ? "HK MINIJUNGLE develops and delivers CANVIVA living plant systems for workplaces, property, hospitality and premium commercial interiors." : "HK MINIJUNGLE 為辦公、物業、酒店會所與高品質商業室內空間開發和交付 CANVIVA 生命植物系統。"}</p><ArrowLink href={`/${locale}/products/canviva`}>{en ? "Explore CANVIVA" : "探索 CANVIVA"}</ArrowLink></div></div></section><FinalCta locale={locale} title={en ? "Have a commercial-space project?" : "正在規劃商業空間項目？"} href={`/${locale}/contact?intent=proposal`} label={en ? "Talk to HK MINIJUNGLE" : "聯絡 HK MINIJUNGLE"} /></>;
}

export function NotFoundPage({ locale }) {
  const c = getLocaleCopy(locale);
  return <section className="not-found page-shell"><span>404</span><h1>{locale === "en" ? "This path has not taken root." : "這條路徑尚未生根。"}</h1><p>{locale === "en" ? "Return to the product platform, explore a space solution or start a conversation." : "返回產品平台、探索空間方案，或直接展開對話。"}</p><div><ArrowLink href={`/${locale}/products`} tone="solid">{c.nav.products}</ArrowLink><ArrowLink href={`/${locale}/solutions`}>{c.nav.solutions}</ArrowLink><ArrowLink href={`/${locale}/contact`}>{c.nav.contact}</ArrowLink></div></section>;
}

function PageHero({ locale, eyebrow, title, family, body, image, imageSources, imageLabel = "concept" }) {
  return <section className={`page-hero${family ? " page-hero--canviva" : ""}`}><ImageFrame src={image} sources={imageSources} sizes="100vw" alt={title} locale={locale} label={imageLabel} eager motion="none" /><div className="page-hero__overlay" /><div className="page-shell page-hero__content"><p className="eyebrow eyebrow--light">{eyebrow}</p><h1>{title}</h1>{family ? <p className="page-hero__family">{family}</p> : null}<p>{body}</p></div></section>;
}

function FinalCta({ locale, title, href, label }) {
  return <section className="final-cta"><div className="page-shell"><h2>{title}</h2><ArrowLink href={href} tone="paper">{label}</ArrowLink></div></section>;
}
