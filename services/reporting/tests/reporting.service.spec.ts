import { ReportingService } from "../src/reporting.service";

describe("ReportingService", () => {
  let service: ReportingService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      reportingAttemptFact: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };
    service = new ReportingService(mockPrisma as any);
  });

  it("projects finalized assessment results into attempt facts", async () => {
    mockPrisma.reportingAttemptFact.upsert.mockResolvedValueOnce({
      attemptId: "attempt-1",
      resultId: "result-1",
      tenantId: "tenant-1",
      scheduleId: "schedule-1",
      quizId: "quiz-1",
      quizRevisionId: "revision-1",
      candidateId: "candidate-1",
      regionId: "region-1",
      districtId: "district-1",
      schoolId: "school-1",
      finalScore: 85,
      maxPossibleScore: 100,
      percentage: 85,
      passStatus: "PASSED",
      status: "FINAL",
      createdAt: new Date(),
    });

    const fact = await service.projectAssessmentResultFinalized({
      attemptId: "attempt-1",
      resultId: "result-1",
      tenantId: "tenant-1",
      scheduleId: "schedule-1",
      quizId: "quiz-1",
      quizRevisionId: "revision-1",
      candidateId: "candidate-1",
      regionId: "region-1",
      districtId: "district-1",
      schoolId: "school-1",
      finalScore: 85,
      maxPossibleScore: 100,
      percentage: 85,
      passStatus: "PASSED",
    });

    expect(fact.status).toBe("FINAL");
    mockPrisma.reportingAttemptFact.findUnique.mockResolvedValueOnce({
      attemptId: "attempt-1",
      resultId: "result-1",
      tenantId: "tenant-1",
      scheduleId: "schedule-1",
      quizId: "quiz-1",
      quizRevisionId: "revision-1",
      candidateId: "candidate-1",
      regionId: "region-1",
      districtId: "district-1",
      schoolId: "school-1",
      finalScore: 85,
      maxPossibleScore: 100,
      percentage: 85,
      passStatus: "PASSED",
      status: "FINAL",
      createdAt: new Date(),
    });
    const retrieved = await service.getAttemptFact("attempt-1");
    expect(retrieved.attemptId).toBe("attempt-1");
  });

  it("filters attempt facts by reporting dimensions", async () => {
    mockPrisma.reportingAttemptFact.findMany.mockImplementation((args: any) => {
      const facts = [
        {
          attemptId: "attempt-1",
          scheduleId: "schedule-1",
          quizId: "quiz-1",
          quizRevisionId: "revision-1",
          candidateId: "candidate-1",
          regionId: "region-a",
          status: "FINAL",
          createdAt: new Date(),
        },
        {
          attemptId: "attempt-2",
          scheduleId: "schedule-2",
          quizId: "quiz-1",
          quizRevisionId: "revision-1",
          candidateId: "candidate-2",
          regionId: "region-b",
          status: "FINAL",
          createdAt: new Date(),
        },
      ];
      if (args?.where?.regionId) {
        return Promise.resolve(facts.filter((f) => f.regionId === args.where.regionId));
      }
      if (args?.where?.scheduleId) {
        return Promise.resolve(facts.filter((f) => f.scheduleId === args.where.scheduleId));
      }
      return Promise.resolve(facts);
    });

    const listA = await service.listAttemptFacts({ regionId: "region-a" });
    expect(listA).toHaveLength(1);

    const listB = await service.listAttemptFacts({ scheduleId: "schedule-2" });
    expect(listB[0].attemptId).toBe("attempt-2");
  });
});

