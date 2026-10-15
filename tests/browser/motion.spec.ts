import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pureline-consent", "essential"),
  );
});

test("mobile enquiry puts the selected door and form before supporting guidance", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/request-quote?product=arch", "/trade-projects"]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const form = await page.locator(".quote-form").boundingBox();
    const guidance = await page.locator(".quote-aside").boundingBox();
    expect(form!.y).toBeLessThan(guidance!.y);
    await expect(page.getByLabel("Full name")).toBeEditable();
    if (route.includes("product=")) {
      const selected = await page.locator(".quote-selected").boundingBox();
      expect(selected!.y).toBeLessThan(form!.y);
    }
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`${viewport.name}: real hero, text, image and grid animation progress`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".motion-root")).toHaveAttribute(
      "data-motion",
      "active",
    );
    await expect(page.locator(".hero h1 .motion-line")).not.toHaveCount(0);
    const initial = await page
      .locator(".hero-visual")
      .evaluate((el) => getComputedStyle(el).clipPath);
    await expect(page.locator(".hero")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    const final = await page
      .locator(".hero-visual")
      .evaluate((el) => getComputedStyle(el).clipPath);
    expect(initial).not.toBe(final);
    const start = await page
      .locator(".story-art .architecture-aperture")
      .evaluate((el) => getComputedStyle(el).clipPath);
    await page
      .locator(".story-art .architecture-aperture")
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator(".story-art .architecture-aperture"),
    ).toHaveAttribute("data-revealed", "true");
    expect(
      await page
        .locator(".story-art .architecture-aperture")
        .evaluate((el) => getComputedStyle(el).clipPath),
    ).not.toBe(start);
    await page.locator(".home-products").scrollIntoViewIfNeeded();
    await expect(page.locator(".home-products")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    for (const card of await page
      .locator(".home-products .product-card")
      .all()) {
      expect(
        await card.evaluate((el) => Number(getComputedStyle(el).opacity)),
      ).toBe(1);
    }
    await page.locator(".manufacturing-teaser").scrollIntoViewIfNeeded();
    await expect(
      page.locator(".manufacturing-teaser h2 .motion-word"),
    ).not.toHaveCount(0);
    await expect(page.locator(".manufacturing-teaser h2")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    const lines = await page.locator(".hero h1 .motion-line").count();
    await page.setViewportSize({
      width: viewport.width === 1440 ? 768 : 320,
      height: viewport.height,
    });
    await expect(page.locator(".hero h1 .motion-line")).not.toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow).toBe(false);
    expect(lines).toBeGreaterThan(0);
  });
}

test("desktop parallax, magnetic label, product hover and reversible gallery detail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute("data-revealed", "true");
  const assertPressFeedback = async (selector: string) => {
    const control = page.locator(selector);
    await control.scrollIntoViewIfNeeded();
    const bounds = (await control.boundingBox())!;
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await page.mouse.down();
    await expect
      .poll(() =>
        control.evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
        ),
      )
      .toBeLessThan(0.999);
    await page.mouse.move(2, 2);
    await page.mouse.up();
    await expect
      .poll(() =>
        control.evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
        ),
      )
      .toBe(1);
  };
  await assertPressFeedback(".header-quote");
  const before = await page
    .locator(".hero-parallax")
    .evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
    );
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator(".hero-parallax")
        .evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
        ),
    )
    .not.toBe(before);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const button = page.locator(".hero-actions .button").first();
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width - 15, box.y + box.height / 2);
  await expect
    .poll(() =>
      button
        .locator(".button-label")
        .evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
        ),
    )
    .toBeGreaterThan(1);
  await page.mouse.move(20, 130);
  await expect
    .poll(() =>
      button
        .locator(".button-label")
        .evaluate((el) =>
          Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41),
        ),
    )
    .toBeLessThan(0.05);
  await page.locator(".home-products").scrollIntoViewIfNeeded();
  await expect(page.locator(".home-products")).toHaveAttribute(
    "data-revealed",
    "true",
  );
  const card = page.locator(".home-products .product-card").first();
  await card.hover();
  await expect
    .poll(() =>
      card
        .locator(".product-hover-media")
        .evaluate(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
        ),
    )
    .toBeGreaterThan(1.02);
  await card.getByRole("link", { name: "View Arch", exact: true }).click();
  await expect(page).toHaveURL(/products\/arch/);
  const image = page.locator(".gallery-main > img");
  await page.getByRole("button", { name: "Closer look", exact: true }).click();
  await expect
    .poll(() =>
      image.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
      ),
    )
    .toBeGreaterThan(1.6);
  await page.getByRole("button", { name: "Full design", exact: true }).click();
  await expect
    .poll(() =>
      image.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m11,
      ),
    )
    .toBeLessThan(1.01);
  await assertPressFeedback(".pdp-copy > .button");
});

