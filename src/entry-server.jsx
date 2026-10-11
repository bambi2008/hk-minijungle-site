import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { resolveRoute, RouteView } from "./App.jsx";
import { getStructuredData } from "./seo.js";

function renderApp(element) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = "";
    output.setEncoding("utf8");
    output.on("data", (chunk) => { html += chunk; });
    output.on("end", () => resolve(html));
    output.on("error", reject);
    const stream = renderToPipeableStream(element, {
      onAllReady() { stream.pipe(output); },
      onShellError: reject,
      onError(error) { console.error(error); },
    });
  });
}

export async function renderRoute(pathname) {
  const route = resolveRoute(pathname);
  return {
    appHtml: await renderApp(<RouteView pathname={pathname} />),
    locale: route.locale,
    title: route.title,
    description: route.description,
    canonicalPath: route.canonicalPath,
    indexable: route.indexable,
    structuredData: getStructuredData(pathname),
  };
}
