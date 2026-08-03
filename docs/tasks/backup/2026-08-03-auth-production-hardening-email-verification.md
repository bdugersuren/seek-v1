# Auth Production Hardening and Email Verification

Status: `DONE`

## Goal

Auth болон нэвтрэлтийн ажиллагааг production түвшинд хатууруулах, email баталгаажуулалттай account lifecycle нэвтрүүлэх, role/session хамгаалалтыг backend boundary дээр тодорхой болгох.

## Scope

- JWT/secret/cookie production hardening.
- Email verification бүхий registration lifecycle.
- Backend RBAC guard болон permission matrix.
- Session management API: current sessions, revoke session, logout all.
- CSRF болон rate limit hardening.
- Integration/E2E тестээр auth boundary баталгаажуулах.

## Implementation Plan

1. `DONE` Email verification foundation
   - `UserAccount.isEmailVerified` талбар нэмсэн.
   - `EmailVerificationToken` хүснэгт нэмсэн.
   - Register үед шинэ хэрэглэгчийг `PENDING_EMAIL_VERIFICATION` төлөвтэй үүсгэдэг болгосон.
   - Verification token raw утгыг зөвхөн dev outbox log-д гаргаж, DB-д SHA-256 hash хадгалдаг болгосон.
   - `/auth/verify-email` болон `/auth/resend-verification` endpoint нэмсэн.
   - Login үед email баталгаажаагүй хэрэглэгчийг ойлгомжтой алдаагаар хаадаг болгосон.

2. `DONE` Email delivery integration
   - `EmailDeliveryService` abstraction нэмсэн.
   - Local/dev горимд console/dev outbox ашигладаг болгосон.
   - Production-д SMTP тохиргоо (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `AUTH_EMAIL_FROM`, `AUTH_PUBLIC_APP_URL`) нэмсэн.
   - Verification token expiry policy-г `AUTH_EMAIL_VERIFICATION_TTL_HOURS` env-ээр тохируулдаг болгосон.

3. `DONE` Production secret hardening
   - `AUTH_JWT_SECRET` placeholder fallback-ийг production runtime-д бүрэн хориглосон.
   - Compose production override дээр `AUTH_JWT_SECRET`-ийг required болгосон.
   - Secret length болон placeholder pattern validation нэмсэн.
   - Production cookie-д `AUTH_COOKIE_SECURE=true` guard нэмсэн.

4. `DONE` Backend RBAC boundary
   - Role/permission matrix document үүсгэсэн.
   - Gateway identity context-д roles дамжуулах суурь нэмсэн.
   - Gateway `AuthGuard` дээр `@Roles(...)` metadata шалгах суурь нэмсэн.
   - Shared `SeekRole` contract нэмсэн.
   - Admin/assessor/candidate/superadmin API route тус бүрт backend guard хэрэгжүүлэх ажлыг bounded-context service route нээгдэх үед үргэлжлүүлэх.
   - Frontend `RoleGuard`-ийг UX redirect-only гэж тодорхой болгож, security boundary backend дээр үлдээх.

5. `DONE` Session management
   - `/auth/sessions` current sessions endpoint нэмсэн.
   - `/auth/sessions/:id/revoke` endpoint нэмсэн.
   - `/auth/logout-all` endpoint нэмсэн.
   - Suspicious refresh reuse үед session revoke policy өмнөх implementation-аар хэрэгжсэн.
   - Password change үед all-session revoke policy-г password-change endpoint нэмэгдэх үед холбох.

6. `DONE` CSRF and abuse protection
   - Cookie-тэй state-changing request Origin/Refererгүй ирвэл default-оор reject хийдэг stricter policy нэмсэн.
   - Login/register/resend-verification endpoint-д IP+email scoped in-memory rate limit нэмсэн.
   - Double-submit CSRF token-г дараагийн public API өргөтгөл дээр нэмж болно.

7. `DONE` Validation
   - Unit tests: verification token creation, login block, session management, rate limit, security config.
   - Integration tests: login -> me -> refresh -> logout, sessions -> revoke, missing-origin CSRF, register pending verification, invalid verification token.
   - CLI smoke: login, `/me`, refresh rotation, logout, post-logout refresh failure.

## Follow-Up

- Frontend email verification UX: `/verify-email`, post-register confirmation, resend verification action.
- Production rollout smoke: migration deploy, real SMTP send, verify link, login/session/logout-all.
- Bounded-context RBAC: add `@Roles(...)`/tenant guards when non-health proxied service routes are exposed.

## Done Criteria

- Шинэ хэрэглэгч email баталгаажуулах хүртэл login хийж чадахгүй.
- Verification token DB-д raw хэлбэрээр хадгалагдахгүй.
- Auth security event-үүд register, resend, verify, failed verify, login blocked event-үүдийг бүртгэнэ.
- Production secret/cookie тохиргоо placeholder/default-аар ажиллахгүй.
- Backend role/session/CSRF boundary тестээр баталгаажсан байна.