test("mobile menu choreography, focus containment and repeated interruption", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open menu", exact: true });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("data-phase", "entering");
  await expect(dialog).toHaveAttribute("data-phase", "open");
  expect(
    await dialog.locator(".wordmark-symbol").evaluate((el) => getComputedStyle(el).filter),
  ).toContain("invert(1)");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest(".menu-dialog") !== null,
    ),
  ).toBe(true);
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest(".menu-dialog") !== null,
    ),
  ).toBe(true);
  const axe = await new AxeBuilder({ page })
    .include(".menu-dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(axe.violations.map((v) => v.id)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("button", { name: "Close menu", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await open.click();
  await expect(dialog).toHaveAttribute("data-phase", "open");
  await dialog.getByRole("link", { name: "Our doors" }).click();
  await expect(page).toHaveURL(/\/doors$/);
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("reduced motion, runtime preference changes and no-JavaScript content stay usable", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".motion-root")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  await expect(page.locator(".motion-line")).toHaveCount(0);
  expect(
    await page
      .locator(".hero-visual")
      .evaluate((el) => getComputedStyle(el).clipPath),
  ).toBe("none");
  for (const card of await page.locator(".product-card").all())
    expect(await card.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("dialog", { name: "Site navigation" }),
  ).toHaveAttribute("data-phase", "open");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Site navigation" }),
  ).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".motion-root")).toHaveAttribute(
    "data-motion",
    "active",
  );
  await expect(page.locator(".motion-line")).not.toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".motion-root")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  await expect(page.locator(".motion-line")).toHaveCount(0);
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const staticPage = await plain.newPage();
  await staticPage.goto("/");
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    staticPage.getByRole("link", { name: "Explore our doors" }),
  ).toBeVisible();
  await expect(
    staticPage.getByRole("navigation", { name: "Full navigation" }),
  ).toBeVisible();
  expect(
    await staticPage
      .locator(".site-header")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(248, 248, 244)");
  await staticPage.locator(".home-benefits").scrollIntoViewIfNeeded();
  const staticRow = staticPage.locator(".benefit-row").nth(4);
  await staticRow.locator("summary").click();
  await expect(staticRow).toHaveAttribute("open", "");
  await staticPage.setViewportSize({ width: 390, height: 844 });
  await staticPage.goto("/");
  await expect(
    staticPage
      .getByRole("navigation", { name: "Full navigation" })
      .getByRole("link", { name: "Our doors", exact: true }),
  ).toBeVisible();
  await plain.close();
});

test("route and filter transitions clean up split markup and preserve SEO and navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "warning" && message.text().includes("GSAP"))
      errors.push(message.text());
  });
  await page.goto("/doors");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: "View Arch", exact: true }).click();
    await expect(page).toHaveURL(/products\/arch/);
    await expect(page.locator(".motion-root")).toHaveAttribute(
      "data-route",
      "/products/arch",
    );
    await expect(page.locator("h1 .motion-line")).toHaveCount(1);
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Our doors", exact: true })
      .click();
    await expect(page).toHaveURL(/\/doors$/);
    await expect(page.locator(".motion-root")).toHaveAttribute(
      "data-route",
      "/doors",
    );
  }
  await page.getByRole("textbox", { name: "Search door designs" }).fill("Arch");
  await expect(page.getByRole("status")).toContainText("2 designs");
  await page.locator(".product-grid").scrollIntoViewIfNeeded();
  await expect(page.locator(".product-grid")).toHaveAttribute(
    "data-revealed",
    "true",
  );
  const canonical = await page
    .locator('head link[rel="canonical"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(canonical.length).toBeGreaterThan(0);
  expect([...new Set(canonical)]).toEqual(["http://localhost:3000/doors"]);
  expect(errors).toEqual([]);
  await page.getByRole("link", { name: "View Arch", exact: true }).click();
  await page
    .getByRole("link", { name: "View Twin Vertical & W/Transom", exact: true })
    .click();
  await expect(page).toHaveURL(/products\/twin-vertical/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Twin Vertical & W/Transom",
  );
  expect(errors).toEqual([]);
});
