import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "./prisma.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { EmailDeliveryService } from "./email-delivery.service";

describe("AuthService Unit Tests", () => {
  let service: AuthService;

  const mockPrisma: any = {
    $transaction: jest.fn((cb) => cb(mockPrisma)),
    userAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    credential: {
      create: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    emailVerificationToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    securityEvent: {
      create: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
  };

  const mockEmailDelivery = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: EmailDeliveryService, useValue: mockEmailDelivery },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe("Password Hashing & Verification", () => {
    it("should hash a password successfully", async () => {
      const hash = await service.hashPassword("securePassword123");
      expect(hash).toBeTruthy();
      expect(hash).not.toBe("securePassword123");
    });

    it("should fail hashing if password is too short", async () => {
      await expect(service.hashPassword("short")).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should verify correct password", async () => {
      const hash = await service.hashPassword("my_password");
      const isVerified = await service.verifyPassword("my_password", hash);
      expect(isVerified).toBe(true);
    });

    it("should reject wrong password", async () => {
      const hash = await service.hashPassword("my_password");
      const isVerified = await service.verifyPassword("wrong_password", hash);
      expect(isVerified).toBe(false);
    });
  });

  describe("User Registration", () => {
    it("should register active account when email is unique", async () => {
      mockPrisma.userAccount.findUnique.mockResolvedValue(null);
      mockPrisma.userAccount.create.mockResolvedValue({
        id: "user-1",
        email: "test@seek.mn",
        status: "PENDING_EMAIL_VERIFICATION",
        roles: [{ role: { name: "CANDIDATE" } }],
      });
      mockPrisma.role.findUnique.mockResolvedValue({
        id: "role-candidate",
        name: "CANDIDATE",
      });
      mockPrisma.emailVerificationToken.create.mockResolvedValue({
        id: "email-token-1",
      });

      const res = await service.register({
        email: "test@seek.mn",
        password: "password123",
      });
      expect(res.id).toBe("user-1");
      expect(res.status).toBe("PENDING_EMAIL_VERIFICATION");
      expect(res.emailVerificationRequired).toBe(true);
      expect(mockEmailDelivery.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "test@seek.mn",
          subject: expect.stringContaining("seek.mn"),
          text: expect.stringContaining("/verify-email?token="),
        }),
      );
    });

    it("should fail registration if email exists", async () => {
      mockPrisma.userAccount.findUnique.mockResolvedValue({
        id: "user-existing",
      });
      await expect(
        service.register({
          email: "existing@seek.mn",
          password: "password123",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("User Login", () => {
    it("should log in successfully with valid credentials", async () => {
      const hashedPassword = await service.hashPassword("password123");
      mockPrisma.userAccount.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@seek.mn",
        status: "ACTIVE",
        isEmailVerified: true,
        credentials: [{ type: "PASSWORD", value: hashedPassword }],
        roles: [{ role: { name: "CANDIDATE" } }],
      });
      mockPrisma.session.create.mockResolvedValue({ id: "session-1" });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-1" });
      mockJwt.signAsync.mockResolvedValue("mocked-jwt");

      const res = await service.login({
        email: "user@seek.mn",
        password: "password123",
      });
      expect(res.response.accessToken).toBe("mocked-jwt");
      expect(res.response.user.id).toBe("user-1");
      expect(res.refreshToken).toBeTruthy();
      expect(mockJwt.signAsync).toHaveBeenCalledWith(
        expect.not.objectContaining({
          exp: expect.anything(),
          iat: expect.anything(),
          iss: expect.anything(),
          aud: expect.anything(),
        }),
      );
    });

    it("should fail login with wrong credentials", async () => {
      mockPrisma.userAccount.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: "user@seek.mn", password: "password123" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should block login before email is verified", async () => {
      const hashedPassword = await service.hashPassword("password123");
      mockPrisma.userAccount.findUnique.mockResolvedValue({
        id: "user-1",
        email: "user@seek.mn",
        status: "PENDING_EMAIL_VERIFICATION",
        isEmailVerified: false,
        credentials: [{ type: "PASSWORD", value: hashedPassword }],
        roles: [{ role: { name: "CANDIDATE" } }],
      });

      await expect(
        service.login({ email: "user@seek.mn", password: "password123" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("Email Verification", () => {
    it("should verify a valid email verification token", async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: "email-token-1",
        userAccountId: "user-1",
        tokenHash: "hash",
        expiresAt: new Date(Date.now() + 60 * 1000),
        consumedAt: null,
        userAccount: {
          id: "user-1",
          status: "PENDING_EMAIL_VERIFICATION",
        },
      });
      mockPrisma.emailVerificationToken.update.mockResolvedValue({});
      mockPrisma.userAccount.update.mockResolvedValue({});

      const res = await service.verifyEmail("raw-token");
      expect(res.success).toBe(true);
      expect(mockPrisma.userAccount.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: {
          isEmailVerified: true,
          status: "ACTIVE",
        },
      });
    });
  });

  describe("Session Management", () => {
    it("should list sessions for a user", async () => {
      const now = new Date();
      mockPrisma.session.findMany.mockResolvedValue([
        {
          id: "session-1",
          userAgentSummary: "browser",
          ipAddressSummary: "127.0.0.1",
          createdAt: now,
          lastUsedAt: now,
          expiresAt: now,
          revokedAt: null,
          revocationReason: null,
        },
      ]);

      const res = await service.listSessions("user-1");
      expect(res.sessions).toHaveLength(1);
      expect(res.sessions[0].id).toBe("session-1");
      expect(mockPrisma.session.findMany).toHaveBeenCalledWith({
        where: { userAccountId: "user-1" },
        orderBy: { lastUsedAt: "desc" },
        take: 50,
      });
    });

    it("should revoke a session owned by the user", async () => {
      mockPrisma.session.findFirst.mockResolvedValue({
        id: "session-1",
        userAccountId: "user-1",
      });
      mockPrisma.session.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await service.revokeSession("user-1", "session-1");
      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: "session-1" },
        data: {
          revokedAt: expect.any(Date),
          revocationReason: "USER_REVOKED",
        },
      });
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { sessionId: "session-1" },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it("should revoke all active sessions for a user", async () => {
      mockPrisma.session.findMany.mockResolvedValue([
        { id: "session-1" },
        { id: "session-2" },
      ]);
      mockPrisma.session.updateMany.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await service.logoutAll("user-1");
      expect(mockPrisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          userAccountId: "user-1",
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
          revocationReason: "LOGOUT_ALL",
        },
      });
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { sessionId: { in: ["session-1", "session-2"] } },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("Token Refresh & Reuse Detection", () => {
    it("should refresh token successfully and rotate", async () => {
      const expiresAt = new Date(Date.now() + 60 * 1000);
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: "token-1",
        expiresAt,
        session: {
          id: "session-1",
          userAccountId: "user-1",
          userAccount: {
            id: "user-1",
            email: "user@seek.mn",
            status: "ACTIVE",
            roles: [{ role: { name: "CANDIDATE" } }],
          },
        },
      });
      mockPrisma.refreshToken.create.mockResolvedValue({ id: "token-2" });
      mockPrisma.session.update.mockResolvedValue({});
      mockJwt.signAsync.mockResolvedValue("new-jwt-token");

      const res = await service.refresh("valid-refresh-token");
      expect(res.response.accessToken).toBe("new-jwt-token");
      expect(res.newRefreshToken).toBeTruthy();
      expect(mockJwt.signAsync).toHaveBeenCalledWith(
        expect.not.objectContaining({
          exp: expect.anything(),
          iat: expect.anything(),
          iss: expect.anything(),
          aud: expect.anything(),
        }),
      );
    });

    it("should detect reuse and revoke the session and token family", async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        id: "token-used",
        rotatedAt: new Date(), // rotated/used
        session: {
          id: "session-1",
          userAccountId: "user-1",
        },
      });
      mockPrisma.session.update.mockResolvedValue({});
      mockPrisma.refreshToken.updateMany.mockResolvedValue({});

      await expect(service.refresh("used-token")).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { sessionId: "session-1" },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
