# seek.mn Platform Monorepo

Монрепо бүтцийн хөгжүүлэлтийн орчин.

## Скриптүүд ба Багаж хэрэгслүүд

### Workspace Setup Tooling (`scripts/setup-workspace-packages.js`)

Энэхүү скрипт нь **Repository Tooling-ийн байнгын хэсэг** бөгөөд monorepo доторх бүх workspace package-уудын тохиргооны стандартыг хангаж, нэг мөр болгох үүрэгтэй.

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build execution assessment-web nginx-proxy


curl -X POST http://quiz-api.seek.mn/api/v1/execution/mock-trigger-unlock/mock-attempt-001 -H "Content-Type: application/json" -d '{"unlockKey":"npm-real-key-222"}'


```




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

---

## Локал домэйн болон Nginx Proxy Manager (NPM)-ээр платформыг ажиллуулах дэлгэрэнгүй заавар

Платформыг локал орчинд бодит системтэй (Production) ижил түвшинд портгүйгээр, `seek.mn` локал домэйнуудаар ажиллуулахын тулд дараах алхмуудыг дарааллын дагуу гүйцэтгэнэ үү.

### 1. Локал hosts файл тохируулах (Нэг удаа хийнэ)
Өөрийн үйлдлийн системийн `hosts` файлд (`/etc/hosts` эсвэл Windows-ийн `C:\Windows\System32\drivers\etc\hosts`) дараах мөрүүдийг нэмж хадгална:
```text
127.0.0.1       seek.mn
127.0.0.1       portal.seek.mn
127.0.0.1       quiz.seek.mn
127.0.0.1       file.seek.mn
127.0.0.1       media.seek.mn
127.0.0.1       quiz-api.seek.mn
127.0.0.1       auth-api.seek.mn
127.0.0.1       bank-api.seek.mn
127.0.0.1       bank.seek.mn
```

### 2. Сүлжээ (Docker Network) үүсгэх
Контейнерууд хоорондоо нэг сүлжээн дотор холбогдохын тулд shared network үүсгэнэ:
```bash
docker network create shared-net
```

### 3. Docker Compose Stack-ийг build хийж асаах

Локал хөгжүүлэлтийн явцад санах ой (RAM) болон CPU хэрэглээг хэмнэх үүднээс, зөвхөн өөрт хэрэгцээтэй үйлчилгээнүүдийг сонгон асаахыг зөвлөж байна.

#### А. Хөгжүүлэлтэд зориулсан хөнгөн хувилбар (Зөвлөмж болгож буй, RAM хэмнэх):
Сурагчийн шалгалтын хэсэг болон хүлээлгийн өрөөний хөгжүүлэлтийг хийхэд дараах хөнгөн тушаалаар зөвхөн шаардлагатай (execution, web, gateway, proxy) үйлчилгээнүүдийг асаана:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build execution assessment-web nginx-proxy
```
*(Энэ тушаал нь систем дэх бусад 11 нэмэлт үйлчилгээг асаахгүй унтрааж үлдээх тул таны компьютерын санах ойг асар их хэмнэж, маш хурдан ажиллах болно).*

#### Б. Бүх үйлчилгээг нэгэн зэрэг асаах (Бүтэн хувилбар):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile assessment up -d --build
```

### 4. Nginx Proxy Manager (NPM)-ийг тохируулах
Портуудыг нууж, локал домэйнуудыг чиглүүлэхийн тулд NPM-ийн удирдлагын самбараар орж тохиргоо хийнэ:
1. Хөтөч дээрээ **[http://127.0.0.1:81](http://127.0.0.1:81)** хаягаар орно.
2. Анхны нэвтрэх мэдээлэл:
   - **Email**: `admin@example.com`
   - **Password**: `changeme`
3. **Hosts -> Proxy Hosts** хэсэг рүү орж **Add Proxy Host** товчийг даран дараах 3 чиглүүлэлтийг тус бүр нэмж оруулна:
   - **Portal**: `portal.seek.mn` -> `http://portal-web:3000` (WebSockets Support: Enabled)
   - **Quiz (Assessment)**: `quiz.seek.mn` -> `http://assessment-web:3001` (WebSockets Support: Enabled)
   - **Gateway (API)**: `quiz-api.seek.mn` -> `http://gateway:8080` (WebSockets Support: Enabled)

### 5. Хандах
Тохиргоо хийгдсэний дараа хөтөч дээрээс ямар ч портгүйгээр шууд дараах хаягуудаар хандана:
- Портал хуудас: [http://portal.seek.mn](http://portal.seek.mn)
- Шалгалтын хүлээлгийн өрөө: [http://quiz.seek.mn/waiting/mock-attempt-001](http://quiz.seek.mn/waiting/mock-attempt-001)

---

## Шинжилсэн алдаа ба зассан шийдэл (Troubleshooting)

### Алдаа: `Process "pnpm install --frozen-lockfile" did not complete successfully: pnpm-lock.yaml is absent`
- **Шалтгаан**: Docker Compose дотор зарим үйлчилгээнүүдийн `build` тодорхойлохдоо `context`-ийг төслийн root биш, тухайн үйлчилгээний хавтсаар (`./services/assessment`) заасан байсан. Ингэснээр pnpm нь monorepo-ийн workspace package-ууд болон root `pnpm-lock.yaml`-ийг олж чадахгүй унаж байсан.
- **Шийдэл**: Бүх 13 үйлчилгээний `build` хэсгийг `context: .` болон `dockerfile: services/{{NAME}}/Dockerfile` болгон өөрчилж, Dockerfile дотроо `COPY . .` ашигладаг болгон стандартыг нэг мөр болгов. Ингэснээр бүх контейнерууд monorepo-ийн root context-оор алдаагүй амжилттай build хийгддэг боллоо.

### Алдаа: `Error: Cannot find module '/app/services/commerce/dist/main.js' (Exited 1)`
- **Шалтгаан**: NestJS build хийх үед `tsconfig.json` доторх `rootDir` тохиргооноос шалтгаалан compiled файлууд нь `dist` дотор биш, харин `dist/src/main.js` дэд хавтас дотор үүсдэг. Гэвч Dockerfile-ийн `CMD` дотор тэдгээрийг `node dist/main.js` гэж дуудаж байснаас үүдэн контейнерууд асах үедээ олж чадалгүй алдаа заан унаж байсан.
- **Шийдэл**: Бүх 13 үйлчилгээний `Dockerfile` доторх `CMD` дуудлагуудыг `CMD ["node", "dist/src/main.js"]` болгон өөрчилж, NestJS build-ийн бодит файлын замтай нийцүүлж засав.


