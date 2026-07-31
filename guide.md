# seek.mn Docker Compose Dev Guide

Энэ guide нь seek.mn платформыг локал dev орчинд `docker compose up -d` хэлбэрээр асаах дараалал, ямар service ямар profile-д хамаарах, хэрхэн шалгах, хэрхэн унтраахыг тайлбарлана.

## 1. Урьдчилсан шаардлага

Доорх зүйлс машин дээр бэлэн байна:

- Docker Engine болон Docker Compose plugin
- Node.js 18+
- pnpm 9.x
- Репо root: `/home/bd/seek-v1`

Dev compose нь бүх container-ийг `shared-net` нэртэй external Docker network-д холбоно. Тиймээс эхний удаа network үүсгэнэ:

```bash
docker network create shared-net
```

Хэрэв аль хэдийн үүссэн бол Docker `already exists` гэж хэлж болно. Тэр нь асуудал биш.

## 2. Environment файл бэлтгэх

Root хавтаснаас ажиллана:

```bash
cd /home/bd/seek-v1
```

Эхний удаа `.env` болон `.env.local` үүсгэнэ:

```bash
cp .env.example .env
cp .env.local.example .env.local
```

Одоогийн local dev default:

- Test хэрэглэгч: `tester@seek.local`
- Superadmin хэрэглэгч: `superadmin@lms.local`
- Test нууц үг: `TestPassword123!`
- Portal URL: `http://localhost:3001`
- Gateway URL: `http://localhost:3000`

## 3. Compose файлуудын үүрэг

Энэ repo хоёр compose файл ашиглана:

- `docker-compose.yml`: үндсэн service, profile, dependency, image/build тохиргоо
- `docker-compose.dev.yml`: dev override, bind mount, local port mapping, hot reload command

Dev орчинд бараг үргэлж хоёуланг нь хамт хэрэглэнэ:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ...
```

## 4. Recommended: Auth + Portal Dev Орчин

Ихэнх development-д энэ profile-оос эхэлнэ. Энэ нь Postgres, Redis, RabbitMQ, MinIO, Auth, Gateway, Portal Web-ийг асаана.

### 4.1 Config шалгах

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test config
```

Энэ command алдаагүй дуусвал compose YAML, env substitution, dependency graph зөв байна.

### 4.2 Build хийж background-д асаах

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build -d
```

Энэ command дараах дарааллаар ажиллана:

1. `postgres`, `redis`, `rabbitmq`, `minio` асна.
2. `postgres` healthy болохыг хүлээнэ.
3. `auth-migrate` Prisma migration ажиллуулна.
4. `auth-seed` test болон superadmin dev хэрэглэгч үүсгэнэ.
5. `auth` асаж healthy болно.
6. `gateway` асаж healthy болно.
7. `portal-web` асна.

### 4.3 Container status шалгах

```bash
docker ps
```

Хүлээгдэх үндсэн container-ууд:

- `seek-postgres`
- `seek-redis`
- `seek-rabbitmq`
- `seek-minio`
- `seek-auth`
- `seek-gateway`
- `seek-portal-web`

`seek-auth` болон `seek-gateway` дээр `(healthy)` харагдаж байвал сайн.

### 4.4 Health check

Gateway:

```bash
curl http://localhost:3000/health
```

Auth:

```bash
curl http://localhost:3010/health
```

Portal browser дээр:

```text
http://localhost:3001/login
```

Login:

- Email: `tester@seek.local`
- Email: `superadmin@lms.local`
- Password: `TestPassword123!`

### 4.5 Auth API validation

Stack ассаны дараа:

```bash
pnpm test:smoke:auth
pnpm test:integration:auth
pnpm test:postman:auth
```

Эдгээр нь Gateway -> Auth -> Postgres урсгалыг шалгана:

- login
- `/me`
- refresh token rotation
- logout
- invalid token
- spoofed identity header хамгаалалт
- disallowed origin

## 5. Frontend-only / UI Dev Орчин

Зөвхөн frontend profile асаах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile frontend up --build -d
```

Энэ нь:

- profile-гүй infra services
- `portal-web`
- `assessment-web`

гэж асах боловч `portal-web` нь одоогийн compose дээр `gateway` healthy байхыг хүлээдэг. Иймээс auth-backed portal development хийх бол `auth-test` profile-г ашиглах нь илүү найдвартай.

## 6. Assessment Dev Орчин

