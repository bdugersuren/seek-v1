import { Body, Controller, Delete, Get, Post, Req, Res, Query, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { MinioService } from "./minio.service";
import type {
  PresignedUploadRequest,
  PresignedUploadResponse,
} from "@seek/contracts";

@Controller()
export class AppController {
  constructor(private readonly minioService: MinioService) {}

  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "file",
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

  @Post("file/presigned-upload")
  async getPresignedUpload(
    @Req() req: Request,
    @Body() dto: PresignedUploadRequest,
  ): Promise<PresignedUploadResponse> {
    const userId = getUserId(req);
    return this.minioService.getPresignedUploadUrl(userId, dto.name, dto.type);
  }

  @Post("file/upload")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() dto: { type: string },
  ) {
    const userId = getUserId(req);
    return this.minioService.uploadObject(userId, file, dto.type || "IDENTITY");
  }

  @Post("file/objects/verify")
  async verifyObject(
    @Req() req: Request,
    @Body() dto: { storageKey: string; mimeType?: string; sizeBytes?: number },
  ) {
    const userId = getUserId(req);
    return this.minioService.verifyObject(userId, dto.storageKey, {
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    });
  }

  @Get("file/objects")
  async getObject(
    @Req() req: Request,
    @Query("storageKey") storageKey: string,
    @Res() res: Response,
  ) {
    if (!storageKey) {
      throw new BadRequestException("storageKey query параметр шаардлагатай.");
    }

    const userId = req.headers["x-user-id"] as string;
    const userRolesHeader = req.headers["x-user-roles"] as string;
    const userRoles = typeof userRolesHeader === "string" ? userRolesHeader.split(",") : [];

    const downloadUrl = await this.minioService.getPresignedDownloadUrl(userId, storageKey, userRoles);
    return res.redirect(downloadUrl);
  }

  @Delete("file/objects")
  async deleteObject(
    @Req() req: Request,
    @Body() dto: { storageKey: string },
  ) {
    const userId = getUserId(req);
    await this.minioService.deleteObject(userId, dto.storageKey);
    return { success: true };
  }
}

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"];
  if (!userId || Array.isArray(userId)) {
    throw new UnauthorizedException("Нэвтрээгүй байна.");
  }
  return userId;
}
