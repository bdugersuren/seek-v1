import { ProxyMiddleware } from "./proxy.middleware";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import proxy from "express-http-proxy";

jest.mock("express-http-proxy", () => {
  return jest.fn(() =>
    jest.fn((_req: Request, _res: Response, next: NextFunction) => next()),
  );
});

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
      roles: ["CANDIDATE", "ASSESSOR"],
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
    expect(mockRequest.headers["x-user-roles"]).toBe("CANDIDATE,ASSESSOR");
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
      originalUrl: "/api/v1/unsupported-service",
    };

    expect((middleware as any).isAuthProxyRequest(mockRequest)).toBe(false);
  });

  it("should resolve authenticated profile proxy paths", () => {
    mockRequest = {
      ...mockRequest,
      path: "/",
      url: "/",
      originalUrl: "/api/v1/profile/me/completion",
    };

    expect((middleware as any).isProfileProxyRequest(mockRequest)).toBe(true);
    expect((middleware as any).resolveProfileProxyPath(mockRequest)).toBe(
      "/profile/me/completion",
    );

    mockRequest.originalUrl = "/api/v1/profile/admin/verifications";
    expect((middleware as any).isProfileProxyRequest(mockRequest)).toBe(true);
    expect((middleware as any).resolveProfileProxyPath(mockRequest)).toBe(
      "/profile/admin/verifications",
    );
  });

  describe("Profile Service Gateway Protection and RBAC", () => {
    it("should allow /api/v1/profile/me request if x-user-id is present", () => {
      const token = jwt.sign(
        { sub: "user-123", session_id: "session-456", roles: ["CANDIDATE"] },
        jwtSecret,
        { issuer: "seek.mn", audience: "seek.mn" }
      );
      mockRequest = {
        method: "GET",
        originalUrl: "/api/v1/profile/me",
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 401 for /api/v1/profile/me request if x-user-id is missing", () => {
      mockRequest = {
        method: "GET",
        originalUrl: "/api/v1/profile/me",
        headers: {},
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 for /api/v1/profile/admin request if x-user-id is missing", () => {
      mockRequest = {
        method: "GET",
        originalUrl: "/api/v1/profile/admin/verifications",
        headers: {},
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 for /api/v1/profile/admin request if x-user-roles is missing or user is not admin", () => {
      const token = jwt.sign(
        { sub: "user-123", session_id: "session-456", roles: ["CANDIDATE"] },
        jwtSecret,
        { issuer: "seek.mn", audience: "seek.mn" }
      );
      mockRequest = {
        method: "GET",
        originalUrl: "/api/v1/profile/admin/verifications",
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it("should allow /api/v1/profile/admin request if user is admin/assessor", () => {
      const token = jwt.sign(
        { sub: "user-123", session_id: "session-456", roles: ["ASSESSOR"] },
        jwtSecret,
        { issuer: "seek.mn", audience: "seek.mn" }
      );
      mockRequest = {
        method: "GET",
        originalUrl: "/api/v1/profile/admin/verifications",
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe("File Service Gateway Protection", () => {
    const mockedProxy = proxy as unknown as jest.Mock;

    beforeEach(() => {
      mockedProxy.mockClear();
    });

    it("should return 401 for /api/v1/file request if x-user-id is missing", () => {
      mockRequest = {
        method: "POST",
        originalUrl: "/api/v1/file/presigned-upload",
        headers: {},
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should allow /api/v1/file request when JWT identity is valid", () => {
      const token = jwt.sign(
        { sub: "user-123", session_id: "session-456", roles: ["CANDIDATE"] },
        jwtSecret,
        { issuer: "seek.mn", audience: "seek.mn" },
      );
      mockRequest = {
        method: "POST",
        originalUrl: "/api/v1/file/presigned-upload",
        headers: {
          authorization: `Bearer ${token}`,
          origin: "http://localhost:8081",
        },
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      expect(mockRequest.headers?.["x-user-id"]).toBe("user-123");
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should proxy /api/v1/file requests without parsing multipart bodies", () => {
      const token = jwt.sign(
        { sub: "user-123", session_id: "session-456", roles: ["CANDIDATE"] },
        jwtSecret,
        { issuer: "seek.mn", audience: "seek.mn" },
      );
      mockRequest = {
        method: "POST",
        originalUrl: "/api/v1/file/upload",
        headers: {
          authorization: `Bearer ${token}`,
          origin: "http://localhost:8081",
          "content-type": "multipart/form-data; boundary=test",
        },
      };
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction as NextFunction,
      );

      const fileProxyCall = mockedProxy.mock.calls.find(
        ([target]) => target === "http://localhost:3140",
      );
      expect(fileProxyCall?.[1]).toMatchObject({ parseReqBody: false });
    });
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

    it("should deny mutating cookie request with missing origin", () => {
      mockRequest.method = "POST";
      mockRequest.headers = { cookie: "refresh_token=value" };
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

    it("should allow missing origin for non-cookie mutating requests", () => {
      mockRequest.method = "POST";
      mockRequest.headers = {};
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
