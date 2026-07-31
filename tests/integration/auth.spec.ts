const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:3000";
const email = process.env.AUTH_TEST_EMAIL || "tester@seek.local";
const password = process.env.AUTH_TEST_PASSWORD || "TestPassword123!";

describe("Authentication Integration Test (Gateway -> Auth -> Postgres)", () => {
  it("should successfully log in, access profile, rotate token, and log out", async () => {
    // 1. Gateway Health check
    const health = await fetch(`${gatewayUrl}/health`);
    expect(health.status).toBe(200);

    // 2. Perform Login
    const loginRes = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    expect(loginRes.status).toBe(201);
    const loginData: any = await loginRes.json();
    expect(loginData.accessToken).toBeDefined();

    // Extract refresh cookie
    const setCookie = loginRes.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("refresh_token");
    const cookie = setCookie!.split(";")[0];

    // 3. Request /me
    const meRes = await fetch(`${gatewayUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });
    expect(meRes.status).toBe(200);
    const meData: any = await meRes.json();
    expect(meData.email).toBe(email);

    // 4. Token Refresh
    const refreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(refreshRes.status).toBe(201);
    const refreshData: any = await refreshRes.json();
    expect(refreshData.accessToken).toBeDefined();
    expect(refreshData.accessToken).not.toBe(loginData.accessToken);

    const newSetCookie = refreshRes.headers.get("set-cookie");
    expect(newSetCookie).toBeDefined();
    const newCookie = newSetCookie!.split(";")[0];

    // 5. Logout
    const logoutRes = await fetch(`${gatewayUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: { Cookie: newCookie },
    });
    expect(logoutRes.status).toBe(200);

    // 6. Verification: subsequent refresh must fail (401)
    const failedRefreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: newCookie },
    });
    expect(failedRefreshRes.status).toBe(401);
  });
});
