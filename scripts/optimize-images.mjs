import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Use an installed sharp, or the existing bundled package via IMAGE_TOOLS_MODULES.
const require = createRequire(import.meta.url);
const sharp = require(process.env.IMAGE_TOOLS_MODULES ? path.join(process.env.IMAGE_TOOLS_MODULES, "sharp") : "sharp");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = {};
let originalBytes = 0;
let largestBytes = 0;
async function visit(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) {
      if (directory !== path.join(root, "public/images") || ["plant-designs", "canviva-duo", "scenes"].includes(item.name)) await visit(file);
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(item.name) || /logo/i.test(item.name)) continue;
    const bytes = await readFile(file);
    const meta = await sharp(bytes).metadata();
    const src = `/${path.relative(path.join(root, "public"), file).split(path.sep).join("/")}`;
    const hash = createHash("sha256").update(bytes).update("webp-82-v1").digest("hex").slice(0, 12);
    const name = path.parse(item.name).name;
    const variants = [];
    for (const width of [...new Set([480, 960, 1600].map(w => Math.min(w, meta.width)))]) {
      const url = `/images/optimized/${name}-${hash}-${width}.webp`;
      const output = await sharp(bytes).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer({ resolveWithObject: true });
      await writeFile(path.join(root, "public", url), output.data);
      variants.push({ src: url, width: output.info.width, height: output.info.height, bytes: output.data.length });
    }
    manifest[src] = { width: meta.width, height: meta.height, originalBytes: bytes.length, variants };
    originalBytes += bytes.length;
    largestBytes += variants.at(-1).bytes;
  }
}
await mkdir(path.join(root, "public/images/optimized"), { recursive: true });
await visit(path.join(root, "public/images"));
await writeFile(path.join(root, "src/imageManifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ images: Object.keys(manifest).length, originalBytes, largestVariantBytes: largestBytes, reduction: 1 - largestBytes / originalBytes }));
