import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import type {
  UpdateCandidateProfileRequest,
  ApproveVerificationRequest,
  RejectVerificationRequest,
} from "@seek/contracts";
import { ProfileService } from "./profile.service";

@Controller()
export class AppController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "profile",
    };
  }

  @Get("health/live")
  getLive() {
    return { status: "UP" };
  }

  @Get("health/ready")
  getReady() {
    return { status: "READY" };
  }

  // =========================================================================
  // Candidate Profile Endpoints
  // =========================================================================

  @Get("profile/me")
  async getMe(@Req() req: Request) {
    const userId = getUserId(req);
    return this.profileService.getCandidateProfile(userId);
  }

  @Put("profile/me")
  async updateMe(
    @Req() req: Request,
    @Body() dto: UpdateCandidateProfileRequest,
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.updateCandidateProfile(userId, dto, ip, ua);
  }

  @Get("profile/me/completion")
  async getCompletion(@Req() req: Request) {
    const userId = getUserId(req);
    return this.profileService.getCompletionStatus(userId);
  }

  @Get("profile/me/assessment-gate/:assessmentId")
  async getAssessmentGate(
    @Req() req: Request,
    @Param("assessmentId") assessmentId: string,
    @Query("price") price?: string,
    @Query("accessType") accessType?: string,
    @Query("emailVerified") emailVerified?: string,
    @Query("enrolled") enrolled?: string,
    @Query("assessmentOpen") assessmentOpen?: string,
    @Query("alreadyAttempted") alreadyAttempted?: string,
    @Query("attemptId") attemptId?: string,
  ) {
    const userId = getUserId(req);
    return this.profileService.getAssessmentEnrollmentGate(userId, assessmentId, {
      price: parsePrice(price),
      accessType,
      emailVerified: parseBoolean(emailVerified),
      enrolled: parseBoolean(enrolled),
      assessmentOpen: parseBoolean(assessmentOpen),
      alreadyAttempted: parseBoolean(alreadyAttempted),
      attemptId,
    });
  }

  // =========================================================================
  // Verification Endpoints - Candidate
  // =========================================================================

  @Get("profile/me/verification")
  async getMyVerifications(@Req() req: Request) {
    const userId = getUserId(req);
    return this.profileService.getVerificationRequests(userId);
  }

  @Post("profile/me/verification/submit")
  async submitVerification(
    @Req() req: Request,
    @Body() dto: { type: string; registryNumber?: string },
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.submitVerificationRequest(userId, dto.type, dto.registryNumber, ip, ua);
  }

  @Post("profile/me/verification/phone/send-otp")
  async sendPhoneOtp(
    @Req() req: Request,
    @Body() dto: { phoneNumber: string },
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.sendPhoneOtp(userId, dto.phoneNumber, ip, ua);
  }

  @Post("profile/me/verification/phone/verify-otp")
  async verifyPhoneOtp(
    @Req() req: Request,
    @Body() dto: { code: string },
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.verifyPhoneOtp(userId, dto.code, ip, ua);
  }

  // =========================================================================
  // Verification Endpoints - Admin
  // =========================================================================

  @Get("profile/admin/verifications")
  async getAdminVerifications(
    @Req() req: Request,
    @Query("status") status?: string,
  ) {
    checkAdminRole(req);
    return this.profileService.getAdminVerifications(status);
  }

  @Post("profile/admin/verifications/:id/approve")
  @HttpCode(HttpStatus.OK)
  async approveVerification(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() _dto: ApproveVerificationRequest,
  ) {
    const reviewerId = checkAdminRole(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.approveVerification(id, reviewerId, ip, ua);
  }

  @Post("profile/admin/verifications/:id/reject")
  @HttpCode(HttpStatus.OK)
  async rejectVerification(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: RejectVerificationRequest,
  ) {
    const reviewerId = checkAdminRole(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.rejectVerification(id, reviewerId, dto.rejectedReason, ip, ua);
  }

  // =========================================================================
  // Document Endpoints - Candidate
  // =========================================================================

  @Get("profile/me/documents")
  async getDocuments(@Req() req: Request) {
    const userId = getUserId(req);
    return this.profileService.getDocuments(userId);
  }

  @Post("profile/me/documents")
  async addDocument(
    @Req() req: Request,
    @Body() dto: { type: string; name: string; storageKey: string; mimeType: string; sizeBytes: number },
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    return this.profileService.addDocument(userId, dto, ip, ua);
  }

  @Delete("profile/me/documents/:documentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(
    @Req() req: Request,
    @Param("documentId") documentId: string,
  ) {
    const userId = getUserId(req);
    const ip = getIpAddress(req);
    const ua = getUserAgent(req);
    await this.profileService.deleteDocument(userId, documentId, ip, ua);
  }

  @Post("profile/admin/profiles/by-ids")
  @HttpCode(HttpStatus.OK)
  async getProfilesByIds(
    @Req() req: Request,
    @Body() dto: { userIds: string[] },
  ) {
    checkAdminRole(req);
    return this.profileService.getProfilesByUserIds(dto.userIds);
  }
}

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"];
  if (!userId || Array.isArray(userId)) {
    throw new UnauthorizedException("Нэвтрээгүй байна.");
  }

  return userId;
}

function checkAdminRole(req: Request): string {
  const userId = getUserId(req);
  const rolesHeader = req.headers["x-user-roles"];
  const roles = typeof rolesHeader === "string" ? rolesHeader.split(",") : [];
  
  const allowedAdminRoles = [
    "SUPER_ADMIN",
    "ORGANIZATION_ADMIN",
    "ASSESSOR",
    "VIEWER",
    "TESTER",
  ];
  const hasAdminRole = roles.some(role => allowedAdminRoles.includes(role));

  if (!hasAdminRole) {
    throw new ForbiddenException("Уг үйлдлийг хийх эрх хүрэлцэхгүй байна.");
  }

  return userId;
}

function parsePrice(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value?: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function getIpAddress(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
  }
  return req.socket.remoteAddress || "";
}

function getUserAgent(req: Request): string {
  return req.headers["user-agent"] || "";
}
