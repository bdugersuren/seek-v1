import { Test, TestingModule } from "@nestjs/testing";
import { QuestionService } from "./question.service";
import { PrismaService } from "./prisma.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("QuestionService", () => {
  let service: QuestionService;
  let prisma: any;

  const mockPrisma = {
    question: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    questionVersion: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    questionOptionVersion: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should throw BadRequestException if code, body or type are missing", async () => {
      await expect(service.create({ code: "", body: "", type: "" })).rejects.toThrow(
        BadRequestException
      );
    });

    it("should create a question and its draft version successfully", async () => {
      prisma.question.findUnique.mockResolvedValue(null);
      prisma.question.create.mockResolvedValue({ id: "q-123", code: "Q-01" });
      prisma.questionVersion.create.mockResolvedValue({ id: "qv-123", versionNumber: 1 });

      const result = await service.create({
        code: "Q-01",
        body: "Test Question body",
        type: "SINGLE_CHOICE",
        payload: {
          options: [
            { code: "A", body: "Option A", isCorrect: true },
            { code: "B", body: "Option B", isCorrect: false },
          ],
        },
      });

      expect(prisma.question.findUnique).toHaveBeenCalledWith({ where: { code: "Q-01" } });
      expect(prisma.question.create).toHaveBeenCalled();
      expect(prisma.questionVersion.create).toHaveBeenCalled();
      expect(prisma.questionOptionVersion.create).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty("versions");
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException if question does not exist", async () => {
      prisma.question.findUnique.mockResolvedValue(null);
      await expect(service.findOne("non-existent")).rejects.toThrow(NotFoundException);
    });
  });
});
