import type { QuestionWizardState } from "./types";
/** Drafts remain saveable; these messages describe submission requirements. */
export function structuredAnswerErrors(state: QuestionWizardState): string[] {
  if (!["MATCHING", "MATRIX"].includes(state.type)) return [];
  const errors: string[] = [],
    config = state.scoringConfig || {},
    rows = state.options;
  const choices =
    state.type === "MATRIX"
      ? config.matrixColumns || []
      : config.rightOptions || [];
  const ids = new Set(choices.map((c: any) => c.id));
  if (
    choices.length < 2 ||
    ids.size !== choices.length ||
    choices.some((c: any) => !String(c.label ?? c.value ?? "").trim())
  )
    errors.push(
      "Баруун хариулт / багана бүрийн нэрийг бөглөнө үү. Дор хаяж хоёр сонголт шаардлагатай.",
    );
  if (rows.length < (state.type === "MATCHING" ? 2 : 1))
    errors.push("Асуултын мөрүүдийг нэмнэ үү.");
  rows.forEach((row, index) => {
    if (!row.value.trim())
      errors.push(`Мөр ${index + 1}: агуулгыг бөглөнө үү.`);
    if (state.scoringMode !== "combination" && !ids.has(row.matchValue))
      errors.push(`Мөр ${index + 1}: харгалзах зөв хариултыг сонгоно уу.`);
  });
  if (state.scoringMode === "combination") {
    if (state.type === "MATRIX")
      errors.push("Матрицад харгалзах оноо горим сонгоно уу.");
    else {
      const combos = config.combinations || [],
        keys = rows.map((o) => o.optionKey || o.id);
      if (!combos.length)
        errors.push("Харгалзуулах хослолын оноог тохируулна уу.");
      combos.forEach((c: any, index: number) => {
        const pairs = (c.ids || []).map((id: string) => id.split(":"));
        if (
          !Number.isFinite(Number(c.score)) ||
          pairs.length !== keys.length ||
          new Set(pairs.map((p: string[]) => p[0])).size !== keys.length ||
          pairs.some(
            (p: string[]) =>
              p.length !== 2 || !keys.includes(p[0]) || !ids.has(p[1]),
          )
        )
          errors.push(
            `Хослол ${index + 1}: мөр бүрийн хүчинтэй харгалзаа, оноог тохируулна уу.`,
          );
      });
    }
  }
  return errors;
}
