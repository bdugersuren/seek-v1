import { execFileSync } from "node:child_process";

const portalBaseUrl = process.env.E2E_BASE_URL || "http://portal.seek.mn";
const quizBaseUrl = process.env.E2E_QUIZ_URL || "http://quiz.seek.mn";
const executionBaseUrl =
  process.env.E2E_EXECUTION_URL || "http://quiz-api.seek.mn/api/v1/execution";

const checks = [
  {
    name: "portal catalog",
    url: `${portalBaseUrl}/catalog`,
    expectedStatus: 200,
  },
  {
    name: "quiz waiting mock",
    url: `${quizBaseUrl}/waiting/mock-attempt-001`,
    expectedStatus: 200,
  },
  {
    name: "execution mock session",
    url: `${executionBaseUrl}/session/mock-attempt-001`,
    expectedStatus: 200,
  },
];

async function checkHttp({ name, url, expectedStatus }) {
  const response = await fetch(url, { redirect: "manual" });
  if (response.status !== expectedStatus) {
    throw new Error(
      `${name} expected HTTP ${expectedStatus}, received ${response.status}`,
    );
  }
}

function getComposeServiceConfig(serviceName) {
  return execFileSync(
    "docker",
    [
      "compose",
      "-f",
      "docker-compose.yml",
      "-f",
      "docker-compose.prod.yml",
      "config",
      serviceName,
    ],
    { encoding: "utf8" },
  );
}

function checkComposeConfig() {
  const portalConfig = getComposeServiceConfig("portal-web");

  if (
    !portalConfig.includes(
      "NEXT_PUBLIC_ASSESSMENT_WEB_URL: http://quiz.seek.mn",
    )
  ) {
    throw new Error(
      "portal-web production build args do not include NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://quiz.seek.mn",
    );
  }

  const assessmentConfig = getComposeServiceConfig("assessment-web");

  if (
    !assessmentConfig.includes(
      "NEXT_PUBLIC_EXECUTION_URL: http://quiz-api.seek.mn/api/v1/execution",
    )
  ) {
    throw new Error(
      "assessment-web production build args do not include NEXT_PUBLIC_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution",
    );
  }
}

async function checkDynamicAttemptFlow() {
  const createResponse = await fetch(
    `${executionBaseUrl}/attempts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId: "english-basic",
        idempotencyKey: `smoke-${Date.now()}`,
      }),
    },
  );

  if (createResponse.status !== 201 && createResponse.status !== 200) {
    throw new Error(
      `dynamic attempt creation expected HTTP 200/201, received ${createResponse.status}`,
    );
  }

  const created = await createResponse.json();
  if (!created.attemptId || !created.waitingUrl) {
    throw new Error("dynamic attempt creation response is missing attemptId/waitingUrl");
  }

  const sessionResponse = await fetch(
    `${executionBaseUrl}/session/${created.attemptId}`,
  );
  if (sessionResponse.status !== 200) {
    throw new Error(
      `dynamic attempt session expected HTTP 200, received ${sessionResponse.status}`,
    );
  }

  const startResponse = await fetch(
    `${executionBaseUrl}/start/${created.attemptId}`,
    { method: "POST" },
  );
  if (startResponse.status !== 201 && startResponse.status !== 200) {
    throw new Error(
      `dynamic attempt start expected HTTP 200/201, received ${startResponse.status}`,
    );
  }

  const activeSessionResponse = await fetch(
    `${executionBaseUrl}/session/${created.attemptId}`,
  );
  const activeSession = await activeSessionResponse.json();
  if (activeSession.session?.status !== "active") {
    throw new Error(
      `dynamic attempt expected active status, received ${activeSession.session?.status}`,
    );
  }
}

for (const check of checks) {
  await checkHttp(check);
  console.log(`ok ${check.name}`);
}

checkComposeConfig();
console.log("ok production compose config");

await checkDynamicAttemptFlow();
console.log("ok dynamic attempt lifecycle");
