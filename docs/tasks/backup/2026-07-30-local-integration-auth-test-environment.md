# Active Task: Local Integration and Test Environment

Status: `IN_PROGRESS`

Энэхүү төлөвлөгөө нь Спринт 4-ийн Аутентификацийн урсгалыг локал орчинд турших, нэгтгэх бүрэн автоматжсан орчныг бүрдүүлэхэд чиглэгдэнэ.

---

## 1. Current Compose Architecture

Одоогийн локал Docker Compose бүтэц нь дараах хэсгээс бүрдэж байна:

- Postgres өгөгдлийн сан (дамжуулсан alias: `auth-postgres`)
- Redis (түр зуурын санах ой)
- RabbitMQ (хүлээгдлийн дараалал)
- MinIO (файл хадгалах сан)
- `auth` (аутентификацийн NestJS үйлчилгээ)
- `gateway` (API Gateway)
- `portal-web` (Хөгжүүлэгчийн Portal Next.js аппликейшн)

## 2. Current Auth and Gateway Connectivity

Код доторх үйлчилгээнүүдийн холболт:

- `gateway` нь `auth` үйлчилгээ рүү Docker сүлжээний дотоод нэрээр хандана: `http://auth:8080`
- `auth` нь `auth-postgres` үйлчилгээ рүү сүлжээний дотоод хаягаар хандана: `postgresql://seek_admin:seek_postgres_pass@auth-postgres:5432/auth_db`
- Browser болон тестийн клиентүүд `gateway` рүү гадаад портоор хандана.

## 3. Existing Published Ports

- `gateway`: `127.0.0.1:3000` (хөтөч болон тестийн клиентүүдэд зориулсан гадаад хаалга)
- `portal-web`: `127.0.0.1:3001`
- `auth`: `127.0.0.1:3010` (зөвхөн хөгжүүлэгчийн dev профайлд зориулсан, бусад үед сүлжээнээс гадагш хаалттай)
- `postgres`: `127.0.0.1:5432`

## 4. Required Local Services

Аутентификацийн локал туршилтын хувьд зөвхөн дараах үйлчилгээнүүд шаардлагатай:

- `auth-postgres` (өгөгдлийн сан)
- `auth-migrate` (Prisma deploy)
- `auth-seed` (тест хэрэглэгч бэлтгэх нэг удаагийн үйлчилгээ)
- `auth` (аутентификацийн логик)
- `gateway` (API Gateway)
- `portal-web` (Portal хэрэглэгчийн вэб хуудас)

Эдгээрийг `auth-test` профайлаар ажиллуулна.

## 5. Environment-Variable Map

Тохиргооны загварууд `.env.example` болон `.env.local.example` дээр дараах хувьсагчдыг агуулна:

- `NODE_ENV` (development)
- `DATABASE_URL` (Postgres холболтын хаяг)
- `AUTH_JWT_SECRET` (JWT нууц түлхүүр - орон нутгийн орчны аюулгүй байдлын шаардлага хангасан урттай)
- `AUTH_TOKEN_ISSUER` & `AUTH_TOKEN_AUDIENCE`
- `AUTH_ACCESS_TOKEN_TTL` & `AUTH_REFRESH_TOKEN_TTL`
- `AUTH_COOKIE_NAME`, `AUTH_COOKIE_SECURE`, `AUTH_COOKIE_SAME_SITE`
- `AUTH_ALLOWED_ORIGINS` (зөвхөн localhost:3001, localhost:3000 гэх мэт хөгжүүлэлтийн хаягуудыг зөвшөөрнө)
- `AUTH_TEST_EMAIL` & `AUTH_TEST_PASSWORD` (локал тестэд зориулсан хэрэглэгч)

## 6. Migration Strategy

`auth-migrate` нэг удаагийн үйлчилгээ ашиглан Prisma migrations-ийг автоматаар ажиллуулна:

```bash
npx prisma migrate deploy
```

Энэ нь `auth` үйлчилгээ ажиллахаас өмнө бүрэн дууссан байна.

## 7. Seed Strategy

`auth-seed` нэг удаагийн үйлчилгээ нь `services/auth/prisma/seed.ts` файлыг ажиллуулна.

