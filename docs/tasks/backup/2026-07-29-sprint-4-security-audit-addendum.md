# Security Audit Addendum — Sprint 4: Authentication Foundation

**Огноо**: 2026-07-29
**Зохиогч**: Principal Application Security Engineer and Security Verification Engineer

Энэхүү баримт бичиг нь Sprint 4 нэвтрэлтийн суурь бүтцэд хийсэн аюулгүй байдлын аудит, илэрсэн зөрчил, тэдгээрийг арилгах/remediation ажлуудын үр дүнг нарийвчлан баримтжуулсан баталгаажуулсан протокол болно.

---

## 1. Илэрсэн аюулгүй байдлын gaps болон засалтууд (Remediated Gaps)

### А. Өгөгдлийн сангийн шилжилт (Database Migrations)

- **Original Gap**: Prisma schema үүссэн байсан боловч бодит db migrations үүсээгүй, `migrations/` хавтас хоосон байсан.
- **Verified Remediation**: Хөгжүүлэлтийн Postgres db ашиглан `20260729102543_init_auth` migrations үүсгэсэн.
- **Target Classification**: `LOCAL_DEVELOPMENT_DATABASE`. Энэ нь production-д ажиллаагүй, зөвхөн хөгжүүлэлтийн орчинд үүсгэгдсэн. URL болон credentials-ийг нууцалсан.

### Б. Нууц үгийн Rounds Cost Factor

- **Original Gap**: Bcrypt rounds нь хатуу бичигдсэн (`10`) байв.
- **Verified Remediation**: `process.env.AUTH_PASSWORD_HASH_ROUNDS` ашиглан configurable болгов.

### В. JWT Access Token Claims ба Gateway баталгаажуулалт

- **Original Gap**: Токений payload-д `iss`, `aud`, `jti`, `iat`, `exp` claims дутуу байсан ба Gateway signature-оос өөр зүйл шалгадаггүй байсан.
- **Verified Remediation**:
  - Токений payload-д бүх claims-ийг оруулсан.
  - Gateway-ийн `ProxyMiddleware` дээр `issuer`, `audience`, algorithm `HS256` шалгалтуудыг нэмж бэхжүүлсэн.

### Г. Token-Family Reuse Detection (Session as Token Family)

- **Original Gap**: Refresh token reuse илэрсэн үед гэр бүлийн бусад токенуудыг хүчингүй болгохгүй байв.
- **Verified Remediation**:
  - Токен сэргээх логикийг Prisma `$transaction` дотор atomic болгон оруулав.
  - Тусдаа `token_family_id` ашиглаагүй, харин сесс өөрөө (`SESSION_AS_TOKEN_FAMILY`) токений гэр бүлийг төлөөлнө.
  - Хуучин токен дахин ашиглагдвал тухайн сессийн доорх бүх токенуудыг `updateMany` ашиглан цуцалдаг болгов.

### Д. CSRF Origin Validation

- **Original Gap**: Cookie-authenticated мутаци хүсэлтүүд (POST/PUT/DELETE) CSRF хамгаалалтгүй байв.
- **Verified Remediation**: Gateway-д `Origin` болон `Referer` шалгадаг allowed local/production origins тулгах logic нэмж, safe GET хүсэлт болон API non-browser хүсэлтийг bypass хийдэг болгов.

### Е. Identity Spoofing case-insensitive хамгаалалт

- **Original Gap**: Identity header spoofing устгах logic нь зөвхөн lowercase байсан ба заримыг нь орхисон байсан.
- **Verified Remediation**: Case-insensitive байдлаар `x-user-id`, `x-session-id`, `x-authenticated-subject`, `x-authenticated-user`, `x-auth-context` header-үүдийг бүрэн устгадаг гогцоо хэрэгжүүлсэн.

---

## 2. Warnings-ийн ангилал (Warning Classification)

Дараах асуудлуудыг аюулгүй байдлын эрсдэлийн дагуу ангилав:

- **HS256 shared-secret strategy** — `ACCEPTED_FOLLOW_UP`. Нэгдсэн нэг нууц түлхүүр ашиглах нь хөгжүүлэлтийн хувьд тохиромжтой боловч ирээдүйд Asymmetric signing (RS256/ES256) руу шилжих нь зүйтэй.
- **Bcrypt rather than Argon2id** — `ACCEPTED_FOLLOW_UP`. Богино хугацааны хувьд Bcryptjs хангалттай боловч ирээдүйд Argon2id болон rehash-on-login хийх шаардлагатай.
- **Client-side Portal route protection** — `ACCEPTED_FOLLOW_UP`. Next.js Middleware route enforcement-ийг сервер талд хийх нь ирээдүйд хийгдэх ажил юм.
- **Lack of access-token instant revocation** — `INFORMATIONAL`. Access токен богино хугацаатай (15 мин) тул Gateway түвшинд шуурхай цуцлах логик нэмэх шаардлагагүй (refresh rotation-оор шийдэгдсэн).
- **Lack of distributed rate limiting** — `ACCEPTED_FOLLOW_UP`. Gateway түвшинд rate-limiting хийх нь ирээдүйн дэд бүтцийн ажил.
- **Prisma generation warnings** — `INFORMATIONAL`. Type version warnings нь хэвийн ажиллагаанд нөлөөлөхгүй.

_(Тэмдэглэл: Ямар нэгэн `BLOCKING` ангилалын асуудал байхгүй)._

---

## 3. Нарийн баталгаажуулалтын үр дүн (Exact Validation Results)

- **pnpm install --frozen-lockfile** (Exit Code: 0)
- **pnpm format:check** (Exit Code: 0)
- **pnpm lint** (Exit Code: 0, 24 packages check succeeded)
- **pnpm typecheck** (Exit Code: 0)
- **pnpm test** (Exit Code: 0, 48 total tests passed across monorepo)
- **pnpm build** (Exit Code: 0, 24 packages build succeeded, Concurrency: 1)

---

## 4. Ухраах төлөвлөгөөний засалт (Rollback Plan Correction)

Энэхүү аудитын явцад өөрчлөгдсөн болон шинээр үүсгэсэн файлуудыг ухраахдаа зөвхөн дараах манифестыг ашиглана. **`git clean -fd` эсвэл `git reset --hard` ажиллуулж болохгүй!** (бусад stage хийгдээгүй өөрчлөлтүүдийг устгах аюултай).

### Шинээр үүсгэсэн файлууд (Устгах шаардлагатай)

```bash
rm -f apps/portal-web/src/components/auth-bootstrap.tsx
rm -f docs/tasks/backup/2026-07-29-sprint-4-security-audit-addendum.md
rm -rf services/auth/prisma/migrations/20260729102543_init_auth/
```

### Өөрчлөгдсөн файлууд (Буцаах шаардлагатай)

```bash
git checkout -- services/auth/src/auth.service.ts services/auth/src/auth.service.spec.ts services/auth/src/main.ts services/gateway/src/proxy.middleware.ts services/gateway/src/proxy.middleware.spec.ts services/gateway/src/main.ts apps/portal-web/src/app/layout.tsx walkthrough.md docs/tasks/active-task.md docs/security/authentication.md docs/security/token-lifecycle.md docs/security/session-management.md docs/security/csrf.md docs/api/authentication-api.md
```
