const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

async function main() {
  await prisma.reportingAttemptFact.upsert({
    where: { attemptId: "mock-attempt-001" },
    update: {
      resultId: "mock-result-001",
      scheduleId: "schedule-civil-service-2024",
      quizId: "quiz-civil-service-2026",
      quizRevisionId: "quiz-revision-civil-service-2026-v1",
      candidateId: "mock-candidate",
      organizationId: "org-demo",
      regionId: "ulaanbaatar",
      districtId: "sukhbaatar",
      schoolId: "org-shine-mongol",
      classId: "class-demo-001",
      teacherId: "user-battuya",
      assessmentContextId: "context-civil-service",
      startedAt: new Date("2026-07-31T02:00:00.000Z"),
      submittedAt: new Date("2026-07-31T02:04:00.000Z"),
      durationSeconds: 240,
      finalScore: "0",
      maxPossibleScore: "28",
      percentage: "0",
      passStatus: "FAILED",
      status: "FINAL",
    },
    create: {
      attemptId: "mock-attempt-001",
      resultId: "mock-result-001",
      scheduleId: "schedule-civil-service-2024",
      quizId: "quiz-civil-service-2026",
      quizRevisionId: "quiz-revision-civil-service-2026-v1",
      candidateId: "mock-candidate",
      organizationId: "org-demo",
      regionId: "ulaanbaatar",
      districtId: "sukhbaatar",
      schoolId: "org-shine-mongol",
      classId: "class-demo-001",
      teacherId: "user-battuya",
      assessmentContextId: "context-civil-service",
      startedAt: new Date("2026-07-31T02:00:00.000Z"),
      submittedAt: new Date("2026-07-31T02:04:00.000Z"),
      durationSeconds: 240,
      finalScore: "0",
      maxPossibleScore: "28",
      percentage: "0",
      passStatus: "FAILED",
      status: "FINAL",
    },
  });

  console.log("Reporting mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Reporting seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
