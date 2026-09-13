import { BlueprintService } from "./blueprint.service";

describe("Blueprint deletion", () => {
  function setup(rows = [{ id: "template" }], quizzes = 0, snapshots = 0) {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue(rows),
      quiz: { count: jest.fn().mockResolvedValue(quizzes) },
      quizRevisionSection: { count: jest.fn().mockResolvedValue(snapshots) },
      quizTemplate: { delete: jest.fn().mockResolvedValue({ id: "template" }) },
    };
    const service = new BlueprintService({
      $transaction: (fn: any) => fn(tx),
    } as any);
    return { service, tx };
  }
  test("unused template is deleted after locking, without deleting questions", async () => {
    const { service, tx } = setup();
    await expect(service.remove("template")).resolves.toEqual({
      id: "template",
    });
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.quizTemplate.delete.mock.invocationCallOrder[0],
    );
  });
  test.each([
    [1, 0],
    [0, 1],
  ])(
    "protects quizzes and revision references (%i, %i)",
    async (quizzes, snapshots) => {
      const { service, tx } = setup(undefined, quizzes, snapshots);
      await expect(service.remove("template")).rejects.toMatchObject({
        status: 409,
      });
      expect(tx.quizTemplate.delete).not.toHaveBeenCalled();
    },
  );
  test("missing template returns 404", async () => {
    const { service } = setup([]);
    await expect(service.remove("missing")).rejects.toMatchObject({
      status: 404,
    });
  });
  test("foreign-key conflict returns a usable 409", async () => {
    const { service, tx } = setup();
    tx.quizTemplate.delete.mockRejectedValue({ code: "P2003" });
    await expect(service.remove("template")).rejects.toMatchObject({
      status: 409,
    });
  });
});
