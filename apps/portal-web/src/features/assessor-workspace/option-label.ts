/** Display position is independent of persisted answer identity. */
export function optionLetter(index: number): string {
  let value = index + 1,
    label = "";
  while (value > 0) {
    value--;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}
export function optionLabel(
  type: string,
  index: number,
  stored?: string,
): string {
  if (type === "ORDERING") return String(index + 1);
  if (type === "MATCHING") return `L${index + 1}`;
  if (type === "MATRIX") return stored || `Мөр ${index + 1}`;
  if (type === "TRUE_FALSE") return index === 0 ? "Үнэн" : "Худал";
  if (["SINGLE_CHOICE", "MULTIPLE_CHOICE", "SJT"].includes(type))
    return optionLetter(index);
  return stored || String(index + 1);
}
export const defaultMatrixColumns = [
  { id: "col_1", label: "Сайн" },
  { id: "col_2", label: "Дунд" },
  { id: "col_3", label: "Муу" },
];
