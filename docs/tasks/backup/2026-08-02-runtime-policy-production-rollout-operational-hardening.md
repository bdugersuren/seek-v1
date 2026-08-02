# Active Task

Status: `COMPLETED`

# Runtime Policy Production Rollout + Operational Hardening

## Goal

Server-authoritative autosubmit болон question save/navigation policy implementation-ийг production орчинд бүрэн rollout хийж, production runtime дээр шинэ UX/API behavior бодитоор ажиллаж байгааг баталгаажуулах.

## Context

Өмнөх task local болон service-level validation дээр амжилттай архивлагдсан. Гэхдээ runtime policy E2E-г production домайн дээр анх ажиллуулахад `quiz.seek.mn` хуучин assessment-web bundle харуулж байсан (`Autosave`, хуучин subtitle зэрэг илэрсэн). Local шинэ bundle дээр runtime policy E2E 3/3 passed болсон. Тиймээс дараагийн алхам нь production deploy/rebuild, smoke/E2E coverage, operational cleanup байна.

## Scope

### A. Production Rebuild / Deploy Alignment

- [x] `assessment-web` production image/container шинэ runtime policy code-той rebuild хийгдсэн эсэхийг шалгах.
- [x] `execution` production image/container CORS fix болон expired/autosubmit behavior-той rebuild хийгдсэн эсэхийг шалгах.
- [x] `portal-web` production config `NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://quiz.seek.mn` хэвээр зөв байгааг баталгаажуулах.
- [x] `NEXT_PUBLIC_EXECUTION_URL` production runtime bundle дотор `http://quiz-api.seek.mn/api/v1/execution` рүү зааж байгааг шалгах.
- [x] Rebuild/deploy дараа stale `.next`/container cache хуучин bundle serving хийхгүй байгааг баталгаажуулах.

### B. Production Runtime Policy E2E

- [x] `tests/e2e/runtime-policy.spec.ts`-ийг production домайн дээр ажиллуулах:
  - `E2E_QUIZ_URL=http://quiz.seek.mn`
  - `E2E_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution`
- [x] Answer -> `Хадгалах ба Дараах` -> refresh -> answer persisted flow production дээр pass болгох.
- [x] Question palette navigation unsaved answer-ийг save-before-move policy-оор persist хийж байгааг production дээр pass болгох.
- [x] Mobile viewport дээр timer/save/navigation UI production bundle дээр зөв харагдаж байгааг pass болгох.
- [x] Existing production catalog flow-г дахин ажиллуулах:
  - `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts`

### C. Operational Hardening

- [x] Local/prod execution startup дээр `dist` permission drift (`nobody:nogroup`) дахин validation саатуулахгүй байх арга сонгох.
- [x] `USE_REDIS=false` үед Redis client unnecessary connection retry/log spam үүсгэж байгааг арилгах эсвэл lazy-init болгох.
- [x] RabbitMQ fallback log behavior production/dev дээр acceptable эсэхийг шалгаж, шаардлагатай бол `USE_RABBITMQ=false` үед connect хийхгүй болгох.
- [x] CORS policy-г `origin: true`-ээс production-safe allowlist болгох эсэхийг шийдэх.
- [x] Runtime E2E-д required environment variables байхгүй үед ойлгомжтой failure message нэмэх.

### D. Documentation / Task Hygiene

- [x] Production rollout validation command-уудыг archive-д хадгалах.
- [x] `active-task.md`-ийг бүх validation pass болсны дараа archive руу шилжүүлэх.
- [x] Дахин ажиллуулахад шаардлагатай local E2E startup steps-ийг богино тэмдэглэх.

## Validation

- [x] `pnpm --filter @seek/execution typecheck`
- [x] `pnpm --filter @seek/execution test`
- [x] `pnpm --filter @seek/assessment-web build`
- [x] `pnpm --filter @seek/portal-web build`
- [x] `pnpm test:smoke:production`
- [x] `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts`
- [x] `E2E_BASE_URL=http://portal.seek.mn E2E_QUIZ_URL=http://quiz.seek.mn E2E_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution pnpm playwright test tests/e2e/runtime-policy.spec.ts`

## Done Criteria

- Production `quiz.seek.mn/take/{attemptId}` шинэ runtime policy UI-г serve хийдэг болсон байна.
- Production execution API CORS + autosubmit/expired policy behavior browser runtime-аас ажиллана.
- Catalog -> waiting -> take production flow pass байна.
- Runtime policy E2E production дээр pass байна.
- Operational startup noise/permission blocker-ууд дахин validation саатуулахгүй хэмжээнд шийдэгдсэн байна.

## Rollout Notes

- Rebuilt all Compose images with `docker compose --profile "*" -f docker-compose.yml -f docker-compose.prod.yml build --no-cache`.
- Recreated all containers with `docker compose --profile "*" -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate`.
- Verified all containers are up with `docker compose --profile "*" -f docker-compose.yml -f docker-compose.prod.yml ps`.
- Production smoke passed after recreate.
- Production catalog E2E passed after recreate.
- Production runtime policy E2E passed after recreate.

## Local E2E Startup

1. Build and start the production-like stack:
   `docker compose --profile "*" -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
2. Smoke production routes:
   `pnpm test:smoke:production`
3. Run runtime policy E2E:
   `E2E_BASE_URL=http://portal.seek.mn E2E_QUIZ_URL=http://quiz.seek.mn E2E_EXECUTION_URL=http://quiz-api.seek.mn/api/v1/execution pnpm playwright test tests/e2e/runtime-policy.spec.ts`
