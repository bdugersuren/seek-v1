# seek.mn Platform Monorepo

Монрепо бүтцийн хөгжүүлэлтийн орчин.

## Скриптүүд ба Багаж хэрэгслүүд

### Workspace Setup Tooling (`scripts/setup-workspace-packages.js`)

Энэхүү скрипт нь **Repository Tooling-ийн байнгын хэсэг** бөгөөд monorepo доторх бүх workspace package-уудын тохиргооны стандартыг хангаж, нэг мөр болгох үүрэгтэй.

#### Зорилго:

- Шинээр багц (package, app, service) нэмэгдэхэд түүний `package.json` дахь стандарт скриптүүд (`build`, `lint`, `lint:fix`, `typecheck`, `test`, `clean`)-ийг автоматаар үүсгэх;
- Төслийн хэмжээний TypeScript config (`tsconfig.base.json`), Jest config (`jest.config.js`), Prettier, ESLint flat config-уудтай уялдуулан багц тус бүрийн `tsconfig.json` болон `jest.config.js` файлуудыг extends хийх байдлаар автоматаар шинэчлэх;
- Docker Compose-ийн NestJS үйлчилгээнүүдийн `.dockerignore` болон бэлэн байдлын тестүүдийг (`app.spec.ts`) стандартад оруулах.

#### Хэрэглээ ба Идэмпотент (Idempotent) чанар:

Скрипт нь бүрэн идэмпотент бөгөөд хэдэн ч удаа дахин ажиллуулсан өмнөх зөв тохиргоог эвдэхгүй, зөвхөн дутуу эсвэл буруу тохиргоог стандартад нийцүүлэн засна.

Ажиллуулах тушаал:

```bash
node scripts/setup-workspace-packages.js
```

Скриптийг ажиллуулсны дараа кодын форматыг нэг мөр болгохын тулд `pnpm format` ажиллуулах шаардлагатай.

---

## Локал Нэвтрэлтийн Туршилтын Орчин (Local Auth Test Environment)

Локал хөгжүүлэлтийн орчинд нэвтрэлтийн (auth) урсгалыг шалгах, тестүүдийг ажиллуулахад дараах хурдан зааврыг дагана уу:

1. Орчны загварыг хуулах:
   ```bash
   cp .env.local.example .env.local
   cp .env.example .env
   ```
2. Docker Compose stack ажиллуулах:
   ```bash
   pnpm dev:auth-test
   ```
3. Хөтөч ашиглан нэвтрэх хуудсыг нээх: [http://localhost:3001/login](http://localhost:3001/login) (Тест хэрэглэгч: `tester@seek.local` / `TestPassword123!`, Superadmin: `superadmin@lms.local` / `TestPassword123!`)
4. Автоматжуулсан интеграцийн тестүүдийг ажиллуулах:
   ```bash
   pnpm test:local:auth
   ```

Дэлгэрэнгүй заавар болон алдааг засах шийдлүүдийг [local-auth-testing.md](file:///home/bd/seek-v1/docs/development/local-auth-testing.md) гарын авлагаас харна уу.
