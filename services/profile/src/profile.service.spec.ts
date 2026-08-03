import { ProfileService } from "./profile.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

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
    service = new ProfileService(prisma);
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
      country: "Mongolia",
      preferredLanguage: "mn",
      metadata: {},
    });

    const status = await service.getCompletionStatus("user-1");

    expect(status).toEqual({
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

  it("allows free assessment gate after profile completion", async () => {
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
      allowed: true,
      requiredAction: "START",
    });
  });

  // 4. Verification submit/approve/reject tests
  describe("Verification Workflow", () => {
    it("allows candidate to submit a verification request", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue(null);
      prisma.profileVerification.create.mockResolvedValue({
        id: "ver-1",
        profileId: "profile-123",
        type: "IDENTITY",
        status: "SUBMITTED",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await service.submitVerificationRequest("user-1", "IDENTITY");
      expect(res.status).toBe("SUBMITTED");
      expect(prisma.profileVerification.create).toHaveBeenCalledWith({
        data: {
          profileId: "profile-123",
          type: "IDENTITY",
          status: "SUBMITTED",
        },
      });
    });

    it("throws error when candidate submits duplicate verification request", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileVerification.findFirst.mockResolvedValue({ status: "SUBMITTED" });

      await expect(service.submitVerificationRequest("user-1", "IDENTITY"))
        .rejects.toThrow(BadRequestException);
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
        storageKey: "docs/id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
        status: "UPLOADED",
        uploadedAt: new Date(),
      });

      const res = await service.addDocument("user-1", {
        type: "IDENTITY",
        name: "id.pdf",
        storageKey: "docs/id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
      });

      expect(res.name).toBe("id.pdf");
      expect(prisma.profileDocument.create).toHaveBeenCalled();
    });

    it("allows deleting document metadata", async () => {
      prisma.userProfile.findUnique.mockResolvedValue({ id: "profile-123", userId: "user-1" });
      prisma.profileDocument.findUnique.mockResolvedValue({
        id: "doc-1",
        profileId: "profile-123",
        name: "id.pdf",
      });

      await service.deleteDocument("user-1", "doc-1");
      expect(prisma.profileDocument.delete).toHaveBeenCalledWith({
        where: { id: "doc-1" },
      });
    });
  });
});
