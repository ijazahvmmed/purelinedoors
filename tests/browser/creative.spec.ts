import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pureline-consent", "essential"),
  );
});

test("reference hero keeps its image framing, navigation contrast state and specification controls usable", async ({
  page,
}) => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".hero")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    const hero = (await page.locator(".hero").boundingBox())!;
    const photo = (await page.locator(".hero-visual").boundingBox())!;
    await expect(page.locator(".hero-parallax img")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
    await expect(page.locator(".hero-parallax img")).toHaveAttribute(
      "loading",
      "eager",
    );
    expect(
      await page
        .locator(".hero-parallax img")
        .evaluate((el: HTMLImageElement) => el.currentSrc),
    ).toContain(
      width <= 760
        ? "forest-residence-mobile"
        : "forest-residence-",
    );
    const title = (await page.locator(".hero h1").boundingBox())!;
    expect(photo.height).toBeGreaterThanOrEqual(hero.height - 1);
    expect(title.y + title.height).toBeLessThanOrEqual(photo.y + photo.height);
    const actions = (await page.locator(".hero-actions").boundingBox())!;
    expect(actions.y + actions.height).toBeLessThanOrEqual(
      photo.y + photo.height - 40,
    );
    await expect(page.locator(".site-header")).toHaveAttribute(
      "data-surface",
      "photo",
    );
    const symbol = page.locator(".site-header .wordmark-symbol");
    await expect(symbol).toHaveAttribute("src", /pureline-symbol/);
    await expect(symbol).toHaveAttribute("alt", "");
    expect(await symbol.evaluate((el) => getComputedStyle(el).filter)).toContain("invert(1)");
    const logoBounds = (await page.locator(".site-header .wordmark").boundingBox())!;
    const quoteBounds = (await page.locator(".header-quote").boundingBox())!;
    expect(logoBounds.x + logoBounds.width).toBeLessThanOrEqual(quoteBounds.x);
    await expect(page.locator(".hero-brand")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      await page
        .locator(".hero-brand")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    if (width === 1440) {
      const toggle = page.getByRole("button", {
        name: "Show door collections",
      });
      await toggle.click();
      await expect(page.locator(".collection-dropdown")).toHaveAttribute(
        "data-phase",
        "open",
      );
      await expect(
        page
          .getByRole("navigation", { name: "Door collections" })
          .getByRole("link"),
      ).toHaveCount(7);
      await page
        .getByRole("navigation", { name: "Door collections" })
        .getByRole("link")
        .first()
        .focus();
      await page.keyboard.press("Escape");
      await expect(page.locator(".collection-dropdown")).toHaveAttribute(
        "data-phase",
        "closed",
      );
      await expect(toggle).toBeFocused();
    }
    await page.locator(".home-benefits").scrollIntoViewIfNeeded();
    await expect(page.locator(".site-header")).toHaveAttribute(
      "data-surface",
      "paper",
    );
    expect(await symbol.evaluate((el) => getComputedStyle(el).filter)).toBe("none");
    await expect.poll(async () => (await page.locator(".site-header").boundingBox())!.y).toBeLessThan(1);
    const security = page.locator(".benefit-row").nth(4);
    await security.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(security).toHaveAttribute("open", "");
    await expect(security.locator(".benefit-expanded .text-link")).toBeVisible();
    await expect(security).toHaveAttribute("data-phase", "idle");
    await page.keyboard.press("Space");
    await expect(security).not.toHaveAttribute("open", "");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
});

test("Satoshi and local, credited architecture accompany the complete catalogue", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".hero")).toHaveAttribute("data-revealed", "true");
  const font = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font.toLowerCase()).toContain("satoshi");
  await expect(page.locator(".collection-plate")).toHaveCount(7);
  const links = await page
    .locator(".collection-plate")
    .evaluateAll((elements) => elements.map((el) => el.getAttribute("href")));
  expect(links).toContain("/doors/bathroom-specialist");
  expect(links).toContain("/doors/grp-doors-frames");
  await page.locator(".engineering-chapter").scrollIntoViewIfNeeded();
  await expect(page.locator(".technical-register")).toContainText(
    "ENM 4 Panel",
  );
  await expect(page.locator(".technical-note")).toContainText(
    "applicability to this model requires confirmation",
  );
  await page
    .locator("img")
    .evaluateAll((images) =>
      images.forEach((img) => ((img as HTMLImageElement).loading = "eager")),
    );
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  );
  const architecture = await page.locator(".architecture-photo").all();
  expect(architecture.length).toBeGreaterThanOrEqual(3);
  for (const photo of architecture) {
    const bounds = await photo.locator("img").boundingBox();
    expect(bounds!.width).toBeGreaterThan(200);
    expect(bounds!.height).toBeGreaterThan(200);
    await expect(photo.locator("figcaption")).toContainText("Pexels");
    await expect(photo.locator("img")).toHaveAttribute(
      "alt",
      /not a Pureline installation/,
    );
    expect(
      await photo
        .locator("img")
        .evaluate((img: HTMLImageElement) => new URL(img.currentSrc).origin),
    ).toBe(new URL(page.url()).origin);
  }
});

test("feature stories coordinate masked images, typeset lines and readable copy on desktop and mobile", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator(".motion-root")).toHaveAttribute(
      "data-motion",
      "active",
    );
    const story = page.locator(".performance-primary");
    const image = story.locator(".architecture-aperture");
    const initial = await image.evaluate((el) => getComputedStyle(el).clipPath);
    await story.scrollIntoViewIfNeeded();
    await expect(story).toHaveAttribute("data-revealed", "true");
    expect(
      await image.evaluate((el) => getComputedStyle(el).clipPath),
    ).not.toBe(initial);
    await expect(story.locator("h3 .motion-line")).not.toHaveCount(0);
    await story.locator("h3").scrollIntoViewIfNeeded();
    await expect(story.locator("h3")).toHaveAttribute("data-revealed", "true");
    await expect
      .poll(() =>
        story
          .locator(".feature-copy > p:not(.eyebrow)")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await page.locator(".performance-secondary").scrollIntoViewIfNeeded();
    await expect(page.locator(".performance-secondary")).toHaveAttribute(
      "data-revealed",
      "true",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(story.locator(".motion-line")).toHaveCount(0);
    expect(await image.evaluate((el) => getComputedStyle(el).clipPath)).toBe(
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
});
