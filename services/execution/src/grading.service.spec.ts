import { autoScore } from "./grading.service";
const options = [
  { id: "a", score: 1, isCorrect: true },
  { id: "b", score: 1, isCorrect: true },
  { id: "c", score: -1, isCorrect: false },
];
test("choice per-option scores, penalties and quiz score scaling", () => {
  const q = {
    type: "MULTIPLE_CHOICE",
    options,
    scoringConfig: { scoringMode: "per_option" },
    defaultMaxScore: 2,
  };
  expect(autoScore(q, ["a"], 4)).toBe(2);
  expect(autoScore(q, ["a", "c"], 4)).toBe(0);
  expect(autoScore(q, ["a", "a"], 4)).toBe(0);
  expect(autoScore(q, ["missing"], 4)).toBe(0);
  expect(
    autoScore(
      {
        ...q,
        scoringConfig: {
          scoringMode: "combination",
          combinations: [{ ids: ["b", "a"], score: 2 }],
        },
      },
      ["a", "b"],
      4,
    ),
  ).toBe(4);
});
test("legacy snapshots preserve exact-set policy", () => {
  expect(autoScore({ type: "MULTIPLE_CHOICE", options }, ["a"], 2)).toBe(0);
  expect(autoScore({ type: "MULTIPLE_CHOICE", options }, ["a", "b"], 2)).toBe(
    2,
  );
});
test("matching and matrix per-row and combination scoring", () => {
  const q = {
    type: "MATCHING",
    defaultMaxScore: 2,
    options: [
      { id: "left-a", score: 1, matchRules: { matchValue: "right-b" } },
      { id: "left-b", score: 1, matchRules: { matchValue: "right-a" } },
    ],
    scoringConfig: { scoringMode: "per_option" },
  };
  expect(autoScore(q, { "left-a": "right-b" }, 2)).toBe(1);
  expect(
    autoScore(
      { ...q, type: "MATRIX" },
      { "left-a": "right-b", "left-b": "right-a" },
      2,
    ),
  ).toBe(2);
  expect(
    autoScore(
      {
        ...q,
        scoringConfig: {
          scoringMode: "combination",
          combinations: [
            { ids: ["left-a:right-b", "left-b:right-a"], score: 2 },
          ],
        },
      },
      { "left-a": "right-b", "left-b": "right-a" },
      2,
    ),
  ).toBe(2);
  expect(autoScore(q, { missing: "right-a" }, 2)).toBe(0);
});
test("numeric target and tolerance survive editor representation", () => {
  expect(
    autoScore(
      {
        type: "NUMERIC",
        options: [{ value: "10", matchRules: { matchValue: "0.5" } }],
      },
      "10.4",
      2,
    ),
  ).toBe(2);
  expect(
    autoScore(
      {
        type: "NUMERIC",
        options: [{ value: "10", matchRules: { matchValue: "0.5" } }],
      },
      "10.6",
      2,
    ),
  ).toBe(0);
});
