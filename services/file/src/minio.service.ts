import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import * as Minio from "minio";
import type { PresignedUploadResponse } from "@seek/contracts";

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private bucket = process.env.MINIO_BUCKET || "seek-files";

  async onModuleInit() {
    const endpoint = process.env.MINIO_ENDPOINT || "localhost";
    const hostWithPort = endpoint.replace(/^https?:\/\//, "");
    const host = hostWithPort.split(":")[0];

    this.minioClient = new Minio.Client({
      endPoint: host,
      port: parseInt(process.env.MINIO_PORT || "9000", 10),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY || "seek_minio_admin",
      secretKey: process.env.MINIO_SECRET_KEY || "seek_minio_pass",
    });

    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucket, "us-east-1");
        console.log(`[MinIO] Bucket "${this.bucket}" created successfully.`);
      } else {
        console.log(`[MinIO] Bucket "${this.bucket}" already exists.`);
      }
    } catch (err) {
      console.error(`[MinIO] Failed to initialize bucket "${this.bucket}":`, err);
    }
  }

  async getPresignedUploadUrl(userId: string, name: string, type: string): Promise<PresignedUploadResponse> {
    const safeName = sanitizeFileName(name);
    const storageKey = `documents/${userId}/${Date.now()}-${randomSuffix()}-${safeName}`;
    try {
      const uploadUrl = await this.minioClient.presignedPutObject(this.bucket, storageKey, 5 * 60);

      return {
        uploadUrl: toBrowserAccessiblePresignedUrl(uploadUrl),
        storageKey,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(`Presigned URL үүсгэхэд алдаа гарлаа: ${err.message}`);
    }
  }

  async uploadObject(
    userId: string,
    file: { originalname?: string; mimetype?: string; size?: number; buffer?: Buffer },
    type: string,
  ): Promise<{ storageKey: string; mimeType: string; sizeBytes: number }> {
    if (!file?.buffer || !file.size) {
      throw new BadRequestException("Файл хоосон байна.");
    }
    if ((file.mimetype || "").toLowerCase() !== "application/pdf") {
      throw new BadRequestException("Зөвхөн PDF файл хавсаргах боломжтой.");
    }

    const safeName = sanitizeFileName(file.originalname || `${type.toLowerCase()}.pdf`);
    const storageKey = `documents/${userId}/${Date.now()}-${randomSuffix()}-${safeName}`;
    const mimeType = file.mimetype || "application/pdf";

    try {
      await this.minioClient.putObject(
        this.bucket,
        storageKey,
        file.buffer,
        file.size,
        { "Content-Type": mimeType },
      );

      return {
        storageKey,
        mimeType,
        sizeBytes: file.size,
      };
    } catch (err: any) {
      throw new InternalServerErrorException(`Файл хадгалахад алдаа гарлаа: ${err.message}`);
    }
  }

  async verifyObject(
    userId: string,
    storageKey: string,
    expected: { mimeType?: string; sizeBytes?: number },
  ): Promise<{ exists: true; storageKey: string; sizeBytes: number; mimeType: string | null }> {
    this.assertUserStorageKey(userId, storageKey);

    try {
      const stat = await this.minioClient.statObject(this.bucket, storageKey);
      const sizeBytes = Number(stat.size || 0);
      const mimeType = getObjectMimeType(stat);

      if (expected.sizeBytes !== undefined && sizeBytes !== expected.sizeBytes) {
        throw new BadRequestException("Файлын хэмжээ metadata-тай таарахгүй байна.");
      }

      if (expected.mimeType && mimeType && mimeType !== expected.mimeType) {
        throw new BadRequestException("Файлын төрөл metadata-тай таарахгүй байна.");
      }

      return {
        exists: true,
        storageKey,
        sizeBytes,
        mimeType,
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      if (err?.code === "NotFound" || err?.code === "NoSuchKey") {
        throw new NotFoundException("Файл хадгалах санд олдсонгүй.");
      }
      throw new InternalServerErrorException(`Файл шалгахад алдаа гарлаа: ${err.message}`);
    }
  }

  async deleteObject(userId: string, storageKey: string): Promise<void> {
    this.assertUserStorageKey(userId, storageKey);

    try {
      await this.minioClient.removeObject(this.bucket, storageKey);
    } catch (err: any) {
      if (err?.code === "NotFound" || err?.code === "NoSuchKey") {
        return;
      }
      throw new InternalServerErrorException(`Файл устгахад алдаа гарлаа: ${err.message}`);
    }
  }

  private assertUserStorageKey(userId: string, storageKey: string): void {
    if (!storageKey?.startsWith(`documents/${userId}/`)) {
      throw new BadRequestException("Файлын storage key хэрэглэгчтэй таарахгүй байна.");
    }
  }
}

function sanitizeFileName(name: string): string {
  const cleaned = String(name || "document.pdf")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
  return cleaned || "document.pdf";
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function toBrowserAccessiblePresignedUrl(uploadUrl: string): string {
  const publicEndpoint = normalizePublicEndpoint(process.env.MINIO_PUBLIC_ENDPOINT);
  if (!publicEndpoint) {
    return uploadUrl;
  }

  const internalUrl = new URL(uploadUrl);
  const publicUrl = new URL(publicEndpoint);
  internalUrl.protocol = publicUrl.protocol;
  internalUrl.hostname = publicUrl.hostname;
  internalUrl.port = publicUrl.port;
  return internalUrl.toString();
}

function normalizePublicEndpoint(endpoint?: string): string | null {
  const trimmed = endpoint?.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return null;
  }

  const url = new URL(trimmed);
  if (url.pathname !== "/") {
    throw new Error("MINIO_PUBLIC_ENDPOINT must include only scheme, host, and optional port.");
  }
  return url.toString();
}

function getObjectMimeType(stat: any): string | null {
  const metadata = stat.metaData || stat.metadata || {};
  return metadata["content-type"] || metadata["Content-Type"] || null;
}
