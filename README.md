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

## Production-like Minimal Local Runbook

Энэ горим нь dev watch, bind mount, `next dev`, `start:dev`-ийг ашиглахгүйгээр frontend болон backend сервисүүдийг production-тэй ойролцоо байдлаар ажиллуулах зориулалттай.

Одоогийн production-like тохиргоо нь backend service image бүрт тус тусад нь `node_modules` суулгахгүй. Үүний оронд `node-modules-init` service root workspace dependency-г нэг удаа `shared_node_modules` Docker volume-д суулгана. Backend service-үүд `/app/node_modules` дээр тэр volume-г mount хийж, image хэмжээг багасгана.

### Яагаад ашиглах вэ?

- Frontend-ийн бодит production build/start latency хэмжих.
- Nginx Proxy Manager routing болон subdomain тохиргоог шалгах.
- Docker bind mount, Next.js dev server, TypeScript watch mode-оос үүсэх удаашралыг тусгаарлаж оношлох.
- Бүх 20+ сервисийг зэрэг асаалгүй RAM/CPU/I/O хэрэглээг багасгах.

### Ашиглах compose файлууд

- `docker-compose.yml`: үндсэн service/image/network тохиргоо.
- `docker-compose.prod.yml`: production-like override. Энэ файл frontend bind mount-уудыг авч, backend service-үүдэд shared `node_modules` volume mount хийж, `node-modules-init` dependency installer service ажиллуулна.

`docker-compose.dev.yml`-ийг энэ горимд ашиглахгүй. Тэр файл `start:dev`, bind mount, watch mode-д зориулагдсан.

### Production-like архитектурын товч зураг

```text
node-modules-init
  -> shared_node_modules volume

backend service containers
  -> /app/node_modules shared_node_modules volume
  -> /app/services/<service>/dist
  -> /app/services/<service>/prisma
  -> scripts/service-entrypoint.sh

postgres
  -> auth_db
  -> profile_db
  -> organisation_db
  -> assessment_db
  -> execution_db
  -> commerce_db
  -> file_db
  -> notification_db
  -> reporting_db

file service
  -> file_db metadata
  -> MinIO binary object storage
```

### Prisma migrate/seed хэрхэн ажилладаг вэ?

Backend service image бүр `scripts/service-entrypoint.sh`-ээр асна. Entry point дараах дарааллаар ажиллана:

```text
1. prisma generate --schema prisma/schema.prisma
2. prisma migrate deploy --schema prisma/schema.prisma
3. RUN_SEED=true бол prisma/seed.ts ажиллуулна
4. node dist/src/main.js
```

Service бүр өөрийн Prisma schema болон migration-тэй:

```text
services/auth/prisma/schema.prisma
services/profile/prisma/schema.prisma
services/organisation/prisma/schema.prisma
services/assessment/prisma/schema.prisma
services/execution/prisma/schema.prisma
services/commerce/prisma/schema.prisma
services/file/prisma/schema.prisma
services/notification/prisma/schema.prisma
services/reporting/prisma/schema.prisma
```

`RUN_SEED=true` тохируулбал тухайн service-ийн `prisma/seed.ts` ажиллана. Frontend mock дата service boundary бүрээр дараах байдлаар seed хийнэ:

| Service | Seed агуулга |
|---|---|
| `auth` | test/superadmin user |
| `profile` | mock candidate profile, location, education, work history |
| `organisation` | platform, demo, school/training organisations and units |
| `assessment` | catalog assessments, question bank items, runtime quiz/revision/schedule/assignment/payment policy |
| `execution` | mock eligibility snapshot, attempt, delivered questions, state snapshot |
| `commerce` | candidate payment orders and transactions |
| `file` | candidate documents and question media metadata |
| `notification` | notification templates and candidate notifications |
| `reporting` | published result fact for report/dashboard mock |

### 1. Бүрэн цэвэрлэх