Assessment app болон assessment domain scaffold service-үүдийг асаах:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile assessment up --build -d
```

Dev override дээр `assessment-web` backend dependency-гээс салсан mock mode-той:

- Assessment Web: `http://localhost:3002`
- Profile service: `http://localhost:3020`
- Organisation service: `http://localhost:3030`
- Verification service: `http://localhost:3040`
- Competency service: `http://localhost:3050`
- Assessment service: `http://localhost:3060`
- Commerce service: `http://localhost:3070`
- Execution service: `http://localhost:3080`
- Evaluation worker: `http://localhost:3090`
- Learning service: `http://localhost:3100`
- File service: `http://localhost:3130`
- Reporting service: `http://localhost:3140`
- Platform service: `http://localhost:3150`

Жишээ health check:

```bash
curl http://localhost:3060/health
curl http://localhost:3080/health
```

## 7. AI Dev Орчин

AI profile асаах:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile ai up --build -d
```

Ports:

- Ollama: `http://localhost:11434`
- Qdrant REST: `http://localhost:6333`
- Qdrant gRPC: `localhost:6334`
- AI service: `http://localhost:3110`

Health check:

```bash
curl http://localhost:3110/health
```

## 8. Integration Dev Орчин

Integration service асаах:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile integration up --build -d
```

URL:

```text
http://localhost:3120
```

Health check:

```bash
curl http://localhost:3120/health
```

## 9. Full Dev Орчин

Бүх гол profile-уудыг хамтад нь асаах бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test --profile assessment --profile ai --profile integration up --build -d
```

Энэ нь хамгийн их resource хэрэглэнэ. RAM/CPU бага бол эхлээд `auth-test`-оор ажиллаж, дараа нь хэрэгтэй profile-оо тусад нь нэмэх нь дээр.

## 10. Log харах

Бүх service log:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

Зөвхөн gateway:

```bash
docker logs -f seek-gateway
```

Зөвхөн auth:

```bash
docker logs -f seek-auth
```

Зөвхөн portal:

```bash
docker logs -f seek-portal-web
```

## 11. Rebuild хийх

Dockerfile, package dependency, Prisma schema, compose env өөрчлөгдсөн бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build -d
```

Хэрэв cache сэжигтэй бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test build --no-cache
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up -d
```

## 12. Унтраах

Container-уудыг унтраах:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test down
```

Volume хадгална. Database data үлдэнэ.

Data-г бүрэн цэвэрлэж унтраах:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test down -v
```

`down -v` нь Postgres, Redis, RabbitMQ, MinIO volume data-г устгана. Test өгөгдлийг цэвэр эхлүүлэх үед л хэрэглэ.

## 13. Common Алдаа ба Шийдэл

### `network shared-net declared as external, but could not be found`

Шийдэл:

```bash
docker network create shared-net
```

Дараа нь compose command-оо дахин ажиллуул.

### `port is already allocated`

Тухайн port дээр өөр service ажиллаж байна.

Шалгах:

```bash
docker ps
```

Эсвэл тухайн port-ыг ашиглаж буй local process-ийг зогсооно.

Dev port map:

- `3000`: Gateway
- `3001`: Portal Web
- `3002`: Assessment Web
- `3010`: Auth
- `5432`: Postgres
- `6379`: Redis
- `5672`, `15672`: RabbitMQ
- `9000`, `9001`: MinIO

### `auth-migrate` эсвэл `auth-seed` failed

Log шалгах:

```bash
docker logs seek-auth-migrate
docker logs seek-auth-seed
docker logs seek-postgres
```

Ихэвчлэн Postgres volume хуучин schema/state-тэй байх үед гарна. Local test data устгаж дахин эхлүүлэх бол:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test down -v
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build -d
```

### Login ажиллахгүй бол

1. Gateway health:

   ```bash
   curl http://localhost:3000/health
   ```

2. Auth health:

   ```bash
   curl http://localhost:3010/health
   ```

3. Smoke test:

   ```bash
   pnpm test:smoke:auth
   ```

4. Logs:

   ```bash
   docker logs seek-gateway
   docker logs seek-auth
   ```

### Playwright E2E browser dependency дутуу бол

API smoke/integration/postman тестүүд Docker stack-ийг шалгахад хангалттай. Browser E2E ажиллуулахад host Chromium dependency хэрэгтэй байж болно.

Linux дээр sudo эрхтэй терминалаас:

```bash
npx playwright install-deps chromium
```

Дараа нь:

```bash
pnpm test:e2e:auth
```

## 14. Recommended Daily Workflow

Өдөр тутмын auth + portal dev:

```bash
cd /home/bd/seek-v1
docker network create shared-net
cp .env.example .env
cp .env.local.example .env.local
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build -d
docker ps
pnpm test:smoke:auth
```

Дараа нь browser:

```text
http://localhost:3001/login
```

Test account:

```text
tester@seek.local / TestPassword123!
```

Ажил дуусахад:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test down
```
