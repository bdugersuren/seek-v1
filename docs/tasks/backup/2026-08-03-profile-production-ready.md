# Active Task

Status: `COMPLETED`

## Goal

Profile service-ийг production-ready bounded context болгон бүрэн дуусгаж, хэрэглэгчийн profile бүртгэл, completion, verification, document metadata, audit trail, gateway integration, portal integration, tests, docs-ийг нэг мөр болгож хаах.

## Scope

- Profile data model болон migration-г production fields-тэй болгох.
- Current user profile get/update/completion API-г validation, audit, contract-той нь бүрэн harden хийх.
- Profile verification workflow болон document metadata API нэмэх.
- Admin/reviewer verification review endpoint, RBAC boundary нэмэх.
- Gateway proxy болон role enforcement-г бүрэн шалгах.
- Portal onboarding/profile UI-г backend-authoritative profile service-тэй бүрэн холбох.
- Mock profile data-г production урсгалаас салгах.
- Unit/component/smoke tests болон service documentation-г дуусгах.

## Non-Goals

- Boxit file object storage upload хийхгүй; энэ task дээр document metadata болон future storage boundary бэлдэнэ.
- Boxit SMS/OTP provider холбохгүй; phone verification field/status болон provider boundary бэлдэнэ.
- Auth service-ийн email verification logic-г profile service рүү шилжүүлэхгүй.
- Enrollment/payment service-г энэ task дээр гүнзгий хөгжүүлэхгүй.

## Implementation Plan

1. `DONE` Current State Audit
   - `services/profile/prisma/schema.prisma`, `services/profile/src`, gateway proxy, portal profile/onboarding usage-г шалгах.
   - `apps/portal-web/src/features/profile/mock-data.ts` болон mock profile хэрэглээ хаана үлдсэнийг жагсаах.
   - Auth-owned identity/email verification болон profile-owned personal/contact verification boundary-г бичих.
   - Existing `metadata.phoneNumber`, `metadata.organisation` data migration эрсдэлийг тэмдэглэх.

2. `DONE` Profile Domain Contract Finalization
   - `@seek/contracts` дээр profile response/request/status interfaces-г нэг мөр болгох.
   - `ProfileVerificationStatus`, `ProfileDocumentResponse`, `ProfileAuditEvent`, admin review request/response contract нэмэх.
   - Error response shape болон nullable field policy-г тогтвортой болгох.
   - Candidate/admin endpoint response shapes-г portal хэрэглээнд нийцүүлэх.

3. `DONE` Prisma Schema and Migration
   - `UserProfile` model дээр production fields нэмэх:
     - `displayName`, `firstName`, `lastName`
     - `phoneNumber`, `phoneNumberVerifiedAt`
     - `organisation`, `birthDate`, `gender`, `country`, `address`
     - `preferredLanguage`, `completionStatus`, `verifiedAt`
     - `metadata`, `createdAt`, `updatedAt`
   - `ProfileVerification` model нэмэх.
   - `ProfileDocument` model нэмэх.
   - `ProfileAuditLog` model нэмэх.
   - Metadata-аас phone/organisation column руу шилжүүлэх migration эсвэл safe fallback бэлдэх.
   - Prisma client generate/typecheck хийх.

4. `DONE` Completion Policy Module
   - Completion policy-г `ProfileService` дотор тараахгүй тусдаа helper/module болгох.
   - Required candidate fields:
     - `displayName`
     - `phoneNumber`
     - `country`
     - `preferredLanguage`
   - Recommended fields:
     - `organisation`
     - `birthDate`
     - `address`
   - Response дээр `isComplete`, `missingFields`, `recommendedFields`, `nextAction`, `blockingReasons` буцаах.
   - Assessment gate болон onboarding хоёр нэг completion policy ашигладаг болгох.

5. `DONE` Profile API Hardening
   - `GET /profile/me` production response shape-г шинэ contract-той нийцүүлэх.
   - `PUT /profile/me` validation нэмэх:
     - trim empty string
     - max length
     - enum validation
     - phone/date/language basic validation
     - user cannot update verification/admin-only fields
   - `GET /profile/me/completion` policy module ашигладаг болгох.
   - Missing `x-user-id` үед 401, invalid payload үед 400 буцаах.
   - Profile update бүр audit event бичдэг болгох.

6. `DONE` Verification Workflow
   - Verification states:
     - `NOT_STARTED`
     - `IN_PROGRESS`
     - `SUBMITTED`
     - `VERIFIED`
     - `REJECTED`
     - `EXPIRED`
   - Candidate endpoint нэмэх:
     - `GET /profile/me/verification`
     - `POST /profile/me/verification/submit`
   - Admin/reviewer endpoint нэмэх:
     - `GET /profile/admin/verifications`
     - `POST /profile/admin/verifications/:id/approve`
     - `POST /profile/admin/verifications/:id/reject`
   - Reject reason, reviewedBy, reviewedAt хадгалах.
   - Re-submit policy-г тодорхой болгож test нэмэх.

