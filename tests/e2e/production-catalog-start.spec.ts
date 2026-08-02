import { expect, test } from "@playwright/test";

test("catalog start creates an attempt and redirects to quiz waiting room", async ({
  page,
}) => {
  await page.goto("/catalog");
  await page
    .locator("article")
    .filter({ hasText: "Мэдээллийн шинжилгээний үндэс" })
    .getByRole("button", { name: "Хуваарь харах" })
    .click();
  await expect(page.getByText("Нэвтрэх нөхцөл")).toBeVisible();
  await page.getByRole("button", { name: "Хаах" }).click();

  await page
    .locator("article")
    .filter({ hasText: "Англи хэлний суурь мэдлэг" })
    .getByRole("button", { name: "Хүлээлгийн өрөөнд орох" })
    .click();
  await expect(page).toHaveURL(/^http:\/\/quiz\.seek\.mn\/waiting\/attempt-/);
  await page
    .getByLabel("Би бүх зааврыг анхааралтай уншиж, ойлгосон.")
    .check();
  await page.getByRole("button", { name: "Start event илгээх" }).click();
  await page.getByRole("button", { name: "Шалгалт эхлүүлэх" }).click();
  await expect(page).toHaveURL(/^http:\/\/quiz\.seek\.mn\/take\/attempt-/);
});
