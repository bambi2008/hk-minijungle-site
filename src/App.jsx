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
  LegalPage,
  NotFoundPage,
  ProductDetailPage,
  ProductsPage,
  ProofPage,
  SolutionDetailPage,
  SolutionsPage,
  TechnologyDetailPage,
  TechnologyPage,
} from "./pages.jsx";

const defaultDescriptions = {
  en: "HK MINIJUNGLE creates modular planting systems, material solutions and intelligent care tools for greener workplaces and homes.",
  "zh-hk": "HK MINIJUNGLE 為辦公與生活空間設計模組化種植系統、材料方案與智能養護工具。",
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

function useSeo(locale, title, description, pathname) {
  useEffect(() => {
    document.documentElement.lang = locale === "zh-hk" ? "zh-Hant-HK" : "en";
    document.title = `${title} | HK MINIJUNGLE`;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: `${title} | HK MINIJUNGLE` });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: `${settings.siteUrl}/images/hero-living-wall-hong-kong-concept.jpg` });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: `${settings.siteUrl}${pathname}` });
    const canonical = ensureMeta('link[rel="canonical"]', { tag: "link", rel: "canonical", href: `${settings.siteUrl}${pathname}` });
    canonical.href = `${settings.siteUrl}${pathname}`;
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    ["en", "zh-hk"].forEach((target) => {
      const alternate = document.createElement("link");
      alternate.rel = "alternate";
      alternate.hreflang = target === "zh-hk" ? "zh-Hant-HK" : "en";
      const segments = pathname.split("/").filter(Boolean);
      if (segments[0] === "en" || segments[0] === "zh-hk") segments[0] = target;
      else segments.unshift(target);
      alternate.href = `${settings.siteUrl}/${segments.join("/")}`;
      document.head.appendChild(alternate);
    });
  }, [description, locale, pathname, title]);
}

function RouteView({ pathname }) {
  const { locale, segments } = parseLocation(pathname);
  const [root, slug] = segments;
  const canonicalSlug = root === "products" && slug
    ? ({ greencanvas: "canviva", "green-canvas": "canviva", "home-panel": "cuisviva-kitchen", homepadel: "cuisviva-kitchen" }[slug] || slug)
    : slug;
  let page;
  let title = locale === "en" ? "Nature, designed into everyday space" : "讓自然成為空間的一部分";
  let stickyCta;

  if (!root) {
    page = <HomePage locale={locale} />;
  } else if (root === "products" && !slug) {
    title = locale === "en" ? "Products" : "產品";
    page = <ProductsPage locale={locale} />;
  } else if (root === "products" && slug) {
    const product = products.find((item) => item.slug === canonicalSlug || item.legacySlugs?.includes(slug));
    if (product) {
      title = locale === "en" ? product.name : (product.nameZh || product.name);
      stickyCta = { href: `/${locale}/contact?product=${product.slug}`, label: locale === "en" ? "Enquire" : "查詢" };
      page = product.kind === "technology" ? <TechnologyDetailPage locale={locale} slug={product.slug} /> : <ProductDetailPage locale={locale} product={product} />;
    }
  } else if (root === "solutions" && !slug) {
    title = locale === "en" ? "Solutions" : "空間方案";
    page = <SolutionsPage locale={locale} />;
  } else if (root === "solutions" && slug) {
    const solution = solutions.find((item) => item.slug === slug);
    if (solution) {
      title = solution[locale]?.name || solution.en.name;
      stickyCta = { href: `/${locale}/contact?solution=${solution.slug}`, label: solution[locale]?.cta || solution.en.cta };
      page = <SolutionDetailPage locale={locale} solution={solution} />;
    }
  } else if (root === "esg") {
    title = locale === "en" ? "ESG in Hong Kong" : "ESG 在香港的應用";
    page = <ESGPage locale={locale} />;
  } else if (root === "technology" && !slug) {
    title = locale === "en" ? "Technology & proof" : "技術與實證";
    page = <TechnologyPage locale={locale} />;
  } else if (root === "technology" && ["xponge", "doctor-forest"].includes(slug)) {
    title = slug === "xponge" ? "Xponge" : "Doctor Forest";
    page = <TechnologyDetailPage locale={locale} slug={slug} />;
  } else if (root === "technology" && slug === "proof") {
    title = locale === "en" ? "System records" : "系統記錄";
    page = <ProofPage locale={locale} />;
  } else if (root === "journal" && !slug) {
    title = locale === "en" ? "Journal" : "動態";
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

  useSeo(locale, title, defaultDescriptions[locale], pathname);
  return <Shell locale={locale} pathname={pathname} stickyCta={stickyCta}>{page}</Shell>;
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
