import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RateLimitService } from "./rate-limit.service";
import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  SessionsResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@seek/contracts";

@Controller("auth")
export class AuthController {
  private readonly cookieName = process.env.AUTH_COOKIE_NAME || "refresh_token";

  constructor(
    private readonly authService: AuthService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Post("register")
  async register(
    @Body() dto: RegisterRequest,
    @Req() req: Request,
  ): Promise<RegisterResponse> {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    this.rateLimit.assertAllowed(
      "register",
      `${ip || "unknown"}:${dto.email.toLowerCase().trim()}`,
    );
    return this.authService.register(dto, ip, userAgent);
  }

  @Post("verify-email")
  @HttpCode(200)
  async verifyEmail(
    @Body() dto: VerifyEmailRequest,
    @Req() req: Request,
  ): Promise<VerifyEmailResponse> {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    return this.authService.verifyEmail(dto.token, ip, userAgent);
  }

  @Post("resend-verification")
  @HttpCode(200)
  async resendVerification(
    @Body() dto: ResendVerificationRequest,
    @Req() req: Request,
  ): Promise<ResendVerificationResponse> {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    this.rateLimit.assertAllowed(
      "resend-verification",
      `${ip || "unknown"}:${dto.email.toLowerCase().trim()}`,
    );
    return this.authService.resendVerification(dto.email, ip, userAgent);
  }

  @Post("login")
  async login(
    @Body() dto: LoginRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    this.rateLimit.assertAllowed(
      "login",
      `${ip || "unknown"}:${dto.email.toLowerCase().trim()}`,
    );

    const { response, refreshToken } = await this.authService.login(
      dto,
      ip,
      userAgent,
    );

    res.cookie(this.cookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite:
        (process.env.AUTH_COOKIE_SAME_SITE as "lax" | "strict" | "none") ||
        "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return response;
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponse> {
    const refreshToken = req.cookies?.[this.cookieName];
    if (!refreshToken) {
      throw new UnauthorizedException(
        "Шаардлагатай refresh token байхгүй байна.",
      );
    }

    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const { response, newRefreshToken } = await this.authService.refresh(
      refreshToken,
      ip,
      userAgent,
    );

    res.cookie(this.cookieName, newRefreshToken, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite:
        (process.env.AUTH_COOKIE_SAME_SITE as "lax" | "strict" | "none") ||
        "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return response;
  }

  @Post("logout")
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const refreshToken = req.cookies?.[this.cookieName];
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (refreshToken) {
      await this.authService.logout(refreshToken, ip, userAgent);
    }

    res.clearCookie(this.cookieName, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite:
        (process.env.AUTH_COOKIE_SAME_SITE as "lax" | "strict" | "none") ||
        "lax",
      path: "/",
    });

    return { success: true };
  }

  @Get("sessions")
  async sessions(@Req() req: Request): Promise<SessionsResponse> {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      throw new UnauthorizedException("Нэвтрээгүй байна.");
    }
    return this.authService.listSessions(userId);
  }

  @Post("sessions/:sessionId/revoke")
  @HttpCode(200)
  async revokeSession(
    @Param("sessionId") sessionId: string,
    @Req() req: Request,
  ): Promise<{ success: boolean }> {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      throw new UnauthorizedException("Нэвтрээгүй байна.");
    }
    await this.authService.revokeSession(userId, sessionId, "USER_REVOKED");
    return { success: true };
  }

  @Post("logout-all")
  @HttpCode(200)
  async logoutAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      throw new UnauthorizedException("Нэвтрээгүй байна.");
    }

    await this.authService.logoutAll(userId, "LOGOUT_ALL");
    res.clearCookie(this.cookieName, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite:
        (process.env.AUTH_COOKIE_SAME_SITE as "lax" | "strict" | "none") ||
        "lax",
      path: "/",
    });
    return { success: true };
  }

  @Get("me")
  async me(@Req() req: Request): Promise<CurrentUserResponse> {
    // Gateway-ээс шалгагдаад дамжиж ирсэн x-user-id header-ийг уншина
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      throw new UnauthorizedException("Нэвтрээгүй байна.");
    }
    return this.authService.getCurrentUser(userId);
  }
}
