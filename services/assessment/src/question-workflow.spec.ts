import { actionsFor, validateContent } from "./question-workflow";
const base = {
  title: "Question",
  body: "Body",
  defaultMaxScore: 1,
  defaultMinScore: 0,
  defaultTimeSeconds: 60,
  media: [],
};
const option = { value: "Answer", isCorrect: true, score: 1 };
describe("Question submission and review policy", () => {
  test.each(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"])(
    "%s rejects an empty correct-answer configuration",
    (type) => {
      expect(() =>
        validateContent({
          ...base,
          type,
          options: [
            { ...option, isCorrect: false },
            { ...option, isCorrect: false },
          ],
        }),
      ).toThrow();
      expect(() =>
        validateContent({
          ...base,
          type,
          options: [option, { ...option, isCorrect: false }],
        }),
      ).not.toThrow();
    },
  );
  test.each(["ESSAY", "CASE_BUNDLE"])("%s requires a scored rubric", (type) => {
    expect(() => validateContent({ ...base, type, rubric: [] })).toThrow();
    expect(() =>
      validateContent({ ...base, type, rubric: [{ maxScore: 1 }] }),
    ).not.toThrow();
  });
  test("short text supports manual rubric and explicit answer", () => {
    expect(() =>
      validateContent({
        ...base,
        type: "SHORT_TEXT",
        answerConfig: { answerKey: "-" },
      }),
    ).toThrow();
    expect(() =>
      validateContent({
        ...base,
        type: "SHORT_TEXT",
        rubric: [{ maxScore: 1 }],
      }),
    ).not.toThrow();
    expect(() =>
      validateContent({
        ...base,
        type: "SHORT_TEXT",
        answerConfig: { answerKey: "expected" },
      }),
    ).not.toThrow();
  });
  test("numeric answers reject nonnumeric placeholders", () => {
    expect(() =>
      validateContent({
        ...base,
        type: "NUMERIC",
        options: [{ ...option, value: "wrong" }],
      }),
    ).toThrow();
    expect(() =>
      validateContent({
        ...base,
        type: "NUMERIC",
        options: [{ ...option, value: "0" }],
      }),
    ).not.toThrow();
  });
  test("fill blank requires an answer for every blank", () => {
    expect(() =>
      validateContent({ ...base, type: "FILL_BLANK", options: [option] }),
    ).toThrow();
    expect(() =>
      validateContent({
        ...base,
        type: "FILL_BLANK",
        options: [
          {
            ...option,
            metadata: { acceptedValues: [{ value: "water", score: 1 }] },
          },
        ],
      }),
    ).not.toThrow();
  });
  test.each(["ORDERING", "LIKERT", "SJT"])(
    "%s validates its options",
    (type) => {
      expect(() => validateContent({ ...base, type, options: [] })).toThrow();
      const opt = { ...option, matchRules: { matchValue: "right" } };
      expect(() =>
        validateContent({ ...base, type, options: [opt, opt] }),
      ).not.toThrow();
    },
  );
  test("author cannot approve own question even with admin role", () => {
    expect(
      actionsFor(
        { ownerUserId: "u", versions: [{ versionStatus: "IN_REVIEW" }] },
        { id: "u", roles: ["SUPER_ADMIN", "ASSESSOR"] },
      ),
    ).toEqual(["withdraw"]);
  });
  test("approval and publication are separate decisions", () => {
    expect(
      actionsFor(
        { ownerUserId: "a", versions: [{ versionStatus: "IN_REVIEW" }] },
        { id: "r", roles: ["SUPER_ADMIN"] },
      ),
    ).not.toContain("publish");
    expect(
      actionsFor(
        { ownerUserId: "a", versions: [{ versionStatus: "APPROVED" }] },
        { id: "r", roles: ["SUPER_ADMIN"] },
      ),
    ).toEqual(["publish"]);
  });
});

const matching = {
  ...base,
  type: "MATCHING",
  options: [
    { ...option, optionKey: "left-a", matchRules: { matchValue: "right-b" } },
    { ...option, optionKey: "left-b", matchRules: { matchValue: "right-a" } },
  ],
  scoringConfig: {
    scoringMode: "per_option",
    rightOptions: [
      { id: "right-a", value: "A" },
      { id: "right-b", value: "B" },
    ],
  },
};
test("matching validates real per-option and combination payloads", () => {
  expect(() => validateContent(matching)).not.toThrow();
  expect(() =>
    validateContent({
      ...matching,
      options: matching.options.map((o) => ({ ...o, matchRules: {} })),
    }),
  ).toThrow();
  const combo = {
    ...matching,
    options: matching.options.map((o) => ({ ...o, matchRules: {} })),
    scoringConfig: {
      ...matching.scoringConfig,
      scoringMode: "combination",
      combinations: [{ ids: ["left-a:right-b", "left-b:right-a"], score: 2 }],
    },
  };
  expect(() => validateContent(combo)).not.toThrow();
  expect(() =>
    validateContent({
      ...combo,
      scoringConfig: {
        ...combo.scoringConfig,
        combinations: [{ ids: ["left-a:removed", "left-b:right-a"], score: 2 }],
      },
    }),
  ).toThrow();
  expect(() =>
    validateContent({
      ...matching,
      scoringConfig: {
        ...matching.scoringConfig,
        rightOptions: [
          { id: "right-a", value: "A" },
          { id: "right-a", value: "B" },
        ],
      },
    }),
  ).toThrow();
});
test("matrix rejects missing columns and dangling answer references", () => {
  const matrix = {
    ...base,
    type: "MATRIX",
    scoringConfig: {
      matrixColumns: [
        { id: "yes", label: "Тийм" },
        { id: "no", label: "Үгүй" },
      ],
    },
    options: [{ ...option, matchRules: { matchValue: "yes" } }],
  };
  expect(() => validateContent(matrix)).not.toThrow();
  expect(() =>
    validateContent({ ...matrix, scoringConfig: { matrixColumns: [] } }),
  ).toThrow();
  expect(() =>
    validateContent({
      ...matrix,
      options: [{ ...option, matchRules: { matchValue: "removed" } }],
    }),
  ).toThrow();
});
