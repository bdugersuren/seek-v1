import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { PrismaService } from "./prisma.service";
import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  CurrentUserResponse,
} from "@seek/contracts";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Нууц үг шалгах, шифрлэх
  async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new BadRequestException(
        "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх шаардлагатай.",
      );
    }
    const rounds = parseInt(process.env.AUTH_PASSWORD_HASH_ROUNDS || "10", 10);
    return bcrypt.hash(password, rounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Бүртгүүлэх (Спринт 4-ийн хүрээнд mock бүртгэлийг db-д үүсгэнэ)
  async register(dto: LoginRequest): Promise<CurrentUserResponse> {
    const canonicalEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.userAccount.findUnique({
      where: { email: canonicalEmail },
    });
    if (existing) {
      throw new BadRequestException(
        "Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч байна.",
      );
    }

    const hashedPassword = await this.hashPassword(
      dto.password || "default_secure_pass",
    );

    const user = await this.prisma.userAccount.create({
      data: {
        email: canonicalEmail,
        status: "ACTIVE",
        credentials: {
          create: {
            value: hashedPassword,
          },
        },
      },
    });

    await this.logEvent(
      user.id,
      "ACCOUNT_CREATED",
      null,
      null,
      `Email: ${canonicalEmail}`,
    );

    return {
      id: user.id,
      email: user.email,
      status: user.status,
    };
  }

  // Нэвтрэх (Login)
  async login(
    dto: LoginRequest,
    ip?: string,
    userAgent?: string,
  ): Promise<{ response: LoginResponse; refreshToken: string }> {
    const canonicalEmail = dto.email.toLowerCase().trim();
    const user = await this.prisma.userAccount.findUnique({
      where: { email: canonicalEmail },
      include: { credentials: true },
    });

    const genericError = new UnauthorizedException(
      "Имэйл эсвэл нууц үг буруу байна.",
    );

    if (!user || user.status !== "ACTIVE") {
      await this.logEvent(
        user?.id || null,
        "LOGIN_FAILED",
        ip,
        userAgent,
        `Email: ${canonicalEmail}`,
      );
      throw genericError;
    }

    const pwdCred = user.credentials.find((c) => c.type === "PASSWORD");
    if (!pwdCred) {
      throw genericError;
    }

    const isMatch = await this.verifyPassword(
      dto.password || "",
      pwdCred.value,
    );
    if (!isMatch) {
      await this.logEvent(
        user.id,
        "LOGIN_FAILED",
        ip,
        userAgent,
        `Incorrect password for Email: ${canonicalEmail}`,
      );
      throw genericError;
    }

    // Session & Tokens
    const familyId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.session.create({
      data: {
        userAccountId: user.id,
        refreshTokenFamilyId: familyId,
        ipAddressSummary: ip || null,
        userAgentSummary: userAgent || null,
        expiresAt,
      },
    });

    const rawRefreshToken = crypto.randomBytes(32).toString("hex");
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(rawRefreshToken)
      .digest("hex");

    await this.prisma.refreshToken.create({
      data: {
        sessionId: session.id,
        tokenHash: hashedRefreshToken,
        expiresAt,
      },
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      session_id: session.id,
      jti: crypto.randomUUID(),
    });

    await this.logEvent(
      user.id,
      "LOGIN_SUCCEEDED",
      ip,
      userAgent,
      `Session: ${session.id}`,
    );

    return {
      response: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
        },
      },
      refreshToken: rawRefreshToken,
    };
  }

  // Токен шинэчлэх (Refresh with Rotation and Reuse Detection)
  async refresh(
    rawToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ response: RefreshResponse; newRefreshToken: string }> {
    const incomingHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    return this.prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findUnique({
        where: { tokenHash: incomingHash },
        include: { session: { include: { userAccount: true } } },
      });

      if (!storedToken) {
        throw new UnauthorizedException("Буруу эсвэл хүчингүй токен.");
      }

      const { session } = storedToken;

      // Reuse Detection
      if (storedToken.rotatedAt || storedToken.revokedAt || session.revokedAt) {
        // Илрүүлсэн тохиолдолд уг сессийг бүхэлд нь цуцална
        await tx.session.update({
          where: { id: session.id },
          data: {
            revokedAt: new Date(),
            revocationReason: "REFRESH_TOKEN_REUSED",
          },
        });

        // Сессийн бүх токенуудыг хүчингүй болгоно
        await tx.refreshToken.updateMany({
          where: { sessionId: session.id },
          data: { revokedAt: new Date() },
        });

        await tx.securityEvent.create({
          data: {
            userAccountId: session.userAccountId,
            eventType: "REFRESH_TOKEN_REUSE_DETECTED",
            ipAddress: ip || null,
            userAgent: userAgent || null,
            payload: `Session: ${session.id}, TokenId: ${storedToken.id}`,
          },
        });

        throw new UnauthorizedException(
          "Токен дахин ашиглалт илэрлээ, сесс цуцлагдсан.",
        );
      }

      // Хүчинтэй хугацаа шалгах
      if (new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException("Токений хугацаа дууссан байна.");
      }

      // Rotate token
      await tx.refreshToken.update({
        where: { id: storedToken.id },
        data: { rotatedAt: new Date() },
      });

      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const rawRefreshToken = crypto.randomBytes(32).toString("hex");
      const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(rawRefreshToken)
        .digest("hex");

      await tx.refreshToken.create({
        data: {
          sessionId: session.id,
          tokenHash: hashedRefreshToken,
          expiresAt: newExpiresAt,
        },
      });

      // Update session activity
      await tx.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      });

      const accessToken = await this.jwtService.signAsync({
        sub: session.userAccountId,
        session_id: session.id,
        jti: crypto.randomUUID(),
      });

      await tx.securityEvent.create({
        data: {
          userAccountId: session.userAccountId,
          eventType: "TOKEN_REFRESHED",
          ipAddress: ip || null,
          userAgent: userAgent || null,
          payload: `Session: ${session.id}`,
        },
      });

      return {
        response: { accessToken },
        newRefreshToken: rawRefreshToken,
      };
    });
  }

  // Гарах (Logout)
  async logout(
    rawToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    const incomingHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: incomingHash },
      include: { session: true },
    });

    if (storedToken) {
      await this.prisma.session.update({
        where: { id: storedToken.sessionId },
        data: {
          revokedAt: new Date(),
          revocationReason: "LOGOUT",
        },
      });

      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      await this.logEvent(
        storedToken.session.userAccountId,
        "LOGOUT_COMPLETED",
        ip,
        userAgent,
        `Session: ${storedToken.sessionId}`,
      );
    }
  }

  // Одоогийн хэрэглэгч
  async getCurrentUser(userId: string): Promise<CurrentUserResponse> {
    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException("Хэрэглэгч олдсонгүй.");
    }
    return {
      id: user.id,
      email: user.email,
      status: user.status,
    };
  }

  private async logEvent(
    userId: string | null,
    eventType: string,
    ip: string | null,
    userAgent: string | null,
    payload?: string,
  ) {
    try {
      await this.prisma.securityEvent.create({
        data: {
          userAccountId: userId,
          eventType,
          ipAddress: ip,
          userAgent,
          payload,
        },
      });
    } catch (e) {
      console.error("Failed to log security event", e);
    }
  }
}
