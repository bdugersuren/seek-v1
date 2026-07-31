import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "./prisma.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

describe("AuthService Unit Tests", () => {
  let service: AuthService;

  const mockPrisma: any = {
    $transaction: jest.fn((cb) => cb(mockPrisma)),
    userAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    credential: {
      create: jest.fn(),
    },
    session: {
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    securityEvent: {
      create: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
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
        status: "ACTIVE",
      });

      const res = await service.register({
        email: "test@seek.mn",
        password: "password123",
      });
      expect(res.id).toBe("user-1");
      expect(res.status).toBe("ACTIVE");
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
        credentials: [{ type: "PASSWORD", value: hashedPassword }],
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
