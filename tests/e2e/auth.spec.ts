import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "ورود" })).toBeVisible();
  });

  test("should show register page", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "ثبت‌نام" })).toBeVisible();
  });

  test("should show validation errors on empty login", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "ورود" }).click();
    await expect(page.getByText("ایمیل الزامی است")).toBeVisible();
  });

  test("should register a new user", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("نام و نام خانوادگی").fill("تست کاربر");
    await page.getByLabel("ایمیل").fill(`test${Date.now()}@example.com`);
    await page.getByLabel("رمز عبور", { exact: true }).fill("test123456");
    await page.getByLabel("تکرار رمز عبور").fill("test123456");
    await page.getByRole("button", { name: "ثبت‌نام" }).click();
  });

  test("should login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("ایمیل").fill("customer@example.com");
    await page.getByLabel("رمز عبور").fill("customer123");
    await page.getByRole("button", { name: "ورود" }).click();
    await page.waitForURL("/");
  });
});
