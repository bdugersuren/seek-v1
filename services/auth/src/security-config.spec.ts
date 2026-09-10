import { validateProductionAuthConfig } from "./security-config";

describe("validateProductionAuthConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("allows non-production local defaults", () => {
    process.env.NODE_ENV = "development";
    process.env.AUTH_JWT_SECRET = "seek_jwt_secret_key_placeholder";
    process.env.AUTH_COOKIE_SECURE = "false";

    expect(() => validateProductionAuthConfig("auth service")).not.toThrow();
  });

  it("rejects placeholder secrets in production", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET =
      "seek_jwt_secret_key_placeholder_safe_entropy_1234567890";
    process.env.AUTH_COOKIE_SECURE = "true";

    expect(() => validateProductionAuthConfig("auth service")).toThrow(
      /AUTH_JWT_SECRET/,
    );
  });

  it("rejects insecure cookies in production", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET =
      "0123456789abcdef0123456789abcdef0123456789abcdef";
    process.env.AUTH_COOKIE_SECURE = "false";

    expect(() => validateProductionAuthConfig("auth service")).toThrow(
      /AUTH_COOKIE_SECURE/,
    );
  });

  it("allows strong production auth config", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET =
      "0123456789abcdef0123456789abcdef0123456789abcdef";
    process.env.AUTH_COOKIE_SECURE = "true";

    expect(() => validateProductionAuthConfig("auth service")).not.toThrow();
  });
  it("rejects the formerly shipped production secret without logging it", () => {
    process.env.NODE_ENV = "production";
    process.env.AUTH_JWT_SECRET = "seek_jwt_key_safe_entropy_1234567890_super_secure";
    process.env.AUTH_COOKIE_SECURE = "true";
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    try {
      expect(() => validateProductionAuthConfig("service")).toThrow(/AUTH_JWT_SECRET/);
      expect(log).not.toHaveBeenCalled();
    } finally { log.mockRestore(); }
  });
});
