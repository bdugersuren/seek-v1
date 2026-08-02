import { expect, test, type APIRequestContext } from "@playwright/test";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is required for runtime policy E2E. Example: E2E_QUIZ_URL=http://quiz.seek.mn E2E_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution pnpm playwright test tests/e2e/runtime-policy.spec.ts`
    );
  }

  return value;
}

const apiBaseUrl = requireEnv("E2E_EXECUTION_URL");
const quizBaseUrl = requireEnv("E2E_QUIZ_URL");

async function createActiveAttempt(request: APIRequestContext) {
  const createResponse = await request.post(`${apiBaseUrl}/attempts`, {
    data: {
      assessmentId: "english-basic",
      idempotencyKey: `runtime-policy-${Date.now()}`,
    },
  });
  expect(createResponse.ok()).toBeTruthy();
  const created = await createResponse.json();

  const startResponse = await request.post(`${apiBaseUrl}/start/${created.attemptId}`);
  expect(startResponse.ok()).toBeTruthy();

  return created.attemptId as string;
}

test("answer save and next persists after refresh", async ({ page, request }) => {
  const attemptId = await createActiveAttempt(request);

  await page.goto(`${quizBaseUrl}/take/${attemptId}`);
  await expect(page.getByText("Q1 · single_choice")).toBeVisible();
  await page.getByText("Ардчилсан ёс").click();
  await expect(page.getByText("Дараагийн асуулт руу шилжихээс өмнө")).toBeVisible();

  await page.getByRole("button", { name: "Хадгалах ба Дараах" }).click();
  await expect(page.getByText("Q2 · multiple_choice")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Q1 · single_choice")).toBeVisible();
  await expect(page.getByRole("radio", { name: "Ардчилсан ёс" })).toBeChecked();

  const sessionResponse = await request.get(`${apiBaseUrl}/session/${attemptId}`);
  expect(sessionResponse.ok()).toBeTruthy();
  const session = await sessionResponse.json();
  expect(session.snapshot.answers.q1).toBe("a");
});

test("question palette navigation saves unsaved answer before moving", async ({
  page,
  request,
}) => {
  const attemptId = await createActiveAttempt(request);

  await page.goto(`${quizBaseUrl}/take/${attemptId}`);
  await page.getByText("Ардчилсан ёс").click();
  await expect(page.getByRole("button", { name: /Асуулт 1: одоогийн/ })).toBeVisible();

  await page.getByRole("button", { name: /Асуулт 2:/ }).click();
  await expect(page.getByText("Q2 · multiple_choice")).toBeVisible();

  const sessionResponse = await request.get(`${apiBaseUrl}/session/${attemptId}`);
  expect(sessionResponse.ok()).toBeTruthy();
  const session = await sessionResponse.json();
  expect(session.snapshot.answers.q1).toBe("a");
});

test("runtime mobile layout exposes timer, save policy, and navigation", async ({
  page,
  request,
}) => {
  const attemptId = await createActiveAttempt(request);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(`${quizBaseUrl}/take/${attemptId}`);
  await expect(page.getByText("Timer", { exact: true })).toBeVisible();
  await expect(page.getByText("Save", { exact: true })).toBeVisible();
  await expect(page.getByText("Асуултын навигац")).toBeVisible();

  await page.getByText("Ардчилсан ёс").click();
  await expect(page.getByRole("button", { name: "Хадгалах ба Дараах" })).toBeVisible();
});
