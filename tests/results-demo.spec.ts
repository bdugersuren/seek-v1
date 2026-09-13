import {
  questions,
  makeAttempts,
  totals,
  leaderboard,
  groups,
  distribution,
  expected,
} from "../apps/portal-web/src/features/results/demo/model";
describe("Results demo integrity", () => {
  test("covers 13 types and 12 people with repeat attempts", () => {
    const a = makeAttempts("graded");
    expect(new Set(questions.map((q) => q.type)).size).toBe(13);
    expect(new Set(a.map((x) => x.personId)).size).toBe(12);
    expect(a.length).toBeGreaterThan(12);
    for (const x of a) expect(Object.keys(x.responses)).toHaveLength(13);
  });
  test("all response values agree with declared scores for structured rows", () => {
    for (const a of makeAttempts("graded"))
      for (const q of questions) {
        const r = a.responses[q.id];
        if (
          [
            "MATCHING",
            "MATRIX",
            "ORDERING",
            "FILL_BLANK",
            "CASE_BUNDLE",
          ].includes(q.type)
        ) {
          const target = expected(q);
          expect(r.score).toBeCloseTo(
            (target.filter((v, i) => v === r.value[i]).length / target.length) *
              q.max,
          );
        }
      }
  });
  test("Likert excluded and case children counted once", () => {
    const a = makeAttempts("graded")[0];
    expect(totals(a).max).toBe(48);
    expect(a.responses.q10.score).toBeNull();
    expect(questions.find((q) => q.type === "CASE_BUNDLE")?.max).toBe(4);
    expect(groups([a], "type").find((g) => g.label === "LIKERT")?.max).toBe(0);
  });
  test("pending cannot enter final leaderboard", () => {
    const a = makeAttempts("pending");
    expect(a.every((x) => totals(x).pending)).toBe(true);
    expect(leaderboard(a)).toEqual([]);
    expect(a.every((x) => x.responses.q13.score === null)).toBe(true);
  });
  test("ties share competition ranks regardless of duration", () => {
    const rows = leaderboard(makeAttempts("graded"));
    expect(rows.length).toBe(12);
    const tie = rows.filter((r) => r.score === rows[0].score);
    expect(tie.length).toBeGreaterThan(1);
    expect(new Set(tie.map((r) => r.rank)).size).toBe(1);
    expect(rows[tie.length].rank).toBe(tie.length + 1);
  });
  test("empty does not manufacture zeros, locked keeps score stable", () => {
    expect(makeAttempts("empty")).toEqual([]);
    expect(leaderboard([])).toEqual([]);
    expect(makeAttempts("locked")).toEqual(makeAttempts("graded"));
  });
  test("group totals reconcile to individual scored totals", () => {
    const a = makeAttempts("graded");
    for (const key of ["topic", "difficulty", "type"] as const) {
      const g = groups(a, key);
      expect(g.reduce((s, x) => s + x.score, 0)).toBeCloseTo(
        a.reduce((s, x) => s + totals(x).score, 0),
      );
      expect(g.reduce((s, x) => s + x.max, 0)).toBe(a.length * 48);
    }
  });
  test("distributions count every attempt and partial scores exist", () => {
    const a = makeAttempts("graded");
    for (const q of questions)
      expect(distribution(a, q).reduce((s, x) => s + x.count, 0)).toBe(
        a.length,
      );
    expect(
      a.some((x) =>
        Object.values(x.responses).some((r) => r.status === "partial"),
      ),
    ).toBe(true);
  });
});
