import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import {
  PROFILE_LANGUAGES,
  PROFILE_VERIFICATION_STATUSES,
  PROFILE_VERIFICATION_TYPES,
} from "@seek/contracts";
import type {
  AssessmentEnrollmentGateResponse,
  CandidateProfileResponse,
  ProfileCompletionStatus,
  ProfileMissingField,
  UpdateCandidateProfileRequest,
  ProfileVerificationResponse,
  ProfileDocumentResponse,
  ProfileVerificationStatus,
  ProfileVerificationType,
} from "@seek/contracts";
import { PrismaService } from "./prisma.service";
import { evaluateProfileCompletion } from "./completion-policy";

const INTEGRATION_URL = process.env.INTEGRATION_SERVICE_URL || "http://localhost:3130";
const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL || "http://localhost:3140";
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCK_MS = 15 * 60 * 1000;
const OTP_HOURLY_SEND_LIMIT = 5;
const ALLOWED_LANGUAGES = new Set<string>(PROFILE_LANGUAGES);
const ALLOWED_VERIFICATION_TYPES = new Set<string>(PROFILE_VERIFICATION_TYPES);
const ALLOWED_VERIFICATION_STATUSES = new Set<string>(PROFILE_VERIFICATION_STATUSES);
const ALLOWED_DOCUMENT_TYPES = ALLOWED_VERIFICATION_TYPES;
const ALLOWED_DOCUMENT_MIME_TYPES = new Set(["application/pdf"]);
const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;

async function callIntegrationApi<T>(path: string, body: any): Promise<T> {
  try {
    const res = await fetch(`${INTEGRATION_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Integration API failed with status ${res.status}`);
    }
    return await res.json() as T;
  } catch (err: any) {
    console.error(`[Integration Call Error] Path: ${path}, Err:`, err.message);
    throw new Error(`Интеграцийн үйлчилгээтэй холбогдож чадсангүй.`);
  }
}

