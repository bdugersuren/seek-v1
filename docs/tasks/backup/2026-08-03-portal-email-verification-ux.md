# Portal Email Verification UX

Status: `DONE`

## Goal

Portal frontend дээр email verification UX-г бүрэн хэрэгжүүлж, backend auth hardening урсгалыг хэрэглэгчийн хувьд ойлгомжтой, гүйцэд, тесттэй болгох.

## Scope

- `/verify-email?token=...` route нэмэх.
- Register амжилттай бол post-register confirmation screen харуулах.
- Login дээр email баталгаажаагүй хэрэглэгчид resend verification action гаргах.
- Auth API client helper-үүдийг frontend-д нэг мөр ашиглах.
- E2E болон component/unit smoke coverage нэмэх.

## Implementation Plan

1. `DONE` Verify email page
   - `/verify-email` page үүсгэсэн.
   - Query token байхгүй үед ойлгомжтой error state харуулдаг болсон.
   - Token байвал `/api/v1/auth/verify-email` POST дууддаг болсон.
   - Success state дээр login руу буцах action харуулдаг болсон.
   - Invalid/expired token state дээр register/login action-ууд харуулдаг болсон.

2. `DONE` Register confirmation UX
   - Register амжилттай бол login руу шууд redirect хийхгүй болсон.
   - Submitted email-г state-д хадгалж confirmation view харуулдаг болсон.
   - Confirmation view дээр resend verification button нэмсэн.
   - Rate limit/too many attempts error-г alert-аар харуулдаг болсон.

3. `DONE` Login resend verification UX
   - Backend email-unverified алдаа ирвэл login form дээр resend verification action гардаг болсон.
   - Resend success/failure state нэмсэн.
   - Mock auth горимд энэ action гаргахгүй.

4. `DONE` Frontend auth helper cleanup
   - Register/verify/resend/login API calls-ийг `auth-client` helper-д төвлөрүүлсэн.
   - `credentials: "include"`, JSON headers, error parsing-г давталтгүй болгосон.
   - Existing mock auth behavior эвдэхгүй байх.

5. `DONE` Validation
   - Login page component test update.
   - Verify email page basic render/error tests нэмсэн.
   - Register page basic render test нэмсэн.
   - Portal typecheck, component tests, production build ажиллуулсан.
   - Auth integration болон smoke tests ажиллуулсан.

## Done Criteria

- Register хийсний дараа хэрэглэгч email баталгаажуулах шаардлагатайг тодорхой харна.
- `/verify-email?token=...` success/error state-үүд ажиллана.
- Unverified login үед resend verification action ажиллана.
- Existing mock login demo эвдэхгүй.
- Portal frontend tests болон auth integration/smoke tests pass байна.