7. `DONE` Document Metadata API
   - Candidate endpoint нэмэх:
     - `GET /profile/me/documents`
     - `POST /profile/me/documents`
     - `DELETE /profile/me/documents/:documentId`
   - Document fields:
     - `type`, `name`, `storageKey`, `mimeType`, `sizeBytes`, `status`, `uploadedAt`
   - Storage integration одоогоор placeholder boundary гэдгийг docs дээр тэмдэглэх.
   - Document add/remove audit event бичих.

8. `DONE` Audit Trail
   - Audit actions:
     - `PROFILE_CREATED`
     - `PROFILE_UPDATED`
     - `PROFILE_COMPLETION_CHANGED`
     - `VERIFICATION_SUBMITTED`
     - `VERIFICATION_APPROVED`
     - `VERIFICATION_REJECTED`
     - `DOCUMENT_ADDED`
     - `DOCUMENT_REMOVED`
   - Audit fields:
     - `userId`, `actorUserId`, `action`, `before`, `after`, `ipAddress`, `userAgent`, `createdAt`
   - Audit log immutable байлгах.
   - PII-г application logs руу raw dump хийхгүй байх.

9. `DONE` Gateway Integration and RBAC
   - Gateway proxy-г дараах route-ууд дээр баталгаажуулах:
     - `/api/v1/profile/me*`
     - `/api/v1/profile/admin/*`
   - Candidate route дээр `x-user-id` required.
   - Admin/reviewer route дээр `x-user-roles` required.
   - Spoofed identity headers strip test-г profile route дээр өргөтгөх.
   - Unauthorized, forbidden, upstream failure behavior-г test хийх.

10. `DONE` Portal Profile Integration
    - `/onboarding` form-г шинэ completion policy fields-тэй нийцүүлэх.
    - `/profile` page-г mock биш backend profile API ашигладаг болгох.
    - Completion progress, missing fields, recommended fields, verification status харуулах.
    - Save/loading/error states-г бүх profile form дээр нэг мөр болгох.
    - Rejected verification reason болон submit button UX нэмэх.

11. `DONE` Portal Verification and Documents UX
    - `/profile/verification` эсвэл existing profile page section дээр verification workflow холбох.
    - Document metadata list/add/remove UI нэмэх.
    - Storage байхгүй үед upload placeholder-г хэрэглэгчид ойлгомжтой state-аар харуулах.
    - Admin review screen эсвэл minimal review placeholder route нэмэх.

12. `DONE` Production Mock Cleanup
    - `mockProfile` production path-д ашиглагдахгүй болгох.
    - Demo/mock auth mode-д зориулсан fallback boundary-г explicit болгох.
    - Portal tests mock API-г тусгаарлаж, runtime mock data import алдагдахгүй эсэхийг шалгах.

13. `DONE` Backend Tests
    - Profile missing/incomplete/complete tests.
    - Update validation tests.
    - 401 missing identity header test.
    - Candidate cannot update verification/admin fields test.
    - Verification submit/approve/reject/re-submit tests.
    - Document metadata create/list/delete tests.
    - Audit log creation tests.
    - Gateway proxy/RBAC tests.

14. `DONE` Frontend Tests
    - Onboarding render/save success/error tests.
    - Profile page backend data render test.
    - Completion missing fields render test.
    - Verification status/rejection reason render test.
    - Document metadata section render test.
    - Catalog gate profile incomplete smoke remains passing.

15. `DONE` Documentation and Closeout
    - `docs/profile-service.md` үүсгэх.
    - API endpoint table бичих.
    - Completion policy бичих.
    - Verification workflow/state transition бичих.
    - Audit event list бичих.
    - Future integrations:
      - OTP/SMS provider
      - object storage
      - external KYC
    - All validation commands pass бол active task-г complete болгож архивлах.

## Validation Commands

- `pnpm --filter @seek/contracts build`
- `pnpm --filter @seek/profile typecheck`
- `pnpm --filter @seek/profile test -- --runInBand`
- `pnpm --filter @seek/gateway typecheck`
- `pnpm --filter @seek/gateway test -- --runInBand`
- `pnpm --filter @seek/portal-web typecheck`
- `pnpm --filter @seek/portal-web test -- --runInBand`
- `pnpm --filter @seek/portal-web build`

## Done Criteria

- Profile schema production fields, verification, documents, audit models-той болсон.
- Current user profile get/update/completion validation болон audit-тэй болсон.
- Profile completion backend-authoritative бөгөөд portal/catalog нэг эх сурвалж ашиглаж байна.
- Verification submit/review/approve/reject workflow ажиллаж байна.
- Document metadata API болон UI foundation ажиллаж байна.
- Gateway profile/admin route proxy, identity, RBAC tests pass байна.
- Portal onboarding/profile production API ашиглаж байна.
- Mock profile production flow-д үлдээгүй.
- Backend/frontend tests pass байна.
- `docs/profile-service.md` бүрэн бичигдсэн.
