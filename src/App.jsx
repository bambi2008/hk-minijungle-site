import { useEffect, useState } from "react";
import { Shell } from "./components.jsx";
import { journalPosts, locales, products, settings, solutions } from "./content.js";
import {
  AboutPage,
  ArticlePage,
  ContactPage,
  ESGPage,
  HomePage,
  JournalPage,
  LegacyArchivePage,
  LegalPage,
  NotFoundPage,
  ProductDetailPage,
  ProductsPage,
  ProofPage,
  SolutionDetailPage,
  SolutionsPage,
  TechnologyDetailPage,
} from "./pages.jsx";
import { PlantDetailPage, PlantLibraryPage, PlantScanPage } from "./plantKnowledge.jsx";
import { getPlant, localPlantText } from "./plantData.js";
import { getStructuredData } from "./seo.js";
import { familyTitle, getAlternateLinks, getPageSeo, mallTitle } from "./routeSeo.js";
import { SystemTechnologyPage } from "./SystemTechnologyPage.jsx";

const defaultDescriptions = {
  en: "Explore CANVIVA ONE single-sided living art for Hong Kong public spaces and CANVIVA DUO double-sided concepts, coming soon.",
  "zh-hk": "探索為香港公共空間而設的 CANVIVA ONE 單面活體植景，以及即將上市的 CANVIVA DUO 雙面款意向。",
};

function parseLocation(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = locales.includes(segments[0]) ? segments.shift() : "zh-hk";
  return { locale, segments };
}

function ensureMeta(selector, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement(attrs.tag || "meta");
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => key !== "tag" && node.setAttribute(key, value));
  return node;
}

function useSeo({ locale, title, description, canonicalPath, indexable, notFound, image, type }) {
  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : "en";
    document.title = `${title} | HK MINIJUNGLE`;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: `${title} | HK MINIJUNGLE` });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: type });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: image });
    ensureMeta('meta[property="og:locale"]', { property: "og:locale", content: locale === "en" ? "en_US" : "zh_HK" });
    ensureMeta('meta[property="og:locale:alternate"]', { property: "og:locale:alternate", content: locale === "en" ? "zh_HK" : "en_US" });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: `${settings.siteUrl}${canonicalPath}` });
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: `${title} | HK MINIJUNGLE` });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    ensureMeta('meta[name="robots"]', { name: "robots", content: notFound ? "noindex" : indexable ? "index,follow" : "noindex,follow" });
    if (notFound) document.head.querySelector('link[rel="canonical"]')?.remove();
    else ensureMeta('link[rel="canonical"]', { tag: "link", rel: "canonical", href: `${settings.siteUrl}${canonicalPath}` });
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    if (!notFound) getAlternateLinks(canonicalPath).forEach(([language, href]) => {
      const alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = language;
      alternate.href = href;
      document.head.appendChild(alternate);
    });
  }, [canonicalPath, description, image, indexable, locale, notFound, title, type]);
}

