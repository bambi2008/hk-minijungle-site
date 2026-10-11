#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", ".prerender", "entry-server.js");
const template = await readFile(path.join(clientDir, "index.html"), "utf8");
const sitemap = await readFile(path.join(root, "public", "sitemap.xml"), "utf8");
const { renderRoute } = await import(pathToFileURL(serverEntry));
const routes = ["/", ...Array.from(sitemap.matchAll(/<loc>https:\/\/hkminijungle\.com([^<]*)<\/loc>/g), (match) => match[1] || "/")];

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, value, tag) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${value}["'][^>]*>`, "i");
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function alternatePath(canonicalPath, locale) {
  const segments = canonicalPath.split("/").filter(Boolean);
  if (segments[0] === "en" || segments[0] === "zh-hk") segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}`;
}

for (const pathname of [...new Set(routes)]) {
  const rendered = await renderRoute(pathname);
  const fullTitle = `${rendered.title} | HK MINIJUNGLE`;
  const canonicalUrl = `https://hkminijungle.com${rendered.canonicalPath}`;
  const jsonLd = rendered.structuredData.map((item) => `    <script type="application/ld+json" data-geo-structured-data>${JSON.stringify(item).replaceAll("<", "\\u003c")}</script>`).join("\n");
  let html = template
    .replace(/<html\s+lang=["'][^"']+["']>/i, `<html lang="${rendered.locale === "en" ? "en" : "zh-Hant-HK"}">`)
    .replace(/<title>[^<]*<\/title>/i, `<title>${fullTitle}</title>`)
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .replace('<div id="root"></div>', `<div id="root">${rendered.appHtml}</div>`);
  html = replaceMeta(html, "name", "description", `<meta name="description" content="${escapeAttribute(rendered.description)}" />`);
  html = replaceMeta(html, "property", "og:title", `<meta property="og:title" content="${escapeAttribute(fullTitle)}" />`);
  html = html.replace("</head>", `    <meta property="og:description" content="${escapeAttribute(rendered.description)}" />\n    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeAttribute(fullTitle)}" />\n    <meta name="twitter:description" content="${escapeAttribute(rendered.description)}" />\n    <meta name="robots" content="${rendered.indexable ? "index,follow" : "noindex,follow"}" />\n    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />\n    <link rel="alternate" hreflang="en" href="https://hkminijungle.com${alternatePath(rendered.canonicalPath, "en")}" />\n    <link rel="alternate" hreflang="zh-Hant-HK" href="https://hkminijungle.com${alternatePath(rendered.canonicalPath, "zh-hk")}" />\n${jsonLd}\n  </head>`);
  const outputDir = pathname === "/" ? clientDir : path.join(clientDir, ...pathname.split("/").filter(Boolean));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html, "utf8");
}

await rm(path.join(root, "dist", ".prerender"), { recursive: true, force: true });
console.log(`Prerendered ${new Set(routes).size} routes with route-specific metadata and structured data.`);
