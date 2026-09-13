import { createHash } from "crypto";
import { BadRequestException } from "@nestjs/common";
export type SelectionPool = {
  id: string;
  count: number;
  candidateIds: string[];
};
export type Override = { questionId: string; mode: "mandatory" | "excluded" };
// Seeded, globally feasible bipartite matching: a shared candidate is never consumed twice.
export function selectPoolQuestions(
  pools: SelectionPool[],
  seed: string,
  overrides: Override[] = [],
): Record<string, string[]> {
  const all = new Set(pools.flatMap((p) => p.candidateIds));
  const modes = new Map<string, string>();
  for (const o of overrides) {
    if (
      !o ||
      !all.has(o.questionId) ||
      !["mandatory", "excluded"].includes(o.mode) ||
      modes.has(o.questionId)
    )
      throw new BadRequestException(
        "Заавал авах/хасах асуултын тохиргоо хүчингүй эсвэл давхардсан.",
      );
    modes.set(o.questionId, o.mode);
  }
  const rank = (id: string) =>
    createHash("sha256")
      .update(seed + "|" + id)
      .digest("hex");
  const slots = pools.flatMap((p) =>
    Array.from({ length: p.count }, (_, i) => ({
      pool: p.id,
      id: p.id + ":" + i,
      candidates: Array.from(new Set(p.candidateIds))
        .filter((q) => modes.get(q) !== "excluded")
        .sort((a, b) => rank(p.id + a).localeCompare(rank(p.id + b))),
    })),
  );
  const assigned = new Map<number, string>();
  const occupied = new Map<string, number>();
  function placeQuestion(q: string, seen: Set<number>): boolean {
    const choices = slots
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.candidates.includes(q))
      .sort((a, b) => rank(q + a.s.id).localeCompare(rank(q + b.s.id)));
    for (const { i } of choices) {
      if (seen.has(i)) continue;
      seen.add(i);
      const old = assigned.get(i);
      if (!old || placeQuestion(old, seen)) {
        assigned.set(i, q);
        occupied.set(q, i);
        return true;
      }
    }
    return false;
  }
  for (const [q, mode] of modes)
    if (mode === "mandatory" && !placeQuestion(q, new Set()))
      throw new BadRequestException(
        "Заавал авах асуултууд хэсгүүдийн тоонд багтахгүй.",
      );
  function fill(i: number, seen: Set<string>): boolean {
    for (const q of slots[i].candidates) {
      if (seen.has(q)) continue;
      seen.add(q);
      const old = occupied.get(q);
      if (old === undefined || fill(old, seen)) {
        assigned.set(i, q);
        occupied.set(q, i);
        return true;
      }
    }
    return false;
  }
  for (let i = 0; i < slots.length; i++)
    if (!assigned.has(i) && !fill(i, new Set()))
      throw new BadRequestException(
        "Давхардалгүй асуултын хүрэлцээ дутуу. Хэсгийн тоо эсвэл сангийн дүрмийг засна уу.",
      );
  const result: Record<string, string[]> = {};
  for (const p of pools) result[p.id] = [];
  for (let i = 0; i < slots.length; i++)
    result[slots[i].pool].push(assigned.get(i)!);
  for (const [q, mode] of modes)
    if (mode === "mandatory" && !Object.values(result).flat().includes(q))
      throw new BadRequestException("Заавал авах асуултыг багтаах боломжгүй.");
  return result;
}
