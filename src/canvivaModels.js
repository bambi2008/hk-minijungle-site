import { officeSceneImages, shoppingMallImages, brandStoreImages } from "./sceneGalleries.js";

export const duoSceneImages = [
  { src: "/images/canviva-duo/c1db9821-58f2-4d80-bc23-8029365c0ff2.png", zh: "CANVIVA DUO 深色金屬飾面雙面款意向", en: "CANVIVA DUO double-sided dark metal concept", width: 1024, height: 1536 },
  { src: "/images/canviva-duo/7f6ad06d-d451-4fb7-a92a-73bb092aa8c4.png", zh: "CANVIVA DUO 木質飾面雙面款意向", en: "CANVIVA DUO double-sided timber concept", width: 1024, height: 1536 },
  { src: "/images/canviva-duo/40bbee9f-08a4-4495-81c1-c48879d48f2d.png", zh: "CANVIVA DUO 淺色飾面雙面款意向", en: "CANVIVA DUO double-sided light finish concept", width: 1024, height: 1536 },
];

// Approved public choices. Historical SIGNATURE/WALL/PANEL data stays archived.
export const canvivaModels = [
  {
    slug: "canviva-one", name: "CANVIVA ONE", nameZh: "單面款", descriptor: "Single-sided living art", descriptorZh: "單面植物藝術系統",
    kind: "product", public: true, audience: "work", category: "CANVIVA", format: "one", status: "pilot", evidence: "concept",
    image: officeSceneImages[3].src, sceneImages: [officeSceneImages[3], shoppingMallImages[0], brandStoreImages[0]],
    en: { short: "Single-sided living planting for workplaces, shopping malls and sustainability-minded brand stores.", alt: "CANVIVA ONE in a shared office — concept visualisation", problem: "A living interface for the spaces we share.", users: ["Workplaces", "Shopping malls", "Brand stores"], features: ["Single-sided planting", "Furniture-like modular design", "Integrated water circulation and plant lighting", "Defined ongoing care"] },
    "zh-hk": { short: "為辦公、購物商場與可持續理念品牌店而設的單面活體植景。", alt: "辦公協作區的 CANVIVA ONE——概念效果圖", problem: "為共享的日常，建立持續生長的自然界面。", users: ["辦公空間", "購物商場", "品牌店"], features: ["單面植景", "家具化模組設計", "整合循環水路與植物照明", "明確持續養護責任"] },
  },
  {
    slug: "canviva-duo", name: "CANVIVA DUO", nameZh: "雙面款", descriptor: "Double-sided living art", descriptorZh: "雙面植物藝術系統",
    kind: "product", public: true, audience: "work", category: "CANVIVA", format: "duo", status: "development", comingSoon: true, evidence: "concept",
    image: duoSceneImages[0].src, sceneImages: duoSceneImages,
    en: { short: "A double-sided living planting concept for shared interiors. Coming soon; final design and launch timing are not yet confirmed.", alt: "CANVIVA DUO double-sided concept — coming soon", problem: "Two living faces. A new way to define shared space.", users: ["Shared interiors"], features: ["Double-sided planting concept", "Three supplied design references", "Final specification pending", "Coming soon"] },
    "zh-hk": { short: "面向共享室內空間的雙面活體植景意向。即將上市，最終設計與上市時間尚待確認。", alt: "CANVIVA DUO 雙面款概念效果——即將上市", problem: "以兩面生長，重新定義共享空間。", users: ["共享室內空間"], features: ["雙面植景意向", "三款設計參考", "最終規格待確認", "即將上市"] },
  },
];
