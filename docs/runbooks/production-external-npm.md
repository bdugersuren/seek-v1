# SEEK production — external Nginx Proxy Manager

## Одоогийн гаргалтын төлөв

**Нийтэд гаргахад бэлэн биш.** Deployment тохиргоо болон тусгаарласан verification орчин бэлтгэгдсэн. Бодит schedule → attempt materialization, байгууллагын authorization, dependency security update болон гадаад үйлчилгээний тохиргоо дуусаагүй. Дэлгэрэнгүй: `docs/audits/2026-09-10-production-deployment.md`.

`docker-compose.prod.yml` нь **дангаар** хэрэглэгдэх файл; хуучин base/dev Compose-той давхарлаж болохгүй. Compose project: `seek`. Одоо байгаа `infra-npm`-ийг энэ төсөл удирдахгүй.

## Сүлжээ, домэйн

| Host | NPM upstream (HTTP) | Тайлбар |
|---|---|---|
| seek.mn | seek-portal-web:8081 | Үндсэн портал |
| portal.seek.mn | https://seek.mn redirect | Path/query хадгалсан 301 |
| quiz.seek.mn | seek-assessment-web:8082 | Үнэлгээний веб |
| quiz-api.seek.mn | seek-gateway:3010 | API, SSE |
| files.seek.mn | seek-minio:9000 | Private bucket-ийн presigned S3 API |

Таван DNS host серверийн public IP руу заана. AAAA байвал IPv6 routing мөн ажиллах ёстой. NPM дээр хүчинтэй сертификаттай HTTPS/Force SSL идэвхжүүлнэ. Одоогийн бусад host-ыг өөрчлөхгүй. API host дээр SSE-д buffering унтрааж, урт холболтын timeout тохируулна. Files host дээр path rewrite хийхгүй, `Host` болон query-г хэвээр дамжуулна; `proxy_request_buffering off`, upload хэмжээний хязгаарыг бүтээгдэхүүний бодлоготой нийцүүлнэ. MinIO console нийтэд нээгдэхгүй.

Зөвхөн портал, үнэлгээний веб, gateway, MinIO `proxy_net`-д холбогдоно. Бусад үйлчилгээ Compose-ийн `seek_backend` bridge-д байна. Host port publish байхгүй. Backend bridge outbound SMTP/HTTPS-д боломжтой; `internal: true` тавихгүй.

## Нууц, build, migration

`.env.production.example`-ээс `.env.production` бэлтгэж `chmod 600` хийнэ. PostgreSQL/Redis/RabbitMQ/MinIO/JWT/KMS түлхүүрүүд тусдаа, дор хаяж 32-byte санамсаргүй утгатай байна. URL-д ордог нууцад hex утга хэрэглэнэ. SMTP_HOST/USER/PASSWORD, mail sender-ийг бодит нийлүүлэгчийн тохиргоогоор өгнө. Нууц болон Compose-ийн expanded config-ийг лог/чат/Git-д хэвлэхгүй.

```bash
python3 scripts/test-production-compose.py
docker compose --env-file .env.production -f docker-compose.prod.yml config --quiet
docker build -f docker/Dockerfile.dependencies -t seek-dependencies:production .
docker build --target backend -f docker/Dockerfile.production -t seek-backend:production .
docker build --target frontend --build-arg SERVICE=portal-web -f docker/Dockerfile.frontend.production -t seek-portal-web:production .
docker build --target frontend --build-arg SERVICE=assessment-web -f docker/Dockerfile.frontend.production -t seek-assessment-web:production .
```

