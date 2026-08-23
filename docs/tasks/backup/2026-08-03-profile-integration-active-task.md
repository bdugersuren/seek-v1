# Active Task — Profile integrations (OTP, document storage, KYC)

**Status:** `IN_PROGRESS`

**Updated:** 2026-08-23

## Goal

Candidate profile-ийн trust path-ыг production-safe байдлаар бүрэн ажиллуулах: phone OTP, MinIO presigned document upload, KYC adapter, мөн тэдгээрийн service orchestration, тест, баримтжуулалт.

## Delivery rules

- Profile нь OTP код үүсгэж, hash/salt-г л хадгална; raw OTP нь database, audit log, browser response-д орохгүй.
- SMS/KYC provider нь `integration` service-ээр дамжина. Sandbox/log delivery нь зөвхөн non-production тохиргоонд зөвшөөрөгдөнө.
- Candidate browser нь document binary-г зөвхөн time-limited presigned PUT URL-аар object storage руу илгээнэ. Profile нь File service-ээр object ownership, MIME, size-г баталгаажуулсны дараа л metadata хадгална.
- KYC provider алдаа/timeout нь identity-г автоматаар зөвшөөрөх шалтгаан болохгүй; candidate-д retry/manual-review state өгнө.
- Бүх гаднын service failure нь user-facing retryable error, structured server log, test case-тэй байна.

## Step-by-step execution

### 0. Current-state audit

- [x] Profile API, UI, File service, Integration service, Compose wiring, contract, tests-ийг шалгасан.
- [x] OTP hash/salt, TTL (5 min), resend cooldown (60 sec), hourly cap (5), invalid-attempt lock (15 min), dev-only bypass policy байгаа нь батлагдсан.
- [x] File ownership (`documents/{userId}/...`), PDF-only policy, 10 MB limit, object verify/delete boundary, audit event байгаа нь батлагдсан.
- [x] Identity registry format validation, mock KYC adapter, auto-verify/reject audit path байгаа нь батлагдсан.
- [x] Gaps тодорхойлсон: OTP provider өөр код үүсгэдэг; Integration Compose-д disabled; candidate upload presigned path ашигладаггүй; CORS/real-browser upload integration test байхгүй.

### 1. OTP contract ба service orchestration

- [x] `SendOtpRequest`-д Profile-generated one-time code-г internal-provider payload хэлбэрээр тодорхойлсон.
- [x] Profile → Integration SMS call нь яг тэр кодыг provider-д дамжуулж, success response-ийг шалгадаг болсон.
- [x] Integration mock нь raw code-г log/response-д гаргахгүй; non-production delivery mode-ийн provider adapter boundary хадгалагдсан.
- [x] `integration` service-ийг base/dev Compose-д идэвхжүүлж readiness healthcheck нэмсэн; Profile нь readiness-ээс нь хамаарна.
- [x] OTP success, provider rejection, incorrect/expired/locked code, production no-bypass test coverage батлагдсан.

### 2. Browser-to-MinIO presigned document upload

- [x] Candidate profile UI нь File service-ээс presigned URL авч, binary-г шууд PUT хийж, дараа нь Profile metadata-г бүртгэдэг болсон.
- [x] Client-side file validation нь server policy-той ижил байна: PDF, non-empty, ≤10 MB.
- [ ] Presigned URL expiry/upload error/cancel/retry state болон orphan-object cleanup policy-г тодорхой болгоно.
- [ ] Production MinIO/Nginx CORS policy-г PUT request-ийн approved origins/methods/headers-ээр тохируулж, browser smoke test-оор нотлоно.
- [ ] Ownership/metadata mismatch, expired URL, upload failure, delete idempotency-г integration test-ээр батална.

### 3. KYC adapter hardening

- [ ] Provider contract: verified/rejected/manual-review/unavailable гэсэн result state, timeout болон correlation id-г тодорхойлно.
- [ ] Identity verification нь valid registry + profile name-г adapter-д илгээж, verified/rejected state болон audit event үүсгэнэ.
- [ ] Provider unavailable үед auto-approval хийхгүй; candidate retry/manual review state харна.
- [ ] Mock adapter tests болон Profile service-ийн identity success/reject/unavailable tests нэмнэ.

### 4. End-to-end verification and documentation

- [ ] Isolated Compose stack дээр Integration, File, MinIO, Profile, Gateway, Portal health/readiness шалгана.
- [ ] Verified candidate: profile update → OTP → presigned upload → document metadata → identity KYC гэсэн happy path smoke test ажиллуулна.
- [ ] Security/error paths: malformed registry, unauthorised storage key, provider outage, upload mismatch, OTP throttle/lock-г шалгана.
- [ ] `docs/profile-service.md`, `.env.example`, runbook, API contract-ийг final behavior-тэй синк хийнэ.

## Validation commands

```bash
pnpm --filter @seek/contracts build
pnpm --filter @seek/integration typecheck
pnpm --filter @seek/integration test -- --runInBand
pnpm --filter @seek/file typecheck
pnpm --filter @seek/file test -- --runInBand
pnpm --filter @seek/profile typecheck
pnpm --filter @seek/profile test -- --runInBand
pnpm --filter @seek/portal-web typecheck
pnpm --filter @seek/portal-web test -- --runInBand
docker compose -f docker-compose.yml -f docker-compose.dev.yml config --quiet
```

## Validation evidence (2026-08-23)

- [x] `@seek/contracts build` — pass.
- [x] `@seek/integration typecheck` and `test -- --runInBand` — pass, 5 tests.
- [x] `@seek/file typecheck` and `test -- --runInBand` — pass, 9 tests.
- [x] `@seek/profile typecheck` and `test -- --runInBand` — pass, 33 tests.
- [x] Base+dev and base+prod Compose render — pass. The invalid dormant `ollama`/`qdrant` dev overrides were removed.
- [ ] `@seek/portal-web typecheck` — blocked by pre-existing assessor workspace type errors and missing markdown-renderer dependencies; the Profile API file itself has no reported TypeScript error.
- [ ] Browser presigned-upload smoke — pending MinIO/Nginx CORS configuration and isolated runtime validation.

## Done criteria

- [ ] A real provider sandbox receives the same OTP code that Profile verifies; no raw OTP is persisted or exposed in production.
- [ ] Candidate PDF upload completes via a short-lived, user-scoped presigned URL and metadata is persisted only after File verification.
- [ ] KYC result is auditable and fail-closed on provider problems.
- [ ] Required Compose services render and become ready in dependency order.
- [ ] Unit, integration, browser smoke, and error/security test evidence is recorded in this document.