Анхааруулга: дараах командууд Docker дээр ажиллаж байгаа бүх container/image/cache/volume-г устгана. Зөвхөн энэ machine дээрх Docker state-г бүрэн шинээр эхлүүлэх үед ажиллуул.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v --remove-orphans
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker system prune --all --force --volumes
```

Тайлбар:

- `down -v --remove-orphans`: compose stack, anonymous/named volumes, orphan container-уудыг буулгана.
- `docker stop` / `docker rm`: compose-оос гадуур үлдсэн container байвал цэвэрлэнэ.
- `docker system prune --all --volumes`: ашиглагдаагүй image, build cache, network, volume-г бүрэн цэвэрлэнэ.

### 2. Shared network үүсгэх

```bash
docker network create shared-net || true
```

Тайлбар: бүх service `shared-net` external network дээр холбогддог. Network өмнө нь байвал `|| true` команд алдаа болгож зогсоохгүй.

### 3. Production-like minimal stack build хийх

Энэ stack-ийг асаах үед `node-modules-init` автоматаар эхэлж, `shared_node_modules` volume-д dependency суулгана. Дараа нь backend service-үүд entrypoint-ээр Prisma generate/migrate хийж асаад эхэлнэ.

Portal болон assessment frontend-ийг хоёуланг нь NPM-ээр шалгах хамгийн бага stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile auth-test --profile assessment up -d --build \
  node-modules-init \
  postgres \
  redis \
  rabbitmq \
  auth-migrate \
  auth-seed \
  auth \
  gateway \
  execution \
  portal-web \
  assessment-web \
  nginx-proxy
```

Тайлбар:

- `postgres`: auth database.
- `node-modules-init`: root workspace dependency-г `shared_node_modules` volume-д суулгана.
- `redis`, `rabbitmq`: execution service runtime integration.
- `auth-migrate`, `auth-seed`: auth schema болон test user seed.
- `auth`: login/session service.
- `gateway`: public API gateway, `quiz-api.seek.mn` target.
- `execution`: assessment runtime/SSE/autosave endpoint.
- `portal-web`: production build-ээс `next start -p 8081`.
- `assessment-web`: production build-ээс `next start -p 8082`.
- `nginx-proxy`: local subdomain reverse proxy.

Зөвхөн portal шалгах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile auth-test up -d --build \
  node-modules-init \
  postgres \
  auth-migrate \
  auth-seed \
  auth \
  gateway \
  portal-web \
  nginx-proxy
```

Зөвхөн assessment runtime шалгах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile auth-test --profile assessment up -d --build \
  node-modules-init \
  postgres \
  redis \
  rabbitmq \
  auth-migrate \
  auth-seed \
  auth \
  gateway \
  execution \
  assessment-web \
  nginx-proxy
```

Бүх backend bounded-context service-үүдийг нэг дор асаах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile auth-test --profile assessment --profile frontend up -d --build \
  node-modules-init \
  postgres \
  redis \
  rabbitmq \
  minio \
  auth-migrate \
  auth-seed \
  auth \
  profile \
  organisation \
  assessment \
  execution \
  commerce \
  file \
  notification \
  reporting \
  gateway \
  portal-web \
  assessment-web \
  nginx-proxy
```

Seed ажиллуулах шаардлагатай бол тухайн service дээр `RUN_SEED=true` env нэмнэ. Жишээ нь `docker-compose.prod.yml` дотор:

```yaml
services:
  profile:
    environment:
      RUN_SEED: "true"
```

Анхаарах зүйл: `auth-seed` нь тусдаа one-off service тул `auth` service-ийн `RUN_SEED`-ээс хамаарахгүй.

### 4. NPM proxy host тохиргоог сэргээх

Docker volume-уудыг бүрэн устгасан бол Nginx Proxy Manager-ийн SQLite database мөн цэвэрлэгдэнэ. Тиймээс proxy host config-уудыг script-ээр дахин үүсгэнэ.

```bash
docker cp scripts/configure-npm-proxy-hosts.cjs seek-npm:/app/configure-npm-proxy-hosts.cjs
docker exec -w /app seek-npm node configure-npm-proxy-hosts.cjs
docker exec seek-npm nginx -t
docker exec seek-npm nginx -s reload
```

Тайлбар:

- `docker cp`: repo-д хадгалсан NPM proxy setup script-ийг container рүү хуулна.
- `node configure-npm-proxy-hosts.cjs`: `portal.seek.mn`, `quiz.seek.mn`, `quiz-api.seek.mn` зэрэг local domain mapping-үүдийг NPM database болон generated nginx config дээр үүсгэнэ.
- `nginx -t`: syntax шалгана.
- `nginx -s reload`: шинэ proxy host config-уудыг идэвхжүүлнэ.

### 5. Ажиллаж байгаа эсэхийг шалгах

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs node-modules-init
curl -I http://portal.seek.mn
curl -I http://quiz.seek.mn
curl -I http://quiz-api.seek.mn/health
curl -I http://auth-api.seek.mn/health
curl -I http://exec-api.seek.mn/health
```

Хүлээгдэх үр дүн:

- `portal.seek.mn` -> `200 OK`
- `quiz.seek.mn` -> `307 Temporary Redirect` эсвэл тухайн route дээр `200 OK`
- `quiz-api.seek.mn/health` -> `200 OK`
- `auth-api.seek.mn/health` -> `200 OK`
- `exec-api.seek.mn/health` -> `200 OK`

