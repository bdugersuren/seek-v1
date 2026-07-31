import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  CurrentUserResponse,
} from "@seek/contracts";

@Controller("auth")
export class AuthController {
  private readonly cookieName = process.env.AUTH_COOKIE_NAME || "refresh_token";

  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: LoginRequest): Promise<CurrentUserResponse> {
    return this.authService.register(dto);
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
