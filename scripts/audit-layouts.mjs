import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const previewUrl = process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/doors",
  "/doors/exterior-grp",
  "/doors/enm-metal",
  "/doors/smooth",
  "/doors/sight-glass-balcony",
  "/doors/bathroom-specialist",
  "/doors/grp-doors-frames",
  "/doors/abs",
  "/products/arch",
  "/accessories",
  "/why-pureline",
  "/manufacturing-quality",
  "/applications",
  "/trade-projects",
  "/about",
  "/resources",
  "/request-quote",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
];
const capture = new Set([
  "/doors",
  "/manufacturing-quality",
  "/request-quote",
  "/resources",
  "/applications",
  "/about",
]);
await mkdir("docs/previews/interior", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  await context.addInitScript(() =>
    localStorage.setItem("pureline-consent", "essential"),
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    for (const route of routes) {
      const response = await page.goto(previewUrl + route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForSelector('.motion-root[data-motion="reduced"]');
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        h1: document.querySelectorAll("main h1").length,
        title: document.title,
      }));
      results.push({ width, route, status: response.status(), ...layout });
      if (layout.overflow || layout.h1 !== 1 || response.status() !== 200)
        throw new Error(
          "Layout audit failed: " + JSON.stringify(results.at(-1)),
        );
      if (capture.has(route) && [390, 1440].includes(width))
        await page.screenshot({
          path:
            "docs/previews/interior/" + route.slice(1) + "-" + width + ".png",
        });
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  await writeFile(
    "docs/layout-audit.json",
    JSON.stringify(
      {
        mode: "Reduced-motion static layout inspection; normal animation verified separately in browser tests",
        browser: "Microsoft Edge",
        routes: routes.length,
        widths: [320, 390, 768, 1024, 1440],
        results,
        errors,
      },
      null,
      2,
    ),
  );
  console.log("110 route/viewport checks pass; 12 interior screenshots saved.");
} finally {
  await browser.close();
}
