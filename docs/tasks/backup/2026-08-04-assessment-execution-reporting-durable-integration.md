# Active Task: Assessment, Execution, and Reporting Durable Integration

Status: `COMPLETED` (Archived on 2026-08-04)

## Goal

`assessment`, `execution`, болон `reporting` сервисүүдийн in-memory бүтцүүдийг арилгаж, Prisma ашиглан PostgreSQL database рүү persistent хадгалдаг болгох. Сервис хоорондын холболтыг RabbitMQ асинхрон event-үүд болон HTTP REST fallback ашиглан бүрэн уялдуулах.

---

## Todo List

### Phase 1: `services/assessment` (Workflow & Publication Persistence)
- [x] `PrismaService` үүсгэж модуль хэсэгт бүртгэх.
- [x] `schema.prisma` схемд шинээр `AssessmentWorkflowEvent` модель нэмэх. (Schema-г өөрчлөхөөс өмнө хэрэглэгчид дэлгэрэнгүй танилцуулж батлуулна).
- [x] `assessment-workflow.service.ts` доторх in-memory Map/Array-ийг устгаж `PrismaService` ашигладаг болгох.
- [x] `publishSchedule` ажиллах үед `QuizSchedule` status-ийг `PUBLISHED` болгож шинэчлэх, мөн `OutboxEvent` эсвэл RabbitMQ рүү event илгээх.

### Phase 2: `services/execution` (Durable Attempt State Store)
- [x] `PrismaService` үүсгэж модуль хэсэгт бүртгэх.
- [x] `PrismaAttemptStateStore` классыг `AttemptStateStore` интерфейсийн дагуу шинээр үүсгэн хэрэгжүүлэх.
  - [x] `saveSession` -> `QuizAttempt` болон snap-уудыг PostgreSQL-д хадгалах.
  - [x] `saveAnswers` -> `QuestionResponse` болон `AttemptStateSnapshot`-д бичих.
  - [x] `saveQuestions` -> `AttemptQuestion` рүү бичих.
  - [x] `incrementViolation` -> `QuizViolation` руу нэмэх.
  - [x] `appendAuditEvent` -> Төрлөөр нь ялгаж (`AttemptLifecycleEvent`, `AttemptHeartbeatEvent`, `QuestionResponseEvent` гэх мэт) persistent хүснэгтүүд рүү бичих.
- [x] `execution.module.ts` дотор `PrismaAttemptStateStore`-ийг `AttemptStateStore` интерфейстэй холбож, Redis-ийг зөвхөн кэш/түр төлөвт ашиглахаар Hybrid байдлаар тохируулах.

### Phase 3: `services/reporting` (Reporting Facts & Event Consumers)
- [x] `PrismaService` үүсгэж модуль хэсэгт бүртгэх.
- [x] `reporting.service.ts` доторх in-memory `attemptFacts` Map-ийг устгаж `PrismaService` ашиглан `ReportingAttemptFact` хүснэгттэй ажилладаг болгох.
- [x] `services/reporting` дээр RabbitMQ Consumer холбох (`rabbitmq-consumer.service.ts`).
  - [x] `attempt.submitted` болон `assessment.result.finalized` event-үүдийг RabbitMQ-ээс сонсож, `ReportingAttemptFact` read model-ийг автоматаар PostgreSQL рүү project (бичилт) хийдэг болгох.

### Phase 4: Integration, Verification, and Smoke Tests
- [x] Disposable PostgreSQL дээр migration addenda-г ажиллуулж турших.
- [x] `pnpm test` болон `pnpm typecheck` ажиллуулж шалгах.
- [x] Local Docker Compose дээр бүх сервисүүдийг (assessment, execution, reporting, gateway, rabbitmq, postgres) ажиллуулан E2E smoke test хийх.
