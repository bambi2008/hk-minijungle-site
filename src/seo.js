import { settings } from "./content.js";

const brand = { "@type": "Brand", name: "HK MINIJUNGLE" };

const productVariants = [
  {
    name: "CANVIVA SIGNATURE",
    alternateName: "生命畫境・定制",
    description: "A custom living plant art system for hotels, clubhouses, corporate headquarters and premium commercial spaces.",
    category: "Custom living plant art system",
  },
  {
    name: "CANVIVA WALL",
    alternateName: "生命畫境・綠牆",
    description: "An integrated vertical greenery system for workplaces, commercial property and public interiors.",
    category: "Integrated vertical greenery system",
  },
  {
    name: "CANVIVA PANEL",
    alternateName: "生命畫境・植景屏",
    description: "A self-contained living plant panel integrating planting, frame, growing system and lighting for flexible indoor placement.",
    category: "Integrated living plant panel",
  },
];

export const aboutFaq = {
  en: [
    {
      title: "What does HK MINIJUNGLE do?",
      body: "HK MINIJUNGLE develops and delivers CANVIVA living plant systems for workplaces, property, hospitality and premium commercial interiors in Hong Kong.",
    },
    {
      title: "What is CANVIVA?",
      body: "CANVIVA is a family of commercial living plant systems. CANVIVA SIGNATURE is the custom format, CANVIVA WALL is the integrated vertical-greenery format, and CANVIVA PANEL is the self-contained living plant panel.",
    },
    {
      title: "Where does HK MINIJUNGLE currently operate?",
      body: "Hong Kong is the current confirmed operating base. Delivery scope outside Hong Kong is confirmed separately for each project.",
    },
    {
      title: "Are product specifications and availability final?",
      body: "No. Final dimensions, finishes, installation interfaces, lead time, maintenance scope and commercial terms are confirmed for each project. Missing approved materials are labelled on the website.",
    },
    {
      title: "How can I contact HK MINIJUNGLE?",
      body: "Email hello@hkminijungle.com or call +852 5478 7719 to discuss a commercial-space project.",
    },
  ],
  "zh-hk": [
    {
      title: "HK MINIJUNGLE 的業務是甚麼？",
      body: "HK MINIJUNGLE 在香港開發和交付 CANVIVA 生命植物系統，服務辦公、物業、酒店會所及高品質商業室內空間。",
    },
    {
      title: "甚麼是 CANVIVA？",
      body: "CANVIVA 是一套商業空間生命植物系統。CANVIVA SIGNATURE 是定制形式，CANVIVA WALL 是建築整合型垂直綠化形式，CANVIVA PANEL 是獨立成品式植景屏。",
    },
    {
      title: "HK MINIJUNGLE 目前在哪裏營運？",
      body: "香港是目前已確認的營運基地；香港以外的交付範圍按每個項目另行確認。",
    },
    {
      title: "產品規格與供應狀態是否已經確定？",
      body: "尚未完全確定。最終尺寸、飾面、安裝接口、交付時間、養護範圍及商業條款按每個項目確認；尚缺的獲批材料會在網站上明確標示。",
    },
    {
      title: "如何聯絡 HK MINIJUNGLE？",
      body: "可電郵 hello@hkminijungle.com 或致電 +852 5478 7719，討論商業空間項目。",
    },
  ],
};

export function getStructuredData(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "en" ? "en" : "zh-hk";
  const root = segments[1];
  const slug = segments[2];
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.legalNameEn,
    alternateName: ["HK MINIJUNGLE", settings.legalNameZh],
    url: `${settings.siteUrl}/`,
    slogan: "讓自然成為空間的一部分",
    description: "A Hong Kong company developing CANVIVA living plant systems for workplaces, property, hospitality and premium commercial interiors.",
    email: settings.email,
    telephone: "+852 54787719",
    areaServed: "Hong Kong",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ROOM 2712, CONVENTION PLAZA OFFICE TOWER, 1 HARBOUR ROAD",
      addressLocality: "WAN CHAI",
      addressRegion: "HONG KONG",
      addressCountry: "HK",
    },
    knowsAbout: [
      "Commercial living plant systems",
      "CANVIVA SIGNATURE",
      "CANVIVA WALL",
      "CANVIVA PANEL",
      "Interior planting",
      "Workplace biophilic design",
    ],
  };
  const data = [organization];

  if (!root) {
    data.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HK MINIJUNGLE",
      url: `${settings.siteUrl}/`,
      inLanguage: ["en", "zh-Hant-HK"],
    });
  }

  if (root === "products" && !slug) {
    data.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "CANVIVA product categories",
      itemListElement: productVariants.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          ...product,
          brand,
          url: `${settings.siteUrl}/${locale}/products/canviva`,
        },
      })),
    });
  }

  if (root === "products" && slug === "canviva") {
    data.push({
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      name: "CANVIVA",
      description: locale === "en"
        ? "A family of living plant systems for commercial interiors."
        : "一套面向商業室內空間的生命植物系統。",
      brand,
      url: `${settings.siteUrl}/${locale}/products/canviva`,
      hasVariant: productVariants.map((product) => ({ "@type": "Product", ...product, brand })),
    });
  }

  if (root === "about") {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale === "en" ? "en" : "zh-Hant-HK",
      mainEntity: aboutFaq[locale].map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: { "@type": "Answer", text: item.body },
      })),
    });
  }

  return data;
}