async function callFileApi<T>(
  userId: string,
  path: string,
  body: any,
  method = "POST",
): Promise<T> {
  try {
    const res = await fetch(`${FILE_SERVICE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload.message || `File API failed with status ${res.status}`);
    }
    return payload as T;
  } catch (err: any) {
    throw new BadRequestException(err.message || "Файл үйлчилгээтэй холбогдож чадсангүй.");
  }
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get Candidate Profile (with safe metadata fallback)
  async getCandidateProfile(userId: string): Promise<CandidateProfileResponse> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    return this.toCandidateProfile(userId, profile);
  }

  // 2. Update Candidate Profile with validation and audit log
  async updateCandidateProfile(
    userId: string,
    dto: UpdateCandidateProfileRequest,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<CandidateProfileResponse> {
    const beforeProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const beforeStateJson = beforeProfile ? JSON.parse(JSON.stringify(beforeProfile)) : {};
    const updateData = buildProfileUpdateData(dto, beforeProfile);

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    const afterStateJson = JSON.parse(JSON.stringify(profile));

    // Evaluate completion changes and record audit event
    const oldCompletion = evaluateProfileCompletion(this.toCandidateProfile(userId, beforeProfile));
    const newCompletion = evaluateProfileCompletion(this.toCandidateProfile(userId, profile));

    // Audit Logging
    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: beforeProfile ? "PROFILE_UPDATED" : "PROFILE_CREATED",
      before: beforeStateJson,
      after: afterStateJson,
      ipAddress,
      userAgent,
    });

    if (oldCompletion.isComplete !== newCompletion.isComplete) {
      await this.writeAuditLog({
        profileId: profile.id,
        userId,
        actorUserId: userId,
        action: "PROFILE_COMPLETION_CHANGED",
        before: { isComplete: oldCompletion.isComplete },
        after: { isComplete: newCompletion.isComplete },
        ipAddress,
        userAgent,
      });
    }

    return this.toCandidateProfile(userId, profile);
  }

  // 3. Get Completion Status
  async getCompletionStatus(userId: string): Promise<ProfileCompletionStatus> {
    const profile = await this.getCandidateProfile(userId);
    return evaluateProfileCompletion(profile);
  }

  // 4. Assessment Enrollment Gate
  async getAssessmentEnrollmentGate(
    userId: string,
    assessmentId: string,
    input: {
      price?: number;
      accessType?: string;
      emailVerified?: boolean;
      enrolled?: boolean;
      assessmentOpen?: boolean;
      alreadyAttempted?: boolean;
      attemptId?: string;
    },
  ): Promise<AssessmentEnrollmentGateResponse> {
    const profile = await this.getCandidateProfile(userId);
    const completion = evaluateProfileCompletion(profile);

    if (input.emailVerified === false) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "EMAIL_NOT_VERIFIED",
        requiredAction: "VERIFY_EMAIL",
      };
    }

    if (!completion.isComplete) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "PROFILE_INCOMPLETE",
        requiredAction: "COMPLETE_PROFILE",
        missingProfileFields: completion.missingFields,
      };
    }

    if (input.alreadyAttempted === true) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "ALREADY_ATTEMPTED",
        requiredAction: "VIEW_RESULT",
        attemptId: input.attemptId,
      };
    }

    if (input.assessmentOpen === false) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "ASSESSMENT_NOT_OPEN",
        requiredAction: "WAIT",
      };
    }

    if (input.enrolled === false) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "NOT_ENROLLED",
        requiredAction: "ENROLL",
      };
    }

    if ((input.price ?? 0) > 0 || input.accessType === "paid") {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "PAYMENT_REQUIRED",
        requiredAction: "PAY",
      };
    }

    return {
      assessmentId,
      allowed: true,
      requiredAction: "START",
    };
  }

  // 5. Send SMS OTP
  async sendPhoneOtp(
    userId: string,
    phoneNumber: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!phoneNumber || !phoneNumber.trim()) {
      throw new BadRequestException("Утасны дугаар оруулна уу.");
    }
    
    const cleanPhone = phoneNumber.trim();
    const now = Date.now();
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    const currentMetadata = readMetadata(profile?.metadata);
    const lockedUntil = parseOptionalDate(currentMetadata.phoneOtpLockedUntil);
    if (lockedUntil && lockedUntil.getTime() > now) {
      throw new BadRequestException("OTP түр түгжигдсэн байна. Дараа дахин оролдоно уу.");
    }

    const lastSentAt = parseOptionalDate(currentMetadata.phoneOtpSentAt);
    if (lastSentAt && now - lastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
      throw new BadRequestException("OTP код дахин илгээхээс өмнө түр хүлээнэ үү.");
    }

    const sendWindowStartedAt = parseOptionalDate(currentMetadata.phoneOtpSendWindowStartedAt);
    const isSameWindow = Boolean(sendWindowStartedAt && now - sendWindowStartedAt.getTime() < 60 * 60 * 1000);
    const sendCount = isSameWindow ? Number(currentMetadata.phoneOtpSendCount || 0) : 0;
    if (sendCount >= OTP_HOURLY_SEND_LIMIT) {
      throw new BadRequestException("OTP код илгээх хязгаар түр хэтэрсэн байна.");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpSalt = randomBytes(16).toString("hex");
    const expiresAt = new Date(now + OTP_TTL_MS);

    // Call mock SMS provider via integration service
    const delivery = await callIntegrationApi<{ success: boolean; message?: string }>(
      "/integration/sms/send-otp",
      {
      phoneNumber: cleanPhone,
      code: otpCode,
      },
    );
    if (!delivery.success) {
      throw new BadRequestException(
        delivery.message || "OTP код илгээх боломжгүй байна.",
      );
    }

    const newMetadata: Record<string, any> = {
      ...currentMetadata,
      phoneNumber: cleanPhone,
      phoneOtpHash: hashOtp(otpCode, otpSalt),
      phoneOtpSalt: otpSalt,
      phoneOtpExpiresAt: expiresAt.toISOString(),
      phoneOtpSentAt: new Date(now).toISOString(),
      phoneOtpAttemptCount: 0,
      phoneOtpSendWindowStartedAt: isSameWindow
        ? sendWindowStartedAt?.toISOString()
        : new Date(now).toISOString(),
      phoneOtpSendCount: sendCount + 1,
    };
    delete newMetadata.phoneOtpCode;
    delete newMetadata.phoneOtpLockedUntil;

    const updatedProfile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        phoneNumber: cleanPhone,
        metadata: newMetadata,
      },
      create: {
        userId,
        phoneNumber: cleanPhone,
        metadata: newMetadata,
      },
    });
    await this.writeAuditLog({
      profileId: updatedProfile.id,
      userId,
      actorUserId: userId,
      action: "OTP_SENT_LOG",
      before: {},
      after: { expiresAt },
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: `Таны ${cleanPhone} дугаар руу баталгаажуулах код илгээгдлээ.`,
    };
  }

  // 6. Verify SMS OTP
  async verifyPhoneOtp(
    userId: string,
    code: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!code || !code.trim()) {
      throw new BadRequestException("Баталгаажуулах код оруулна уу.");
    }

    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Профайл олдсонгүй.");
    }

    const metadata = readMetadata(profile.metadata);
    const savedHash = metadata.phoneOtpHash;
    const savedSalt = metadata.phoneOtpSalt;
    const legacySavedCode = metadata.phoneOtpCode;
    const expiresAtStr = metadata.phoneOtpExpiresAt;
    const lockedUntil = parseOptionalDate(metadata.phoneOtpLockedUntil);

    if (lockedUntil && lockedUntil.getTime() > Date.now()) {
      throw new BadRequestException("OTP түр түгжигдсэн байна. Дараа дахин оролдоно уу.");
    }

    if ((!savedHash || !savedSalt) && !legacySavedCode || !expiresAtStr) {
      throw new BadRequestException("Идэвхтэй баталгаажуулах код олдсонгүй. Дахин илгээнэ үү.");
    }

    const expiresAt = new Date(expiresAtStr);
    if (Date.now() > expiresAt.getTime()) {
      throw new BadRequestException("Баталгаажуулах кодын хугацаа дууссан байна.");
    }

    const trimmedCode = code.trim();
    const matchesSavedCode = savedHash && savedSalt
      ? verifyOtp(trimmedCode, String(savedSalt), String(savedHash))
      : trimmedCode === legacySavedCode;
    const matchesDevBypass = isDevOtpBypassEnabled() && trimmedCode === "123456";

    if (!matchesSavedCode && !matchesDevBypass) {
      const attemptCount = Number(metadata.phoneOtpAttemptCount || 0) + 1;
      const nextMetadata = {
        ...metadata,
        phoneOtpAttemptCount: attemptCount,
        ...(attemptCount >= OTP_MAX_ATTEMPTS
          ? { phoneOtpLockedUntil: new Date(Date.now() + OTP_LOCK_MS).toISOString() }
          : {}),
      };
      await this.prisma.userProfile.update({
        where: { userId },
        data: { metadata: nextMetadata },
      });
      throw new BadRequestException("Баталгаажуулах код буруу байна.");
    }

    const cleanMetadata = { ...metadata };
    delete cleanMetadata.phoneOtpCode;
    delete cleanMetadata.phoneOtpHash;
    delete cleanMetadata.phoneOtpSalt;
    delete cleanMetadata.phoneOtpExpiresAt;
    delete cleanMetadata.phoneOtpSentAt;
    delete cleanMetadata.phoneOtpAttemptCount;
    delete cleanMetadata.phoneOtpLockedUntil;

    await this.prisma.userProfile.update({
      where: { userId },
      data: {
        phoneNumberVerifiedAt: new Date(),
        metadata: cleanMetadata,
      },
    });

    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: "PROFILE_UPDATED",
      before: { phoneNumberVerifiedAt: profile.phoneNumberVerifiedAt },
      after: { phoneNumberVerifiedAt: new Date() },
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: "Утасны дугаар амжилттай баталгаажлаа.",
    };
  }

  // 7. Verification Workflow - Candidate Submit (with auto-KYC check)
  async submitVerificationRequest(
    userId: string,
    type: string,
    registryNumber?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileVerificationResponse> {
    validateVerificationType(type);
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Профайл олдсонгүй.");
    }

    // Check existing pending/verified verifications
    const existing = await this.prisma.profileVerification.findFirst({
      where: {
        profileId: profile.id,
        type,
        status: { in: ["SUBMITTED", "VERIFIED"] },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Энэ төрлийн баталгаажуулалт хэдийнэ илгээгдсэн эсвэл баталгаажсан байна. Төлөв: ${existing.status}`,
      );
    }

    if (type !== "IDENTITY") {
      await this.assertVerificationEvidence(profile.id, type);
    }

    let status = "SUBMITTED";
    let rejectedReason: string | null = null;
    let auditAction = "VERIFICATION_SUBMITTED";

    if (registryNumber) {
      validateRegistryNumber(registryNumber);
      const currentMetadata = readMetadata(profile.metadata);
      await this.prisma.userProfile.update({
        where: { id: profile.id },
        data: {
          metadata: {
            ...currentMetadata,
            registryNumber: registryNumber.trim(),
          },
        },
      });
    }

    // Auto KYC check for IDENTITY
    if (type === "IDENTITY") {
      const regNum = registryNumber || readMetadata(profile.metadata).registryNumber || "";
      validateRegistryNumber(regNum);
      try {
        const kycResult = await callIntegrationApi<{ verified: boolean; reason?: string | null }>(
          "/integration/kyc/verify-identity",
          {
            registryNumber: regNum,
            fullName: profile.displayName || "",
          }
        );

        if (kycResult.verified) {
          status = "VERIFIED";
          auditAction = "VERIFICATION_AUTO_APPROVED";
          await this.prisma.userProfile.update({
            where: { id: profile.id },
            data: { verifiedAt: new Date() },
          });
        } else {
          status = "REJECTED";
          auditAction = "VERIFICATION_AUTO_REJECTED";
          rejectedReason = kycResult.reason || "KYC баталгаажуулалт амжилтгүй.";
        }
      } catch (err: any) {
        console.warn(`[KYC Auto Check Failed] Falling back to manual review: ${err.message}`);
      }
    }

    const verification = await this.prisma.profileVerification.create({
      data: {
        profileId: profile.id,
        type,
        status,
        rejectedReason,
      },
    });

    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: auditAction,
      before: {},
      after: JSON.parse(JSON.stringify(verification)),
      ipAddress,
      userAgent,
    });

    return this.toVerificationResponse(verification);
  }

  // 8. Verification Workflow - Candidate Get
  async getVerificationRequests(userId: string): Promise<ProfileVerificationResponse[]> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    const list = await this.prisma.profileVerification.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return list.map(v => this.toVerificationResponse(v));
  }

  private async assertVerificationEvidence(profileId: string, type: string): Promise<void> {
    const document = await this.prisma.profileDocument.findFirst({
      where: {
        profileId,
        type,
        status: { in: ["UPLOADED", "VERIFIED"] },
      },
    });

    if (!document) {
      throw new BadRequestException("Баталгаажуулах хүсэлт илгээхээс өмнө холбогдох баримт бичгээ оруулна уу.");
    }
  }

  // 9. Verification Workflow - Admin List
  async getAdminVerifications(status?: string): Promise<ProfileVerificationResponse[]> {
    if (status) {
      validateVerificationStatus(status);
    }
    const list = await this.prisma.profileVerification.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return list.map(v => this.toVerificationResponse(v));
  }

  // 10. Verification Workflow - Admin Approve
  async approveVerification(
    id: string,
    reviewerId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileVerificationResponse> {
    const verification = await this.prisma.profileVerification.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!verification) {
      throw new NotFoundException("Баталгаажуулах хүсэлт олдсонгүй.");
    }

    if (verification.status !== "SUBMITTED") {
      throw new BadRequestException("Зөвхөн хянагдаж буй хүсэлтийг баталгаажуулах боломжтой.");
    }

    const updated = await this.prisma.profileVerification.update({
      where: { id },
      data: {
        status: "VERIFIED",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    if (verification.type === "IDENTITY") {
      await this.prisma.userProfile.update({
        where: { id: verification.profileId },
        data: { verifiedAt: new Date() },
      });
    }

    await this.writeAuditLog({
      profileId: verification.profileId,
      userId: verification.profile.userId,
      actorUserId: reviewerId,
      action: "VERIFICATION_APPROVED",
      before: JSON.parse(JSON.stringify(verification)),
      after: JSON.parse(JSON.stringify(updated)),
      ipAddress,
      userAgent,
    });

    return this.toVerificationResponse(updated);
  }

  // 11. Verification Workflow - Admin Reject
  async rejectVerification(
    id: string,
    reviewerId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileVerificationResponse> {
    if (!reason || !reason.trim()) {
      throw new BadRequestException("Татгалзсан шалтгаан заавал оруулна уу.");
    }

    const verification = await this.prisma.profileVerification.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!verification) {
      throw new NotFoundException("Баталгаажуулах хүсэлт олдсонгүй.");
    }

    if (verification.status !== "SUBMITTED") {
      throw new BadRequestException("Зөвхөн хянагдаж буй хүсэлтийг татгалзах боломжтой.");
    }

    const updated = await this.prisma.profileVerification.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedReason: reason,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    await this.writeAuditLog({
      profileId: verification.profileId,
      userId: verification.profile.userId,
      actorUserId: reviewerId,
      action: "VERIFICATION_REJECTED",
      before: JSON.parse(JSON.stringify(verification)),
      after: JSON.parse(JSON.stringify(updated)),
      ipAddress,
      userAgent,
    });

    return this.toVerificationResponse(updated);
  }

  // 12. Document Metadata API - List
  async getDocuments(userId: string): Promise<ProfileDocumentResponse[]> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    const list = await this.prisma.profileDocument.findMany({
      where: { profileId: profile.id },
      orderBy: { uploadedAt: "desc" },
    });

    return list.map(d => this.toDocumentResponse(d));
  }

  // 13. Document Metadata API - Create
  async addDocument(
    userId: string,
    dto: { type: string; name: string; storageKey: string; mimeType: string; sizeBytes: number },
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileDocumentResponse> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Профайл олдсонгүй.");
    }

    if (!dto.name || !dto.storageKey || !dto.type) {
      throw new BadRequestException("Шаардлагатай баримт бичгийн талбарууд дутуу байна.");
    }
    validateDocumentInput(userId, dto);
    await callFileApi(userId, "/file/objects/verify", {
      storageKey: dto.storageKey,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    });

    const document = await this.prisma.profileDocument.create({
      data: {
        profileId: profile.id,
        type: dto.type,
        name: dto.name,
        storageKey: dto.storageKey,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        status: "UPLOADED",
      },
    });

    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: "DOCUMENT_ADDED",
      before: {},
      after: JSON.parse(JSON.stringify(document)),
      ipAddress,
      userAgent,
    });

    return this.toDocumentResponse(document);
  }

  // 14. Document Metadata API - Delete
  async deleteDocument(
    userId: string,
    documentId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Профайл олдсонгүй.");
    }

    const document = await this.prisma.profileDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException("Бичиг баримт олдсонгүй.");
    }

    if (document.profileId !== profile.id) {
      throw new BadRequestException("Энэ бичиг баримтыг устгах эрхгүй байна.");
    }

    await this.prisma.profileDocument.delete({
      where: { id: documentId },
    });

    await callFileApi(userId, "/file/objects", {
      storageKey: document.storageKey,
    }, "DELETE");

    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: "DOCUMENT_REMOVED",
      before: JSON.parse(JSON.stringify(document)),
      after: {},
      ipAddress,
      userAgent,
    });
  }

  // Helper: Write Audit Log
  private async writeAuditLog(params: {
    profileId: string;
    userId: string;
    actorUserId: string;
    action: string;
    before: any;
    after: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    console.log(`[AuditLog] Action: ${params.action}, ProfileID: ${params.profileId}, ActorUserID: ${params.actorUserId}`);

    await this.prisma.profileAuditLog.create({
      data: {
        profileId: params.profileId,
        userId: params.userId,
        actorUserId: params.actorUserId,
        action: params.action,
        before: params.before,
        after: params.after,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  }

  // Mapper: UserProfile entity -> CandidateProfileResponse
  private toCandidateProfile(
    userId: string,
    profile: any | null,
  ): CandidateProfileResponse {
    const metadata = readMetadata(profile?.metadata);

    const phoneNumber = profile?.phoneNumber || metadata.phoneNumber || null;
    const organisation = profile?.organisation || metadata.organisation || null;

    const response: CandidateProfileResponse = {
      userId,
      displayName: profile?.displayName || null,
      firstName: profile?.firstName || null,
      lastName: profile?.lastName || null,
      phoneNumber,
      phoneNumberVerifiedAt: profile?.phoneNumberVerifiedAt ? profile.phoneNumberVerifiedAt.toISOString() : null,
      organisation,
      birthDate: profile?.birthDate ? profile.birthDate.toISOString().split("T")[0] : null,
      gender: profile?.gender || null,
      country: profile?.country || null,
      address: profile?.address || null,
      preferredLanguage: profile?.preferredLanguage || null,
      completionStatus: profile?.completionStatus || null,
      verifiedAt: profile?.verifiedAt ? profile.verifiedAt.toISOString() : null,
      metadata: metadata,
      basicComplete: false,
      trustedComplete: false,
      isComplete: false,
      missingFields: [],
      recommendedFields: [],
    };

    const completion = evaluateProfileCompletion(response);
    response.basicComplete = completion.basicComplete;
    response.trustedComplete = completion.trustedComplete;
    response.isComplete = completion.isComplete;
    response.missingFields = completion.missingFields;
    response.recommendedFields = completion.recommendedFields;

    return response;
  }

  private toVerificationResponse(v: any): ProfileVerificationResponse {
    return {
      id: v.id,
      profileId: v.profileId,
      status: v.status as ProfileVerificationStatus,
      type: v.type as ProfileVerificationType,
      rejectedReason: v.rejectedReason || null,
      reviewedBy: v.reviewedBy || null,
      reviewedAt: v.reviewedAt ? v.reviewedAt.toISOString() : null,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    };
  }

  private toDocumentResponse(d: any): ProfileDocumentResponse {
    return {
      id: d.id,
      profileId: d.profileId,
      type: d.type as ProfileVerificationType,
      name: d.name,
      storageKey: d.storageKey,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      status: d.status,
      uploadedAt: d.uploadedAt.toISOString(),
    };
  }

  async getProfilesByUserIds(userIds: string[]) {
    const profiles = await this.prisma.userProfile.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        displayName: true,
        phoneNumber: true,
      },
    });
    return profiles;
  }
}

