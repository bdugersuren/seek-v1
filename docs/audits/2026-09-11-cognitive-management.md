# Cognitive framework/level — гаргалтын тайлан

2026-09-11: SUPER_ADMIN → Лавлах → Танин мэдэхүйн бүтэц цэс, `/admin/metadata/cognitive-frameworks` editor production-д гарсан.

Framework: нэр, код, тайлбар, frameworkVersion, isActive. Level: explicit cognitiveFrameworkId, parentId, нэр, код, rank, description, reportBucket, icon, isActive. Үүсгэх/засах/устгах API, optional framework filter, levelCount нэмсэн. Код/framework immutable; unique code/rank, parent scope, cycle, referenced delete хамгаалалттай. Parent validation/write Serializable transaction, conflict retry-тэй. Shared modal болон generic tree ашигласан. Legacy cognitive editor canonical editor руу чиглүүлнэ.

Migration болон production seed хийгээгүй. Одоо байгаа SUPER_ADMIN-only бодлогыг хадгалсан. Бусад context/question fallback шинэчлэл энэ ажлын хүрээнд ороогүй.

## Шалгалт

- Backend болон portal typecheck амжилттай; хоёр production build амжилттай.
- Verification PostgreSQL integration: field persistence/null clearing, framework scope, duplicate code/rank, invalid rank, missing row, referenced delete, concurrent cycle хамгаалалт давсан.
- Verification Chromium: цэс, framework/root/child CRUD, version/status/parent/rank/reportBucket refresh persistence, Escape/focus trap/restore/dirty confirmation, expand/collapse, MN/EN, 403 төлөв, mobile overflow давсан.
- Шинэ framework контекст үүсгэх form-ийн dropdown-д харагдсаныг баталсан; production context үүсгээгүй.
- Desktop/mobile screenshot нягталсан; fixture metadata-г verification-оос цэвэрлэсэн.
- Production preflight, internal cognitive GET 200 (framework/level 0 мөр), TLS verification-тэй LAN HTTPS шалгалт: шинэ page 307, нэвтрээгүй metadata API 401.
- Нийт 14 сервис healthy; зөвхөн assessment, portal-web дахин үүссэн.

Production credential/session байхгүй тул authenticated production CRUD хийгээгүй. Бүрэн CRUD-ийг verification SUPER_ADMIN-аар баталсан.

## Image ба нөөц

- `/seek-portal-web-1`: `sha256:210379483f9622de49018f37589a9a3083d99c310782c16b6be98274ef75ee25`
- `/seek-assessment-1`: `sha256:d9e0f80e88971536fcd0f7d1fbb357c838027ed3493a08562734034935c1c9cd`

Private backup: `.production/evidence/cognitive-release-backup/` — pg_dump (pg_restore list шалгасан), config/env, inspect, өмнөх runtime ID. Evidence: `.production/evidence/cognitive-ui/`.

Буцаалт болон ашиглах заавар: [runbook](../runbooks/cognitive-management.md).
