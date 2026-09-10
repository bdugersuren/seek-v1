# SEEK production deployment аудит — 2026-09-10

## Шийдвэр

**Одоогоор интернетэд нээлттэй production гаргалт хийхгүй.** Infrastructure засвар, production image build болон тусгаарласан verification хийгдсэн. Платформын үндсэн үнэлгээний runtime болон байгууллагын боломжид тохиргооноос давсан дутуу хэрэгжүүлэлт байна. Энэ тайлан бүрэн penetration test эсвэл ачааллын баталгаа биш.

## Зассан зүйлс

- Standalone production Compose: өөрийн NPM/installer/source mount/host port байхгүй; external `proxy_net`-д зөвхөн ingress-ийн дөрвөн үйлчилгээ.
- Заавал өгөх DB/cache/queue/storage/JWT/KMS нууцууд; JWT/unwrap key логийг арилгасан; secure cookie domain болон seek.mn email холбоос.
- TLS verification disable-ийг production config-оос арилгасан. File storage initialization/public endpoint алдахад production startup амжилттай мэт үргэлжлэхгүй.
- Node 22 image digest, pnpm 9.5.0, frozen lockfile; startup-ээс Prisma generate/install/seed-ийг салгаж, зургаан migration job нэмсэн.
- PostgreSQL auth host засвар; assessment/execution-ийн migration-д ороогүй schema drift-ийг өгөгдөл хадгалсан migration-аар нөхсөн. Catalog дээрх бодит HTTP 500 шалтгааныг илрүүлж зассан.
- DB/MinIO-ийг шалгадаг Docker readiness, log rotation, restart/resource тохиргоо. RabbitMQ холболт алдагдахад чимээгүй log-only горимд орохгүй, worker restart хийж consumer-ээ дахин байгуулна.
- Production-д demo attempt/database explorer/SMS mock амжилтыг хаасан. Attempt owner guard нэмсэн. Tenant authorization бүрэн болтол authoring/profile admin/private-file admin хандалтыг SUPER_ADMIN-д хязгаарласан.
- Portal-ийн DTO/type зөрүү, дутсан Markdown/Mermaid dependency, Mermaid strict rendering болон аюултай error HTML-ийг зассан. TypeScript алдааг үл тоох тохиргоог унтраасан.
- Backup, isolated restore checker, timer болон NPM/runbook бэлтгэсэн. Идэвхжүүлээгүй хэсгийг доор ялгав.

## P0 — нийтэд гаргахаас өмнө

| Асуудал | Нотолгоо, нөлөө | Шаардлагатай үр дүн |
|---|---|---|
| Бодит үнэлгээ эхлүүлэх урсгал дутуу | Execution createAttempt нь static assessment list, candidate-001, mock question/payload ашигладаг. Production-д 503 болгож хориглосон. | Published schedule/assignment eligibility → authenticated candidate → immutable question snapshot → attempt, autosave/submit/result-ийг E2E батлах. |
| Байгууллагын үйлчилгээ scaffold | organisation зөвхөн health endpoint-той; authoring controller-уудын tenant/owner эрхийн бүрэн шалгалт байхгүй. | Байгууллага/гишүүнчлэл/RBAC болон tenant scoped authoring, profile, file policy. Түр SUPER_ADMIN хязгаарлалт нь бүрэн шийдэл биш. |
| Dependency vulnerabilities | Шинэ lockfile audit: 2 critical, 18 high, 23 moderate, 4 low. Next.js 14.2.35, Nest/Multer зэрэгт advisory байна. Audit count нь exploitation баталгаа биш; Next-ийн Windows-only advisory энэ Linux серверт шууд адил нөхцөлтэй биш. | Дэмжигдсэн patched Next/Nest/Multer хувилбар руу compatibility migration хийж дахин audit/build/E2E; critical/high үлдэхгүй эсвэл нотолгоотой applicability шийдвэр. |
| Runtime transport authentication дутуу | assessment-web HTTP adapter/SSE нь шинэ owner guard-д шаардлагатай bearer identity-г бүрэн дамжуулахгүй. | Refresh/session → runtime token эсвэл scoped launch/SSE ticket урсгал, expiry/revocation ба replay тест. URL-д урт настай токен хийхгүй. |
| Нууц Git history-д орсон | root/certs PEM private keys болон docker/nginx-proxy/data/database.sqlite tracked. | Эдгээрийг production-д ашиглахгүй; хэрэглэсэн бол rotate. Git history цэвэрлэгээ нь тусдаа хяналттай үйлдэл. Build context-оос хассан. |

