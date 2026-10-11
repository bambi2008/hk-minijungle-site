import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../../../dist/server/index.js";

const port = 4177;
const artifactDir = dirname(fileURLToPath(import.meta.url));
const assetsRoot = resolve(artifactDir, "../../../dist/client");
const mimeTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
]);

function safeAssetPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, "");
  const candidate = resolve(assetsRoot, relative || "index.html");
  if (candidate !== assetsRoot && !candidate.startsWith(`${assetsRoot}${sep}`)) return null;
  return candidate;
}

async function assetResponse(request) {
  const url = new URL(request.url);
  let path = safeAssetPath(url.pathname);
  if (!path) return new Response("Not found", { status: 404 });

  try {
    const info = await stat(path);
    if (info.isDirectory()) path = resolve(path, "index.html");
    const body = await readFile(path);
    return new Response(request.method === "HEAD" ? null : body, {
      status: 200,
      headers: { "content-type": mimeTypes.get(extname(path).toLowerCase()) || "application/octet-stream" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

const server = createServer(async (incoming, outgoing) => {
  const origin = `http://${incoming.headers.host || `127.0.0.1:${port}`}`;
  const request = new Request(new URL(incoming.url || "/", origin), {
    method: incoming.method,
    headers: incoming.headers,
  });
  const response = await worker.fetch(request, { ASSETS: { fetch: assetResponse } });
  outgoing.statusCode = response.status;
  response.headers.forEach((value, key) => outgoing.setHeader(key, value));
  outgoing.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Worker preview listening on http://127.0.0.1:${port}`);
});
