# Active Task

Status: `READY`

## Goal

Profile service болон portal-web profile хэсгийг production-д итгэж ажиллуулах түвшинд harden хийж, OTP security, profile completion, validation, document upload ownership, verification workflow, assessment gate, frontend UX, tests, docs-ийг алхам алхамаар сайжруулах.

## Scope

- OTP bypass, OTP logging, OTP storage, retry/rate-limit эрсдэлийг засах.
- Completion policy-г phone verification болон assessment gate-тэй бодитоор уялдуулах.
- Backend request validation, enum contracts, partial update semantics-ийг нэг мөр болгох.
- File upload presigned URL болон document metadata-г user ownership-тэй болгох.
- Verification workflow-г evidence, duplicate, audit, admin review талдаа harden хийх.
- Assessment enrollment gate-г server-authoritative orchestration руу ойртуулах.
- Portal profile UX-г production хэрэглээнд тохирсон form/modal/loading/error state-тэй болгох.
- Backend, gateway, frontend, E2E tests болон docs-ийг шинэчлэх.

## Non-Goals

- Бодит төлбөрийн processor, бодит улсын бүртгэлийн production KYC integration-г энэ task дээр бүрэн нэвтрүүлэхгүй.
- Auth service-ийн email verification ownership-г profile service рүү шилжүүлэхгүй.
- File malware scanning, long-term archival, retention policy-г бүрэн хэрэгжүүлэхгүй; зөвхөн upload ownership болон metadata integrity-г хаана.
- Full organisation/education/employment domain modeling-г гүнзгий өргөтгөхгүй.

## Implementation Plan

1. `DONE` Baseline Audit and Safety Snapshot
   - Current dirty worktree-д user-ийн unrelated changes байгаа эсэхийг тэмдэглэх.
   - `services/profile`, `services/file`, `services/gateway`, `apps/portal-web/src/features/profile`, profile page, onboarding/catalog usage-г дахин шалгах.
   - Current OTP, document upload, verification, assessment gate behavior-г товч baseline болгон docs/tasks-д тэмдэглэх.
   - Existing tests аль нь profile hardening-г хамарч байгааг жагсаах.

2. `DONE` Critical OTP Security Fix
   - Production-д `123456` bypass ажиллахгүй болгох.
   - Dev/test bypass хэрэгтэй бол explicit env flag (`PROFILE_DEV_OTP_BYPASS_ENABLED`) болон non-production guard ашиглах.
   - OTP code-г application log руу хэвлэхийг устгах.
   - Portal UI дээр "консол дээрх код", "123456 ашиглана уу" гэсэн production-inappropriate текстийг устгах.
   - OTP expiry болон frontend resend timer-г нэг source of truth эсвэл ижил хугацаатай болгох.

3. `DONE` OTP Storage, Attempts, and Rate Limit
   - Plain OTP metadata хадгалалтыг hash-based хадгалалт руу шилжүүлэх.
   - `phoneOtpExpiresAt`, `phoneOtpSentAt`, `phoneOtpAttemptCount`, optional `phoneOtpLockedUntil` metadata policy гаргах.
   - `sendPhoneOtp` дээр per-user cooldown болон hourly cap нэмэх.
   - `verifyPhoneOtp` дээр max wrong attempts нэмэх.
   - Expired/verified OTP cleanup-г metadata-с цэвэрлэх.
   - Unit tests: success, wrong code, expired code, bypass disabled, max attempts, resend cooldown.

4. `DONE` Profile Completion Policy Upgrade
   - Completion-г `basicComplete` болон `trustedComplete` гэж салгах эсэхийг contract дээр тодорхой болгох.
   - Assessment gate-д phone verification (`phoneNumberVerifiedAt`) шаарддаг болгох.
   - Missing fields дээр `phoneNumberVerifiedAt` эсвэл `phoneVerification` semantic нэмэх.
   - Portal completion UI дээр дутуу талбар бүрийг field-specific хэлбэрээр харуулах.
   - Onboarding/profile/catalog нэг completion policy ашиглаж байгаа эсэхийг шалгах.

