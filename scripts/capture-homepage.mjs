import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const previewUrl=process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000";
await mkdir("docs/previews/homepage",{recursive:true});
const browser=await chromium.launch({channel:"msedge"});
try {
  for(const width of [1440,1920,768,390]) {
    const context=await browser.newContext({viewport:{width,height:1000},isMobile:width===390,hasTouch:width===390});
    await context.addInitScript(()=>localStorage.setItem("pureline-consent","essential"));
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    await page.goto(previewUrl);
    await page.locator(".hero[data-revealed=true]").waitFor();
    await page.locator("img").evaluateAll(images=>images.forEach(img=>img.loading="eager"));
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
    for(const [name,selector] of [["hero",".hero"],["introduction",".brand-introduction"],["collections",".collections"],["entrance",".entrance-experience"],["benefits",".home-benefits"],["performance",".performance-chapter"],["quality",".home-quality"],["applications",".applications-preview"],["faq",".home-faq"],["enquiry",".enquiry-banner"]]) {
      if(name!=="hero") await page.locator(selector).evaluate(el=>el.scrollIntoView({behavior:"instant",block:"start"}));
      await page.waitForTimeout(1350);
      if(name==="benefits") {
        const row=page.locator(".benefit-row summary").nth(1);
        if(width>1000) await row.hover(); else await row.click();
        await page.waitForTimeout(650);
      }
      if(name==="faq") {await page.locator(".home-faq-row summary").first().click();await page.waitForTimeout(650);}
      await page.screenshot({path:`docs/previews/homepage/${name}-${width}.png`});
    }
    await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
    await page.waitForTimeout(550);
    await page.screenshot({path:`docs/previews/homepage/full-${width}.png`,fullPage:true});
    if(errors.length) throw new Error(errors.join("\n"));
    await context.close();
  }
  console.log("Homepage review captures saved at 390, 768, 1440 and 1920px.");
} finally {await browser.close();}