## P1 — ажиллагаа ба бүтээгдэхүүний үнэн зөв байдал

- SMS нийлүүлэгч mock; утас баталгаажуулалтын production урсгал 503. Бодит provider, rate limit, delivery/error handling хэрэгтэй.
- Reporting/evaluation/commerce/notification/AI зэрэг нэмэлт модуль идэвхгүй. Зарим frontend result/dashboard нь mock өгөгдөлтэй; бодит тайлан гэж харуулахгүй болгох, эсвэл service contract-оор холбох шаардлагатай.
- Gateway-д идэвхгүй модуль 503; payments/wallet/notifications UI route-уудыг production flag-аар хаасан. Энэ нь бүх mock UI-г бүрэн арилгасан гэсэн үг биш.
- Portal lint-д 105 асуудал (80 error/25 warning) илэрсэн; TypeScript болон build давсан нь lint gate давсан гэсэн үг биш. Ихэнх нь unused code/hook dependencies; тусад нь цэвэрлэж бүх lint-ийг дахин ажиллуулах.
- RabbitMQ publisher confirm нэмсэн ч өгөгдлийн transaction + outbox publish atomicity/retry-ийг бүрэн батлаагүй. Хүлээн авсан submit event алдагдахгүй recovery баталгаа шаардлагатай.
- Backup скрипт бэлтгэсэн; remote credential, timer activation болон жинхэнэ restore drill хүлээгдэж байна. Volume бол backup биш.
- API/DB бүх endpoint-ийн tenant authorization, файл хэмжээ/төрөл/малваре шалгалт, ачаалал, monitoring/alert болон DR тест бүрэн хийгдээгүй.

## Сервер ба гадаад тохиргоо

- `infra-npm` болон external `proxy_net` байгаа нь батлагдсан. NPM-ийн admin порт 10.10.10.6:81 дээр, одоогийн бусад workload-д хүрээгүй.
- Анхны DNS шалгалтаар seek.mn → 103.119.92.124; quiz/quiz-api/files host-ууд resolve болоогүй. Дахин шалгаж шаардлагатай DNS record-уудыг бэлтгэнэ.
- SMTP credential, NPM API/UI access, backup S3 endpoint/credential болон анхны admin email-ийн файлын зам ирээгүй.
- `.env.production` нь 0600 эрхтэй, шинээр үүсгэсэн тусдаа нууцуудтай; SMTP талбарууд зориуд хоосон бөгөөд production Compose fail-closed.
- Verification stack тусдаа `seek-verify_backend`/volumes дээр, host port болон proxy_net холболтгүй. NPM host, public TLS, production stack-ийг өөрчлөөгүй.
- Дискний сул зай бага: анх 12 GB орчим, build үед багассан. Хуучин cache цэвэрлэсэн; бусад workload-ийн image/volume устгаагүй. Production өгөгдлийн өсөлтөд диск өргөтгөх шаардлагатай.

## Баталгаажуулалт

Шалгалтын эцсийн үр дүнг `docs/audits/2026-09-10-verification.md`-д тусад нь бүртгэнэ. Public HTTPS, бодит assessment lifecycle болон remote restore хийгдээгүй байхад production амжилттай гэж тайлагнахгүй.
