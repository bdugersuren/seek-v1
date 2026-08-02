import { ReportingService } from "../src/reporting.service";

describe("ReportingService", () => {
  let service: ReportingService;

  beforeEach(() => {
    service = new ReportingService();
  });

  it("projects finalized assessment results into attempt facts", () => {
    const fact = service.projectAssessmentResultFinalized({
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
    expect(service.getAttemptFact("attempt-1")).toEqual(fact);
  });

  it("filters attempt facts by reporting dimensions", () => {
    service.projectAssessmentResultFinalized({
      attemptId: "attempt-1",
      scheduleId: "schedule-1",
      quizId: "quiz-1",
      quizRevisionId: "revision-1",
      candidateId: "candidate-1",
      regionId: "region-a",
    });
    service.projectAssessmentResultFinalized({
      attemptId: "attempt-2",
      scheduleId: "schedule-2",
      quizId: "quiz-1",
      quizRevisionId: "revision-1",
      candidateId: "candidate-2",
      regionId: "region-b",
    });

    expect(service.listAttemptFacts({ regionId: "region-a" })).toHaveLength(1);
    expect(service.listAttemptFacts({ scheduleId: "schedule-2" })[0].attemptId).toBe(
      "attempt-2"
    );
  });
});