function normalizeOptional(value: any, maxLength: number): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.substring(0, maxLength);
}

function normalizeOptionalPatch(
  dto: Record<string, any>,
  key: string,
  maxLength: number,
): string | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(dto, key)) return undefined;
  return normalizeOptional(dto[key], maxLength);
}

function buildProfileUpdateData(dto: UpdateCandidateProfileRequest, beforeProfile: any | null): Record<string, any> {
  const updateData: Record<string, any> = {};
  const stringFields: Array<[keyof UpdateCandidateProfileRequest, number]> = [
    ["displayName", 100],
    ["firstName", 50],
    ["lastName", 50],
    ["phoneNumber", 20],
    ["organisation", 100],
    ["gender", 20],
    ["country", 50],
    ["address", 250],
    ["preferredLanguage", 10],
  ];

  for (const [key, maxLength] of stringFields) {
    const value = normalizeOptionalPatch(dto as Record<string, any>, key, maxLength);
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (updateData.preferredLanguage && !ALLOWED_LANGUAGES.has(updateData.preferredLanguage)) {
    throw new BadRequestException("Сонгосон хэл буруу байна.");
  }

  if (updateData.phoneNumber && !/^[+\d][\d\s-]{5,19}$/.test(updateData.phoneNumber)) {
    throw new BadRequestException("Утасны дугаар буруу форматтай байна.");
  }

  if (Object.prototype.hasOwnProperty.call(dto, "birthDate")) {
    if (!dto.birthDate) {
      updateData.birthDate = null;
    } else {
      const parsedDate = new Date(dto.birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException("Төрсөн огноо буруу форматтай байна.");
      }
      if (parsedDate.getTime() > Date.now()) {
        throw new BadRequestException("Төрсөн огноо ирээдүйн огноо байж болохгүй.");
      }
      updateData.birthDate = parsedDate;
    }
  }

  if (Object.prototype.hasOwnProperty.call(dto, "metadata")) {
    updateData.metadata = dto.metadata || {};
  } else if (!beforeProfile) {
    updateData.metadata = {};
  }

  return updateData;
}

function readMetadata(metadata: unknown): Record<string, any> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }
  return metadata as Record<string, any>;
}