Бүх release blocker хаагдсаны **дараа**:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --no-build --wait
```

Дээрх up нь зургаан `*-migrate` job-ийг database health-ийн дараа ажиллуулна. App нь өөрийн migration амжилттай дууссаны дараа асна. Startup үед install/generate/seed хийхгүй. App process нь image-ийн `node` хэрэглэгчээр ажиллана. Image-үүд dependency layer хуваалцах боловч бүх backend нэг image ашиглана; dev tooling runtime image-д одоогоор үлдсэн нь цааш багасгах ажил.

Анхны админ: зөв имэйл, 16-аас урт random password бүхий `{ "email": "...", "password": "..." }` JSON-ийг `0600` файлд хадгалж, stdin-ээр өгнө:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T auth node /app/scripts/bootstrap-admin.cjs < .production/admin.json
```

Existing account-ыг энэ команд өөрчлөхгүй. Demo seed хориглогдсон. Admin JSON-ийг credential manager-т шилжүүлсний дараа серверт шаардлагагүй бол тусад нь устгана.

## Verification, rollback

- Unit/component тестийг production өгөгдөлд холбохгүй. `seek-verify` нь тусдаа network/volume болон Mailpit-тай.
- `scripts/smoke-infrastructure.cjs` зөвхөн `seek-verify_backend`-д ажиллана; бодит SMTP, auth, file HTTP урсгалын **тусгаарласан** шалгалт.
- `scripts/smoke-production.mjs` нь `E2E_EMAIL`, `E2E_PASSWORD`, бодит `E2E_ASSESSMENT_ID` шаарддаг. Mock attempt-ийг гаргалтын баталгаа гэж үзэхгүй. Одоогийн үйлдвэрлэлийн attempt creation 503 тул энэ release gate одоогоор давахгүй.
- Шинэ schema migration нь хуучин feedback/type/cognitive утгуудыг хадгалж backfill хийнэ. Танигдаагүй хуучин question type эсвэл enum status байвал transaction алдаатай зогсоно; дур мэдэн хөрвүүлэхгүй.
- Assessment-ийн legacy `question_type`, typeId/feedback/cognitive баганууд санаатай хадгалагдсан; schema diff-ийн DROP санал автоматаар ажиллуулахгүй.
- Release-ээс өмнө SEEK image tag/digest, NPM host config, өгөгдлийн backup хадгална. Image rollback нь schema rollback биш. Сэргээх шаардлагатай бол шалгасан backup-ийг ашиглана; `down -v`, `db push --accept-data-loss`, volume reset хэрэглэхгүй.

## Backup / restore

`infra/backup/backup.env.example` → `.production/backup.env` (`0600`): S3 remote repository, AWS credential, тусдаа RESTIC_PASSWORD. Нууцыг алдахад backup тайлагдахгүй тул тусдаа credential manager-т хадгална. Repository-г эхлээд restic-ээр initialize хийнэ; өдөр тутмын job үүнийг автоматаар хийхгүй.

`python3 scripts/backup-production.py` нь remote credential-ийг шалгаад SEEK writer/store-уудыг богино хугацаанд зогсоож PostgreSQL dump, MinIO/Redis/RabbitMQ archive үүсгэнэ. Зогсоосон workload-уудыг finally хэсэгт сэргээж, remote encrypted backup хийж 14 хоног хадгална. Remote алдаатай бол хамгаалалттай local snapshot үлдэнэ. Backup үед богино maintenance window шаардлагатай; downtime-free/PITR шийдэл биш.

`infra/backup/seek-backup.service` ба timer нь өдөр бүр 19:00 UTC (Улаанбаатар 03:00) ажиллана. **Хандалт бэлэн болоогүй тул серверт суулгаж идэвхжүүлээгүй.**

Remote snapshot-ийг restic restore хийсний дараа:

```bash
python3 scripts/restore-check-production.py /absolute/path/to/restored/snapshot
```

Энэ команд `seek-restore-*` гэсэн шинэ network/volume үүсгэж SQL/archive сэргээнэ. Production volume-д хүрэхгүй. Дараа нь хэрэглэгч/файл/үнэлгээний бодит агуулгаар сэргэлтийг батална. Remote restore drill, RPO/RTO хэмжилт одоогоор хийгдээгүй.
