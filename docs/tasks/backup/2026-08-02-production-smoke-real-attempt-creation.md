# Production Smoke Tests -> Real Attempt Creation

Status: `ARCHIVED`

Archived at: `2026-08-02`

## Goal

Production compose redirect regression-ийг smoke test-ээр хамгаалаад, catalog start flow-г `mock-attempt-001` static холбоосоос backend-created real attempt рүү шилжүүлсэн.

## Completed

- [x] Root script нэмсэн: `test:smoke:production`.
- [x] HTTP smoke script нэмсэн:
  - `http://portal.seek.mn/catalog` 200.
  - `http://quiz.seek.mn/waiting/mock-attempt-001` 200.
  - `http://quiz-api.seek.mn/api/v1/execution/session/mock-attempt-001` 200.
  - production compose config-д `portal-web.build.args.NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://quiz.seek.mn`.
- [x] Playwright production catalog start spec нэмсэн:
  - `portal.seek.mn/catalog` нээх.
  - “Эхлүүлэх” товч дарах.
  - final URL `http://quiz.seek.mn/waiting/` prefix-тэй эсэхийг шалгах.
- [x] `@seek/contracts` дээр `CreateAssessmentAttemptRequest` болон `CreateAssessmentAttemptResponse` нэмсэн.
- [x] Execution service-д `POST /api/v1/execution/attempts` endpoint нэмсэн.
- [x] Supported catalog `assessmentId`-уудыг deterministic local session factory-р үүсгэдэг болгосон.
- [x] Unknown `assessmentId` дээр 404 буцаадаг болгосон.
- [x] In-memory болон Redis state store-д `saveQuestions` нэмсэн.
- [x] Portal catalog-ийн үнэгүй assessment start flow-г backend call + redirect болгосон.
- [x] Paid/organisation checkout урсгалыг өөрчлөөгүй.

## Validation

- [x] `pnpm test:smoke:production`
- [ ] `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts` blocked: local Playwright Chromium dependency `libnspr4.so` missing.
- [x] `pnpm --filter @seek/portal-web lint`
- [x] `pnpm --filter @seek/portal-web build`
- [x] `pnpm --filter @seek/execution test`
- [x] `docker compose -f docker-compose.yml -f docker-compose.prod.yml config portal-web assessment-web`

## Notes

- `mock-attempt-001` fallback smoke-г түр хадгалсан.
- Execution build validation local `services/execution/dist` artifact permission дээр унасан: зарим файл `nobody:nogroup` owner-тэй байна. `typecheck` болон service tests амжилттай болсон.
