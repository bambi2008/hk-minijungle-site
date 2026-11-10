import { journalPosts, settings, solutions } from "./content.js";
import { canvivaModels } from "./canvivaModels.js";

export const mallTitle = (locale) => locale === "en" ? "Living Plant Walls for Shopping Malls" : "購物商場活體植物牆";
export const familyTitle = (locale) => locale === "en" ? "CANVIVA Living Plant Systems" : "CANVIVA 活體植物系統";

// Publisher-authored summaries of the current pages. No new claims or dates.
const pages = {
  "": [
    "Discover HK MINIJUNGLE's CANVIVA living plant systems for Hong Kong workplaces, shopping malls and sustainability-minded brand stores.",
    "認識香港迷你森科技國際有限公司，以及面向公共室內空間的 CANVIVA 植物藝術系統。從辦公空間、購物商場及可持續理念品牌店的概念場景，探索讓自然融入日常的方法。",
    "/images/hero-living-wall-hong-kong-concept.jpg",
  ],
  products: [
    "Compare single-sided CANVIVA ONE with the upcoming double-sided DUO concept, and choose which living plant system to discuss for your space.",
    "瀏覽 CANVIVA 產品目錄，比較面向公共空間的 ONE 單面活體植景與即將上市的 DUO 雙面款意向。由不同產品形式、概念圖像與場景，找到適合進一步討論的方向。",
    solutions[0].image,
  ],
  "products/canviva": [
    "Meet the CANVIVA family of living plant systems for public interiors, with single-sided ONE and the upcoming double-sided DUO concept.",
    "了解 CANVIVA 活體植物系統如何將植物藝術帶入公共室內空間。認識 ONE 單面款與即將上市的 DUO 雙面款，並從辦公、商場及品牌店的概念場景展開探索。",
    solutions[1].image,
  ],
  "products/canviva-one": [
    "Explore CANVIVA ONE, the single-sided living plant system, through office, shopping mall and brand-store concepts and site-review considerations.",
    "探索 CANVIVA ONE 單面活體植物系統，查看辦公、購物商場及品牌店的三種應用概念，了解擺放條件、電源、服務通道和持續養護責任如何納入項目評估。",
    canvivaModels[0].image,
  ],
  "products/canviva-duo": [
    "Preview three design concepts for CANVIVA DUO, an upcoming double-sided living plant system. Final specifications and timing remain unconfirmed.",
    "預覽即將上市的 CANVIVA DUO 雙面活體植景，瀏覽三張完整意向圖，了解其在共享室內空間中的設計方向。圖像為概念參考，最終規格及上市時間仍待確認。",
    canvivaModels[1].image,
  ],
  solutions: [
    "Browse CANVIVA planting concepts for workplaces, shopping malls and sustainability-minded brand stores in three independent image galleries.",
    "從辦公空間、購物商場與可持續理念品牌店三組橫向圖集，瀏覽 CANVIVA 活體植景的應用概念。比較不同空間的視覺角色、使用動線及長期養護條件，再進一步討論場地需求。",
    solutions[2].image,
  ],
  "solutions/workplace": [
    "See CANVIVA concepts for compact Hong Kong offices, from meeting rooms to collaboration areas, with considerations for installation and care.",
    "瀏覽香港緊湊辦公室的 CANVIVA 植景概念，從會議室、協作區到團隊休憩空間，了解如何在規劃時考慮安裝與養護對日常工作的影響，並按場地條件討論試點。",
    solutions[0].sceneImages[0].src,
  ],
  "solutions/hospitality-retail": [
    "Explore CANVIVA living plant wall concepts for shopping mall atriums, promenades and seating areas, with site and service considerations.",
    "探索為購物商場中庭、購物走廊及休憩區而設的 CANVIVA 活體植物牆概念。瀏覽八張商場場景，了解照明、動線、安裝時段與日後養護通道等場地條件。",
    solutions[1].sceneImages[1].src,
  ],
  "solutions/property-fm": [
    "Explore CANVIVA living greenery concepts for sustainability-minded skincare, dining, lifestyle and fashion brands, with practical fit criteria.",
    "查看可持續發展理念品牌店的 CANVIVA 植景概念，涵蓋護膚、餐飲、書店及生活方式零售空間。比較各類門店的應用畫面及現場條件，區分設計意向與實際項目證據。",
    solutions[2].sceneImages[1].src,
  ],
  "technology/xponge": [
    "See CANVIVA's modular structure, Xponge root-zone principles and reference water and grow-light schedules, with sources and validation limits.",
    "由 CANVIVA 家具化模組的結構分解圖，了解 Xponge 根區的儲水與通氣原理、自動水循環及補光的參考設定。頁面同時列出材料來源、使用邊界與仍需核對的驗證資料。",
    "/images/xponge-material-concept.jpg",
  ],
  "technology/proof": [
    "Explore the CANVIVA evidence framework for care records, site observations and operating responsibilities, with validation limits made visible.",
    "了解 CANVIVA 如何整理可追溯的植物狀態、場地觀察、養護責任與服務記錄。從項目運行記錄的框架，區分已知資料、仍待驗證的內容及可供後續養護判斷的線索。",
    "/images/canviva-co-creation.png",
  ],
  esg: [
    "Understand where indoor planting fits into Hong Kong ESG discussions, including biophilic design inputs and records for project assessment.",
    "了解室內植景與香港 ESG、親自然設計和項目披露的關係。查看設計輸入、項目記錄及認證審查的區分，掌握如何以可追溯資料支持溝通，而不把植景等同認證結果。",
    "/images/docx-esg-office.png",
  ],
  journal: [
    "Read HK MINIJUNGLE's projects and practice journal on compact workplaces, smart planting, material choices and real-space pilot planning.",
    "瀏覽 HK MINIJUNGLE 的項目與實踐文章，了解緊湊辦公空間、智慧種植、材料選擇及試點規劃。從設計想法到真實場地，閱讀團隊如何連結空間、植物與持續養護。",
    "/images/docx-why-hk-minijungle.png",
  ],
  "journal/why-hk-minijungle": [
    "Read the HK MINIJUNGLE editorial on reconnecting indoor spaces and living plants through material choices, spatial design and ongoing care.",
    "閱讀 HK MINIJUNGLE 的品牌文章，了解自然、藝術與科技如何共同進入城市室內空間。文章連結植物生命、材料選擇、光線與空間構成，並說明持續養護在設計中的角色。",
  ],
  "journal/compact-hong-kong-workplaces": [
    "Read how compact Hong Kong offices can make better use of vertical space, with CANVIVA planting, interior constraints and care considerations.",
    "閱讀為香港緊湊辦公室而設計的文章，了解高密度工作環境如何利用垂直界面引入植景。內容討論空間限制、植物系統配置與現場養護，也區分運行記錄與正式環境測試。",
  ],
  "journal/inside-xponge": [
    "Read about an exchange on smart planting, automated irrigation, environmental sensing and control integration for future application scenarios.",
    "閱讀有關智慧種植與控制系統整合的交流紀錄，了解自動灌溉、環境感測、裝置控制及運行資料的討論方向，以及這些技術議題如何對應辦公和公共室內空間的實際需要。",
  ],
  "journal/low-interruption-care": [
    "Read the practice note on indoor planting in Hong Kong ESG work, including biophilic design references and evidence for project disclosure.",
    "閱讀香港 ESG 應用的實踐筆記，了解室內植景如何連結員工福祉、親自然設計及項目證據。文章區分植景設計、披露所需資料和正式認證審查的責任與界線。",
  ],
  "journal/prototype-to-place": [
    "Read the GreenCanvas trial article on moving a planting system from prototype to field evaluation in Hong Kong, including the intended scope.",
    "閱讀 GreenCanvas 由原型走向實際場地的文章，了解香港本地試驗所描述的設計、安裝適配、運行觀察與養護評估範圍，以及從場地經驗回饋產品與服務的方向。",
  ],
  "journal/founding-pilot-programme": [
    "See how the CANVIVA pilot article frames shared validation, agreed responsibilities, project records and next steps before installation.",
    "閱讀 CANVIVA 共同定義與真實驗證的試點文章，了解客戶與項目團隊如何在安裝前約定範圍、週期、養護責任、記錄及後續安排，並以真實空間的回饋支持下一步。",
  ],
  about: [
    "Learn about HK MINIJUNGLE, its Hong Kong base, CANVIVA project responsibilities and the relationship between living art and long-term care.",
    "認識 HK MINIJUNGLE 在香港的業務、CANVIVA 產品系統與項目責任。從自然、藝術與科技的品牌理念，了解由空間方案到交付及持續養護的工作，並查看常見問題。",
    "/images/canviva-hong-kong-office.png",
  ],
  contact: [
    "Contact HK MINIJUNGLE to discuss a CANVIVA project, request a site review or quotation, or enquire about the upcoming double-sided DUO.",
    "聯絡 HK MINIJUNGLE，提供場地、使用需求與目標時間，討論 CANVIVA 項目、場地評估或報價。也可查詢即將上市的 DUO 設計進展，並查看電郵及電話聯絡方式。",
    "/images/canviva-co-creation.png",
  ],
  privacy: [
    "Read how HK MINIJUNGLE handles the information you provide through project enquiries and how to contact the company about privacy questions.",
    "閱讀 HK MINIJUNGLE 的私隱政策，了解在項目查詢過程中提交的聯絡資料和項目資料如何使用，以及有關私隱、資料處理或查詢時可採用的聯絡方式與相關說明。",
  ],
  terms: [
    "Read HK MINIJUNGLE's website terms, including the use of site materials, concept visualisations and the limits of project-related information.",
    "閱讀 HK MINIJUNGLE 網站的使用條款，了解網站資料、概念效果圖及項目相關說明的用途與適用範圍。具體配置、交付及商業條件仍以獲確認的項目文件為準。",
  ],
};

export function getPageSeo(pathname, locale) {
  const key = pathname.split("/").filter(Boolean).slice(1).join("/");
  const post = key.startsWith("journal/") ? journalPosts.find((entry) => entry.slug === key.slice(8)) : undefined;
  const entry = pages[key];
  return {
    description: entry?.[locale === "en" ? 0 : 1],
    image: new URL(entry?.[2] || post?.image || "/images/hk-minijungle-logo.png", settings.siteUrl).href,
    type: post ? "article" : "website",
  };
}

export function getAlternateLinks(pathname) {
  const suffix = pathname.split("/").filter(Boolean).slice(1).join("/");
  const href = (locale) => `${settings.siteUrl}/${locale}${suffix ? `/${suffix}` : ""}`;
  return [["en", href("en")], ["zh-Hant-HK", href("zh-hk")], ["x-default", href("zh-hk")]];
}
