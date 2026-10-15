import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const previewUrl = process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000";
await mkdir("docs/previews/creative", {recursive:true});
const browser = await chromium.launch({channel:"msedge"});
try {
  for (const width of [1440,768,390]) {
    const page = await browser.newPage({viewport:{width,height:1000}});
    await page.addInitScript(()=>localStorage.setItem("pureline-consent","essential"));
    await page.goto(previewUrl);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator(".hero[data-revealed=true]").waitFor();
    for (const [name,selector] of [["hero",".hero"],["collections",".collections"],["performance",".performance-chapter"],["engineering",".engineering-chapter"],["applications",".applications-preview"]]) {
      await page.locator(selector).evaluate(el=>el.scrollIntoView({block:"start",behavior:"instant"}));
      await page.waitForTimeout(1500);
      await page.screenshot({path:`docs/previews/creative/${name}-${width}.png`});
    }
    await page.close();
  }
} finally {await browser.close();}