Latency хэмжих:

```bash
curl -s -o /dev/null -w 'code=%{http_code} ttfb=%{time_starttransfer} total=%{time_total}\n' http://portal.seek.mn
curl -s -o /dev/null -w 'code=%{http_code} ttfb=%{time_starttransfer} total=%{time_total}\n' http://quiz.seek.mn
curl -s -o /dev/null -w 'code=%{http_code} ttfb=%{time_starttransfer} total=%{time_total}\n' http://quiz-api.seek.mn/health
```

Backend health proxy шалгах:

```bash
curl -I http://quiz-api.seek.mn/api/v1/profile/health
curl -I http://quiz-api.seek.mn/api/v1/organisation/health
curl -I http://quiz-api.seek.mn/api/v1/assessment/health
curl -I http://quiz-api.seek.mn/api/v1/execution/health
curl -I http://quiz-api.seek.mn/api/v1/commerce/health
curl -I http://quiz-api.seek.mn/api/v1/file/health
curl -I http://quiz-api.seek.mn/api/v1/notification/health
curl -I http://quiz-api.seek.mn/api/v1/reporting/health
```

Prisma schema validate хийх:

```bash
export ASSESSMENT_DATABASE_URL=postgresql://seek_admin:seek_postgres_pass@localhost:5432/assessment_db
export EXECUTION_DATABASE_URL=postgresql://seek_admin:seek_postgres_pass@localhost:5432/execution_db

for service in auth profile organisation assessment execution commerce file notification reporting; do
  pnpm exec prisma validate --schema services/$service/prisma/schema.prisma
done
```

### 6. Log харах

```bash
docker logs -f seek-npm
docker logs -f seek-portal-web
docker logs -f seek-assessment-web
docker logs -f seek-gateway
docker logs -f seek-execution
docker logs -f seek-profile
docker logs -f seek-organisation
docker logs -f seek-assessment
docker logs -f seek-commerce
docker logs -f seek-file
docker logs -f seek-notification
docker logs -f seek-reporting
```

### 7. Production-like stack унтраах

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

Volume-уудыг хамт устгах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v --remove-orphans
```

Shared dependency volume-г дангаар нь дахин суулгах хэрэгтэй бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml stop node-modules-init
docker volume rm seek-v1_shared_node_modules seek-v1_pnpm_store
docker compose -f docker-compose.yml -f docker-compose.prod.yml up node-modules-init
```

Postgres DB volume-г хадгалж, зөвхөн dependency volume-г сэргээх үед дээрх команд хангалттай.

---

## Шинжилсэн алдаа ба зассан шийдэл (Troubleshooting)

### Алдаа: `Process "pnpm install --frozen-lockfile" did not complete successfully: pnpm-lock.yaml is absent`
- **Шалтгаан**: Docker Compose дотор зарим үйлчилгээнүүдийн `build` тодорхойлохдоо `context`-ийг төслийн root биш, тухайн үйлчилгээний хавтсаар (`./services/assessment`) заасан байсан. Ингэснээр pnpm нь monorepo-ийн workspace package-ууд болон root `pnpm-lock.yaml`-ийг олж чадахгүй унаж байсан.
- **Шийдэл**: Бүх 13 үйлчилгээний `build` хэсгийг `context: .` болон `dockerfile: services/{{NAME}}/Dockerfile` болгон өөрчилж, Dockerfile дотроо `COPY . .` ашигладаг болгон стандартыг нэг мөр болгов. Ингэснээр бүх контейнерууд monorepo-ийн root context-оор алдаагүй амжилттай build хийгддэг боллоо.

### Алдаа: `Error: Cannot find module '/app/services/commerce/dist/main.js' (Exited 1)`
- **Шалтгаан**: NestJS build хийх үед `tsconfig.json` доторх `rootDir` тохиргооноос шалтгаалан compiled файлууд нь `dist` дотор биш, харин `dist/src/main.js` дэд хавтас дотор үүсдэг. Гэвч Dockerfile-ийн `CMD` дотор тэдгээрийг `node dist/main.js` гэж дуудаж байснаас үүдэн контейнерууд асах үедээ олж чадалгүй алдаа заан унаж байсан.
- **Шийдэл**: Бүх 13 үйлчилгээний `Dockerfile` доторх `CMD` дуудлагуудыг `CMD ["node", "dist/src/main.js"]` болгон өөрчилж, NestJS build-ийн бодит файлын замтай нийцүүлж засав.
