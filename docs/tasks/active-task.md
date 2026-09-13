# Production байршуулалт — 2026-09-10

Хэрэглэгч production төлөвлөгөөг хэрэгжүүлэхийг зөвшөөрсөн.

- Standalone Compose, external proxy_net, тусдаа SEEK сүлжээ.
- Нууц/TLS/seed/build/migration/readiness засвар.
- Үндсэн үнэлгээний урсгал, тусгаарласан тест, backup/restore.
- Одоо байгаа бусад workload болон volume-д хүрэхгүй.
- SMTP/NPM/гадаад backup файлын зам, admin email хүлээгдэж байна.
- Буцаалт: өмнөх SEEK image/NPM тохиргоо; destructive DB reset хийхгүй.

## Хэрэгжилтийн төлөв

- Standalone production Compose, build/migration/readiness, нууц/TLS/эрхийн хамгаалалт болон backup/restore скрипт хэрэгжсэн.
- Эцсийн image-үүд тусгаарласан орчинд healthy; API болон Chromium smoke давсан.
- Локаль өгөгдөл/файлын restore батлагдсан; remote backup хараахан идэвхжээгүй.
- Production нийтэд гаргаагүй: бодит attempt, байгууллага/tenant authorization, runtime authentication болон dependency P0 асуудлууд үлдсэн.
- SMTP/NPM/S3 тохиргооны зам, admin email хүлээгдэж байна.
- Ажил дуусаагүй тул task-ийг архивлаж хаагаагүй. Нотолгоо: docs/audits/2026-09-10-verification.md; эрэмбэлсэн аудит: docs/audits/2026-09-10-production-deployment.md.

## 502 засвар — production cutover

Хэрэглэгч эхний буюу тусдаа production `seek` stack гаргах хувилбарыг зөвшөөрсөн.
Зорилго: бэлэн NPM host-уудыг production ingress alias-уудтай холбох.
Хүрээ: production preflight, өгөгдлийн сонголт, SMTP, standalone Compose, NPM connectivity/HTTPS smoke.
Verification stack-ийн өгөгдөл болон бусад OJ/infra workload-д хүрэхгүй.
Одоогийн саад: SMTP_HOST/SMTP_USER/SMTP_PASSWORD хоосон; production шинэ сан эсвэл өгөгдөл шилжүүлэх сонголт хүлээгдэж байна.
NPM host-ууд #12–15 бэлэн; NPM token нь эдгээрийг дахин үүсгэхэд шаардлагагүй.
Дараалал: preflight → хэрэглэгчийн өгөгдөл/SMTP → migration + healthy → NPM HTTPS → auth/file E2E.
Буцаалт: зөвхөн шинээр үүсгэсэн seek app-уудыг зогсоох; volume устгахгүй; NPM бусад host-ыг өөрчлөхгүй.
Public release-ийн өмнөх P0 app асуудлууд шийдэгдээгүйг тусад нь тайлагнана.

## 2026-09-10 22:16 UTC — production stack ажилласан

Хэрэглэгч SMTP нөхөөд асаахыг зөвшөөрсөн. Preflight давсан.
`seek` project шинэ seek_* volume-уудтай ассан; verification өгөгдөл хуулаагүй.
14 сервис healthy, 6 migration exit 0. Эхний execution RabbitMQ connection startup
алдаанаас автоматаар сэргэсэн; дараагийн Compose up --wait амжилттай.
NPM дөрвөн alias resolve болсон; LAN HTTPS seek 200, quiz 307, gateway readiness 200,
MinIO readiness 200. SMTP TLS/authentication амжилттай, email илгээгээгүй.
502 засвар/stack асаах хэсэг дууссан. Үндсэн app P0, анхны admin, бүрэн E2E болон
remote backup ажлууд үлдсэн тул нийт production-readiness task-ийг хаагаагүй.

## Дууссан дэд ажил

SUPER_ADMIN/ASSESSOR үүсгэх interactive хэрэгсэл ба тест дууссан.
Архив: docs/tasks/backup/2026-09-10-role-user-provisioning.md.
Бодит аккаунтын email ирээгүй тул аккаунт үүсгээгүй. Production-readiness-ийн бусад ажил нээлттэй.

## Audience management шинэчлэлт
Зөвшөөрсөн UI/API төлөвлөгөө хэрэгжиж, тусгаарласан шалгалтууд давж, assessment/portal production-д гарсан. Demo seed болон schema өөрчлөлт хийгээгүй. Архив: docs/tasks/backup/2026-09-11-audience-management.md. Тайлан: docs/audits/2026-09-11-audience-management.md.

## Cognitive management — дууссан
2026-09-11: framework/level CRUD, мод/modal болон лавлах цэс production-д гарсан. Typecheck/build/PostgreSQL/browser/visual шалгалтууд давсан, 14 сервис healthy. Тайлан: docs/audits/2026-09-11-cognitive-management.md. Production өгөгдөл seed хийгээгүй.

## ASSESSOR контекстийн эрх — үргэлжилж байгаа
Контекстийн жагсаалт/dashboard-ийн алдааны төлөв production-д гарсан; typecheck/build/browser давсан. Тайлан: docs/audits/2026-09-11-context-error-states.md. Backend-ийн ASSESSOR эрх нээгдээгүй: оноосон контекст эсвэл нийтийн идэвхтэй контекст гэсэн хандалтын дүрэм тодорхойлох шаардлагатай. Бүрэн authorization засвар дуусаагүй.

