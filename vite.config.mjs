import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

// Vite's SPA fallback otherwise serves the home document for extensionless
// prerendered routes. Only rewrite the exact, publisher-controlled sitemap paths.
const previewRoutes = new Set(Array.from(
  readFileSync(new URL("./public/sitemap.xml", import.meta.url), "utf8")
    .matchAll(/<loc>https:\/\/hkminijungle\.com([^<]*)<\/loc>/g),
  (match) => match[1],
).filter((route) => route && route !== "/"));

const prerenderedPreview = {
  name: "prerendered-preview-routes",
  configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      const requestUrl = request.url || "/";
      const separator = requestUrl.indexOf("?");
      const pathname = separator < 0 ? requestUrl : requestUrl.slice(0, separator);
      if (["GET", "HEAD"].includes(request.method) && previewRoutes.has(pathname)) {
        const query = separator < 0 ? "" : requestUrl.slice(separator);
        request.url = `${pathname.replace(/\/$/, "")}/index.html${query}`;
      }
      next();
    });
  },
};

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "127.0.0.1",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), prerenderedPreview],
});
