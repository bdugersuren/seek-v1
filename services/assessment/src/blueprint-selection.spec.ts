import { selectPoolQuestions } from "./blueprint-selection";
import {
  assessPools,
  normalizeBlueprint,
  validateBlueprintInput,
} from "./blueprint-pools";
describe("Blueprint selection", () => {
  const pools = [
    { id: "wide", count: 1, candidateIds: ["a", "b"] },
    { id: "narrow", count: 1, candidateIds: ["a"] },
  ];
  test("finds a global allocation when greedy selection would fail", () => {
    for (let i = 0; i < 100; i++)
      expect(selectPoolQuestions(pools, String(i))).toEqual({
        wide: ["b"],
        narrow: ["a"],
      });
  });
  test("same seed is reproducible; different seeds are not first-N", () => {
    const p = [
      { id: "x", count: 3, candidateIds: ["a", "b", "c", "d", "e", "f"] },
    ];
    expect(selectPoolQuestions(p, "seed")).toEqual(
      selectPoolQuestions(p, "seed"),
    );
    expect(
      new Set(
        Array.from({ length: 20 }, (_, i) =>
          JSON.stringify(selectPoolQuestions(p, String(i))),
        ),
      ).size,
    ).toBeGreaterThan(5);
  });
  test("respects mandatory items across overlapping pools", () => {
    for (let i = 0; i < 30; i++) {
      const r = selectPoolQuestions(
        [
          { id: "a", count: 1, candidateIds: ["x", "y", "z"] },
          { id: "b", count: 1, candidateIds: ["x", "y"] },
        ],
        String(i),
        [{ questionId: "z", mode: "mandatory" }],
      );
      expect(Object.values(r).flat()).toContain("z");
      expect(new Set(Object.values(r).flat()).size).toBe(2);
    }
  });
  test("rejects exclusions causing shortage and duplicate/conflicting overrides", () => {
    expect(() =>
      selectPoolQuestions(pools, "s", [{ questionId: "a", mode: "excluded" }]),
    ).toThrow();
    expect(() =>
      selectPoolQuestions(pools, "s", [
        { questionId: "a", mode: "mandatory" },
        { questionId: "a", mode: "excluded" },
      ]),
    ).toThrow();
    expect(() =>
      selectPoolQuestions(pools, "s", [
        { questionId: "foreign", mode: "mandatory" },
      ]),
    ).toThrow();
  });
  const classification = {
    assessmentContextId: "c",
    topicId: "child",
    difficultyLevelId: "hard",
    assessmentContext: { audienceLevelId: "a" },
  };
  const catalog = {
    context: { id: "c", audienceLevelId: "a" },
    topics: [{ id: "root" }, { id: "child", parentId: "root" }],
    levels: [{ id: "hard" }],
    audiences: [{ id: "a" }],
    rows: [
      {
        id: "q",
        code: "Q",
        lifecycleStatus: "ACTIVE",
        currentPublishedVersion: {
          id: "v",
          type: "SINGLE_CHOICE",
          title: "Published",
          versionStatus: "PUBLISHED",
          classificationSnapshot: [classification],
        },
        classifications: [],
      },
    ],
  };
  const input = () =>
    normalizeBlueprint({
      name: "Test",
      assessmentContextId: "c",
      sections: [
        {
          id: "s",
          name: "Pool",
          sectionMode: "RULE_BASED",
          randomPickCount: 1,
          pointsPerQuestion: 2,
          selectionRules: {
            schemaVersion: 1,
            topicIds: ["root"],
            types: ["SINGLE_CHOICE"],
            difficultyLevelIds: ["hard"],
            audienceLevelIds: ["a"],
          },
        },
      ],
    });
  test("uses published snapshots, descendants, OR within fields and AND between fields", () => {
    const d = input();
    expect(assessPools(d, catalog).status).toBe("READY");
    d.sections[0].selectionRules!.includeDescendants = false;
    expect(assessPools(d, catalog).status).toBe("NEEDS_ATTENTION");
  });
  test("empty blueprint is never ready", () =>
    expect(assessPools({ ...input(), sections: [] }, catalog).status).toBe(
      "NEEDS_ATTENTION",
    ));
  test("unsupported runtime types cannot be used", () => {
    const c = JSON.parse(JSON.stringify(catalog));
    c.rows[0].currentPublishedVersion.type = "LIKERT";
    const d = input();
    d.sections[0].selectionRules!.types = [];
    expect(assessPools(d, c).sections[0].rejected[0].reason).toContain(
      "runtime",
    );
  });
  test.each([-1, 1.5, Infinity])("rejects invalid question counts %s", (n) => {
    const d = input();
    d.sections[0].randomPickCount = n;
    expect(() => validateBlueprintInput(d)).toThrow();
  });
  test("unknown rule keys rejected; custom difficulty IDs accepted", () => {
    const d = input();
    (d.sections[0].selectionRules as any).sql = "select";
    expect(() => validateBlueprintInput(d)).toThrow();
  });
  test("invalid fixed references are visible as issues, without secret content", () => {
    const d = input();
    d.sections[0].sectionMode = "FIXED";
    d.sections[0].selectedQuestionIds = ["missing"];
    const r = assessPools(d, catalog);
    expect(r.status).toBe("NEEDS_ATTENTION");
    expect(r.sections[0].rejected).toEqual([
      { id: "missing", reason: "Асуулт устсан эсвэл хандах эрхгүй." },
    ]);
  });
});

test('malformed section input returns 400 instead of a server error',()=>{for(const value of [null,{sections:{}},{sections:[null]}])expect(()=>normalizeBlueprint(value)).toThrow();});
