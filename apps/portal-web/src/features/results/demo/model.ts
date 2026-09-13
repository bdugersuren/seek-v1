import type { QuestionType } from "../../assessor-workspace/types";
export type Scenario = "graded" | "pending" | "locked" | "empty";
export type Status =
  "correct" | "partial" | "wrong" | "unanswered" | "pending" | "unscored";
export const statusLabels: Record<Status, string> = {
  correct: "Зөв",
  partial: "Хэсэгчлэн зөв",
  wrong: "Буруу",
  unanswered: "Хариулаагүй",
  pending: "Үнэлгээ хүлээж байгаа",
  unscored: "Оноогүй",
};
type Choice = { options: string[]; correct: number[] };
type Pair = { rows: string[]; columns: string[]; correct: number[] };
type Content =
  | ({
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SJT";
    } & Choice)
  | { type: "ORDERING"; items: string[] }
  | ({ type: "MATCHING" | "MATRIX" } & Pair)
  | { type: "SHORT_TEXT"; accepted: string[] }
  | { type: "FILL_BLANK"; parts: string[]; accepted: string[] }
  | { type: "NUMERIC"; target: number; tolerance: number; unit: string }
  | { type: "LIKERT"; scale: string[] }
  | {
      type: "CASE_BUNDLE";
      children: { prompt: string; expected: string; explanation: string }[];
    }
  | { type: "ESSAY"; example: string; rubric: string[] };
