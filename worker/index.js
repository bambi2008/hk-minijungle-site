export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const requestUrl = new URL(request.url);
    const acceptsHtml = request.headers.get("accept")?.split(",").some((value) => {
      const [mediaType, ...parameters] = value.split(";");
      const quality = parameters.find((parameter) => parameter.trim().toLowerCase().startsWith("q="))?.split("=")[1]?.trim();
      return mediaType.trim().toLowerCase() === "text/html" && quality !== "0";
    });
    const isApiPath = requestUrl.pathname === "/api" || requestUrl.pathname.startsWith("/api/");

    if (response.status !== 404 || !acceptsHtml || isApiPath || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = requestUrl;
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
