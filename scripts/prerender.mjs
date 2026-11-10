#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getAlternateLinks } from "../src/routeSeo.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", ".prerender", "entry-server.js");
const origin = "https://hkminijungle.com";
// This release materially changes every indexed document's head and structured data.
// Keep this date stable across rebuilds; advance it only for a real site-wide update.
const seoRevisionDate = "2026-11-05";
const template = await readFile(path.join(clientDir, "index.html"), "utf8");
const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
const hosting = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
const { renderRoute } = await import(pathToFileURL(serverEntry));
const indexed = Array.from(sitemap.matchAll(/<loc>https:\/\/hkminijungle\.com([^<]+)<\/loc>/g), m => m[1]);
const exactPaths = hosting.rewrites.map(({ source, destination }) => {
  if (!/^\/(en|zh-hk)(\/[a-z0-9-]+)*$/.test(source) || destination !== source + "/index.html") {
    throw new Error("Only exact prerendered paths may be rewritten: " + source);
  }
  return source;
});
if (indexed.some(route => !exactPaths.includes(route))) throw new Error("Sitemap URL missing from the hosting allowlist");

const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function meta(html, attribute, name, content) {
  const tag = '<meta ' + attribute + '="' + name + '" content="' + escape(content) + '" />';
  const pattern = new RegExp('<meta\\s+[^>]*' + attribute + '=["\\x27]' + name + '["\\x27][^>]*>', "i");
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace("</head>", "    " + tag + "\n  </head>");
}

function documentFor(rendered) {
  const title = rendered.title + " | HK MINIJUNGLE";
  const canonical = origin + rendered.canonicalPath;
  let html = template
    .replace(/<html\s+lang=["'][^"']+["']>/i, '<html lang="' + (rendered.locale === "en" ? "en" : "zh-Hant-HK") + '">')
    .replace(/<title>[^<]*<\/title>/i, () => "<title>" + escape(title) + "</title>")
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace('<div id="root"></div>', () => '<div id="root">' + rendered.appHtml + "</div>");
  const en = rendered.locale === "en";
  const tags = [
    ["name", "description", rendered.description],
    ["property", "og:title", title],
    ["property", "og:description", rendered.description],
    ["property", "og:url", canonical],
    ["property", "og:type", rendered.type],
    ["property", "og:image", rendered.image],
    ["property", "og:locale", en ? "en_US" : "zh_HK"],
    ["property", "og:locale:alternate", en ? "zh_HK" : "en_US"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", rendered.description],
    ["name", "twitter:image", rendered.image],
    ["name", "robots", rendered.notFound ? "noindex" : rendered.indexable ? "index,follow" : "noindex,follow"],
  ];
  for (const [attribute, name, value] of tags) html = meta(html, attribute, name, value);
  if (rendered.notFound) {
    // Vercel serves this static document for arbitrary missing paths. Avoid hydration
    // against the URL of a different (possibly different-language) request.
    return html.replace(/<script\s+type="module"[^>]*>[\s\S]*?<\/script>/gi, "");
  }
  const links = [
    '<link rel="canonical" href="' + escape(canonical) + '" />',
    ...getAlternateLinks(rendered.canonicalPath).map(([lang, href]) =>
      '<link rel="alternate" hreflang="' + lang + '" href="' + escape(href) + '" />'),
  ];
  const jsonLd = rendered.structuredData.map(item => '<script type="application/ld+json" data-geo-structured-data>' + JSON.stringify(item).replaceAll("<", "\\u003c") + "</script>");
  return html.replace("</head>", "    " + [...links, ...jsonLd].join("\n    ") + "\n  </head>");
}

const pages = new Map();
for (const pathname of ["/", ...new Set(exactPaths)]) {
  const rendered = await renderRoute(pathname);
  if (rendered.notFound) throw new Error("Unresolved allowlisted page: " + pathname);
  if (indexed.includes(pathname) && (!rendered.indexable || rendered.canonicalPath !== pathname)) {
    throw new Error("Invalid indexed route: " + pathname);
  }
  pages.set(pathname, rendered);
  const outputDir = path.join(clientDir, ...pathname.split("/").filter(Boolean));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), documentFor(rendered), "utf8");
}
await writeFile(path.join(clientDir, "404.html"), documentFor(await renderRoute("/zh-hk/not-found")), "utf8");
const entries = indexed.map(route => {
  const alternates = getAlternateLinks(route).map(([lang, href]) => '    <xhtml:link rel="alternate" hreflang="' + lang + '" href="' + escape(href) + '" />');
  return ["  <url>", "    <loc>" + escape(origin + route) + "</loc>", "    <lastmod>" + seoRevisionDate + "</lastmod>", ...alternates, "  </url>"].join("\n");
});
await writeFile(path.join(clientDir, "sitemap.xml"), ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', ...entries, "</urlset>", ""].join("\n"), "utf8");
await writeFile(path.join(clientDir, "llms-full.txt"), [
  "# HK MINIJUNGLE — public website summaries",
  "These bilingual summaries describe the published pages. Concept visualisations are not completed projects; CANVIVA DUO is coming soon, without a confirmed launch date or ordering.",
  ...indexed.map(route => {
    const page = pages.get(route);
    return "## " + page.title + "\n" + origin + route + "\n\n" + page.description;
  }),
  "",
].join("\n\n"), "utf8");
await rm(path.join(root, "dist", ".prerender"), { recursive: true, force: true });
console.log("Prerendered " + pages.size + " routes; generated 404, sitemap and llms-full.txt.");
