import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import proxy from "express-http-proxy";

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly jwtSecret =
    process.env.AUTH_JWT_SECRET || "seek_jwt_secret_key_placeholder";
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL || "http://localhost:3020";
  private readonly profileServiceUrl =
    process.env.PROFILE_SERVICE_URL || "http://localhost:3030";
  private readonly executionServiceUrl =
    process.env.EXECUTION_SERVICE_URL || "http://localhost:3090";
  private readonly fileServiceUrl =
    process.env.FILE_SERVICE_URL || "http://localhost:3140";
  private readonly integrationServiceUrl =
    process.env.INTEGRATION_SERVICE_URL || "http://localhost:3130";

  private readonly healthProxyTargets: Record<string, string> = {
    profile: process.env.PROFILE_SERVICE_URL || "http://localhost:3030",
    organisation:
      process.env.ORGANISATION_SERVICE_URL || "http://localhost:3040",
    assessment: process.env.ASSESSMENT_SERVICE_URL || "http://localhost:3070",
    commerce: process.env.COMMERCE_SERVICE_URL || "http://localhost:3080",
    file: process.env.FILE_SERVICE_URL || "http://localhost:3140",
    integration: process.env.INTEGRATION_SERVICE_URL || "http://localhost:3130",
    notification:
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3170",
    reporting: process.env.REPORTING_SERVICE_URL || "http://localhost:3150",
  };

  private getRequestUrl(req: Request): string {
    return req.originalUrl || req.url || req.path || "/";
  }

  private isAuthProxyRequest(req: Request): boolean {
    return this.getRequestUrl(req).startsWith("/api/v1/auth");
  }

  private resolveAuthProxyPath(req: Request): string {
    return this.getRequestUrl(req).replace(/^\/api\/v1\/auth/, "/auth");
  }

  private isExecutionProxyRequest(req: Request): boolean {
    return this.getRequestUrl(req).startsWith("/api/v1/execution");
  }

  private resolveExecutionProxyPath(req: Request): string {
    return this.getRequestUrl(req).replace(/^\/api\/v1\/execution/, "/execution");
  }

  private isProfileProxyRequest(req: Request): boolean {
    return this.getRequestUrl(req).startsWith("/api/v1/profile");
  }

  private resolveProfileProxyPath(req: Request): string {
    return this.getRequestUrl(req).replace(/^\/api\/v1\/profile/, "/profile");
  }

  private isFileProxyRequest(req: Request): boolean {
    return this.getRequestUrl(req).startsWith("/api/v1/file");
  }

  private resolveFileProxyPath(req: Request): string {
    return this.getRequestUrl(req).replace(/^\/api\/v1\/file/, "/file");
  }

  private isIntegrationProxyRequest(req: Request): boolean {
    return this.getRequestUrl(req).startsWith("/api/v1/integration");
  }

  private resolveIntegrationProxyPath(req: Request): string {
    return this.getRequestUrl(req).replace(/^\/api\/v1\/integration/, "/integration");
  }

  private getHealthProxyTarget(req: Request): { url: string; service: string } | null {
    const match = this.getRequestUrl(req).match(
      /^\/api\/v1\/(profile|organisation|assessment|commerce|file|integration|notification|reporting)\/health(?:\/(live|ready))?$/,
    );
    if (!match) return null;

    const service = match[1];
    const url = this.healthProxyTargets[service];
    return url ? { url, service } : null;
  }

  private resolveHealthProxyPath(req: Request, service: string): string {
    return this.getRequestUrl(req).replace(
      new RegExp(`^/api/v1/${service}/health`),
      "/health",
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `Gateway received request: ${req.method} ${this.getRequestUrl(req)} path: ${req.path}`,
    );
    // CSRF Origin validation for state-changing requests
    const allowedOrigins = (
      process.env.AUTH_ALLOWED_ORIGINS ||
      "http://localhost:8081,http://localhost:8082,http://127.0.0.1:8081,http://127.0.0.1:8082,http://portal.seek.mn,http://quiz.seek.mn,http://quiz-api.seek.mn"
    ).split(",");
    const origin = req.headers["origin"] as string;
    const referer = req.headers["referer"] as string;
    let clientOrigin = origin;
    if (!clientOrigin && referer) {
      try {
        clientOrigin = new URL(referer).origin;
      } catch (e) {}
    }

    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      const hasCookie = Boolean(req.headers["cookie"]);
      const allowMissingOrigin =
        process.env.AUTH_CSRF_ALLOW_MISSING_ORIGIN === "true";
      if (!clientOrigin && hasCookie && !allowMissingOrigin) {
        res.status(403).json({
          statusCode: 403,
          message: "Missing Origin (CSRF Prevention)",
          error: "Forbidden",
        });
        return;
      }

      if (clientOrigin && !allowedOrigins.includes(clientOrigin)) {
        res.status(403).json({
          statusCode: 403,
          message: "Disallowed Origin (CSRF Prevention)",
          error: "Forbidden",
        });
        return;
      }
    }

    // 1. Spoofed Header Protection: Ирж буй хүсэлтийн дотоод identity header-үүдийг хүчээр устгана
    const headersToStrip = [
      "x-user-id",
      "x-session-id",
      "x-user-roles",
      "x-authenticated-subject",
      "x-authenticated-user",
      "x-auth-context",
    ];
    for (const key of Object.keys(req.headers)) {
      if (headersToStrip.includes(key.toLowerCase())) {
        delete req.headers[key];
      }
    }

    // 2. Authorization Header болон Cookie-г шалгах
    let token: string | undefined;
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, this.jwtSecret, {
          issuer: process.env.AUTH_TOKEN_ISSUER || "seek.mn",
          audience: process.env.AUTH_TOKEN_AUDIENCE || "seek.mn",
          algorithms: ["HS256"],
        }) as any;
        if (decoded && decoded.sub && decoded.session_id) {
          req.headers["x-user-id"] = decoded.sub;
          req.headers["x-session-id"] = decoded.session_id;
          if (Array.isArray(decoded.roles)) {
            req.headers["x-user-roles"] = decoded.roles
              .filter((role: unknown) => typeof role === "string")
              .join(",");
          }
        }
      } catch (err) {
        // Хэрэв токен буруу эсвэл хугацаа дууссан бол дотоод сүлжээнд зөвшөөрөхгүй
        // Гэхдээ зарим нийтийн зам байж болох тул шууд алдаа шидэхгүй, дотоод үйлчилгээ өөрөө шийднэ
      }
    }

    // 3. Expose health proxy routes for bounded-context services before
    // generic service proxy rules rewrite the path.
    const healthProxyTarget = this.getHealthProxyTarget(req);
    if (healthProxyTarget) {
      const proxyMiddleware = proxy(healthProxyTarget.url, {
        proxyReqPathResolver: (proxyReq) => {
          return this.resolveHealthProxyPath(proxyReq, healthProxyTarget.service);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 4. /api/v1/auth чиглэлийн хүсэлтийг auth үйлчилгээ рүү proxy хийх
    if (this.isAuthProxyRequest(req)) {
      const proxyMiddleware = proxy(this.authServiceUrl, {
        proxyReqPathResolver: (proxyReq) => {
          // Ирж буй /api/v1/auth/... хүсэлтийг auth үйлчилгээний /auth/... рүү чиглүүлнэ
          return this.resolveAuthProxyPath(proxyReq);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 5. /api/v1/execution чиглэлийн хүсэлтийг execution үйлчилгээ рүү proxy хийх
    if (this.isExecutionProxyRequest(req)) {
      const proxyMiddleware = proxy(this.executionServiceUrl, {
        proxyReqPathResolver: (proxyReq) => {
          return this.resolveExecutionProxyPath(proxyReq);
        },
        userResHeaderDecorator: (headers) => {
          headers["x-accel-buffering"] = "no";
          return headers;
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 6. /api/v1/profile чиглэлийн хүсэлтийг authenticated profile service рүү proxy хийх
    if (this.isProfileProxyRequest(req)) {
      const url = this.getRequestUrl(req);
      
      // Candidate routes check
      if (url.startsWith("/api/v1/profile/me")) {
        if (!req.headers["x-user-id"]) {
          res.status(401).json({
            statusCode: 401,
            message: "Нэвтрэх эрхгүй байна.",
            error: "Unauthorized",
          });
          return;
        }
      } 
      // Admin routes check
      else if (url.startsWith("/api/v1/profile/admin")) {
        const userId = req.headers["x-user-id"];
        const rolesHeader = req.headers["x-user-roles"];
        
        if (!userId) {
          res.status(401).json({
            statusCode: 401,
            message: "Нэвтрэх эрхгүй байна.",
            error: "Unauthorized",
          });
          return;
        }

        const roles = typeof rolesHeader === "string" ? rolesHeader.split(",") : [];
        const allowedAdminRoles = [
          "SUPER_ADMIN",
          "ORGANIZATION_ADMIN",
          "ASSESSOR",
          "VIEWER",
          "TESTER",
        ];
        const hasAdminRole = roles.some(role => allowedAdminRoles.includes(role));

        if (!rolesHeader || !hasAdminRole) {
          res.status(403).json({
            statusCode: 403,
            message: "Уг үйлдлийг хийх эрх хүрэлцэхгүй байна.",
            error: "Forbidden",
          });
          return;
        }
      }

      const proxyMiddleware = proxy(this.profileServiceUrl, {
        proxyReqPathResolver: (proxyReq) => {
          return this.resolveProfileProxyPath(proxyReq);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 6.5. File proxy requests (Requires authentication)
    if (this.isFileProxyRequest(req)) {
      if (!req.headers["x-user-id"]) {
        res.status(401).json({
          statusCode: 401,
          message: "Нэвтрэх эрхгүй байна.",
          error: "Unauthorized",
        });
        return;
      }

      const proxyMiddleware = proxy(this.fileServiceUrl, {
        parseReqBody: false,
        proxyReqPathResolver: (proxyReq) => {
          return this.resolveFileProxyPath(proxyReq);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 6.6. Integration proxy requests (Requires authentication)
    if (this.isIntegrationProxyRequest(req)) {
      if (!req.headers["x-user-id"]) {
        res.status(401).json({
          statusCode: 401,
          message: "Нэвтрэх эрхгүй байна.",
          error: "Unauthorized",
        });
        return;
      }

      const proxyMiddleware = proxy(this.integrationServiceUrl, {
        proxyReqPathResolver: (proxyReq) => {
          return this.resolveIntegrationProxyPath(proxyReq);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    next();
  }
}
