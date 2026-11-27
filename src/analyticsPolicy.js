const publicPaths = new Set(["", "contact", "about", "privacy", "terms", "products", "products/canviva", "products/canviva-one", "products/canviva-duo", "solutions", "solutions/workplace", "solutions/hospitality-retail", "solutions/property-fm", "technology/xponge", "technology/proof", "esg", "journal", "journal/why-hk-minijungle", "journal/compact-hong-kong-workplaces", "journal/inside-xponge", "journal/low-interruption-care", "journal/prototype-to-place", "journal/founding-pilot-programme"]);

// Track only known site routes. URL parameters and fragments may contain PII.
export function safeAnalyticsUrl(value) {
  try {
    const url = new URL(value, "https://hkminijungle.com");
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    if (!["hkminijungle.com", "www.hkminijungle.com", "127.0.0.1", "localhost"].includes(url.hostname)) return null;
    const [, locale, ...parts] = url.pathname.split("/");
    if (!["en", "zh-hk"].includes(locale) || !publicPaths.has(parts.join("/"))) return null;
    return `${url.origin}${url.pathname}`;
  } catch { return null; }
}
