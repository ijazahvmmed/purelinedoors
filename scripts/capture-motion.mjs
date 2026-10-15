import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const previewUrl = process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000";
await mkdir("docs/previews/motion", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: name === "mobile",
      isMobile: name === "mobile",
      recordVideo: { dir: "tmp/motion-video", size: { width, height } },
    });
    await context.addInitScript(() =>
      localStorage.setItem("pureline-consent", "essential"),
    );
    const page = await context.newPage();
    const video = page.video();
    await page.goto(previewUrl);
    await page.locator('.hero[data-revealed="true"]').waitFor();
    await page.waitForTimeout(500);
    if (name === "mobile") {
      await page.getByRole("button", { name: "Open menu" }).tap();
      await page.waitForTimeout(1300);
      await page.screenshot({ path: "docs/previews/mobile-menu.png" });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(650);
    } else {
      await page.getByRole("button", { name: "Show door collections" }).click();
      await page.waitForTimeout(650);
      await page.screenshot({
        path: "docs/previews/desktop-collections-menu.png",
      });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(250);
      const box = await page
        .locator(".hero-actions .button")
        .first()
        .boundingBox();
      await page.mouse.move(box.x + box.width - 16, box.y + box.height / 2);
      await page.waitForTimeout(650);
      await page.mouse.move(20, 150);
    }
    for (const selector of [
      ".collections",
      ".home-products",
      ".home-benefits",
      ".performance-primary",
      ".performance-primary h3",
      ".performance-secondary",
      ".engineering-chapter",
      ".applications-preview",
      ".manufacturing-teaser",
      ".home-faq",
      ".enquiry-banner",
    ]) {
      await page
        .locator(selector)
        .evaluate((el) =>
          el.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      await page.waitForTimeout(1800);
      if (selector === ".home-benefits") {
        const row = page
          .locator(".benefit-row")
          .nth(name === "desktop" ? 2 : 1)
          .locator("summary");
        if (name === "desktop") {
          await row.hover();
          await page.waitForTimeout(650);
          await page.locator(".benefit-row summary").nth(7).hover();
          await page.waitForTimeout(650);
        }
        if (name === "mobile") await row.tap(); else await row.click();
        await page.waitForTimeout(800);
        if (name === "mobile") await row.tap(); else await row.click();
        await page.waitForTimeout(300);
      }
      if (selector === ".home-faq") {
        if (name === "mobile") await page.locator(".home-faq-row summary").first().tap();
        else await page.locator(".home-faq-row summary").first().click();
        await page.waitForTimeout(800);
        if (name === "mobile") await page.locator(".home-faq-row summary").first().tap();
        else await page.locator(".home-faq-row summary").first().click();
        await page.waitForTimeout(450);
      }
    }
    await page.locator(".home-products").scrollIntoViewIfNeeded();
    const card = page.locator(".home-products .product-card").first();
    if (name === "desktop") {
      await card.hover();
      await page.waitForTimeout(700);
    }
    await card.getByRole("link", { name: "View Arch", exact: true }).click();
    await page.waitForTimeout(1350);
    await page
      .getByRole("button", { name: "Closer look", exact: true })
      .click();
    await page.waitForTimeout(1000);
    await page
      .getByRole("button", { name: "Full design", exact: true })
      .click();
    await page.waitForTimeout(1000);
    await context.close();
    await video.saveAs(`docs/previews/motion/${name}.webm`);
  }
} finally {
  await browser.close();
}
