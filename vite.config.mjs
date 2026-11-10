import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Match production's exact route allowlist without Vite's general SPA fallback.
const hosting = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const previewRoutes = new Map(hosting.rewrites.map(rule => [rule.source, rule.destination]));
const clientRoot = fileURLToPath(new URL("./dist/client", import.meta.url));

const prerenderedPreview = {
  name: "prerendered-preview-routes",
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (!["GET", "HEAD"].includes(request.method)) return next();
      const requestUrl = request.url || "/";
      const separator = requestUrl.indexOf("?");
      const pathname = separator < 0 ? requestUrl : requestUrl.slice(0, separator);
      const query = separator < 0 ? "" : requestUrl.slice(separator);
      if (pathname === "/" || /^\/index\.html\/?$/i.test(pathname)) {
        response.writeHead(301, { Location: "/zh-hk" + query });
        return response.end();
      }
      const normalized = pathname.toLowerCase().replace(/\/index\.html\/?$|\/$/g, "") || "/";
      if (pathname !== normalized && (previewRoutes.has(normalized) || /^\/index\.html\/?$/i.test(pathname))) {
        response.writeHead(301, { Location: normalized + query });
        return response.end();
      }
      if (previewRoutes.has(pathname)) {
        request.url = previewRoutes.get(pathname) + query;
        return next();
      }
      // Treat encoded traversal, Windows separators and malformed escapes as misses.
      let decoded;
      try { decoded = decodeURIComponent(pathname); } catch { decoded = ""; }
      if (/^\/(?!\/)/.test(decoded) && !/[\\:\u0000]/.test(decoded) && !decoded.split("/").some(part => part === "." || part === "..")) {
        const file = resolve(clientRoot, "." + decoded);
        if (file.startsWith(clientRoot + sep) && statSync(file, { throwIfNoEntry: false })?.isFile()) {
          if (pathname === "/favicon.ico") response.setHeader("Content-Type", "image/x-icon");
          if (pathname === "/llms-full.txt") response.setHeader("Content-Type", "text/plain; charset=utf-8");
          return next();
        }
      }
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : readFileSync(resolve(clientRoot, "404.html")));
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
