import { test, expect } from "@playwright/test";

const testEmail = process.env.AUTH_TEST_EMAIL || "tester@seek.local";
const testPassword = process.env.AUTH_TEST_PASSWORD || "TestPassword123!";

test.describe("Portal Login Flow", () => {
  test("should login, persist session on reload, and logout successfully", async ({
    page,
  }) => {
    // 1. Open login page
    await page.goto("/login");
    await expect(page).toHaveTitle(/seek.mn/i);
    await expect(page.locator("text=seek.mn Нэвтрэх")).toBeVisible();

    // 2. Fill login form
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitButton = page.locator("button[type='submit']");

    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);

    // 3. Submit
    await submitButton.click();

    // 4. Verify redirected to dashboard or portal authenticated state
    await page.waitForURL("**/dashboard");
    await expect(page.locator("text=Хянах самбар")).toBeVisible();

    // 5. Verify no access token in localStorage or sessionStorage
    const localToken = await page.evaluate(() =>
      localStorage.getItem("accessToken"),
    );
    const sessionToken = await page.evaluate(() =>
      sessionStorage.getItem("accessToken"),
    );
    expect(localToken).toBeNull();
    expect(sessionToken).toBeNull();

    // 6. Reload page and check session is preserved (auto-bootstrap handles this)
    await page.reload();
    await expect(page.locator("text=Хянах самбар")).toBeVisible();

    // 7. Click logout
    const logoutButton = page.locator("button:has-text('Гарах')");
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 8. Verify redirected back to login
    await page.waitForURL("**/login");
    await expect(page.locator("text=seek.mn Нэвтрэх")).toBeVisible();

    // 9. Reload page and ensure it remains on login (session is cleared)
    await page.reload();
    await expect(page.locator("text=seek.mn Нэвтрэх")).toBeVisible();
  });
});