function useStructuredData(pathname, title, indexable) {
  useEffect(() => {
    document.querySelectorAll('script[data-geo-structured-data]').forEach((node) => node.remove());
    getStructuredData(pathname, { title, indexable }).forEach((item) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.geoStructuredData = "true";
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [pathname, title, indexable]);
}

export function resolveRoute(pathname) {
  const { locale, segments } = parseLocation(pathname);
  const [root, slug] = segments;
  const canonicalSlug = root === "products" && slug
    ? ({ greencanvas: "canviva", "green-canvas": "canviva", "home-panel": "cuisviva-kitchen", homepadel: "cuisviva-kitchen" }[slug] || slug)
    : slug;
  let page;
  let title = locale === "en" ? "CANVIVA living plant systems for public spaces" : "CANVIVA 公共空間智能植物藝術系統";
  let description = defaultDescriptions[locale];
  let stickyCta;
  let indexable = true;
  let canonicalPath = pathname === "/" ? "/zh-hk" : pathname;

  if (!root) {
    page = <HomePage locale={locale} />;
  } else if (root === "products" && !slug) {
    title = "CANVIVA ONE / DUO";
    description = defaultDescriptions[locale];
    page = <ProductsPage locale={locale} />;
  } else if (root === "products" && slug) {
    const product = products.find((item) => item.slug === canonicalSlug || item.legacySlugs?.includes(slug));
    if (product) {
      title = product.slug === "canviva"
        ? familyTitle(locale)
        : `${product.name}${product.comingSoon ? (locale === "en" ? " · Coming soon" : " · 即將上市") : ""}`;
      if (product.slug === "canviva-one" || product.slug === "canviva-duo") description = (product[locale] || product.en).short;
      if (product.slug === "canviva") description = defaultDescriptions[locale];
      canonicalPath = `/${locale}/products/${product.slug}`;
      if (product.public === false) {
        indexable = false;
        page = <LegacyArchivePage locale={locale} type={product.slug === "cuisviva-kitchen" ? "cuisviva" : "operations"} />;
      } else {
        stickyCta = { href: `/${locale}/contact?intent=${product.comingSoon ? "duo-interest" : "proposal"}&product=${product.slug}`, label: product.comingSoon ? (locale === "en" ? "Enquire about DUO" : "查詢 DUO 進展") : (locale === "en" ? "Discuss a project" : "討論項目") };
        page = product.kind === "technology" ? <TechnologyDetailPage locale={locale} slug={product.slug} /> : <ProductDetailPage locale={locale} product={product} />;
      }
    }
  } else if (root === "solutions" && !slug) {
    title = locale === "en" ? "Commercial applications" : "商業應用場景";
    page = <SolutionsPage locale={locale} />;
  } else if (root === "solutions" && slug) {
    const solution = solutions.find((item) => item.slug === slug);
    if (solution) {
      title = slug === "hospitality-retail" ? mallTitle(locale) : solution[locale]?.name || solution.en.name;
      if (solution.public === false) {
        indexable = false;
        page = <LegacyArchivePage locale={locale} type="home" />;
      } else {
        stickyCta = { href: `/${locale}/contact?intent=proposal&solution=${solution.slug}`, label: solution[locale]?.cta || solution.en.cta };
        page = <SolutionDetailPage locale={locale} solution={solution} />;
      }
    }
  } else if (root === "esg") {
    title = locale === "en" ? "ESG in Hong Kong" : "ESG 在香港的應用";
    page = <ESGPage locale={locale} />;
  } else if (root === "technology" && !slug) {
    title = locale === "en" ? "Technology catalogue archive" : "技術產品目錄存檔";
    indexable = false;
    page = <LegacyArchivePage locale={locale} type="technology" />;
  } else if (root === "technology" && slug === "xponge") {
    title = locale === "en" ? "CANVIVA technology: structure, Xponge, water & light" : "CANVIVA 技術：結構、Xponge、水循環與補光";
    description = locale === "en" ? "Explore the CANVIVA system diagram, Xponge root-zone principles and reference water/light schedules, with source links and clear validation limits." : "了解CANVIVA結構分解、Xponge根區原理、自動水循環與補光參考設定，並查看來源與待驗證資料。";
    page = <SystemTechnologyPage locale={locale} />;
  } else if (root === "technology" && slug === "doctor-forest") {
    title = locale === "en" ? "Operations capability archive" : "運維能力存檔";
    indexable = false;
    page = <LegacyArchivePage locale={locale} type="operations" />;
  } else if (root === "technology" && slug === "proof") {
    title = locale === "en" ? "System records" : "系統記錄";
    page = <ProofPage locale={locale} />;
  } else if (root === "plants" && !slug) {
    title = locale === "en" ? "Global plant library" : "全球植物知識庫";
    description = locale === "en" ? "A source-labelled plant library spanning Germany, the United States, Hong Kong, Mainland China, the United Kingdom and France." : "收錄德國、美國、香港、中國大陸、英國及法國代表植物的可溯源植物知識庫。";
    indexable = false;
    page = <PlantLibraryPage locale={locale} />;
  } else if (root === "plants" && slug) {
    const plant = getPlant(slug);
    if (plant) {
      title = `${localPlantText(plant.name, locale)} · ${plant.scientificName}`;
      description = localPlantText(plant.summary, locale);
    } else {
      title = locale === "en" ? "Plant record" : "植物記錄";
      description = locale === "en" ? "A source-labelled record in the HK MINIJUNGLE global plant library." : "HK MINIJUNGLE 全球植物知識庫中的可溯源植物記錄。";
    }
    page = <PlantDetailPage locale={locale} slug={slug} />;
    indexable = false;
  } else if (root === "plant-scan") {
    title = locale === "en" ? "AI plant recognition prototype" : "AI 植物識別架構原型";
    description = locale === "en" ? "A privacy-aware, provider-neutral architecture prototype for future AI plant identification." : "為後續 AI 植物識別預留的私隱友善、供應商中立架構原型。";
    page = <PlantScanPage locale={locale} />;
    indexable = false;
  } else if (root === "journal" && !slug) {
    title = locale === "en" ? "Projects & practice" : "項目與實踐";
    page = <JournalPage locale={locale} />;
  } else if (root === "journal" && slug) {
    const post = journalPosts.find((item) => item.slug === slug);
    if (post) {
      title = post[locale]?.title || post.en.title;
      page = <ArticlePage locale={locale} post={post} />;
    }
  } else if (root === "about") {
    title = locale === "en" ? "About" : "關於我們";
    page = <AboutPage locale={locale} />;
  } else if (root === "contact") {
    title = locale === "en" ? "Contact" : "聯絡我們";
    page = <ContactPage locale={locale} />;
  } else if (root === "privacy" || root === "terms") {
    title = locale === "en" ? (root === "privacy" ? "Privacy notice" : "Terms of use") : (root === "privacy" ? "私隱政策" : "使用條款");
    page = <LegalPage locale={locale} type={root} />;
  }

  const notFound = !page || segments.length > 2 ||
    (slug && ["about", "contact", "esg", "privacy", "terms", "plant-scan"].includes(root));
  if (notFound) {
    title = "404";
    description = locale === "en" ? "This page could not be found." : "找不到這個頁面。";
    indexable = false;
    stickyCta = undefined;
    page = <NotFoundPage locale={locale} />;
  }

  const seo = getPageSeo(canonicalPath, locale);
  return { locale, page, title, description: notFound ? description : seo.description || description, image: seo.image, type: seo.type, stickyCta, indexable, canonicalPath, notFound };
}

export function RouteView({ pathname }) {
  const route = resolveRoute(pathname);
  useSeo(route);
  useStructuredData(route.canonicalPath, route.title, route.indexable);
  return <Shell locale={route.locale} pathname={pathname} stickyCta={route.stickyCta}>{route.page}</Shell>;
}

export function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => {
    function update() { setPathname(window.location.pathname); }
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return <RouteView pathname={pathname} />;
}
