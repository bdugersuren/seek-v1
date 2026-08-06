import { expect, test } from "@playwright/test";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is required for E2E flow. Example: E2E_QUIZ_URL=http://quiz.seek.mn E2E_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution E2E_REPORTING_URL=http://quiz-api.seek.mn/api/v1/reporting pnpm playwright test tests/e2e/runtime-complete-flow.spec.ts`
    );
  }
  return value;
}

const quizBaseUrl = requireEnv("E2E_QUIZ_URL");
const executionBaseUrl = requireEnv("E2E_EXECUTION_URL");
const reportingBaseUrl = requireEnv("E2E_REPORTING_URL");

const testEmail = process.env.AUTH_TEST_EMAIL || "candidate@seek.local";
const testPassword = process.env.AUTH_TEST_PASSWORD || "TestPassword123!";

test("complete attempt flow from catalog to receipt and verify reporting fact", async ({
  page,
  request,
 }) => {
  test.setTimeout(60000);
  page.on("console", (msg) => console.log(`PAGE LOG [${msg.type()}]:`, msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR UNCAUGHT:", err.stack || err.message));
  page.on("response", (res) => {
    if (res.status() >= 400) {
      console.log(`HTTP ERROR RESPONSE: ${res.request().method()} ${res.url()} -> Status: ${res.status()}`);
    }
  });

  // 1. Login to Portal
  await page.goto("/login");
  await page.locator("input[type='email']").fill(testEmail);
  await page.locator("input[type='password']").fill(testPassword);
  await page.locator("button[type='submit']").click();

  await page.waitForTimeout(3000);
  let currentUrl = page.url();
  if (currentUrl.includes("/onboarding")) {
    await page.screenshot({ path: "/home/bd/seek-v1/scratch/onboarding.png" });
    await page.locator("input").first().fill("Candidate User");
    await page.locator("input").nth(1).fill("99112244");
    await page.locator("input").nth(2).fill("Монгол");
    await page.getByRole("button", { name: "Хадгалах" }).click();
    await page.waitForTimeout(3000);
  }

  // Copy cookies from portal to quiz domain to prevent 401 cross-origin issues
  const cookies = await page.context().cookies();
  const subdomainCookies = cookies.map((c) => ({
    ...c,
    domain: c.domain.includes("portal.seek.mn") ? "quiz.seek.mn" : c.domain,
  }));
  await page.context().addCookies(subdomainCookies);

  // 2. Navigate to Catalog
  await page.goto("/catalog");
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: "/home/bd/seek-v1/scratch/catalog.png" });
  console.log("Articles found on page:", await page.locator("article").allTextContents());

  // 3. Select "Англи хэлний суурь мэдлэг" and enter Waiting Room
  const enterWaitingRoom = async () => {
    await page
      .locator("article")
      .filter({ hasText: "Англи хэлний суурь мэдлэг" })
      .getByRole("button", { name: "Хүлээлгийн өрөөнд орох" })
      .click();
  };

  await enterWaitingRoom();

  await page.waitForTimeout(3000);
  currentUrl = page.url();
  if (currentUrl.includes("/onboarding")) {
    await page.screenshot({ path: "/home/bd/seek-v1/scratch/onboarding_click.png" });
    
    // Use precise label filters to locate the inputs
    await page.locator("label").filter({ hasText: "Овог нэр" }).locator("input").fill("Candidate User");
    await page.locator("label").filter({ hasText: "Утасны дугаар" }).locator("input").fill("99112244");
    await page.locator("label").filter({ hasText: "Улс" }).locator("input").fill("Монгол");
    
    await page.getByRole("button", { name: "Хадгалах" }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "/home/bd/seek-v1/scratch/onboarding_after.png" });
    await page.waitForTimeout(2000);
    
    // Retry entering waiting room after onboarding completes
    await enterWaitingRoom();
  }

  // Verify redirect to Waiting Room
  await expect(page).toHaveURL(/^https?:\/\/quiz\.seek\.mn\/waiting\/attempt-/);

  // Extract attempt ID from URL
  const url = page.url();
  const match = url.match(/attempt-([a-zA-Z0-9:-]+)/);
  if (!match) {
    throw new Error(`Failed to extract attemptId from URL: ${url}`);
  }
  const attemptId = `attempt-${match[1]}`;

  // 4. Acknowledge Instructions and Start Attempt
  await page
    .getByLabel("Би бүх зааврыг анхааралтай уншиж, ойлгосон.")
    .check();
  await page.getByRole("button", { name: "Start event илгээх" }).click();
  await page.getByRole("button", { name: "Шалгалт эхлүүлэх" }).click();

  // Verify redirect to Take (Runtime) page
  await expect(page).toHaveURL(new RegExp(`^https?://quiz\\.seek\\.mn/take/${attemptId}`));

  // 5. Answer Questions
  // Q1 (single choice)
  await expect(page.getByText("Q1 · single_choice")).toBeVisible();
  await page.getByText("Ардчилсан ёс").click();
  await page.getByRole("button", { name: "Хадгалах ба Дараах" }).click();

  // Q2 (multiple choice)
  await expect(page.getByText("Q2 · multiple_choice")).toBeVisible();
  await page.getByText("Ил тод байдал").click();
  await page.getByText("Хариуцлага").click();
  await page.getByRole("button", { name: "Хадгалах ба Дараах" }).click();

  // Q3 (essay)
  await expect(page.getByText("Q3 · essay")).toBeVisible();
  await page.locator("textarea").fill("Энэ бол E2E тест хариулт юм.");
  await page.getByRole("button", { name: "Хадгалах" }).first().click();

  // 6. Submit Attempt
  await page.getByRole("button", { name: "Тест дуусгах" }).click();

  // Click "Receipt харах" to proceed to receipt page
  await page.getByRole("link", { name: "Receipt харах" }).click();

  // Verify redirect to Receipt page
  await expect(page).toHaveURL(new RegExp(`^https?://quiz\\.seek\\.mn/submitted/${attemptId}`));
  await expect(page.getByText("Шалгалт илгээгдлээ")).toBeVisible();

  // 7. Verify Reporting Fact Projection (Polling)
  let fact: any = null;
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    const response = await request.get(`${reportingBaseUrl}/attempt-facts/${attemptId}`);
    console.log(`REPORTING POLL RETRY ${i}: Status = ${response.status()}, Url = ${reportingBaseUrl}/attempt-facts/${attemptId}`);
    if (response.ok()) {
      fact = await response.json();
      console.log("REPORTING FACT CONTENT:", fact);
      if (fact.status === "SUBMITTED" || fact.status === "FINAL") {
        break;
      }
    } else {
      console.log("REPORTING ERROR TEXT:", await response.text());
    }
    // Wait 1 second before retry (let RabbitMQ finish processing)
    await page.waitForTimeout(1000);
  }

  expect(fact).not.toBeNull();
  expect(fact.attemptId).toBe(attemptId);
  expect(fact.status).toBe("SUBMITTED");
});
