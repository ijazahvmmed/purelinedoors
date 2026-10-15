import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const previewUrl = process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000";
await mkdir("docs/previews", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const [name, width, height, route] of [
    ["home-desktop", 1440, 1000, "/"],
    ["home-mobile", 390, 844, "/"],
    ["product-desktop", 1440, 1000, "/products/arch"],
    ["product-mobile", 390, 844, "/products/arch"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() =>
      localStorage.setItem("pureline-consent", "essential"),
    );
    await page.goto(`${previewUrl}${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('.motion-root[data-motion="active"]');
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.forEach((image) => (image.loading = "eager")),
      );
    await page.waitForFunction(
      () => [...document.images].every((img) => img.complete),
      {},
      { timeout: 20000 },
    );
    for (
      let y = 0;
      y < (await page.evaluate(() => document.body.scrollHeight));
      y += 600
    ) {
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: "instant" }),
        y,
      );
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `docs/previews/${name}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `docs/previews/${name}-top.png` });
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      );
    if (broken.length) throw new Error(`Broken images: ${broken.join(", ")}`);
    await page.close();
  }
} finally {
  await browser.close();
}