function hashOtp(code: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}

function verifyOtp(code: string, salt: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashOtp(code, salt), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function parseOptionalDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function isDevOtpBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.PROFILE_DEV_OTP_BYPASS_ENABLED === "true";
}

function validateVerificationType(type: string): void {
  if (!ALLOWED_VERIFICATION_TYPES.has(type)) {
    throw new BadRequestException("Баталгаажуулалтын төрөл буруу байна.");
  }
}

function validateVerificationStatus(status: string): void {
  if (!ALLOWED_VERIFICATION_STATUSES.has(status)) {
    throw new BadRequestException("Баталгаажуулалтын төлөв буруу байна.");
  }
}

function validateRegistryNumber(value: string): void {
  const normalized = String(value || "").trim();
  if (!/^[\p{L}]{2}\d{8}$/u.test(normalized)) {
    throw new BadRequestException("Регистрийн дугаар буруу форматтай байна.");
  }
}

function validateDocumentInput(
  userId: string,
  dto: { type: string; name: string; storageKey: string; mimeType: string; sizeBytes: number },
): void {
  if (!ALLOWED_DOCUMENT_TYPES.has(dto.type)) {
    throw new BadRequestException("Баримт бичгийн төрөл буруу байна.");
  }
  if (!ALLOWED_DOCUMENT_MIME_TYPES.has(dto.mimeType)) {
    throw new BadRequestException("Зөвхөн PDF файл зөвшөөрнө.");
  }
  if (!Number.isInteger(dto.sizeBytes) || dto.sizeBytes <= 0 || dto.sizeBytes > MAX_DOCUMENT_SIZE_BYTES) {
    throw new BadRequestException("Файлын хэмжээ буруу байна.");
  }
  if (!dto.storageKey.startsWith(`documents/${userId}/`)) {
    throw new BadRequestException("Файлын storage key хэрэглэгчтэй таарахгүй байна.");
  }
}
