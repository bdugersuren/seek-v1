import { validateProductionAuthConfig } from "./security-config";

describe("validateProductionAuthConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("rejects placeholder secrets in production", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET =
      "seek_jwt_secret_key_placeholder_safe_entropy_1234567890";
    process.env.AUTH_COOKIE_SECURE = "true";

    expect(() => validateProductionAuthConfig("gateway service")).toThrow(
      /AUTH_JWT_SECRET/,
    );
  });

  it("allows strong production auth config", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET =
      "0123456789abcdef0123456789abcdef0123456789abcdef";
    process.env.AUTH_COOKIE_SECURE = "true";

    expect(() => validateProductionAuthConfig("gateway service")).not.toThrow();
  });
});