export type Question = Content & {
  id: string;
  prompt: string;
  topic: string;
  difficulty: string;
  max: number;
  explanation: string;
};
export type Response = {
  value: string[];
  score: number | null;
  seconds: number;
  status: Status;
};
export type Attempt = {
  id: string;
  personId: string;
  ordinal: number;
  responses: Record<string, Response>;
};
export const people = [
  "Ану",
  "Билгүүн",
  "Саруул",
  "Тэмүүлэн",
  "Номин",
  "Мөнх",
  "Энэрэл",
  "Төгөлдөр",
  "Хулан",
  "Идэр",
  "Мишээл",
  "Тэнүүн",
].map((name, i) => ({
  id: `person-${i + 1}`,
  name: `${name} · жишиг ${i + 1}`,
}));
const raw: (Content & {
  prompt: string;
  topic: string;
  explanation: string;
})[] = [
  {
    type: "SINGLE_CHOICE",
    prompt: "5/6 − 1/3 = ?",
    topic: "Тоон сэтгэлгээ",
    options: ["1/2", "4/3", "4/6", "4/9"],
    correct: [0],
    explanation: "1/3 = 2/6. Иймээс 5/6 − 2/6 = 3/6 = 1/2.",
  },
  {
    type: "MULTIPLE_CHOICE",
    prompt: "Анхны тоонуудыг сонгоно уу.",
    topic: "Тоон сэтгэлгээ",
    options: ["2", "3", "4", "9"],
    correct: [0, 1],
    explanation:
      "2, 3 нь зөвхөн 1 болон өөртөө хуваагдана. Зөв сонголт бүр 2 оноо, илүү сонголт бүр −2; нийт 0–4 оноо.",
  },
  {
    type: "TRUE_FALSE",
    prompt: "Ус ердийн даралтад 100°C-д буцална.",
    topic: "Шинжлэх ухаан",
    options: ["Үнэн", "Худал"],
    correct: [0],
    explanation: "Агаарын даралт 1 атмосфер үед усны буцлах температур 100°C.",
  },
  {
    type: "ORDERING",
    prompt: "Судалгааны алхмуудыг дарааллуулна уу.",
    topic: "Судалгааны арга",
    items: [
      "Асуудал тодорхойлох",
      "Таамаглал дэвшүүлэх",
      "Туршилт хийх",
      "Дүгнэлт гаргах",
    ],
    explanation:
      "Таамаглалыг туршилтаар шалгасны дараа дүгнэлт гаргана. Зөв байрлал бүр ижил жинтэй.",
  },
  {
    type: "MATCHING",
    prompt: "Хэмжигдэхүүнийг нэгжтэй харгалзуулна уу.",
    topic: "Шинжлэх ухаан",
    rows: ["Урт", "Масс", "Хугацаа"],
    columns: ["Метр", "Килограмм", "Секунд"],
    correct: [0, 1, 2],
    explanation:
      "SI системд урт — метр, масс — килограмм, хугацаа — секунд. Мөр бүр ижил жинтэй.",
  },
  {
    type: "SHORT_TEXT",
    prompt: "Монгол Улсын нийслэлийг бичнэ үү.",
    topic: "Ерөнхий мэдлэг",
    accepted: ["Улаанбаатар", "Ulaanbaatar"],
    explanation: "Улаанбаатар эсвэл Ulaanbaatar гэсэн хувилбарыг зөвшөөрнө.",
  },
  {
    type: "FILL_BLANK",
    prompt: "Усны төлөвийн өөрчлөлтийг нөхнө үү.",
    topic: "Шинжлэх ухаан",
    parts: ["Мөс хайлахад ", " болж, буцлахад ", " болно."],
    accepted: ["ус", "уур"],
    explanation:
      "Хатуу төлөвөөс шингэн, дараа нь хийн төлөвт шилжинэ. Хоосон зай бүр 2 оноо.",
  },
  {
    type: "MATRIX",
    prompt: "Мэдээллийн эх сурвалжийн найдвартай байдлыг үнэлнэ үү.",
    topic: "Мэдээллийн чадвар",
    rows: ["Эх сурвалжтай судалгаа", "Нэргүй нийтлэл", "Албан статистик"],
    columns: ["Найдвартай", "Нягтлах шаардлагатай"],
    correct: [0, 1, 0],
    explanation:
      "Эх сурвалж болон аргачлалтай мэдээллийг шалгаж болно. Нэргүй мэдээллийг нягтална. Мөр бүр ижил жинтэй.",
  },
  {
    type: "NUMERIC",
    prompt: "10 метрийг 4 секундэд туулсан хурд хэд вэ?",
    topic: "Тоон сэтгэлгээ",
    target: 2.5,
    tolerance: 0.05,
    unit: "м/с",
    explanation:
      "Хурд = зам / хугацаа = 10 / 4 = 2.5 м/с. ±0.05 м/с хэлбэлзлийг зөвшөөрнө.",
  },
  {
    type: "LIKERT",
    prompt: "Би шинэ мэдээллийн эх сурвалжийг тогтмол шалгадаг.",
    topic: "Өөрийн үнэлгээ",
    scale: [
      "Огт санал нийлэхгүй",
      "Санал нийлэхгүй",
      "Төвийг сахисан",
      "Санал нийлнэ",
      "Бүрэн санал нийлнэ",
    ],
    explanation:
      "Өөрийн үнэлгээ тул зөв эсвэл буруу хариултгүй. Нийт оноо, тэнцэх хувь, эрэмбэд нөлөөлөхгүй.",
  },
  {
    type: "SJT",
    prompt: "Багийн тайланд баталгаагүй тоо орсныг илрүүлбэл яах вэ?",
    topic: "Шийдвэр гаргалт",
    options: [
      "Эх сурвалжийг шалгаж багтай засварлах",
      "Тайланг шууд илгээх",
      "Зөвхөн хамтрагчдаа хэлэх",
    ],
    correct: [0],
    explanation:
      "Эх сурвалжийг шалгаж засварлах — 4; хамтрагчдаа мэдэгдэх — 2; шалгахгүй илгээх — 0 оноо.",
  },
  {
    type: "CASE_BUNDLE",
    prompt:
      "Сургуулийн 100 сурагчийн 60 нь нийтийн тээврээр ирдэг. Судалгаа нэг өдөр хийгдсэн.",
    topic: "Судалгааны арга",
    children: [
      {
        prompt: "Нийтийн тээврээр ирсэн хувь?",
        expected: "60%",
        explanation: "60 / 100 × 100 = 60%.",
      },
      {
        prompt: "Үр дүнг баталгаажуулах дараагийн алхам?",
        expected: "Олон өдөр давтан судлах",
        explanation:
          "Нэг өдрийн хэлбэлзлийг багасгахын тулд олон өдөр мэдээлэл цуглуулна.",
      },
    ],
    explanation:
      "Дэд асуулт тус бүр 2 оноо. Кейсийн нийлбэрийг нийт оноонд нэг удаа тооцно.",
  },
  {
    type: "ESSAY",
    prompt:
      "Цахим мэдээллийн найдвартай байдлыг хэрхэн шалгах вэ? Товч тайлбарлана уу.",
    topic: "Мэдээллийн чадвар",
    example:
      "Зохиогч, нийтэлсэн огноо, анхдагч эх сурвалжийг шалгана. Өөр найдвартай эх сурвалжтай тулгаж, нотолгоог дүгнэнэ.",
    rubric: ["Эх сурвалжийг шалгах", "Нотолгоо ба харьцуулалт"],
    explanation:
      "Шалгуур тус бүр 0–2 оноо. Жишиг бичвэр нь боломжит сайн хариултын нэг; бусад үндэслэлтэй хариултыг зөвшөөрнө.",
  },
];
export const questions: Question[] = raw.map((q, i) => ({
  ...q,
  id: `q${i + 1}`,
  max: q.type === "LIKERT" ? 0 : 4,
  difficulty: ["Хялбар", "Дунд", "Хүнд"][i % 3],
}));
export const demoOnly: QuestionType[] = [
  "ORDERING",
  "FILL_BLANK",
  "LIKERT",
  "SJT",
  "CASE_BUNDLE",
];
export function expected(q: Question): string[] {
  switch (q.type) {
    case "SINGLE_CHOICE":
    case "MULTIPLE_CHOICE":
    case "TRUE_FALSE":
    case "SJT":
      return q.correct.map(String);
    case "ORDERING":
      return q.items;
    case "MATCHING":
    case "MATRIX":
      return q.correct.map(String);
    case "SHORT_TEXT":
      return [q.accepted[0]];
    case "FILL_BLANK":
      return q.accepted;
    case "NUMERIC":
      return [String(q.target)];
    case "LIKERT":
      return ["3"];
    case "CASE_BUNDLE":
      return q.children.map((c) => c.expected);
    case "ESSAY":
      return [q.example];
  }
}
function response(q: Question, mode: number, seed: number): Response {
  let value = expected(q);
  let score: number | null = q.max;
  if (q.type === "LIKERT")
    return {
      value: [String(seed % 5)],
      score: null,
      seconds: 18,
      status: "unscored",
    };
  if (mode === 4)
    return { value: [], score: 0, seconds: 0, status: "unanswered" };
  if (mode === 1 || mode === 2) {
    switch (q.type) {
      case "MULTIPLE_CHOICE":
        value = ["0"];
        score = 2;
        break;
      case "ORDERING":
        value = [q.items[1], q.items[0], ...q.items.slice(2)];
        score = 2;
        break;
      case "MATCHING":
      case "MATRIX":
        value = q.correct.map((c, i) =>
          String(i === 0 ? (c + 1) % q.columns.length : c),
        );
        score = 8 / 3;
        break;
      case "FILL_BLANK":
        value = ["ус", "мөс"];
        score = 2;
        break;
      case "CASE_BUNDLE":
        value = ["60%", "Нэг өдөр хангалттай"];
        score = 2;
        break;
      case "ESSAY":
        value = ["Зохиогч болон эх сурвалжийг шалгана."];
        score = 2;
        break;
      case "SJT":
        value = ["2"];
        score = 2;
        break;
      default:
        score = 0;
        value =
          q.type === "NUMERIC"
            ? ["4"]
            : q.type === "SHORT_TEXT"
              ? ["Дархан"]
              : ["1"];
    }
  }
  if (mode === 3) {
    score = 0;
    value =
      q.type === "ESSAY"
        ? ["Мэдэхгүй."]
        : q.type === "SHORT_TEXT"
          ? ["Дархан"]
          : q.type === "NUMERIC"
            ? ["10"]
            : q.type === "ORDERING"
              ? [...q.items].reverse()
              : q.type === "CASE_BUNDLE"
                ? ["10%", "Шалгахгүй"]
                : q.type === "FILL_BLANK"
                  ? ["мөс", "цас"]
                  : q.type === "MULTIPLE_CHOICE"
                    ? ["2"]
                    : q.type === "SJT"
                      ? ["1"]
                      : q.type === "MATCHING" || q.type === "MATRIX"
                        ? q.correct.map((c) =>
                            String((c + 1) % q.columns.length),
                          )
                        : ["1"];
  }
  return {
    value,
    score,
    seconds: 35 + (seed % 9) * 11,
    status: score === q.max ? "correct" : score === 0 ? "wrong" : "partial",
  };
}
export function makeAttempts(scenario: Scenario): Attempt[] {
  if (scenario === "empty") return [];
  return people.flatMap((p, i) =>
    Array.from({ length: i % 3 === 0 ? 2 : 1 }, (_, j) => ({
      id: `${p.id}-attempt-${j + 1}`,
      personId: p.id,
      ordinal: j + 1,
      responses: Object.fromEntries(
        questions.map((q, k) => {
          const r = response(
            q,
            i % 4 === 0 ? (k % 5 === 0 ? 1 : 0) : (i + k + j) % 5,
            i + k + j,
          );
          if (scenario === "pending" && q.type === "ESSAY") {
            r.score = null;
            r.status = "pending";
            if (!r.value.length)
              r.value = ["Үнэлэгчийн хяналтыг хүлээж буй жишиг бичвэр."];
          }
          return [q.id, r];
        }),
      ),
    })),
  );
}
export const round = (n: number) => Math.round(n * 100) / 100;
export function totals(a: Attempt) {
  const responses = questions.map((q) => a.responses[q.id]);
  const pending = responses.some((r) => r.status === "pending");
  const max = questions.reduce((n, q) => n + q.max, 0);
  const score = responses.reduce((n, r) => n + (r.score ?? 0), 0);
  return {
    score,
    max,
    pending,
    percent: (score / max) * 100,
    answered: responses.filter((r) => r.value.length).length,
    seconds: responses.reduce((n, r) => n + r.seconds, 0),
  };
}
export function leaderboard(attempts: Attempt[]) {
  const rows = people
    .flatMap((person) => {
      const own = attempts.filter(
        (a) => a.personId === person.id && !totals(a).pending,
      );
      if (!own.length) return [];
      const best = [...own].sort(
        (a, b) => totals(b).score - totals(a).score,
      )[0];
      return [{ person, best, count: own.length, ...totals(best) }];
    })
    .sort(
      (a, b) => b.score - a.score || a.person.id.localeCompare(b.person.id),
    );
  return rows.map((r, i) => ({
    ...r,
    rank: rows.findIndex((x) => Math.abs(x.score - r.score) < 1e-9) + 1,
  }));
}
export function groups(
  attempts: Attempt[],
  key: "topic" | "difficulty" | "type",
) {
  return Array.from(new Set(questions.map((q) => q[key]))).map((label) => {
    let score = 0,
      max = 0;
    for (const a of attempts)
      for (const q of questions.filter((q) => q[key] === label && q.max > 0)) {
        const r = a.responses[q.id];
        if (r.score === null) continue;
        score += r.score;
        max += q.max;
      }
    return { label, score, max };
  });
}
export function distribution(attempts: Attempt[], q: Question) {
  const counts = new Map<string, number>();
  for (const a of attempts) {
    const v = a.responses[q.id].value;
    const label = answerText(q, v);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
export function answerText(q: Question, value: string[]): string {
  if (!value.length) return "Хариулаагүй";
  switch (q.type) {
    case "SINGLE_CHOICE":
    case "MULTIPLE_CHOICE":
    case "TRUE_FALSE":
    case "SJT":
      return value.map((v) => q.options[Number(v)] ?? "—").join(", ");
    case "MATCHING":
    case "MATRIX":
      return q.rows
        .map((row, i) => `${row}: ${q.columns[Number(value[i])] ?? "—"}`)
        .join("; ");
    case "LIKERT":
      return q.scale[Number(value[0])] ?? "—";
    default:
      return value.join(" → ");
  }
}
