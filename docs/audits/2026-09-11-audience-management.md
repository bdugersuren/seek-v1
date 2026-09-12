# Audience management гаргалтын тайлан — 2026-09-11

## Үр дүн

`/admin/metadata/audience-types` хоёр багана, төрөл хайлт/карт/тоо, шаталсан мод, төрөл болон түвшний modal хэлбэрээр хэрэгжиж production-д байршуулсан. Parent болон эрэмбийг modal-аас өөрчилнө; drag-and-drop байхгүй. MN/EN, keyboard/focus, dirty-form confirmation, loading/empty/403/server error/retry төлөвтэй.

API бүх шаардлагатай талбарыг хадгална. orderIndex үндсэн, rank compatibility хэвээр. Төрөлгүй шинэ level үүсгэх fallback арилсан. Цикл, өөр төрлийн parent, давхардсан код, холбоостой устгалтаас хамгаалсан. Schema өөрчлөлт, migration, production seed хийгээгүй. SUPER_ADMIN gateway бодлогыг хэвээр хадгалсан.

## Баталгаажуулалт

- Assessment unit: 9 тест амжилттай.
- Gateway authorization/proxy: 21 тест амжилттай.
- Production Compose: 2 тест амжилттай; preflight амжилттай.
- Assessment/portal typecheck, хоёр production image build амжилттай.
- Verification PostgreSQL integration: CRUD, nullable талбар арилгах, count, duplicate/in-use, хоёр зэрэг parent өөрчлөлт цикл үүсгэхгүй — амжилттай.
- Verification Chromium: type/root/child CRUD, description/status/parent/order/externalCode/levelKind refresh persistence, root руу шилжүүлж буцаах, focus trap/restore, Escape/dirty confirmation, expand/collapse, MN/EN, 403 — амжилттай.
- 1440px desktop болон 390px mobile screenshot нягталсан. Mobile нэр шахагдах асуудлыг зассан; horizontal overflow шалгалт давсан.
- Browser fixture-үүд зөвхөн verification-д; үүсгэсэн metadata-г цэвэрлэсэн.

## Production

Assessment → portal дарааллаар `--no-deps --no-build --pull never --wait` гаргасан. Зөвхөн хоёр контейнер дахин үүссэн; нийт 14 сервис healthy. Одоогийн 4 төрөл, 5 түвшин хэвээр. Internal GET шинэ levelCount талбартай 200 буцаасан.

NPM-ээр LAN-аас TLS certificate verification-тэй HTTPS шалгасан:

| Хүсэлт | Хариу |
|---|---|
| seek.mn/admin/metadata/audience-types, нэвтрээгүй | 307 |
| seek.mn/api/v1/assessment/questions/metadata/audience-types, нэвтрээгүй | 401 |
| quiz.seek.mn | 307 |
| quiz-api.seek.mn/health/ready | 200 |
| files.seek.mn/minio/health/ready | 200 |

Production админы credential/session өгөөгүй тул бодит production CRUD хийгээгүй. Бүрэн authenticated CRUD-ийг тусгаарласан SUPER_ADMIN-аар баталсан. LAN-аас гаднах HTTPS шалгалт хийгээгүй. Энэхүү гаргалт нь өмнөх production-readiness аудитын бусад нээлттэй асуудлыг хаахгүй.

## Нөөц ба нотолгоо

Private backup: `.production/evidence/audience-release-backup/` — өмнөх config/env, container inspect, pg_dump archive (pg_restore list-ээр шалгасан), runtime ID болон өгөгдлийн тоо.

Private evidence: `.production/evidence/audience-ui/` — desktop.png, mobile.png, browser.log, production-result.json. Test credential-ийг нийтлэхгүй.

Шинэ image-үүд:
- `/seek-portal-web-1`: `sha256:a0ee620542b1b363a033bfdbf5055a35e86d1e1660172056442a332f5ef4a215`
- `/seek-assessment-1`: `sha256:c297d16c25865170ef96aeec08b5b74f3e20489789d325a53ca3c46cfd08ec9c`

Буцаалтын tag: `seek-backend:before-audience-20260911`, `seek-portal-web:before-audience-20260911`. Зөвхөн хоёр service image override-ийг солино. Database backup-ийг автоматаар дарж сэргээхгүй.

Ашиглах болон буцаах заавар: [runbook](../runbooks/audience-management.md).
