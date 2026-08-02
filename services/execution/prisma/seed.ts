const { PrismaClient } = require("../generated/prisma-client");

const prisma = new PrismaClient();

const now = new Date("2026-07-31T01:50:00.000Z");
const startsAt = new Date("2026-07-31T02:00:00.000Z");
const endsAt = new Date("2026-07-31T02:45:00.000Z");

async function main() {
  await prisma.attemptSubmission.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.quizViolation.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.questionResponseEvent.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.questionResponse.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.attemptStateSnapshot.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.attemptQuestion.deleteMany({ where: { attemptId: "mock-attempt-001" } });
  await prisma.quizAttempt.deleteMany({ where: { id: "mock-attempt-001" } });
  await prisma.attemptEligibilitySnapshot.deleteMany({
    where: { id: "eligibility-mock-attempt-001" },
  });

  await prisma.attemptEligibilitySnapshot.create({
    data: {
      id: "eligibility-mock-attempt-001",
      scheduleId: "schedule-civil-service-2024",
      assignmentId: "assignment-mock-candidate-civil-service",
      candidateId: "mock-candidate",
      quizId: "quiz-civil-service-2026",
      quizRevisionId: "quiz-revision-civil-service-2026-v1",
      status: "ACTIVE",
      availableFrom: startsAt,
      availableUntil: endsAt,
      durationLimitSeconds: 45 * 60,
      maxAttempts: 1,
      endTimePolicy: "EARLIEST_OF_BOTH",
      accessMode: "OPEN_WITH_CODE",
      timezone: "Asia/Ulaanbaatar",
      scheduleSnapshot: {
        assessmentTitle: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
        scheduledStartsAt: startsAt.toISOString(),
        scheduledEndsAt: endsAt.toISOString(),
        waitingRoomOpensAt: new Date("2026-07-31T01:45:00.000Z").toISOString(),
        requiredEarlyJoinMinutes: 15,
        questionCount: 3,
        totalPoints: 15,
        passingPercent: 70,
      },
      runtimePolicySnapshot: {
        autosaveIntervalSeconds: 5,
        heartbeatIntervalSeconds: 5,
      },
      proctoringPolicySnapshot: {
        requireFullscreen: true,
        warnOnVisibilityChange: true,
        warnOnWindowBlur: true,
        disableCopyPaste: true,
        disableContextMenu: true,
        maxWarningsBeforeLock: 3,
        lockOnViolation: true,
      },
      resultPolicySnapshot: {
        hideSolutions: true,
        showLeaderboard: false,
        showScore: true,
        showCorrectness: false,
        showCorrectAnswers: false,
        showExplanations: false,
        resultReleaseMode: "after_close",
      },
      accessPolicySnapshot: { source: "frontend-runtime-mock" },
      eligibilityChecksum: "sha256:mock-eligibility",
      activatedAt: now,
      expiresAt: endsAt,
    },
  });

  await prisma.quizAttempt.create({
    data: {
      id: "mock-attempt-001",
      eligibilitySnapshotId: "eligibility-mock-attempt-001",
      scheduleId: "schedule-civil-service-2024",
      quizId: "quiz-civil-service-2026",
      quizRevisionId: "quiz-revision-civil-service-2026-v1",
      assignmentId: "assignment-mock-candidate-civil-service",
      candidateId: "mock-candidate",
      attemptNumber: 1,
      status: "CREATED",
      durationLimitSeconds: 45 * 60,
      expiresAt: endsAt,
      clientInstanceId: "mock-browser-instance",
      runtimeVersion: "mock-runtime-v1",
      scheduleSnapshot: {
        assessmentTitle: "Төрийн албан хаагчийн ерөнхий мэдлэгийн үнэлгээ",
        userDisplayName: "Бат-Эрдэнэ Б.",
        serverNow: now.toISOString(),
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      },
      runtimePolicySnapshot: {
        autosaveIntervalSeconds: 5,
        heartbeatIntervalSeconds: 5,
      },
      proctoringPolicySnapshot: {
        requireFullscreen: true,
        maxWarningsBeforeLock: 3,
      },
    },
  });

  const questions = [
    {
      id: "attempt-question-q1",
      questionId: "runtime-q1",
      questionVersionId: "qv-runtime-q1-v1",
      orderIndex: 1,
      type: "single_choice",
      maxScore: "2",
      prompt: "Монгол Улсын Үндсэн хуулийн үндсэн зарчимд аль нь хамаарах вэ?",
      instruction: "Нэг зөв хариулт сонгоно уу.",
      options: [
        { id: "a", label: "Ардчилсан ёс" },
        { id: "b", label: "Зөвхөн эдийн засгийн өсөлт" },
        { id: "c", label: "Нууц захиргаа" },
        { id: "d", label: "Хувийн ашиг сонирхол" },
      ],
    },
    {
      id: "attempt-question-q2",
      questionId: "runtime-q2",
      questionVersionId: "qv-runtime-q2-v1",
      orderIndex: 2,
      type: "multiple_choice",
      maxScore: "3",
      prompt: "Төрийн үйлчилгээний чанарыг сайжруулахад нөлөөлөх хүчин зүйлсийг сонго.",
      instruction: "Нийт хамаарах хариултыг сонгоно уу.",
      options: [
        { id: "a", label: "Ил тод байдал" },
        { id: "b", label: "Хариуцлага" },
        { id: "c", label: "Иргэн төвтэй үйлчилгээ" },
        { id: "d", label: "Мэдээллийг зориуд нуух" },
      ],
    },
    {
      id: "attempt-question-q3",
      questionId: "runtime-q3",
      questionVersionId: "qv-runtime-q3-v1",
      orderIndex: 3,
      type: "essay",
      maxScore: "10",
      prompt:
        "Иргэн үйлчилгээ авах явцад олон шат дамжлага үүсэж байгаа нөхцөлд сайжруулах саналаа тайлбарлана уу.",
      instruction: "Бүтэцтэй, үндэслэлтэй хариулт бичнэ үү.",
      options: [],
    },
  ];

  for (const item of questions) {
    await prisma.attemptQuestion.create({
      data: {
        id: item.id,
        attemptId: "mock-attempt-001",
        questionId: item.questionId,
        questionVersionId: item.questionVersionId,
        quizRevisionSectionId: "revision-section-civil-general",
        topicQuestionClassificationId: `class-${item.questionId}`,
        orderIndex: item.orderIndex,
        maxScoreSnapshot: item.maxScore,
        minScoreSnapshot: "0",
        timeLimitSecondsSnapshot: item.orderIndex === 3 ? 300 : 90,
        questionTypeCodeSnapshot: item.type,
        contentSnapshot: {
          code: `Q${item.orderIndex}`,
          prompt: item.prompt,
          instruction: item.instruction,
          points: Number(item.maxScore),
        },
        presentationConfigSnapshot: {},
        optionsSnapshot: item.options,
        mediaSnapshot: [],
        classificationSnapshot: { sectionName: item.orderIndex === 3 ? "Хэрэглээ" : "Ерөнхий мэдлэг" },
        answerKeyVersionHash: "sha256:mock-answer-key",
        optionsOrder: item.options.map((option) => option.id),
        selectionReason: { source: "frontend-runtime-mock" },
        deliveredAt: now,
      },
    });
  }

  await prisma.attemptStateSnapshot.create({
    data: {
      attemptId: "mock-attempt-001",
      snapshotVersion: 1,
      answers: {},
      markedForReview: {},
      currentAttemptQuestionId: "attempt-question-q1",
      lastClientSequence: 0,
      lastResponseServerVersion: 0,
      navigationState: { currentIndex: 0 },
      checksum: "sha256:mock-empty-snapshot",
      capturedAt: now,
    },
  });

  console.log("Execution mock seed completed.");
}

main()
  .catch((error) => {
    console.error("Execution seed failed:", error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
