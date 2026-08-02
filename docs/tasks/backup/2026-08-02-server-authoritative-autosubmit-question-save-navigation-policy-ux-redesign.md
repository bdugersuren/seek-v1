# Server-Authoritative Autosubmit + Question Save/Navigation Policy UX Redesign

Status: `ARCHIVED`

Archived at: `2026-08-02`

## Goal

Candidate quiz runtime дээр autosubmit, question save, question navigation policy-г server-authoritative болгож, UX-ийг candidate-д ойлгомжтой, алдаа давтахгүй, state алдахгүй байдлаар redesign хийсэн.

## Completed

### A. Server-Authoritative Timer + Autosubmit

- [x] Attempt runtime-д server-provided `startedAt`, `endsAt`, `serverNow` timing source ашиглаж countdown тооцдог болсон.
- [x] Client clock drift-ийг server time offset-оор нөхдөг болсон.
- [x] Countdown/heartbeat expiry дээр server autosubmit endpoint дуудаж, repeated submit-ээс хамгаалах guard нэмсэн.
- [x] Autosubmit/manual submit in-progress, submitted/expired/locked state-үүдийг UI дээр тодорхой харуулдаг болсон.
- [x] Browser refresh/direct access үед submitted/expired attempt-ийг дахин answer хийх боломжгүй болгосон.

### B. Question Save Policy

- [x] Answer өөрчлөгдөхөд question state `unsaved` болж, save хийх хүртэл candidate-д status харагддаг болсон.
- [x] `Хадгалах` action тухайн question answer-ийг server autosave endpoint руу persist хийдэг болсон.
- [x] `Хадгалах ба Дараах` action save амжилттай болсон тохиолдолд л дараагийн question руу шилждэг болсон.
- [x] Save in-flight үед давхар click/navigation guard хийдэг болсон.
- [x] Save failure үед candidate тухайн question дээр үлдэж, retry хийх боломжтой болсон.

### C. Question Navigation Policy UX

- [x] Question palette/list дээр per-question state ялгаж харуулдаг болсон:
  - `not_visited`
  - `current`
  - `unsaved`
  - `saved`
  - `flagged`
  - `error`
- [x] Unsaved answer-тэй үед өөр question руу шилжихээс өмнө save хийх policy enforce хийдэг болсон.
- [x] Direct previous/next navigation save policy-той нэг ижил дүрмээр ажилладаг болсон.
- [x] Keyboard/tab navigation болон mobile tap behavior дээр responsive layout шалгасан.
- [x] Final submit хийхээс өмнө unsaved/error questions байвал эхлээд save хийх prompt/CTA харуулдаг болсон.

### D. Runtime UX Redesign

- [x] Top bar дээр server timer, heartbeat, save, network, fullscreen status compact байдлаар харуулдаг болсон.
- [x] Main question area дээр answer controls, save status, primary actions тогтвортой байрладаг болсон.
- [x] Question navigation panel desktop/mobile responsive stacked layout-аар ажилладаг болсон.
- [x] Autosubmit болон manual submit transition states-д loading/locked/submitted UI үзүүлдэг болсон.
- [x] Waiting room-д өгсөн policy wording-тэй runtime microcopy нийцүүлсэн.

### E. Backend / Contract Alignment

- [x] Execution/assessment contract дээр answer save, submit/autosubmit, attempt timing fields байгаа эсэхийг шалгасан.
- [x] Save answer endpoint version/idempotency behavior болон latest answer overwrite дүрмийг баталгаажуулсан.
- [x] Submit endpoint manual/autosubmit reason ялгаж хадгалдаг болсон.
- [x] Expired attempt дээр answer save/manual submit reject, autosubmit accept behavior нэмсэн.
- [x] Browser runtime-д execution API cross-origin дуудах CORS support нэмсэн.

## Validation

- [x] `pnpm --filter @seek/execution typecheck`
- [x] `pnpm --filter @seek/execution test`
- [x] `pnpm --filter @seek/assessment-web build`
- [x] `pnpm --filter @seek/portal-web build`
- [x] `pnpm test:smoke:production`
- [x] `E2E_BASE_URL=http://portal.seek.mn pnpm playwright test tests/e2e/production-catalog-start.spec.ts`
- [x] `E2E_BASE_URL=http://127.0.0.1:18082 E2E_QUIZ_URL=http://127.0.0.1:18082 E2E_EXECUTION_URL=http://127.0.0.1:13080/execution pnpm playwright test tests/e2e/runtime-policy.spec.ts`

## Done Criteria

- Candidate харж буй countdown server authoritative timing дээр тулгуурлана.
- Хугацаа дуусахад attempt автоматаар submit болж, дахин answer хийх боломжгүй болно.
- Question navigation нь unsaved/in-flight/error save төлөвүүдийг алдагдуулахгүй.
- `Хадгалах ба Дараах` нь save амжилттай болсон үед л navigation хийдэг болно.
- UX desktop/mobile дээр policy, save status, submit/autosubmit state-үүдийг ойлгомжтой харуулна.
