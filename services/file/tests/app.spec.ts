import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../src/app.controller";
import { MinioService, toBrowserAccessiblePresignedUrl } from "../src/minio.service";

describe("AppController", () => {
  let appController: AppController;
  const minioService = {
    getPresignedUploadUrl: jest.fn(),
    uploadObject: jest.fn(),
    verifyObject: jest.fn(),
    deleteObject: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: MinioService,
          useValue: minioService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("health checks", () => {
    it("should return health status", () => {
      const res = appController.getHealth();
      expect(res.status).toBe("OK");
      expect(res.service).toBe("file");
    });

    it("should return live status", () => {
      const res = appController.getLive();
      expect(res.status).toBe("UP");
    });

    it("should return ready status", () => {
      const res = appController.getReady();
      expect(res.status).toBe("READY");
    });
  });

  it("uses authenticated user id when creating a presigned upload URL", async () => {
    minioService.getPresignedUploadUrl.mockResolvedValue({
      uploadUrl: "http://localhost:9000/upload",
      storageKey: "documents/user-1/id.pdf",
    });

    const res = await appController.getPresignedUpload(
      { headers: { "x-user-id": "user-1" } } as any,
      { name: "id.pdf", type: "IDENTITY" },
    );

    expect(res.storageKey).toBe("documents/user-1/id.pdf");
    expect(minioService.getPresignedUploadUrl).toHaveBeenCalledWith(
      "user-1",
      "id.pdf",
      "IDENTITY",
    );
  });

  it("uses authenticated user id when verifying an object", async () => {
    minioService.verifyObject.mockResolvedValue({
      exists: true,
      storageKey: "documents/user-1/id.pdf",
      sizeBytes: 1024,
      mimeType: "application/pdf",
    });

    const res = await appController.verifyObject(
      { headers: { "x-user-id": "user-1" } } as any,
      { storageKey: "documents/user-1/id.pdf", mimeType: "application/pdf", sizeBytes: 1024 },
    );

    expect(res.exists).toBe(true);
    expect(minioService.verifyObject).toHaveBeenCalledWith(
      "user-1",
      "documents/user-1/id.pdf",
      { mimeType: "application/pdf", sizeBytes: 1024 },
    );
  });

  it("uses authenticated user id when uploading a multipart file", async () => {
    const file = {
      originalname: "id.pdf",
      mimetype: "application/pdf",
      size: 1024,
      buffer: Buffer.from("pdf"),
    };
    minioService.uploadObject.mockResolvedValue({
      storageKey: "documents/user-1/id.pdf",
      mimeType: "application/pdf",
      sizeBytes: 1024,
    });

    const res = await appController.uploadFile(
      { headers: { "x-user-id": "user-1" } } as any,
      file,
      { type: "IDENTITY" },
    );

    expect(res.storageKey).toBe("documents/user-1/id.pdf");
    expect(minioService.uploadObject).toHaveBeenCalledWith(
      "user-1",
      file,
      "IDENTITY",
    );
  });

  it("uses authenticated user id when deleting an object", async () => {
    await appController.deleteObject(
      { headers: { "x-user-id": "user-1" } } as any,
      { storageKey: "documents/user-1/id.pdf" },
    );

    expect(minioService.deleteObject).toHaveBeenCalledWith(
      "user-1",
      "documents/user-1/id.pdf",
    );
  });
});

describe("toBrowserAccessiblePresignedUrl", () => {
  const previousPublicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT;

  afterEach(() => {
    if (previousPublicEndpoint === undefined) {
      delete process.env.MINIO_PUBLIC_ENDPOINT;
    } else {
      process.env.MINIO_PUBLIC_ENDPOINT = previousPublicEndpoint;
    }
  });

  it("rewrites only the origin to the public MinIO endpoint", () => {
    process.env.MINIO_PUBLIC_ENDPOINT = "https://files.seek.mn";

    const result = toBrowserAccessiblePresignedUrl(
      "http://minio:9000/seek-files/documents/user-1/id.pdf?X-Amz-Signature=abc&X-Amz-Expires=300",
    );

    expect(result).toBe(
      "https://files.seek.mn/seek-files/documents/user-1/id.pdf?X-Amz-Signature=abc&X-Amz-Expires=300",
    );
  });

  it("keeps the internal URL when no public endpoint is configured", () => {
    delete process.env.MINIO_PUBLIC_ENDPOINT;

    const uploadUrl = "http://minio:9000/seek-files/documents/user-1/id.pdf?X-Amz-Signature=abc";

    expect(toBrowserAccessiblePresignedUrl(uploadUrl)).toBe(uploadUrl);
  });
});
