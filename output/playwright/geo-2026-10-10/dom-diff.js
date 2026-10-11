async (page) => {
  const context = page.context();
  const ssr = await context.newPage();
  await ssr.route("**/*.js", (route) => route.abort());
  await ssr.goto("http://127.0.0.1:4176/zh-hk/contact");

  const client = await context.newPage();
  await client.goto("http://127.0.0.1:4175/zh-hk/contact");
  await client.waitForSelector("h1");

  const read = async (target) => target.locator("#root").evaluate((root) => {
    const copy = root.cloneNode(true);
    copy.querySelectorAll("link[rel=preload]").forEach((node) => node.remove());
    return copy.innerHTML;
  });

  const server = await read(ssr);
  const browser = await read(client);
  let firstDifference = 0;
  while (
    firstDifference < server.length
    && firstDifference < browser.length
    && server[firstDifference] === browser[firstDifference]
  ) firstDifference += 1;

  return {
    equal: server === browser,
    serverLength: server.length,
    browserLength: browser.length,
    firstDifference,
    server: server.slice(Math.max(0, firstDifference - 180), firstDifference + 420),
    browser: browser.slice(Math.max(0, firstDifference - 180), firstDifference + 420),
  };
}
