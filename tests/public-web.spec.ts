import { expect, test } from "@playwright/test";

test("root redirects to Galician home", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/gl$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Somos de aquí/i }),
  ).toBeVisible();
});

test("public navigation contains no admin link", async ({ page }) => {
  await page.goto("/gl");
  await expect(page.locator('a[href*="/admin"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Partidos" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Tenda" }).first()).toBeVisible();
});

test("Spanish locale renders translated navigation", async ({ page }) => {
  await page.goto("/es");
  await expect(
    page.getByRole("heading", { level: 1, name: /Jugamos por todos/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Tienda" }).first()).toBeVisible();
});

test("shop exposes WhatsApp ordering", async ({ page }) => {
  await page.goto("/gl/tenda");
  const orderLinks = page.locator('a[href^="https://wa.me/"]');
  await expect(orderLinks.first()).toBeVisible();
  expect(await orderLinks.count()).toBeGreaterThanOrEqual(1);
});

test("mobile layout does not overflow horizontally", async ({ page }) => {
  await page.goto("/gl");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("unknown route renders custom 404", async ({ page }) => {
  await page.goto("/gl/non-existe");
  await expect(page.getByText("Páxina non atopada.")).toBeVisible();
});
