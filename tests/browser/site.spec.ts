import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("pureline-consent", "essential"),
  );
});
test("catalogue search, empty state and product-to-enquiry context", async ({
  page,
}) => {
  await page.goto("/doors");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find your",
  );
  await page.getByRole("textbox", { name: "Search door designs" }).fill("arch");
  await expect(page.getByRole("status")).toContainText("2 designs");
  await page.getByRole("link", { name: "View Arch", exact: true }).click();
  await expect(page).toHaveURL(/products\/arch/);
  await expect(
    page.getByRole("heading", { name: "Arch", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Page 10", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Enlarge door image" }).click();
  await expect(
    page.getByRole("dialog", { name: "Arch enlarged design" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("link", { name: "Request a quote for this door", exact: true })
    .click();
  await expect(page).toHaveURL(/request-quote\?product=arch/);
  await expect(page.getByText("Your selected design")).toBeVisible();
  await page.goto("/doors?q=no-such-design");
  await expect(
    page.getByRole("heading", { name: "A different way in." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .last()
    .click();
  await expect(page.getByRole("status")).toContainText("12 designs");
});
test("quote form preserves input and honestly reports disabled delivery", async ({
  page,
}) => {
  await page.goto("/request-quote?product=arch");
  await page.getByLabel("Full name").fill("Preview Test");
  await page.getByLabel("Email address").fill("preview@example.com");
  await page.getByLabel("UK postcode").fill("SW1A 1AA");
  await page
    .getByLabel("Tell us about your project")
    .fill("A test enquiry for one door, not a real sales request.");
  await page.getByRole("checkbox").check();
  const requestPromise = page.waitForRequest((r) =>
    r.url().endsWith("/api/enquiries"),
  );
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  const request = await requestPromise;
  expect(request.postDataJSON()).toMatchObject({
    productId: "arch",
    sourcePage: "/request-quote",
    privacyConsent: true,
  });
  await expect(page.locator(".form-error")).toContainText("not yet available");
  await expect(page.getByLabel("Full name")).toHaveValue("Preview Test");
  await page
    .getByRole("radio", { name: "A trade / building project", exact: true })
    .check();
  await expect(page.getByLabel("Company")).toHaveAttribute("required", "");
  await expect(page.getByLabel("Approximate quantity")).toHaveAttribute(
    "required",
    "",
  );
});
test("mobile menu, escape and responsive layouts at 320, 390 and 1440", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/doors",
      "/products/arch",
      "/request-quote",
      "/manufacturing-quality",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      expect(overflow, `${width} ${route}`).toBe(false);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Open menu" });
  await button.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await button.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation", exact: true })
    .getByRole("link", { name: "Our doors" })
    .click();
  await expect(page).toHaveURL(/\/doors$/);
});
test("consent choices and no third-party requests before analytics approval", async ({
  page,
}) => {
  const outbound: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith(process.env.PURELINE_PREVIEW_URL || "http://127.0.0.1:3000") &&
      !r.url().startsWith("data:")
    )
      outbound.push(r.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page
    .getByRole("button", { name: "Essential only", exact: true })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem("pureline-consent")),
  ).toBe("essential");
  expect(outbound).toEqual([]);
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem("pureline-consent")),
  ).toBe("analytics");
  expect(outbound).toEqual([]);
});
test("accessible key routes and no browser runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/doors",
    "/products/arch",
    "/request-quote",
    "/manufacturing-quality",
  ]) {
    await page.goto(route);
    await expect(page.locator(".motion-root")).toHaveAttribute(
      "data-motion",
      "active",
    );
    await expect(page.locator("h1")).toHaveAttribute("data-revealed", "true");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test("all required routes, metadata, missing resources and preview index gates", async ({
  request,
}) => {
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
  for (const route of routes) {
    const r = await request.get(route);
    expect(r.status(), route).toBe(200);
    expect(r.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    const html = await r.text();
    expect(html).toContain('rel="canonical"');
  }
  expect((await request.get("/products/not-a-model")).status()).toBe(404);
  expect((await request.get("/api/downloads/unapproved")).status()).toBe(404);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "<url>",
  );
});
