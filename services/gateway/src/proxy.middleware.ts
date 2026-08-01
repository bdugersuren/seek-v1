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
  private readonly executionServiceUrl =
    process.env.EXECUTION_SERVICE_URL || "http://localhost:3090";

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
        }
      } catch (err) {
        // Хэрэв токен буруу эсвэл хугацаа дууссан бол дотоод сүлжээнд зөвшөөрөхгүй
        // Гэхдээ зарим нийтийн зам байж болох тул шууд алдаа шидэхгүй, дотоод үйлчилгээ өөрөө шийднэ
      }
    }

    // 3. /api/v1/auth чиглэлийн хүсэлтийг auth үйлчилгээ рүү proxy хийх
    if (this.isAuthProxyRequest(req)) {
      const proxyMiddleware = proxy(this.authServiceUrl, {
        proxyReqPathResolver: (proxyReq) => {
          // Ирж буй /api/v1/auth/... хүсэлтийг auth үйлчилгээний /auth/... рүү чиглүүлнэ
          return this.resolveAuthProxyPath(proxyReq);
        },
      });
      return proxyMiddleware(req, res, next);
    }

    // 4. /api/v1/execution чиглэлийн хүсэлтийг execution үйлчилгээ рүү proxy хийх
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

    next();
  }
}
