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

const defaultDescriptions = {
  en: "HK MINIJUNGLE creates CANVIVA SIGNATURE, CANVIVA WALL and CANVIVA PANEL living plant systems for commercial interiors in Hong Kong.",
  "zh-hk": "HK MINIJUNGLE 以 CANVIVA SIGNATURE、CANVIVA WALL 與 CANVIVA PANEL 為香港商業室內空間打造智能植物藝術系統。",
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

function useSeo(locale, title, description, pathname, { canonicalPath = pathname, indexable = true } = {}) {
  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : "en";
    document.title = `${title} | HK MINIJUNGLE`;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: `${title} | HK MINIJUNGLE` });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: `${settings.siteUrl}/images/hero-living-wall-hong-kong-concept.jpg` });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: `${settings.siteUrl}${canonicalPath}` });
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: `${title} | HK MINIJUNGLE` });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureMeta('meta[name="robots"]', { name: "robots", content: indexable ? "index,follow" : "noindex,follow" });
    const canonical = ensureMeta('link[rel="canonical"]', { tag: "link", rel: "canonical", href: `${settings.siteUrl}${canonicalPath}` });
    canonical.href = `${settings.siteUrl}${canonicalPath}`;
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    ["en", "zh-hk"].forEach((target) => {
      const alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = target === "zh-hk" ? "zh-Hant-HK" : "en";
      const segments = canonicalPath.split("/").filter(Boolean);
      if (segments[0] === "en" || segments[0] === "zh-hk") segments[0] = target;
      else segments.unshift(target);
      alternate.href = `${settings.siteUrl}/${segments.join("/")}`;
      document.head.appendChild(alternate);
    });
  }, [canonicalPath, description, indexable, locale, pathname, title]);
}

function useStructuredData(pathname) {
  useEffect(() => {
    document.querySelectorAll('script[data-geo-structured-data]').forEach((node) => node.remove());
    getStructuredData(pathname).forEach((item) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.geoStructuredData = "true";
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    });
  }, [pathname]);
}

export function resolveRoute(pathname) {
  const { locale, segments } = parseLocation(pathname);
  const [root, slug] = segments;
  const canonicalSlug = root === "products" && slug
    ? ({ greencanvas: "canviva", "green-canvas": "canviva", "home-panel": "cuisviva-kitchen", homepadel: "cuisviva-kitchen" }[slug] || slug)
    : slug;
  let page;
  let title = locale === "en" ? "CANVIVA living plant systems for commercial space" : "CANVIVA 商業空間智能植物藝術系統";
  let description = defaultDescriptions[locale];
  let stickyCta;
  let indexable = true;
  let canonicalPath = pathname;

  if (!root) {
    page = <HomePage locale={locale} />;
  } else if (root === "products" && !slug) {
    title = locale === "en" ? "CANVIVA SIGNATURE, WALL & PANEL" : "CANVIVA SIGNATURE、WALL 與 PANEL";
    description = defaultDescriptions[locale];
    page = <ProductsPage locale={locale} />;
  } else if (root === "products" && slug) {
    const product = products.find((item) => item.slug === canonicalSlug || item.legacySlugs?.includes(slug));
    if (product) {
      title = product.slug === "canviva"
        ? (locale === "en" ? "CANVIVA living plant systems" : "CANVIVA 智能植物藝術系統")
        : (locale === "en" ? product.name : (product.nameZh || product.name));
      if (product.slug === "canviva") description = defaultDescriptions[locale];
      canonicalPath = `/${locale}/products/${product.slug}`;
      if (product.public === false) {
        indexable = false;
        page = <LegacyArchivePage locale={locale} type={product.slug === "cuisviva-kitchen" ? "cuisviva" : "operations"} />;
      } else {
        stickyCta = { href: `/${locale}/contact?intent=proposal&product=${product.slug}`, label: locale === "en" ? "Discuss a project" : "討論項目" };
        page = product.kind === "technology" ? <TechnologyDetailPage locale={locale} slug={product.slug} /> : <ProductDetailPage locale={locale} product={product} />;
      }
    }
  } else if (root === "solutions" && !slug) {
    title = locale === "en" ? "Commercial applications" : "商業應用場景";
    page = <SolutionsPage locale={locale} />;
  } else if (root === "solutions" && slug) {
    const solution = solutions.find((item) => item.slug === slug);
    if (solution) {
      title = solution[locale]?.name || solution.en.name;
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
    title = "Xponge · CANVIVA system material";
    page = <TechnologyDetailPage locale={locale} slug={slug} />;
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

  if (!page) {
    title = "404";
    page = <NotFoundPage locale={locale} />;
  }

  return { locale, page, title, description, stickyCta, indexable, canonicalPath };
}

export function RouteView({ pathname }) {
  const route = resolveRoute(pathname);
  useSeo(route.locale, route.title, route.description, pathname, { canonicalPath: route.canonicalPath, indexable: route.indexable });
  useStructuredData(pathname);
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
