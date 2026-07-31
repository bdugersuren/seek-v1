# Walkthrough — Sprint 4: Authentication Foundation and Security Audit

Энэхүү спринтээр seek.mn платформын аюулгүй байдал, нэвтрэлтийн суурь бүтэц болон аюулгүй байдлын аудит, remediations-ийг амжилттай хэрэгжүүлж дуусгалаа.

## Өөрчлөлтүүд (Changes Implemented)

1. **Аюулгүй нэвтрэх урсгал (Auth Core)**:
   - `UserAccount`, `Credential`, `Session`, `RefreshToken`, `SecurityEvent` өгөгдлийн сангийн бүтцийг Prisma-аар тодорхойлж, Postgres дээр `20260729102543_init_auth` migrations-ийг амжилттай үүсгэн ажиллуулав.
   - Нууц үгийг `bcryptjs` алгоритмаар шифрлэж, round rounds-ийг environment-configurable болгов.
   - Refresh Token rotation болон token family-г бүхэлд нь цуцалдаг reuse detection логикуудыг Prisma `$transaction`-ий хүрээнд atomic болгон хэрэгжүүлж, тестүүд нэмэв.
2. **Gateway proxy integration**:
   - Gateway дээр JWT-ийн `iss`, `aud`, `alg` claims-ийг баталгаажуулдаг болгов.
   - Case-insensitive identity header spoofing-оос сэргийлэх хамгаалалт хэрэгжүүлэв.
   - Cookie-authenticated endpoints-уудад зориулан Gateway-д CSRF Origin validation хамгаалалт болон түүний тестүүдийг нэмэв.
3. **Portal-web login & bootstrap**:
   - `AuthBootstrap` компонентыг Portal layout-д нэмж, хөтөч дахин ачаалагдах үед сессийг автоматаар сэргээдэг болгов.
   - Хөтөчийн localStorage ашиглахгүйгээр access token-ийг зөвхөн in-memory санах ойд хадгалах урсгалыг холбосон.

## Шалгагдсан бүрэлдэхүүн хэсгүүдийн бодит төлөв (Verified Component Status)

- **QueryProvider** — PLACEHOLDER (TanStack Query суулгаагүй, ирээдүйд холбох бэлтгэл).
- **DatePicker** — PLACEHOLDER (Native `<input type="date" />` ашигласан хэлбэр).
- **OTP** — PLACEHOLDER.
- **LoadingOverlay, Maintenance, NotFound, Dropdown, Menu, Pagination, StepIndicator** — PLACEHOLDER.

## Тестийн дүн (Testing Summary)

- `services/auth` болон `services/gateway` доор focused unit/integration тестүүдийг бичиж, 100% амжилттай давсан.
- Monorepo-ийн хэмжээнд prettier, lint, typecheck, tests, builds шалгалтууд 100% амжилттай давсан.

## Эцсийн ухраах манифест (Corrected Rollback Manifest)

- **Шинээр үүсгэсэн файлуудыг устгах**:
  - `apps/portal-web/src/components/auth-bootstrap.tsx`
  - `docs/tasks/backup/2026-07-29-sprint-4-security-audit-addendum.md`
  - `services/auth/prisma/migrations/20260729102543_init_auth/` хавтас
- **Өөрчлөгдсөн файлуудыг өмнөх commit-оос сэргээх**:
  - `git checkout -- services/auth/src/auth.service.ts services/auth/src/auth.service.spec.ts services/auth/src/main.ts services/gateway/src/proxy.middleware.ts services/gateway/src/proxy.middleware.spec.ts services/gateway/src/main.ts apps/portal-web/src/app/layout.tsx walkthrough.md docs/tasks/active-task.md docs/security/authentication.md docs/security/token-lifecycle.md docs/security/session-management.md docs/security/csrf.md docs/api/authentication-api.md`
