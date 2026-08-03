import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import type {
  AssessmentEnrollmentGateResponse,
  CandidateProfileResponse,
  ProfileCompletionStatus,
  ProfileMissingField,
  UpdateCandidateProfileRequest,
  ProfileVerificationResponse,
  ProfileDocumentResponse,
  ProfileVerificationStatus,
} from "@seek/contracts";
import { PrismaService } from "./prisma.service";
import { evaluateProfileCompletion } from "./completion-policy";

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
    // Basic Input Validation
    const displayName = normalizeOptional(dto.displayName, 100);
    const firstName = normalizeOptional(dto.firstName, 50);
    const lastName = normalizeOptional(dto.lastName, 50);
    const phoneNumber = normalizeOptional(dto.phoneNumber, 20);
    const organisation = normalizeOptional(dto.organisation, 100);
    const gender = normalizeOptional(dto.gender, 20);
    const country = normalizeOptional(dto.country, 50);
    const address = normalizeOptional(dto.address, 250);
    const preferredLanguage = normalizeOptional(dto.preferredLanguage, 10);

    let birthDate: Date | null = null;
    if (dto.birthDate) {
      const parsedDate = new Date(dto.birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException("Төрсөн огноо буруу форматтай байна.");
      }
      birthDate = parsedDate;
    }

    // Get previous state for audit log
    const beforeProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    const beforeStateJson = beforeProfile ? JSON.parse(JSON.stringify(beforeProfile)) : {};

    // Prevent candidate updating admin-only fields in payload if any (Prisma schema protects these but we enforce here)
    const updateData: any = {
      displayName,
      firstName,
      lastName,
      phoneNumber,
      organisation,
      birthDate,
      gender,
      country,
      address,
      preferredLanguage,
      metadata: dto.metadata || beforeProfile?.metadata || {},
    };

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
    input: { price?: number; accessType?: string },
  ): Promise<AssessmentEnrollmentGateResponse> {
    const profile = await this.getCandidateProfile(userId);
    const completion = evaluateProfileCompletion(profile);

    if (!completion.isComplete) {
      return {
        assessmentId,
        allowed: false,
        blockedReason: "PROFILE_INCOMPLETE",
        requiredAction: "COMPLETE_PROFILE",
        missingProfileFields: completion.missingFields,
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

  // 5. Verification Workflow - Candidate Submit
  async submitVerificationRequest(
    userId: string,
    type: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ProfileVerificationResponse> {
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

    const verification = await this.prisma.profileVerification.create({
      data: {
        profileId: profile.id,
        type,
        status: "SUBMITTED",
      },
    });

    await this.writeAuditLog({
      profileId: profile.id,
      userId,
      actorUserId: userId,
      action: "VERIFICATION_SUBMITTED",
      before: {},
      after: JSON.parse(JSON.stringify(verification)),
      ipAddress,
      userAgent,
    });

    return this.toVerificationResponse(verification);
  }

  // 6. Verification Workflow - Candidate Get
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

  // 7. Verification Workflow - Admin List
  async getAdminVerifications(status?: string): Promise<ProfileVerificationResponse[]> {
    const list = await this.prisma.profileVerification.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return list.map(v => this.toVerificationResponse(v));
  }

  // 8. Verification Workflow - Admin Approve
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

    // If verification type is IDENTITY, update main profile verifiedAt
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

  // 9. Verification Workflow - Admin Reject
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

  // 10. Document Metadata API - List
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

  // 11. Document Metadata API - Create
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

  // 12. Document Metadata API - Delete
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

  // Helper: Write Audit Log (Immutable database records, avoid dumping PII to console)
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
    // Avoid logging PII details in application stdout
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

    // Fallback logic: database column-оос олохгүй бол metadata дотроос олно
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
      isComplete: false,
      missingFields: [],
      recommendedFields: [],
    };

    // Calculate completion metrics
    const completion = evaluateProfileCompletion(response);
    response.isComplete = completion.isComplete;
    response.missingFields = completion.missingFields;
    response.recommendedFields = completion.recommendedFields;

    return response;
  }

  // Mapper: ProfileVerification entity -> ProfileVerificationResponse
  private toVerificationResponse(v: any): ProfileVerificationResponse {
    return {
      id: v.id,
      profileId: v.profileId,
      status: v.status as ProfileVerificationStatus,
      type: v.type,
      rejectedReason: v.rejectedReason || null,
      reviewedBy: v.reviewedBy || null,
      reviewedAt: v.reviewedAt ? v.reviewedAt.toISOString() : null,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    };
  }

  // Mapper: ProfileDocument entity -> ProfileDocumentResponse
  private toDocumentResponse(d: any): ProfileDocumentResponse {
    return {
      id: d.id,
      profileId: d.profileId,
      type: d.type,
      name: d.name,
      storageKey: d.storageKey,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      status: d.status,
      uploadedAt: d.uploadedAt.toISOString(),
    };
  }
}

function normalizeOptional(value: any, maxLength: number): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!str) return null;
  return str.substring(0, maxLength);
}

function readMetadata(metadata: unknown): Record<string, any> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }
  return metadata as Record<string, any>;
}
