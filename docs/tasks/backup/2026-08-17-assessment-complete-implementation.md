# Active Task: Assessment Service & Assessor Workspace Complete Implementation

Status: `IN_PROGRESS`

## Goal
Assessment арын үйлчилгээ болон portal-web дахь Assessor workspace-ийн хоорондох бүх талбарууд, CRUD үйлдлүүд, асуултын хувилбар (markdown, katex, metadata JSON), workflow, блүүпринт, үнэлгээ, болон хуваарийн API болон UI-ийг бүрэн холбож хэрэгжүүлэх.

---

## Todo List

### Phase 1: Assessment DB Schema Verification & NestJS Setup
- [x] `services/assessment/prisma/schema.prisma` доторх Difficulty, Cognitive, Competence загварууд болон QuestionVersion хамаарлуудыг баталгаажуулах.
- [x] NestJS `services/assessment` дээр шаардлагатай DTO-ууд (CreateQuestionDto, UpdateQuestionDto, CreateBlueprintDto, CreateQuizDto, CreateScheduleDto) тодорхойлох.
  - *Тэмдэглэл:* `body` талбарт markdown, katex болон metadata JSON-ийг дэмжих validations нэмэх.

### Phase 2: Question Authoring & Workflow (API хэрэгжүүлэх)
- [x] `Question` болон `QuestionVersion` CRUD endpoints хэрэгжүүлэх:
  - `POST /api/v1/assessment/questions` (Draft үүсгэх)
  - `GET /api/v1/assessment/questions` (Жагсаалт авах - typeId, topicId, status шүүлтүүрүүдтэй)
  - `GET /api/v1/assessment/questions/:id` (Дэлгэрэнгүй болон хувилбарууд)
  - `PUT /api/v1/assessment/questions/:id` (Засах - Хэрэв approved бол шинэ хувилбар үүсгэх логик)
  - `DELETE /api/v1/assessment/questions/:id` (Soft delete)
- [x] Асуултын бүх төрлийг (Single Choice, Multiple Choice, Essay болон matching, sorting, CTFd, DMOJ зэрэг боломжит бүх хувилбар) `payload` JSON-д зөв хадгалдаг болгох.
- [x] Workflow endpoint хэрэгжүүлэх:
  - `POST /api/v1/assessment/questions/:id/workflow` (Draft -> Pending -> Approved)

### Phase 3: Blueprint & Quiz CRUD (API хэрэгжүүлэх)
- [x] `QuizTemplate` (Blueprint) болон `QuizSection` CRUD endpoints хэрэгжүүлэх.
- [x] Секшн бүрт асуултын сангийн холбоосыг нэг transaction дотор удирдах логик бичих.
- [x] `Quiz` болон `QuizRevision` CRUD endpoints хэрэгжүүлэх.
- [x] Quiz-ийн хувьд `questionOverrides` (mandatory/excluded) логикийг зөв бодож үүсгэх.

### Phase 4: Scheduling & Publishing (API хэрэгжүүлэх)
- [x] `QuizSchedule` CRUD endpoints хэрэгжүүлэх.
  - Талбарууд: accessMode, capacity, priceOverride, waitingRoomOpensAt, autosaveIntervalSeconds, shuffleQuestions
- [x] `POST /api/v1/assessment/schedules/:id/publish` хэрэгжүүлэх:
  - Төлөвийг `PUBLISHED` болгон, RabbitMQ-ээр `assessment.published` event-ийг цацах.

### Phase 5: Portal Frontend API Integration (`portal-web`)
- [x] `apps/portal-web/src/features/assessor-workspace/api.ts` файлыг бодит асинхрон REST API дуудлагуудаар солих.
- [x] UI-ийн хуудсууд дахь mock logic-ийг арилгах:
  - `QuestionEditor.tsx` (markdown, katex, metadata JSON, workflow buttons)
  - `BlueprintEditor.tsx` (Секшнүүд, асуултын сан хайж сонгох)
  - `QuizEditor.tsx` (Overrides, schedule options, accessMode, capacity)

### Phase 6: E2E Verification & Task Report
- [ ] Урсгал бүрийг веб хөтөч дээр бодит хэрэглэгчээр шалгаж, API логуудыг баталгаажуулах.
- [ ] Playwright E2E тест бичиж автоматжуулах.
