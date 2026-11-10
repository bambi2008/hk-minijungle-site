#!/usr/bin/env node
import assert from "node:assert/strict";

const origin = "https://hkminijungle.com";
const base = new URL(process.argv[2] || origin).origin;
const local = new URL(base).hostname === "127.0.0.1";
const agents = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];
const errors = [];
const checks = new Map();
function check(condition, message) {
  if (!condition) errors.push(String(message).replace(/[\u0000-\u001f\u007f-\u009f]/g,
    character => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0")));
}
async function read(url, options = {}) {
  return fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20000), ...options });
}
function meta(html, key, attribute = "name") {
  return [...html.matchAll(/<meta\s+[^>]*>/gi)].find(m => m[0].includes(attribute + '="' + key + '"'))?.[0].match(/content="([^"]*)"/)?.[1];
}
const unescape = text => (text || "").replace(/&(amp|quot|lt|gt|#x27|#39);/g, (_, key) => ({ amp: "&", quot: '"', lt: "<", gt: ">", "#x27": "'", "#39": "'" })[key]);
const schema = html => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const sitemapResponse = await read(base + "/sitemap.xml");
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
check(sitemapResponse.status === 200 && locations.length > 0 && new Set(locations).size === locations.length, "Sitemap must return unique URLs");
check((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === locations.length, "Sitemap lastmod count");
check((sitemap.match(/<xhtml:link /g) || []).length === 3 * locations.length, "Sitemap reciprocal language links");
const descriptions = new Set();
const shares = new Set();
let missingArticleDates = 0;
for (const location of locations) {
  const canonical = new URL(location);
  assert.equal(canonical.origin, origin);
  const route = canonical.pathname;
  const res = await read(base + route);
  const html = await res.text();
  const en = route.startsWith("/en");
  check(res.status === 200, route + " HTTP " + res.status);
  const description = unescape(meta(html, "description"));
  check([...description].length >= 70 && [...description].length <= 155, route + " description length: " + [...description].length);
  check(!descriptions.has(description), route + " duplicate description");
  descriptions.add(description);
  check(html.includes('rel="canonical" href="' + location + '"'), route + " canonical");
  const suffix = route.replace(/^\/(en|zh-hk)/, "");
  for (const [language, locale] of [["en", "en"], ["zh-Hant-HK", "zh-hk"], ["x-default", "zh-hk"]]) {
    check(html.includes('hreflang="' + language + '" href="' + origin + "/" + locale + suffix + '"'), route + " hreflang " + language);
    check(sitemap.includes('hreflang="' + language + '" href="' + origin + "/" + locale + suffix + '"'), route + " sitemap hreflang " + language);
  }
  const image = meta(html, "og:image", "property");
  check(image?.startsWith(origin + "/images/") && image === meta(html, "twitter:image"), route + " share image");
  if (image) shares.add(image);
  check(meta(html, "twitter:card") === "summary_large_image" && meta(html, "og:locale", "property") === (en ? "en_US" : "zh_HK") && meta(html, "og:locale:alternate", "property") === (en ? "zh_HK" : "en_US"), route + " share locale");
  const data = schema(html);
  if (suffix) check(data.some(x => x["@type"] === "BreadcrumbList" && x.itemListElement.length >= 2), route + " breadcrumbs");
  if (suffix.startsWith("/journal/")) {
    const article = data.find(x => x["@type"] === "Article");
    check(article?.headline && article.author?.name && article.image?.length, route + " article schema");
    if (!article?.datePublished || !article?.dateModified) missingArticleDates++;
  }
  if (suffix === "/products/canviva-one" || suffix === "/products/canviva-duo") check(data.some(x => x["@type"] === "Product"), route + " product schema");
  if (suffix === "/products/canviva") check(/<h1>CANVIVA (活體植物系統|Living Plant Systems)<\/h1>/.test(html), route + " family H1");
  if (suffix === "/solutions/hospitality-retail") check(/<h1>(購物商場活體植物牆|Living Plant Walls for Shopping Malls)<\/h1>/.test(html), route + " shopping mall H1");
  if (suffix === "/technology/xponge") check(html.includes(en ? 'data-source="/images/canviva-system-exploded-en.png"' : 'data-source="/images/canviva-system-exploded-concept.png"'), route + " diagram localization");
  if (suffix === "/solutions") {
    const slides = [...html.matchAll(/class="home-office-slide"[\s\S]*?<img\s+([^>]+)>/g)];
    check(slides.length === 28 && slides.every(m => m[1].includes('loading="lazy"')), route + " lazy gallery");
    check(html.includes("<picture>") && html.includes('srcSet=') && html.includes('fetchPriority="high"'), route + " responsive picture/hero priority");
    checks.set(route, html);
  }
}
check(shares.size > 10, "Sharing images must vary by page");
for (const path of ["/this-does-not-exist", "/en/nope", "/zh-hk/journal/zzz", "/en/about/nope"]) {
  const res = await read(base + path);
  check(res.status === 404 && meta(await res.text(), "robots") === "noindex", path + " true noindex 404");
}
for (const [from, to] of [["/", "/zh-hk"], ["/?source=seo-check", "/zh-hk?source=seo-check"], ["/en/", "/en"], ["/EN", "/en"], ["/En/SoLuTiOnS/index.html", "/en/solutions"], ["/index.html", "/zh-hk"], ["/EN?source=seo-check", "/en?source=seo-check"]]) {
  const res = await read(base + from, { method: "HEAD" });
  const location = res.headers.get("location");
  check(res.status === 301 && location && new URL(location, base).href === base + to, from + " expected 301 to " + to + "; got " + res.status + " " + location);
}
if (!local) {
  const www = await read("https://www.hkminijungle.com/", { method: "HEAD" });
  check(www.status === 301 && www.headers.get("location") === origin + "/zh-hk", "www homepage canonical redirect");
  const http = await read("http://hkminijungle.com/", { method: "HEAD" });
  // Vercel enforces HTTPS before application routing and currently emits 308.
  check([301, 308].includes(http.status) && http.headers.get("location") === origin + "/", "HTTP to HTTPS permanent redirect");
  console.log("Platform HTTPS upgrade: " + http.status);
}
const favicon = await read(base + "/favicon.ico");
const icon = Buffer.from(await favicon.arrayBuffer());
check(favicon.status === 200 && /image\/(x-icon|png)/i.test(favicon.headers.get("content-type") || "") && icon.length > 22 &&
  (icon.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0])) || icon.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"), "Real favicon and MIME");
const robots = await read(base + "/robots.txt");
const policy = await robots.text();
check(robots.status === 200 && policy.includes("User-agent: *") && agents.every(agent => policy.includes("User-agent: " + agent)) && !/^Disallow:\s*\//mi.test(policy) && policy.includes("Sitemap: " + origin + "/sitemap.xml"), "Crawler policy");
const llms = await read(base + "/llms-full.txt");
const summary = await llms.text();
check(llms.status === 200 && llms.headers.get("content-type")?.startsWith("text/plain") && locations.every(url => summary.includes(url)), "LLM summaries and MIME");
for (const [route, html] of checks) {
  const bundles = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(m => m[1]))];
  const hero = html.match(/<picture><source type="image\/webp" srcSet="([^"]+)"/)?.[1].split(", ").at(-1)?.split(" ")[0];
  let bytes = Buffer.byteLength(html);
  for (const asset of [...bundles, ...(hero ? [hero] : [])]) {
    const expectedPath = /^\/(?:assets\/[a-zA-Z0-9._-]+\.(?:js|css)|images\/optimized\/[a-zA-Z0-9_-]+\.webp)$/.test(asset);
    check(expectedPath, route + " unexpected asset path " + asset);
    if (!expectedPath) continue;
    const assetUrl = new URL(asset, base);
    check(assetUrl.origin === base, route + " unexpected asset origin " + asset);
    if (assetUrl.origin !== base) continue;
    const res = await read(assetUrl.href);
    const body = await res.arrayBuffer();
    bytes += body.byteLength;
    check(res.ok && body.byteLength > 0, route + " missing asset " + asset);
    if (!local) check(["public", "max-age=31536000", "immutable"].every(token => res.headers.get("cache-control")?.includes(token)), asset + " immutable cache");
  }
  check(!!hero && bytes < 1500000, route + " entry bundle + hero budget: " + bytes + " bytes");
  console.log(route + ": " + bytes + " bytes (HTML + entry JS/CSS + largest hero WebP; not browser transfer timing)");
}
console.log("Pages: " + locations.length + "; unique descriptions: " + descriptions.size + "; article pages without verified dates: " + missingArticleDates);
console.log("External Google Rich Results and real-browser transfer measurements require separate verification.");
if (errors.length) {
  console.error(errors.map(error => "FAIL: " + error).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Automated SEO checks passed for " + base + (local ? " (production host/cache headers skipped)." : "."));
}
