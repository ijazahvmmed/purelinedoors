import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("pureline-consent", "essential"));
});

test("benefit previews crossfade, follow the selected row and never obscure its title or notes", async ({page}) => {
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({width, height:1000});
    await page.goto("/");
    const first = page.locator(".benefit-row").first();
    await first.locator("summary").focus();
    await expect(first.locator("summary")).toBeFocused();
    await expect(first).toHaveCSS("clip-path", "none");
    await page.locator(".home-benefits").scrollIntoViewIfNeeded();
    const benefits=page.locator(".benefits-browser");
    await expect(benefits).toHaveAttribute("data-revealed", "true");
    await expect(benefits).toHaveAttribute("data-ready", "true");
    await expect(page.locator(".benefit-row")).toHaveCount(8);
    for (const index of [1, 2, 7, 4, 0]) {
      const row=page.locator(".benefit-row").nth(index);
      await row.locator("summary").hover();
      await expect(benefits).toHaveAttribute("data-selected", String(index));
      const frame=page.locator(`.benefit-preview-frame[data-preview="${index}"]`);
      await expect.poll(()=>frame.evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
      const bounds=(await frame.boundingBox())!;
      const title=(await row.locator(".benefit-title").boundingBox())!;
      const notes=(await row.locator(".benefit-notes").boundingBox())!;
      // The title's padded reserve belongs to the preview; its actual text stays clear.
      const textEnd=await row.locator(".benefit-title").evaluate(el=>{
        const range=document.createRange();range.selectNodeContents(el);return Math.max(...[...range.getClientRects()].map(r=>r.right));
      });
      expect(textEnd).toBeLessThan(bounds.x);
      expect(bounds.x+bounds.width).toBeLessThan(notes.x);
      expect(bounds.y).toBeLessThan(title.y+title.height);
      const other=await page.locator(".benefit-preview-frame").evaluateAll((frames,index)=>frames.filter((_,i)=>i!==index).map(el=>Number(getComputedStyle(el).opacity)),index);
      expect(other.every(opacity=>opacity===0)).toBe(true);
    }
    const security=page.locator(".benefit-row").nth(4);
    await security.locator("summary").focus();
    await expect(benefits).toHaveAttribute("data-selected", "4");
    await page.keyboard.press("Enter");
    await expect(security).toHaveAttribute("data-phase", "idle");
    await expect(security.locator(".text-link")).toBeVisible();
    await page.keyboard.press("Space");
    await expect(security).not.toHaveAttribute("open", "");
    const violations=(await new AxeBuilder({page}).include(".home-benefits").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations;
    expect(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});

test("tablet and touch benefits expose inline imagery; FAQ interruption and reduced-motion changes settle correctly", async ({page}) => {
  for(const width of [768,390,320]) {
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    await expect(page.locator(".benefit-floating-preview")).toBeHidden();
    for(const index of [1,7]) {
      const row=page.locator(".benefit-row").nth(index);
      await row.locator("summary").click();
      await expect(row).toHaveAttribute("data-phase","idle");
      await expect(row.locator(".benefit-inline-image")).toBeVisible();
      await expect(row.locator("img")).toHaveAttribute("alt", /catalogue/);
      await row.locator("summary").click();
      await expect(row).not.toHaveAttribute("open", "");
    }
    const faq=page.locator(".home-faq-row").first();
    await faq.locator("summary").click();
    await expect(faq).toHaveAttribute("data-phase","opening");
    await faq.locator("summary").click();
    await expect(faq).toHaveAttribute("data-phase","closing");
    await faq.locator("summary").click();
    await page.emulateMedia({reducedMotion:"reduce"});
    await expect(faq).toHaveAttribute("data-phase","idle");
    await expect(faq.locator(".home-disclosure-body")).toHaveCSS("height", /px$/);
    await expect(faq).toHaveAttribute("open", "");
    await expect(faq.locator("p")).toContainText("glass reinforced plastic");
    await faq.locator("summary").focus();
    await page.keyboard.press("Space");
    await expect(faq).not.toHaveAttribute("open", "");
    await expect(page.locator(".motion-line")).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.emulateMedia({reducedMotion:"no-preference"});
  }
});

test("all benefit explanations and FAQs remain usable without JavaScript", async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try {
    const page=await context.newPage();
    for (const width of [1440,390]) {
    await page.setViewportSize({width,height:844});
    await page.goto(process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000");
    const row=page.locator(".benefit-row").nth(7);
    await row.locator("summary").click();
    await expect(row).toHaveAttribute("open", "");
    await expect(row.locator(".benefit-inline-image")).toBeVisible();
    await expect(row).toContainText("no range-wide fire claim");
    const faq=page.locator(".home-faq-row").first();
    await faq.locator("summary").click();
    await expect(faq.locator("p")).toBeVisible();
    await expect(page.getByRole("navigation",{name:"Full navigation"})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    }
  } finally {await context.close();}
});
