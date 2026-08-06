# Active Task: E2E Coverage from Catalog Start to Receipt and Reporting Fact Projection

Status: `COMPLETED`

## Goal
Шалгалтын хэрэглэгчийн үйл явцыг (каталогоос эхлээд, хүлээлгийн өрөө, шалгалт өгөх, autosave, submit хийх, receipt авах, үр дүн reporting үйлчилгээний read model рүү асинхроноор бичигдэх хүртэл) Playwright E2E интеграцийн тестээр бүрэн хамрах.

---

## Todo List

### Phase 1: Create Complete E2E Scenario
- [x] `tests/e2e/runtime-complete-flow.spec.ts` нэртэй шинэ Playwright тест үүсгэх.
- [x] Тестийн хувилбарт:
  1. `/catalog` руу орох.
  2. Шалгалт сонгож "Хүлээлгийн өрөөнд орох" -> "Шалгалт эхлүүлэх".
  3. Шалгалтын явцад асуултуудыг бөглөж (Q1, Q2, Q3 эссэ), "Хадгалах ба Дараах" дарах.
  4. Шалгалт дуусгах (Submit) товчийг дарж баталгаажуулах.
  5. `http://quiz.seek.mn/receipt/attempt-...` хуудас руу орж receipt амжилттай үүссэнийг шалгах.

### Phase 2: Add Reporting Fact Assertion
- [x] Playwright E2E тест дотор `APIRequestContext` ашиглан `reporting` үйлчилгээний API-аас (`/api/v1/reporting/attempt-facts/${attemptId}`) projection үр дүнг унших.
- [x] Оролдлогын fact `status === "FINAL"` эсвэл `"SUBMITTED"`, мөн `finalScore`, `percentage` талбарууд зөв бичигдсэнийг баталгаажуулах.
- [x] Асинхрон үйл ажиллагааг (RabbitMQ аялал) дэмжиж, reporting API руу тодорхой хугацаанд (retry interval-тайгаар) хандаж шалгах logic нэмэх.

### Phase 3: Verification & Execution
- [x] Local Docker Compose эсвэл dev орчинд бүх үйлчилгээнүүдийг ажиллуулах.
- [x] `playwright test tests/e2e/runtime-complete-flow.spec.ts` ажиллуулан тестийг амжилттай болгох.
- [x] Бусад E2E тестүүдтэй хамт monorepo-ийн хүрээнд ажиллуулж typecheck болон unit тестүүдийг шалгах.
