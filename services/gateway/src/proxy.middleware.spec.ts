import { ProxyMiddleware } from "./proxy.middleware";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

describe("ProxyMiddleware Unit Tests", () => {
  let middleware: ProxyMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  const jwtSecret = "seek_jwt_secret_key_placeholder";

  beforeEach(() => {
    middleware = new ProxyMiddleware();
    mockRequest = {
      headers: {},
      path: "/api/v1/some-route",
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should strip spoofed identity headers from incoming request case-insensitively", () => {
    mockRequest.headers = {
      "X-User-Id": "spoofed-user-id",
      "x-session-id": "spoofed-session-id",
      "x-authenticated-subject": "spoofed-sub",
      "X-Authenticated-User": "spoofed-user",
      "x-auth-context": "spoofed-context",
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(mockRequest.headers["x-user-id"]).toBeUndefined();
    expect(mockRequest.headers["X-User-Id"]).toBeUndefined();
    expect(mockRequest.headers["x-session-id"]).toBeUndefined();
    expect(mockRequest.headers["x-authenticated-subject"]).toBeUndefined();
    expect(mockRequest.headers["X-Authenticated-User"]).toBeUndefined();
    expect(mockRequest.headers["x-auth-context"]).toBeUndefined();
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should verify valid JWT and populate internal identity headers", () => {
    const payload = {
      sub: "user-123",
      session_id: "session-456",
      iss: "seek.mn",
      aud: "seek.mn",
    };
    const token = jwt.sign(payload, jwtSecret);

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(mockRequest.headers["x-user-id"]).toBe("user-123");
    expect(mockRequest.headers["x-session-id"]).toBe("session-456");
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should ignore invalid JWT and not populate identity headers", () => {
    mockRequest.headers = {
      authorization: `Bearer invalid-token-value`,
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    );

    expect(mockRequest.headers["x-user-id"]).toBeUndefined();
    expect(mockRequest.headers["x-session-id"]).toBeUndefined();
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should detect auth proxy requests using originalUrl when Nest rewrites path", () => {
    mockRequest = {
      ...mockRequest,
      path: "/",
      url: "/",
      originalUrl: "/api/v1/auth/login",
    };

    expect((middleware as any).isAuthProxyRequest(mockRequest)).toBe(true);
    expect((middleware as any).resolveAuthProxyPath(mockRequest)).toBe(
      "/auth/login",
    );
  });

  it("should not proxy non-auth requests", () => {
    mockRequest = {
      ...mockRequest,
      path: "/",
      url: "/",
      originalUrl: "/api/v1/profile/me",
    };

    expect((middleware as any).isAuthProxyRequest(mockRequest)).toBe(false);
  });

  it("should resolve bounded-context health proxy targets", () => {
    mockRequest = {
      ...mockRequest,
      path: "/",
      url: "/",
      originalUrl: "/api/v1/notification/health/ready",
    };

    expect((middleware as any).getHealthProxyTarget(mockRequest)).toEqual({
      service: "notification",
      url: "http://localhost:3170",
    });
    expect(
      (middleware as any).resolveHealthProxyPath(mockRequest, "notification"),
    ).toBe("/health/ready");
  });

  it("should not expose non-health bounded-context routes by default", () => {
    mockRequest = {
      ...mockRequest,
      path: "/",
      url: "/",
      originalUrl: "/api/v1/notification/templates",
    };

    expect((middleware as any).getHealthProxyTarget(mockRequest)).toBeNull();
  });

  describe("CSRF Origin Validation", () => {
    it("should allow mutating request with allowed origin", () => {
      mockRequest.method = "POST";
      mockRequest.headers = { origin: "http://localhost:8081" };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should deny mutating request with disallowed origin", () => {
      mockRequest.method = "POST";
      mockRequest.headers = { origin: "http://malicious-site.com" };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it("should allow safe request (GET) regardless of origin", () => {
      mockRequest.method = "GET";
      mockRequest.headers = { origin: "http://some-site.com" };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
