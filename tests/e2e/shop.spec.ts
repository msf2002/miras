import { test, expect } from "@playwright/test";

test.describe("Shop", () => {
  test("should display products on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("تندیس‌هایی از نور و ایمان")).toBeVisible();
  });

  test("should navigate to shop page", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: "تندیس‌ها" })).toBeVisible();
  });

  test("should filter products", async ({ page }) => {
    await page.goto("/shop");
    // Filters should be visible on desktop
    await expect(page.getByText("فیلترها")).toBeVisible();
  });

  test("should navigate to product detail", async ({ page }) => {
    await page.goto("/product/tandis-ya-ali");
    await expect(page.getByText("تندیس یا علی")).toBeVisible();
  });

  test("should search products", async ({ page }) => {
    await page.goto("/search?q=علی");
    await expect(page.getByText("نتایج جستجو")).toBeVisible();
  });
});