- Нууц үгийг `bcryptjs` алгоритмаар шифрлэнэ.
- Idempotent байдлаар (upsert) `tester@seek.local` хэрэглэгчийг оруулах тул хэдэн ч удаа ажиллуулсан өмнөх хэрэглэгч давхардахгүй, хэвийн ажиллана.
- Систем production горимд ажиллаж байвал ажиллахаас татгалзана.

## 8. Postman Strategy

`tools/postman/` хавтас доторх `SEEK-Local.postman_collection.json` болон `SEEK-Local.postman_environment.json` файлуудыг `newman` ашиглан ажиллуулж шалгана.

- Автомат тестүүд: Login, Current User, Refresh, Logout, Missing Access Token, Invalid Access Token, Spoofed Headers, Disallowed Origin.

## 9. Browser Smoke-Test Strategy

`playwright` ашиглан `tests/e2e/auth-login.spec.ts` файлыг ажиллуулна.

- Хэрэглэгч нэвтрэх, reload хийхэд сесс сэргэх, localStorage болон sessionStorage дотор access token байхгүй байгааг шалгах, logout хийх, урсгалыг баталгаажуулна.

## 10. CLI Integration-Test Strategy

`scripts/smoke-auth.mjs` ашиглан хөтөч шаардахгүйгээр Node.js дээр шууд API-уудыг дуудаж шалгана.
Мөн `tests/integration/auth.spec.ts` файлыг Jest ашиглан ажиллуулж Gateway -> Auth -> Postgres холболтыг шалгана.

## 11. Healthcheck Strategy

- `postgres`: `pg_isready` ашиглан бэлэн байдлыг шалгана.
- `auth` болон `gateway`: HTTP Node script (`require("http").get(...)`) ашиглан `/health` хаягаар live, ready төлөвийг шалгана.
- `portal-web`: Порт 3000 дээр HTTP хариу өгч байгааг шалгана.

## 12. Startup Ordering

Дараах дарааллаар үйлчилгээнүүд эхэлнэ:

1. `postgres` (healthcheck-ээр healthy болтол хүлээнэ)
2. `auth-migrate` (completed_successfully болтол хүлээнэ)
3. `auth-seed` (completed_successfully болтол хүлээнэ)
4. `auth` (healthy болтол хүлээнэ)
5. `gateway` (healthy болтол хүлээнэ)
6. `portal-web`

## 13. Files to Create

Шинээр үүсгэх файлууд:

- `docs/development/local-auth-testing.md` (дэлгэрэнгүй зааварчилгаа)

## 14. Files to Modify

Өөрчлөх файлууд:

- `package.json` (тест скриптүүд нэмэх)
- `.env.example` & `.env.local.example` (хувьсагчид нэмж баримтжуулах)
- `README.md` (Quick Start нэмэх)
- `walkthrough.md` (Sprint 5-ийн өмнөх үр дүнгийн тайланг шинэчлэх)

## 15. Security Constraints

- JWT secret-ийг хангалттай урттай локал утгаар тохируулна.
- Spoofing хамгаалалтыг шалгах тест нэмэгдсэн.
- CORS/CSRF хамгаалалт идэвхтэй байна.
- Production секретүүдийг локал кодонд болон репозиторт хатуу хориглоно.

## 16. Validation Commands

- `docker compose --profile auth-test config`
- `pnpm test:smoke:auth`
- `pnpm test:integration:auth`
- `pnpm test:postman:auth`
- `pnpm test:e2e:auth`
- `pnpm test:local:auth`

## 17. Rollback Manifest

Ухраах тохиолдолд:

- `docs/development/local-auth-testing.md` файлыг устгана.
- `package.json`, `.env.example`, `.env.local.example`, `README.md`, `walkthrough.md` файлуудыг `git checkout` тушаалаар сэргээнэ.

## 18. Acceptance Criteria

- `auth-test` профайлаар Compose амжилттай асдаг байх.
- Шилжилт болон seed амжилттай дуусдаг байх.
- Бүх үйлчилгээнүүд healthy төлөвтэй болох.
- Автомат тестүүд (smoke, integration, postman, e2e) бүгд 100% амжилттай давах.
- Баримт бичиг Монгол хэл дээр бэлэн болох.
