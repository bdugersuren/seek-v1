import { ProfileService } from "./profile.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";

describe("ProfileService", () => {
  const prisma: any = {
    userProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    profileVerification: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    profileDocument: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    profileAuditLog: {
      create: jest.fn(),
    },
  };

  let service: ProfileService;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.PROFILE_DEV_OTP_BYPASS_ENABLED;
    service = new ProfileService(prisma);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true, verified: true }),
    } as any);
  });

  // 1. Completion & Evaluation tests
  it("returns incomplete status when profile is missing", async () => {
    prisma.userProfile.findUnique.mockResolvedValue(null);

    const profile = await service.getCandidateProfile("user-1");

    expect(profile.isComplete).toBe(false);
    expect(profile.missingFields).toEqual(["displayName", "phoneNumber", "country", "preferredLanguage"]);
  });

  it("returns complete status when all required fields exist", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const status = await service.getCompletionStatus("user-1");

    expect(status).toEqual({
      basicComplete: true,
      trustedComplete: true,
      isComplete: true,
      missingFields: [],
      recommendedFields: ["organisation", "birthDate", "address"],
      nextAction: "CONTINUE",
    });
  });

  // 2. Profile Update & Validation tests
  it("upserts candidate profile data and records audit logs", async () => {
    prisma.userProfile.findUnique.mockResolvedValue(null);
    prisma.userProfile.upsert.mockResolvedValue({
      id: "profile-123",
      userId: "user-1",
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const profile = await service.updateCandidateProfile("user-1", {
      displayName: " Test User ",
      phoneNumber: " 99112233 ",
      country: " Mongolia ",
      preferredLanguage: " mn ",
    });

    expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: expect.objectContaining({
        displayName: "Test User",
        phoneNumber: "99112233",
        country: "Mongolia",
        preferredLanguage: "mn",
      }),
      create: expect.objectContaining({
        userId: "user-1",
        displayName: "Test User",
        phoneNumber: "99112233",
        country: "Mongolia",
        preferredLanguage: "mn",
      }),
    });

    expect(prisma.profileAuditLog.create).toHaveBeenCalled();
    expect(profile.isComplete).toBe(true);
  });

  it("does not clear omitted fields during partial profile update", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      id: "profile-123",
      userId: "user-1",
      displayName: "Existing User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: { keep: true },
    });
    prisma.userProfile.upsert.mockResolvedValue({
      id: "profile-123",
      userId: "user-1",
      displayName: "Updated User",
      phoneNumber: "99112233",
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: { keep: true },
    });

    await service.updateCandidateProfile("user-1", {
      displayName: "Updated User",
    });

    expect(prisma.userProfile.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: { displayName: "Updated User" },
      create: expect.objectContaining({
        userId: "user-1",
        displayName: "Updated User",
      }),
    });
  });

  it("rejects invalid preferred language", async () => {
    prisma.userProfile.findUnique.mockResolvedValue(null);

    await expect(service.updateCandidateProfile("user-1", {
      preferredLanguage: "jp",
    })).rejects.toThrow(BadRequestException);
  });

  it("rejects future birth date", async () => {
    prisma.userProfile.findUnique.mockResolvedValue(null);

    await expect(service.updateCandidateProfile("user-1", {
      birthDate: "2999-01-01",
    })).rejects.toThrow(BadRequestException);
  });

  // 3. Assessment Enrollment Gate tests
  it("blocks assessment gate when profile is incomplete", async () => {
    prisma.userProfile.findUnique.mockResolvedValue(null);

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "PROFILE_INCOMPLETE",
      requiredAction: "COMPLETE_PROFILE",
      missingProfileFields: ["displayName", "phoneNumber", "country", "preferredLanguage"],
    });
  });

  it("blocks paid assessment gate after profile completion", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 25000,
      accessType: "paid",
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "PAYMENT_REQUIRED",
      requiredAction: "PAY",
    });
  });

  it("blocks assessment gate when email is not verified", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
      emailVerified: false,
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "EMAIL_NOT_VERIFIED",
      requiredAction: "VERIFY_EMAIL",
    });
  });

  it("blocks assessment gate when already attempted", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
      alreadyAttempted: true,
      attemptId: "attempt-1",
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "ALREADY_ATTEMPTED",
      requiredAction: "VIEW_RESULT",
      attemptId: "attempt-1",
    });
  });

  it("blocks assessment gate when assessment is not open or user is not enrolled", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    await expect(service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
      assessmentOpen: false,
    })).resolves.toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "ASSESSMENT_NOT_OPEN",
      requiredAction: "WAIT",
    });

    await expect(service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
      enrolled: false,
    })).resolves.toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "NOT_ENROLLED",
      requiredAction: "ENROLL",
    });
  });

  it("blocks assessment gate when phone number is not verified", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: false,
      blockedReason: "PROFILE_INCOMPLETE",
      requiredAction: "COMPLETE_PROFILE",
      missingProfileFields: ["phoneNumberVerified"],
    });
  });

  it("allows free assessment gate after trusted profile completion", async () => {
    prisma.userProfile.findUnique.mockResolvedValue({
      displayName: "Test User",
      phoneNumber: "99112233",
      phoneNumberVerifiedAt: new Date(),
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const gate = await service.getAssessmentEnrollmentGate("user-1", "asm-1", {
      price: 0,
      accessType: "free",
    });

    expect(gate).toEqual({
      assessmentId: "asm-1",
      allowed: true,
      requiredAction: "START",
    });
  });

  // 4. Verification submit/approve/reject tests
  describe("Verification Workflow", () => {
    it("allows candidate to submit a verification request", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue(null);
      prisma.profileDocument.findFirst.mockResolvedValue({ id: "doc-1", type: "EMPLOYMENT", status: "UPLOADED" });
      prisma.profileVerification.create.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        type: "EMPLOYMENT",
        status: "SUBMITTED",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.submitVerificationRequest("user-1", "EMPLOYMENT");
      expect(res.status).toBe("SUBMITTED");
      expect(prisma.profileVerification.create).toHaveBeenCalledWith({
        data: {
          profileId: "profile-123",
          type: "EMPLOYMENT",
          status: "SUBMITTED",
          rejectedReason: null,
        },
      });
    });

    it("requires uploaded evidence for non-identity verification request", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue(null);
      prisma.profileDocument.findFirst.mockResolvedValue(null);

      await expect(service.submitVerificationRequest("user-1", "EMPLOYMENT"))
        .rejects.toThrow(BadRequestException);
      expect(prisma.profileVerification.create).not.toHaveBeenCalled();
    });

    it("throws error when candidate submits duplicate verification request", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue({ status: "SUBMITTED" });

      await expect(service.submitVerificationRequest("user-1", "IDENTITY"))
        .rejects.toThrow(BadRequestException);
    });

    it("allows resubmitting after rejected verification when evidence exists", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue(null);
      prisma.profileDocument.findFirst.mockResolvedValue({ id: "doc-1", type: "EDUCATION", status: "UPLOADED" });
      prisma.profileVerification.create.mockResolvedValue({
        id: "ver-2",
        profileId: "profile-123",
        type: "EDUCATION",
        status: "SUBMITTED",
        rejectedReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.submitVerificationRequest("user-1", "EDUCATION");

      expect(res.status).toBe("SUBMITTED");
      expect(prisma.profileVerification.findFirst).toHaveBeenCalledWith({
        where: {
          profileId: "profile-123",
          type: "EDUCATION",
          status: { in: ["SUBMITTED", "VERIFIED"] },
        },
      });
    });

    it("rejects invalid identity registry number before KYC", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue(null);

      await expect(service.submitVerificationRequest("user-1", "IDENTITY", "bad"))
        .rejects.toThrow(BadRequestException);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("allows admin to approve verification and updates profile verifiedAt", async () => {
      prisma.profileVerification.findUnique.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        status: "SUBMITTED",
        type: "IDENTITY",
        profile: { userId: "user-1" },
      });
      prisma.profileVerification.update.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        status: "VERIFIED",
        type: "IDENTITY",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.approveVerification("ver-1", "admin-1");
      expect(res.status).toBe("VERIFIED");
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { id: "profile-123" },
        data: { verifiedAt: expect.any(Date) },
      });
    });

    it("allows admin to reject verification with a reason", async () => {
      prisma.profileVerification.findUnique.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        status: "SUBMITTED",
        type: "IDENTITY",
        profile: { userId: "user-1" },
      });
      prisma.profileVerification.update.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        status: "REJECTED",
        rejectedReason: "Poor document quality",
        type: "IDENTITY",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.rejectVerification("ver-1", "admin-1", "Poor document quality");
      expect(res.status).toBe("REJECTED");
      expect(res.rejectedReason).toBe("Poor document quality");
    });
  });

  // 5. Document metadata CRUD tests
  describe("Document Metadata API", () => {
    it("allows adding document metadata", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileDocument.create.mockResolvedValue({
        id: "doc-1",
        profileId: "profile-123",
        type: "IDENTITY",
        name: "id.pdf",
        storageKey: "documents/user-1/id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
        status: "UPLOADED",
        uploadedAt: new Date(),
      });

      const res = await service.addDocument("user-1", {
        type: "IDENTITY",
        name: "id.pdf",
        storageKey: "documents/user-1/id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
      });

      expect(res.name).toBe("id.pdf");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/file/objects/verify"),
        expect.objectContaining({
          method: "POST",
        }),
      );
      expect(prisma.profileDocument.create).toHaveBeenCalled();
    });

    it("rejects document metadata for another user's storage key", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });

      await expect(service.addDocument("user-1", {
        type: "IDENTITY",
        name: "id.pdf",
        storageKey: "documents/user-2/id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
      })).rejects.toThrow(BadRequestException);
    });

    it("rejects invalid document mime type and size", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });

      await expect(service.addDocument("user-1", {
        type: "IDENTITY",
        name: "id.png",
        storageKey: "documents/user-1/id.png",
        mimeType: "image/png",
        sizeBytes: 1024,
      })).rejects.toThrow(BadRequestException);

      await expect(service.addDocument("user-1", {
        type: "IDENTITY",
        name: "empty.pdf",
        storageKey: "documents/user-1/empty.pdf",
        mimeType: "application/pdf",
        sizeBytes: 0,
      })).rejects.toThrow(BadRequestException);
    });

    it("allows deleting document metadata", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileDocument.findUnique.mockResolvedValue({
        id: "doc-1",
        profileId: "profile-123",
        name: "id.pdf",
        storageKey: "documents/user-1/id.pdf",
      });

      await service.deleteDocument("user-1", "doc-1");
      expect(prisma.profileDocument.delete).toHaveBeenCalledWith({
        where: { id: "doc-1" },
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/file/objects"),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  // 6. OTP Verification Workflow
  describe("OTP Verification Workflow", () => {
    it("sends phone OTP successfully and updates metadata", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({
        userId: "user-1",
        phoneNumber: "",
        metadata: {},
      });
      prisma.userProfile.upsert.mockResolvedValue({
        id: "profile-123",
        userId: "user-1",
        phoneNumber: "99112233",
        metadata: {
          phoneOtpHash: "hash",
          phoneOtpSalt: "salt",
          phoneOtpExpiresAt: new Date(Date.now() + 50000).toISOString(),
        },
      });

      const res = await service.sendPhoneOtp("user-1", "99112233");
      expect(res.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/integration/sms/send-otp"),
        expect.objectContaining({
          body: expect.stringMatching(/"phoneNumber":"99112233"/),
        }),
      );
      expect(prisma.userProfile.upsert).toHaveBeenCalledWith(expect.objectContaining({
        update: expect.objectContaining({
          metadata: expect.objectContaining({
            phoneOtpHash: expect.any(String),
            phoneOtpSalt: expect.any(String),
            phoneOtpAttemptCount: 0,
          }),
        }),
      }));
    });

    it("does not persist an OTP when the provider rejects delivery", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({
        userId: "user-1",
        phoneNumber: "",
        metadata: {},
      });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Provider unavailable",
        }),
      });

      await expect(service.sendPhoneOtp("user-1", "99112233")).rejects.toThrow(
        "Provider unavailable",
      );
      expect(prisma.userProfile.upsert).not.toHaveBeenCalled();
    });

    it("verifies phone OTP successfully and sets phoneNumberVerifiedAt", async () => {
      const salt = "salt";
      prisma.userProfile.findUnique.mockResolvedValue({
        id: "profile-123",
        userId: "user-1",
        phoneNumber: "99112233",
        metadata: {
          phoneOtpHash: hashOtpForTest("654321", salt),
          phoneOtpSalt: salt,
          phoneOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          phoneOtpAttemptCount: 0,
        },
      });

      const res = await service.verifyPhoneOtp("user-1", "654321");
      expect(res.success).toBe(true);
      expect(prisma.userProfile.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: {
          phoneNumberVerifiedAt: expect.any(Date),
          metadata: {},
        },
      });
    });

    it("throws error when verification code is wrong", async () => {
      const salt = "salt";
      prisma.userProfile.findUnique.mockResolvedValue({
        id: "profile-123",
        userId: "user-1",
        phoneNumber: "99112233",
        metadata: {
          phoneOtpHash: hashOtpForTest("654321", salt),
          phoneOtpSalt: salt,
          phoneOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          phoneOtpAttemptCount: 0,
        },
      });

      await expect(service.verifyPhoneOtp("user-1", "000000"))
        .rejects.toThrow(BadRequestException);
    });

    it("does not allow dev OTP bypass unless explicitly enabled", async () => {
      const salt = "salt";
      prisma.userProfile.findUnique.mockResolvedValue({
        id: "profile-123",
        userId: "user-1",
        phoneNumber: "99112233",
        metadata: {
          phoneOtpHash: hashOtpForTest("654321", salt),
          phoneOtpSalt: salt,
          phoneOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          phoneOtpAttemptCount: 0,
        },
      });

      await expect(service.verifyPhoneOtp("user-1", "123456"))
        .rejects.toThrow(BadRequestException);
    });
  });

  // 7. Auto KYC Verification
  describe("Auto KYC Verification", () => {
    it("automatically VERIFIES IDENTITY when KYC mock returns verified", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({
        id: "profile-123",
        userId: "user-1",
        displayName: "John Doe",
      });
      prisma.profileVerification.findFirst.mockResolvedValue(null);
      prisma.profileVerification.create.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        type: "IDENTITY",
        status: "VERIFIED",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // global.fetch mock yields verified: true from beforeEach setup
      const res = await service.submitVerificationRequest("user-1", "IDENTITY", "УБ90051532");
      expect(res.status).toBe("VERIFIED");
      expect(prisma.userProfile.update).toHaveBeenCalled();
      expect(prisma.profileAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "VERIFICATION_AUTO_APPROVED",
        }),
      });
    });
  });
});

function hashOtpForTest(code: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}
