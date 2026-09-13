import {
  quizActions,
  quizSettings,
  snapshotReadiness,
  assertQuizVersion,
  quizHash,
} from "./quiz-workflow";
const owner = { id: "owner", roles: ["ASSESSOR"] },
  admin = { id: "admin", roles: ["SUPER_ADMIN"] };
function fixture(status = "DRAFT") {
  const r: any = {
    id: "r",
    revisionStatus: status,
    title: "Quiz",
    durationMinutes: 30,
    passingScore: 70,
    maxAttempts: 1,
    totalQuestionCount: 1,
    totalMaxScore: 2,
    sections: [
      {
        title: "Pool",
        questionCount: 1,
        maxScorePerQuestion: 2,
        questions: [
          {
            questionId: "q",
            maxScore: 2,
            question: {
              deletedAt: null,
              lifecycleStatus: "ACTIVE",
              ownerUserId: "owner",
            },
            questionVersion: {
              type: "SINGLE_CHOICE",
              versionStatus: "PUBLISHED",
            },
          },
        ],
      },
    ],
  };
  return {
    q: {
      createdBy: "owner",
      version: 3,
      lifecycleStatus: "DRAFT",
      revisions: [r],
    },
    r,
  };
}
test("author and reviewer have separate allowed actions", () => {
  const { q, r } = fixture("IN_REVIEW");
  expect(quizActions(q, r, owner)).toEqual(["withdraw"]);
  expect(quizActions(q, r, admin)).toEqual(["approve", "changes_requested"]);
  expect(
    quizActions(q, r, { id: "owner", roles: ["SUPER_ADMIN"] }),
  ).not.toContain("approve");
});
test("published revision is read only and clones only without an active draft", () => {
  const { q, r } = fixture("PUBLISHED");
  expect(quizActions(q, r, owner)).toEqual(["new_revision"]);
  q.revisions.unshift({ ...r, id: "draft", revisionStatus: "DRAFT" });
  expect(quizActions(q, r, owner)).toEqual([]);
});
test("readiness uses pinned published question versions", () => {
  const { q, r } = fixture();
  expect(snapshotReadiness(q, r).status).toBe("READY");
  r.sections[0].questions[0].questionVersion.versionStatus = "RETIRED";
  expect(snapshotReadiness(q, r).status).toBe("NEEDS_ATTENTION");
});
test("duplicate questions and mismatched totals block readiness", () => {
  const { q, r } = fixture();
  r.sections[0].questions.push(r.sections[0].questions[0]);
  expect(snapshotReadiness(q, r).issues).toContain("Асуулт давхардсан.");
  expect(snapshotReadiness(q, r).issues).toContain("Нийт тоо/оноо зөрсөн.");
});
test.each([null, [],
  { title: " " },
  { durationMinutes: 0 },
  { durationMinutes: 1.2 },
  { passingScore: 101 },
  { passingScore: NaN },
  { maxAttempts: 0 },
  { questionOverrides: [null] },
  { reselectQuestions: "yes" },
])("rejects malformed settings %j", (value) =>
  expect(() => quizSettings(value)).toThrow(),
);
test("zero passing threshold is valid", () =>
  expect(() => quizSettings({ passingScore: 0 })).not.toThrow());
test("client version is required", () => {
  const { q } = fixture();
  expect(() => assertQuizVersion(q, {})).toThrow();
  expect(() => assertQuizVersion(q, { expectedVersion: 2 })).toThrow();
  expect(() => assertQuizVersion(q, { expectedVersion: 3 })).not.toThrow();
});
test("request hash is property-order independent and payload sensitive", () => {
  expect(quizHash({ a: 1, b: 2 })).toBe(quizHash({ b: 2, a: 1 }));
  expect(quizHash({ a: 2 })).not.toBe(quizHash({ a: 1 }));
});
