import { AudienceService } from "./audience.service";

describe("Audience metadata validation", () => {
  let service: AudienceService;
  let tx: any;
  let prisma: any;
  beforeEach(() => {
    tx = {
      audienceType: {
        findUnique: jest.fn().mockResolvedValue({ id: "type" }),
        create: jest.fn().mockImplementation(async (x) => x.data),
        update: jest.fn().mockImplementation(async (x) => x.data),
      },
      audienceLevel: {
        findUnique: jest.fn(),
        create: jest.fn().mockImplementation(async (x) => x.data),
        update: jest.fn().mockImplementation(async (x) => x.data),
      },
    };
    prisma = { $transaction: jest.fn(async (fn) => fn(tx)) };
    service = new AudienceService(prisma);
  });
  it("persists all level fields and prefers orderIndex to legacy rank", async () => {
    const result = await service.saveLevel({
      audienceTypeId: "type",
      name: "Grade",
      code: "GRADE_1",
      orderIndex: 0,
      rank: 8,
      parentId: null,
      externalCode: "EXT",
      levelKind: "GRADE_LEVEL",
      isActive: false,
    });
    expect(result).toMatchObject({
      orderIndex: 0,
      externalCode: "EXT",
      levelKind: "GRADE_LEVEL",
      isActive: false,
      parentId: null,
    });
  });
  it("preserves omitted fields while allowing explicit null parent", async () => {
    tx.audienceLevel.findUnique.mockResolvedValue({
      id: "a",
      audienceTypeId: "type",
      code: "OLD-CODE",
      parentId: "b",
    });
    const result = await service.saveLevel({ parentId: null, rank: 3 }, "a");
    expect(result).toMatchObject({ parentId: null, orderIndex: 3 });
    expect(result).not.toHaveProperty("name");
    expect(result).not.toHaveProperty("isActive");
  });
  it("rejects cross-type parent", async () => {
    tx.audienceLevel.findUnique.mockResolvedValue({
      id: "parent",
      audienceTypeId: "other",
      parentId: null,
    });
    await expect(
      service.saveLevel({
        audienceTypeId: "type",
        name: "Child",
        code: "CHILD",
        parentId: "parent",
      }),
    ).rejects.toMatchObject({ status: 400 });
  });
  it("rejects a descendant as parent", async () => {
    tx.audienceLevel.findUnique.mockImplementation(
      async ({ where: { id } }: any) => ({
        id,
        audienceTypeId: "type",
        parentId: id === "child" ? "root" : null,
      }),
    );
    await expect(
      service.saveLevel({ parentId: "child" }, "root"),
    ).rejects.toMatchObject({ status: 400 });
  });
  it("rejects missing explicit audienceTypeId and fractional order", async () => {
    await expect(
      service.saveLevel({ name: "Child", code: "CHILD" }),
    ).rejects.toMatchObject({ status: 400 });
    expect(() =>
      service.saveLevel({ name: "Child", code: "CHILD", orderIndex: 1.5 }),
    ).toThrow();
  });
  it("preserves description and inactive type status", async () => {
    expect(
      await service.saveType({
        name: "Student",
        code: "STUDENT",
        description: "Details",
        isActive: false,
      }),
    ).toMatchObject({ description: "Details", isActive: false });
  });
  it("rejects referenced deletion", async () => {
    tx.audienceLevel.findUnique.mockResolvedValue({
      _count: { children: 1, contexts: 0, audienceRules: 0 },
    });
    await expect(service.deleteLevel("root")).rejects.toMatchObject({
      status: 409,
    });
  });
  it("maps duplicate constraint to 409", async () => {
    tx.audienceType.create.mockRejectedValue({ code: "P2002" });
    await expect(
      service.saveType({ name: "Student", code: "STUDENT" }),
    ).rejects.toMatchObject({ status: 409 });
  });
  it("retries serializable transaction conflict", async () => {
    prisma.$transaction.mockRejectedValueOnce({ code: "P2034" });
    await service.saveType({ name: "Student", code: "STUDENT" });
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });
});
