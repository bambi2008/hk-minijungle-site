async (page) => {
  const checks = [
    ["DE 德國 100", 100], ["US 美國 101", 101], ["HK 香港 100", 100],
    ["CN 中國大陸 101", 101], ["UK 英國 100", 100], ["FR 法國 101", 101],
  ];
  const results = [];
  for (const [name, expected] of checks) {
    const button = page.getByRole("button", { name, exact: true });
    await button.click();
    await page.waitForFunction(expected => document.querySelector(".plant-results-toolbar strong")?.textContent.trim() === String(expected), expected);
    const cards = await page.locator(".plant-card").count();
    if (cards !== 48 || await button.getAttribute("aria-pressed") !== "true") throw new Error("Region UI mismatch " + name);
    results.push({ region: name, results: expected, renderedCards: cards });
  }
  await page.getByRole("button", { name: "HK 香港 100", exact: true }).click();
  await page.waitForFunction(() => document.querySelector(".plant-results-toolbar strong")?.textContent.trim() === "100");
  await page.locator(".plant-results-toolbar").scrollIntoViewIfNeeded();
  return { checks: results, hongKongTitles: (await page.locator(".plant-card h2").allTextContents()).slice(0, 8) };
}