5. `DONE` Contracts and DTO Validation
   - `@seek/contracts` дээр `ProfileVerificationType`, `ProfileDocumentType`, `ProfileDocumentStatus`, language/gender policy-г enum эсвэл literal type болгон гаргах.
   - Profile update DTO validation нэмэх: trim, max length, phone/date/language/type/status validation.
   - `birthDate` future date биш, invalid date биш байх.
   - Document metadata validation: allowed type, allowed mimeType, max file size, positive size.
   - Admin verification filter/status validation нэмэх.
   - Invalid payload tests 400 буцааж байгааг баталгаажуулах.

6. `DONE` Partial Update Semantics
   - `undefined` ирсэн талбарыг хадгалсан утгыг хэвээр үлдээдэг болгох.
   - Explicit `null` ирсэн үед clear хийх талбаруудыг contract/docs дээр тодорхой болгох.
   - `metadata` update-г whole-object overwrite хийх эсвэл controlled merge хийх policy тогтоох.
   - Regression test: partial update existing profile data алдагдуулахгүй.

7. `DONE` File Upload Ownership and Metadata Integrity
   - File service presigned upload endpoint дээр `x-user-id` уншиж storage key-г `documents/{userId}/{uuid}-{safeName}` хэлбэртэй болгох.
   - Filename sanitize хийх.
   - Profile `addDocument` дээр `storageKey` тухайн user-ийн prefix-тэй эсэхийг шалгах.
   - Боломжтой бол object exists/size/mime metadata validation нэмэх эсвэл file service verify endpoint boundary бэлдэх.
   - Delete policy-г тодорхойлох: metadata-only delete эсвэл object delete event.
   - Tests: other-user storageKey reject, invalid mime/size reject, valid document add/delete.

8. `DONE` Verification Workflow Hardening
   - Verification type бүрийн required evidence policy гаргах.
   - `IDENTITY` request дээр registryNumber validation болон document/evidence requirement тодорхойлох.
   - `REJECTED` дараах resubmit flow-г explicit болгох; previous request history хадгалах эсвэл new request policy-г docs-д бичих.
   - Auto KYC approve/reject audit action-г manual action-аас ялгах (`VERIFICATION_AUTO_APPROVED`, `VERIFICATION_AUTO_REJECTED`).
   - Admin approve/reject дээр role boundary, reason validation, reviewed fields tests нэмэх.

9. `DONE` Gateway and Service Boundary Hardening
   - Gateway profile/file route authentication tests нэмэх.
   - Spoofed `x-user-id`, `x-user-roles` headers strip behavior-г profile/file route дээр баталгаажуулах.
   - Direct service exposure risk-г docs/runbook дээр тэмдэглэх: profile/file service public internet-д шууд expose хийхгүй.
   - Upstream failure behavior болон JSON error shape-г нэг мөр болгох.

10. `DONE` Assessment Gate Integration
   - Profile gate-г contract-д байгаа blocked reasons-тэй нийцүүлэх.
   - Email verified status auth-owned гэдгийг gateway/auth API-аас эсвэл caller context-оос авах boundary төлөвлөх.
   - Assessment open/enrollment/payment/attempt status-г respective services-тэй холбох adapter boundary бэлдэх.
   - Catalog frontend дээр `VERIFY_EMAIL`, `COMPLETE_PROFILE`, `PAY`, `WAIT`, `VIEW_RESULT`, `START` action бүрийн CTA-г зөв харуулах.
   - E2E smoke: incomplete profile blocked, unverified phone blocked, complete trusted profile allowed.

11. `DONE` Portal Profile UX Refactor
   - `ProfileEditModal`, `DocumentUploadModal`, `OtpVerifyModal`, `VerificationPanel`, `DocumentsPanel` component болгон салгах.
   - `window.prompt`-г registryNumber modal form-оор солих.
   - Tab-level loading/error/retry state нэмэх.
   - File upload progress, selected file validation, max size warning нэмэх.
   - Role-specific profile route reuse-г шалгах: admin/superadmin/assessor дээр candidate profile page шууд reuse хийх нь зөв эсэхийг шийдэх.

12. `DONE` Admin Verification Queue
   - `/admin/profile` эсвэл dedicated admin verification page дээр queue UI нэмэх.
   - Status/type filter, request detail, reject reason modal, approve confirmation нэмэх.
   - Candidate document/evidence preview boundary-г бэлдэх.
   - Admin API client functions нэмэх.
   - Tests: queue render, approve/reject success/error.

