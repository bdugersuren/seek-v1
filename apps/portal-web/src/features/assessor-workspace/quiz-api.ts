import { requestAssessmentJson } from "./api";
export const quizStatus: Record<string, string> = {
  DRAFT: "Ноорог",
  IN_REVIEW: "Хянагдаж байгаа",
  APPROVED: "Батлагдсан",
  PUBLISHED: "Нийтлэгдсэн",
  REJECTED: "Татгалзсан",
  RETIRED: "Ашиглалтаас гарсан",
};
export const quizAction: Record<string, string> = {
  approval_requested: "Хяналтад илгээх",
  withdraw: "Хяналтаас татах",
  approve: "Батлах",
  changes_requested: "Засварт буцаах",
  publish: "Нийтлэх",
  reopen: "Ноорог болгох",
};
export function quizApi(path = "", method = "GET", body?: any) {
  return requestAssessmentJson<any>("/api/v1/assessment/quizzes" + path, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

export const quizLifecycle: Record<string, string> = {
  DRAFT: "Ноорог",
  READY: "Бэлэн",
  IN_REVIEW: "Хяналтад",
  PUBLISHED: "Нийтлэгдсэн",
  SUSPENDED: "Түр зогсоосон",
  ARCHIVED: "Архивлагдсан",
};
