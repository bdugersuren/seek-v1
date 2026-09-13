jest.mock("@/lib/auth-client", () => ({ authFetch: jest.fn() }), {
  virtual: true,
});
jest.mock(
  "../apps/portal-web/src/features/assessor-workspace/mock-data",
  () => ({ mockBlueprints: [], mockQuestionBank: [] }),
);
import { optionLetter } from "../apps/portal-web/src/features/assessor-workspace/option-label";
import {
  mapVersionToQuestionBankItem,
  mapToCreateQuestionDto,
} from "../apps/portal-web/src/features/assessor-workspace/api";

test("display letters cover more than 26 options", () => {
  expect([0, 25, 26, 27, 51, 52].map(optionLetter)).toEqual([
    "A",
    "Z",
    "AA",
    "AB",
    "AZ",
    "BA",
  ]);
});
test("database answer identities never become display labels after reload", () => {
  const version = {
    id: "v1",
    type: "MULTIPLE_CHOICE",
    versionStatus: "DRAFT",
    options: [
      {
        optionKey: "long-stable-id-2",
        value: "second",
        orderIndex: 2,
        score: 0,
      },
      {
        optionKey: "long-stable-id-1",
        value: "first",
        orderIndex: 1,
        score: 1,
      },
    ],
  };
  const item = mapVersionToQuestionBankItem(version, {
    id: "q1",
    classifications: [
      {
        difficultyLevel: { code: "CUSTOM", name: "Тусгай", rank: 3 },
        assessmentContextId: "ctx",
      },
    ],
  });
  expect(item.options.map((o) => o.label)).toEqual(["A", "B"]);
  expect(item.options.map((o) => o.id)).toEqual([
    "long-stable-id-1",
    "long-stable-id-2",
  ]);
  expect(item.difficultyName).toBe("Тусгай");
  expect(item.difficulty).toBe("CUSTOM");
  const saved = mapToCreateQuestionDto(item);
  expect(saved.payload.options.map((o) => o.optionKey)).toEqual([
    "long-stable-id-1",
    "long-stable-id-2",
  ]);
  expect(saved.payload.options.map((o) => o.metadata.displayLabel)).toEqual([
    "A",
    "B",
  ]);
});
test("matching and matrix retain answer references and scoring configuration", () => {
  for (const type of ["MATCHING", "MATRIX"]) {
    const scoringConfig = {
      scoringMode: "per_option",
      rightOptions: [{ id: "r1", value: "Зөв" }],
      matrixColumns: [{ id: "r1", label: "Тийм" }],
    };
    const item = mapVersionToQuestionBankItem(
      {
        type,
        scoringConfig,
        options: [
          {
            optionKey: "left1",
            value: "Мөр",
            score: 1,
            matchRules: { matchValue: "r1" },
          },
        ],
      },
      { id: "q" },
    );
    const saved = mapToCreateQuestionDto(item);
    expect(saved.payload.options[0].matchRules.matchValue).toBe("r1");
    expect(saved.scoringConfig.rightOptions).toEqual(
      scoringConfig.rightOptions,
    );
    expect(saved.scoringConfig.matrixColumns).toEqual(
      scoringConfig.matrixColumns,
    );
  }
});