13. `DONE` Backend and Gateway Test Suite
   - `@seek/profile`: OTP, completion, validation, partial update, documents, verification, audit tests.
   - `@seek/file`: presigned user-scoped key, filename sanitize, invalid request tests.
   - `@seek/gateway`: auth required, role required, spoofed headers, file/profile proxy path tests.
   - Run all affected service typecheck/test commands.

14. `TODO` Frontend and E2E Test Suite
   - `@seek/portal-web`: profile load/save, OTP modal, document upload validation, verification request modal, catalog gate actions.
   - E2E smoke: login -> onboarding -> profile completion -> phone verify -> assessment gate.
   - Mock API boundaries-г production runtime-с тусгаарласан эсэхийг шалгах.

15. `TODO` Documentation and Closeout
   - `docs/profile-service.md`-г шинэ policy, endpoint, validation, OTP, document ownership, verification workflow-той нийцүүлэх.
   - Runbook дээр required env vars, dev OTP bypass policy, direct exposure warning нэмэх.
   - `docs/tasks/active-task.md` Done Criteria-г шалгаж бүх validation pass бол status-г `COMPLETED` болгох.
   - Active task-г dated backup болгон архивлах.

## Validation Commands

- `pnpm --filter @seek/contracts build`
- `pnpm --filter @seek/profile typecheck`
- `pnpm --filter @seek/profile test -- --runInBand`
- `pnpm --filter @seek/file typecheck`
- `pnpm --filter @seek/file test -- --runInBand`
- `pnpm --filter @seek/gateway typecheck`
- `pnpm --filter @seek/gateway test -- --runInBand`
- `pnpm --filter @seek/portal-web typecheck`
- `pnpm --filter @seek/portal-web test -- --runInBand`
- `pnpm --filter @seek/portal-web build`
- `pnpm test -- --runInBand`

## Next Execution Plan

Active task одоогоор бүрэн дуусаагүй. Архивлахын өмнө дараах ажлуудыг гүйцээж `PARTIAL` болон `TODO` статустай мөрүүдийг `DONE` болгоно.

1. `NEXT` Baseline and Runbook Closeout
   - Dirty worktree audit-г dated note болгон active task эсвэл backup doc-д тэмдэглэх.
   - Direct service exposure warning, required env vars, OTP dev bypass policy-г runbook/docs-д нэг мөр болгох.
   - Existing test coverage matrix гаргах: profile/file/gateway/portal/E2E.

2. `NEXT` Assessment Gate Completion
   - `EMAIL_NOT_VERIFIED`, `NOT_ENROLLED`, `ASSESSMENT_NOT_OPEN`, `ALREADY_ATTEMPTED` blocked reason boundary-г тодорхойлох.
   - Auth/assessment/commerce/execution integration adapter plan эсвэл implementation нэмэх.
   - Catalog CTA бүрийг test-ээр баталгаажуулах.

3. `NEXT` Frontend and E2E Test Completion
   - Profile load/save, OTP modal, document upload validation, verification request modal component tests нэмэх.
   - E2E smoke: login -> onboarding -> phone verify -> catalog gate.
   - Mock API boundaries-г production runtime-с тусгаарласан эсэхийг шалгах.

4. `NEXT` Final Test and Archive
   - Backend/gateway/frontend test suite-г бүрэн ажиллуулах.
   - E2E smoke: login -> onboarding -> phone verify -> catalog gate.
   - Бүх Done Criteria pass бол `Status: COMPLETED` болгож dated backup руу архивлаад дараагийн active task үүсгэх.

## Done Criteria

- OTP production bypass хаагдсан, OTP raw log байхгүй, OTP attempts/rate-limit tests pass болсон.
- Profile completion болон assessment gate phone verification/trusted readiness-г зөв ашигладаг болсон.
- Profile/document/verification DTO validation болон partial update regression tests pass болсон.
- File upload storageKey user-scoped болж, document metadata ownership validation pass болсон.
- Verification workflow evidence, duplicate/resubmit, auto/manual audit behavior тодорхой болсон.
- Gateway profile/file auth, RBAC, spoofed header tests pass болсон.
- Portal profile UX production-inappropriate debug text/prompt-гүй, loading/error/form states-тэй болсон.
- Catalog gate blocked reason бүр дээр зөв CTA харуулдаг болсон.
- Backend, frontend, gateway, affected E2E validation commands pass болсон.
- `docs/profile-service.md` болон runbook шинэ бодлоготой нийцсэн.
