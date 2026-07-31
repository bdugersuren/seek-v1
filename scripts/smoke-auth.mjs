import assert from "assert";

const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:3000";
const email = process.env.AUTH_TEST_EMAIL || "tester@seek.local";
const password = process.env.AUTH_TEST_PASSWORD || "TestPassword123!";

console.log("=== Auth CLI Smoke Test Starting ===");
console.log(`Target Gateway: ${gatewayUrl}`);

async function run() {
  // 1. Gateway Health Check
  const healthRes = await fetch(`${gatewayUrl}/health`);
  assert.strictEqual(healthRes.status, 200, "Gateway is not healthy!");
  console.log("✓ Gateway health check passed");

  // 2. Login with seeded credentials
  console.log(`Attempting login for: ${email}`);
  const loginRes = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  assert.strictEqual(loginRes.status, 201, `Login failed: ${loginRes.status}`);
  const loginData = await loginRes.json();
  assert.ok(loginData.accessToken, "No access token returned!");
  console.log("✓ Login successful");

  // Extract refresh token cookie
  const setCookie = loginRes.headers.get("set-cookie");
  assert.ok(setCookie, "No refresh token cookie in response headers!");
  const cookieVal = setCookie.split(";")[0];
  console.log("✓ Refresh token cookie extracted");

  // 3. Call /auth/me with active token
  const meRes = await fetch(`${gatewayUrl}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${loginData.accessToken}` },
  });
  assert.strictEqual(meRes.status, 200, `/me call failed: ${meRes.status}`);
  const meData = await meRes.json();
  assert.strictEqual(meData.email, email, "Logged-in user email mismatch!");
  console.log(`✓ Access /me succeeded. Logged in as: ${meData.email}`);

  // 4. Refresh token rotation
  console.log("Attempting token refresh...");
  const refreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { Cookie: cookieVal },
  });
  assert.strictEqual(
    refreshRes.status,
    201,
    `Refresh failed: ${refreshRes.status}`,
  );
  const refreshData = await refreshRes.json();
  assert.ok(refreshData.accessToken, "No new access token returned!");
  assert.notStrictEqual(
    refreshData.accessToken,
    loginData.accessToken,
    "Access token did not rotate!",
  );
  console.log("✓ Token refresh rotation succeeded");

  // Extract new refresh cookie
  const newSetCookie = refreshRes.headers.get("set-cookie");
  assert.ok(newSetCookie, "No new refresh token cookie in refresh response!");
  const newCookieVal = newSetCookie.split(";")[0];

  // 5. Logout
  console.log("Attempting logout...");
  const logoutRes = await fetch(`${gatewayUrl}/api/v1/auth/logout`, {
    method: "POST",
    headers: { Cookie: newCookieVal },
  });
  assert.strictEqual(
    logoutRes.status,
    200,
    `Logout failed: ${logoutRes.status}`,
  );
  console.log("✓ Logout succeeded");

  // 6. Refresh after logout must fail
  console.log("Confirming token family is invalidated after logout...");
  const failedRefreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { Cookie: newCookieVal },
  });
  assert.strictEqual(
    failedRefreshRes.status,
    401,
    "Refresh succeeded after logout but must fail!",
  );
  console.log("✓ Invalidation after logout verified (401 Unauthorized)");

  console.log("=== All Auth CLI Smoke Tests Passed! ===");
}

run().catch((err) => {
  console.error("✗ Smoke test failed with error:", err.message);
  process.exit(1);
});
