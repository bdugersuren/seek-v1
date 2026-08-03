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
  RegisterRequest,
  RegisterResponse,
  ResendVerificationResponse,
  SessionsResponse,
  VerifyEmailResponse,
} from "@seek/contracts";
import { EmailDeliveryService } from "./email-delivery.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailDelivery: EmailDeliveryService,
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

  // Бүртгүүлэх: email баталгаажуулсны дараа ACTIVE болно.
  async register(
    dto: RegisterRequest,
    ip?: string,
    userAgent?: string,
  ): Promise<RegisterResponse> {
    const canonicalEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.userAccount.findUnique({
      where: { email: canonicalEmail },
    });
    if (existing) {
      throw new BadRequestException(
        "Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч байна.",
      );
    }

    const hashedPassword = await this.hashPassword(dto.password);

    // CANDIDATE дүрийг олох
    let candidateRole = await this.prisma.role.findUnique({
      where: { name: "CANDIDATE" },
    });

    // Хэрэв CANDIDATE байхгүй бол үүсгэнэ (safety backup)
    if (!candidateRole) {
      candidateRole = await this.prisma.role.create({
        data: {
          name: "CANDIDATE",
          description: "Үнэлүүлэгч",
        },
      });
    }

    const user = await (this.prisma.userAccount as any).create({
      data: {
        email: canonicalEmail,
        status: "PENDING_EMAIL_VERIFICATION",
        isEmailVerified: false,
        credentials: {
          create: {
            value: hashedPassword,
          },
        },
        roles: {
          create: {
            roleId: candidateRole.id,
          },
        },
      },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    const rawVerificationToken = await this.createEmailVerificationToken(
      user.id,
    );

    await this.logEvent(
      user.id,
      "ACCOUNT_CREATED",
      ip || null,
      userAgent || null,
      `Email: ${canonicalEmail}`,
    );

    await this.sendVerificationEmail(canonicalEmail, rawVerificationToken);

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      emailVerificationRequired: true,
    };
  }

  // Нэвтрэх (Login)
  async login(
    dto: LoginRequest,
    ip?: string,
    userAgent?: string,
  ): Promise<{ response: LoginResponse; refreshToken: string }> {
    const canonicalEmail = dto.email.toLowerCase().trim();
    const user = (await this.prisma.userAccount.findUnique({
      where: { email: canonicalEmail },
      include: { 
        credentials: true,
        roles: {
          include: { role: true }
        }
      },
    })) as any;

    const genericError = new UnauthorizedException(
      "Имэйл эсвэл нууц үг буруу байна.",
    );

    if (!user) {
      await this.logEvent(
        null,
        "LOGIN_FAILED",
        ip,
        userAgent,
        `Email: ${canonicalEmail}`,
      );
      throw genericError;
    }

    if (!user.isEmailVerified || user.status === "PENDING_EMAIL_VERIFICATION") {
      await this.logEvent(
        user.id,
        "LOGIN_BLOCKED_EMAIL_UNVERIFIED",
        ip,
        userAgent,
        `Email: ${canonicalEmail}`,
      );
      throw new UnauthorizedException(
        "Имэйл хаягаа баталгаажуулсны дараа нэвтэрнэ үү.",
      );
    }

    if (user.status !== "ACTIVE") {
      await this.logEvent(
        user.id,
        "LOGIN_FAILED",
        ip,
        userAgent,
        `Inactive account Email: ${canonicalEmail}`,
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

    const roleNames = user.roles.map((r: any) => r.role.name);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      session_id: session.id,
      roles: roleNames,
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
          roles: roleNames,
        } as any,
      },
      refreshToken: rawRefreshToken,
    };
  }

  async verifyEmail(
    rawToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<VerifyEmailResponse> {
    if (!rawToken) {
      throw new BadRequestException("Баталгаажуулах токен шаардлагатай.");
    }

    const incomingHash = this.hashOpaqueToken(rawToken);

    await this.prisma.$transaction(async (tx) => {
      const db = tx as any;
      const storedToken = await db.emailVerificationToken.findUnique({
        where: { tokenHash: incomingHash },
        include: { userAccount: true },
      });

      if (
        !storedToken ||
        storedToken.consumedAt ||
        new Date() > storedToken.expiresAt
      ) {
        await tx.securityEvent.create({
          data: {
            userAccountId: storedToken?.userAccountId || null,
            eventType: "EMAIL_VERIFICATION_FAILED",
            ipAddress: ip || null,
            userAgent: userAgent || null,
            payload: storedToken ? `TokenId: ${storedToken.id}` : "Unknown token",
          },
        });
        throw new BadRequestException(
          "Баталгаажуулах холбоос хүчингүй эсвэл хугацаа дууссан байна.",
        );
      }

      await db.emailVerificationToken.update({
        where: { id: storedToken.id },
        data: { consumedAt: new Date() },
      });

      await db.userAccount.update({
        where: { id: storedToken.userAccountId },
        data: {
          isEmailVerified: true,
          status:
            storedToken.userAccount.status === "PENDING_EMAIL_VERIFICATION"
              ? "ACTIVE"
              : storedToken.userAccount.status,
        },
      });

      await tx.securityEvent.create({
        data: {
          userAccountId: storedToken.userAccountId,
          eventType: "EMAIL_VERIFIED",
          ipAddress: ip || null,
          userAgent: userAgent || null,
          payload: `TokenId: ${storedToken.id}`,
        },
      });
    });

    return { success: true };
  }

  async resendVerification(
    email: string,
    ip?: string,
    userAgent?: string,
  ): Promise<ResendVerificationResponse> {
    const canonicalEmail = email.toLowerCase().trim();
    const user = await (this.prisma.userAccount as any).findUnique({
      where: { email: canonicalEmail },
    });

    // Enumeration-оос хамгаалж үргэлж success буцаана.
    if (!user || user.isEmailVerified) {
      return { success: true };
    }

    const rawVerificationToken = await this.createEmailVerificationToken(user.id);
    await this.sendVerificationEmail(canonicalEmail, rawVerificationToken);

    await this.logEvent(
      user.id,
      "EMAIL_VERIFICATION_RESENT",
      ip || null,
      userAgent || null,
      `Email: ${canonicalEmail}`,
    );

    return { success: true };
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
        include: { 
          session: { 
            include: { 
              userAccount: {
                include: {
                  roles: {
                    include: { role: true }
                  }
                }
              } 
            } 
          } 
        },
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

      const roleNames = session.userAccount.roles.map((r: any) => r.role.name);

      const accessToken = await this.jwtService.signAsync({
        sub: session.userAccountId,
        session_id: session.id,
        roles: roleNames,
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

  async listSessions(userId: string): Promise<SessionsResponse> {
    const sessions = await this.prisma.session.findMany({
      where: { userAccountId: userId },
      orderBy: { lastUsedAt: "desc" },
      take: 50,
    });

    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        userAgentSummary: session.userAgentSummary,
        ipAddressSummary: session.ipAddressSummary,
        createdAt: session.createdAt.toISOString(),
        lastUsedAt: session.lastUsedAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        revokedAt: session.revokedAt?.toISOString() || null,
        revocationReason: session.revocationReason,
      })),
    };
  }

  async revokeSession(
    userId: string,
    sessionId: string,
    reason = "USER_REVOKED",
  ): Promise<void> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userAccountId: userId,
      },
    });

    if (!session) {
      throw new UnauthorizedException("Сесс олдсонгүй.");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: sessionId },
        data: {
          revokedAt: new Date(),
          revocationReason: reason,
        },
      });

      await tx.refreshToken.updateMany({
        where: { sessionId },
        data: { revokedAt: new Date() },
      });

      await tx.securityEvent.create({
        data: {
          userAccountId: userId,
          eventType: "SESSION_REVOKED",
          payload: `Session: ${sessionId}, Reason: ${reason}`,
        },
      });
    });
  }

  async logoutAll(userId: string, reason = "LOGOUT_ALL"): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const sessions = await tx.session.findMany({
        where: {
          userAccountId: userId,
          revokedAt: null,
        },
        select: { id: true },
      });

      const sessionIds = sessions.map((session) => session.id);

      await tx.session.updateMany({
        where: {
          userAccountId: userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
          revocationReason: reason,
        },
      });

      if (sessionIds.length > 0) {
        await tx.refreshToken.updateMany({
          where: { sessionId: { in: sessionIds } },
          data: { revokedAt: new Date() },
        });
      }

      await tx.securityEvent.create({
        data: {
          userAccountId: userId,
          eventType: "LOGOUT_ALL_COMPLETED",
          payload: `Sessions: ${sessionIds.length}`,
        },
      });
    });
  }

  // Одоогийн хэрэглэгч
  async getCurrentUser(userId: string): Promise<CurrentUserResponse> {
    const user = await this.prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });
    if (!user) {
      throw new UnauthorizedException("Хэрэглэгч олдсонгүй.");
    }
    const roleNames = user.roles.map((r: any) => r.role.name);
    return {
      id: user.id,
      email: user.email,
      status: user.status,
      roles: roleNames,
    } as any;
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

  private hashOpaqueToken(rawToken: string): string {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
  }

  private async createEmailVerificationToken(userId: string): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashOpaqueToken(rawToken);
    const ttlHours = parseInt(
      process.env.AUTH_EMAIL_VERIFICATION_TTL_HOURS || "24",
      10,
    );
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    await (this.prisma as any).emailVerificationToken.create({
      data: {
        userAccountId: userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const publicAppUrl =
      process.env.AUTH_PUBLIC_APP_URL || "http://localhost:3001";
    const verificationUrl = `${publicAppUrl.replace(/\/$/, "")}/verify-email?token=${token}`;

    await this.emailDelivery.send({
      to: email,
      subject: "seek.mn email баталгаажуулалт",
      text: [
        "seek.mn бүртгэлээ баталгаажуулна уу.",
        "",
        `Баталгаажуулах холбоос: ${verificationUrl}`,
        "",
        "Хэрэв та энэ бүртгэлийг үүсгээгүй бол энэ имэйлийг үл тооно уу.",
      ].join("\n"),
    });
  }
}
