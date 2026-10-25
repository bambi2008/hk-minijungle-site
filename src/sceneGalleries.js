// Supplied concept scenes. Preserve original aspect ratios and source artwork.
export const officeSceneImages = [
  { src: "/images/canviva-office-meeting-concept.png", en: "Single-sided CANVIVA planting in an office meeting room", zh: "辦公會議室內的 CANVIVA 單面款植景", width: 1374, height: 1145 },
  { src: "/images/canviva-office-executive-concept.png", en: "CANVIVA planting beside an executive office desk", zh: "主管辦公室桌旁的 CANVIVA 單面款植景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-studio-concept.png", en: "CANVIVA planting in a bright creative workspace", zh: "明亮創作工作區內的 CANVIVA 單面款植景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-collaboration-concept.png", en: "CANVIVA planting beside an office collaboration table", zh: "辦公協作桌旁的 CANVIVA 單面款植景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-shared-concept.png", en: "Single-sided CANVIVA planting in a shared office workspace", zh: "共享辦公區內的 CANVIVA 單面款植景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-design-studio-concept.png", en: "CANVIVA planting in a design studio meeting space", zh: "設計工作室洽談區內的 CANVIVA 單面款植景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-plant-interaction-concept.png", en: "Colleagues looking at CANVIVA foliage during an office break", zh: "同事於辦公休息時間近看 CANVIVA 植物", width: 1536, height: 1024 },
  { src: "/images/canviva-office-team-break-concept.png", en: "Colleagues chatting beside CANVIVA in a shared office", zh: "同事在共享辦公區 CANVIVA 旁交流", width: 1536, height: 1024 },
  { src: "/images/canviva-office-window-lounge-concept.png", en: "An office conversation beside CANVIVA and a city-view window", zh: "城市景觀窗旁的 CANVIVA 辦公交流場景", width: 1536, height: 1024 },
  { src: "/images/canviva-office-creative-discussion-concept.png", en: "A creative team conversation beside CANVIVA planting", zh: "創意團隊在 CANVIVA 植景旁交流", width: 1536, height: 1024 },
  { src: "/images/canviva-office-lounge-concept.png", en: "Single-sided CANVIVA planting in an office team lounge", zh: "辦公團隊休憩區內的 CANVIVA 單面款植景", width: 1536, height: 1024 },
];

function scene(folder, id, zh, en, width = 1672, height = 941) {
  return { src: `/images/scenes/${folder}/${id}.png`, zh, en, width, height };
}

export const shoppingMallImages = [
  scene("shoppingmall", "39e4faba-771e-4a9f-887b-9532d2b4afcf", "玻璃穹頂購物商場中庭的 CANVIVA 植景", "CANVIVA planting in a glass-roofed shopping atrium"),
  scene("shoppingmall", "d8fceea6-27ee-463a-a4cf-f31f8f2c6043", "城市夜景購物商場的 CANVIVA 植景", "CANVIVA planting in a shopping mall at dusk"),
  scene("shoppingmall", "d3374e71-7e28-485b-92a7-82b951179e15", "多層購物空間與樓梯旁的 CANVIVA 植景", "CANVIVA planting across a multi-level shopping space"),
  scene("shoppingmall", "7a6edbcf-c5e2-464a-9468-01d8e7db5bef", "時裝展示與購物動線旁的 CANVIVA 植景", "CANVIVA planting beside fashion displays and shopping routes"),
  scene("shoppingmall", "9c999f56-970a-4294-8225-f2d103778e4b", "購物商場休息區的 CANVIVA 單面款植景", "Single-sided CANVIVA planting in a shopping mall lounge", 1536, 1024),
  scene("shoppingmall", "76d7ed50-068c-45c4-a952-bebcabcc6511", "維港景觀購物商場的 CANVIVA 綠牆", "CANVIVA green walls in a harbour-view shopping mall"),
  scene("shoppingmall", "227d40a6-c7e3-4bdb-a774-1feea1631823", "紅磚購物空間的 CANVIVA 柱面植景", "CANVIVA planting on columns in a brick shopping interior"),
  scene("shoppingmall", "b3a366ca-782c-4a96-a25e-b00193cdcbc5", "海景購物走廊與休憩區的 CANVIVA 植景", "CANVIVA planting along a harbour-view shopping promenade"),
];

export const brandStoreImages = [
  scene("brands", "6fcfa698-2a1f-4b72-babb-53f94344141e", "自然護膚品牌店的 CANVIVA 植景", "CANVIVA planting in a natural skincare brand store"),
  scene("brands", "26dfbd74-50b4-4ea3-a419-f319f06b84d2", "木質護膚品牌體驗空間的 CANVIVA 植景", "CANVIVA planting in a timber-lined skincare experience store"),
  scene("brands", "e5df64c0-d092-43cb-a973-85290d29b847", "護膚品牌諮詢與試用空間的 CANVIVA 植景", "CANVIVA planting in a skincare consultation and trial space"),
  scene("brands", "d77252c5-02d8-4496-9564-92f3300e17bd", "餐飲品牌用餐區的 CANVIVA 植景", "CANVIVA planting beside a restaurant dining area", 1536, 1024),
  scene("brands", "9a33a649-8c06-496c-9123-e703aaa4bee9", "庭園餐廳室內的 CANVIVA 植景", "CANVIVA planting in a garden restaurant", 1672, 940),
  scene("brands", "9908e39b-e68a-4d5a-8fdf-f4b67e014a6a", "農場到餐桌餐廳的 CANVIVA 植景", "CANVIVA planting in a farm-to-table restaurant concept"),
  scene("brands", "7a802bc8-2e6a-4f2e-8b89-a6a8dec3fda0", "獨立書店閱讀空間的 CANVIVA 植景", "CANVIVA planting in an independent bookshop concept"),
  scene("brands", "fe8e01c7-3fbb-475e-b6f5-b8231b420770", "家居生活方式品牌店的 CANVIVA 植景", "CANVIVA planting in a home and lifestyle brand store concept"),
  scene("brands", "ff9a2e82-4636-435a-a4e0-65401b0dac68", "時裝品牌店的 CANVIVA 植景", "CANVIVA planting in a fashion brand store"),
];

export const publicSpaceImages = [officeSceneImages[3], shoppingMallImages[0], brandStoreImages[0]];
