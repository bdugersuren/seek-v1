# Catalog Schedule + Waiting Room UX Redesign

Status: `ARCHIVED`

Archived at: `2026-08-02`

## Goal

Catalog schedule болон waiting room UX redesign хийсэн. Catalog дээр шалгалтын scheduled access window тодорхой харагдаж, waiting room нээгдэхээс өмнө redirect хийхгүй. Waiting room дээр schedule summary, countdown, policy/instructions, confirmation checkbox бүхий production-ready start experience бий болсон.

## A. Catalog Schedule UX

- [x] `CatalogAssessment` дээр schedule metadata нэмсэн:
  - `scheduledStartsAt`
  - `scheduledEndsAt`
  - `waitingRoomOpensAt`
  - `requiredEarlyJoinMinutes`
  - `totalPoints`
  - `passingPercent`
- [x] Mock catalog data дээр free assessments-д schedule window тохируулсан.
- [x] Catalog card/list дээр дараах мэдээллийг харуулсан:
  - эхлэх өдөр/цаг
  - дуусах өдөр/цаг
  - үргэлжлэх хугацаа
  - waiting room нээгдэх цаг
  - асуултын тоо, нийт оноо, тэнцэх хувь
- [x] Catalog status badge нэмсэн:
  - `Хуваарьтай`
  - `Хүлээлгийн өрөө нээгдсэн`
  - `Үргэлжилж байна`
  - `Дууссан`
- [x] Waiting room нээгдэхээс өмнө “Эхлүүлэх” redirect хийхгүй, schedule detail modal/drawer харуулдаг болсон.
- [x] Waiting room нээгдсэн үед backend attempt create + `quiz.seek.mn/waiting/{attemptId}` redirect хийдэг болсон.

## B. Schedule Detail Modal

- [x] Catalog дээр хугацаа болоогүй assessment дарахад modal/drawer нээдэг болсон.
- [x] Modal дээр schedule summary харуулсан:
  - шалгалтын нэр
  - эхлэх, дуусах, waiting room нээгдэх өдөр/цаг
  - үргэлжлэх хугацаа
  - асуултын тоо, нийт оноо, тэнцэх хувь
  - хэдэн минутын өмнө waiting room-д орсон байх шаардлага
- [x] Хугацаа болоогүй үед CTA disabled: `Хүлээлгийн өрөө {time}-д нээгдэнэ`.
- [x] Хугацаа болсон үед CTA enabled: `Хүлээлгийн өрөөнд орох`.

## C. Waiting Room Redesign

- [x] Waiting page layout redesign:
  - top status area
  - countdown
  - exam summary
  - readiness rows
  - policy/instructions section
  - confirmation checkbox
- [x] Countdown state:
  - start-аас өмнө `Эхлэхэд үлдсэн`
  - start болсны дараа `Дуусахад үлдсэн`
  - countdown 0 болоход start/unlock action бэлэн болгох
- [x] Instruction content нэмсэн:
  - үнэлүүлэгч тухайн хуудаснаас гарч болохгүй
  - 3 удаа хуудаснаас гарсан үед тест ажиллах боломжгүй болно
  - асуулт, оноо, хугацаа, тэнцэх хувь
  - server-authoritative timer
  - question panel navigation warning
  - `Хадгалах ба Дараах` behavior
  - autosubmit ба early submit
- [x] Checkbox нэмсэн:
  - `Би бүх зааврыг анхааралтай уншиж, ойлгосон.`
- [x] Checkbox unchecked үед start button disabled болсон.
- [x] Payload ready + countdown ready + checkbox checked үед start button enabled болсон.

## Validation

- [x] `pnpm --filter @seek/execution typecheck`
- [x] `pnpm --filter @seek/execution test`
- [x] `pnpm --filter @seek/assessment-web build`
- [x] `pnpm --filter @seek/portal-web lint`
- [x] `pnpm --filter @seek/portal-web build`
- [x] `pnpm test:smoke:production`
- [x] `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts`

## Done Criteria

- Catalog дээр schedule access window ойлгомжтой харагдана.
- Waiting room нээгдэхээс өмнө candidate quiz runtime рүү redirect хийхгүй.
- Waiting room нээгдсэн үед candidate waiting page рүү орж countdown харна.
- Candidate зааврыг уншсан checkbox зөвшөөрсний дараа л start action хийх боломжтой.
- Waiting room UI нь schedule, readiness, policy, instructions, countdown-ийг нэг дор ойлгомжтой харуулна.
