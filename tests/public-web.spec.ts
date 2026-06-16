import { expect, test } from "@playwright/test";

const publicRoutes = [
  "",
  "/club",
  "/equipos",
  "/partidos",
  "/clasificacion",
  "/novas",
  "/tenda",
  "/contacto",
] as const;

test("all public routes render in both locales", async ({ request }) => {
  test.slow();
  for (const locale of ["gl", "es"]) {
    for (const route of publicRoutes) {
      const response = await request.get(`/${locale}${route}`);
      expect(response.ok(), `${locale}${route || "/"}`).toBeTruthy();
    }
  }
});

test("public responses include baseline security headers", async ({ request }) => {
  const response = await request.get("/gl");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
});

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

test("language switch keeps the current public route", async ({ page }) => {
  await page.goto("/gl/partidos");
  await page.getByRole("link", { name: "Cambiar ao castelán" }).click();
  await expect(page).toHaveURL(/\/es\/partidos$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /Cada jornada cuenta/i }),
  ).toBeVisible();
});

test("internal pages expose localized canonical and hreflang links", async ({
  page,
}) => {
  await page.goto("/es/equipos");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/es\/equipos$/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="gl"]')).toHaveAttribute(
    "href",
    /\/gl\/equipos$/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
    "href",
    /\/es\/equipos$/,
  );
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
  await expect(page.getByText("Página no encontrada.")).toBeVisible();
});
