const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:3010";
const testOrigin = process.env.AUTH_TEST_ORIGIN || "http://localhost:8081";
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
      headers: { "Content-Type": "application/json", Origin: testOrigin },
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
      headers: { Cookie: cookie, Origin: testOrigin },
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
      headers: { Cookie: newCookie, Origin: testOrigin },
    });
    expect(logoutRes.status).toBe(200);

    // 6. Verification: subsequent refresh must fail (401)
    const failedRefreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: newCookie, Origin: testOrigin },
    });
    expect(failedRefreshRes.status).toBe(401);
  });

  it("should expose session management endpoints for the current user", async () => {
    const loginRes = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: testOrigin },
      body: JSON.stringify({ email, password }),
    });
    expect(loginRes.status).toBe(201);
    const loginData: any = await loginRes.json();
    const cookie = loginRes.headers.get("set-cookie")!.split(";")[0];

    const sessionsRes = await fetch(`${gatewayUrl}/api/v1/auth/sessions`, {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });
    expect(sessionsRes.status).toBe(200);
    const sessionsData: any = await sessionsRes.json();
    expect(Array.isArray(sessionsData.sessions)).toBe(true);
    expect(sessionsData.sessions.length).toBeGreaterThan(0);

    const currentSessionId = sessionsData.sessions[0].id;
    const revokeRes = await fetch(
      `${gatewayUrl}/api/v1/auth/sessions/${currentSessionId}/revoke`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`,
          Origin: testOrigin,
        },
      },
    );
    expect(revokeRes.status).toBe(200);

    const failedRefreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie, Origin: testOrigin },
    });
    expect(failedRefreshRes.status).toBe(401);
  });

  it("should reject cookie-backed mutating requests without Origin or Referer", async () => {
    const loginRes = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: testOrigin },
      body: JSON.stringify({ email, password }),
    });
    expect(loginRes.status).toBe(201);
    const cookie = loginRes.headers.get("set-cookie")!.split(";")[0];

    const refreshRes = await fetch(`${gatewayUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    expect(refreshRes.status).toBe(403);
  });

  it("should register a new account as email-verification pending and block login", async () => {
    const uniqueEmail = `verify-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}@seek.local`;

    const registerRes = await fetch(`${gatewayUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: testOrigin },
      body: JSON.stringify({ email: uniqueEmail, password }),
    });
    expect(registerRes.status).toBe(201);
    const registerData: any = await registerRes.json();
    expect(registerData.status).toBe("PENDING_EMAIL_VERIFICATION");
    expect(registerData.emailVerificationRequired).toBe(true);

    const loginRes = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: testOrigin },
      body: JSON.stringify({ email: uniqueEmail, password }),
    });
    expect(loginRes.status).toBe(401);
  });

  it("should reject invalid email verification tokens", async () => {
    const verifyRes = await fetch(`${gatewayUrl}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: testOrigin },
      body: JSON.stringify({ token: "invalid-token" }),
    });
    expect(verifyRes.status).toBe(400);
  });
});