## ASSESSOR контекстийн оноолт — дууссан (2026-09-12)
Хэрэглэгч оноосон контекстийн хувилбарыг зөвшөөрсөн. Оноох/цуцлах UI/API, scoped metadata ба өөрийн материалын CRUD, gateway/backend эрхийн шалгалт production-д гарсан. Migration/typecheck/build/29 gateway tests/API/browser шалгалт давсан; 14 сервис healthy. Production автомат оноолт хийгээгүй; админ UI-аас бодит хэрэглэгчид онооно. Архив: docs/tasks/backup/2026-09-12-assessor-context-access.md.


## 2026-09-12 ASSESSOR draft creation
Completed: initial modal 400 fixed with explicit draft context ownership, metadata loader and approval submission corrected. Isolated API/browser verification passed; assessment and portal deployed, all 14 production services healthy. See docs/audits/2026-09-12-question-draft.md.

## 2026-09-12 Question review workflow implementation
1. Complete: version/revision locks, canonical transitions, authenticated audit and submit validation.
2. Complete: immutable published classification snapshots and quiz publication gate.
3. Complete: reviewer queue/detail, author read-only/rework/new-version UI and in-app decision notifications.
4. Complete: 15 workflow unit tests, 29 gateway tests, 2 compose tests, real API/browser lifecycle/concurrency/permission/mobile checks; production backup, tested restore/migration and deployment. All 14 production services healthy. See docs/audits/2026-09-12-question-review-implementation.md.
Reference: docs/audits/2026-09-12-question-review-workflow-analysis.md.


## 2026-09-12 — Blueprint deletion completed
- General and context blueprint card/table deletion with confirmation and duplicate-submit protection.
- Quiz/revision-linked templates return 409; question bank content remains intact.
- Assessment/portal typechecks, 5 service tests, isolated API and browser regression passed.
- Production deployed: assessment `seek-backend:blueprint-delete-20260912`, portal `seek-portal-web:blueprint-delete-complete-20260912`. Only these two services replaced; all 14 healthy.
- Backup/evidence: `.production/evidence/blueprint-deletion/`; no migration or production test data.
- Instructions: `docs/runbooks/blueprint-deletion.md`.


## 2026-09-12 — Candidate production workflow (complete)
Objective: implement audit C01–C17 for assigned assessments.
Stages: [x] transactional runtime and regression; [x] assignment/materialization/auth; [x] candidate UI and honest states; [x] grading/release; [x] integration/accessibility; [x] backup and targeted production rollout.
Policies: server-owned deadlines; no late offline answer replacement; immutable published question snapshots; disabled ancillary providers show unavailable, never demo success. Preserve all previous review/blueprint changes.
Validation: 24 execution tests, 39 gateway tests, production builds/typechecks, PostgreSQL concurrency/integrity workflow and browser assignment/start/save/reload/submit/release/mobile flow passed. Production backup: `.production/evidence/candidate-workflow/production-before-20260912-0655`; five targeted services deployed and healthy. Production test data was not inserted.

## 2026-09-12 — Question bank сайжруулалт — дууссан
Зөвшөөрсөн өөрчлөлтүүд хэрэгжиж, 82 тест болон API/browser шалгалт давсан. Нөөцөөс сэргээхийг шалгаж дөрвөн сервисийг production-д шинэчилсэн; 14 сервис healthy.
Архив: docs/tasks/backup/2026-09-12-question-bank.md.
Тайлан: docs/audits/2026-09-12-question-bank.md.

## 2026-09-12 — Results интерактив жишиг тайлан — дууссан
13 төрөл, хоёр өнцөг, гурван таб, нэгдсэн тооцоолол, URL/print хэрэгжив. 8 regression тест, typecheck/build, final browser шалгалт давсан. Portal-only production rollout дууссан; 14 сервис healthy. Архив: docs/tasks/backup/2026-09-12-results-demo.md. Тайлан/screenshot: docs/audits/2026-09-12-results-demo.md.

## 2026-09-13 — Blueprint бүрэн урсгал — дууссан
Хадгалалт, хоёр горимын сан, readiness, давхардалгүй Quiz snapshot, UI хэрэгжив. 55 тест, typecheck/build, PostgreSQL/browser, runtime regression тэнцсэн. Нөөцөөс сэргээх migration шалгаж assessment/gateway/portal production rollout дууссан; 14 сервис healthy.
Архив: docs/tasks/backup/2026-09-13-blueprint-pools.md. Тайлан/screenshot: docs/audits/2026-09-13-blueprint-pools.md.

## 2026-09-13 — Quiz бэлтгэх, батлах, нийтлэх — дууссан
Бодит editor, snapshot/version lock, тусдаа SUPER_ADMIN workflow хэрэгжив. 77 тест, PostgreSQL/browser, typecheck/build, нөөцөөс сэргээх migration болон production rollout тэнцсэн; бүх 14 сервис healthy.
Архив: docs/tasks/backup/2026-09-13-quiz-workflow.md. Тайлан/screenshot: docs/audits/2026-09-13-quiz-workflow.md.

Идэвхтэй үлдсэн ажилгүй.

## 2026-09-13 — Хуваарь нийтлэх алдаа (зөвшөөрсөн)
Давхардсан publish маршрут, буруу enum-ийг арилгах; HTTP/browser regression; assessment-only rollout.
