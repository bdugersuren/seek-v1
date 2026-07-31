# Active Task: Sprint 2 Closure and Monorepo Build Verification

Status: `COMPLETED`

## Title

Sprint 2 Closure and Monorepo Build Verification

## Objective

Sprint 2-ийг албан ёсоор хаахын тулд monorepo-ийн build, lint, typecheck, test болон Docker Compose тохиргоог хэрэглэгчийн заасан эцсийн засваруудын дагуу бүрэн шалгаж, баталгаажуулах.

## Verification Results

### 1. Command Verification

- `pnpm install` -> Exit Code: 0 (Lockfile is up to date, Already up to date)
- `pnpm install --frozen-lockfile` -> Exit Code: 0 (Lockfile is up to date, Already up to date)
- `docker compose config` -> Exit Code: 0 (WARN: DATABASE_URL, REDIS_PASSWORD not set)
- `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile frontend config` -> Exit Code: 0 (Valid frontend configuration)
- `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile assessment config` -> Exit Code: 0 (Valid assessment configuration)
- `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile ai config` -> Exit Code: 0 (Valid AI configuration)

### 2. Jest Test Summary

```text
Test Suites: 24 passed, 24 total
Tests:       48 passed, 48 total (16 NestJS services * 3 healthchecks = 48 health tests)
Snapshots:   0 total
Time:        38.594s
Exit code:   0
```

### 3. Service Profile Resolution

- **core** (Profile-less):
  - `postgres`
  - `redis`
  - `rabbitmq`
  - `minio`
  - `auth`
  - `gateway`
- **frontend**:
  - `portal-web`
- **assessment**:
  - `assessment-web`
  - `profile`
  - `organisation`
  - `verification`
  - `competency`
  - `assessment`
  - `commerce`
  - `execution`
  - `evaluation`
  - `learning`
  - `reporting`
  - `file`
  - `platform`
- **ai** (Verified containing all 3 core services):
  - `ollama` (qdrant dependency, health checks enabled)
  - `qdrant` (ollama dependency)
  - `ai` (depends_on ollama, qdrant)
- **integration**:
  - `integration`

---

## Steps and Tasks

- [x] `docs/tasks/active-task.md` шинэчлэх
- [x] Ажлын өмнөх Git төлөвийг тэмдэглэж rollback manifest үүсгэх
- [x] Next.js хувилбарыг шалгах
- [x] Root `package.json`, `tsconfig.json`, `tsconfig.base.json`, `turbo.json` үүсгэх/шинэчлэх
- [x] Root `eslint.config.js` Flat Config үүсгэж, dependency compatibility хангах
- [x] Jest-ийн shared configuration болон dependency-г root болон багцуудын түвшинд тохируулах
- [x] Багцуудын (`apps/*`, `services/*`, `packages/*`) `package.json` болон `tsconfig.json` файлуудыг шинэчлэх
- [x] `env/` хавтас доторх `.env.frontend`, `.env.assessment`, `.env.ai`, `.env.integration`, `.env.observability`, `.env.full` файлуудыг үүсгэх
- [x] `docker-compose.yml` болон `docker-compose.dev.yml` дээр `evaluation` болон `ai` profile-ийн (`ollama`, `qdrant`) өөрчлөлтүүдийг оруулах
- [x] Баталгаажуулалтын бүх командуудыг ажиллуулж шалгах
- [x] Тайлан бэлтгэж, task-ийг архивлаж, active-task-ийг цэвэрлэх
