# Attempt Lifecycle -> Waiting Unlock

Status: `ARCHIVED`

Archived at: `2026-08-02`

## Goal

Backend-created attempt-ийг waiting room lifecycle-тэй холбосон: created attempt `waiting` төлөвөөс preload/unlock event авсны дараа `active` болж, candidate зөвхөн unlock авсан үед `/take/{attemptId}` рүү ордог болсон.

## Completed

- [x] `CreateAssessmentAttemptResponse` дээр `status: "waiting"` contract хэвээр хадгалсан.
- [x] Execution service-д attempt status transition helper нэмсэн: `waiting -> active`, terminal statuses өөрчлөхгүй.
- [x] `POST /api/v1/execution/start/:attemptId` endpoint нэмсэн.
- [x] Start endpoint нь unlock event emit хийж, session status-ийг `active` болгодог болсон.
- [x] Unknown attempt дээр 404 буцаадаг болсон.
- [x] Waiting page дээр real start endpoint дуудах control нэмсэн.
- [x] `Mock unlock event` товчийг production-safe real start action болгосон.
- [x] Unlock SSE ирсний дараа `canStart` true болох урсгалыг хадгалсан.
- [x] Direct `/take/{attemptId}` access нь unlock аваагүй үед waiting room рүү буцаах guard нэмсэн.
- [x] Production smoke script-д dynamic attempt creation check нэмсэн.
- [x] E2E flow spec: catalog start -> waiting -> start/unlock -> take page.

## Validation

- [x] `pnpm --filter @seek/execution typecheck`
- [x] `pnpm --filter @seek/execution test`
- [x] `pnpm --filter @seek/assessment-web build`
- [x] `pnpm --filter @seek/portal-web lint`
- [x] `pnpm --filter @seek/portal-web build`
- [ ] `pnpm test:smoke:production` blocked: running production stack returned 404 for dynamic attempt creation; rebuild `execution`, `portal-web`, `assessment-web` with the new code.
- [ ] `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts` blocked: local Playwright Chromium dependency `libnspr4.so` missing.

## Follow-ups

- Playwright dependency blocker шийдэх: `libnspr4.so`.
- Dynamic smoke баталгаажсаны дараа legacy `mock-attempt-001` smoke-г бууруулах эсэхийг шийдэх.
- Production stack rebuild хийсний дараа `pnpm test:smoke:production` дахин ажиллуулах.
